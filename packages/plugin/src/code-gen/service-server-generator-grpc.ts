import * as rpc from "@protobuf-ts/runtime-rpc";
import {
    addCommentBlockAsJsDoc,
    TypescriptFile,
} from "@protobuf-ts/plugin-framework";
import * as ts from "typescript";
import {assert} from "@protobuf-ts/runtime";
import {CommentGenerator} from "./comment-generator";
import {createLocalTypeName} from "./local-type-name";
import {Interpreter} from "../interpreter";
import {DescMethod, DescService} from "@bufbuild/protobuf";
import {TypeScriptImports} from "../framework/typescript-imports";
import {SymbolTable} from "../framework/symbol-table";


export class ServiceServerGeneratorGrpc {


    private readonly symbolKindInterface = 'grpc-server-interface';
    private readonly symbolKindDefinition = 'grpc-server-definition';


    constructor(
        private readonly symbols: SymbolTable,
        private readonly imports: TypeScriptImports,
        private readonly comments: CommentGenerator,
        private readonly interpreter: Interpreter,
    ) {
    }


    registerSymbols(source: TypescriptFile, descService: DescService): void {
        const basename = createLocalTypeName(descService);
        const interfaceName = `I${basename}`;
        const definitionName = `${basename[0].toLowerCase()}${basename.substring(1)}Definition`;
        this.symbols.register(interfaceName, descService, source, this.symbolKindInterface);
        this.symbols.register(definitionName, descService, source, this.symbolKindDefinition);
    }


    generateInterface(source: TypescriptFile, descService: DescService) {
        const
            interpreterType = this.interpreter.getServiceType(descService),
            IGrpcServer = this.imports.type(source, descService, this.symbolKindInterface),
            grpc = this.imports.namespace(source, 'grpc', '@grpc/grpc-js', true)
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
                const descMethod = descService.methods.find(descMethod => descMethod.name === mi.name);
                assert(descMethod);
                return this.createMethodPropertySignature(source, mi, descMethod)
            })
        );

        // add to our file
        this.comments.addCommentsForDescriptor(statement, descService, 'appendToLeadingBlock');
        source.addStatement(statement);
        return statement;

    }


    private createMethodPropertySignature(source: TypescriptFile, methodInfo: rpc.MethodInfo, descMethod: DescMethod): ts.PropertySignature {
        const grpc = this.imports.namespace(source, 'grpc', '@grpc/grpc-js', true)

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
                    ts.createTypeReferenceNode(ts.createIdentifier(this.imports.typeByName(
                        source,
                        methodInfo.I.typeName,
                    )), undefined),
                    ts.createTypeReferenceNode(ts.createIdentifier(this.imports.typeByName(
                        source,
                        methodInfo.O.typeName,
                    )), undefined),
                ]
            ),
            undefined
        );

        this.comments.addCommentsForDescriptor(signature, descMethod, 'appendToLeadingBlock');

        return signature;
    }


    generateDefinition(source: TypescriptFile, descService: DescService) {
        const
            grpcServerDefinition = this.imports.type(source, descService, this.symbolKindDefinition),
            IGrpcServer = this.imports.type(source, descService, this.symbolKindInterface),
            interpreterType = this.interpreter.getServiceType(descService),
            grpc = this.imports.namespace(source, 'grpc', '@grpc/grpc-js', true);

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
                        interpreterType.methods.map(mi => this.makeDefinitionProperty(source, mi)),
                        true
                    )
                )],
                ts.NodeFlags.Const
            )
        );

        // add to our file
        const doc =
            `@grpc/grpc-js definition for the protobuf ${descService.toString()}.\n` +
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


    private makeDefinitionProperty(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.PropertyAssignment {
        const I = this.imports.typeByName(source, methodInfo.I.typeName);
        const O = this.imports.typeByName(source, methodInfo.O.typeName);

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


}
