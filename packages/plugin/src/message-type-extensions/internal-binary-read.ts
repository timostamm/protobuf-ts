import * as ts from "typescript";
import {TypescriptFile} from "../framework/typescript-file";
import * as rt from "@protobuf-ts/runtime";
import {assert, LongType} from "@protobuf-ts/runtime";
import {CustomMethodGenerator} from "../code-gen/message-type-generator";
import {Interpreter} from "../interpreter";
import {DescMessage, FileRegistry, ScalarType} from "@bufbuild/protobuf";
import {getDeclarationString} from "@bufbuild/protoplugin";
import {TypeScriptImports} from "../framework/typescript-imports";
import {typescriptLiteralFromValue} from "../framework/typescript-literal-from-value";


/**
 * Generates a "internalBinaryRead()" method for an `IMessageType`
 */
export class InternalBinaryRead implements CustomMethodGenerator {


    constructor(
        private readonly registry: FileRegistry,
        private readonly imports: TypeScriptImports,
        private readonly interpreter: Interpreter,
        private readonly options: { normalLongType: LongType; oneofKindDiscriminator: string; runtimeImportPath: string },
    ) {
    }

    private readonly binaryReadMapEntryMethodName = "binaryReadMap";


    make(source: TypescriptFile, descMessage: DescMessage): ts.MethodDeclaration[] {
        const methods: ts.MethodDeclaration[] = [];

        // internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ${messageInterfaceId}): ${messageInterfaceId} {
        let internalBinaryRead = this.makeMethod(
            source,
            descMessage,

            // let message = target ?? this.create(), end = reader.pos + length;
            this.makeVariables(),

            // while (reader.pos < end) {
            //   let [fieldNo, wireType] = reader.tag();
            //   switch (fieldNo) {
            this.makeWhileSwitch(
                // case ...:
                this.makeCaseClauses(source, descMessage),

                // default:
                //  ...
                this.makeDefaultClause(source)
            ),

            // return message
            ts.createReturn(ts.createIdentifier("message")),
        )

        methods.push(internalBinaryRead);
        for (let fieldInfo of this.interpreter.getMessageType(descMessage).fields) {
            if (fieldInfo.kind == "map") {
                methods.push(this.makeMapEntryReadMethod(source, descMessage, fieldInfo));
            }
        }
        return methods;
    }

