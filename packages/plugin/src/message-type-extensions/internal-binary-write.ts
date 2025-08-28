import * as ts from "typescript";
import {TypescriptFile} from "../framework/typescript-file";
import * as rt from "@protobuf-ts/runtime";
import {CustomMethodGenerator} from "../code-gen/message-type-generator";
import {assert} from "@protobuf-ts/runtime";
import {Interpreter} from "../interpreter";
import {DescMessage, FileRegistry, ScalarType} from "@bufbuild/protobuf";
import {getDeclarationString} from "@bufbuild/protoplugin";
import {TypeScriptImports} from "../framework/typescript-imports";
import {typescriptLiteralFromValue} from "../framework/typescript-literal-from-value";


/**
 * Generates the `internalBinaryWrite` method, which writes a message
 * in binary format.
 *
 * Heads up: The generated code is only very marginally faster than
 * the reflection-based one. The gain is less than 3%.
 *
 */
export class InternalBinaryWrite implements CustomMethodGenerator {


    constructor(
        private readonly registry: FileRegistry,
        private readonly imports: TypeScriptImports,
        private readonly interpreter: Interpreter,
        private readonly options: { oneofKindDiscriminator: string; runtimeImportPath: string },
    ) {
    }


    make(source: TypescriptFile, descMessage: DescMessage): ts.MethodDeclaration[] {
        // internalBinaryWrite(message: ScalarValuesMessage, writer: IBinaryWriter, options: BinaryWriteOptions): void {
        let internalBinaryWrite = this.makeMethod(
            source,
            descMessage,
            [
                ...this.makeStatementsForEveryField(source, descMessage),
                ...this.makeUnknownFieldsHandler(source),
                // return writer;
                ts.factory.createReturnStatement(ts.factory.createIdentifier("writer"))
            ],
        )
        return [internalBinaryWrite];
    }


    private makeMethod(source: TypescriptFile, descMessage: DescMessage, bodyStatements: readonly ts.Statement[]): ts.MethodDeclaration {
        const
            MessageInterface = this.imports.type(source, descMessage),
            IBinaryWriter = this.imports.name(source, 'IBinaryWriter', this.options.runtimeImportPath, true),
            BinaryWriteOptions = this.imports.name(source, 'BinaryWriteOptions', this.options.runtimeImportPath, true);
        return ts.factory.createMethodDeclaration(undefined, undefined, ts.factory.createIdentifier("internalBinaryWrite"), undefined, undefined,
            [
                ts.factory.createParameterDeclaration(undefined, undefined, ts.factory.createIdentifier("message"), undefined, ts.factory.createTypeReferenceNode(MessageInterface, undefined), undefined),
                ts.factory.createParameterDeclaration(undefined, undefined, ts.factory.createIdentifier("writer"), undefined, ts.factory.createTypeReferenceNode(IBinaryWriter, undefined), undefined),
                ts.factory.createParameterDeclaration(undefined, undefined, ts.factory.createIdentifier("options"), undefined, ts.factory.createTypeReferenceNode(BinaryWriteOptions, undefined), undefined),
            ],
            ts.factory.createTypeReferenceNode(IBinaryWriter, undefined),
            ts.factory.createBlock(bodyStatements, true)
        );
    }


