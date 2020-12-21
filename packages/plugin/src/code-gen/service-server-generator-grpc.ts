import {ServiceServerGeneratorBase} from "./service-server-generator-base";
import * as rpc from "@protobuf-ts/runtime-rpc";
import {
    addCommentBlockAsJsDoc,
    DescriptorRegistry,
    MethodDescriptorProto,
    ServiceDescriptorProto,
    TypescriptFile,
    TypescriptImportManager
} from "@protobuf-ts/plugin-framework";
import {Interpreter} from "../interpreter";
import * as ts from "typescript";
import {assert} from "@protobuf-ts/runtime";


export class ServiceServerGeneratorGrpc extends ServiceServerGeneratorBase {


    readonly style = rpc.ServerStyle.GRPC;


    constructor(registry: DescriptorRegistry, imports: TypescriptImportManager, interpreter: Interpreter, options: { runtimeRpcImportPath: string; angularCoreImportPath: string; emitAngularAnnotations: boolean; runtimeAngularImportPath: string }) {
        super(registry, imports, interpreter, options);
    }


    generateInterface(descriptor: ServiceDescriptorProto, source: TypescriptFile) {
        const
            interpreterType = this.interpreter.getServiceType(descriptor),
            IGrpcServer = this.imports.type(descriptor, `grpc-server-interface`),
            grpc = this.imports.namespace('grpc', '@grpc/grpc-js')
        ;

        const statement = ts.createInterfaceDeclaration(
            undefined,
            [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
            ts.createIdentifier(IGrpcServer),
            undefined,
            [ts.createHeritageClause(
                ts.SyntaxKind.ExtendsKeyword,
                [ts.createExpressionWithTypeArguments(
                    undefined,
                    ts.createPropertyAccess(
                        ts.createIdentifier(grpc),
                        ts.createIdentifier("UntypedServiceImplementation")
                    )
                )]
            )],
            interpreterType.methods.map(mi => {
                const methodDescriptor = descriptor.method.find(md => md.name === mi.name);
                assert(methodDescriptor);
                return this.createMethodPropertySignature(mi, methodDescriptor)
            })
        );

        // add to our file
        this.commentGenerator.addCommentsForDescriptor(statement, descriptor, 'appendToLeadingBlock');
        source.addStatement(statement);
        return statement;

    }


    private createMethodPropertySignature(methodInfo: rpc.MethodInfo, methodDescriptor: MethodDescriptorProto): ts.PropertySignature {
        const grpc = this.imports.namespace('grpc', '@grpc/grpc-js');

        let handler: string;
        if (methodInfo.serverStreaming && methodInfo.clientStreaming) {
            handler = 'handleBidiStreamingCall';
        } else if (methodInfo.serverStreaming) {
            handler = 'handleServerStreamingCall';
        } else if (methodInfo.clientStreaming) {
            handler = 'handleClientStreamingCall';
        } else {
            handler = 'handleUnaryCall';
        }

        const signature = ts.createPropertySignature(
            undefined,
            ts.createIdentifier(methodInfo.localName),
            undefined,
            ts.createTypeReferenceNode(
                ts.createQualifiedName(
                    ts.createIdentifier(grpc),
                    ts.createIdentifier(handler)
                ),
                [
                    this.makeI(methodInfo),
                    this.makeO(methodInfo),
                ]
            ),
            undefined
        );

        this.commentGenerator.addCommentsForDescriptor(signature, methodDescriptor, 'appendToLeadingBlock');

        return signature;
    }


    generateDefinition(descriptor: ServiceDescriptorProto, source: TypescriptFile) {
        const
            grpcServerDefinition = this.imports.type(descriptor, `grpc-server-definition`),
            IGrpcServer = this.imports.type(descriptor, `grpc-server-interface`),
            interpreterType = this.interpreter.getServiceType(descriptor),
            grpc = this.imports.namespace('grpc', '@grpc/grpc-js');

        const statement = ts.createVariableStatement(
            [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
            ts.createVariableDeclarationList(
                [ts.createVariableDeclaration(
                    ts.createIdentifier(grpcServerDefinition),
                    ts.createTypeReferenceNode(
                        ts.createQualifiedName(
                            ts.createIdentifier(grpc),
                            ts.createIdentifier("ServiceDefinition")
                        ),
                        [ts.createTypeReferenceNode(
                            ts.createIdentifier(IGrpcServer),
                            undefined
                        )]
                    ),
                    ts.createObjectLiteral(
                        interpreterType.methods.map(mi => this.makeDefinitionProperty(mi)),
                        true
                    )
                )],
                ts.NodeFlags.Const
            )
        );

        // add to our file
        const doc =
            `@grpc/grpc-js definition for the protobuf ${this.registry.formatQualifiedName(descriptor)}.\n` +
            `\n` +
            `Usage: Implement the interface ${IGrpcServer} and add to a grpc server.\n` +
            `\n` +
            '```typescript\n' +
            `const server = new grpc.Server();\n` +
            `const service: ${IGrpcServer} = ...\n` +
            `server.addService(${grpcServerDefinition}, service);\n` +
            '```';
        addCommentBlockAsJsDoc(statement, doc);
        source.addStatement(statement);

        return statement;
    }


    private makeDefinitionProperty(methodInfo: rpc.MethodInfo): ts.PropertyAssignment {
        const I = this.imports.type(this.registry.resolveTypeName(methodInfo.I.typeName));
        const O = this.imports.type(this.registry.resolveTypeName(methodInfo.O.typeName));

        return ts.createPropertyAssignment(
            ts.createIdentifier(methodInfo.localName),
            ts.createObjectLiteral(
                [
                    ts.createPropertyAssignment(
                        ts.createIdentifier("path"),
                        ts.createStringLiteral(`/${methodInfo.service.typeName}/${methodInfo.name}`)
                    ),
                    ts.createPropertyAssignment(
                        ts.createIdentifier("originalName"),
                        ts.createStringLiteral(methodInfo.name)
                    ),
                    ts.createPropertyAssignment(
                        ts.createIdentifier("requestStream"),
                        methodInfo.clientStreaming ? ts.createTrue() : ts.createFalse()
                    ),
                    ts.createPropertyAssignment(
                        ts.createIdentifier("responseStream"),
                        methodInfo.serverStreaming ? ts.createTrue() : ts.createFalse()
                    ),
                    ts.createPropertyAssignment(
                        ts.createIdentifier("responseDeserialize"),
                        ts.createArrowFunction(
                            undefined,
                            undefined,
                            [ts.createParameter(
                                undefined,
                                undefined,
                                undefined,
                                ts.createIdentifier("bytes"),
                                undefined,
                                undefined,
                                undefined
                            )],
                            undefined,
                            ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                            ts.createCall(
                                ts.createPropertyAccess(
                                    ts.createIdentifier(O),
                                    ts.createIdentifier("fromBinary")
                                ),
                                undefined,
                                [ts.createIdentifier("bytes")]
                            )
                        )
                    ),
                    ts.createPropertyAssignment(
                        ts.createIdentifier("requestDeserialize"),
                        ts.createArrowFunction(
                            undefined,
                            undefined,
                            [ts.createParameter(
                                undefined,
                                undefined,
                                undefined,
                                ts.createIdentifier("bytes"),
                                undefined,
                                undefined,
                                undefined
                            )],
                            undefined,
                            ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                            ts.createCall(
                                ts.createPropertyAccess(
                                    ts.createIdentifier(I),
                                    ts.createIdentifier("fromBinary")
                                ),
                                undefined,
                                [ts.createIdentifier("bytes")]
                            )
                        )
                    ),
                    ts.createPropertyAssignment(
                        ts.createIdentifier("responseSerialize"),
                        ts.createArrowFunction(
                            undefined,
                            undefined,
                            [ts.createParameter(
                                undefined,
                                undefined,
                                undefined,
                                ts.createIdentifier("value"),
                                undefined,
                                undefined,
                                undefined
                            )],
                            undefined,
                            ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                            ts.createCall(
                                ts.createPropertyAccess(
                                    ts.createIdentifier("Buffer"),
                                    ts.createIdentifier("from")
                                ),
                                undefined,
                                [ts.createCall(
                                    ts.createPropertyAccess(
                                        ts.createIdentifier(O),
                                        ts.createIdentifier("toBinary")
                                    ),
                                    undefined,
                                    [ts.createIdentifier("value")]
                                )]
                            )
                        )
                    ),
                    ts.createPropertyAssignment(
                        ts.createIdentifier("requestSerialize"),
                        ts.createArrowFunction(
                            undefined,
                            undefined,
                            [ts.createParameter(
                                undefined,
                                undefined,
                                undefined,
                                ts.createIdentifier("value"),
                                undefined,
                                undefined,
                                undefined
                            )],
                            undefined,
                            ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                            ts.createCall(
                                ts.createPropertyAccess(
                                    ts.createIdentifier("Buffer"),
                                    ts.createIdentifier("from")
                                ),
                                undefined,
                                [ts.createCall(
                                    ts.createPropertyAccess(
                                        ts.createIdentifier(I),
                                        ts.createIdentifier("toBinary")
                                    ),
                                    undefined,
                                    [ts.createIdentifier("value")]
                                )]
                            )
                        )
                    )
                ],
                true
            )
        );
    }


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
