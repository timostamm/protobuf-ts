import * as ts from "typescript";
import {ServiceClientGeneratorBase} from "./service-client-generator-base";
import * as rpc from "@protobuf-ts/runtime-rpc";
import {assert} from "@protobuf-ts/runtime";
import {TypescriptFile} from "../framework/typescript-file";


export class ServiceClientGeneratorGeneric extends ServiceClientGeneratorBase {


    readonly symbolKindInterface = 'call-client-interface';
    readonly symbolKindImplementation = 'call-client';


    createUnary(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodDeclaration {
        let RpcOptions = this.imports.name(source, 'RpcOptions', this.options.runtimeRpcImportPath, true);
        let UnaryCall = this.imports.name(source, 'UnaryCall', this.options.runtimeRpcImportPath, true);
        let methodIndex = methodInfo.service.methods.indexOf(methodInfo);
        assert(methodIndex >= 0);

        return ts.factory.createMethodDeclaration(
            undefined, undefined,
            ts.factory.createIdentifier(methodInfo.localName),
            undefined, undefined,
            [
                ts.factory.createParameterDeclaration(
                    undefined, undefined, ts.factory.createIdentifier("input"), undefined,
                    this.makeI(source, methodInfo, true)
                ),
                ts.factory.createParameterDeclaration(
                    undefined, undefined, ts.factory.createIdentifier("options"), ts.factory.createToken(ts.SyntaxKind.QuestionToken),
                    ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(RpcOptions), undefined), undefined
                )
            ],
            ts.factory.createTypeReferenceNode(
                UnaryCall,
                [
                    this.makeI(source, methodInfo, true),
                    this.makeO(source, methodInfo, true),
                ]
            ),
            ts.factory.createBlock(
                [
                    // const method = this.methods[0], opt = this._transport.mergeOptions(options);
                    ts.factory.createVariableStatement(
                        undefined,
                        ts.factory.createVariableDeclarationList(
                            [
                                ts.factory.createVariableDeclaration(
                                    ts.factory.createIdentifier("method"),
                                    undefined,
                                    undefined,
                                    ts.factory.createElementAccessExpression(
                                        ts.factory.createPropertyAccessExpression(ts.factory.createThis(), ts.factory.createIdentifier("methods")),
                                        ts.factory.createNumericLiteral(methodIndex.toString())
                                    )
                                ),
                                ts.factory.createVariableDeclaration(
                                    ts.factory.createIdentifier("opt"),
                                    undefined,
                                    undefined,
                                    ts.factory.createCallExpression(
                                        ts.factory.createPropertyAccessExpression(
                                            ts.factory.createPropertyAccessExpression(
                                                ts.factory.createThis(),
                                                ts.factory.createIdentifier("_transport")
                                            ),
                                            ts.factory.createIdentifier("mergeOptions")
                                        ),
                                        undefined,
                                        [ts.factory.createIdentifier("options")]
                                    )
                                ),
                            ],
                            ts.NodeFlags.Const
                        )
                    ),

                    // return stackIntercept("unary", this._transport, method, opt, input);
                    ts.factory.createReturnStatement(ts.factory.createCallExpression(
                        ts.factory.createIdentifier(this.imports.name(source, 'stackIntercept', this.options.runtimeRpcImportPath)),
                        [
                            this.makeI(source, methodInfo, true),
                            this.makeO(source, methodInfo, true)
                        ],
                        [
                            ts.factory.createStringLiteral("unary"),
                            ts.factory.createPropertyAccessExpression(
                                ts.factory.createThis(),
                                ts.factory.createIdentifier("_transport")
                            ),
                            ts.factory.createIdentifier("method"),
                            ts.factory.createIdentifier("opt"),
                            ts.factory.createIdentifier("input"),
                        ]
                    )),
                ],
                true
            )
        );
    }