    private makeMethod(source:TypescriptFile, descMessage: DescMessage, ...bodyStatements: readonly ts.Statement[]): ts.MethodDeclaration {
        const
            MessageInterface = this.imports.type(source, descMessage),
            IBinaryReader = this.imports.name(source, 'IBinaryReader', this.options.runtimeImportPath, true),
            BinaryReadOptions = this.imports.name(source, 'BinaryReadOptions', this.options.runtimeImportPath, true);
        return ts.createMethod(undefined, undefined, undefined, ts.createIdentifier("internalBinaryRead"), undefined, undefined,
            [
                ts.createParameter(undefined, undefined, undefined, ts.createIdentifier("reader"), undefined, ts.createTypeReferenceNode(IBinaryReader, undefined), undefined),
                ts.createParameter(undefined, undefined, undefined, ts.createIdentifier("length"), undefined, ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword), undefined),
                ts.createParameter(undefined, undefined, undefined, ts.createIdentifier("options"), undefined,
                    ts.createTypeReferenceNode(BinaryReadOptions, undefined), undefined
                ),
                ts.createParameter(undefined, undefined, undefined, ts.createIdentifier("target"), ts.createToken(ts.SyntaxKind.QuestionToken),
                    ts.createTypeReferenceNode(MessageInterface, undefined),
                    undefined
                )
            ],
            ts.createTypeReferenceNode(MessageInterface, undefined),
            ts.createBlock(bodyStatements, true)
        );
    }

    private makeVariables(): ts.VariableStatement {
        // let message = target ?? this.create(), end = reader.pos + length;
        return ts.createVariableStatement(
            undefined,
            ts.createVariableDeclarationList(
                [
                    ts.createVariableDeclaration(
                        ts.createIdentifier("message"),
                        undefined,
                        ts.createBinary(
                            ts.createIdentifier("target"),
                            ts.createToken(ts.SyntaxKind.QuestionQuestionToken),
                            ts.createCall(
                                ts.createPropertyAccess(
                                    ts.createThis(),
                                    ts.createIdentifier("create")
                                ), undefined, []
                            )
                        )
                    ),
                    ts.createVariableDeclaration(
                        ts.createIdentifier("end"),
                        undefined,
                        ts.createBinary(
                            ts.createPropertyAccess(
                                ts.createIdentifier("reader"),
                                ts.createIdentifier("pos")
                            ),
                            ts.createToken(ts.SyntaxKind.PlusToken),
                            ts.createIdentifier("length")
                        )
                    )
                ],
                ts.NodeFlags.Let
            )
        );
    }

    private makeWhileSwitch(switchCases: ts.CaseClause[], defaultClause: ts.DefaultClause): ts.WhileStatement {
        return ts.createWhile(
            ts.createBinary(
                ts.createPropertyAccess(
                    ts.createIdentifier("reader"),
                    ts.createIdentifier("pos")
                ),
                ts.createToken(ts.SyntaxKind.LessThanToken),
                ts.createIdentifier("end")
            ),
            ts.createBlock(
                [

                    ts.createVariableStatement(
                        undefined,
                        ts.createVariableDeclarationList(
                            [ts.createVariableDeclaration(
                                ts.createArrayBindingPattern([
                                    ts.createBindingElement(
                                        undefined,
                                        undefined,
                                        ts.createIdentifier("fieldNo"),
                                        undefined
                                    ),
                                    ts.createBindingElement(
                                        undefined,
                                        undefined,
                                        ts.createIdentifier("wireType"),
                                        undefined
                                    )
                                ]),
                                undefined,
                                ts.createCall(
                                    ts.createPropertyAccess(
                                        ts.createIdentifier("reader"),
                                        ts.createIdentifier("tag")
                                    ),
                                    undefined,
                                    []
                                )
                            )],
                            ts.NodeFlags.Let
                        )
                    ),
                    ts.createSwitch(
                        ts.createIdentifier("fieldNo"),
                        ts.createCaseBlock([
                            ...switchCases,
                            defaultClause
                        ])
                    )
                ],
                true
            )
        )
    }

    private makeCaseClauses(source: TypescriptFile,descMessage: DescMessage): ts.CaseClause[] {
        const
            interpreterType = this.interpreter.getMessageType(descMessage),
            clauses: ts.CaseClause[] = [];

        for (let fieldInfo of interpreterType.fields) {

            let statements: ts.Statement[],
                fieldPropertyAccess = ts.createPropertyAccess(ts.createIdentifier("message"), fieldInfo.localName);

            switch (fieldInfo.kind) {

                case "scalar":
                case "enum":
                    if (fieldInfo.repeat) {
                        statements = this.scalarRepeated(source,fieldInfo, fieldPropertyAccess);
                    } else if (fieldInfo.oneof !== undefined) {
                        statements = this.scalarOneof(fieldInfo);
                    } else {
                        statements = this.scalar(fieldInfo, fieldPropertyAccess);
                    }
                    break;

                case "message":
                    if (fieldInfo.repeat) {
                        statements = this.messageRepeated(source,fieldInfo, fieldPropertyAccess);
                    } else if (fieldInfo.oneof !== undefined) {
                        statements = this.messageOneof(source,fieldInfo);
                    } else {
                        statements = this.message(source,fieldInfo, fieldPropertyAccess);
                    }
                    break;

                case "map":
                    statements = this.map(fieldInfo, fieldPropertyAccess);
                    break;
            }

            // case /* double double_field */ 1:
            const descField = descMessage.fields.find(descField => descField.number === fieldInfo.no);
            assert(descField !== undefined);
            let fieldNumber = ts.createNumericLiteral(`${fieldInfo.no}`);
            const fieldDeclarationComment = " " + getDeclarationString(descField)
                .replace(/= \d+$/, '')
                .replace(/]$/, '] ');
            ts.addSyntheticLeadingComment(fieldNumber, ts.SyntaxKind.MultiLineCommentTrivia, fieldDeclarationComment, false)
            clauses.push(ts.createCaseClause(
                fieldNumber,
                [...statements, ts.createBreak(undefined)]
            ));
        }

        return clauses;
    }

    private makeDefaultClause(source:TypescriptFile,): ts.DefaultClause {
        let UnknownFieldHandler = this.imports.name(source, 'UnknownFieldHandler', this.options.runtimeImportPath);
        return ts.createDefaultClause([
                ts.createVariableStatement(
                    undefined,
                    ts.createVariableDeclarationList(
                        [ts.createVariableDeclaration(
                            ts.createIdentifier("u"),
                            undefined,
                            ts.createPropertyAccess(
                                ts.createIdentifier("options"),
                                ts.createIdentifier("readUnknownField")
                            )
                        )],
                        ts.NodeFlags.Let
                    )
                ),
                ts.createIf(
                    ts.createBinary(
                        ts.createIdentifier("u"),
                        ts.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
                        ts.createStringLiteral("throw")
                    ),
                    ts.createThrow(ts.createNew(
                        ts.createPropertyAccess(
                            ts.createIdentifier("globalThis"),
                            ts.createIdentifier("Error")
                        ),
                        undefined,
                        [ts.createTemplateExpression(
                            ts.createTemplateHead(
                                "Unknown field ",
                                "Unknown field "
                            ),
                            [
                                ts.createTemplateSpan(
                                    ts.createIdentifier("fieldNo"),
                                    ts.createTemplateMiddle(
                                        " (wire type ",
                                        " (wire type "
                                    )
                                ),
                                ts.createTemplateSpan(
                                    ts.createIdentifier("wireType"),
                                    ts.createTemplateMiddle(
                                        ") for ",
                                        ") for "
                                    )
                                ),
                                ts.createTemplateSpan(
                                    ts.createPropertyAccess(
                                        ts.createThis(),
                                        ts.createIdentifier("typeName")
                                    ),
                                    ts.createTemplateTail(
                                        "",
                                        ""
                                    )
                                )
                            ]
                        )]
                    )),
                    undefined
                ),
                ts.createVariableStatement(
                    undefined,
                    ts.createVariableDeclarationList(
                        [ts.createVariableDeclaration(
                            ts.createIdentifier("d"),
                            undefined,
                            ts.createCall(
                                ts.createPropertyAccess(
                                    ts.createIdentifier("reader"),
                                    ts.createIdentifier("skip")
                                ),
                                undefined,
                                [ts.createIdentifier("wireType")]
                            )
                        )],
                        ts.NodeFlags.Let
                    )
                ),
                ts.createIf(
                    ts.createBinary(
                        ts.createIdentifier("u"),
                        ts.createToken(ts.SyntaxKind.ExclamationEqualsEqualsToken),
                        ts.createFalse()
                    ),
                    ts.createExpressionStatement(ts.createCall(
                        ts.createParen(ts.createConditional(
                            ts.createBinary(
                                ts.createIdentifier("u"),
                                ts.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
                                ts.createTrue()
                            ),
                            ts.createToken(ts.SyntaxKind.QuestionToken),
                            ts.createPropertyAccess(
                                ts.createIdentifier(UnknownFieldHandler),
                                ts.createIdentifier("onRead")
                            ),
                            ts.createToken(ts.SyntaxKind.ColonToken),
                            ts.createIdentifier("u")
                        )),
                        undefined,
                        [
                            ts.createPropertyAccess(
                                ts.createThis(),
                                ts.createIdentifier("typeName")
                            ),
                            ts.createIdentifier("message"),
                            ts.createIdentifier("fieldNo"),
                            ts.createIdentifier("wireType"),
                            ts.createIdentifier("d")
                        ]
                    )),
                    undefined
                )
            ]
        );
    }


    // message.int32StrField[reader.skip(0).skipBytes(1).int32()] = reader.skipBytes(1).string();
    // message.msgField[reader.skip(0).skipBytes(1).int32()] = OtherMessage.internalBinaryRead(reader, reader.skipBytes(1).uint32(), options);
    private map(field: rt.FieldInfo & { kind: "map" }, fieldPropertyAccess: ts.PropertyAccessExpression): ts.Statement[] {
        return [ts.createExpressionStatement(ts.createCall(
            ts.createPropertyAccess(
                ts.createThis(),
                ts.createIdentifier(this.binaryReadMapEntryMethodName + field.no)
            ),
            undefined,
            [
                fieldPropertyAccess,
                ts.createIdentifier("reader"),
                ts.createIdentifier("options")
            ]
        ))];
    }


    // message.field = OtherMessage.internalBinaryRead(reader, reader.uint32(), options, message.field);
    private message(source:TypescriptFile, field: rt.FieldInfo & { kind: "message"; repeat: undefined | rt.RepeatType.NO; oneof: undefined; }, fieldPropertyAccess: ts.PropertyAccessExpression): ts.Statement[] {
        const descMessage = this.registry.getMessage(field.T().typeName);
        assert(descMessage);
        let handlerMergeCall = ts.createCall(
            ts.createPropertyAccess(
                ts.createIdentifier(this.imports.type(source, descMessage)),
                ts.createIdentifier("internalBinaryRead")
            ),
            undefined,
            [
                ts.createIdentifier("reader"),
                this.makeReaderCall("reader", rt.ScalarType.UINT32),
                ts.createIdentifier("options"),
                fieldPropertyAccess
            ]
        );
        return [ts.createExpressionStatement(ts.createBinary(
            ts.createPropertyAccess(ts.createIdentifier("message"), field.localName),
            ts.createToken(ts.SyntaxKind.EqualsToken),
            handlerMergeCall
        ))];
    }


    // message.result = {
    //     oneofKind: "msg",
    //     msg: OtherMessage.internalBinaryRead(reader, reader.uint32(), options, (message.result as any).msg)
    // };
    private messageOneof(source:TypescriptFile,field: rt.FieldInfo & { kind: "message"; repeat: undefined | rt.RepeatType.NO; oneof: string; }): ts.Statement[] {
        let handlerMergeCall = ts.createCall(
            ts.createPropertyAccess(
                ts.createIdentifier(this.imports.typeByName(source, field.T().typeName)),
                ts.createIdentifier("internalBinaryRead")
            ),
            undefined,
            [
                ts.createIdentifier("reader"),
                this.makeReaderCall("reader", rt.ScalarType.UINT32),
                ts.createIdentifier("options"),
                ts.createPropertyAccess(
                    ts.createParen(ts.createAsExpression(
                        ts.createPropertyAccess(ts.createIdentifier("message"), field.oneof),
                        ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
                    )),
                    ts.createIdentifier(field.localName)
                )
            ]
        );
        return [ts.createExpressionStatement(ts.createBinary(
            ts.createPropertyAccess(ts.createIdentifier("message"), field.oneof),
            ts.createToken(ts.SyntaxKind.EqualsToken),
            ts.createObjectLiteral(
                [
                    //     oneofKind: "msg",
                    ts.createPropertyAssignment(ts.createIdentifier(this.options.oneofKindDiscriminator), ts.createStringLiteral(field.localName)),
                    //     msg: OtherMessage.internalBinaryRead(reader, reader.uint32(), options, (message.result as any).msg)
                    ts.createPropertyAssignment(field.localName, handlerMergeCall)
                ],
                true
            )
        ))];
    }


    // message.field.push(OtherMessage.internalBinaryRead(reader, reader.uint32(), options));
    private messageRepeated(source:TypescriptFile,field: rt.FieldInfo & { kind: "message"; repeat: rt.RepeatType.PACKED | rt.RepeatType.UNPACKED; oneof: undefined; }, fieldPropertyAccess: ts.PropertyAccessExpression): ts.Statement[] {
        let handlerMergeCall = ts.createCall(
            ts.createPropertyAccess(
                ts.createIdentifier(this.imports.typeByName(source, field.T().typeName)),
                ts.createIdentifier("internalBinaryRead")
            ),
            undefined,
            [
                ts.createIdentifier("reader"),
                this.makeReaderCall("reader", rt.ScalarType.UINT32),
                ts.createIdentifier("options"),
            ]
        );
        return [ts.createExpressionStatement(ts.createCall(
            ts.createPropertyAccess(
                fieldPropertyAccess,
                ts.createIdentifier("push")
            ),
            undefined,
            [handlerMergeCall]
        ))];
    }


    // message.doubleField = reader.double();
    private scalar(field: rt.FieldInfo & { kind: "scalar" | "enum"; oneof: undefined; repeat: undefined | rt.RepeatType.NO }, fieldPropertyAccess: ts.PropertyAccessExpression): ts.Statement[] {
        let type = field.kind == "enum" ? rt.ScalarType.INT32 : field.T;
        let longType = field.kind == "enum" ? undefined : field.L;
        let readerCall = this.makeReaderCall("reader", type, longType);
        return [ts.createExpressionStatement(ts.createBinary(
            fieldPropertyAccess,
            ts.createToken(ts.SyntaxKind.EqualsToken),
            readerCall
        ))];
    }


    // message.result = {
    //     oneofKind: "err",
    //     err: reader.string()
    // };
    private scalarOneof(field: rt.FieldInfo & { kind: "scalar" | "enum"; oneof: string; repeat: undefined | rt.RepeatType.NO }): ts.Statement[] {
        let type = field.kind == "enum" ? rt.ScalarType.INT32 : field.T;
        let longType = field.kind == "enum" ? undefined : field.L;
        return [ts.createExpressionStatement(ts.createBinary(
            ts.createPropertyAccess(ts.createIdentifier("message"), field.oneof),
            ts.createToken(ts.SyntaxKind.EqualsToken),
            ts.createObjectLiteral(
                [
                    //     oneofKind: "err",
                    ts.createPropertyAssignment(ts.createIdentifier(this.options.oneofKindDiscriminator), ts.createStringLiteral(field.localName)),
                    //     err: reader.string()
                    ts.createPropertyAssignment(field.localName, this.makeReaderCall("reader", type, longType))
                ],
                true
            )
        ))];
    }


    // if (wireType === WireType.LengthDelimited)
    //     for (const e = reader.int32() + reader.pos; reader.pos < e;)
    //         message.doubleField.push(reader.double());
    // else
    //     message.doubleField.push(reader.double());
    private scalarRepeated(source:TypescriptFile,field: rt.FieldInfo & { kind: "scalar" | "enum"; oneof: undefined; repeat: rt.RepeatType.PACKED | rt.RepeatType.UNPACKED }, fieldPropertyAccess: ts.PropertyAccessExpression): ts.Statement[] {
        let type = field.kind == "enum" ? rt.ScalarType.INT32 : field.T;
        let longType = field.kind == "enum" ? undefined : field.L;

        switch (type) {
            case rt.ScalarType.STRING:
            case rt.ScalarType.BYTES:
                // never packed
                // message.${fieldName}.push(reader.${readerMethod}());
                return [ts.createExpressionStatement(ts.createCall(
                    ts.createPropertyAccess(
                        fieldPropertyAccess,
                        ts.createIdentifier("push")
                    ),
                    undefined,
                    [this.makeReaderCall('reader', type, longType)]
                ))];

            default:
                // maybe packed
                return [
                    ts.createIf(
                        ts.createBinary(
                            ts.createIdentifier("wireType"),
                            ts.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
                            ts.createPropertyAccess(
                                ts.createIdentifier(this.imports.name(source, 'WireType', this.options.runtimeImportPath)),
                                'LengthDelimited'
                            )
                            // ts.addSyntheticTrailingComment(
                            //     ts.createNumericLiteral(WireType.LengthDelimited.toString()),
                            //     ts.SyntaxKind.MultiLineCommentTrivia, " packed! ", false
                            // )
                        ),
                        ts.createFor(
                            ts.createVariableDeclarationList(
                                [ts.createVariableDeclaration(
                                    ts.createIdentifier("e"),
                                    undefined,
                                    ts.createBinary(
                                        this.makeReaderCall("reader", rt.ScalarType.INT32),
                                        ts.createToken(ts.SyntaxKind.PlusToken),
                                        ts.createPropertyAccess(
                                            ts.createIdentifier("reader"),
                                            ts.createIdentifier("pos")
                                        )
                                    )
                                )],
                                ts.NodeFlags.Let
                            ),
                            ts.createBinary(
                                ts.createPropertyAccess(ts.createIdentifier("reader"), ts.createIdentifier("pos")),
                                ts.createToken(ts.SyntaxKind.LessThanToken),
                                ts.createIdentifier("e")
                            ),
                            undefined,
                            ts.createExpressionStatement(ts.createCall(
                                ts.createPropertyAccess(
                                    fieldPropertyAccess,
                                    ts.createIdentifier("push")
                                ),
                                undefined,
                                [this.makeReaderCall("reader", type, longType)]
                            ))
                        ),
                        ts.createExpressionStatement(ts.createCall(
                            ts.createPropertyAccess(
                                fieldPropertyAccess,
                                ts.createIdentifier("push")
                            ),
                            undefined,
                            [this.makeReaderCall("reader", type, longType)]
                        ))
                    ),
                ];

        }
    }


    // binaryReadMapEntry<field no>(map: ExampleResponse["<field local name>"], reader: IBinaryReader, options: BinaryReadOptions): void
    private makeMapEntryReadMethod(source:TypescriptFile, descMessage: DescMessage, field: rt.FieldInfo & { kind: "map" }): ts.MethodDeclaration {
        let
            methodName = this.binaryReadMapEntryMethodName + field.no,
            MessageInterface = this.imports.type(source, descMessage),
            IBinaryReader = this.imports.name(source, 'IBinaryReader', this.options.runtimeImportPath, true),
            BinaryReadOptions = this.imports.name(source, 'BinaryReadOptions', this.options.runtimeImportPath, true),
            methodStatements: ts.Statement[] = [];
        const fieldQualifiedName = descMessage.typeName + "." + field.name;

        // let len = reader.uint32(), end = reader.pos + len, key: keyof EnumMapMessage["int64EnuField"] | undefined, val: EnumMapMessage["int64EnuField"][any] | undefined;
        methodStatements.push(
            ts.createVariableStatement(
                undefined,
                ts.createVariableDeclarationList(
                    [
                        ts.createVariableDeclaration(
                            ts.createIdentifier("len"),
                            undefined,
                            ts.createCall(
                                ts.createPropertyAccess(
                                    ts.createIdentifier("reader"),
                                    ts.createIdentifier("uint32")
                                ),
                                undefined,
                                []
                            )
                        ),
                        ts.createVariableDeclaration(
                            ts.createIdentifier("end"),
                            undefined,
                            ts.createBinary(
                                ts.createPropertyAccess(
                                    ts.createIdentifier("reader"),
                                    ts.createIdentifier("pos")
                                ),
                                ts.createToken(ts.SyntaxKind.PlusToken),
                                ts.createIdentifier("len")
                            )
                        ),
                        ts.createVariableDeclaration(
                            ts.createIdentifier("key"),
                            ts.createUnionTypeNode([
                                ts.createTypeOperatorNode(ts.createIndexedAccessTypeNode(
                                    ts.createTypeReferenceNode(
                                        MessageInterface,
                                        undefined
                                    ),
                                    ts.createLiteralTypeNode(ts.createStringLiteral(field.localName))
                                )),
                                ts.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword)
                            ]),
                            undefined
                        ),
                        ts.createVariableDeclaration(
                            ts.createIdentifier("val"),
                            ts.createUnionTypeNode([
                                ts.createIndexedAccessTypeNode(
                                    ts.createIndexedAccessTypeNode(
                                        ts.createTypeReferenceNode(
                                            MessageInterface,
                                            undefined
                                        ),
                                        ts.createLiteralTypeNode(ts.createStringLiteral(field.localName))
                                    ),
                                    ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
                                ),
                                ts.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword)
                            ]),
                            undefined
                        )
                    ],
                    ts.NodeFlags.Let
                )
            )
        );


        // reader.string()
        let readKeyExpression = this.makeReaderCall("reader", field.K, rt.LongType.STRING);
        if (field.K === rt.ScalarType.BOOL) {
            readKeyExpression = ts.createCall(ts.createPropertyAccess(readKeyExpression, ts.createIdentifier("toString")), undefined, []);
        }

        // reader.bytes()
        let readValueExpression: ts.Expression;
        switch (field.V.kind) {
            case "scalar":
                readValueExpression = this.makeReaderCall("reader", field.V.T, field.V.L);
                break;

            case "enum":
                readValueExpression = this.makeReaderCall("reader", rt.ScalarType.INT32);
                break;

            case "message":
                readValueExpression = ts.createCall(
                    ts.createPropertyAccess(ts.createIdentifier(this.imports.typeByName(source, field.V.T().typeName)), ts.createIdentifier("internalBinaryRead")),
                    undefined,
                    [
                        ts.createIdentifier("reader"),
                        this.makeReaderCall("reader", rt.ScalarType.UINT32),
                        ts.createIdentifier("options")
                    ]
                );
                break;
        }


        // while (reader.pos < end) {
        methodStatements.push(
            ts.createWhile(
                ts.createBinary(
                    ts.createPropertyAccess(
                        ts.createIdentifier("reader"),
                        ts.createIdentifier("pos")
                    ),
                    ts.createToken(ts.SyntaxKind.LessThanToken),
                    ts.createIdentifier("end")
                ),
                ts.createBlock(
                    [
                        // let [fieldNo, wireType] = reader.tag();
                        ts.createVariableStatement(
                            undefined,
                            ts.createVariableDeclarationList(
                                [ts.createVariableDeclaration(
                                    ts.createArrayBindingPattern([
                                        ts.createBindingElement(
                                            undefined,
                                            undefined,
                                            ts.createIdentifier("fieldNo"),
                                            undefined
                                        ),
                                        ts.createBindingElement(
                                            undefined,
                                            undefined,
                                            ts.createIdentifier("wireType"),
                                            undefined
                                        )
                                    ]),
                                    undefined,
                                    ts.createCall(
                                        ts.createPropertyAccess(
                                            ts.createIdentifier("reader"),
                                            ts.createIdentifier("tag")
                                        ),
                                        undefined,
                                        []
                                    )
                                )],
                                ts.NodeFlags.Let
                            )
                        ),
                        // switch (fieldNo) {
                        ts.createSwitch(
                            ts.createIdentifier("fieldNo"),
                            ts.createCaseBlock([
                                // case 1:
                                ts.createCaseClause(
                                    ts.createNumericLiteral("1"),
                                    [
                                        // key = reader....
                                        ts.createExpressionStatement(ts.createBinary(
                                            ts.createIdentifier("key"),
                                            ts.createToken(ts.SyntaxKind.EqualsToken),
                                            readKeyExpression
                                        )),
                                        ts.createBreak(undefined)
                                    ]
                                ),
                                // case 2:
                                ts.createCaseClause(
                                    ts.createNumericLiteral("2"),
                                    [
                                        // value = ...
                                        ts.createExpressionStatement(ts.createBinary(
                                            ts.createIdentifier("val"),
                                            ts.createToken(ts.SyntaxKind.EqualsToken),
                                            readValueExpression
                                        )),
                                        ts.createBreak(undefined)
                                    ]
                                ),
                                ts.createDefaultClause([ts.createThrow(ts.createNew(
                                    ts.createPropertyAccess(
                                        ts.createIdentifier("globalThis"),
                                        ts.createIdentifier("Error")
                                    ),
                                    undefined,
                                    [ts.createStringLiteral("unknown map entry field for " + fieldQualifiedName)]
                                ))])
                            ])
                        )
                    ],
                    true
                )
            )
        );


        // map[key ?? ""] = val ?? 0;
        methodStatements.push(
            ts.createExpressionStatement(ts.createBinary(
                ts.createElementAccess(
                    ts.createIdentifier("map"),
                    ts.createBinary(
                        ts.createIdentifier("key"),
                        ts.createToken(ts.SyntaxKind.QuestionQuestionToken),
                        this.createMapKeyDefaultValue(field.K)
                    )
                ),
                ts.createToken(ts.SyntaxKind.EqualsToken),
                ts.createBinary(
                    ts.createIdentifier("val"),
                    ts.createToken(ts.SyntaxKind.QuestionQuestionToken),
                    this.createMapValueDefaultValue(source,field.V)
                )
            ))
        );


        // private binaryReadMapEntry<field no>(map: ExampleResponse["<field local name>"], reader: IBinaryReader, options: BinaryReadOptions): void
        return ts.createMethod(
            undefined,
            [ts.createModifier(ts.SyntaxKind.PrivateKeyword)],
            undefined,
            ts.createIdentifier(methodName),
            undefined,
            undefined,
            [
                ts.createParameter(
                    undefined,
                    undefined,
                    undefined,
                    ts.createIdentifier("map"),
                    undefined,
                    ts.createIndexedAccessTypeNode(
                        ts.createTypeReferenceNode(
                            ts.createIdentifier(MessageInterface),
                            undefined
                        ),
                        ts.createLiteralTypeNode(ts.createStringLiteral(field.localName))
                    ),
                    undefined
                ),
                ts.createParameter(
                    undefined,
                    undefined,
                    undefined,
                    ts.createIdentifier("reader"),
                    undefined,
                    ts.createTypeReferenceNode(
                        ts.createIdentifier(IBinaryReader),
                        undefined
                    ),
                    undefined
                ),
                ts.createParameter(
                    undefined,
                    undefined,
                    undefined,
                    ts.createIdentifier("options"),
                    undefined,
                    ts.createTypeReferenceNode(
                        ts.createIdentifier(BinaryReadOptions),
                        undefined
                    ),
                    undefined
                )

            ],
            ts.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword),
            ts.createBlock(
                methodStatements,
                true
            )
        );
    }


    private createMapKeyDefaultValue(type: rt.ScalarType): ts.Expression {
        let value = this.createScalarDefaultValue(type);
        assert(value !== undefined);
        // javascript object key must be number or string
        // noinspection SuspiciousTypeOfGuard
        if (typeof value !== "number") {
            value = value.toString();
        }
        return typescriptLiteralFromValue(value);
    }

    private createMapValueDefaultValue(source:TypescriptFile,V: (rt.FieldInfo & { kind: "map" })["V"]): ts.Expression {
        switch (V.kind) {
            case "scalar":
                return typescriptLiteralFromValue(this.createScalarDefaultValue(V.T, V.L));
            case "enum":
                return typescriptLiteralFromValue(this.createScalarDefaultValue(rt.ScalarType.INT32));
            case "message":
                const descMessage = this.registry.getMessage(V.T().typeName);
                assert(descMessage);
                let MessageInterface = this.imports.type(source, descMessage);
                return ts.createCall(
                    ts.createPropertyAccess(
                        ts.createIdentifier(MessageInterface),
                        ts.createIdentifier("create")
                    ),
                    undefined,
                    []
                );
        }
    }

    // noinspection JSMethodCanBeStatic
    private createScalarDefaultValue(type: rt.ScalarType, longType?: rt.LongType): rt.UnknownScalar {
        let syntheticType = new rt.MessageType<rt.UnknownMessage>("$synthetic.InternalBinaryRead", [{
            no: 1, name: "syntheticField", localName: "syntheticField", kind: "scalar", T: type, L: longType
        }]);
        const value = syntheticType.create().syntheticField;
        assert(value !== undefined);
        return value as rt.UnknownScalar;
    }


    // reader.int32().toString()
    // reader.int32().toBigInt()
    // reader.int32().toNumber()
    private makeReaderCall(readerExpressionOrName: string | ts.Expression, type: rt.ScalarType, longType?: rt.LongType): ts.Expression {
        let readerMethodName = ScalarType[type].toLowerCase();
        let readerMethodProp = ts.createPropertyAccess(typeof readerExpressionOrName == "string" ? ts.createIdentifier(readerExpressionOrName) : readerExpressionOrName, ts.createIdentifier(readerMethodName));
        let readerMethodCall = ts.createCall(
            readerMethodProp,
            undefined, []
        );
        if (!Interpreter.isLongValueType(type)) {
            return readerMethodCall;
        }
        let convertMethodProp;
        switch (longType ?? rt.LongType.STRING) {
            case rt.LongType.STRING:
                convertMethodProp = ts.createPropertyAccess(readerMethodCall, ts.createIdentifier('toString'));
                break;
            case rt.LongType.NUMBER:
                convertMethodProp = ts.createPropertyAccess(readerMethodCall, ts.createIdentifier('toNumber'));
                break;
            case rt.LongType.BIGINT:
                convertMethodProp = ts.createPropertyAccess(readerMethodCall, ts.createIdentifier('toBigInt'));
                break;
        }
        return ts.createCall(
            convertMethodProp,
            undefined, []
        );
    }


}

