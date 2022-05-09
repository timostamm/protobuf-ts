import {
    DescriptorRegistry,
    ServiceDescriptorProto,
    SymbolTable,
    TypescriptFile,
    TypeScriptImports
} from "@chippercash/protobuf-plugin-framework";
import * as ts from "typescript";
import * as rpc from "@chippercash/protobuf-runtime-rpc";
import {CommentGenerator} from "./comment-generator";
import {Interpreter} from "../interpreter";
import {GeneratorBase} from "./generator-base";
import {createLocalTypeName} from "./local-type-name";
import {assert} from "@chippercash/protobuf-runtime";


export abstract class ServiceClientGeneratorBase extends GeneratorBase {


    abstract readonly symbolKindInterface: string;
    abstract readonly symbolKindImplementation: string;


    constructor(symbols: SymbolTable, registry: DescriptorRegistry, imports: TypeScriptImports, comments: CommentGenerator, interpreter: Interpreter,
                protected readonly options: {
                    runtimeImportPath: string;
                    runtimeRpcImportPath: string;
                    angularCoreImportPath: string;
                    emitAngularAnnotations: boolean;
                    runtimeAngularImportPath: string;
                }) {
        super(symbols, registry, imports, comments, interpreter);
    }


    registerSymbols(source: TypescriptFile, descriptor: ServiceDescriptorProto): void {
        const basename = createLocalTypeName(descriptor, this.registry);
        const interfaceName = `I${basename}Client`;
        const implementationName = `${basename}Client`;
        this.symbols.register(interfaceName, descriptor, source, this.symbolKindInterface);
        this.symbols.register(implementationName, descriptor, source, this.symbolKindImplementation);
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
    generateInterface(source: TypescriptFile, descriptor: ServiceDescriptorProto): ts.InterfaceDeclaration {
        const
            interpreterType = this.interpreter.getServiceType(descriptor),
            IServiceClient = this.imports.type(source, descriptor, this.symbolKindInterface),
            signatures: ts.MethodSignature[] = [];


        for (let mi of interpreterType.methods) {
            const sig = this.createMethodSignatures(source, mi);

            // add comment to the first signature
            if (sig.length > 0) {
                const methodDescriptor = descriptor.method.find(md => md.name === mi.name);
                assert(methodDescriptor);
                this.comments.addCommentsForDescriptor(sig[0], methodDescriptor, 'appendToLeadingBlock');
            }

            signatures.push(...sig);
        }

        // export interface MyService {...
        let statement = ts.createInterfaceDeclaration(
            undefined, [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
            IServiceClient, undefined, undefined, [...signatures]
        );

        // add to our file
        this.comments.addCommentsForDescriptor(statement, descriptor, 'appendToLeadingBlock');
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
    generateImplementationClass(source: TypescriptFile, descriptor: ServiceDescriptorProto): ts.ClassDeclaration {
        const
            interpreterType = this.interpreter.getServiceType(descriptor),
            ServiceType = this.imports.type(source, descriptor),
            ServiceClient = this.imports.type(source, descriptor, this.symbolKindImplementation),
            IServiceClient = this.imports.type(source, descriptor, this.symbolKindInterface),
            ServiceInfo = this.imports.name(source, 'ServiceInfo', this.options.runtimeRpcImportPath, true),
            RpcTransport = this.imports.name(source, 'RpcTransport', this.options.runtimeRpcImportPath, true);

        const classDecorators: ts.Decorator[] = [];
        if (this.options.emitAngularAnnotations) {
            let Injectable = this.imports.name(source, 'Injectable', this.options.angularCoreImportPath);
            classDecorators.push(
                ts.createDecorator(ts.createCall(
                    ts.createIdentifier(Injectable), undefined, []
                ))
            );
        }

        const constructorDecorators: ts.Decorator[] = [];
        if (this.options.emitAngularAnnotations) {
            let RPC_TRANSPORT = this.imports.name(source, 'RPC_TRANSPORT', this.options.runtimeAngularImportPath);
            let Inject = this.imports.name(source, 'Inject', this.options.angularCoreImportPath);
            constructorDecorators.push(
                ts.createDecorator(ts.createCall(
                    ts.createIdentifier(Inject),
                    undefined,
                    [
                        ts.createIdentifier(RPC_TRANSPORT)
                    ]
                ))
            );
        }

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
                const methodDescriptor = descriptor.method.find(md => md.name === mi.name);
                assert(methodDescriptor);
                this.comments.addCommentsForDescriptor(declaration, methodDescriptor, 'appendToLeadingBlock');
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
        this.comments.addCommentsForDescriptor(statement, descriptor, 'appendToLeadingBlock');
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
            this.registry.resolveTypeName(methodInfo.I.typeName),
            'default',
            isTypeOnly
        )), undefined);
    }

    protected makeO(source: TypescriptFile, methodInfo: rpc.MethodInfo, isTypeOnly = false): ts.TypeReferenceNode {
        return ts.createTypeReferenceNode(ts.createIdentifier(this.imports.type(source,
            this.registry.resolveTypeName(methodInfo.O.typeName),
            'default',
            isTypeOnly
        )), undefined);
    }

}