    createServerStreaming(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodDeclaration {
        let RpcOptions = this.imports.name(source, 'RpcOptions', this.options.runtimeRpcImportPath, true);
        let ServerStreamingCall = this.imports.name(source, 'ServerStreamingCall', this.options.runtimeRpcImportPath, true);
        let methodIndex = methodInfo.service.methods.indexOf(methodInfo);
        assert(methodIndex >= 0);

        return ts.factory.createMethodDeclaration(
            undefined, undefined,
            ts.factory.createIdentifier(methodInfo.localName),
            undefined, undefined,
            [
                ts.factory.createParameterDeclaration(
                    undefined, undefined, ts.factory.createIdentifier("input"), undefined,
                    this.makeI(source, methodInfo, true)
                ),
                ts.factory.createParameterDeclaration(
                    undefined, undefined, ts.factory.createIdentifier("options"), ts.factory.createToken(ts.SyntaxKind.QuestionToken),
                    ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(RpcOptions), undefined), undefined
                )
            ],
            ts.factory.createTypeReferenceNode(
                ServerStreamingCall,
                [
                    this.makeI(source, methodInfo, true),
                    this.makeO(source, methodInfo, true),
                ]
            ),
            ts.factory.createBlock(
                [
                    // const method = this.methods[0], opt = this._transport.mergeOptions(options);
                    ts.factory.createVariableStatement(
                        undefined,
                        ts.factory.createVariableDeclarationList(
                            [
                                ts.factory.createVariableDeclaration(
                                    ts.factory.createIdentifier("method"),
                                    undefined,
                                    undefined,
                                    ts.factory.createElementAccessExpression(
                                        ts.factory.createPropertyAccessExpression(ts.factory.createThis(), ts.factory.createIdentifier("methods")),
                                        ts.factory.createNumericLiteral(methodIndex.toString())
                                    )
                                ),
                                ts.factory.createVariableDeclaration(
                                    ts.factory.createIdentifier("opt"),
                                    undefined,
                                    undefined,
                                    ts.factory.createCallExpression(
                                        ts.factory.createPropertyAccessExpression(
                                            ts.factory.createPropertyAccessExpression(
                                                ts.factory.createThis(),
                                                ts.factory.createIdentifier("_transport")
                                            ),
                                            ts.factory.createIdentifier("mergeOptions")
                                        ),
                                        undefined,
                                        [ts.factory.createIdentifier("options")]
                                    )
                                ),
                            ],
                            ts.NodeFlags.Const
                        )
                    ),

                    // return stackIntercept("serverStreaming", this._transport, method, opt, i);
                    ts.factory.createReturnStatement(ts.factory.createCallExpression(
                        ts.factory.createIdentifier(this.imports.name(source, 'stackIntercept', this.options.runtimeRpcImportPath)),
                        [
                            this.makeI(source, methodInfo, true),
                            this.makeO(source, methodInfo, true)
                        ],
                        [
                            ts.factory.createStringLiteral("serverStreaming"),
                            ts.factory.createPropertyAccessExpression(ts.factory.createThis(), ts.factory.createIdentifier("_transport")),
                            ts.factory.createIdentifier("method"),
                            ts.factory.createIdentifier("opt"),
                            ts.factory.createIdentifier("input"),
                        ]
                    )),
                ],
                true
            )
        );
    }


    createClientStreaming(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodDeclaration {
        let RpcOptions = this.imports.name(source, 'RpcOptions', this.options.runtimeRpcImportPath, true);
        let ClientStreamingCall = this.imports.name(source, 'ClientStreamingCall', this.options.runtimeRpcImportPath, true);
        let methodIndex = methodInfo.service.methods.indexOf(methodInfo);
        assert(methodIndex >= 0);

        return ts.factory.createMethodDeclaration(
            undefined, undefined,
            ts.factory.createIdentifier(methodInfo.localName),
            undefined, undefined,
            [
                ts.factory.createParameterDeclaration(
                    undefined, undefined, ts.factory.createIdentifier("options"), ts.factory.createToken(ts.SyntaxKind.QuestionToken),
                    ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(RpcOptions), undefined), undefined
                )
            ],
            ts.factory.createTypeReferenceNode(
                ClientStreamingCall,
                [
                    this.makeI(source, methodInfo, true),
                    this.makeO(source, methodInfo, true),
                ]
            ),
            ts.factory.createBlock(
                [

                    // const method = this.methods[0], opt = this._transport.mergeOptions(options)
                    ts.factory.createVariableStatement(
                        undefined,
                        ts.factory.createVariableDeclarationList([
                                ts.factory.createVariableDeclaration(
                                    ts.factory.createIdentifier("method"),
                                    undefined,
                                    undefined,
                                    ts.factory.createElementAccessExpression(
                                        ts.factory.createPropertyAccessExpression(ts.factory.createThis(), ts.factory.createIdentifier("methods")),
                                        ts.factory.createNumericLiteral(methodIndex.toString())
                                    )
                                ),
                                ts.factory.createVariableDeclaration(
                                    ts.factory.createIdentifier("opt"),
                                    undefined,
                                    undefined,
                                    ts.factory.createCallExpression(
                                        ts.factory.createPropertyAccessExpression(
                                            ts.factory.createPropertyAccessExpression(
                                                ts.factory.createThis(),
                                                ts.factory.createIdentifier("_transport")
                                            ),
                                            ts.factory.createIdentifier("mergeOptions")
                                        ),
                                        undefined,
                                        [ts.factory.createIdentifier("options")]
                                    )
                                )],
                            ts.NodeFlags.Const
                        )
                    ),

                    // return stackIntercept("clientStreaming", this._transport, methods, opt);
                    ts.factory.createReturnStatement(ts.factory.createCallExpression(
                        ts.factory.createIdentifier(this.imports.name(source, 'stackIntercept', this.options.runtimeRpcImportPath)),
                        [
                            this.makeI(source, methodInfo, true),
                            this.makeO(source, methodInfo, true)
                        ],
                        [
                            ts.factory.createStringLiteral("clientStreaming"),
                            ts.factory.createPropertyAccessExpression(ts.factory.createThis(), ts.factory.createIdentifier("_transport")),
                            ts.factory.createIdentifier("method"),
                            ts.factory.createIdentifier("opt")
                        ]
                    )),
                ],
                true
            )
        );
    }