    private makeUnknownFieldsHandler(source: TypescriptFile,): ts.Statement[] {
        let UnknownFieldHandler = this.imports.name(source, 'UnknownFieldHandler', this.options.runtimeImportPath);
        return [
            ts.factory.createVariableStatement(
                undefined,
                ts.factory.createVariableDeclarationList(
                    [ts.factory.createVariableDeclaration(
                        ts.factory.createIdentifier("u"),
                        undefined,
                        undefined,
                        ts.factory.createPropertyAccessExpression(
                            ts.factory.createIdentifier("options"),
                            ts.factory.createIdentifier("writeUnknownFields")
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
                            ts.factory.createToken(ts.SyntaxKind.EqualsEqualsToken),
                            ts.factory.createTrue()
                        ),
                        undefined,
                        ts.factory.createPropertyAccessExpression(
                            ts.factory.createIdentifier(UnknownFieldHandler),
                            ts.factory.createIdentifier("onWrite")
                        ),
                        undefined,
                        ts.factory.createIdentifier("u")
                    )),
                    undefined,
                    [
                        ts.factory.createPropertyAccessExpression(
                            ts.factory.createThis(),
                            ts.factory.createIdentifier("typeName")
                        ),
                        ts.factory.createIdentifier("message"),
                        ts.factory.createIdentifier("writer")
                    ]
                )),
                undefined
            )
        ];
    }


    private makeStatementsForEveryField(source: TypescriptFile, descMessage: DescMessage): ts.Statement[] {
        const
            interpreterType = this.interpreter.getMessageType(descMessage),
            statements: ts.Statement[] = [];

        for (let fieldInfo of interpreterType.fields.concat().sort((a, b) => a.no - b.no)) {

            let descField = descMessage.fields.find(descField => descField.number === fieldInfo.no);
            assert(descField !== undefined);
            // TODO drop semicolon added for BC
            let fieldDeclarationComment = getDeclarationString(descField) + ";";

            let fieldPropertyAccess = ts.factory.createPropertyAccessExpression(ts.factory.createIdentifier("message"), fieldInfo.localName);
            switch (fieldInfo.kind) {

                case "scalar":
                case "enum":
                    if (fieldInfo.repeat) {
                        statements.push(...this.scalarRepeated(source, fieldInfo, fieldPropertyAccess, fieldDeclarationComment));
                    } else if (fieldInfo.oneof !== undefined) {
                        statements.push(...this.scalarOneof(source, fieldInfo, fieldDeclarationComment));
                    } else {
                        statements.push(...this.scalar(source, fieldInfo, fieldPropertyAccess, fieldDeclarationComment));
                    }
                    break;

                case "message":
                    if (fieldInfo.repeat) {
                        statements.push(...this.messageRepeated(source, fieldInfo, fieldPropertyAccess, fieldDeclarationComment));
                    } else if (fieldInfo.oneof !== undefined) {
                        statements.push(...this.messageOneof(source, fieldInfo, fieldDeclarationComment));
                    } else {
                        statements.push(...this.message(source, fieldInfo, fieldPropertyAccess, fieldDeclarationComment));
                    }
                    break;

                case "map":
                    statements.push(...this.map(source, fieldInfo, fieldPropertyAccess, fieldDeclarationComment));
                    break;
            }
        }
        return statements;
    }


    private scalar(source: TypescriptFile, field: rt.FieldInfo & { kind: "scalar" | "enum"; oneof: undefined; repeat: undefined | rt.RepeatType.NO }, fieldPropertyAccess: ts.PropertyAccessExpression, fieldDeclarationComment: string): ts.Statement[] {
        let type: rt.ScalarType = field.kind == "enum" ? rt.ScalarType.INT32 : field.T;

        // we only write scalar fields if they have a non-default value
        // this is the condition:
        let shouldWriteCondition: ts.Expression;
        if (field.T === rt.ScalarType.BYTES && field.opt) {
            // message.bytes !== undefined
            shouldWriteCondition = ts.factory.createBinaryExpression(
                fieldPropertyAccess,
                ts.factory.createToken(ts.SyntaxKind.ExclamationEqualsEqualsToken),
                ts.factory.createIdentifier("undefined")
            );
        } else if (field.T === rt.ScalarType.BYTES && !field.opt) {
            // message.bytes.length
            shouldWriteCondition = ts.factory.createPropertyAccessExpression(
                fieldPropertyAccess,
                ts.factory.createIdentifier("length")
            );
        } else {
            // message.field !== <default value>
            // get a default value for the scalar field using the MessageType
            let defaultValue = new rt.MessageType<rt.UnknownMessage>("$synthetic.InternalBinaryWrite", [field]).create()[field.localName];
            let defaultValueExpression = typescriptLiteralFromValue(defaultValue);
            shouldWriteCondition = ts.factory.createBinaryExpression(
                fieldPropertyAccess,
                ts.factory.createToken(ts.SyntaxKind.ExclamationEqualsEqualsToken),
                defaultValueExpression
            );
        }

        // if ( <shouldWriteCondition> )
        let statement = ts.factory.createIfStatement(
            shouldWriteCondition,
            // writer.tag( <field no>, <wire type> ).string(message.stringField)
            ts.factory.createExpressionStatement(
                this.makeWriterCall(
                    this.makeWriterTagCall(source, 'writer', field.no, this.wireTypeForSingleScalar(type)),
                    type,
                    fieldPropertyAccess
                )
            ),
            undefined
        );

        ts.addSyntheticLeadingComment(
            statement, ts.SyntaxKind.MultiLineCommentTrivia, ' ' + fieldDeclarationComment + ' ', true
        );
        return [statement];
    }


    private scalarRepeated(source: TypescriptFile, field: rt.FieldInfo & { kind: "scalar" | "enum"; oneof: undefined; repeat: rt.RepeatType.PACKED | rt.RepeatType.UNPACKED }, fieldPropertyAccess: ts.PropertyAccessExpression, fieldDeclarationComment: string): ts.Statement[] {
        let statement;
        let type: rt.ScalarType = field.kind == "enum" ? rt.ScalarType.INT32 : field.T;

        if (field.repeat === rt.RepeatType.PACKED) {

            // if (message.int32Field.length) {
            statement = ts.factory.createIfStatement(
                ts.factory.createPropertyAccessExpression(fieldPropertyAccess, ts.factory.createIdentifier("length")),
                ts.factory.createBlock([
                    // writer.tag(3, WireType.LengthDelimited).fork();
                    ts.factory.createExpressionStatement(
                        this.makeWriterCall(
                            this.makeWriterTagCall(source, 'writer', field.no, rt.WireType.LengthDelimited),
                            'fork'
                        )
                    ),
                    // for (let i = 0; i < message.int32Field.length; i++)
                    ts.factory.createForStatement(
                        ts.factory.createVariableDeclarationList([ts.factory.createVariableDeclaration(ts.factory.createIdentifier("i"), undefined, undefined, ts.factory.createNumericLiteral("0"))], ts.NodeFlags.Let),
                        ts.factory.createBinaryExpression(
                            ts.factory.createIdentifier("i"),
                            ts.factory.createToken(ts.SyntaxKind.LessThanToken),
                            ts.factory.createPropertyAccessExpression(fieldPropertyAccess, ts.factory.createIdentifier("length"))
                        ),
                        ts.factory.createPostfixUnaryExpression(ts.factory.createIdentifier("i"), ts.SyntaxKind.PlusPlusToken),
                        // writer.int32(message.int32Field[i]);
                        ts.factory.createExpressionStatement(
                            this.makeWriterCall('writer', type, ts.factory.createNonNullExpression(ts.factory.createElementAccessExpression(fieldPropertyAccess, ts.factory.createIdentifier("i"))))
                        )
                    ),
                    // writer.join();
                    ts.factory.createExpressionStatement(
                        this.makeWriterCall('writer', 'join')
                    ),
                ], true),
                undefined
            );

        } else {
            // never packed

            // for (let i = 0; i < message.bytesField.length; i++)
            statement = ts.factory.createForStatement(
                ts.factory.createVariableDeclarationList([ts.factory.createVariableDeclaration(ts.factory.createIdentifier("i"), undefined, undefined, ts.factory.createNumericLiteral("0"))], ts.NodeFlags.Let),
                ts.factory.createBinaryExpression(
                    ts.factory.createIdentifier("i"),
                    ts.factory.createToken(ts.SyntaxKind.LessThanToken),
                    ts.factory.createPropertyAccessExpression(fieldPropertyAccess, ts.factory.createIdentifier("length"))
                ),
                ts.factory.createPostfixUnaryExpression(ts.factory.createIdentifier("i"), ts.SyntaxKind.PlusPlusToken),
                //   writer.tag( <field number>, <wire type> ).bytes( message.bytesField[i] )
                ts.factory.createExpressionStatement(
                    this.makeWriterCall(
                        this.makeWriterTagCall(source, "writer", field.no, this.wireTypeForSingleScalar(type)),
                        type,
                        ts.factory.createNonNullExpression(ts.factory.createElementAccessExpression(fieldPropertyAccess, ts.factory.createIdentifier("i")))
                    )
                )
            );
        }

        ts.addSyntheticLeadingComment(
            statement, ts.SyntaxKind.MultiLineCommentTrivia, ' ' + fieldDeclarationComment + ' ', true
        );
        return [statement];
    }


    private scalarOneof(source: TypescriptFile, field: rt.FieldInfo & { kind: "scalar" | "enum"; oneof: string; repeat: undefined | rt.RepeatType.NO }, fieldDeclarationComment: string): ts.Statement[] {
        let type = field.kind == "enum" ? rt.ScalarType.INT32 : field.T;

        let groupPropertyAccess = ts.factory.createPropertyAccessExpression(
            ts.factory.createIdentifier("message"),
            ts.factory.createIdentifier(field.oneof)
        );

        let statement = ts.factory.createIfStatement(
            // if (message.result.oneofKind === 'value')
            ts.factory.createBinaryExpression(
                ts.factory.createPropertyAccessExpression(
                    groupPropertyAccess,
                    ts.factory.createIdentifier(this.options.oneofKindDiscriminator)
                ),
                ts.factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
                ts.factory.createStringLiteral(field.localName)
            ),
            // writer.tag( <field no>, <wire type> ).string(message.stringField)
            ts.factory.createExpressionStatement(
                this.makeWriterCall(
                    this.makeWriterTagCall(source, 'writer', field.no, this.wireTypeForSingleScalar(type)),
                    type,
                    ts.factory.createPropertyAccessExpression(
                        groupPropertyAccess,
                        field.localName
                    )
                )
            ),
            undefined
        );
        ts.addSyntheticLeadingComment(
            statement, ts.SyntaxKind.MultiLineCommentTrivia, ' ' + fieldDeclarationComment + ' ', true
        );
        return [statement];
    }


    private message(source: TypescriptFile, field: rt.FieldInfo & { kind: "message"; repeat: undefined | rt.RepeatType.NO; oneof: undefined; }, fieldPropertyAccess: ts.PropertyAccessExpression, fieldDeclarationComment: string): ts.Statement[] {
        // writer.tag(<field no>, WireType.LengthDelimited).fork();
        let writeTagAndFork = this.makeWriterCall(
            this.makeWriterTagCall(source, 'writer', field.no, rt.WireType.LengthDelimited),
            'fork'
        );

        // MessageFieldMessage_TestMessage.internalBinaryWrite(message.messageField, <writeTagAndFork>, options);
        let binaryWrite = ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
                ts.factory.createIdentifier(this.imports.typeByName(source, field.T().typeName)),
                ts.factory.createIdentifier("internalBinaryWrite")
            ),
            undefined,
            [fieldPropertyAccess, writeTagAndFork, ts.factory.createIdentifier("options")],
        );

        // <...>.join()
        let binaryWriteAndJoin = this.makeWriterCall(binaryWrite, 'join');

        // if (message.messageField) {
        let statement = ts.factory.createIfStatement(
            fieldPropertyAccess,
            ts.factory.createExpressionStatement(binaryWriteAndJoin),
            undefined
        )

        ts.addSyntheticLeadingComment(
            statement, ts.SyntaxKind.MultiLineCommentTrivia, ' ' + fieldDeclarationComment + ' ', true
        );
        return [statement];
    }


    private messageRepeated(source: TypescriptFile, field: rt.FieldInfo & { kind: "message"; repeat: rt.RepeatType.PACKED | rt.RepeatType.UNPACKED; oneof: undefined; }, fieldPropertyAccess: ts.PropertyAccessExpression, fieldDeclarationComment: string): ts.Statement[] {
        // message.repeatedMessageField[i]
        let fieldPropI = ts.factory.createNonNullExpression(ts.factory.createElementAccessExpression(fieldPropertyAccess, ts.factory.createIdentifier("i")));

        // writer.tag(<field no>, WireType.LengthDelimited).fork();
        let writeTagAndFork = this.makeWriterCall(
            this.makeWriterTagCall(source, 'writer', field.no, rt.WireType.LengthDelimited),
            'fork'
        );

        // MessageFieldMessage_TestMessage.internalBinaryWrite(message.repeatedMessageField, <writeTagAndFork>, options);
        let binaryWrite = ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
                ts.factory.createIdentifier(this.imports.typeByName(source, field.T().typeName)),
                ts.factory.createIdentifier("internalBinaryWrite")
            ),
            undefined,
            [fieldPropI, writeTagAndFork, ts.factory.createIdentifier("options")],
        );

        // <...>.join()
        let binaryWriteAndJoin = this.makeWriterCall(binaryWrite, 'join');

        // for (let i = 0; i < message.repeatedMessageField.length; i++) {
        let statement = ts.factory.createForStatement(
            ts.factory.createVariableDeclarationList([ts.factory.createVariableDeclaration(ts.factory.createIdentifier("i"), undefined, undefined, ts.factory.createNumericLiteral("0"))], ts.NodeFlags.Let),
            ts.factory.createBinaryExpression(
                ts.factory.createIdentifier("i"),
                ts.factory.createToken(ts.SyntaxKind.LessThanToken),
                ts.factory.createPropertyAccessExpression(fieldPropertyAccess, ts.factory.createIdentifier("length"))
            ),
            ts.factory.createPostfixUnaryExpression(ts.factory.createIdentifier("i"), ts.SyntaxKind.PlusPlusToken),
            ts.factory.createExpressionStatement(binaryWriteAndJoin),
        );
        ts.addSyntheticLeadingComment(
            statement, ts.SyntaxKind.MultiLineCommentTrivia, ' ' + fieldDeclarationComment + ' ', true
        );
        return [statement];
    }


    private messageOneof(source: TypescriptFile, field: rt.FieldInfo & { kind: "message"; repeat: undefined | rt.RepeatType.NO; oneof: string; }, fieldDeclarationComment: string): ts.Statement[] {
        // message.<oneof name>
        let groupPropertyAccess = ts.factory.createPropertyAccessExpression(
            ts.factory.createIdentifier("message"),
            ts.factory.createIdentifier(field.oneof)
        );

        // writer.tag(<field no>, WireType.LengthDelimited).fork();
        let writeTagAndFork = this.makeWriterCall(
            this.makeWriterTagCall(source, 'writer', field.no, rt.WireType.LengthDelimited),
            'fork'
        );

        // MessageFieldMessage_TestMessage.internalBinaryWrite(message.<groupPropertyAccess>.<fieldLocalName>, <writeTagAndFork>, options);
        let binaryWrite = ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
                ts.factory.createIdentifier(this.imports.typeByName(source, field.T().typeName)),
                ts.factory.createIdentifier("internalBinaryWrite")
            ),
            undefined,
            [
                ts.factory.createPropertyAccessExpression(
                    groupPropertyAccess,
                    field.localName
                ),
                writeTagAndFork,
                ts.factory.createIdentifier("options")
            ],
        );

        // <...>.join()
        let binaryWriteAndJoin = this.makeWriterCall(binaryWrite, 'join');

        // if (message.objects.oneofKind === 'a') {
        let statement = ts.factory.createIfStatement(
            ts.factory.createBinaryExpression(
                ts.factory.createPropertyAccessExpression(
                    groupPropertyAccess,
                    ts.factory.createIdentifier(this.options.oneofKindDiscriminator)
                ),
                ts.factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
                ts.factory.createStringLiteral(field.localName)
            ),
            ts.factory.createExpressionStatement(binaryWriteAndJoin),
            undefined
        )

        ts.addSyntheticLeadingComment(
            statement, ts.SyntaxKind.MultiLineCommentTrivia, ' ' + fieldDeclarationComment + ' ', true
        );
        return [statement];
    }


    private map(source: TypescriptFile, field: rt.FieldInfo & { kind: "map" }, fieldPropertyAccess: ts.PropertyAccessExpression, fieldDeclarationComment: string): ts.Statement[] {

        // all javascript property keys are strings, need to do some conversion for wire format
        let mapEntryKeyRead: ts.Expression;
        let mapEntryValueRead: ts.Expression = ts.factory.createElementAccessExpression(fieldPropertyAccess, ts.factory.createIdentifier("k"));
        switch (field.K) {
            case rt.ScalarType.BOOL:
                // parse bool for writer
                mapEntryKeyRead = ts.factory.createBinaryExpression(ts.factory.createIdentifier("k"), ts.factory.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken), ts.factory.createStringLiteral("true"));
                break;
            case rt.ScalarType.INT32:
            case rt.ScalarType.SINT32:
            case rt.ScalarType.UINT32:
            case rt.ScalarType.FIXED32:
            case rt.ScalarType.SFIXED32:
                // parse int for writer
                mapEntryKeyRead = ts.factory.createCallExpression(ts.factory.createIdentifier("parseInt"), undefined, [ts.factory.createIdentifier("k")]);
                // convince compiler key works for index type
                // message.int32KeyedMap[k as any]
                //                      ^^^^^^^^^^
                mapEntryValueRead = ts.factory.createElementAccessExpression(
                    fieldPropertyAccess,
                    ts.factory.createAsExpression(ts.factory.createIdentifier("k"), ts.factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword))
                );
                break;
            default:
                // writer method accepts string for all other cases, no need to modify
                mapEntryKeyRead = ts.factory.createIdentifier("k");
                break;
        }


        // loop body for every map entry. looks different for messages.
        let forBody;
        if (field.V.kind == "message") {

            const descMessage = this.registry.getMessage(field.V.T().typeName);
            assert(descMessage);

            forBody = ts.factory.createBlock(
                [
                    // same as for scalar maps
                    ts.factory.createExpressionStatement(
                        this.makeWriterCall(
                            // this.makeWriterCall(
                            this.makeWriterTagCall(
                                source,
                                this.makeWriterCall(
                                    this.makeWriterTagCall(source, "writer", field.no, rt.WireType.LengthDelimited),
                                    // .fork // start length delimited for the MapEntry
                                    'fork'
                                ),
                                1, this.wireTypeForSingleScalar(field.K),
                            ),
                            // .string(message.strStrField[k]) // MapEntry key value
                            field.K,
                            mapEntryKeyRead
                        )
                    ),

                    //
                    ts.factory.createExpressionStatement(
                        this.makeWriterCall(
                            this.makeWriterTagCall(
                                source,
                                'writer',
                                2, rt.WireType.LengthDelimited
                            ),
                            // start length delimited for the message
                            'fork'
                        )
                    ),

                    // MessageMapMessage_MyItem.internalBinaryWrite(message.strMsgField[k], writer, options);
                    ts.factory.createExpressionStatement(ts.factory.createCallExpression(
                        ts.factory.createPropertyAccessExpression(
                            ts.factory.createIdentifier(this.imports.type(source, descMessage)),
                            ts.factory.createIdentifier("internalBinaryWrite")
                        ),
                        undefined,
                        [
                            mapEntryValueRead,
                            ts.factory.createIdentifier("writer"),
                            ts.factory.createIdentifier("options")
                        ]
                    )),

                    // end message and end map entry
                    ts.factory.createExpressionStatement(
                        this.makeWriterCall(
                            this.makeWriterCall('writer', 'join'),
                            'join'
                        )
                    ),

                ],
                true
            );

        } else {

            // handle enum as INT32
            let mapEntryValueScalarType: rt.ScalarType = field.V.kind == "enum" ? rt.ScalarType.INT32 : field.V.T;

            // *rolleyes*
            forBody = ts.factory.createExpressionStatement(
                this.makeWriterCall(
                    this.makeWriterCall(
                        this.makeWriterTagCall(
                            source,
                            this.makeWriterCall(
                                this.makeWriterTagCall(
                                    source,
                                    this.makeWriterCall(
                                        this.makeWriterTagCall(
                                            source,
                                            'writer',
                                            // tag for our field
                                            field.no, rt.WireType.LengthDelimited
                                        ),
                                        // .fork // start length delimited for the MapEntry
                                        'fork'
                                    ),
                                    // MapEntry key field tag
                                    1, this.wireTypeForSingleScalar(field.K)
                                ),
                                // .string(message.strStrField[k]) // MapEntry key value
                                field.K,
                                mapEntryKeyRead
                            ),
                            // MapEntry value field tag
                            2, this.wireTypeForSingleScalar(mapEntryValueScalarType)
                        ),
                        // .string(message.strStrField[k]) // MapEntry value value
                        mapEntryValueScalarType,
                        mapEntryValueRead
                    ),
                    'join'
                )
            );
        }

        // for (let k of Object.keys(message.strStrField))
        let statement = ts.factory.createForOfStatement(
            undefined,
            ts.factory.createVariableDeclarationList([ts.factory.createVariableDeclaration(ts.factory.createIdentifier("k"), undefined, undefined)], ts.NodeFlags.Let),
            ts.factory.createCallExpression(
                ts.factory.createPropertyAccessExpression(
                    ts.factory.createPropertyAccessExpression(
                        ts.factory.createIdentifier("globalThis"),
                        ts.factory.createIdentifier("Object")
                    ),
                    ts.factory.createIdentifier("keys")
                ),
                undefined,
                [fieldPropertyAccess]
            ),
            forBody
        )
        ts.addSyntheticLeadingComment(
            statement, ts.SyntaxKind.MultiLineCommentTrivia, ' ' + fieldDeclarationComment + ' ', true
        );
        return [statement];
    }


    private  makeWriterCall(writerExpressionOrName: string | ts.Expression, type: rt.ScalarType | 'fork' | 'join', argument?: ts.Expression): ts.Expression {
        let methodName = typeof type == "string" ? type : ScalarType[type].toLowerCase();
        let writerExpression = typeof writerExpressionOrName == "string" ? ts.factory.createIdentifier(writerExpressionOrName) : writerExpressionOrName;
        let methodProp = ts.factory.createPropertyAccessExpression(writerExpression, ts.factory.createIdentifier(methodName));
        return ts.factory.createCallExpression(methodProp, undefined, argument ? [argument] : undefined);
    }


    private  makeWriterTagCall(source: TypescriptFile, writerExpressionOrName: string | ts.Expression, fieldNo: number, wireType: rt.WireType): ts.Expression {
        let writerExpression = typeof writerExpressionOrName == "string" ? ts.factory.createIdentifier(writerExpressionOrName) : writerExpressionOrName;
        let methodProp = ts.factory.createPropertyAccessExpression(writerExpression, ts.factory.createIdentifier("tag"));
        let wireTypeName: string;
        switch (wireType) {
            case rt.WireType.LengthDelimited:
                wireTypeName = "LengthDelimited";
                break;
            case rt.WireType.Bit64:
                wireTypeName = "Bit64";
                break;
            case rt.WireType.Bit32:
                wireTypeName = "Bit32";
                break;
            case rt.WireType.Varint:
                wireTypeName = "Varint";
                break;
            case rt.WireType.EndGroup:
                wireTypeName = "EndGroup";
                break;
            case rt.WireType.StartGroup:
                wireTypeName = "StartGroup";
                break;
        }
        let wireTypeAccess = ts.factory.createPropertyAccessExpression(
            ts.factory.createIdentifier(this.imports.name(source, 'WireType', this.options.runtimeImportPath)),
            wireTypeName
        );
        return ts.factory.createCallExpression(methodProp, undefined, [
            ts.factory.createNumericLiteral(fieldNo.toString()),
            wireTypeAccess
        ]);
    }


    private wireTypeForSingleScalar(scalarType: rt.ScalarType): rt.WireType {
        let wireType;
        switch (scalarType) {
            case rt.ScalarType.BOOL:
            case rt.ScalarType.INT32:
            case rt.ScalarType.UINT32:
            case rt.ScalarType.SINT32:
            case rt.ScalarType.INT64:
            case rt.ScalarType.UINT64:
            case rt.ScalarType.SINT64:
                wireType = rt.WireType.Varint;
                break;

            case rt.ScalarType.BYTES:
            case rt.ScalarType.STRING:
                wireType = rt.WireType.LengthDelimited;
                break;

            case rt.ScalarType.DOUBLE:
            case rt.ScalarType.FIXED64:
            case rt.ScalarType.SFIXED64:
                wireType = rt.WireType.Bit64;
                break;

            case rt.ScalarType.FLOAT:
            case rt.ScalarType.FIXED32:
            case rt.ScalarType.SFIXED32:
                wireType = rt.WireType.Bit32;
                break;
        }
        return wireType;
    }


}

