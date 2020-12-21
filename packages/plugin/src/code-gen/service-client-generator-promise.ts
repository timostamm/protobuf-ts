import * as ts from "typescript";
import {SyntaxKind} from "typescript";
import {ServiceClientGeneratorBase} from "./service-client-generator-base";
import * as rpc from "@protobuf-ts/runtime-rpc";
import {assert} from "@protobuf-ts/runtime";
import {TypescriptFile} from "@protobuf-ts/plugin-framework";


export class ServiceClientGeneratorPromise extends ServiceClientGeneratorBase {


    readonly symbolKindInterface = 'promise-client-interface';
    readonly symbolKindImplementation = 'promise-client';


    createUnary(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodDeclaration {
        let RpcOptions = this.imports.name(source, 'RpcOptions', this.options.runtimeRpcImportPath);
        let stackIntercept = this.imports.name(source, 'stackIntercept', this.options.runtimeRpcImportPath);
        let methodIndex = methodInfo.service.methods.indexOf(methodInfo);
        assert(methodIndex >= 0);

        return ts.createMethod(
            undefined, undefined, undefined,
            ts.createIdentifier(methodInfo.localName),
            undefined, undefined,
            [
                ts.createParameter(
                    undefined, undefined, undefined, ts.createIdentifier("input"), undefined,
                    this.makeI(source, methodInfo)
                ),
                ts.createParameter(
                    undefined, undefined, undefined, ts.createIdentifier("options"), ts.createToken(ts.SyntaxKind.QuestionToken),
                    ts.createTypeReferenceNode(ts.createIdentifier(RpcOptions), undefined), undefined
                )
            ],
            ts.createTypeReferenceNode(
                ts.createIdentifier("Promise"),
                [
                    this.makeO(source, methodInfo)
                ]
            ),
            ts.createBlock(
                [
                    // const method = this.methods[0], opt = this._transport.mergeOptions(options);
                    ts.createVariableStatement(
                        undefined,
                        ts.createVariableDeclarationList(
                            [
                                ts.createVariableDeclaration(
                                    ts.createIdentifier("method"),
                                    undefined,
                                    ts.createElementAccess(
                                        ts.createPropertyAccess(ts.createThis(), ts.createIdentifier("methods")),
                                        ts.createNumericLiteral(methodIndex.toString())
                                    )
                                ),
                                ts.createVariableDeclaration(
                                    ts.createIdentifier("opt"),
                                    undefined,
                                    ts.createCall(
                                        ts.createPropertyAccess(
                                            ts.createPropertyAccess(
                                                ts.createThis(),
                                                ts.createIdentifier("_transport")
                                            ),
                                            ts.createIdentifier("mergeOptions")
                                        ),
                                        undefined,
                                        [ts.createIdentifier("options")]
                                    )
                                ),
                            ],
                            ts.NodeFlags.Const
                        )
                    ),

                    ts.createVariableStatement(
                        undefined,
                        ts.createVariableDeclarationList(
                            [ts.createVariableDeclaration(
                                ts.createIdentifier("call"),
                                undefined,
                                ts.createCall(
                                    ts.createIdentifier(stackIntercept),
                                    [
                                        this.makeI(source, methodInfo),
                                        this.makeO(source, methodInfo)
                                    ],
                                    [
                                        ts.createStringLiteral("unary"),
                                        ts.createPropertyAccess(
                                            ts.createThis(),
                                            ts.createIdentifier("_transport")
                                        ),
                                        ts.createIdentifier("method"),
                                        ts.createIdentifier("opt"),
                                        ts.createIdentifier("input")
                                    ]
                                )
                            )],
                            ts.NodeFlags.Const
                        )
                    ),
                    ts.createReturn(ts.createCall(
                        ts.createPropertyAccess(
                            ts.createIdentifier("Promise"),
                            ts.createIdentifier("resolve")
                        ),
                        undefined,
                        [ts.createCall(
                            ts.createPropertyAccess(
                                ts.createIdentifier("call"),
                                ts.createIdentifier("then")
                            ),
                            undefined,
                            [ts.createArrowFunction(
                                undefined,
                                undefined,
                                [ts.createParameter(
                                    undefined,
                                    undefined,
                                    undefined,
                                    ts.createIdentifier("finished"),
                                    undefined,
                                    undefined,
                                    undefined
                                )],
                                undefined,
                                ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                ts.createPropertyAccess(
                                    ts.createIdentifier("finished"),
                                    ts.createIdentifier("response")
                                )
                            )]
                        )]
                    ))

                ],
                true
            )
        );
    }


    createServerStreaming(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodDeclaration {
        let RpcOptions = this.imports.name(source, 'RpcOptions', this.options.runtimeRpcImportPath);
        let stackIntercept = this.imports.name(source, 'stackIntercept', this.options.runtimeRpcImportPath);
        let methodIndex = methodInfo.service.methods.indexOf(methodInfo);
        assert(methodIndex >= 0);

        // serverStream_promise(input: A, options?: RpcOptions): AsyncIterable<B>
        return ts.createMethod(
            undefined, undefined, undefined,
            ts.createIdentifier(methodInfo.localName),
            undefined, undefined,
            [
                ts.createParameter(
                    undefined, undefined, undefined, ts.createIdentifier("input"), undefined,
                    this.makeI(source, methodInfo)
                ),
                ts.createParameter(
                    undefined, undefined, undefined, ts.createIdentifier("options"), ts.createToken(ts.SyntaxKind.QuestionToken),
                    ts.createTypeReferenceNode(ts.createIdentifier(RpcOptions), undefined), undefined
                )
            ],
            ts.createTypeReferenceNode(
                ts.createIdentifier("AsyncIterable"),
                [
                    this.makeO(source, methodInfo),
                ]
            ),
            ts.createBlock(
                [
                    // const method = this.methods[0], opt = this._transport.mergeOptions(options);
                    ts.createVariableStatement(
                        undefined,
                        ts.createVariableDeclarationList(
                            [
                                ts.createVariableDeclaration(
                                    ts.createIdentifier("method"),
                                    undefined,
                                    ts.createElementAccess(
                                        ts.createPropertyAccess(ts.createThis(), ts.createIdentifier("methods")),
                                        ts.createNumericLiteral(methodIndex.toString())
                                    )
                                ),
                                ts.createVariableDeclaration(
                                    ts.createIdentifier("opt"),
                                    undefined,
                                    ts.createCall(
                                        ts.createPropertyAccess(
                                            ts.createPropertyAccess(
                                                ts.createThis(),
                                                ts.createIdentifier("_transport")
                                            ),
                                            ts.createIdentifier("mergeOptions")
                                        ),
                                        undefined,
                                        [ts.createIdentifier("options")]
                                    )
                                ),
                            ],
                            ts.NodeFlags.Const
                        )
                    ),

                    // const call = stackIntercept<A, B>("serverStreaming", this._transport, method, opt, i);
                    ts.createVariableStatement(
                        undefined,
                        ts.createVariableDeclarationList(
                            [ts.createVariableDeclaration(
                                ts.createIdentifier("call"),
                                undefined,
                                ts.createCall(
                                    ts.createIdentifier(stackIntercept),
                                    [
                                        this.makeI(source, methodInfo),
                                        this.makeO(source, methodInfo)
                                    ],
                                    [
                                        ts.createStringLiteral("serverStreaming"),
                                        ts.createPropertyAccess(
                                            ts.createThis(),
                                            ts.createIdentifier("_transport")
                                        ),
                                        ts.createIdentifier("method"),
                                        ts.createIdentifier("opt"),
                                        ts.createIdentifier("input")
                                    ]
                                )
                            )],
                            ts.NodeFlags.Const
                        )
                    ),

                    // const stream = new RpcOutputStreamController<B>();
                    ts.createVariableStatement(
                        undefined,
                        ts.createVariableDeclarationList(
                            [ts.createVariableDeclaration(
                                ts.createIdentifier("stream"),
                                undefined,
                                ts.createNew(
                                    ts.createIdentifier(this.imports.name(source, "RpcOutputStreamController", this.options.runtimeRpcImportPath)),
                                    [this.makeO(source, methodInfo)],
                                    []
                                )
                            )],
                            ts.NodeFlags.Const
                        )
                    ),

                    // call.response.onNext(stream.notifyNext.bind(stream));
                    ts.createExpressionStatement(ts.createCall(
                        ts.createPropertyAccess(
                            ts.createPropertyAccess(
                                ts.createIdentifier("call"),
                                ts.createIdentifier("response")
                            ),
                            ts.createIdentifier("onNext")
                        ),
                        undefined,
                        [ts.createCall(
                            ts.createPropertyAccess(
                                ts.createPropertyAccess(
                                    ts.createIdentifier("stream"),
                                    ts.createIdentifier("notifyNext")
                                ),
                                ts.createIdentifier("bind")
                            ),
                            undefined,
                            [ts.createIdentifier("stream")]
                        )]
                    )),

                    // call.status.catch(e => stream.closed || stream.notifyError(e) );
                    ts.createExpressionStatement(ts.createCall(
                        ts.createPropertyAccess(
                            ts.createPropertyAccess(
                                ts.createIdentifier("call"),
                                ts.createIdentifier("status")
                            ),
                            ts.createIdentifier("catch")
                        ),
                        undefined,
                        [ts.createArrowFunction(
                            undefined,
                            undefined,
                            [ts.createParameter(
                                undefined,
                                undefined,
                                undefined,
                                ts.createIdentifier("e"),
                                undefined,
                                undefined,
                                undefined
                            )],
                            undefined,
                            ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                            ts.createBinary(
                                ts.createPropertyAccess(
                                    ts.createIdentifier("stream"),
                                    ts.createIdentifier("closed")
                                ),
                                ts.createToken(ts.SyntaxKind.BarBarToken),
                                ts.createCall(
                                    ts.createPropertyAccess(
                                        ts.createIdentifier("stream"),
                                        ts.createIdentifier("notifyError")
                                    ),
                                    undefined,
                                    [ts.createIdentifier("e")]
                                )
                            )
                        )]
                    )),

                    // return stream;
                    ts.createReturn(ts.createIdentifier("stream"))
                ],
                true
            )
        );
    }


    createClientStreaming(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodDeclaration {
        let RpcOptions = this.imports.name(source, 'RpcOptions', this.options.runtimeRpcImportPath);
        let stackIntercept = this.imports.name(source, 'stackIntercept', this.options.runtimeRpcImportPath);
        let RpcError = this.imports.name(source, 'RpcError', this.options.runtimeRpcImportPath);
        let methodIndex = methodInfo.service.methods.indexOf(methodInfo);
        assert(methodIndex >= 0);

        return ts.createMethod(
            undefined,
            undefined,
            undefined,
            ts.createIdentifier(methodInfo.localName),
            undefined,
            undefined,
            [
                ts.createParameter(
                    undefined,
                    undefined,
                    undefined,
                    ts.createIdentifier("input"),
                    undefined,
                    ts.createUnionTypeNode([
                        ts.createTypeReferenceNode(
                            ts.createIdentifier("AsyncIterable"),
                            [this.makeI(source, methodInfo)]
                        ),
                        ts.createTypeReferenceNode(
                            ts.createIdentifier("AsyncIterator"),
                            [this.makeI(source, methodInfo)]
                        )
                    ]),
                    undefined
                ),
                ts.createParameter(
                    undefined, undefined, undefined, ts.createIdentifier("options"), ts.createToken(ts.SyntaxKind.QuestionToken),
                    ts.createTypeReferenceNode(ts.createIdentifier(RpcOptions), undefined), undefined
                )
            ],
            ts.createTypeReferenceNode(
                "Promise",
                [
                    this.makeO(source, methodInfo),
                ]
            ),
            ts.createBlock(
                [

                    // const method = this.methods[0], opt = this._transport.mergeOptions(options)
                    ts.createVariableStatement(
                        undefined,
                        ts.createVariableDeclarationList([
                                ts.createVariableDeclaration(
                                    ts.createIdentifier("method"),
                                    undefined,
                                    ts.createElementAccess(
                                        ts.createPropertyAccess(ts.createThis(), ts.createIdentifier("methods")),
                                        ts.createNumericLiteral(methodIndex.toString())
                                    )
                                ),
                                ts.createVariableDeclaration(
                                    ts.createIdentifier("opt"),
                                    undefined,
                                    ts.createCall(
                                        ts.createPropertyAccess(
                                            ts.createPropertyAccess(
                                                ts.createThis(),
                                                ts.createIdentifier("_transport")
                                            ),
                                            ts.createIdentifier("mergeOptions")
                                        ),
                                        undefined,
                                        [ts.createIdentifier("options")]
                                    )
                                )],
                            ts.NodeFlags.Const
                        )
                    ),

                    // early exit if already aborted
                    ts.addSyntheticLeadingComment(
                        ts.createIf(
                            ts.createBinary(
                                ts.createPropertyAccess(
                                    ts.createIdentifier("opt"),
                                    ts.createIdentifier("abort")
                                ),
                                ts.createToken(ts.SyntaxKind.AmpersandAmpersandToken),
                                ts.createPropertyAccess(
                                    ts.createPropertyAccess(
                                        ts.createIdentifier("opt"),
                                        ts.createIdentifier("abort")
                                    ),
                                    ts.createIdentifier("aborted")
                                )
                            ),
                            ts.createReturn(ts.createCall(
                                ts.createPropertyAccess(
                                    ts.createIdentifier("Promise"),
                                    ts.createIdentifier("reject")
                                ),
                                undefined,
                                [ts.createNew(
                                    ts.createIdentifier(RpcError),
                                    undefined,
                                    [
                                        ts.createStringLiteral("user cancel"),
                                        ts.createStringLiteral("CANCELLED")
                                    ]
                                )]
                            )),
                            undefined
                        ),
                        SyntaxKind.SingleLineCommentTrivia, 'early exit if already aborted', false
                    ),

                    // start the call
                    ts.addSyntheticLeadingComment(
                        ts.createVariableStatement(
                            undefined,
                            ts.createVariableDeclarationList(
                                [ts.createVariableDeclaration(
                                    ts.createIdentifier("call"),
                                    undefined,
                                    ts.createCall(
                                        ts.createIdentifier(stackIntercept),
                                        undefined,
                                        [
                                            ts.createStringLiteral("clientStreaming"),
                                            ts.createPropertyAccess(
                                                ts.createThis(),
                                                ts.createIdentifier("_transport")
                                            ),
                                            ts.createIdentifier("method"),
                                            ts.createIdentifier("opt")
                                        ]
                                    )
                                )],
                                ts.NodeFlags.Const
                            )
                        ),
                        SyntaxKind.SingleLineCommentTrivia, 'start the call', false
                    ),

                    // for every input value, send request message, then complete the request
                    ts.addSyntheticLeadingComment(
                        ts.createVariableStatement(
                            undefined,
                            ts.createVariableDeclarationList(
                                [ts.createVariableDeclaration(
                                    ts.createIdentifier("inputs"),
                                    ts.createTypeReferenceNode(
                                        ts.createIdentifier("AsyncIterator"),
                                        [
                                            this.makeI(source, methodInfo)
                                        ]
                                    ),
                                    ts.createConditional(
                                        ts.createBinary(
                                            ts.createStringLiteral("next"),
                                            ts.createToken(ts.SyntaxKind.InKeyword),
                                            ts.createIdentifier("input")
                                        ),
                                        ts.createToken(ts.SyntaxKind.QuestionToken),
                                        ts.createIdentifier("input"),
                                        ts.createToken(ts.SyntaxKind.ColonToken),
                                        ts.createCall(
                                            ts.createElementAccess(
                                                ts.createIdentifier("input"),
                                                ts.createPropertyAccess(
                                                    ts.createIdentifier("Symbol"),
                                                    ts.createIdentifier("asyncIterator")
                                                )
                                            ),
                                            undefined,
                                            []
                                        )
                                    )
                                )],
                                ts.NodeFlags.Const
                            )
                        ),
                        SyntaxKind.SingleLineCommentTrivia, 'for every input value, send request message, then complete the request', false
                    ),
                    ts.createVariableStatement(
                        undefined,
                        ts.createVariableDeclarationList(
                            [ts.createVariableDeclaration(
                                ts.createIdentifier("send"),
                                undefined,
                                ts.createArrowFunction(
                                    undefined,
                                    undefined,
                                    [],
                                    ts.createTypeReferenceNode(
                                        ts.createIdentifier("Promise"),
                                        [ts.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword)]
                                    ),
                                    ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                    ts.createCall(
                                        ts.createPropertyAccess(
                                            ts.createCall(
                                                ts.createPropertyAccess(
                                                    ts.createIdentifier("inputs"),
                                                    ts.createIdentifier("next")
                                                ),
                                                undefined,
                                                []
                                            ),
                                            ts.createIdentifier("then")
                                        ),
                                        undefined,
                                        [ts.createArrowFunction(
                                            undefined,
                                            undefined,
                                            [ts.createParameter(
                                                undefined,
                                                undefined,
                                                undefined,
                                                ts.createIdentifier("r"),
                                                undefined,
                                                undefined,
                                                undefined
                                            )],
                                            undefined,
                                            ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                            ts.createBlock(
                                                [ts.createIf(
                                                    ts.createPropertyAccess(
                                                        ts.createIdentifier("r"),
                                                        ts.createIdentifier("done")
                                                    ),
                                                    ts.createExpressionStatement(ts.createCall(
                                                        ts.createPropertyAccess(
                                                            ts.createPropertyAccess(
                                                                ts.createIdentifier("call"),
                                                                ts.createIdentifier("request")
                                                            ),
                                                            ts.createIdentifier("complete")
                                                        ),
                                                        undefined,
                                                        []
                                                    )),
                                                    ts.createReturn(ts.createCall(
                                                        ts.createPropertyAccess(
                                                            ts.createCall(
                                                                ts.createPropertyAccess(
                                                                    ts.createPropertyAccess(
                                                                        ts.createIdentifier("call"),
                                                                        ts.createIdentifier("request")
                                                                    ),
                                                                    ts.createIdentifier("send")
                                                                ),
                                                                undefined,
                                                                [ts.createPropertyAccess(
                                                                    ts.createIdentifier("r"),
                                                                    ts.createIdentifier("value")
                                                                )]
                                                            ),
                                                            ts.createIdentifier("then")
                                                        ),
                                                        undefined,
                                                        [ts.createIdentifier("send")]
                                                    ))
                                                )],
                                                true
                                            )
                                        )]
                                    )
                                )
                            )],
                            ts.NodeFlags.Const
                        )
                    ),

                    // error the input stream on send error
                    ts.addSyntheticLeadingComment(
                        ts.createExpressionStatement(ts.createCall(
                            ts.createPropertyAccess(
                                ts.createCall(
                                    ts.createIdentifier("send"),
                                    undefined,
                                    []
                                ),
                                ts.createIdentifier("catch")
                            ),
                            undefined,
                            [ts.createArrowFunction(
                                undefined,
                                undefined,
                                [ts.createParameter(
                                    undefined,
                                    undefined,
                                    undefined,
                                    ts.createIdentifier("e"),
                                    undefined,
                                    undefined,
                                    undefined
                                )],
                                undefined,
                                ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                ts.createBlock(
                                    [ts.createIf(
                                        ts.createBinary(
                                            ts.createBinary(
                                                ts.createPropertyAccess(
                                                    ts.createIdentifier("inputs"),
                                                    ts.createIdentifier("throw")
                                                ),
                                                ts.createToken(ts.SyntaxKind.AmpersandAmpersandToken),
                                                ts.createPrefix(
                                                    ts.SyntaxKind.ExclamationToken,
                                                    ts.createParen(ts.createBinary(
                                                        ts.createIdentifier("e"),
                                                        ts.createToken(ts.SyntaxKind.InstanceOfKeyword),
                                                        ts.createIdentifier(RpcError)
                                                    ))
                                                )
                                            ),
                                            ts.createToken(ts.SyntaxKind.BarBarToken),
                                            ts.createBinary(
                                                ts.createPropertyAccess(
                                                    ts.createIdentifier("e"),
                                                    ts.createIdentifier("code")
                                                ),
                                                ts.createToken(ts.SyntaxKind.ExclamationEqualsEqualsToken),
                                                ts.createStringLiteral("CANCELLED")
                                            )
                                        ),
                                        ts.createExpressionStatement(ts.createCall(
                                            ts.createNonNullExpression(ts.createPropertyAccess(
                                                ts.createIdentifier("inputs"),
                                                ts.createIdentifier("throw")
                                            )),
                                            undefined,
                                            [ts.createIdentifier("e")]
                                        )),
                                        undefined
                                    )],
                                    true
                                )
                            )]
                        )),
                        SyntaxKind.SingleLineCommentTrivia, 'error the input stream on send error', false
                    ),

                    // handle cancellation
                    ts.addSyntheticLeadingComment(
                        ts.createIf(
                            ts.createPropertyAccess(
                                ts.createIdentifier("opt"),
                                ts.createIdentifier("abort")
                            ),
                            ts.createBlock(
                                [ts.createExpressionStatement(ts.createCall(
                                    ts.createPropertyAccess(
                                        ts.createPropertyAccess(
                                            ts.createIdentifier("opt"),
                                            ts.createIdentifier("abort")
                                        ),
                                        ts.createIdentifier("addEventListener")
                                    ),
                                    undefined,
                                    [
                                        ts.createStringLiteral("abort"),
                                        ts.createArrowFunction(
                                            undefined,
                                            undefined,
                                            [],
                                            undefined,
                                            ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                            ts.createBlock(
                                                [ts.createIf(
                                                    ts.createPropertyAccess(
                                                        ts.createIdentifier("inputs"),
                                                        ts.createIdentifier("throw")
                                                    ),
                                                    ts.createExpressionStatement(ts.createCall(
                                                        ts.createPropertyAccess(
                                                            ts.createIdentifier("inputs"),
                                                            ts.createIdentifier("throw")
                                                        ),
                                                        undefined,
                                                        [ts.createNew(
                                                            ts.createIdentifier(RpcError),
                                                            undefined,
                                                            [
                                                                ts.createStringLiteral("user cancel"),
                                                                ts.createStringLiteral("CANCELLED")
                                                            ]
                                                        )]
                                                    )),
                                                    undefined
                                                )],
                                                true
                                            )
                                        )
                                    ]
                                ))],
                                true
                            ),
                            undefined
                        ),
                        SyntaxKind.SingleLineCommentTrivia, 'handle cancellation', false
                    ),

                    // wait for response to finish
                    ts.addSyntheticLeadingComment(
                        ts.createReturn(ts.createCall(
                            ts.createPropertyAccess(
                                ts.createIdentifier("Promise"),
                                ts.createIdentifier("resolve")
                            ),
                            undefined,
                            [ts.createCall(
                                ts.createPropertyAccess(
                                    ts.createIdentifier("call"),
                                    ts.createIdentifier("then")
                                ),
                                undefined,
                                [ts.createArrowFunction(
                                    undefined,
                                    undefined,
                                    [ts.createParameter(
                                        undefined,
                                        undefined,
                                        undefined,
                                        ts.createIdentifier("finished"),
                                        undefined,
                                        undefined,
                                        undefined
                                    )],
                                    undefined,
                                    ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                    ts.createPropertyAccess(
                                        ts.createIdentifier("finished"),
                                        ts.createIdentifier("response")
                                    )
                                )]
                            )]
                        )),
                        SyntaxKind.SingleLineCommentTrivia, 'wait for response to finish', false
                    )

                ],
                true
            )
        );
    }


    createDuplexStreaming(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodDeclaration {
        let RpcOptions = this.imports.name(source, 'RpcOptions', this.options.runtimeRpcImportPath);
        let RpcOutputStreamController = this.imports.name(source, 'RpcOutputStreamController', this.options.runtimeRpcImportPath);
        let stackIntercept = this.imports.name(source, 'stackIntercept', this.options.runtimeRpcImportPath);
        let RpcError = this.imports.name(source, 'RpcError', this.options.runtimeRpcImportPath);
        let methodIndex = methodInfo.service.methods.indexOf(methodInfo);
        assert(methodIndex >= 0);

        return ts.createMethod(
            undefined,
            undefined,
            undefined,
            ts.createIdentifier(methodInfo.localName),
            undefined,
            undefined,
            [
                ts.createParameter(
                    undefined,
                    undefined,
                    undefined,
                    ts.createIdentifier("input"),
                    undefined,
                    ts.createUnionTypeNode([
                        ts.createTypeReferenceNode(
                            ts.createIdentifier("AsyncIterable"),
                            [this.makeI(source, methodInfo)]
                        ),
                        ts.createTypeReferenceNode(
                            ts.createIdentifier("AsyncIterator"),
                            [this.makeI(source, methodInfo)]
                        )
                    ]),
                    undefined
                ),
                ts.createParameter(
                    undefined, undefined, undefined, ts.createIdentifier("options"), ts.createToken(ts.SyntaxKind.QuestionToken),
                    ts.createTypeReferenceNode(ts.createIdentifier(RpcOptions), undefined), undefined
                )
            ],
            ts.createTypeReferenceNode(
                "AsyncIterable",
                [
                    this.makeO(source, methodInfo),
                ]
            ),
            ts.createBlock(
                [

                    // const method = this.methods[0], opt = this._transport.mergeOptions(options)
                    ts.createVariableStatement(
                        undefined,
                        ts.createVariableDeclarationList([
                                ts.createVariableDeclaration(
                                    ts.createIdentifier("method"),
                                    undefined,
                                    ts.createElementAccess(
                                        ts.createPropertyAccess(ts.createThis(), ts.createIdentifier("methods")),
                                        ts.createNumericLiteral(methodIndex.toString())
                                    )
                                ),
                                ts.createVariableDeclaration(
                                    ts.createIdentifier("opt"),
                                    undefined,
                                    ts.createCall(
                                        ts.createPropertyAccess(
                                            ts.createPropertyAccess(
                                                ts.createThis(),
                                                ts.createIdentifier("_transport")
                                            ),
                                            ts.createIdentifier("mergeOptions")
                                        ),
                                        undefined,
                                        [ts.createIdentifier("options")]
                                    )
                                )],
                            ts.NodeFlags.Const
                        )
                    ),

                    // our output iterable
                    ts.addSyntheticLeadingComment(
                        ts.createVariableStatement(
                            undefined,
                            ts.createVariableDeclarationList(
                                [ts.createVariableDeclaration(
                                    ts.createIdentifier("outputs"),
                                    undefined,
                                    ts.createNew(
                                        ts.createIdentifier(RpcOutputStreamController),
                                        [this.makeO(source, methodInfo)],
                                        []
                                    )
                                )],
                                ts.NodeFlags.Const
                            )
                        ),
                        SyntaxKind.SingleLineCommentTrivia, "our output iterable", false
                    ),

                    // early exit if already aborted
                    ts.addSyntheticLeadingComment(
                        ts.createIf(
                            ts.createBinary(
                                ts.createPropertyAccess(
                                    ts.createIdentifier("opt"),
                                    ts.createIdentifier("abort")
                                ),
                                ts.createToken(ts.SyntaxKind.AmpersandAmpersandToken),
                                ts.createPropertyAccess(
                                    ts.createPropertyAccess(
                                        ts.createIdentifier("opt"),
                                        ts.createIdentifier("abort")
                                    ),
                                    ts.createIdentifier("aborted")
                                )
                            ),
                            ts.createBlock(
                                [
                                    ts.createExpressionStatement(ts.createCall(
                                        ts.createPropertyAccess(
                                            ts.createIdentifier("outputs"),
                                            ts.createIdentifier("notifyError")
                                        ),
                                        undefined,
                                        [ts.createNew(
                                            ts.createIdentifier(RpcError),
                                            undefined,
                                            [
                                                ts.createStringLiteral("user cancel"),
                                                ts.createStringLiteral("CANCELLED")
                                            ]
                                        )]
                                    )),
                                    ts.createReturn(ts.createIdentifier("outputs"))
                                ],
                                true
                            ),
                            undefined
                        ),
                        SyntaxKind.SingleLineCommentTrivia, "early exit if already aborted", true
                    ),

                    // start the call
                    ts.addSyntheticLeadingComment(
                        ts.createVariableStatement(
                            undefined,
                            ts.createVariableDeclarationList(
                                [ts.createVariableDeclaration(
                                    ts.createIdentifier("call"),
                                    undefined,
                                    ts.createCall(
                                        ts.createIdentifier(stackIntercept),
                                        undefined,
                                        [
                                            ts.createStringLiteral("duplex"),
                                            ts.createPropertyAccess(
                                                ts.createThis(),
                                                ts.createIdentifier("_transport")
                                            ),
                                            ts.createIdentifier("method"),
                                            ts.createIdentifier("opt")
                                        ]
                                    )
                                )],
                                ts.NodeFlags.Const
                            )
                        ),
                        SyntaxKind.SingleLineCommentTrivia, "start the call", true
                    ),

                    //for every input value, send request message, then complete the request
                    ts.addSyntheticLeadingComment(
                        ts.createVariableStatement(
                            undefined,
                            ts.createVariableDeclarationList(
                                [ts.createVariableDeclaration(
                                    ts.createIdentifier("inputs"),
                                    ts.createTypeReferenceNode(
                                        ts.createIdentifier("AsyncIterator"),
                                        [this.makeI(source, methodInfo)]
                                    ),
                                    ts.createConditional(
                                        ts.createBinary(
                                            ts.createStringLiteral("next"),
                                            ts.createToken(ts.SyntaxKind.InKeyword),
                                            ts.createIdentifier("input")
                                        ),
                                        ts.createToken(ts.SyntaxKind.QuestionToken),
                                        ts.createIdentifier("input"),
                                        ts.createToken(ts.SyntaxKind.ColonToken),
                                        ts.createCall(
                                            ts.createElementAccess(
                                                ts.createIdentifier("input"),
                                                ts.createPropertyAccess(
                                                    ts.createIdentifier("Symbol"),
                                                    ts.createIdentifier("asyncIterator")
                                                )
                                            ),
                                            undefined,
                                            []
                                        )
                                    )
                                )],
                                ts.NodeFlags.Const
                            )
                        ),
                        SyntaxKind.SingleLineCommentTrivia, "for every input value, send request message, then complete the request", true
                    ),
                    ts.createVariableStatement(
                        undefined,
                        ts.createVariableDeclarationList(
                            [ts.createVariableDeclaration(
                                ts.createIdentifier("send"),
                                undefined,
                                ts.createArrowFunction(
                                    undefined,
                                    undefined,
                                    [],
                                    ts.createTypeReferenceNode(
                                        ts.createIdentifier("Promise"),
                                        [ts.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword)]
                                    ),
                                    ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                    ts.createCall(
                                        ts.createPropertyAccess(
                                            ts.createCall(
                                                ts.createPropertyAccess(
                                                    ts.createIdentifier("inputs"),
                                                    ts.createIdentifier("next")
                                                ),
                                                undefined,
                                                []
                                            ),
                                            ts.createIdentifier("then")
                                        ),
                                        undefined,
                                        [ts.createArrowFunction(
                                            undefined,
                                            undefined,
                                            [ts.createParameter(
                                                undefined,
                                                undefined,
                                                undefined,
                                                ts.createIdentifier("r"),
                                                undefined,
                                                undefined,
                                                undefined
                                            )],
                                            undefined,
                                            ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                            ts.createBlock(
                                                [ts.createIf(
                                                    ts.createPropertyAccess(
                                                        ts.createIdentifier("r"),
                                                        ts.createIdentifier("done")
                                                    ),
                                                    ts.createExpressionStatement(ts.createCall(
                                                        ts.createPropertyAccess(
                                                            ts.createPropertyAccess(
                                                                ts.createIdentifier("call"),
                                                                ts.createIdentifier("request")
                                                            ),
                                                            ts.createIdentifier("complete")
                                                        ),
                                                        undefined,
                                                        []
                                                    )),
                                                    ts.createReturn(ts.createCall(
                                                        ts.createPropertyAccess(
                                                            ts.createCall(
                                                                ts.createPropertyAccess(
                                                                    ts.createPropertyAccess(
                                                                        ts.createIdentifier("call"),
                                                                        ts.createIdentifier("request")
                                                                    ),
                                                                    ts.createIdentifier("send")
                                                                ),
                                                                undefined,
                                                                [ts.createPropertyAccess(
                                                                    ts.createIdentifier("r"),
                                                                    ts.createIdentifier("value")
                                                                )]
                                                            ),
                                                            ts.createIdentifier("then")
                                                        ),
                                                        undefined,
                                                        [ts.createIdentifier("send")]
                                                    ))
                                                )],
                                                true
                                            )
                                        )]
                                    )
                                )
                            )],
                            ts.NodeFlags.Const
                        )
                    ),

                    //error the input stream on send error
                    ts.addSyntheticLeadingComment(
                        ts.createExpressionStatement(ts.createCall(
                            ts.createPropertyAccess(
                                ts.createCall(
                                    ts.createIdentifier("send"),
                                    undefined,
                                    []
                                ),
                                ts.createIdentifier("catch")
                            ),
                            undefined,
                            [ts.createArrowFunction(
                                undefined,
                                undefined,
                                [ts.createParameter(
                                    undefined,
                                    undefined,
                                    undefined,
                                    ts.createIdentifier("e"),
                                    undefined,
                                    undefined,
                                    undefined
                                )],
                                undefined,
                                ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                ts.createBlock(
                                    [ts.createIf(
                                        ts.createBinary(
                                            ts.createBinary(
                                                ts.createPropertyAccess(
                                                    ts.createIdentifier("inputs"),
                                                    ts.createIdentifier("throw")
                                                ),
                                                ts.createToken(ts.SyntaxKind.AmpersandAmpersandToken),
                                                ts.createPrefix(
                                                    ts.SyntaxKind.ExclamationToken,
                                                    ts.createParen(ts.createBinary(
                                                        ts.createIdentifier("e"),
                                                        ts.createToken(ts.SyntaxKind.InstanceOfKeyword),
                                                        ts.createIdentifier(RpcError)
                                                    ))
                                                )
                                            ),
                                            ts.createToken(ts.SyntaxKind.BarBarToken),
                                            ts.createBinary(
                                                ts.createPropertyAccess(
                                                    ts.createIdentifier("e"),
                                                    ts.createIdentifier("code")
                                                ),
                                                ts.createToken(ts.SyntaxKind.ExclamationEqualsEqualsToken),
                                                ts.createStringLiteral("CANCELLED")
                                            )
                                        ),
                                        ts.createExpressionStatement(ts.createCall(
                                            ts.createNonNullExpression(ts.createPropertyAccess(
                                                ts.createIdentifier("inputs"),
                                                ts.createIdentifier("throw")
                                            )),
                                            undefined,
                                            [ts.createIdentifier("e")]
                                        )),
                                        undefined
                                    )],
                                    true
                                )
                            )]
                        )),
                        SyntaxKind.SingleLineCommentTrivia, "error the input stream on send error", false
                    ),

                    //handle cancellation
                    ts.addSyntheticLeadingComment(
                        ts.createIf(
                            ts.createPropertyAccess(
                                ts.createIdentifier("opt"),
                                ts.createIdentifier("abort")
                            ),
                            ts.createBlock(
                                [ts.createExpressionStatement(ts.createCall(
                                    ts.createPropertyAccess(
                                        ts.createPropertyAccess(
                                            ts.createIdentifier("opt"),
                                            ts.createIdentifier("abort")
                                        ),
                                        ts.createIdentifier("addEventListener")
                                    ),
                                    undefined,
                                    [
                                        ts.createStringLiteral("abort"),
                                        ts.createArrowFunction(
                                            undefined,
                                            undefined,
                                            [],
                                            undefined,
                                            ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                            ts.createBlock(
                                                [
                                                    ts.createVariableStatement(
                                                        undefined,
                                                        ts.createVariableDeclarationList(
                                                            [ts.createVariableDeclaration(
                                                                ts.createIdentifier("e"),
                                                                undefined,
                                                                ts.createNew(
                                                                    ts.createIdentifier(RpcError),
                                                                    undefined,
                                                                    [
                                                                        ts.createStringLiteral("user cancel"),
                                                                        ts.createStringLiteral("CANCELLED")
                                                                    ]
                                                                )
                                                            )],
                                                            ts.NodeFlags.Const
                                                        )
                                                    ),
                                                    ts.createExpressionStatement(ts.createCall(
                                                        ts.createPropertyAccess(
                                                            ts.createIdentifier("outputs"),
                                                            ts.createIdentifier("notifyError")
                                                        ),
                                                        undefined,
                                                        [ts.createIdentifier("e")]
                                                    )),
                                                    ts.createIf(
                                                        ts.createPropertyAccess(
                                                            ts.createIdentifier("inputs"),
                                                            ts.createIdentifier("throw")
                                                        ),
                                                        ts.createExpressionStatement(ts.createCall(
                                                            ts.createPropertyAccess(
                                                                ts.createIdentifier("inputs"),
                                                                ts.createIdentifier("throw")
                                                            ),
                                                            undefined,
                                                            [ts.createIdentifier("e")]
                                                        )),
                                                        undefined
                                                    )
                                                ],
                                                true
                                            )
                                        )
                                    ]
                                ))],
                                true
                            ),
                            undefined
                        ),
                        SyntaxKind.SingleLineCommentTrivia, "handle cancellation", false
                    ),

                    // forward response messages
                    ts.addSyntheticLeadingComment(
                        ts.createExpressionStatement(ts.createCall(
                            ts.createPropertyAccess(
                                ts.createPropertyAccess(
                                    ts.createIdentifier("call"),
                                    ts.createIdentifier("response")
                                ),
                                ts.createIdentifier("onNext")
                            ),
                            undefined,
                            [ts.createCall(
                                ts.createPropertyAccess(
                                    ts.createPropertyAccess(
                                        ts.createIdentifier("outputs"),
                                        ts.createIdentifier("notifyNext")
                                    ),
                                    ts.createIdentifier("bind")
                                ),
                                undefined,
                                [ts.createIdentifier("outputs")]
                            )]
                        )),
                        SyntaxKind.SingleLineCommentTrivia, "forward response messages", false
                    ),
                    ts.createExpressionStatement(ts.createCall(
                        ts.createPropertyAccess(
                            ts.createPropertyAccess(
                                ts.createIdentifier("call"),
                                ts.createIdentifier("status")
                            ),
                            ts.createIdentifier("catch")
                        ),
                        undefined,
                        [ts.createArrowFunction(
                            undefined,
                            undefined,
                            [ts.createParameter(
                                undefined,
                                undefined,
                                undefined,
                                ts.createIdentifier("e"),
                                undefined,
                                undefined,
                                undefined
                            )],
                            undefined,
                            ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                            ts.createBinary(
                                ts.createPropertyAccess(
                                    ts.createIdentifier("outputs"),
                                    ts.createIdentifier("closed")
                                ),
                                ts.createToken(ts.SyntaxKind.BarBarToken),
                                ts.createCall(
                                    ts.createPropertyAccess(
                                        ts.createIdentifier("outputs"),
                                        ts.createIdentifier("notifyError")
                                    ),
                                    undefined,
                                    [ts.createIdentifier("e")]
                                )
                            )
                        )]
                    )),
                    ts.createReturn(ts.createIdentifier("outputs"))

                ],
                true
            )
        );
    }


}
