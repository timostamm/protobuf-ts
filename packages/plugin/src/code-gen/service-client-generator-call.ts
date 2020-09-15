import {DescriptorProto, MethodDescriptorProto, TypescriptImportManager} from "@protobuf-ts/plugin-framework";
import * as ts from "typescript";
import {Interpreter} from "../interpreter";
import {ClientMethodGenerator} from "./service-client-generator";


export class ServiceClientGeneratorCall implements ClientMethodGenerator {


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
        let UnaryCall = this.imports.name('UnaryCall', this.options.runtimeRpcImportPath);

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
                UnaryCall,
                [
                    ts.createTypeReferenceNode(this.imports.type(inputTypeDesc), undefined),
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

                    // return stackIntercept("unary", this._transport, method, opt, i);
                    ts.createReturn(ts.createCall(
                        ts.createIdentifier(this.imports.name('stackIntercept', this.options.runtimeRpcImportPath)),
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
                            ts.createIdentifier("i"),
                        ]
                    )),
                ],
                true
            )
        );
    }


    createServerStreaming(methodDesc: MethodDescriptorProto, localName: string, methodIndex: number, inputTypeDesc: DescriptorProto, outputTypeDesc: DescriptorProto): ts.MethodDeclaration {
        let RpcOptions = this.imports.name('RpcOptions', this.options.runtimeRpcImportPath);
        let ServerStreamingCall = this.imports.name('ServerStreamingCall', this.options.runtimeRpcImportPath);

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
                ServerStreamingCall,
                [
                    ts.createTypeReferenceNode(this.imports.type(inputTypeDesc), undefined),
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

                    // return stackIntercept("serverStreaming", this._transport, method, opt, i);
                    ts.createReturn(ts.createCall(
                        ts.createIdentifier(this.imports.name('stackIntercept', this.options.runtimeRpcImportPath)),
                        [
                            ts.createTypeReferenceNode(this.imports.type(inputTypeDesc), undefined),
                            ts.createTypeReferenceNode(this.imports.type(outputTypeDesc), undefined)
                        ],
                        [
                            ts.createStringLiteral("serverStreaming"),
                            ts.createPropertyAccess(ts.createThis(), ts.createIdentifier("_transport")),
                            ts.createIdentifier("method"),
                            ts.createIdentifier("opt"),
                            ts.createIdentifier("i"),
                        ]
                    )),
                ],
                true
            )
        );
    }


    createClientStreaming(methodDesc: MethodDescriptorProto, localName: string, methodIndex: number, inputTypeDesc: DescriptorProto, outputTypeDesc: DescriptorProto): ts.MethodDeclaration {
        let RpcOptions = this.imports.name('RpcOptions', this.options.runtimeRpcImportPath);
        let ClientStreamingCall = this.imports.name('ClientStreamingCall', this.options.runtimeRpcImportPath);

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
