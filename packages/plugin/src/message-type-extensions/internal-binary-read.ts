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
            ts.factory.createReturnStatement(ts.factory.createIdentifier("message")),
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
        return ts.factory.createMethodDeclaration(undefined, undefined, ts.factory.createIdentifier("internalBinaryRead"), undefined, undefined,
            [
                ts.factory.createParameterDeclaration(undefined, undefined, ts.factory.createIdentifier("reader"), undefined, ts.factory.createTypeReferenceNode(IBinaryReader, undefined), undefined),
                ts.factory.createParameterDeclaration(undefined, undefined, ts.factory.createIdentifier("length"), undefined, ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword), undefined),
                ts.factory.createParameterDeclaration(undefined, undefined, ts.factory.createIdentifier("options"), undefined,
                    ts.factory.createTypeReferenceNode(BinaryReadOptions, undefined), undefined
                ),
                ts.factory.createParameterDeclaration(undefined, undefined, ts.factory.createIdentifier("target"), ts.factory.createToken(ts.SyntaxKind.QuestionToken),
                    ts.factory.createTypeReferenceNode(MessageInterface, undefined),
                    undefined
                )
            ],
            ts.factory.createTypeReferenceNode(MessageInterface, undefined),
            ts.factory.createBlock(bodyStatements, true)
        );
    }

    private makeVariables(): ts.VariableStatement {
        // let message = target ?? this.create(), end = reader.pos + length;
        return ts.factory.createVariableStatement(
            undefined,
            ts.factory.createVariableDeclarationList(
                [
                    ts.factory.createVariableDeclaration(
                        ts.factory.createIdentifier("message"),
                        undefined,
                        undefined,
                        ts.factory.createBinaryExpression(
                            ts.factory.createIdentifier("target"),
                            ts.factory.createToken(ts.SyntaxKind.QuestionQuestionToken),
                            ts.factory.createCallExpression(
                                ts.factory.createPropertyAccessExpression(
                                    ts.factory.createThis(),
                                    ts.factory.createIdentifier("create")
                                ), undefined, []
                            )
                        )
                    ),
                    ts.factory.createVariableDeclaration(
                        ts.factory.createIdentifier("end"),
                        undefined,
                        undefined,
                        ts.factory.createBinaryExpression(
                            ts.factory.createPropertyAccessExpression(
                                ts.factory.createIdentifier("reader"),
                                ts.factory.createIdentifier("pos")
                            ),
                            ts.factory.createToken(ts.SyntaxKind.PlusToken),
                            ts.factory.createIdentifier("length")
                        )
                    )
                ],
                ts.NodeFlags.Let
            )
        );
    }

    private makeWhileSwitch(switchCases: ts.CaseClause[], defaultClause: ts.DefaultClause): ts.WhileStatement {
        return ts.factory.createWhileStatement(
            ts.factory.createBinaryExpression(
                ts.factory.createPropertyAccessExpression(
                    ts.factory.createIdentifier("reader"),
                    ts.factory.createIdentifier("pos")
                ),
                ts.factory.createToken(ts.SyntaxKind.LessThanToken),
                ts.factory.createIdentifier("end")
            ),
            ts.factory.createBlock(
                [

                    ts.factory.createVariableStatement(
                        undefined,
                        ts.factory.createVariableDeclarationList(
                            [ts.factory.createVariableDeclaration(
                                ts.factory.createArrayBindingPattern([
                                    ts.factory.createBindingElement(
                                        undefined,
                                        undefined,
                                        ts.factory.createIdentifier("fieldNo"),
                                        undefined
                                    ),
                                    ts.factory.createBindingElement(
                                        undefined,
                                        undefined,
                                        ts.factory.createIdentifier("wireType"),
                                        undefined
                                    )
                                ]),
                                undefined,
                                undefined,
                                ts.factory.createCallExpression(
                                    ts.factory.createPropertyAccessExpression(
                                        ts.factory.createIdentifier("reader"),
                                        ts.factory.createIdentifier("tag")
                                    ),
                                    undefined,
                                    []
                                )
                            )],
                            ts.NodeFlags.Let
                        )
                    ),
                    ts.factory.createSwitchStatement(
                        ts.factory.createIdentifier("fieldNo"),
                        ts.factory.createCaseBlock([
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
                fieldPropertyAccess = ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier("message"), fieldInfo.localName);

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
            let fieldNumber = ts.factory.createNumericLiteral(`${fieldInfo.no}`);
            const fieldDeclarationComment = " " + getDeclarationString(descField)
                .replace(/= \d+$/, '')
                .replace(/]$/, '] ');
            ts.addSyntheticLeadingComment(fieldNumber, ts.SyntaxKind.MultiLineCommentTrivia, fieldDeclarationComment, false)
            clauses.push(ts.factory.createCaseClause(
                fieldNumber,
                [...statements, ts.factory.createBreakStatement(undefined)]
            ));
        }

        return clauses;
    }

    private makeDefaultClause(source:TypescriptFile,): ts.DefaultClause {
        let UnknownFieldHandler = this.imports.name(source, 'UnknownFieldHandler', this.options.runtimeImportPath);
        return ts.factory.createDefaultClause([
                ts.factory.createVariableStatement(
                    undefined,
                    ts.factory.createVariableDeclarationList(
                        [ts.factory.createVariableDeclaration(
                            ts.factory.createIdentifier("u"),
                            undefined,
                            undefined,
                            ts.factory.createPropertyAccessExpression(
                                ts.factory.createIdentifier("options"),
                                ts.factory.createIdentifier("readUnknownField")
                            )
                        )],
                        ts.NodeFlags.Let
                    )
                ),
                ts.factory.createIfStatement(
                    ts.factory.createBinaryExpression(
                        ts.factory.createIdentifier("u"),
                        ts.factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
                        ts.factory.createStringLiteral("throw")
                    ),
                    ts.factory.createThrowStatement(ts.factory.createNewExpression(
                        ts.factory.createPropertyAccessExpression(
                            ts.factory.createIdentifier("globalThis"),
                            ts.factory.createIdentifier("Error")
                        ),
                        undefined,
                        [ts.factory.createTemplateExpression(
                            ts.factory.createTemplateHead(
                                "Unknown field ",
                                "Unknown field "
                            ),
                            [
                                ts.factory.createTemplateSpan(
                                    ts.factory.createIdentifier("fieldNo"),
                                    ts.factory.createTemplateMiddle(
                                        " (wire type ",
                                        " (wire type "
                                    )
                                ),
                                ts.factory.createTemplateSpan(
                                    ts.factory.createIdentifier("wireType"),
                                    ts.factory.createTemplateMiddle(
                                        ") for ",
                                        ") for "
                                    )
                                ),
                                ts.factory.createTemplateSpan(
                                    ts.factory.createPropertyAccessExpression(
                                        ts.factory.createThis(),
                                        ts.factory.createIdentifier("typeName")
                                    ),
                                    ts.factory.createTemplateTail(
                                        "",
                                        ""
                                    )
                                )
                            ]
                        )]
                    )),
                    undefined
                ),
                ts.factory.createVariableStatement(
                    undefined,
                    ts.factory.createVariableDeclarationList(
                        [ts.factory.createVariableDeclaration(
                            ts.factory.createIdentifier("d"),
                            undefined,
                            undefined,
                            ts.factory.createCallExpression(
                                ts.factory.createPropertyAccessExpression(
                                    ts.factory.createIdentifier("reader"),
                                    ts.factory.createIdentifier("skip")
                                ),
                                undefined,
                                [ts.factory.createIdentifier("wireType")]
                            )
                        )],
                        ts.NodeFlags.Let
                    )
                ),
                ts.factory.createIfStatement(
                    ts.factory.createBinaryExpression(
                        ts.factory.createIdentifier("u"),
                        ts.factory.createToken(ts.SyntaxKind.ExclamationEqualsEqualsToken),
                        ts.factory.createFalse()
                    ),
                    ts.factory.createExpressionStatement(ts.factory.createCallExpression(
                        ts.factory.createParenthesizedExpression(ts.factory.createConditionalExpression(
                            ts.factory.createBinaryExpression(
                                ts.factory.createIdentifier("u"),
                                ts.factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
                                ts.factory.createTrue()
                            ),
                            ts.factory.createToken(ts.SyntaxKind.QuestionToken),
                            ts.factory.createPropertyAccessExpression(
                                ts.factory.createIdentifier(UnknownFieldHandler),
                                ts.factory.createIdentifier("onRead")
                            ),
                            ts.factory.createToken(ts.SyntaxKind.ColonToken),
                            ts.factory.createIdentifier("u")
                        )),
                        undefined,
                        [
                            ts.factory.createPropertyAccessExpression(
                                ts.factory.createThis(),
                                ts.factory.createIdentifier("typeName")
                            ),
                            ts.factory.createIdentifier("message"),
                            ts.factory.createIdentifier("fieldNo"),
                            ts.factory.createIdentifier("wireType"),
                            ts.factory.createIdentifier("d")
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
        return [ts.factory.createExpressionStatement(ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
                ts.factory.createThis(),
                ts.factory.createIdentifier(this.binaryReadMapEntryMethodName + field.no)
            ),
            undefined,
            [
                fieldPropertyAccess,
                ts.factory.createIdentifier("reader"),
                ts.factory.createIdentifier("options")
            ]
        ))];
    }


    // message.field = OtherMessage.internalBinaryRead(reader, reader.uint32(), options, message.field);
    private message(source:TypescriptFile, field: rt.FieldInfo & { kind: "message"; repeat: undefined | rt.RepeatType.NO; oneof: undefined; }, fieldPropertyAccess: ts.PropertyAccessExpression): ts.Statement[] {
        const descMessage = this.registry.getMessage(field.T().typeName);
        assert(descMessage);
        let handlerMergeCall = ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
                ts.factory.createIdentifier(this.imports.type(source, descMessage)),
                ts.factory.createIdentifier("internalBinaryRead")
            ),
            undefined,
            [
                ts.factory.createIdentifier("reader"),
                this.makeReaderCall("reader", rt.ScalarType.UINT32),
                ts.factory.createIdentifier("options"),
                fieldPropertyAccess
            ]
        );
        return [ts.factory.createExpressionStatement(ts.factory.createBinaryExpression(
            ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier("message"), field.localName),
            ts.factory.createToken(ts.SyntaxKind.EqualsToken),
            handlerMergeCall
        ))];
    }


    // message.result = {
    //     oneofKind: "msg",
    //     msg: OtherMessage.internalBinaryRead(reader, reader.uint32(), options, (message.result as any).msg)
    // };
    private messageOneof(source:TypescriptFile,field: rt.FieldInfo & { kind: "message"; repeat: undefined | rt.RepeatType.NO; oneof: string; }): ts.Statement[] {
        let handlerMergeCall = ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
                ts.factory.createIdentifier(this.imports.typeByName(source, field.T().typeName)),
                ts.factory.createIdentifier("internalBinaryRead")
            ),
            undefined,
            [
                ts.factory.createIdentifier("reader"),
                this.makeReaderCall("reader", rt.ScalarType.UINT32),
                ts.factory.createIdentifier("options"),
                ts.factory.createPropertyAccessExpression(
                    ts.factory.createParenthesizedExpression(ts.factory.createAsExpression(
                        ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier("message"), field.oneof),
                        ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
                    )),
                    ts.factory.createIdentifier(field.localName)
                )
            ]
        );
        return [ts.factory.createExpressionStatement(ts.factory.createBinaryExpression(
            ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier("message"), field.oneof),
            ts.factory.createToken(ts.SyntaxKind.EqualsToken),
            ts.factory.createObjectLiteralExpression(
                [
                    //     oneofKind: "msg",
                    ts.factory.createPropertyAssignment(ts.factory.createIdentifier(this.options.oneofKindDiscriminator), ts.factory.createStringLiteral(field.localName)),
                    //     msg: OtherMessage.internalBinaryRead(reader, reader.uint32(), options, (message.result as any).msg)
                    ts.factory.createPropertyAssignment(field.localName, handlerMergeCall)
                ],
                true
            )
        ))];
    }


    // message.field.push(OtherMessage.internalBinaryRead(reader, reader.uint32(), options));
    private messageRepeated(source:TypescriptFile,field: rt.FieldInfo & { kind: "message"; repeat: rt.RepeatType.PACKED | rt.RepeatType.UNPACKED; oneof: undefined; }, fieldPropertyAccess: ts.PropertyAccessExpression): ts.Statement[] {
        let handlerMergeCall = ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
                ts.factory.createIdentifier(this.imports.typeByName(source, field.T().typeName)),
                ts.factory.createIdentifier("internalBinaryRead")
            ),
            undefined,
            [
                ts.factory.createIdentifier("reader"),
                this.makeReaderCall("reader", rt.ScalarType.UINT32),
                ts.factory.createIdentifier("options"),
            ]
        );
        return [ts.factory.createExpressionStatement(ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
                fieldPropertyAccess,
                ts.factory.createIdentifier("push")
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
        return [ts.factory.createExpressionStatement(ts.factory.createBinaryExpression(
            fieldPropertyAccess,
            ts.factory.createToken(ts.SyntaxKind.EqualsToken),
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
        return [ts.factory.createExpressionStatement(ts.factory.createBinaryExpression(
            ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier("message"), field.oneof),
            ts.factory.createToken(ts.SyntaxKind.EqualsToken),
            ts.factory.createObjectLiteralExpression(
                [
                    //     oneofKind: "err",
                    ts.factory.createPropertyAssignment(ts.factory.createIdentifier(this.options.oneofKindDiscriminator), ts.factory.createStringLiteral(field.localName)),
                    //     err: reader.string()
                    ts.factory.createPropertyAssignment(field.localName, this.makeReaderCall("reader", type, longType))
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
                return [ts.factory.createExpressionStatement(ts.factory.createCallExpression(
                    ts.factory.createPropertyAccessExpression(
                        fieldPropertyAccess,
                        ts.factory.createIdentifier("push")
                    ),
                    undefined,
                    [this.makeReaderCall('reader', type, longType)]
                ))];

            default:
                // maybe packed
                return [
                    ts.factory.createIfStatement(
                        ts.factory.createBinaryExpression(
                            ts.factory.createIdentifier("wireType"),
                            ts.factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
                            ts.factory.createPropertyAccessExpression(
                                ts.factory.createIdentifier(this.imports.name(source, 'WireType', this.options.runtimeImportPath)),
                                'LengthDelimited'
                            )
                            // ts.addSyntheticTrailingComment(
                            //     ts.factory.createNumericLiteral(WireType.LengthDelimited.toString()),
                            //     ts.SyntaxKind.MultiLineCommentTrivia, " packed! ", false
                            // )
                        ),
                        ts.factory.createForStatement(
                            ts.factory.createVariableDeclarationList(
                                [ts.factory.createVariableDeclaration(
                                    ts.factory.createIdentifier("e"),
                                    undefined,
                                    undefined,
                                    ts.factory.createBinaryExpression(
                                        this.makeReaderCall("reader", rt.ScalarType.INT32),
                                        ts.factory.createToken(ts.SyntaxKind.PlusToken),
                                        ts.factory.createPropertyAccessExpression(
                                            ts.factory.createIdentifier("reader"),
                                            ts.factory.createIdentifier("pos")
                                        )
                                    )
                                )],
                                ts.NodeFlags.Let
                            ),
                            ts.factory.createBinaryExpression(
                                ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier("reader"), ts.factory.createIdentifier("pos")),
                                ts.factory.createToken(ts.SyntaxKind.LessThanToken),
                                ts.factory.createIdentifier("e")
                            ),
                            undefined,
                            ts.factory.createExpressionStatement(ts.factory.createCallExpression(
                                ts.factory.createPropertyAccessExpression(
                                    fieldPropertyAccess,
                                    ts.factory.createIdentifier("push")
                                ),
                                undefined,
                                [this.makeReaderCall("reader", type, longType)]
                            ))
                        ),
                        ts.factory.createExpressionStatement(ts.factory.createCallExpression(
                            ts.factory.createPropertyAccessExpression(
                                fieldPropertyAccess,
                                ts.factory.createIdentifier("push")
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
            ts.factory.createVariableStatement(
                undefined,
                ts.factory.createVariableDeclarationList(
                    [
                        ts.factory.createVariableDeclaration(
                            ts.factory.createIdentifier("len"),
                            undefined,
                            undefined,
                            ts.factory.createCallExpression(
                                ts.factory.createPropertyAccessExpression(
                                    ts.factory.createIdentifier("reader"),
                                    ts.factory.createIdentifier("uint32")
                                ),
                                undefined,
                                []
                            )
                        ),
                        ts.factory.createVariableDeclaration(
                            ts.factory.createIdentifier("end"),
                            undefined,
                            undefined,
                            ts.factory.createBinaryExpression(
                                ts.factory.createPropertyAccessExpression(
                                    ts.factory.createIdentifier("reader"),
                                    ts.factory.createIdentifier("pos")
                                ),
                                ts.factory.createToken(ts.SyntaxKind.PlusToken),
                                ts.factory.createIdentifier("len")
                            )
                        ),
                        ts.factory.createVariableDeclaration(
                            ts.factory.createIdentifier("key"),
                            undefined,
                            ts.factory.createUnionTypeNode([
                                ts.factory.createIndexedAccessTypeNode(
                                    ts.factory.createTypeReferenceNode(
                                        MessageInterface,
                                        undefined
                                    ),
                                    ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(field.localName))
                                ),
                                ts.factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword)
                            ]),
                            undefined
                        ),
                        ts.factory.createVariableDeclaration(
                            ts.factory.createIdentifier("val"),
                            undefined,
                            ts.factory.createUnionTypeNode([
                                ts.factory.createIndexedAccessTypeNode(
                                    ts.factory.createIndexedAccessTypeNode(
                                        ts.factory.createTypeReferenceNode(
                                            MessageInterface,
                                            undefined
                                        ),
                                        ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(field.localName))
                                    ),
                                    ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
                                ),
                                ts.factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword)
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
            readKeyExpression = ts.factory.createCallExpression(ts.factory.createPropertyAccessExpression(readKeyExpression, ts.factory.createIdentifier("toString")), undefined, []);
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
                readValueExpression = ts.factory.createCallExpression(
                    ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier(this.imports.typeByName(source, field.V.T().typeName)), ts.factory.createIdentifier("internalBinaryRead")),
                    undefined,
                    [
                        ts.factory.createIdentifier("reader"),
                        this.makeReaderCall("reader", rt.ScalarType.UINT32),
                        ts.factory.createIdentifier("options")
                    ]
                );
                break;
        }


        // while (reader.pos < end) {
        methodStatements.push(
            ts.factory.createWhileStatement(
                ts.factory.createBinaryExpression(
                    ts.factory.createPropertyAccessExpression(
                        ts.factory.createIdentifier("reader"),
                        ts.factory.createIdentifier("pos")
                    ),
                    ts.factory.createToken(ts.SyntaxKind.LessThanToken),
                    ts.factory.createIdentifier("end")
                ),
                ts.factory.createBlock(
                    [
                        // let [fieldNo, wireType] = reader.tag();
                        ts.factory.createVariableStatement(
                            undefined,
                            ts.factory.createVariableDeclarationList(
                                [ts.factory.createVariableDeclaration(
                                    ts.factory.createArrayBindingPattern([
                                        ts.factory.createBindingElement(
                                            undefined,
                                            undefined,
                                            ts.factory.createIdentifier("fieldNo"),
                                            undefined
                                        ),
                                        ts.factory.createBindingElement(
                                            undefined,
                                            undefined,
                                            ts.factory.createIdentifier("wireType"),
                                            undefined
                                        )
                                    ]),
                                    undefined,
                                    undefined,
                                    ts.factory.createCallExpression(
                                        ts.factory.createPropertyAccessExpression(
                                            ts.factory.createIdentifier("reader"),
                                            ts.factory.createIdentifier("tag")
                                        ),
                                        undefined,
                                        []
                                    )
                                )],
                                ts.NodeFlags.Let
                            )
                        ),
                        // switch (fieldNo) {
                        ts.factory.createSwitchStatement(
                            ts.factory.createIdentifier("fieldNo"),
                            ts.factory.createCaseBlock([
                                // case 1:
                                ts.factory.createCaseClause(
                                    ts.factory.createNumericLiteral("1"),
                                    [
                                        // key = reader....
                                        ts.factory.createExpressionStatement(ts.factory.createBinaryExpression(
                                            ts.factory.createIdentifier("key"),
                                            ts.factory.createToken(ts.SyntaxKind.EqualsToken),
                                            readKeyExpression
                                        )),
                                        ts.factory.createBreakStatement(undefined)
                                    ]
                                ),
                                // case 2:
                                ts.factory.createCaseClause(
                                    ts.factory.createNumericLiteral("2"),
                                    [
                                        // value = ...
                                        ts.factory.createExpressionStatement(ts.factory.createBinaryExpression(
                                            ts.factory.createIdentifier("val"),
                                            ts.factory.createToken(ts.SyntaxKind.EqualsToken),
                                            readValueExpression
                                        )),
                                        ts.factory.createBreakStatement(undefined)
                                    ]
                                ),
                                ts.factory.createDefaultClause([ts.factory.createThrowStatement(ts.factory.createNewExpression(
                                    ts.factory.createPropertyAccessExpression(
                                        ts.factory.createIdentifier("globalThis"),
                                        ts.factory.createIdentifier("Error")
                                    ),
                                    undefined,
                                    [ts.factory.createStringLiteral("unknown map entry field for " + fieldQualifiedName)]
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
            ts.factory.createExpressionStatement(ts.factory.createBinaryExpression(
                ts.factory.createElementAccessExpression(
                    ts.factory.createIdentifier("map"),
                    ts.factory.createBinaryExpression(
                        ts.factory.createIdentifier("key"),
                        ts.factory.createToken(ts.SyntaxKind.QuestionQuestionToken),
                        this.createMapKeyDefaultValue(field.K)
                    )
                ),
                ts.factory.createToken(ts.SyntaxKind.EqualsToken),
                ts.factory.createBinaryExpression(
                    ts.factory.createIdentifier("val"),
                    ts.factory.createToken(ts.SyntaxKind.QuestionQuestionToken),
                    this.createMapValueDefaultValue(source,field.V)
                )
            ))
        );


        // private binaryReadMapEntry<field no>(map: ExampleResponse["<field local name>"], reader: IBinaryReader, options: BinaryReadOptions): void
        return ts.factory.createMethodDeclaration(
            [ts.factory.createModifier(ts.SyntaxKind.PrivateKeyword)],
            undefined,
            ts.factory.createIdentifier(methodName),
            undefined,
            undefined,
            [
                ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    ts.factory.createIdentifier("map"),
                    undefined,
                    ts.factory.createIndexedAccessTypeNode(
                        ts.factory.createTypeReferenceNode(
                            ts.factory.createIdentifier(MessageInterface),
                            undefined
                        ),
                        ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(field.localName))
                    ),
                    undefined
                ),
                ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    ts.factory.createIdentifier("reader"),
                    undefined,
                    ts.factory.createTypeReferenceNode(
                        ts.factory.createIdentifier(IBinaryReader),
                        undefined
                    ),
                    undefined
                ),
                ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    ts.factory.createIdentifier("options"),
                    undefined,
                    ts.factory.createTypeReferenceNode(
                        ts.factory.createIdentifier(BinaryReadOptions),
                        undefined
                    ),
                    undefined
                )

            ],
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword),
            ts.factory.createBlock(
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
                return ts.factory.createCallExpression(
                    ts.factory.createPropertyAccessExpression(
                        ts.factory.createIdentifier(MessageInterface),
                        ts.factory.createIdentifier("create")
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
        let readerMethodProp = ts.factory.createPropertyAccessExpression(typeof readerExpressionOrName == "string" ? ts.factory.createIdentifier(readerExpressionOrName) : readerExpressionOrName, ts.factory.createIdentifier(readerMethodName));
        let readerMethodCall = ts.factory.createCallExpression(
            readerMethodProp,
            undefined, []
        );
        if (!Interpreter.isLongValueType(type)) {
            return readerMethodCall;
        }
        let convertMethodProp;
        switch (longType ?? rt.LongType.STRING) {
            case rt.LongType.STRING:
                convertMethodProp = ts.factory.createPropertyAccessExpression(readerMethodCall, ts.factory.createIdentifier('toString'));
                break;
            case rt.LongType.NUMBER:
                convertMethodProp = ts.factory.createPropertyAccessExpression(readerMethodCall, ts.factory.createIdentifier('toNumber'));
                break;
            case rt.LongType.BIGINT:
                convertMethodProp = ts.factory.createPropertyAccessExpression(readerMethodCall, ts.factory.createIdentifier('toBigInt'));
                break;
        }
        return ts.factory.createCallExpression(
            convertMethodProp,
            undefined, []
        );
    }


}

