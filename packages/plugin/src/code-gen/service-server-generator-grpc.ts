import * as rpc from "@protobuf-ts/runtime-rpc";
import {TypescriptFile} from "../framework/typescript-file";
import * as ts from "typescript";
import {assert} from "@protobuf-ts/runtime";
import {CommentGenerator} from "./comment-generator";
import {createLocalTypeName} from "./local-type-name";
import {Interpreter} from "../interpreter";
import {DescMethod, DescService} from "@bufbuild/protobuf";
import {TypeScriptImports} from "../framework/typescript-imports";
import {SymbolTable} from "../framework/symbol-table";
import {addCommentBlockAsJsDoc} from "../framework/typescript-comments";


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

        const statement = ts.factory.createInterfaceDeclaration(
            [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
            ts.factory.createIdentifier(IGrpcServer),
            undefined,
            [ts.factory.createHeritageClause(
                ts.SyntaxKind.ExtendsKeyword,
                [ts.factory.createExpressionWithTypeArguments(
                    ts.factory.createPropertyAccessExpression(
                        ts.factory.createIdentifier(grpc),
                        ts.factory.createIdentifier("UntypedServiceImplementation")
                    ),
                    undefined
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

        const signature = ts.factory.createPropertySignature(
            undefined,
            ts.factory.createIdentifier(methodInfo.localName),
            undefined,
            ts.factory.createTypeReferenceNode(
                ts.factory.createQualifiedName(
                    ts.factory.createIdentifier(grpc),
                    ts.factory.createIdentifier(handler)
                ),
                [
                    ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(this.imports.typeByName(
                        source,
                        methodInfo.I.typeName,
                    )), undefined),
                    ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(this.imports.typeByName(
                        source,
                        methodInfo.O.typeName,
                    )), undefined),
                ]
            )
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

        const statement = ts.factory.createVariableStatement(
            [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
            ts.factory.createVariableDeclarationList(
                [ts.factory.createVariableDeclaration(
                    ts.factory.createIdentifier(grpcServerDefinition),
                    undefined,
                    ts.factory.createTypeReferenceNode(
                        ts.factory.createQualifiedName(
                            ts.factory.createIdentifier(grpc),
                            ts.factory.createIdentifier("ServiceDefinition")
                        ),
                        [ts.factory.createTypeReferenceNode(
                            ts.factory.createIdentifier(IGrpcServer),
                            undefined
                        )]
                    ),
                    ts.factory.createObjectLiteralExpression(
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

        return ts.factory.createPropertyAssignment(
            ts.factory.createIdentifier(methodInfo.localName),
            ts.factory.createObjectLiteralExpression(
                [
                    ts.factory.createPropertyAssignment(
                        ts.factory.createIdentifier("path"),
                        ts.factory.createStringLiteral(`/${methodInfo.service.typeName}/${methodInfo.name}`)
                    ),
                    ts.factory.createPropertyAssignment(
                        ts.factory.createIdentifier("originalName"),
                        ts.factory.createStringLiteral(methodInfo.name)
                    ),
                    ts.factory.createPropertyAssignment(
                        ts.factory.createIdentifier("requestStream"),
                        methodInfo.clientStreaming ? ts.factory.createTrue() : ts.factory.createFalse()
                    ),
                    ts.factory.createPropertyAssignment(
                        ts.factory.createIdentifier("responseStream"),
                        methodInfo.serverStreaming ? ts.factory.createTrue() : ts.factory.createFalse()
                    ),
                    ts.factory.createPropertyAssignment(
                        ts.factory.createIdentifier("responseDeserialize"),
                        ts.factory.createArrowFunction(
                            undefined,
                            undefined,
                            [ts.factory.createParameterDeclaration(
                                undefined,
                                undefined,
                                ts.factory.createIdentifier("bytes"),
                                undefined,
                                undefined,
                                undefined
                            )],
                            undefined,
                            ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                            ts.factory.createCallExpression(
                                ts.factory.createPropertyAccessExpression(
                                    ts.factory.createIdentifier(O),
                                    ts.factory.createIdentifier("fromBinary")
                                ),
                                undefined,
                                [ts.factory.createIdentifier("bytes")]
                            )
                        )
                    ),
                    ts.factory.createPropertyAssignment(
                        ts.factory.createIdentifier("requestDeserialize"),
                        ts.factory.createArrowFunction(
                            undefined,
                            undefined,
                            [ts.factory.createParameterDeclaration(
                                undefined,
                                undefined,
                                ts.factory.createIdentifier("bytes"),
                                undefined,
                                undefined,
                                undefined
                            )],
                            undefined,
                            ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                            ts.factory.createCallExpression(
                                ts.factory.createPropertyAccessExpression(
                                    ts.factory.createIdentifier(I),
                                    ts.factory.createIdentifier("fromBinary")
                                ),
                                undefined,
                                [ts.factory.createIdentifier("bytes")]
                            )
                        )
                    ),
                    ts.factory.createPropertyAssignment(
                        ts.factory.createIdentifier("responseSerialize"),
                        ts.factory.createArrowFunction(
                            undefined,
                            undefined,
                            [ts.factory.createParameterDeclaration(
                                undefined,
                                undefined,
                                ts.factory.createIdentifier("value"),
                                undefined,
                                undefined,
                                undefined
                            )],
                            undefined,
                            ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                            ts.factory.createCallExpression(
                                ts.factory.createPropertyAccessExpression(
                                    ts.factory.createIdentifier("Buffer"),
                                    ts.factory.createIdentifier("from")
                                ),
                                undefined,
                                [ts.factory.createCallExpression(
                                    ts.factory.createPropertyAccessExpression(
                                        ts.factory.createIdentifier(O),
                                        ts.factory.createIdentifier("toBinary")
                                    ),
                                    undefined,
                                    [ts.factory.createIdentifier("value")]
                                )]
                            )
                        )
                    ),
                    ts.factory.createPropertyAssignment(
                        ts.factory.createIdentifier("requestSerialize"),
                        ts.factory.createArrowFunction(
                            undefined,
                            undefined,
                            [ts.factory.createParameterDeclaration(
                                undefined,
                                undefined,
                                ts.factory.createIdentifier("value"),
                                undefined,
                                undefined,
                                undefined
                            )],
                            undefined,
                            ts.factory.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                            ts.factory.createCallExpression(
                                ts.factory.createPropertyAccessExpression(
                                    ts.factory.createIdentifier("Buffer"),
                                    ts.factory.createIdentifier("from")
                                ),
                                undefined,
                                [ts.factory.createCallExpression(
                                    ts.factory.createPropertyAccessExpression(
                                        ts.factory.createIdentifier(I),
                                        ts.factory.createIdentifier("toBinary")
                                    ),
                                    undefined,
                                    [ts.factory.createIdentifier("value")]
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
