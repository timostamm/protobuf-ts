import {
    DescriptorProto,
    DescriptorRegistry,
    MethodDescriptorProto,
    ServiceDescriptorProto,
    TypescriptFile,
    TypescriptImportManager
} from "@protobuf-ts/plugin-framework";
import * as ts from "typescript";
import * as rpc from "@protobuf-ts/runtime-rpc";
import {CommentGenerator} from "./comment-generator";
import {Interpreter} from "../interpreter";
import {ClientMethodStyle} from "../our-options";
import {ServiceClientGeneratorCall} from "./service-client-generator-call";
import {ServiceClientGeneratorPromise} from "./service-client-generator-promise";
import {ServiceClientGeneratorRxjs} from "./service-client-generator-rxjs";
import assert = require("assert");


export interface ClientMethodGenerator {

    createUnary(methodDesc: MethodDescriptorProto, localName: string, methodIndex: number, inputTypeDesc: DescriptorProto, outputTypeDesc: DescriptorProto): ts.MethodDeclaration;

    createServerStreaming(methodDesc: MethodDescriptorProto, localName: string, methodIndex: number, inputTypeDesc: DescriptorProto, outputTypeDesc: DescriptorProto): ts.MethodDeclaration;

    createClientStreaming(methodDesc: MethodDescriptorProto, localName: string, methodIndex: number, inputTypeDesc: DescriptorProto, outputTypeDesc: DescriptorProto): ts.MethodDeclaration;

    createDuplexStreaming(methodDesc: MethodDescriptorProto, localName: string, methodIndex: number, inputTypeDesc: DescriptorProto, outputTypeDesc: DescriptorProto): ts.MethodDeclaration;

}


export class ServiceClientGenerator {


    private readonly commentGenerator: CommentGenerator;
    private readonly call: ClientMethodGenerator;
    private readonly promise: ClientMethodGenerator;
    private readonly rxjs: ClientMethodGenerator;


    constructor(
        private readonly registry: DescriptorRegistry,
        private readonly imports: TypescriptImportManager,
        private readonly interpreter: Interpreter,
        private readonly options: {
            runtimeRpcImportPath: string;
            angularCoreImportPath: string;
            emitAngularAnnotations: boolean;
            runtimeAngularImportPath: string;
            normalClientMethodStyle: readonly rpc.ClientMethodStyle[];
        },
    ) {
        this.commentGenerator = new CommentGenerator(this.registry);
        this.call = new ServiceClientGeneratorCall(this.imports, this.interpreter, this.options);
        this.promise = new ServiceClientGeneratorPromise(this.imports, this.interpreter, this.options);
        this.rxjs = new ServiceClientGeneratorRxjs(this.imports, this.interpreter, this.options);
    }


    // TODO #8 make style a public property of client? add "style" to reserved name in Interpreter.createTypescriptNameForMethod and add to name-clash-proto
    private createRuntimeClientMethodStyle(style: rpc.ClientMethodStyle): ts.Expression {
        const expr = ts.createNumericLiteral(style.toString());
        ts.addSyntheticTrailingComment(expr, ts.SyntaxKind.MultiLineCommentTrivia, `ClientMethodStyle.${rpc.ClientMethodStyle[style]}`);
        return expr;
    }


    // TODO #8 should use same type for MethodInfo, stackIntercept(), and internally?
    private static determineMethodType(methodDescriptor: MethodDescriptorProto): "unary" | "serverStreaming" | "clientStreaming" | "duplex" {
        if (methodDescriptor.clientStreaming && methodDescriptor.serverStreaming) {
            return "duplex";
        }
        if (methodDescriptor.clientStreaming) {
            return "clientStreaming";
        }
        if (methodDescriptor.serverStreaming) {
            return "serverStreaming";
        }
        return "unary";
    }


    // TODO #8 should be abstract class, each implementations doing specific method style
    private determineMethodStyle(methodDescriptor: MethodDescriptorProto): ClientMethodStyle | undefined {
        const serviceDescriptor = this.registry.parentOf(methodDescriptor);
        assert(ServiceDescriptorProto.is(serviceDescriptor));
        const ourServiceOptions = this.interpreter.readOurServiceOptions(serviceDescriptor);
        if (ourServiceOptions["ts.method_style"] !== undefined) {
            return ourServiceOptions["ts.method_style"];
        }
        return undefined;
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
     *     get(request: GetRequest, options?: RpcOptions): UnaryCall<AllMethodsRequest, AllMethodsResponse>;
     *   }
     *
     */
    generateInterface(descriptor: ServiceDescriptorProto, source: TypescriptFile): ts.InterfaceDeclaration {
        const
            interpreterType = this.interpreter.getServiceType(descriptor),
            IServiceClient = this.imports.type(descriptor, 'client-interface');

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
            ServiceType = this.imports.type(descriptor),
            ServiceClient = this.imports.type(descriptor, 'client-implementation'),
            IServiceClient = this.imports.type(descriptor, 'client-interface'),
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
     * Create a service client method, using the method style set by the user.
     */
    protected createMethod(methodInfo: rpc.MethodInfo) {

        const serviceDescriptor = this.registry.resolveTypeName(methodInfo.service.typeName);
        assert(ServiceDescriptorProto.is(serviceDescriptor));
        const methodIndex = serviceDescriptor.method.findIndex(md => md.name === methodInfo.name);
        assert(methodIndex !== undefined);
        const methodDescriptor = serviceDescriptor.method[methodIndex];
        assert(methodDescriptor);
        const inputTypeDesc = this.registry.resolveTypeName(methodDescriptor.inputType!);
        assert(DescriptorProto.is(inputTypeDesc));
        const outputTypeDesc = this.registry.resolveTypeName(methodDescriptor.outputType!);
        assert(DescriptorProto.is(outputTypeDesc));


        const methodStyle = this.determineMethodStyle(methodDescriptor);
        let generator: ClientMethodGenerator;
        switch (methodStyle) {
            case undefined:
            case ClientMethodStyle.CALL:
                generator = this.call;
                break;
            case ClientMethodStyle.PROMISE:
                generator = this.promise;
                break;
            case ClientMethodStyle.RXJS:
                generator = this.rxjs;
                break;
        }
        let declaration: ts.MethodDeclaration;

        if (methodInfo.serverStreaming && methodInfo.clientStreaming) {
            declaration = generator.createDuplexStreaming(methodDescriptor, methodInfo.localName, methodIndex, inputTypeDesc, outputTypeDesc);
        } else if (methodInfo.serverStreaming) {
            declaration = generator.createServerStreaming(methodDescriptor, methodInfo.localName, methodIndex, inputTypeDesc, outputTypeDesc);
        } else if (methodInfo.clientStreaming) {
            declaration = generator.createClientStreaming(methodDescriptor, methodInfo.localName, methodIndex, inputTypeDesc, outputTypeDesc);
        } else {
            declaration = generator.createUnary(methodDescriptor, methodInfo.localName, methodIndex, inputTypeDesc, outputTypeDesc);
        }

        return declaration;
    }


}

