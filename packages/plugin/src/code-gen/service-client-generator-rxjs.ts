import {
    DescriptorProto,
    MethodDescriptorProto,
    StringFormat,
    TypescriptImportManager
} from "@protobuf-ts/plugin-framework";
import * as ts from "typescript";
import {Interpreter} from "../interpreter";
import {ClientMethodGenerator} from "./service-client-generator";


export class ServiceClientGeneratorRxjs implements ClientMethodGenerator {


    constructor(
        private readonly imports: TypescriptImportManager,
        private readonly interpreter: Interpreter,
        private readonly options: {
            runtimeRpcImportPath: string;
        },
    ) {
    }


    createUnary(methodDesc: MethodDescriptorProto, localName: string, methodIndex: number, inputTypeDesc: DescriptorProto, outputTypeDesc: DescriptorProto): ts.MethodDeclaration {
        let RpcOptions = this.imports.name('RpcOptions', this.options.runtimeRpcImportPath);
        let RpcError = this.imports.name("RpcError", this.options.runtimeRpcImportPath);
        let Observable = this.imports.name('Observable', "rxjs");

        return ts.createMethod(
            undefined, undefined, undefined,
            ts.createIdentifier(localName),
            undefined, undefined,
            [
                ts.createParameter(
                    undefined, undefined, undefined, ts.createIdentifier("input"), undefined,
                    ts.createTypeReferenceNode(ts.createIdentifier(this.imports.type(inputTypeDesc)), undefined)
                ),
                ts.createParameter(
                    undefined, undefined, undefined, ts.createIdentifier("options"), ts.createToken(ts.SyntaxKind.QuestionToken),
                    ts.createTypeReferenceNode(ts.createIdentifier(RpcOptions), undefined), undefined
                )
            ],
            ts.createTypeReferenceNode(
                Observable,
                [
                    ts.createTypeReferenceNode(this.imports.type(outputTypeDesc), undefined),
                ]
            ),
            ts.createBlock(
                [
                    // const method = this.methods[0], opt = this._transport.mergeOptions(options), i = method.I.create(input);
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
                                ts.createVariableDeclaration(
                                    ts.createIdentifier("i"),
                                    undefined,
                                    ts.createCall(
                                        ts.createPropertyAccess(
                                            ts.createPropertyAccess(ts.createIdentifier("method"), ts.createIdentifier("I")),
                                            ts.createIdentifier("create")
                                        ),
                                        undefined,
                                        [ts.createIdentifier("input")]
                                    )
                                )
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
                        [ts.createTypeReferenceNode(this.imports.type(outputTypeDesc), undefined)],
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
                                                    ts.createIdentifier("stackIntercept"),
                                                    [
                                                        ts.createTypeReferenceNode(this.imports.type(inputTypeDesc), undefined),
                                                        ts.createTypeReferenceNode(this.imports.type(outputTypeDesc), undefined)
                                                    ],
                                                    [
                                                        ts.createStringLiteral("unary"),
                                                        ts.createPropertyAccess(
                                                            ts.createThis(),
                                                            ts.createIdentifier("_transport")
                                                        ),
                                                        ts.createIdentifier("method"),
                                                        ts.createIdentifier("opt"),
                                                        ts.createIdentifier("i")
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


    createServerStreaming(methodDesc: MethodDescriptorProto, localName: string, methodIndex: number, inputTypeDesc: DescriptorProto, outputTypeDesc: DescriptorProto): ts.MethodDeclaration {
        let RpcOptions = this.imports.name('RpcOptions', this.options.runtimeRpcImportPath);
        let Observable = this.imports.name("Observable", "rxjs");

        return ts.createMethod(
            undefined, undefined, undefined,
            ts.createIdentifier(localName),
            undefined, undefined,
            [
                ts.createParameter(
                    undefined, undefined, undefined, ts.createIdentifier("input"), undefined,
                    ts.createTypeReferenceNode(ts.createIdentifier(this.imports.type(inputTypeDesc)), undefined)
                ),
                ts.createParameter(
                    undefined, undefined, undefined, ts.createIdentifier("options"), ts.createToken(ts.SyntaxKind.QuestionToken),
                    ts.createTypeReferenceNode(ts.createIdentifier(RpcOptions), undefined), undefined
                )
            ],
            ts.createTypeReferenceNode(
                Observable,
                [
                    ts.createTypeReferenceNode(this.imports.type(outputTypeDesc), undefined),
                ]
            ),
            ts.createBlock(
                [
                    // const method = this.methods[0], opt = this._transport.mergeOptions(options), i = method.I.create(input);
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
                                ts.createVariableDeclaration(
                                    ts.createIdentifier("i"),
                                    undefined,
                                    ts.createCall(
                                        ts.createPropertyAccess(
                                            ts.createPropertyAccess(ts.createIdentifier("method"), ts.createIdentifier("I")),
                                            ts.createIdentifier("create")
                                        ),
                                        undefined,
                                        [ts.createIdentifier("input")]
                                    )
                                )
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
                            ts.createTypeReferenceNode(ts.createIdentifier(this.imports.type(outputTypeDesc)), undefined)
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
                                                            ts.createIdentifier("Error"),
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
                                                    ts.createIdentifier("stackIntercept"),
                                                    [
                                                        ts.createTypeReferenceNode(ts.createIdentifier(this.imports.type(inputTypeDesc)), undefined),
                                                        ts.createTypeReferenceNode(ts.createIdentifier(this.imports.type(outputTypeDesc)), undefined),
                                                    ],
                                                    [
                                                        ts.createStringLiteral("serverStreaming"),
                                                        ts.createPropertyAccess(
                                                            ts.createThis(),
                                                            ts.createIdentifier("_transport")
                                                        ),
                                                        ts.createIdentifier("method"),
                                                        ts.createIdentifier("opt"),
                                                        ts.createIdentifier("i")
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


    createClientStreaming(methodDesc: MethodDescriptorProto, localName: string, methodIndex: number, inputTypeDesc: DescriptorProto, outputTypeDesc: DescriptorProto): ts.MethodDeclaration {
        let RpcOptions = this.imports.name('RpcOptions', this.options.runtimeRpcImportPath);
        let ClientStreamingCall = this.imports.name('ClientStreamingCall', this.options.runtimeRpcImportPath);


        // TODO #8 implement method style RXJS for client-streaming method
        console.error("TODO #8 implement method style RXJS for client-streaming method "+StringFormat.formatName(methodDesc));


        return ts.createMethod(
            undefined, undefined, undefined,
            ts.createIdentifier(localName),
            undefined, undefined,
            [
                ts.createParameter(
                    undefined, undefined, undefined, ts.createIdentifier("options"), ts.createToken(ts.SyntaxKind.QuestionToken),
                    ts.createTypeReferenceNode(ts.createIdentifier(RpcOptions), undefined), undefined
                )
            ],
            ts.createTypeReferenceNode(
                ClientStreamingCall,
                [
                    ts.createTypeReferenceNode(this.imports.type(inputTypeDesc), undefined),
                    ts.createTypeReferenceNode(this.imports.type(outputTypeDesc), undefined),
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

                    // return stackIntercept("clientStreaming", this._transport, methods, opt);
                    ts.createReturn(ts.createCall(
                        ts.createIdentifier(this.imports.name('stackIntercept', this.options.runtimeRpcImportPath)),
                        [
                            ts.createTypeReferenceNode(this.imports.type(inputTypeDesc), undefined),
                            ts.createTypeReferenceNode(this.imports.type(outputTypeDesc), undefined)
                        ],
                        [
                            ts.createStringLiteral("clientStreaming"),
                            ts.createPropertyAccess(ts.createThis(), ts.createIdentifier("_transport")),
                            ts.createIdentifier("method"),
                            ts.createIdentifier("opt")
                        ]
                    )),
                ],
                true
            )
        );
    }


    createDuplexStreaming(methodDesc: MethodDescriptorProto, localName: string, methodIndex: number, inputTypeDesc: DescriptorProto, outputTypeDesc: DescriptorProto): ts.MethodDeclaration {
        let RpcOptions = this.imports.name('RpcOptions', this.options.runtimeRpcImportPath);
        let DuplexStreamingCall = this.imports.name('DuplexStreamingCall', this.options.runtimeRpcImportPath);


        // TODO #8 implement method style RXJS for duplex method
        console.error("TODO #8 implement method style RXJS for duplex method "+StringFormat.formatName(methodDesc));


        return ts.createMethod(
            undefined, undefined, undefined,
            ts.createIdentifier(localName),
            undefined, undefined,
            [
                ts.createParameter(
                    undefined, undefined, undefined, ts.createIdentifier("options"), ts.createToken(ts.SyntaxKind.QuestionToken),
                    ts.createTypeReferenceNode(ts.createIdentifier(RpcOptions), undefined), undefined
                )
            ],
            ts.createTypeReferenceNode(
                DuplexStreamingCall,
                [
                    ts.createTypeReferenceNode(this.imports.type(inputTypeDesc), undefined),
                    ts.createTypeReferenceNode(this.imports.type(outputTypeDesc), undefined),
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

                    // return stackIntercept("duplex", this._transport, this, methods, opt);
                    ts.createReturn(ts.createCall(
                        ts.createIdentifier(this.imports.name('stackIntercept', this.options.runtimeRpcImportPath)),
                        [
                            ts.createTypeReferenceNode(this.imports.type(inputTypeDesc), undefined),
                            ts.createTypeReferenceNode(this.imports.type(outputTypeDesc), undefined)
                        ],
                        [
                            ts.createStringLiteral("duplex"),
                            ts.createPropertyAccess(ts.createThis(), ts.createIdentifier("_transport")),
                            ts.createIdentifier("method"),
                            ts.createIdentifier("opt")
                        ]
                    )),
                ],
                true
            )
        );
    }


}