    createDuplexStreaming(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodDeclaration {
        let RpcOptions = this.imports.name(source, 'RpcOptions', this.options.runtimeRpcImportPath, true);
        let DuplexStreamingCall = this.imports.name(source, 'DuplexStreamingCall', this.options.runtimeRpcImportPath, true);
        let methodIndex = methodInfo.service.methods.indexOf(methodInfo);
        assert(methodIndex >= 0);

        return ts.factory.createMethodDeclaration(
            undefined, undefined,
            ts.factory.createIdentifier(methodInfo.localName),
            undefined, undefined,
            [
                ts.factory.createParameterDeclaration(
                    undefined, undefined, ts.factory.createIdentifier("options"), ts.factory.createToken(ts.SyntaxKind.QuestionToken),
                    ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(RpcOptions), undefined), undefined
                )
            ],
            ts.factory.createTypeReferenceNode(
                DuplexStreamingCall,
                [
                    this.makeI(source, methodInfo, true),
                    this.makeO(source, methodInfo, true),
                ]
            ),
            ts.factory.createBlock(
                [

                    // const method = this.methods[0], opt = this._transport.mergeOptions(options)
                    ts.factory.createVariableStatement(
                        undefined,
                        ts.factory.createVariableDeclarationList([
                                ts.factory.createVariableDeclaration(
                                    ts.factory.createIdentifier("method"),
                                    undefined,
                                    undefined,
                                    ts.factory.createElementAccessExpression(
                                        ts.factory.createPropertyAccessExpression(ts.factory.createThis(), ts.factory.createIdentifier("methods")),
                                        ts.factory.createNumericLiteral(methodIndex.toString())
                                    )
                                ),
                                ts.factory.createVariableDeclaration(
                                    ts.factory.createIdentifier("opt"),
                                    undefined,
                                    undefined,
                                    ts.factory.createCallExpression(
                                        ts.factory.createPropertyAccessExpression(
                                            ts.factory.createPropertyAccessExpression(
                                                ts.factory.createThis(),
                                                ts.factory.createIdentifier("_transport")
                                            ),
                                            ts.factory.createIdentifier("mergeOptions")
                                        ),
                                        undefined,
                                        [ts.factory.createIdentifier("options")]
                                    )
                                )],
                            ts.NodeFlags.Const
                        )
                    ),

                    // return stackIntercept("duplex", this._transport, this, methods, opt);
                    ts.factory.createReturnStatement(ts.factory.createCallExpression(
                        ts.factory.createIdentifier(this.imports.name(source, 'stackIntercept', this.options.runtimeRpcImportPath)),
                        [
                            this.makeI(source, methodInfo, true),
                            this.makeO(source, methodInfo, true)
                        ],
                        [
                            ts.factory.createStringLiteral("duplex"),
                            ts.factory.createPropertyAccessExpression(ts.factory.createThis(), ts.factory.createIdentifier("_transport")),
                            ts.factory.createIdentifier("method"),
                            ts.factory.createIdentifier("opt")
                        ]
                    )),
                ],
                true
            )
        );
    }


}
