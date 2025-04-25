import {
    DescriptorRegistry,
    SymbolTable,
    TypescriptFile,
    TypeScriptImports
} from "@protobuf-ts/plugin-framework";
import * as ts from "typescript";
import * as rpc from "@protobuf-ts/runtime-rpc";
import {CommentGenerator} from "./comment-generator";
import {createLocalTypeName} from "./local-type-name";
import {assert} from "@protobuf-ts/runtime";
import {Interpreter} from "../interpreter";
import {DescService} from "@bufbuild/protobuf";


export abstract class ServiceClientGeneratorBase {


    abstract readonly symbolKindInterface: string;
    abstract readonly symbolKindImplementation: string;


    constructor(
        private readonly symbols: SymbolTable,
        protected readonly legacyRegistry: DescriptorRegistry,
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
        const legacyDescriptor = this.legacyRegistry.resolveTypeName(descService.typeName);
        this.symbols.register(interfaceName, legacyDescriptor, source, this.symbolKindInterface);
        this.symbols.register(implementationName, legacyDescriptor, source, this.symbolKindImplementation);
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
        const legacyDescriptor = this.legacyRegistry.resolveTypeName(descService.typeName);
        const
            interpreterType = this.interpreter.getServiceType(descService),
            IServiceClient = this.imports.type(source, legacyDescriptor, this.symbolKindInterface),
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
        let statement = ts.createInterfaceDeclaration(
            undefined, [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
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
        return [ts.createMethodSignature(
            method.typeParameters,
            method.parameters,
            method.type,
            method.name,
            method.questionToken
        )];
    }

    protected createServerStreamingSignatures(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodSignature[]{
        const method = this.createServerStreaming(source, methodInfo);
        return [ts.createMethodSignature(
            method.typeParameters,
            method.parameters,
            method.type,
            method.name,
            method.questionToken
        )];
    }

    protected createClientStreamingSignatures(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodSignature[]{
        const method = this.createClientStreaming(source, methodInfo);
        return [ts.createMethodSignature(
            method.typeParameters,
            method.parameters,
            method.type,
            method.name,
            method.questionToken
        )];
    }

    protected createDuplexStreamingSignatures(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodSignature[]{
        const method = this.createDuplexStreaming(source, methodInfo);
        return [ts.createMethodSignature(
            method.typeParameters,
            method.parameters,
            method.type,
            method.name,
            method.questionToken
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
        const legacyDescriptor = this.legacyRegistry.resolveTypeName(descService.typeName);
        const
            interpreterType = this.interpreter.getServiceType(descService),
            ServiceType = this.imports.type(source, legacyDescriptor),
            ServiceClient = this.imports.type(source, legacyDescriptor, this.symbolKindImplementation),
            IServiceClient = this.imports.type(source, legacyDescriptor, this.symbolKindInterface),
            ServiceInfo = this.imports.name(source, 'ServiceInfo', this.options.runtimeRpcImportPath, true),
            RpcTransport = this.imports.name(source, 'RpcTransport', this.options.runtimeRpcImportPath, true);

        const classDecorators: ts.Decorator[] = [];
        const constructorDecorators: ts.Decorator[] = [];
        const members: ts.ClassElement[] = [

            // typeName = Haberdasher.typeName;
            ts.createProperty(
                undefined, undefined, ts.createIdentifier("typeName"),
                undefined, undefined, ts.createPropertyAccess(
                    ts.createIdentifier(ServiceType),
                    ts.createIdentifier("typeName")
                )
            ),

            // methods = Haberdasher.methods;
            ts.createProperty(
                undefined, undefined, ts.createIdentifier("methods"),
                undefined, undefined, ts.createPropertyAccess(
                    ts.createIdentifier(ServiceType),
                    ts.createIdentifier("methods")
                )
            ),

            // options = Haberdasher.options;
            ts.createProperty(
                undefined, undefined, ts.createIdentifier("options"),
                undefined, undefined, ts.createPropertyAccess(
                    ts.createIdentifier(ServiceType),
                    ts.createIdentifier("options")
                )
            ),

            // constructor(@Inject(RPC_TRANSPORT) private readonly _transport: RpcTransport) {}
            ts.createConstructor(
                undefined, undefined,
                [ts.createParameter(
                    constructorDecorators,
                    [
                        ts.createModifier(ts.SyntaxKind.PrivateKeyword),
                        ts.createModifier(ts.SyntaxKind.ReadonlyKeyword)
                    ],
                    undefined, ts.createIdentifier("_transport"), undefined,
                    ts.createTypeReferenceNode(ts.createIdentifier(RpcTransport), undefined),
                    undefined
                )],
                ts.createBlock([], true)
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
        const statement = ts.createClassDeclaration(
            classDecorators,
            [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
            ServiceClient,
            undefined,
            [
                ts.createHeritageClause(ts.SyntaxKind.ImplementsKeyword, [
                    ts.createExpressionWithTypeArguments(undefined, ts.createIdentifier(IServiceClient)),
                    ts.createExpressionWithTypeArguments(undefined, ts.createIdentifier(ServiceInfo)),
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
        return ts.createTypeReferenceNode(ts.createIdentifier(this.imports.type(source,
            this.legacyRegistry.resolveTypeName(methodInfo.I.typeName),
            'default',
            isTypeOnly
        )), undefined);
    }

    protected makeO(source: TypescriptFile, methodInfo: rpc.MethodInfo, isTypeOnly = false): ts.TypeReferenceNode {
        return ts.createTypeReferenceNode(ts.createIdentifier(this.imports.type(source,
            this.legacyRegistry.resolveTypeName(methodInfo.O.typeName),
            'default',
            isTypeOnly
        )), undefined);
    }

}

