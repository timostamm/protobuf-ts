import {
    DescriptorRegistry,
    ServiceDescriptorProto,
    TypescriptFile,
    TypescriptImportManager
} from "@protobuf-ts/plugin-framework";
import * as ts from "typescript";
import * as rpc from "@protobuf-ts/runtime-rpc";
import {CommentGenerator} from "./comment-generator";
import {Interpreter} from "../interpreter";
import assert = require("assert");


export abstract class ServiceClientGeneratorBase {


    // TODO #8 make style a public property of client? add "style" to reserved name in Interpreter.createTypescriptNameForMethod and add to name-clash-proto

    abstract readonly style: rpc.ClientStyle;
    protected readonly commentGenerator: CommentGenerator;


    constructor(
        protected readonly registry: DescriptorRegistry,
        protected readonly imports: TypescriptImportManager,
        protected readonly interpreter: Interpreter,
        protected readonly options: {
            runtimeRpcImportPath: string;
            angularCoreImportPath: string;
            emitAngularAnnotations: boolean;
            runtimeAngularImportPath: string;
        },
    ) {
        this.commentGenerator = new CommentGenerator(this.registry);
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
    generateInterface(descriptor: ServiceDescriptorProto, source: TypescriptFile): ts.InterfaceDeclaration {
        const
            interpreterType = this.interpreter.getServiceType(descriptor),
            styleName = rpc.ClientStyle[this.style].toLowerCase(),
            IServiceClient = this.imports.type(descriptor, `${styleName}-client-interface`);

        const methods = interpreterType.methods.map(mi => {
            const declaration = this.createMethod(mi);
            const signature = ts.createMethodSignature(
                declaration.typeParameters,
                declaration.parameters,
                declaration.type,
                declaration.name,
                declaration.questionToken
            );
            const methodDescriptor = descriptor.method.find(md => md.name === mi.name);
            assert(methodDescriptor);
            this.commentGenerator.addCommentsForDescriptor(signature, methodDescriptor, 'appendToLeadingBlock');
            return signature;
        });

        // export interface MyService {...
        let statement = ts.createInterfaceDeclaration(
            undefined, [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
            IServiceClient, undefined, undefined, [...methods]
        );

        // add to our file
        this.commentGenerator.addCommentsForDescriptor(statement, descriptor, 'appendToLeadingBlock');
        source.addStatement(statement);
        return statement;
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
    generateImplementationClass(descriptor: ServiceDescriptorProto, source: TypescriptFile): ts.ClassDeclaration {
        const
            interpreterType = this.interpreter.getServiceType(descriptor),
            styleName = rpc.ClientStyle[this.style].toLowerCase(),
            ServiceType = this.imports.type(descriptor),
            ServiceClient = this.imports.type(descriptor, `${styleName}-client`),
            IServiceClient = this.imports.type(descriptor, `${styleName}-client-interface`),
            ServiceInfo = this.imports.name('ServiceInfo', this.options.runtimeRpcImportPath),
            RpcTransport = this.imports.name('RpcTransport', this.options.runtimeRpcImportPath);

        const classDecorators: ts.Decorator[] = [];
        if (this.options.emitAngularAnnotations) {
            let Injectable = this.imports.name('Injectable', this.options.angularCoreImportPath);
            classDecorators.push(
                ts.createDecorator(ts.createCall(
                    ts.createIdentifier(Injectable), undefined, []
                ))
            );
        }

        const constructorDecorators: ts.Decorator[] = [];
        if (this.options.emitAngularAnnotations) {
            let RPC_TRANSPORT = this.imports.name('RPC_TRANSPORT', this.options.runtimeAngularImportPath);
            let Inject = this.imports.name('Inject', this.options.angularCoreImportPath);
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
                const declaration = this.createMethod(mi);
                const methodDescriptor = descriptor.method.find(md => md.name === mi.name);
                assert(methodDescriptor);
                this.commentGenerator.addCommentsForDescriptor(declaration, methodDescriptor, 'appendToLeadingBlock');
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
        this.commentGenerator.addCommentsForDescriptor(statement, descriptor, 'appendToLeadingBlock');
        return statement;
    }


    /**
     * Create any method type, switching to specific methods.
     */
    protected createMethod(methodInfo: rpc.MethodInfo) {
        let declaration: ts.MethodDeclaration;
        if (methodInfo.serverStreaming && methodInfo.clientStreaming) {
            declaration = this.createDuplexStreaming(methodInfo);
        } else if (methodInfo.serverStreaming) {
            declaration = this.createServerStreaming(methodInfo);
        } else if (methodInfo.clientStreaming) {
            declaration = this.createClientStreaming(methodInfo);
        } else {
            declaration = this.createUnary(methodInfo);
        }
        return declaration;
    }


    protected abstract createUnary(methodInfo: rpc.MethodInfo): ts.MethodDeclaration;

    protected abstract createServerStreaming(methodInfo: rpc.MethodInfo): ts.MethodDeclaration;

    protected abstract createClientStreaming(methodInfo: rpc.MethodInfo): ts.MethodDeclaration;

    protected abstract createDuplexStreaming(methodInfo: rpc.MethodInfo): ts.MethodDeclaration;


    protected makeI(methodInfo: rpc.MethodInfo): ts.TypeReferenceNode {
        return ts.createTypeReferenceNode(ts.createIdentifier(this.imports.type(
            this.registry.resolveTypeName(methodInfo.I.typeName)
        )), undefined);
    }

    protected makeO(methodInfo: rpc.MethodInfo): ts.TypeReferenceNode {
        return ts.createTypeReferenceNode(ts.createIdentifier(this.imports.type(
            this.registry.resolveTypeName(methodInfo.O.typeName)
        )), undefined);
    }

}

