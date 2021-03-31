import * as ts from "typescript";
import {ServiceClientGeneratorBase} from "./service-client-generator-base";
import * as rpc from "@protobuf-ts/runtime-rpc";
import {assert} from "@protobuf-ts/runtime";
import {TypescriptFile} from "@protobuf-ts/plugin-framework";


export class ServiceClientGeneratorGeneric extends ServiceClientGeneratorBase {


    readonly symbolKindInterface = 'call-client-interface';
    readonly symbolKindImplementation = 'call-client';


    createUnary(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodDeclaration {
        let RpcOptions = this.imports.name(source, 'RpcOptions', this.options.runtimeRpcImportPath);
        let UnaryCall = this.imports.name(source, 'UnaryCall', this.options.runtimeRpcImportPath);
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
                UnaryCall,
                [
                    this.makeI(source, methodInfo),
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

                    // return stackIntercept("unary", this._transport, method, opt, input);
                    ts.createReturn(ts.createCall(
                        ts.createIdentifier(this.imports.name(source, 'stackIntercept', this.options.runtimeRpcImportPath)),
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
                            ts.createIdentifier("input"),
                        ]
                    )),
                ],
                true
            )
        );
    }


    createServerStreaming(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodDeclaration {
        let RpcOptions = this.imports.name(source, 'RpcOptions', this.options.runtimeRpcImportPath);
        let ServerStreamingCall = this.imports.name(source, 'ServerStreamingCall', this.options.runtimeRpcImportPath);
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
                ServerStreamingCall,
                [
                    this.makeI(source, methodInfo),
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

                    // return stackIntercept("serverStreaming", this._transport, method, opt, i);
                    ts.createReturn(ts.createCall(
                        ts.createIdentifier(this.imports.name(source, 'stackIntercept', this.options.runtimeRpcImportPath)),
                        [
                            this.makeI(source, methodInfo),
                            this.makeO(source, methodInfo)
                        ],
                        [
                            ts.createStringLiteral("serverStreaming"),
                            ts.createPropertyAccess(ts.createThis(), ts.createIdentifier("_transport")),
                            ts.createIdentifier("method"),
                            ts.createIdentifier("opt"),
                            ts.createIdentifier("input"),
                        ]
                    )),
                ],
                true
            )
        );
    }


    createClientStreaming(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodDeclaration {
        let RpcOptions = this.imports.name(source, 'RpcOptions', this.options.runtimeRpcImportPath);
        let ClientStreamingCall = this.imports.name(source, 'ClientStreamingCall', this.options.runtimeRpcImportPath);
        let methodIndex = methodInfo.service.methods.indexOf(methodInfo);
        assert(methodIndex >= 0);

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
                    this.makeI(source, methodInfo),
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

                    // return stackIntercept("clientStreaming", this._transport, methods, opt);
                    ts.createReturn(ts.createCall(
                        ts.createIdentifier(this.imports.name(source, 'stackIntercept', this.options.runtimeRpcImportPath)),
                        [
                            this.makeI(source, methodInfo),
                            this.makeO(source, methodInfo)
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


    createDuplexStreaming(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodDeclaration {
        let RpcOptions = this.imports.name(source, 'RpcOptions', this.options.runtimeRpcImportPath);
        let DuplexStreamingCall = this.imports.name(source, 'DuplexStreamingCall', this.options.runtimeRpcImportPath);
        let methodIndex = methodInfo.service.methods.indexOf(methodInfo);
        assert(methodIndex >= 0);

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
                    this.makeI(source, methodInfo),
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

                    // return stackIntercept("duplex", this._transport, this, methods, opt);
                    ts.createReturn(ts.createCall(
                        ts.createIdentifier(this.imports.name(source, 'stackIntercept', this.options.runtimeRpcImportPath)),
                        [
                            this.makeI(source, methodInfo),
                            this.makeO(source, methodInfo)
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
