import {TypescriptFile} from "../framework/typescript-file";
import * as ts from "typescript";
import * as rpc from "@protobuf-ts/runtime-rpc";
import {CommentGenerator} from "./comment-generator";
import {createLocalTypeName} from "./local-type-name";
import {assert} from "@protobuf-ts/runtime";
import {Interpreter} from "../interpreter";
import {DescService, FileRegistry} from "@bufbuild/protobuf";
import {TypeScriptImports} from "../framework/typescript-imports";
import {SymbolTable} from "../framework/symbol-table";


export abstract class ServiceClientGeneratorBase {


    abstract readonly symbolKindInterface: string;
    abstract readonly symbolKindImplementation: string;


    constructor(
        private readonly symbols: SymbolTable,
        protected readonly registry: FileRegistry,
        protected readonly imports: TypeScriptImports,
        protected readonly comments: CommentGenerator,
        protected readonly interpreter: Interpreter,
        protected readonly options: {
            runtimeImportPath: string;
            runtimeRpcImportPath: string;
        },
    ) {
    }


    registerSymbols(source: TypescriptFile, descService: DescService): void {
        const basename = createLocalTypeName(descService);
        const interfaceName = `I${basename}Client`;
        const implementationName = `${basename}Client`;
        this.symbols.register(interfaceName, descService, source, this.symbolKindInterface);
        this.symbols.register(implementationName, descService, source, this.symbolKindImplementation);
    }


