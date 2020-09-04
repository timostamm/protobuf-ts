import {
    DescriptorProto,
    DescriptorRegistry,
    MethodDescriptorProto,
    MethodOptions_IdempotencyLevel,
    ServiceDescriptorProto,
    TypescriptFile,
    TypescriptImportManager,
    typescriptLiteralFromValue
} from "@protobuf-ts/plugin-framework";
import * as ts from "typescript";
import * as rt from "@protobuf-ts/runtime";
import {CommentGenerator} from "./comment-generator";
import {Interpreter} from "../interpreter";
import assert = require("assert");


export class ServiceClientGenerator {


    private readonly commentGenerator: CommentGenerator;


    constructor(
        private readonly registry: DescriptorRegistry,
        private readonly imports: TypescriptImportManager,
        private readonly interpreter: Interpreter,
        private readonly options: {
            runtimeRpcImportPath: string;
            angularCoreImportPath: string;
            emitAngularAnnotations: boolean;
            runtimeAngularImportPath: string;
        },
    ) {
        this.commentGenerator = new CommentGenerator(this.registry);
    }


    private createMethodLocalName(descriptor: MethodDescriptorProto): string {
        let escapeCharacter = '$';
        let reservedClassProperties = ["__proto__", "toString", "name", "constructor", "methods", "typeName", "_transport"];
        let name = descriptor.name;
        assert(name !== undefined);
        name = rt.lowerCamelCase(name);
        if (reservedClassProperties.includes(name)) {
            name = name + escapeCharacter;
        }
        return name;
    }


