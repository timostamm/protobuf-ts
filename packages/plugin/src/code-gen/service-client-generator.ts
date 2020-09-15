import {
    DescriptorProto,
    DescriptorRegistry,
    MethodDescriptorProto,
    MethodOptions_IdempotencyLevel,
    ServiceDescriptorProto,
    TypescriptFile,
    TypescriptImportManager,
    typescriptLiteralFromValue
} from "@protobuf-ts/plugin-framework";
import * as ts from "typescript";
import * as rt from "@protobuf-ts/runtime";
import {CommentGenerator} from "./comment-generator";
import {Interpreter} from "../interpreter";
import {ServiceClientGeneratorCall} from "./service-client-generator-call";
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


    constructor(
        private readonly registry: DescriptorRegistry,
        private readonly imports: TypescriptImportManager,
        private readonly interpreter: Interpreter,
        private readonly options: {
            runtimeRpcImportPath: string;
            angularCoreImportPath: string;
            emitAngularAnnotations: boolean;
            runtimeAngularImportPath: string;
        },
    ) {
        this.commentGenerator = new CommentGenerator(this.registry);
        this.call = new ServiceClientGeneratorCall(this.imports, this.interpreter, this.options);
    }


    private static createMethodLocalName(descriptor: MethodDescriptorProto): string {
        let escapeCharacter = '$';
        let reservedClassProperties = ["__proto__", "toString", "name", "constructor", "methods", "typeName", "_transport"];
        let name = descriptor.name;
        assert(name !== undefined);
        name = rt.lowerCamelCase(name);
        if (reservedClassProperties.includes(name)) {
            name = name + escapeCharacter;
        }
        return name;
    }


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
        const IServiceClient = this.imports.type(descriptor, 'client-interface');
        const methods = descriptor.method.map((methodDescriptor, methodIndex) => {
            const localName = ServiceClientGenerator.createMethodLocalName(methodDescriptor),
                inputTypeDesc = this.registry.resolveTypeName(methodDescriptor.inputType!),
                outputTypeDesc = this.registry.resolveTypeName(methodDescriptor.outputType!);
            assert(DescriptorProto.is(inputTypeDesc));
            assert(DescriptorProto.is(outputTypeDesc));
            const methodDeclaration = this.createMethod(methodDescriptor, localName, methodIndex, inputTypeDesc, outputTypeDesc);
            const methodSignature = ts.createMethodSignature(
                methodDeclaration.typeParameters,
                methodDeclaration.parameters,
                methodDeclaration.type,
                methodDeclaration.name,
                methodDeclaration.questionToken
            );
            this.commentGenerator.addCommentsForDescriptor(methodSignature, methodDescriptor, 'appendToLeadingBlock');
            return methodSignature;
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
        const ServiceClient = this.imports.type(descriptor, 'client-implementation'),
            IServiceClient = this.imports.type(descriptor, 'client-interface'),
            MethodInfo = this.imports.name('MethodInfo', this.options.runtimeRpcImportPath),
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

            // readonly typeName = ".test.MyService";
            ts.createProperty(
                undefined, [ts.createModifier(ts.SyntaxKind.ReadonlyKeyword)], ts.createIdentifier("typeName"),
                undefined, undefined, ts.createStringLiteral(this.registry.makeTypeName(descriptor))
            ),

            // readonly methods: MethodInfo[] = [...];
            ts.createProperty(
                undefined, [ts.createModifier(ts.SyntaxKind.ReadonlyKeyword)], ts.createIdentifier("methods"),
                undefined,
                ts.createArrayTypeNode(ts.createTypeReferenceNode(MethodInfo, undefined)),
                this.createMethodInfo(descriptor)
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

        ];

        for (let methodIndex = 0; methodIndex < descriptor.method.length; methodIndex++) {
            const methodDescriptor = descriptor.method[methodIndex],
                localName = ServiceClientGenerator.createMethodLocalName(methodDescriptor),
                inputTypeDesc = this.registry.resolveTypeName(methodDescriptor.inputType!),
                outputTypeDesc = this.registry.resolveTypeName(methodDescriptor.outputType!);
            assert(DescriptorProto.is(inputTypeDesc));
            assert(DescriptorProto.is(outputTypeDesc));
            const methodDeclaration = this.createMethod(methodDescriptor, localName, methodIndex, inputTypeDesc, outputTypeDesc);
            members.push(methodDeclaration);
        }


        // export class MyService implements MyService
        const statement = ts.createClassDeclaration(
            classDecorators,
            [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
            ServiceClient,
            undefined,
            [ts.createHeritageClause(
                ts.SyntaxKind.ImplementsKeyword,
                [ts.createExpressionWithTypeArguments(
                    undefined, ts.createIdentifier(IServiceClient)
                )]
            )],
            members
        );

        source.addStatement(statement);
        this.commentGenerator.addCommentsForDescriptor(statement, descriptor, 'appendToLeadingBlock');
        return statement;
    }


    /**
     * Create a service client method, using the method style set by the user.
     */
    protected createMethod(methodDescriptor: MethodDescriptorProto, localName: string, methodIndex: number, inputTypeDesc: DescriptorProto, outputTypeDesc: DescriptorProto) {
        const generator = this.call;
        let declaration: ts.MethodDeclaration;
        switch (ServiceClientGenerator.determineMethodType(methodDescriptor)) {
            case "unary":
                declaration = generator.createUnary(methodDescriptor, localName, methodIndex, inputTypeDesc, outputTypeDesc);
                break;
            case "serverStreaming":
                declaration = generator.createServerStreaming(methodDescriptor, localName, methodIndex, inputTypeDesc, outputTypeDesc);
                break;
            case "clientStreaming":
                declaration = generator.createClientStreaming(methodDescriptor, localName, methodIndex, inputTypeDesc, outputTypeDesc);
                break;
            case "duplex":
                declaration = generator.createDuplexStreaming(methodDescriptor, localName, methodIndex, inputTypeDesc, outputTypeDesc);
                break;
        }
        return declaration;
    }


    /**
     * Create service method information for the runtime.
     *
     * Example:
     *
     *   [
     *     {service: this, name: 'get', I: MyGetRequest, O: MyGetResponse},
     *   ]
     *
     */
    protected createMethodInfo(descriptor: ServiceDescriptorProto): ts.ArrayLiteralExpression {
        const methodInfos: ts.ObjectLiteralExpression[] = [];
        for (let methodDescriptor of descriptor.method) {
            let localName = ServiceClientGenerator.createMethodLocalName(methodDescriptor);
            let inputTypeDesc = this.registry.resolveTypeName(methodDescriptor.inputType!);
            let outputTypeDesc = this.registry.resolveTypeName(methodDescriptor.outputType!);
            assert(DescriptorProto.is(inputTypeDesc));
            assert(DescriptorProto.is(outputTypeDesc));
            let properties: ts.ObjectLiteralElementLike[] = [
                ts.createPropertyAssignment(ts.createIdentifier("service"), ts.createThis()),
                ts.createPropertyAssignment(ts.createIdentifier("name"), ts.createStringLiteral(methodDescriptor.name!)),
            ];
            if (localName !== methodDescriptor.name) {
                properties.push(
                    ts.createPropertyAssignment(ts.createIdentifier("localName"), ts.createStringLiteral(localName)),
                );
            }
            properties.push(
                ts.createPropertyAssignment(ts.createIdentifier("I"), ts.createIdentifier(this.imports.type(inputTypeDesc))),
                ts.createPropertyAssignment(ts.createIdentifier("O"), ts.createIdentifier(this.imports.type(outputTypeDesc))),
            );
            if (methodDescriptor.options) {
                let idem = methodDescriptor.options.idempotencyLevel;
                if (idem !== undefined && idem !== MethodOptions_IdempotencyLevel.IDEMPOTENCY_UNKNOWN) {
                    let stringVal = MethodOptions_IdempotencyLevel[idem];
                    properties.push(
                        ts.createPropertyAssignment(ts.createIdentifier("idempotency"), ts.createStringLiteral(stringVal))
                    );
                }
            }
            if (methodDescriptor.clientStreaming) {
                properties.push(
                    ts.createPropertyAssignment(ts.createIdentifier("clientStreaming"), ts.createTrue())
                );
            }
            if (methodDescriptor.serverStreaming) {
                properties.push(
                    ts.createPropertyAssignment(ts.createIdentifier("serverStreaming"), ts.createTrue())
                );
            }

            // options:
            const ourFileOptions = this.interpreter.readOurFileOptions(this.registry.fileOf(methodDescriptor));
            const excludeOptions = ourFileOptions["ts.exclude_options"].concat("ts.method_style");
            const optionsMap = this.interpreter.readOptions(methodDescriptor, excludeOptions);
            if (optionsMap) {
                properties.push(ts.createPropertyAssignment(
                    ts.createIdentifier('options'),
                    typescriptLiteralFromValue(optionsMap)
                ));
            }

            methodInfos.push(
                ts.createObjectLiteral([...properties], false)
            );
        }
        return ts.createArrayLiteral(methodInfos, true);
    }


}