    /**
     * For the following .proto:
     *
     *   service SimpleService {
     *     rpc Get (GetRequest) returns (GetResponse);
     *   }
     *
     * We generate the following interface:
     *
     *   interface ISimpleServiceClient {
     *     get(request: GetRequest, options?: RpcOptions): UnaryCall<ExampleRequest, ExampleResponse>;
     *   }
     *
     */
    generateInterface(source: TypescriptFile, descService: DescService): ts.InterfaceDeclaration {
        const
            interpreterType = this.interpreter.getServiceType(descService),
            IServiceClient = this.imports.type(source, descService, this.symbolKindInterface),
            signatures: ts.MethodSignature[] = [];


        for (let mi of interpreterType.methods) {
            const sig = this.createMethodSignatures(source, mi);

            // add comment to the first signature
            if (sig.length > 0) {
                const descMethod = descService.methods.find(descMethod => descMethod.name === mi.name);
                assert(descMethod);
                this.comments.addCommentsForDescriptor(sig[0], descMethod, 'appendToLeadingBlock');
            }

            signatures.push(...sig);
        }

        // export interface MyService {...
        let statement = ts.factory.createInterfaceDeclaration(
            [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
            IServiceClient, undefined, undefined, [...signatures]
        );

        // add to our file
        this.comments.addCommentsForDescriptor(statement, descService, 'appendToLeadingBlock');
        source.addStatement(statement);

        return statement;
    }


    protected createMethodSignatures(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodSignature[] {
        let signatures: ts.MethodSignature[];
        if (methodInfo.serverStreaming && methodInfo.clientStreaming) {
            signatures = this.createDuplexStreamingSignatures(source, methodInfo);
        } else if (methodInfo.serverStreaming) {
            signatures = this.createServerStreamingSignatures(source, methodInfo);
        } else if (methodInfo.clientStreaming) {
            signatures = this.createClientStreamingSignatures(source, methodInfo);
        } else {
            signatures = this.createUnarySignatures(source, methodInfo);
        }
        return signatures;
    }

    protected createUnarySignatures(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodSignature[] {
        const method = this.createUnary(source, methodInfo);
        return [ts.factory.createMethodSignature(
            method.modifiers as ts.MethodSignature['modifiers'],
            method.name,
            method.questionToken,
            method.typeParameters,
            method.parameters,
            method.type
        )];
    }

    protected createServerStreamingSignatures(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodSignature[]{
        const method = this.createServerStreaming(source, methodInfo);
        return [ts.factory.createMethodSignature(
            method.modifiers as ts.MethodSignature['modifiers'],
            method.name,
            method.questionToken,
            method.typeParameters,
            method.parameters,
            method.type
        )];
    }

    protected createClientStreamingSignatures(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodSignature[]{
        const method = this.createClientStreaming(source, methodInfo);
        return [ts.factory.createMethodSignature(
            method.modifiers as ts.MethodSignature['modifiers'],
            method.name,
            method.questionToken,
            method.typeParameters,
            method.parameters,
            method.type
        )];
    }

    protected createDuplexStreamingSignatures(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodSignature[]{
        const method = this.createDuplexStreaming(source, methodInfo);
        return [ts.factory.createMethodSignature(
            method.modifiers as ts.MethodSignature['modifiers'],
            method.name,
            method.questionToken,
            method.typeParameters,
            method.parameters,
            method.type
        )];
    }


    /**
     * For the following .proto:
     *
     *   service SimpleService {
     *     rpc Get (GetRequest) returns (GetResponse);
     *   }
     *
     * We generate:
     *
     *   class SimpleService implements ISimpleService {
     *     readonly typeName = ".spec.SimpleService";
     *     readonly methods: MethodInfo[] = [
     *       {name: 'Get', localName: 'get', I: GetRequest, O: GetResponse}
     *     ];
     *     ...
     *   }
     *
     */
    generateImplementationClass(source: TypescriptFile, descService: DescService): ts.ClassDeclaration {
        const
            interpreterType = this.interpreter.getServiceType(descService),
            ServiceType = this.imports.type(source, descService),
            ServiceClient = this.imports.type(source, descService, this.symbolKindImplementation),
            IServiceClient = this.imports.type(source, descService, this.symbolKindInterface),
            ServiceInfo = this.imports.name(source, 'ServiceInfo', this.options.runtimeRpcImportPath, true),
            RpcTransport = this.imports.name(source, 'RpcTransport', this.options.runtimeRpcImportPath, true);

        const classDecorators: ts.Decorator[] = [];
        const constructorDecorators: ts.Decorator[] = [];
        const members: ts.ClassElement[] = [

            // typeName = Haberdasher.typeName;
            ts.factory.createPropertyDeclaration(
                undefined, ts.factory.createIdentifier("typeName"),
                undefined, undefined, ts.factory.createPropertyAccessExpression(
                    ts.factory.createIdentifier(ServiceType),
                    ts.factory.createIdentifier("typeName")
                )
            ),

            // methods = Haberdasher.methods;
            ts.factory.createPropertyDeclaration(
                undefined, ts.factory.createIdentifier("methods"),
                undefined, undefined, ts.factory.createPropertyAccessExpression(
                    ts.factory.createIdentifier(ServiceType),
                    ts.factory.createIdentifier("methods")
                )
            ),

            // options = Haberdasher.options;
            ts.factory.createPropertyDeclaration(
                undefined, ts.factory.createIdentifier("options"),
                undefined, undefined, ts.factory.createPropertyAccessExpression(
                    ts.factory.createIdentifier(ServiceType),
                    ts.factory.createIdentifier("options")
                )
            ),

            // constructor(@Inject(RPC_TRANSPORT) private readonly _transport: RpcTransport) {}
            ts.factory.createConstructorDeclaration(
                undefined,
                [ts.factory.createParameterDeclaration(
                    [
                        ts.factory.createModifier(ts.SyntaxKind.PrivateKeyword),
                        ts.factory.createModifier(ts.SyntaxKind.ReadonlyKeyword),
                        ...constructorDecorators,
                    ],
                    undefined, ts.factory.createIdentifier("_transport"), undefined,
                    ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(RpcTransport), undefined),
                    undefined
                )],
                ts.factory.createBlock([], true)
            ),


            ...interpreterType.methods.map(mi => {
                const declaration = this.createMethod(source, mi);
                const descMethod = descService.methods.find(descMethod => descMethod.name === mi.name);
                assert(descMethod);
                this.comments.addCommentsForDescriptor(declaration, descMethod, 'appendToLeadingBlock');
                return declaration;
            })

        ];

        // export class MyService implements MyService, ServiceInfo
        const statement = ts.factory.createClassDeclaration(
            [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword), ...classDecorators],
            ServiceClient,
            undefined,
            [
                ts.factory.createHeritageClause(ts.SyntaxKind.ImplementsKeyword, [
                    ts.factory.createExpressionWithTypeArguments(ts.factory.createIdentifier(IServiceClient), undefined),
                    ts.factory.createExpressionWithTypeArguments(ts.factory.createIdentifier(ServiceInfo), undefined),
                ]),
            ],
            members
        );

        source.addStatement(statement);
        this.comments.addCommentsForDescriptor(statement, descService, 'appendToLeadingBlock');
        return statement;
    }


    /**
     * Create any method type, switching to specific methods.
     */
    protected createMethod(source: TypescriptFile, methodInfo: rpc.MethodInfo) {
        let declaration: ts.MethodDeclaration;
        if (methodInfo.serverStreaming && methodInfo.clientStreaming) {
            declaration = this.createDuplexStreaming(source, methodInfo);
        } else if (methodInfo.serverStreaming) {
            declaration = this.createServerStreaming(source, methodInfo);
        } else if (methodInfo.clientStreaming) {
            declaration = this.createClientStreaming(source, methodInfo);
        } else {
            declaration = this.createUnary(source, methodInfo);
        }
        return declaration;
    }


    protected abstract createUnary(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodDeclaration;

    protected abstract createServerStreaming(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodDeclaration;

    protected abstract createClientStreaming(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodDeclaration;

    protected abstract createDuplexStreaming(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodDeclaration;


    protected makeI(source: TypescriptFile, methodInfo: rpc.MethodInfo, isTypeOnly = false): ts.TypeReferenceNode {
        return ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(this.imports.typeByName(source,
            methodInfo.I.typeName,
            'default',
            isTypeOnly
        )), undefined);
    }

    protected makeO(source: TypescriptFile, methodInfo: rpc.MethodInfo, isTypeOnly = false): ts.TypeReferenceNode {
        return ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(this.imports.typeByName(source,
            methodInfo.O.typeName,
            'default',
            isTypeOnly
        )), undefined);
    }

}

