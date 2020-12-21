import * as ts from "typescript";
import {SyntaxKind} from "typescript";
import * as rpc from "@protobuf-ts/runtime-rpc";
import {ServiceClientGeneratorBase} from "./service-client-generator-base";
import {assert} from "@protobuf-ts/runtime";
import {TypescriptFile} from "@protobuf-ts/plugin-framework";


export class ServiceClientGeneratorRxjs extends ServiceClientGeneratorBase {


     readonly symbolKindInterface = 'rx-client-interface';
     readonly symbolKindImplementation = 'rx-client';


    createUnary(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodDeclaration {
        let RpcOptions = this.imports.name(source, 'RpcOptions', this.options.runtimeRpcImportPath);
        let RpcError = this.imports.name(source, "RpcError", this.options.runtimeRpcImportPath);
        let stackIntercept = this.imports.name(source, "stackIntercept", this.options.runtimeRpcImportPath);
        let Observable = this.imports.name(source, 'Observable', "rxjs");
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
                Observable,
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

                    // const abort = new globalThis.AbortController();
                    ts.addSyntheticLeadingComment(
                        ts.createVariableStatement(
                            undefined,
                            ts.createVariableDeclarationList(
                                [ts.createVariableDeclaration(
                                    ts.createIdentifier("abort"),
                                    undefined,
                                    ts.createNew(
                                        ts.createPropertyAccess(
                                            ts.createIdentifier("globalThis"),
                                            ts.createIdentifier("AbortController")
                                        ),
                                        undefined,
                                        []
                                    )
                                )],
                                ts.NodeFlags.Const
                            )
                        ),
                        ts.SyntaxKind.SingleLineCommentTrivia,
                        " setup own abort signal because we want to be able to abort on unsubscribe()"
                    ),

                    // opt.abort?.addEventListener("abort", () => abort.abort());
                    ts.createExpressionStatement(ts.createCallChain(
                        ts.createPropertyAccessChain(
                            ts.createPropertyAccess(
                                ts.createIdentifier("opt"),
                                ts.createIdentifier("abort")
                            ),
                            ts.createToken(ts.SyntaxKind.QuestionDotToken),
                            ts.createIdentifier("addEventListener")
                        ),
                        undefined,
                        undefined,
                        [
                            ts.createStringLiteral("abort"),
                            ts.createArrowFunction(
                                undefined,
                                undefined,
                                [],
                                undefined,
                                ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                ts.createCall(
                                    ts.createPropertyAccess(
                                        ts.createIdentifier("abort"),
                                        ts.createIdentifier("abort")
                                    ),
                                    undefined,
                                    []
                                )
                            )
                        ]
                    )),

                    // opt.abort = abort.signal;
                    ts.createExpressionStatement(ts.createBinary(
                        ts.createPropertyAccess(
                            ts.createIdentifier("opt"),
                            ts.createIdentifier("abort")
                        ),
                        ts.createToken(ts.SyntaxKind.EqualsToken),
                        ts.createPropertyAccess(
                            ts.createIdentifier("abort"),
                            ts.createIdentifier("signal")
                        )
                    )),

                    ts.createReturn(ts.createNew(
                        ts.createIdentifier(Observable),
                        [this.makeO(source, methodInfo)],
                        [ts.createArrowFunction(
                            undefined,
                            undefined,
                            [ts.createParameter(
                                undefined,
                                undefined,
                                undefined,
                                ts.createIdentifier("subscriber"),
                                undefined,
                                undefined,
                                undefined
                            )],
                            undefined,
                            ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                            ts.createBlock(
                                [

                                    // subscriber.add(() => abort.abort());
                                    ts.addSyntheticLeadingComment(
                                        ts.createExpressionStatement(ts.createCall(
                                            ts.createPropertyAccess(
                                                ts.createIdentifier("subscriber"),
                                                ts.createIdentifier("add")
                                            ),
                                            undefined,
                                            [ts.createArrowFunction(
                                                undefined,
                                                undefined,
                                                [],
                                                undefined,
                                                ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                                ts.createCall(
                                                    ts.createPropertyAccess(
                                                        ts.createIdentifier("abort"),
                                                        ts.createIdentifier("abort")
                                                    ),
                                                    undefined,
                                                    []
                                                )
                                            )]
                                        )),
                                        ts.SyntaxKind.SingleLineCommentTrivia,
                                        " cancel call on unsubscribe"
                                    ),

                                    ts.addSyntheticLeadingComment(
                                        ts.createExpressionStatement(ts.createCall(
                                            ts.createPropertyAccess(
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
                                                ),
                                                ts.createIdentifier("then")
                                            ),
                                            undefined,
                                            [
                                                ts.createArrowFunction(
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
                                                    ts.createBlock(
                                                        [
                                                            ts.addSyntheticLeadingComment(
                                                                ts.createExpressionStatement(ts.createCall(
                                                                    ts.createPropertyAccess(
                                                                        ts.createIdentifier("subscriber"),
                                                                        ts.createIdentifier("next")
                                                                    ),
                                                                    undefined,
                                                                    [ts.createPropertyAccess(
                                                                        ts.createIdentifier("finished"),
                                                                        ts.createIdentifier("response")
                                                                    )]
                                                                )),
                                                                ts.SyntaxKind.SingleLineCommentTrivia, " resolved: emit message and complete"
                                                            ),
                                                            ts.createExpressionStatement(ts.createCall(
                                                                ts.createPropertyAccess(
                                                                    ts.createIdentifier("subscriber"),
                                                                    ts.createIdentifier("complete")
                                                                ),
                                                                undefined,
                                                                []
                                                            ))
                                                        ],
                                                        true
                                                    )
                                                ),
                                                ts.createArrowFunction(
                                                    undefined,
                                                    undefined,
                                                    [ts.createParameter(
                                                        undefined,
                                                        undefined,
                                                        undefined,
                                                        ts.createIdentifier("reason"),
                                                        undefined,
                                                        undefined,
                                                        undefined
                                                    )],
                                                    undefined,
                                                    ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                                    ts.createBlock(
                                                        [
                                                            ts.addSyntheticLeadingComment(
                                                                ts.createIf(
                                                                    ts.createBinary(
                                                                        ts.createBinary(
                                                                            ts.createIdentifier("reason"),
                                                                            ts.createToken(ts.SyntaxKind.InstanceOfKeyword),
                                                                            ts.createIdentifier(RpcError)
                                                                        ),
                                                                        ts.createToken(ts.SyntaxKind.AmpersandAmpersandToken),
                                                                        ts.createBinary(
                                                                            ts.createCall(
                                                                                ts.createPropertyAccess(
                                                                                    ts.createPropertyAccess(
                                                                                        ts.createIdentifier("reason"),
                                                                                        ts.createIdentifier("code")
                                                                                    ),
                                                                                    ts.createIdentifier("toUpperCase")
                                                                                ),
                                                                                undefined,
                                                                                []
                                                                            ),
                                                                            ts.createToken(ts.SyntaxKind.EqualsEqualsToken),
                                                                            ts.createStringLiteral("CANCELLED")
                                                                        )
                                                                    ),
                                                                    ts.createExpressionStatement(ts.createCall(
                                                                        ts.createPropertyAccess(
                                                                            ts.createIdentifier("subscriber"),
                                                                            ts.createIdentifier("complete")
                                                                        ),
                                                                        undefined,
                                                                        []
                                                                    )),
                                                                    ts.createExpressionStatement(ts.createCall(
                                                                        ts.createPropertyAccess(
                                                                            ts.createIdentifier("subscriber"),
                                                                            ts.createIdentifier("error")
                                                                        ),
                                                                        undefined,
                                                                        [ts.createIdentifier("reason")]
                                                                    ))
                                                                ),
                                                                ts.SyntaxKind.SingleLineCommentTrivia, " rejected: complete if cancellation, otherwise emit error"
                                                            )
                                                        ],
                                                        true
                                                    )
                                                )
                                            ]
                                        )),
                                        ts.SyntaxKind.SingleLineCommentTrivia,
                                        " wait for the call to finish"
                                    )
                                ],
                                true
                            )
                        )]
                    )),


                ],
                true
            )
        );
    }


    createServerStreaming(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodDeclaration {
        let RpcOptions = this.imports.name(source, 'RpcOptions', this.options.runtimeRpcImportPath);
        let RpcError = this.imports.name(source, 'RpcError', this.options.runtimeRpcImportPath);
        let stackIntercept = this.imports.name(source, 'stackIntercept', this.options.runtimeRpcImportPath);
        let Observable = this.imports.name(source, "Observable", "rxjs");
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
                Observable,
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

                    // const abort = new globalThis.AbortController();
                    ts.addSyntheticLeadingComment(
                        ts.createVariableStatement(
                            undefined,
                            ts.createVariableDeclarationList(
                                [ts.createVariableDeclaration(
                                    ts.createIdentifier("abort"),
                                    undefined,
                                    ts.createNew(
                                        ts.createPropertyAccess(
                                            ts.createIdentifier("globalThis"),
                                            ts.createIdentifier("AbortController")
                                        ),
                                        undefined,
                                        []
                                    )
                                )],
                                ts.NodeFlags.Const
                            )
                        ),
                        ts.SyntaxKind.SingleLineCommentTrivia,
                        " setup own abort signal because we want to be able to abort on unsubscribe()"
                    ),

                    // opt.abort?.addEventListener("abort", () => abort.abort());
                    ts.createExpressionStatement(ts.createCallChain(
                        ts.createPropertyAccessChain(
                            ts.createPropertyAccess(
                                ts.createIdentifier("opt"),
                                ts.createIdentifier("abort")
                            ),
                            ts.createToken(ts.SyntaxKind.QuestionDotToken),
                            ts.createIdentifier("addEventListener")
                        ),
                        undefined,
                        undefined,
                        [
                            ts.createStringLiteral("abort"),
                            ts.createArrowFunction(
                                undefined,
                                undefined,
                                [],
                                undefined,
                                ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                ts.createCall(
                                    ts.createPropertyAccess(
                                        ts.createIdentifier("abort"),
                                        ts.createIdentifier("abort")
                                    ),
                                    undefined,
                                    []
                                )
                            )
                        ]
                    )),

                    // opt.abort = abort.signal;
                    ts.createExpressionStatement(ts.createBinary(
                        ts.createPropertyAccess(
                            ts.createIdentifier("opt"),
                            ts.createIdentifier("abort")
                        ),
                        ts.createToken(ts.SyntaxKind.EqualsToken),
                        ts.createPropertyAccess(
                            ts.createIdentifier("abort"),
                            ts.createIdentifier("signal")
                        )
                    )),

                    ts.createReturn(ts.createNew(
                        ts.createIdentifier(Observable),
                        [
                            this.makeO(source, methodInfo)
                        ],
                        [ts.createArrowFunction(
                            undefined,
                            undefined,
                            [ts.createParameter(
                                undefined,
                                undefined,
                                undefined,
                                ts.createIdentifier("subscriber"),
                                undefined,
                                undefined,
                                undefined
                            )],
                            undefined,
                            ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                            ts.createBlock(
                                [

                                    // subscriber.add(() => abort.abort());
                                    ts.addSyntheticLeadingComment(
                                        ts.createExpressionStatement(ts.createCall(
                                            ts.createPropertyAccess(
                                                ts.createIdentifier("subscriber"),
                                                ts.createIdentifier("add")
                                            ),
                                            undefined,
                                            [ts.createArrowFunction(
                                                undefined,
                                                undefined,
                                                [],
                                                undefined,
                                                ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                                ts.createCall(
                                                    ts.createPropertyAccess(
                                                        ts.createIdentifier("abort"),
                                                        ts.createIdentifier("abort")
                                                    ),
                                                    undefined,
                                                    []
                                                )
                                            )]
                                        )),
                                        ts.SyntaxKind.SingleLineCommentTrivia,
                                        " cancel call on unsubscribe"
                                    ),

                                    // const onErr = (reason: Error) => {...
                                    ts.createVariableStatement(
                                        undefined,
                                        ts.createVariableDeclarationList(
                                            [ts.createVariableDeclaration(
                                                ts.createIdentifier("onErr"),
                                                undefined,
                                                ts.createArrowFunction(
                                                    undefined,
                                                    undefined,
                                                    [ts.createParameter(
                                                        undefined,
                                                        undefined,
                                                        undefined,
                                                        ts.createIdentifier("reason"),
                                                        undefined,
                                                        ts.createTypeReferenceNode(
                                                            ts.createQualifiedName(
                                                                ts.createIdentifier("globalThis"),
                                                                ts.createIdentifier("Error")
                                                            ),
                                                            undefined
                                                        ),
                                                        undefined
                                                    )],
                                                    undefined,
                                                    ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                                    ts.createBlock(
                                                        [ts.createIf(
                                                            ts.createPrefix(
                                                                ts.SyntaxKind.ExclamationToken,
                                                                ts.createPropertyAccess(
                                                                    ts.createIdentifier("subscriber"),
                                                                    ts.createIdentifier("closed")
                                                                )
                                                            ),
                                                            ts.createBlock(
                                                                [ts.createIf(
                                                                    ts.createBinary(
                                                                        ts.createBinary(
                                                                            ts.createIdentifier("reason"),
                                                                            ts.createToken(ts.SyntaxKind.InstanceOfKeyword),
                                                                            ts.createIdentifier("RpcError")
                                                                        ),
                                                                        ts.createToken(ts.SyntaxKind.AmpersandAmpersandToken),
                                                                        ts.createBinary(
                                                                            ts.createCall(
                                                                                ts.createPropertyAccess(
                                                                                    ts.createPropertyAccess(
                                                                                        ts.createIdentifier("reason"),
                                                                                        ts.createIdentifier("code")
                                                                                    ),
                                                                                    ts.createIdentifier("toUpperCase")
                                                                                ),
                                                                                undefined,
                                                                                []
                                                                            ),
                                                                            ts.createToken(ts.SyntaxKind.EqualsEqualsToken),
                                                                            ts.createStringLiteral("CANCELLED")
                                                                        )
                                                                    ),
                                                                    ts.createExpressionStatement(ts.createCall(
                                                                        ts.createPropertyAccess(
                                                                            ts.createIdentifier("subscriber"),
                                                                            ts.createIdentifier("complete")
                                                                        ),
                                                                        undefined,
                                                                        []
                                                                    )),
                                                                    ts.createExpressionStatement(ts.createCall(
                                                                        ts.createPropertyAccess(
                                                                            ts.createIdentifier("subscriber"),
                                                                            ts.createIdentifier("error")
                                                                        ),
                                                                        undefined,
                                                                        [ts.createIdentifier("reason")]
                                                                    ))
                                                                )],
                                                                true
                                                            ),
                                                            undefined
                                                        )],
                                                        true
                                                    )
                                                )
                                            )],
                                            ts.NodeFlags.Const
                                        )
                                    ),

                                    // const call = stackIntercept<StringValue, Int32Value>("serverStreaming", this._transport, method, opt, i);
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
                                                        this.makeO(source, methodInfo),
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

                                    // call.headers.catch(onErr);
                                    ts.createExpressionStatement(ts.createCall(
                                        ts.createPropertyAccess(
                                            ts.createPropertyAccess(
                                                ts.createIdentifier("call"),
                                                ts.createIdentifier("headers")
                                            ),
                                            ts.createIdentifier("catch")
                                        ),
                                        undefined,
                                        [ts.createIdentifier("onErr")]
                                    )),

                                    // call.response.onMessage(message => subscriber.next(message));
                                    ts.createExpressionStatement(ts.createCall(
                                        ts.createPropertyAccess(
                                            ts.createPropertyAccess(
                                                ts.createIdentifier("call"),
                                                ts.createIdentifier("response")
                                            ),
                                            ts.createIdentifier("onMessage")
                                        ),
                                        undefined,
                                        [ts.createArrowFunction(
                                            undefined,
                                            undefined,
                                            [ts.createParameter(
                                                undefined,
                                                undefined,
                                                undefined,
                                                ts.createIdentifier("message"),
                                                undefined,
                                                undefined
                                            )],
                                            undefined,
                                            ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                            ts.createCall(
                                                ts.createPropertyAccess(
                                                    ts.createIdentifier("subscriber"),
                                                    ts.createIdentifier("next")
                                                ),
                                                undefined,
                                                [ts.createIdentifier("message")]
                                            )
                                        )]
                                    )),

                                    // call.response.onComplete(() => subscriber.closed || subscriber.complete());
                                    ts.createExpressionStatement(ts.createCall(
                                        ts.createPropertyAccess(
                                            ts.createPropertyAccess(
                                                ts.createIdentifier("call"),
                                                ts.createIdentifier("response")
                                            ),
                                            ts.createIdentifier("onComplete")
                                        ),
                                        undefined,
                                        [ts.createArrowFunction(
                                            undefined,
                                            undefined,
                                            [],
                                            undefined,
                                            ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                            ts.createBinary(
                                                ts.createPropertyAccess(
                                                    ts.createIdentifier("subscriber"),
                                                    ts.createIdentifier("closed")
                                                ),
                                                ts.createToken(ts.SyntaxKind.BarBarToken),
                                                ts.createCall(
                                                    ts.createPropertyAccess(
                                                        ts.createIdentifier("subscriber"),
                                                        ts.createIdentifier("complete")
                                                    ),
                                                    undefined,
                                                    []
                                                )
                                            )
                                        )]
                                    )),

                                    // call.response.onError(onErr);
                                    ts.createExpressionStatement(ts.createCall(
                                        ts.createPropertyAccess(
                                            ts.createPropertyAccess(
                                                ts.createIdentifier("call"),
                                                ts.createIdentifier("response")
                                            ),
                                            ts.createIdentifier("onError")
                                        ),
                                        undefined,
                                        [ts.createIdentifier("onErr")]
                                    )),

                                    // call.status.catch(onErr);
                                    ts.createExpressionStatement(ts.createCall(
                                        ts.createPropertyAccess(
                                            ts.createPropertyAccess(
                                                ts.createIdentifier("call"),
                                                ts.createIdentifier("status")
                                            ),
                                            ts.createIdentifier("catch")
                                        ),
                                        undefined,
                                        [ts.createIdentifier("onErr")]
                                    )),

                                    // call.trailers.catch(onErr);
                                    ts.createExpressionStatement(ts.createCall(
                                        ts.createPropertyAccess(
                                            ts.createPropertyAccess(
                                                ts.createIdentifier("call"),
                                                ts.createIdentifier("trailers")
                                            ),
                                            ts.createIdentifier("catch")
                                        ),
                                        undefined,
                                        [ts.createIdentifier("onErr")]
                                    )),

                                ],
                                true
                            )
                        )]
                    ))

                ],
                true
            )
        );
    }


    createClientStreaming(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodDeclaration {
        let RpcOptions = this.imports.name(source, 'RpcOptions', this.options.runtimeRpcImportPath);
        let RpcError = this.imports.name(source, 'RpcError', this.options.runtimeRpcImportPath);
        let stackIntercept = this.imports.name(source, "stackIntercept", this.options.runtimeRpcImportPath);
        let Observable = this.imports.name(source, 'Observable', "rxjs");
        let from = this.imports.name(source, 'from', "rxjs");
        let switchMap = this.imports.name(source, 'switchMap', "rxjs/operators");
        let concatMap = this.imports.name(source, 'concatMap', "rxjs/operators");
        let methodIndex = methodInfo.service.methods.indexOf(methodInfo);
        assert(methodIndex >= 0);

        return ts.createMethod(
            undefined, undefined, undefined,
            ts.createIdentifier(methodInfo.localName),
            undefined, undefined,
            [
                ts.createParameter(
                    undefined, undefined, undefined, ts.createIdentifier("input"), undefined,
                    ts.createTypeReferenceNode(ts.createIdentifier(Observable), [this.makeI(source, methodInfo),]), undefined
                ),
                ts.createParameter(
                    undefined, undefined, undefined, ts.createIdentifier("options"), ts.createToken(ts.SyntaxKind.QuestionToken),
                    ts.createTypeReferenceNode(ts.createIdentifier(RpcOptions), undefined), undefined
                )
            ],
            ts.createTypeReferenceNode(
                Observable,
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

                    // setup own abort signal because we want to abort on unsubscribe()
                    ts.addSyntheticLeadingComment(
                        ts.createVariableStatement(
                            undefined,
                            ts.createVariableDeclarationList(
                                [ts.createVariableDeclaration(
                                    ts.createIdentifier("abort"),
                                    undefined,
                                    ts.createNew(
                                        ts.createPropertyAccess(
                                            ts.createIdentifier("globalThis"),
                                            ts.createIdentifier("AbortController")
                                        ),
                                        undefined,
                                        []
                                    )
                                )],
                                ts.NodeFlags.Const
                            )
                        ),
                        SyntaxKind.SingleLineCommentTrivia, "setup own abort signal because we want to abort on unsubscribe()", false
                    ),
                    ts.createExpressionStatement(ts.createCallChain(
                        ts.createPropertyAccessChain(
                            ts.createPropertyAccess(
                                ts.createIdentifier("opt"),
                                ts.createIdentifier("abort")
                            ),
                            ts.createToken(ts.SyntaxKind.QuestionDotToken),
                            ts.createIdentifier("addEventListener")
                        ),
                        undefined,
                        undefined,
                        [
                            ts.createStringLiteral("abort"),
                            ts.createArrowFunction(
                                undefined,
                                undefined,
                                [],
                                undefined,
                                ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                ts.createCall(
                                    ts.createPropertyAccess(
                                        ts.createIdentifier("abort"),
                                        ts.createIdentifier("abort")
                                    ),
                                    undefined,
                                    []
                                )
                            )
                        ]
                    )),
                    ts.createExpressionStatement(ts.createBinary(
                        ts.createPropertyAccess(
                            ts.createIdentifier("opt"),
                            ts.createIdentifier("abort")
                        ),
                        ts.createToken(ts.SyntaxKind.EqualsToken),
                        ts.createPropertyAccess(
                            ts.createIdentifier("abort"),
                            ts.createIdentifier("signal")
                        )
                    )),


                    // return an observable that completes when the server closes the request
                    ts.addSyntheticLeadingComment(
                        ts.createReturn(ts.createNew(
                            ts.createIdentifier(Observable),
                            [
                                this.makeO(source, methodInfo)
                            ],
                            [ts.createArrowFunction(
                                undefined,
                                undefined,
                                [ts.createParameter(
                                    undefined,
                                    undefined,
                                    undefined,
                                    ts.createIdentifier("subscriber"),
                                    undefined,
                                    undefined,
                                    undefined
                                )],
                                undefined,
                                ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                ts.createBlock(
                                    [

                                        // cancel call on unsubscribe
                                        ts.addSyntheticLeadingComment(
                                            ts.createExpressionStatement(ts.createCall(
                                                ts.createPropertyAccess(
                                                    ts.createIdentifier("subscriber"),
                                                    ts.createIdentifier("add")
                                                ),
                                                undefined,
                                                [ts.createArrowFunction(
                                                    undefined,
                                                    undefined,
                                                    [],
                                                    undefined,
                                                    ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                                    ts.createCall(
                                                        ts.createPropertyAccess(
                                                            ts.createIdentifier("abort"),
                                                            ts.createIdentifier("abort")
                                                        ),
                                                        undefined,
                                                        []
                                                    )
                                                )]
                                            )),
                                            SyntaxKind.SingleLineCommentTrivia, "cancel call on unsubscribe", true
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
                                                            [
                                                                this.makeI(source, methodInfo),
                                                                this.makeO(source, methodInfo),
                                                            ],
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
                                            SyntaxKind.SingleLineCommentTrivia, "start the call", true
                                        ),

                                        // map request and response errors to error our observable, but ignore cancellation
                                        ts.addSyntheticLeadingComment(
                                            ts.createVariableStatement(
                                                undefined,
                                                ts.createVariableDeclarationList(
                                                    [ts.createVariableDeclaration(
                                                        ts.createIdentifier("onErr"),
                                                        undefined,
                                                        ts.createArrowFunction(
                                                            undefined,
                                                            undefined,
                                                            [ts.createParameter(
                                                                undefined,
                                                                undefined,
                                                                undefined,
                                                                ts.createIdentifier("reason"),
                                                                undefined,
                                                                ts.createTypeReferenceNode(
                                                                    ts.createQualifiedName(
                                                                        ts.createIdentifier("globalThis"),
                                                                        ts.createIdentifier("Error")
                                                                    ),
                                                                    undefined
                                                                ),
                                                                undefined
                                                            )],
                                                            undefined,
                                                            ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                                            ts.createBlock(
                                                                [ts.createIf(
                                                                    ts.createPrefix(
                                                                        ts.SyntaxKind.ExclamationToken,
                                                                        ts.createPropertyAccess(
                                                                            ts.createIdentifier("subscriber"),
                                                                            ts.createIdentifier("closed")
                                                                        )
                                                                    ),
                                                                    ts.createIf(
                                                                        ts.createBinary(
                                                                            ts.createBinary(
                                                                                ts.createIdentifier("reason"),
                                                                                ts.createToken(ts.SyntaxKind.InstanceOfKeyword),
                                                                                ts.createIdentifier(RpcError)
                                                                            ),
                                                                            ts.createToken(ts.SyntaxKind.AmpersandAmpersandToken),
                                                                            ts.createBinary(
                                                                                ts.createCall(
                                                                                    ts.createPropertyAccess(
                                                                                        ts.createPropertyAccess(
                                                                                            ts.createIdentifier("reason"),
                                                                                            ts.createIdentifier("code")
                                                                                        ),
                                                                                        ts.createIdentifier("toUpperCase")
                                                                                    ),
                                                                                    undefined,
                                                                                    []
                                                                                ),
                                                                                ts.createToken(ts.SyntaxKind.EqualsEqualsToken),
                                                                                ts.createStringLiteral("CANCELLED")
                                                                            )
                                                                        ),
                                                                        ts.createExpressionStatement(ts.createCall(
                                                                            ts.createPropertyAccess(
                                                                                ts.createIdentifier("subscriber"),
                                                                                ts.createIdentifier("complete")
                                                                            ),
                                                                            undefined,
                                                                            []
                                                                        )),
                                                                        ts.createExpressionStatement(ts.createCall(
                                                                            ts.createPropertyAccess(
                                                                                ts.createIdentifier("subscriber"),
                                                                                ts.createIdentifier("error")
                                                                            ),
                                                                            undefined,
                                                                            [ts.createIdentifier("reason")]
                                                                        ))
                                                                    ),
                                                                    undefined
                                                                )],
                                                                true
                                                            )
                                                        )
                                                    )],
                                                    ts.NodeFlags.Const
                                                )
                                            ),
                                            SyntaxKind.SingleLineCommentTrivia, "map request and response errors to error our observable, but ignore cancellation", true
                                        ),


                                        // for every input value, send request message, then complete the request
                                        ts.addSyntheticLeadingComment(
                                            ts.createVariableStatement(
                                                undefined,
                                                ts.createVariableDeclarationList(
                                                    [ts.createVariableDeclaration(
                                                        ts.createIdentifier("inputSub"),
                                                        undefined,
                                                        ts.createCall(
                                                            ts.createPropertyAccess(
                                                                ts.createCall(
                                                                    ts.createPropertyAccess(
                                                                        ts.createIdentifier("input"),
                                                                        ts.createIdentifier("pipe")
                                                                    ),
                                                                    undefined,
                                                                    [
                                                                        ts.createCall(
                                                                            ts.createIdentifier(switchMap),
                                                                            undefined,
                                                                            [ts.createArrowFunction(
                                                                                undefined,
                                                                                undefined,
                                                                                [ts.createParameter(
                                                                                    undefined,
                                                                                    undefined,
                                                                                    undefined,
                                                                                    ts.createIdentifier("message"),
                                                                                    undefined,
                                                                                    undefined,
                                                                                    undefined
                                                                                )],
                                                                                undefined,
                                                                                ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                                                                ts.createCall(
                                                                                    ts.createIdentifier(from),
                                                                                    undefined,
                                                                                    [ts.createCall(
                                                                                        ts.createPropertyAccess(
                                                                                            ts.createPropertyAccess(
                                                                                                ts.createIdentifier("call"),
                                                                                                ts.createIdentifier("request")
                                                                                            ),
                                                                                            ts.createIdentifier("send")
                                                                                        ),
                                                                                        undefined,
                                                                                        [ts.createIdentifier("message")]
                                                                                    )]
                                                                                )
                                                                            )]
                                                                        ),
                                                                        ts.createCall(
                                                                            ts.createIdentifier(concatMap),
                                                                            undefined,
                                                                            [ts.createArrowFunction(
                                                                                undefined,
                                                                                undefined,
                                                                                [],
                                                                                undefined,
                                                                                ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                                                                ts.createCall(
                                                                                    ts.createIdentifier(from),
                                                                                    undefined,
                                                                                    [ts.createCall(
                                                                                        ts.createPropertyAccess(
                                                                                            ts.createPropertyAccess(
                                                                                                ts.createIdentifier("call"),
                                                                                                ts.createIdentifier("request")
                                                                                            ),
                                                                                            ts.createIdentifier("complete")
                                                                                        ),
                                                                                        undefined,
                                                                                        []
                                                                                    )]
                                                                                )
                                                                            )]
                                                                        )
                                                                    ]
                                                                ),
                                                                ts.createIdentifier("subscribe")
                                                            ),
                                                            undefined,
                                                            [
                                                                ts.createIdentifier("undefined"),
                                                                ts.createArrowFunction(
                                                                    undefined,
                                                                    undefined,
                                                                    [ts.createParameter(
                                                                        undefined,
                                                                        undefined,
                                                                        undefined,
                                                                        ts.createIdentifier("err"),
                                                                        undefined,
                                                                        undefined,
                                                                        undefined
                                                                    )],
                                                                    undefined,
                                                                    ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                                                    ts.createCall(
                                                                        ts.createIdentifier("onErr"),
                                                                        undefined,
                                                                        [ts.createIdentifier("err")]
                                                                    )
                                                                )
                                                            ]
                                                        )
                                                    )],
                                                    ts.NodeFlags.Const
                                                )
                                            ),
                                            SyntaxKind.SingleLineCommentTrivia, "for every input value, send request message, then complete the request", true
                                        ),


                                        // cancel input subscription when our observable is unsubscribed
                                        ts.addSyntheticLeadingComment(
                                            ts.createExpressionStatement(ts.createCall(
                                                ts.createPropertyAccess(
                                                    ts.createIdentifier("subscriber"),
                                                    ts.createIdentifier("add")
                                                ),
                                                undefined,
                                                [ts.createArrowFunction(
                                                    undefined,
                                                    undefined,
                                                    [],
                                                    undefined,
                                                    ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                                    ts.createCall(
                                                        ts.createPropertyAccess(
                                                            ts.createIdentifier("inputSub"),
                                                            ts.createIdentifier("unsubscribe")
                                                        ),
                                                        undefined,
                                                        []
                                                    )
                                                )]
                                            )),
                                            SyntaxKind.SingleLineCommentTrivia, "cancel input subscription when our observable is unsubscribed", true
                                        ),


                                        // wait for the call to finish, emit message and complete
                                        ts.addSyntheticLeadingComment(
                                            ts.createExpressionStatement(ts.createCall(
                                                ts.createPropertyAccess(
                                                    ts.createIdentifier("call"),
                                                    ts.createIdentifier("then")
                                                ),
                                                undefined,
                                                [
                                                    ts.createArrowFunction(
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
                                                        ts.createBlock(
                                                            [
                                                                ts.createExpressionStatement(ts.createCall(
                                                                    ts.createPropertyAccess(
                                                                        ts.createIdentifier("subscriber"),
                                                                        ts.createIdentifier("next")
                                                                    ),
                                                                    undefined,
                                                                    [ts.createPropertyAccess(
                                                                        ts.createIdentifier("finished"),
                                                                        ts.createIdentifier("response")
                                                                    )]
                                                                )),
                                                                ts.createExpressionStatement(ts.createCall(
                                                                    ts.createPropertyAccess(
                                                                        ts.createIdentifier("subscriber"),
                                                                        ts.createIdentifier("complete")
                                                                    ),
                                                                    undefined,
                                                                    []
                                                                ))
                                                            ],
                                                            true
                                                        )
                                                    ),
                                                    ts.createArrowFunction(
                                                        undefined,
                                                        undefined,
                                                        [ts.createParameter(
                                                            undefined,
                                                            undefined,
                                                            undefined,
                                                            ts.createIdentifier("reason"),
                                                            undefined,
                                                            undefined,
                                                            undefined
                                                        )],
                                                        undefined,
                                                        ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                                        ts.createCall(
                                                            ts.createIdentifier("onErr"),
                                                            undefined,
                                                            [ts.createIdentifier("reason")]
                                                        )
                                                    )
                                                ]
                                            )),
                                            SyntaxKind.SingleLineCommentTrivia, "wait for the call to finish, emit message and complete", true),
                                    ],
                                    true
                                )
                            )]
                            )
                        ), SyntaxKind.SingleLineCommentTrivia, "return an observable that completes when the server closes the request", true),

                ],
                true
            )
        );
    }


    createDuplexStreaming(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodDeclaration {
        let RpcOptions = this.imports.name(source, 'RpcOptions', this.options.runtimeRpcImportPath);
        let RpcError = this.imports.name(source, 'RpcError', this.options.runtimeRpcImportPath);
        let stackIntercept = this.imports.name(source, "stackIntercept", this.options.runtimeRpcImportPath);
        let Observable = this.imports.name(source, 'Observable', "rxjs");
        let from = this.imports.name(source, 'from', "rxjs");
        let switchMap = this.imports.name(source, 'switchMap', "rxjs/operators");
        let concatMap = this.imports.name(source, 'concatMap', "rxjs/operators");
        let methodIndex = methodInfo.service.methods.indexOf(methodInfo);
        assert(methodIndex >= 0);


        return ts.createMethod(
            undefined, undefined, undefined,
            ts.createIdentifier(methodInfo.localName),
            undefined, undefined,
            [
                ts.createParameter(
                    undefined, undefined, undefined, ts.createIdentifier("input"), undefined,
                    ts.createTypeReferenceNode(ts.createIdentifier(Observable), [this.makeI(source, methodInfo),]), undefined
                ),
                ts.createParameter(
                    undefined, undefined, undefined, ts.createIdentifier("options"), ts.createToken(ts.SyntaxKind.QuestionToken),
                    ts.createTypeReferenceNode(ts.createIdentifier(RpcOptions), undefined), undefined
                )
            ],
            ts.createTypeReferenceNode(
                Observable,
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

                    // setup own abort signal because we want to abort on unsubscribe()
                    ts.addSyntheticLeadingComment(
                        ts.createVariableStatement(
                            undefined,
                            ts.createVariableDeclarationList(
                                [ts.createVariableDeclaration(
                                    ts.createIdentifier("abort"),
                                    undefined,
                                    ts.createNew(
                                        ts.createPropertyAccess(
                                            ts.createIdentifier("globalThis"),
                                            ts.createIdentifier("AbortController")
                                        ),
                                        undefined,
                                        []
                                    )
                                )],
                                ts.NodeFlags.Const
                            )
                        ),
                        SyntaxKind.SingleLineCommentTrivia, "setup own abort signal because we want to abort on unsubscribe()", true
                    ),
                    ts.createExpressionStatement(ts.createCallChain(
                        ts.createPropertyAccessChain(
                            ts.createPropertyAccess(
                                ts.createIdentifier("opt"),
                                ts.createIdentifier("abort")
                            ),
                            ts.createToken(ts.SyntaxKind.QuestionDotToken),
                            ts.createIdentifier("addEventListener")
                        ),
                        undefined,
                        undefined,
                        [
                            ts.createStringLiteral("abort"),
                            ts.createArrowFunction(
                                undefined,
                                undefined,
                                [],
                                undefined,
                                ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                ts.createCall(
                                    ts.createPropertyAccess(
                                        ts.createIdentifier("abort"),
                                        ts.createIdentifier("abort")
                                    ),
                                    undefined,
                                    []
                                )
                            )
                        ]
                    )),
                    ts.createExpressionStatement(ts.createBinary(
                        ts.createPropertyAccess(
                            ts.createIdentifier("opt"),
                            ts.createIdentifier("abort")
                        ),
                        ts.createToken(ts.SyntaxKind.EqualsToken),
                        ts.createPropertyAccess(
                            ts.createIdentifier("abort"),
                            ts.createIdentifier("signal")
                        )
                    )),

                    // return an observable that completes when the server closes the request
                    ts.addSyntheticLeadingComment(
                        ts.createReturn(ts.createNew(
                            ts.createIdentifier(Observable),
                            [this.makeO(source, methodInfo)],
                            [ts.createArrowFunction(
                                undefined,
                                undefined,
                                [ts.createParameter(
                                    undefined,
                                    undefined,
                                    undefined,
                                    ts.createIdentifier("subscriber"),
                                    undefined,
                                    undefined,
                                    undefined
                                )],
                                undefined,
                                ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                ts.createBlock(
                                    [

                                        // cancel call on unsubscribe
                                        ts.addSyntheticLeadingComment(
                                            ts.createExpressionStatement(ts.createCall(
                                                ts.createPropertyAccess(
                                                    ts.createIdentifier("subscriber"),
                                                    ts.createIdentifier("add")
                                                ),
                                                undefined,
                                                [ts.createArrowFunction(
                                                    undefined,
                                                    undefined,
                                                    [],
                                                    undefined,
                                                    ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                                    ts.createCall(
                                                        ts.createPropertyAccess(
                                                            ts.createIdentifier("abort"),
                                                            ts.createIdentifier("abort")
                                                        ),
                                                        undefined,
                                                        []
                                                    )
                                                )]
                                            )), SyntaxKind.SingleLineCommentTrivia, "cancel call on unsubscribe", false
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
                                                            [
                                                                this.makeI(source, methodInfo),
                                                                this.makeO(source, methodInfo),
                                                            ],
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
                                            ), SyntaxKind.SingleLineCommentTrivia, "start the call", false
                                        ),

                                        // map request and response errors to error our observable, but ignore cancellation
                                        ts.addSyntheticLeadingComment(
                                            ts.createVariableStatement(
                                                undefined,
                                                ts.createVariableDeclarationList(
                                                    [ts.createVariableDeclaration(
                                                        ts.createIdentifier("onErr"),
                                                        undefined,
                                                        ts.createArrowFunction(
                                                            undefined,
                                                            undefined,
                                                            [ts.createParameter(
                                                                undefined,
                                                                undefined,
                                                                undefined,
                                                                ts.createIdentifier("reason"),
                                                                undefined,
                                                                ts.createTypeReferenceNode(
                                                                    ts.createQualifiedName(
                                                                        ts.createIdentifier("globalThis"),
                                                                        ts.createIdentifier("Error")
                                                                    ),
                                                                    undefined
                                                                ),
                                                                undefined
                                                            )],
                                                            undefined,
                                                            ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                                            ts.createBlock(
                                                                [ts.createIf(
                                                                    ts.createPrefix(
                                                                        ts.SyntaxKind.ExclamationToken,
                                                                        ts.createPropertyAccess(
                                                                            ts.createIdentifier("subscriber"),
                                                                            ts.createIdentifier("closed")
                                                                        )
                                                                    ),
                                                                    ts.createIf(
                                                                        ts.createBinary(
                                                                            ts.createBinary(
                                                                                ts.createIdentifier("reason"),
                                                                                ts.createToken(ts.SyntaxKind.InstanceOfKeyword),
                                                                                ts.createIdentifier(RpcError)
                                                                            ),
                                                                            ts.createToken(ts.SyntaxKind.AmpersandAmpersandToken),
                                                                            ts.createBinary(
                                                                                ts.createCall(
                                                                                    ts.createPropertyAccess(
                                                                                        ts.createPropertyAccess(
                                                                                            ts.createIdentifier("reason"),
                                                                                            ts.createIdentifier("code")
                                                                                        ),
                                                                                        ts.createIdentifier("toUpperCase")
                                                                                    ),
                                                                                    undefined,
                                                                                    []
                                                                                ),
                                                                                ts.createToken(ts.SyntaxKind.EqualsEqualsToken),
                                                                                ts.createStringLiteral("CANCELLED")
                                                                            )
                                                                        ),
                                                                        ts.createExpressionStatement(ts.createCall(
                                                                            ts.createPropertyAccess(
                                                                                ts.createIdentifier("subscriber"),
                                                                                ts.createIdentifier("complete")
                                                                            ),
                                                                            undefined,
                                                                            []
                                                                        )),
                                                                        ts.createExpressionStatement(ts.createCall(
                                                                            ts.createPropertyAccess(
                                                                                ts.createIdentifier("subscriber"),
                                                                                ts.createIdentifier("error")
                                                                            ),
                                                                            undefined,
                                                                            [ts.createIdentifier("reason")]
                                                                        ))
                                                                    ),
                                                                    undefined
                                                                )],
                                                                true
                                                            )
                                                        )
                                                    )],
                                                    ts.NodeFlags.Const
                                                )
                                            ), SyntaxKind.SingleLineCommentTrivia, "map request and response errors to error our observable, but ignore cancellation", false
                                        ),

                                        // for every input value, send request message, then complete the request
                                        ts.addSyntheticLeadingComment(
                                            ts.createVariableStatement(
                                                undefined,
                                                ts.createVariableDeclarationList(
                                                    [ts.createVariableDeclaration(
                                                        ts.createIdentifier("inputSub"),
                                                        undefined,
                                                        ts.createCall(
                                                            ts.createPropertyAccess(
                                                                ts.createCall(
                                                                    ts.createPropertyAccess(
                                                                        ts.createIdentifier("input"),
                                                                        ts.createIdentifier("pipe")
                                                                    ),
                                                                    undefined,
                                                                    [
                                                                        ts.createCall(
                                                                            ts.createIdentifier(switchMap),
                                                                            undefined,
                                                                            [ts.createArrowFunction(
                                                                                undefined,
                                                                                undefined,
                                                                                [ts.createParameter(
                                                                                    undefined,
                                                                                    undefined,
                                                                                    undefined,
                                                                                    ts.createIdentifier("message"),
                                                                                    undefined,
                                                                                    undefined,
                                                                                    undefined
                                                                                )],
                                                                                undefined,
                                                                                ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                                                                ts.createCall(
                                                                                    ts.createIdentifier(from),
                                                                                    undefined,
                                                                                    [ts.createCall(
                                                                                        ts.createPropertyAccess(
                                                                                            ts.createPropertyAccess(
                                                                                                ts.createIdentifier("call"),
                                                                                                ts.createIdentifier("request")
                                                                                            ),
                                                                                            ts.createIdentifier("send")
                                                                                        ),
                                                                                        undefined,
                                                                                        [ts.createIdentifier("message")]
                                                                                    )]
                                                                                )
                                                                            )]
                                                                        ),
                                                                        ts.createCall(
                                                                            ts.createIdentifier(concatMap),
                                                                            undefined,
                                                                            [ts.createArrowFunction(
                                                                                undefined,
                                                                                undefined,
                                                                                [],
                                                                                undefined,
                                                                                ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                                                                ts.createCall(
                                                                                    ts.createIdentifier(from),
                                                                                    undefined,
                                                                                    [ts.createCall(
                                                                                        ts.createPropertyAccess(
                                                                                            ts.createPropertyAccess(
                                                                                                ts.createIdentifier("call"),
                                                                                                ts.createIdentifier("request")
                                                                                            ),
                                                                                            ts.createIdentifier("complete")
                                                                                        ),
                                                                                        undefined,
                                                                                        []
                                                                                    )]
                                                                                )
                                                                            )]
                                                                        )
                                                                    ]
                                                                ),
                                                                ts.createIdentifier("subscribe")
                                                            ),
                                                            undefined,
                                                            [
                                                                ts.createIdentifier("undefined"),
                                                                ts.createArrowFunction(
                                                                    undefined,
                                                                    undefined,
                                                                    [ts.createParameter(
                                                                        undefined,
                                                                        undefined,
                                                                        undefined,
                                                                        ts.createIdentifier("err"),
                                                                        undefined,
                                                                        undefined,
                                                                        undefined
                                                                    )],
                                                                    undefined,
                                                                    ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                                                    ts.createCall(
                                                                        ts.createIdentifier("onErr"),
                                                                        undefined,
                                                                        [ts.createIdentifier("err")]
                                                                    )
                                                                )
                                                            ]
                                                        )
                                                    )],
                                                    ts.NodeFlags.Const
                                                )
                                            ),
                                            SyntaxKind.SingleLineCommentTrivia, "for every input value, send request message, then complete the request", false
                                        ),

                                        // cancel input subscription when our observable is unsubscribed
                                        ts.addSyntheticLeadingComment(
                                            ts.createExpressionStatement(ts.createCall(
                                                ts.createPropertyAccess(
                                                    ts.createIdentifier("subscriber"),
                                                    ts.createIdentifier("add")
                                                ),
                                                undefined,
                                                [ts.createArrowFunction(
                                                    undefined,
                                                    undefined,
                                                    [],
                                                    undefined,
                                                    ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                                    ts.createCall(
                                                        ts.createPropertyAccess(
                                                            ts.createIdentifier("inputSub"),
                                                            ts.createIdentifier("unsubscribe")
                                                        ),
                                                        undefined,
                                                        []
                                                    )
                                                )]
                                            )),
                                            SyntaxKind.SingleLineCommentTrivia, "cancel input subscription when our observable is unsubscribed", false
                                        ),

                                        // map response data to our observable
                                        ts.addSyntheticLeadingComment(
                                            ts.createExpressionStatement(ts.createCall(
                                                ts.createPropertyAccess(
                                                    ts.createPropertyAccess(
                                                        ts.createIdentifier("call"),
                                                        ts.createIdentifier("headers")
                                                    ),
                                                    ts.createIdentifier("catch")
                                                ),
                                                undefined,
                                                [ts.createIdentifier("onErr")]
                                            )),
                                            SyntaxKind.SingleLineCommentTrivia, "map response data to our observable", false
                                        ),
                                        ts.createExpressionStatement(ts.createCall(
                                            ts.createPropertyAccess(
                                                ts.createPropertyAccess(
                                                    ts.createIdentifier("call"),
                                                    ts.createIdentifier("response")
                                                ),
                                                ts.createIdentifier("onMessage")
                                            ),
                                            undefined,
                                            [ts.createArrowFunction(
                                                undefined,
                                                undefined,
                                                [ts.createParameter(
                                                    undefined,
                                                    undefined,
                                                    undefined,
                                                    ts.createIdentifier("message"),
                                                    undefined,
                                                    undefined,
                                                    undefined
                                                )],
                                                undefined,
                                                ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                                ts.createCall(
                                                    ts.createPropertyAccess(
                                                        ts.createIdentifier("subscriber"),
                                                        ts.createIdentifier("next")
                                                    ),
                                                    undefined,
                                                    [ts.createIdentifier("message")]
                                                )
                                            )]
                                        )),
                                        ts.createExpressionStatement(ts.createCall(
                                            ts.createPropertyAccess(
                                                ts.createPropertyAccess(
                                                    ts.createIdentifier("call"),
                                                    ts.createIdentifier("response")
                                                ),
                                                ts.createIdentifier("onComplete")
                                            ),
                                            undefined,
                                            [ts.createArrowFunction(
                                                undefined,
                                                undefined,
                                                [],
                                                undefined,
                                                ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
                                                ts.createBinary(
                                                    ts.createPropertyAccess(
                                                        ts.createIdentifier("subscriber"),
                                                        ts.createIdentifier("closed")
                                                    ),
                                                    ts.createToken(ts.SyntaxKind.BarBarToken),
                                                    ts.createCall(
                                                        ts.createPropertyAccess(
                                                            ts.createIdentifier("subscriber"),
                                                            ts.createIdentifier("complete")
                                                        ),
                                                        undefined,
                                                        []
                                                    )
                                                )
                                            )]
                                        )),
                                        ts.createExpressionStatement(ts.createCall(
                                            ts.createPropertyAccess(
                                                ts.createPropertyAccess(
                                                    ts.createIdentifier("call"),
                                                    ts.createIdentifier("response")
                                                ),
                                                ts.createIdentifier("onError")
                                            ),
                                            undefined,
                                            [ts.createIdentifier("onErr")]
                                        )),
                                        ts.createExpressionStatement(ts.createCall(
                                            ts.createPropertyAccess(
                                                ts.createPropertyAccess(
                                                    ts.createIdentifier("call"),
                                                    ts.createIdentifier("status")
                                                ),
                                                ts.createIdentifier("catch")
                                            ),
                                            undefined,
                                            [ts.createIdentifier("onErr")]
                                        )),
                                        ts.createExpressionStatement(ts.createCall(
                                            ts.createPropertyAccess(
                                                ts.createPropertyAccess(
                                                    ts.createIdentifier("call"),
                                                    ts.createIdentifier("trailers")
                                                ),
                                                ts.createIdentifier("catch")
                                            ),
                                            undefined,
                                            [ts.createIdentifier("onErr")]
                                        ))
                                    ],
                                    true
                                )
                            )]
                        )),
                        ts.SyntaxKind.SingleLineCommentTrivia, "return an observable that completes when the server closes the request", false
                    ),


                ],
                true
            )
        );
    }


}