    /**
     * For the following .proto:
     *
     *   service SimpleService {
     *     rpc Get (GetRequest) returns (GetResponse);
     *   }
     *
     * We generate the following interface:
     *
     *   interface ISimpleServiceClient {
     *     get(request: GetRequest, options?: RpcOptions): UnaryCall<AllMethodsRequest, AllMethodsResponse>;
     *   }
     *
     */
    generateInterface(descriptor: ServiceDescriptorProto, source: TypescriptFile): ts.InterfaceDeclaration {
        let IServiceClient = this.imports.type(descriptor, 'client-interface');
        let methods = descriptor.method.map(methodDescriptor => {
            let localName = this.createMethodLocalName(methodDescriptor);
            let inputTypeDesc = this.registry.resolveTypeName(methodDescriptor.inputType!);
            let outputTypeDesc = this.registry.resolveTypeName(methodDescriptor.outputType!);
            assert(DescriptorProto.is(inputTypeDesc));
            assert(DescriptorProto.is(outputTypeDesc));
            let method: ts.MethodSignature;
            if (methodDescriptor.serverStreaming === true && methodDescriptor.clientStreaming === true) {
                method = this.createDuplexStreamingMethodSignature(methodDescriptor, localName, inputTypeDesc, outputTypeDesc)
            } else if (methodDescriptor.clientStreaming === true) {
                method = this.createClientStreamingMethodSignature(methodDescriptor, localName, inputTypeDesc, outputTypeDesc)
            } else if (methodDescriptor.serverStreaming === true) {
                method = this.createServerStreamingMethodSignature(methodDescriptor, localName, inputTypeDesc, outputTypeDesc)
            } else {
                method = this.createUnaryMethodSignature(methodDescriptor, localName, inputTypeDesc, outputTypeDesc)
            }
            this.commentGenerator.addCommentsForDescriptor(method, methodDescriptor, 'appendToLeadingBlock');
            return method;
        });

        // export interface MyService {...
        let statement = ts.createInterfaceDeclaration(
            undefined, [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
            IServiceClient, undefined, undefined, [...methods]
        );

        // add to our file
        this.commentGenerator.addCommentsForDescriptor(statement, descriptor, 'appendToLeadingBlock');
        source.addStatement(statement);
        return statement;
    }


    createUnaryMethodSignature(methodDescriptor: MethodDescriptorProto, localName: string, inputTypeDesc: DescriptorProto, outputTypeDesc: DescriptorProto): ts.MethodSignature {
        let RpcOptions = this.imports.name('RpcOptions', this.options.runtimeRpcImportPath);
        let UnaryCall = this.imports.name('UnaryCall', this.options.runtimeRpcImportPath);
        return ts.createMethodSignature(
            undefined,
            [
                ts.createParameter(
                    undefined, undefined, undefined,
                    ts.createIdentifier("request"),
                    undefined,
                    ts.createTypeReferenceNode(this.imports.type(inputTypeDesc), undefined),
                    undefined
                ),
                ts.createParameter(
                    undefined, undefined, undefined,
                    ts.createIdentifier("options"),
                    ts.createToken(ts.SyntaxKind.QuestionToken),
                    ts.createTypeReferenceNode(RpcOptions, undefined),
                    undefined
                )
            ],
            ts.createTypeReferenceNode(
                UnaryCall,
                [
                    ts.createTypeReferenceNode(this.imports.type(inputTypeDesc), undefined),
                    ts.createTypeReferenceNode(this.imports.type(outputTypeDesc), undefined)
                ]
            ),
            ts.createIdentifier(localName),
            undefined
        );
    }


    createServerStreamingMethodSignature(methodDescriptor: MethodDescriptorProto, localName: string, inputTypeDesc: DescriptorProto, outputTypeDesc: DescriptorProto): ts.MethodSignature {
        let RpcOptions = this.imports.name('RpcOptions', this.options.runtimeRpcImportPath);
        let ServerStreamingCall = this.imports.name('ServerStreamingCall', this.options.runtimeRpcImportPath);
        return ts.createMethodSignature(
            undefined,
            [
                ts.createParameter(
                    undefined, undefined, undefined,
                    ts.createIdentifier("request"),
                    undefined,
                    ts.createTypeReferenceNode(this.imports.type(inputTypeDesc), undefined),
                    undefined
                ),
                ts.createParameter(
                    undefined, undefined, undefined,
                    ts.createIdentifier("options"),
                    ts.createToken(ts.SyntaxKind.QuestionToken),
                    ts.createTypeReferenceNode(RpcOptions, undefined),
                    undefined
                )
            ],
            ts.createTypeReferenceNode(
                ServerStreamingCall,
                [
                    ts.createTypeReferenceNode(this.imports.type(inputTypeDesc), undefined),
                    ts.createTypeReferenceNode(this.imports.type(outputTypeDesc), undefined)
                ]
            ),
            ts.createIdentifier(localName),
            undefined
        );
    }


    createClientStreamingMethodSignature(methodDescriptor: MethodDescriptorProto, localName: string, inputTypeDesc: DescriptorProto, outputTypeDesc: DescriptorProto): ts.MethodSignature {
        let RpcOptions = this.imports.name('RpcOptions', this.options.runtimeRpcImportPath);
        let ClientStreamingCall = this.imports.name('ClientStreamingCall', this.options.runtimeRpcImportPath);
        return ts.createMethodSignature(
            undefined,
            [
                ts.createParameter(
                    undefined, undefined, undefined,
                    ts.createIdentifier("options"),
                    ts.createToken(ts.SyntaxKind.QuestionToken),
                    ts.createTypeReferenceNode(RpcOptions, undefined),
                    undefined
                )
            ],
            ts.createTypeReferenceNode(
                ClientStreamingCall,
                [
                    ts.createTypeReferenceNode(this.imports.type(inputTypeDesc), undefined),
                    ts.createTypeReferenceNode(this.imports.type(outputTypeDesc), undefined)
                ]
            ),
            ts.createIdentifier(localName),
            undefined
        );
    }


    createDuplexStreamingMethodSignature(methodDescriptor: MethodDescriptorProto, localName: string, inputTypeDesc: DescriptorProto, outputTypeDesc: DescriptorProto): ts.MethodSignature {
        let RpcOptions = this.imports.name('RpcOptions', this.options.runtimeRpcImportPath);
        let DuplexStreamingCall = this.imports.name('DuplexStreamingCall', this.options.runtimeRpcImportPath);
        return ts.createMethodSignature(
            undefined,
            [
                ts.createParameter(
                    undefined, undefined, undefined,
                    ts.createIdentifier("options"),
                    ts.createToken(ts.SyntaxKind.QuestionToken),
                    ts.createTypeReferenceNode(RpcOptions, undefined),
                    undefined
                )
            ],
            ts.createTypeReferenceNode(
                DuplexStreamingCall,
                [
                    ts.createTypeReferenceNode(this.imports.type(inputTypeDesc), undefined),
                    ts.createTypeReferenceNode(this.imports.type(outputTypeDesc), undefined)
                ]
            ),
            ts.createIdentifier(localName),
            undefined
        );
    }


    /**
     * For the following .proto:
     *
     *   service SimpleService {
     *     rpc Get (GetRequest) returns (GetResponse);
     *   }
     *
     * We generate:
     *
     *   class SimpleService implements ISimpleService {
     *     readonly typeName = ".spec.SimpleService";
     *     readonly methods: MethodInfo[] = [
     *       {name: 'Get', localName: 'get', I: GetRequest, O: GetResponse}
     *     ];
     *     ...
     *   }
     *
     */
    generateImplementationClass(descriptor: ServiceDescriptorProto, source: TypescriptFile): ts.ClassDeclaration {
        let ServiceClient = this.imports.type(descriptor, 'client-implementation');
        let IServiceClient = this.imports.type(descriptor, 'client-interface');
        let MethodInfo = this.imports.name('MethodInfo', this.options.runtimeRpcImportPath);
        let RpcTransport = this.imports.name('RpcTransport', this.options.runtimeRpcImportPath);

        let classDecorators: ts.Decorator[] = [];
        if (this.options.emitAngularAnnotations) {
            let Injectable = this.imports.name('Injectable', this.options.angularCoreImportPath);
            classDecorators.push(
                ts.createDecorator(ts.createCall(
                    ts.createIdentifier(Injectable), undefined, []
                ))
            );
        }

        let constructorDecorators: ts.Decorator[] = [];
        if (this.options.emitAngularAnnotations) {
            let RPC_TRANSPORT = this.imports.name('RPC_TRANSPORT', this.options.runtimeAngularImportPath);
            let Inject = this.imports.name('Inject', this.options.angularCoreImportPath);
            constructorDecorators.push(
                ts.createDecorator(ts.createCall(
                    ts.createIdentifier(Inject),
                    undefined,
                    [
                        ts.createIdentifier(RPC_TRANSPORT)
                    ]
                ))
            );
        }

        let members: ts.ClassElement[] = [

            // readonly typeName = ".test.MyService";
            ts.createProperty(
                undefined, [ts.createModifier(ts.SyntaxKind.ReadonlyKeyword)], ts.createIdentifier("typeName"),
                undefined, undefined, ts.createStringLiteral(this.registry.makeTypeName(descriptor))
            ),

            // readonly methods: MethodInfo[] = [...];
            ts.createProperty(
                undefined, [ts.createModifier(ts.SyntaxKind.ReadonlyKeyword)], ts.createIdentifier("methods"),
                undefined,
                ts.createArrayTypeNode(ts.createTypeReferenceNode(MethodInfo, undefined)),
                this.createMethodInfo(descriptor)
            ),

            // constructor(@Inject(RPC_TRANSPORT) private readonly _transport: RpcTransport) {}
            ts.createConstructor(
                undefined, undefined,
                [ts.createParameter(
                    constructorDecorators,
                    [
                        ts.createModifier(ts.SyntaxKind.PrivateKeyword),
                        ts.createModifier(ts.SyntaxKind.ReadonlyKeyword)
                    ],
                    undefined, ts.createIdentifier("_transport"), undefined,
                    ts.createTypeReferenceNode(ts.createIdentifier(RpcTransport), undefined),
                    undefined
                )],
                ts.createBlock([], true)
            ),

        ];

        for (let i = 0; i < descriptor.method.length; i++) {
            let methodDescriptor = descriptor.method[i];
            let localName = this.createMethodLocalName(methodDescriptor)
            let inputTypeDesc = this.registry.resolveTypeName(methodDescriptor.inputType!);
            let outputTypeDesc = this.registry.resolveTypeName(methodDescriptor.outputType!);
            assert(DescriptorProto.is(inputTypeDesc));
            assert(DescriptorProto.is(outputTypeDesc));

            if (methodDescriptor.serverStreaming === true && methodDescriptor.clientStreaming === true) {
                members.push(
                    this.createDuplexStreamingMethod(methodDescriptor, localName, i, inputTypeDesc, outputTypeDesc)
                );
            } else if (methodDescriptor.clientStreaming === true) {
                members.push(
                    this.createClientStreamingMethod(methodDescriptor, localName, i, inputTypeDesc, outputTypeDesc)
                );
            } else if (methodDescriptor.serverStreaming === true) {
                members.push(
                    this.createServerStreamingMethod(methodDescriptor, localName, i, inputTypeDesc, outputTypeDesc)
                );
            } else {
                members.push(
                    this.createServiceClientUnaryMethod(methodDescriptor, localName, i, inputTypeDesc, outputTypeDesc)
                );
            }
        }


        // export class MyService implements MyService
        const statement = ts.createClassDeclaration(
            classDecorators,
            [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
            ServiceClient,
            undefined,
            [ts.createHeritageClause(
                ts.SyntaxKind.ImplementsKeyword,
                [ts.createExpressionWithTypeArguments(
                    undefined, ts.createIdentifier(IServiceClient)
                )]
            )],
            members
        );

        source.addStatement(statement);
        this.commentGenerator.addCommentsForDescriptor(statement, descriptor, 'appendToLeadingBlock');
        return statement;
    }


    protected createServiceClientUnaryMethod(methodDesc: MethodDescriptorProto, localName: string, methodIndex: number, inputTypeDesc: DescriptorProto, outputTypeDesc: DescriptorProto): ts.MethodDeclaration {
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
                    // const method = this.methods[0], i = method.I.create(input);
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

                    // const opt = this._transport.mergeOptions(options)
                    ts.createVariableStatement(
                        undefined,
                        ts.createVariableDeclarationList(
                            [ts.createVariableDeclaration(
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

                    // return stackUnaryInterceptors(this._transport, method, i, opt);
                    ts.createReturn(ts.createCall(
                        ts.createIdentifier(this.imports.name('stackUnaryInterceptors', this.options.runtimeRpcImportPath)),
                        undefined,
                        [
                            ts.createPropertyAccess(
                                ts.createThis(),
                                ts.createIdentifier("_transport")
                            ),
                            ts.createIdentifier("method"),
                            ts.createIdentifier("i"),
                            ts.createIdentifier("opt")
                        ]
                    )),
                ],
                true
            )
        );
    }


    protected createServerStreamingMethod(methodDesc: MethodDescriptorProto, localName: string, methodIndex: number, inputTypeDesc: DescriptorProto, outputTypeDesc: DescriptorProto): ts.MethodDeclaration {
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
                    // const method = this.methods[0], i = method.I.create(input);
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

                    // const opt = this._transport.mergeOptions(options)
                    ts.createVariableStatement(
                        undefined,
                        ts.createVariableDeclarationList(
                            [ts.createVariableDeclaration(
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

                    // return stackUnaryInterceptors(this._transport, method, i, opt);
                    ts.createReturn(ts.createCall(
                        ts.createIdentifier(this.imports.name('stackServerStreamingInterceptors', this.options.runtimeRpcImportPath)),
                        undefined,
                        [
                            ts.createPropertyAccess(ts.createThis(), ts.createIdentifier("_transport")),
                            ts.createIdentifier("method"),
                            ts.createIdentifier("i"),
                            ts.createIdentifier("opt")
                        ]
                    )),
                ],
                true
            )
        );
    }


    protected createClientStreamingMethod(methodDesc: MethodDescriptorProto, localName: string, methodIndex: number, inputTypeDesc: DescriptorProto, outputTypeDesc: DescriptorProto): ts.MethodDeclaration {
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

                    // const opt = this._transport.mergeOptions(options)
                    ts.createVariableStatement(
                        undefined,
                        ts.createVariableDeclarationList(
                            [ts.createVariableDeclaration(
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

                    // return stackClientStreamingInterceptors(this._transport, this.methods[2], opt);
                    ts.createReturn(ts.createCall(
                        ts.createIdentifier(this.imports.name('stackClientStreamingInterceptors', this.options.runtimeRpcImportPath)),
                        undefined,
                        [
                            ts.createPropertyAccess(ts.createThis(), ts.createIdentifier("_transport")),
                            ts.createElementAccess(
                                ts.createPropertyAccess(ts.createThis(), ts.createIdentifier("methods")),
                                ts.createNumericLiteral(methodIndex.toString())
                            ),
                            ts.createIdentifier("opt")
                        ]
                    )),
                ],
                true
            )
        );
    }


    protected createDuplexStreamingMethod(methodDesc: MethodDescriptorProto, localName: string, methodIndex: number, inputTypeDesc: DescriptorProto, outputTypeDesc: DescriptorProto): ts.MethodDeclaration {
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

                    // const opt = this._transport.mergeOptions(options)
                    ts.createVariableStatement(
                        undefined,
                        ts.createVariableDeclarationList(
                            [ts.createVariableDeclaration(
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

                    // return stackDuplexStreamingInterceptors(this._transport, this, this.methods[2], opt);
                    ts.createReturn(ts.createCall(
                        ts.createIdentifier(this.imports.name('stackDuplexStreamingInterceptors', this.options.runtimeRpcImportPath)),
                        undefined,
                        [
                            ts.createPropertyAccess(ts.createThis(), ts.createIdentifier("_transport")),
                            ts.createElementAccess(
                                ts.createPropertyAccess(ts.createThis(), ts.createIdentifier("methods")),
                                ts.createNumericLiteral(methodIndex.toString())
                            ),
                            ts.createIdentifier("opt")
                        ]
                    )),
                ],
                true
            )
        );
    }


    /**
     * Create service method information for the runtime.
     *
     * Example:
     *
     *   [
     *     {service: this, name: 'get', I: MyGetRequest, O: MyGetResponse},
     *   ]
     *
     */
    createMethodInfo(descriptor: ServiceDescriptorProto): ts.ArrayLiteralExpression {
        let methodInfos: ts.ObjectLiteralExpression[] = [];
        for (let methodDescriptor of descriptor.method) {
            let localName = this.createMethodLocalName(methodDescriptor);
            let inputTypeDesc = this.registry.resolveTypeName(methodDescriptor.inputType!);
            let outputTypeDesc = this.registry.resolveTypeName(methodDescriptor.outputType!);
            assert(DescriptorProto.is(inputTypeDesc));
            assert(DescriptorProto.is(outputTypeDesc));
            let properties: ts.ObjectLiteralElementLike[] = [
                ts.createPropertyAssignment(ts.createIdentifier("service"), ts.createThis()),
                ts.createPropertyAssignment(ts.createIdentifier("name"), ts.createStringLiteral(methodDescriptor.name!)),
            ];
            if (localName !== methodDescriptor.name) {
                properties.push(
                    ts.createPropertyAssignment(ts.createIdentifier("localName"), ts.createStringLiteral(localName)),
                );
            }
            properties.push(
                ts.createPropertyAssignment(ts.createIdentifier("I"), ts.createIdentifier(this.imports.type(inputTypeDesc))),
                ts.createPropertyAssignment(ts.createIdentifier("O"), ts.createIdentifier(this.imports.type(outputTypeDesc))),
            );
            if (methodDescriptor.options) {
                let idem = methodDescriptor.options.idempotencyLevel;
                if (idem !== undefined && idem !== MethodOptions_IdempotencyLevel.IDEMPOTENCY_UNKNOWN) {
                    let stringVal = MethodOptions_IdempotencyLevel[idem];
                    properties.push(
                        ts.createPropertyAssignment(ts.createIdentifier("idempotency"), ts.createStringLiteral(stringVal))
                    );
                }
            }
            if (methodDescriptor.clientStreaming) {
                properties.push(
                    ts.createPropertyAssignment(ts.createIdentifier("clientStreaming"), ts.createTrue())
                );
            }
            if (methodDescriptor.serverStreaming) {
                properties.push(
                    ts.createPropertyAssignment(ts.createIdentifier("serverStreaming"), ts.createTrue())
                );
            }

            // options:
            let optionsMap = this.interpreter.readOptions(methodDescriptor);
            if (optionsMap) {
                properties.push(ts.createPropertyAssignment(
                    ts.createIdentifier('options'),
                    typescriptLiteralFromValue(optionsMap)
                ));
            }

            methodInfos.push(
                ts.createObjectLiteral([...properties], false)
            );
        }
        return ts.createArrayLiteral(methodInfos, true);
    }


}
