import * as ts from "typescript";
import {ServiceClientGeneratorBase} from "./service-client-generator-base";
import * as rpc from "@protobuf-ts/runtime-rpc";
import {assert} from "@protobuf-ts/runtime";


export class ServiceClientGeneratorPromise extends ServiceClientGeneratorBase {


    readonly style = rpc.ClientStyle.PROMISE;


    createUnary(methodInfo: rpc.MethodInfo): ts.MethodDeclaration {
        let RpcOptions = this.imports.name('RpcOptions', this.options.runtimeRpcImportPath);
        let methodIndex = methodInfo.service.methods.indexOf(methodInfo);
        assert(methodIndex >= 0);

        return ts.createMethod(
            undefined, undefined, undefined,
            ts.createIdentifier(methodInfo.localName),
            undefined, undefined,
            [
                ts.createParameter(
                    undefined, undefined, undefined, ts.createIdentifier("input"), undefined,
                    this.makeI(methodInfo)
                ),
                ts.createParameter(
                    undefined, undefined, undefined, ts.createIdentifier("options"), ts.createToken(ts.SyntaxKind.QuestionToken),
                    ts.createTypeReferenceNode(ts.createIdentifier(RpcOptions), undefined), undefined
                )
            ],
            ts.createTypeReferenceNode(
                ts.createIdentifier("Promise"),
                [
                    this.makeO(methodInfo)
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
                                    ts.createIdentifier("stackIntercept"),
                                    [
                                        this.makeI(methodInfo),
                                        this.makeO(methodInfo)
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


    createServerStreaming(methodInfo: rpc.MethodInfo): ts.MethodDeclaration {
        let RpcOptions = this.imports.name('RpcOptions', this.options.runtimeRpcImportPath);
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
                    this.makeI(methodInfo)
                ),
                ts.createParameter(
                    undefined, undefined, undefined, ts.createIdentifier("options"), ts.createToken(ts.SyntaxKind.QuestionToken),
                    ts.createTypeReferenceNode(ts.createIdentifier(RpcOptions), undefined), undefined
                )
            ],
            ts.createTypeReferenceNode(
                ts.createIdentifier("AsyncIterable"),
                [
                    this.makeO(methodInfo),
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
                                    ts.createIdentifier("stackIntercept"),
                                    [
                                        this.makeI(methodInfo),
                                        this.makeO(methodInfo)
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
                                    ts.createIdentifier(this.imports.name("RpcOutputStreamController", this.options.runtimeRpcImportPath)),
                                    [this.makeO(methodInfo)],
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


    createClientStreaming(methodInfo: rpc.MethodInfo): ts.MethodDeclaration {
        let RpcOptions = this.imports.name('RpcOptions', this.options.runtimeRpcImportPath);
        let ClientStreamingCall = this.imports.name('ClientStreamingCall', this.options.runtimeRpcImportPath);
        let methodIndex = methodInfo.service.methods.indexOf(methodInfo);
        assert(methodIndex >= 0);

        // TODO #8 implement method style PROMISE for client-streaming method
        console.error("TODO #8 implement method style PROMISE for client-streaming method " + methodInfo.service.typeName + " / " + methodInfo.name);


        return ts.createMethod(
            undefined, undefined, undefined,
            ts.createIdentifier(methodInfo.localName),
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
                    this.makeI(methodInfo),
                    this.makeO(methodInfo),
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
                        undefined,
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


    createDuplexStreaming(methodInfo: rpc.MethodInfo): ts.MethodDeclaration {
        let RpcOptions = this.imports.name('RpcOptions', this.options.runtimeRpcImportPath);
        let DuplexStreamingCall = this.imports.name('DuplexStreamingCall', this.options.runtimeRpcImportPath);
        let methodIndex = methodInfo.service.methods.indexOf(methodInfo);
        assert(methodIndex >= 0);

        // TODO #8 implement method style PROMISE for duplex method
        console.error("TODO #8 implement method style PROMISE for duplex method " + methodInfo.service.typeName + " / " + methodInfo.name);


        return ts.createMethod(
            undefined, undefined, undefined,
            ts.createIdentifier(methodInfo.localName),
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
                    this.makeI(methodInfo),
                    this.makeO(methodInfo),
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
                        undefined,
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
