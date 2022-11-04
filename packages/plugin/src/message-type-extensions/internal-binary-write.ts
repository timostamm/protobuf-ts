import * as ts from "typescript";
import {
  DescriptorProto,
  DescriptorRegistry,
  ScalarValueType,
  StringFormat,
  TypescriptFile,
  TypeScriptImports,
  typescriptLiteralFromValue,
  createEnumPropertyAccessExp,
  getTypeNameFromFullName
} from "@chippercash/protobuf-plugin-framework";
import * as rt from "@chippercash/protobuf-runtime";
import { CustomMethodGenerator } from "../code-gen/message-type-generator";
import { Interpreter } from "../interpreter";
import { assert } from "@chippercash/protobuf-runtime";


/**
 * Generates the `internalBinaryWrite` method, which writes a message
 * in binary format.
 *
 * Heads up: The generated code is only very marginally faster than
 * the reflection-based one. The gain is less than 3%.
 *
 */
export class InternalBinaryWrite implements CustomMethodGenerator {


  constructor (
    private readonly registry: DescriptorRegistry,
    private readonly imports: TypeScriptImports,
    private readonly interpreter: Interpreter,
    private readonly options: { oneofKindDiscriminator: string; runtimeImportPath: string },
  ) {
  }


  make (source: TypescriptFile, descriptor: DescriptorProto): ts.MethodDeclaration[] {
    // internalBinaryWrite(message: ScalarValuesMessage, writer: IBinaryWriter, options: BinaryWriteOptions): void {
    let internalBinaryWrite = this.makeMethod(
      source,
      descriptor,
      [
        ...this.makeStatementsForEveryField(source, descriptor),
        ...this.makeUnknownFieldsHandler(source),
        // return writer;
        ts.createReturn(ts.createIdentifier("writer"))
      ],
    )
    return [internalBinaryWrite];
  }


  makeMethod (source: TypescriptFile, descriptor: DescriptorProto, bodyStatements: readonly ts.Statement[]): ts.MethodDeclaration {
    const
      MessageInterface = this.imports.type(source, descriptor),
      IBinaryWriter = this.imports.name(source, 'IBinaryWriter', this.options.runtimeImportPath, true),
      BinaryWriteOptions = this.imports.name(source, 'BinaryWriteOptions', this.options.runtimeImportPath, true);
    return ts.createMethod(undefined, undefined, undefined, ts.createIdentifier("internalBinaryWrite"), undefined, undefined,
      [
        ts.createParameter(undefined, undefined, undefined, ts.createIdentifier("message"), undefined, ts.createTypeReferenceNode(MessageInterface, undefined), undefined),
        ts.createParameter(undefined, undefined, undefined, ts.createIdentifier("writer"), undefined, ts.createTypeReferenceNode(IBinaryWriter, undefined), undefined),
        ts.createParameter(undefined, undefined, undefined, ts.createIdentifier("options"), undefined, ts.createTypeReferenceNode(BinaryWriteOptions, undefined), undefined),
      ],
      ts.createTypeReferenceNode(IBinaryWriter, undefined),
      ts.createBlock(bodyStatements, true)
    );
  }


  makeUnknownFieldsHandler (source: TypescriptFile,): ts.Statement[] {
    let UnknownFieldHandler = this.imports.name(source, 'UnknownFieldHandler', this.options.runtimeImportPath);
    return [
      ts.createVariableStatement(
        undefined,
        ts.createVariableDeclarationList(
          [ts.createVariableDeclaration(
            ts.createIdentifier("u"),
            undefined,
            ts.createPropertyAccess(
              ts.createIdentifier("options"),
              ts.createIdentifier("writeUnknownFields")
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
              ts.createToken(ts.SyntaxKind.EqualsEqualsToken),
              ts.createTrue()
            ),
            ts.createPropertyAccess(
              ts.createIdentifier(UnknownFieldHandler),
              ts.createIdentifier("onWrite")
            ),
            ts.createIdentifier("u")
          )),
          undefined,
          [
            ts.createPropertyAccess(
              ts.createThis(),
              ts.createIdentifier("typeName")
            ),
            ts.createIdentifier("message"),
            ts.createIdentifier("writer")
          ]
        )),
        undefined
      )
    ];
  }


  makeStatementsForEveryField (source: TypescriptFile, descriptor: DescriptorProto): ts.Statement[] {
    const
      interpreterType = this.interpreter.getMessageType(descriptor),
      statements: ts.Statement[] = [];

    for (let fieldInfo of interpreterType.fields) {

      let fieldDescriptor = descriptor.field.find(fd => fd.number === fieldInfo.no);
      assert(fieldDescriptor !== undefined);
      let fieldDeclarationComment = this.registry.formatFieldDeclaration(fieldDescriptor);

      let fieldPropertyAccess = ts.createPropertyAccess(ts.createIdentifier("message"), fieldInfo.localName);
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


  scalar (source: TypescriptFile, field: rt.FieldInfo & { kind: "scalar" | "enum"; oneof: undefined; repeat: undefined | rt.RepeatType.NO }, fieldPropertyAccess: ts.PropertyAccessExpression, fieldDeclarationComment: string): ts.Statement[] {
    let type: rt.ScalarType = field.kind == "enum" ? rt.ScalarType.INT32 : field.T;

    // we only write scalar fields if they have a non-default value
    // this is the condition:
    let shouldWriteCondition: ts.Expression;
    if (field.T === rt.ScalarType.BYTES && field.opt) {
      // message.bytes !== undefined
      shouldWriteCondition = ts.createBinary(
        fieldPropertyAccess,
        ts.createToken(ts.SyntaxKind.ExclamationEqualsEqualsToken),
        ts.createIdentifier("undefined")
      );
    } else if (field.T === rt.ScalarType.BYTES && !field.opt) {
      // message.bytes.length
      shouldWriteCondition = ts.createPropertyAccess(
        fieldPropertyAccess,
        ts.createIdentifier("length")
      );
    } else {
      // message.field !== <default value>
      // get a default value for the scalar field using the MessageType
      let defaultValue = new rt.MessageType<rt.UnknownMessage>("$synthetic.InternalBinaryWrite", [field]).create()[field.localName];
      let defaultValueExpression = typescriptLiteralFromValue(defaultValue);
      if (field.kind == 'enum' && defaultValue != undefined) {
        assert(typeof defaultValue == 'string')
        const enumDescriptor = this.registry.resolveTypeName(field.T()[0])
        const type = this.imports.type(source, enumDescriptor)
        defaultValueExpression = createEnumPropertyAccessExp(defaultValue, type)
      }
      shouldWriteCondition = ts.createBinary(
        fieldPropertyAccess,
        ts.createToken(ts.SyntaxKind.ExclamationEqualsEqualsToken),
        defaultValueExpression
      );
    }


    // e.g. writer.tag(1, WireType.Varint).int32((SimpleEnum_TagAndValueMap[SimpleEnum[message.enumField]] as number))
    //                                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    let enumWriteExp
    if (field.kind == "enum") {
      const enumDescriptor = this.registry.resolveTypeName(field.T()[0])
      const enumName = this.imports.type(source, enumDescriptor)
      const enumMap = this.imports.type(source, enumDescriptor, 'object')
      enumWriteExp = this.createEnumValueWriteExpression(enumName, enumMap, fieldPropertyAccess)
    }

    // if ( <shouldWriteCondition> )
    let statement = ts.createIf(
      shouldWriteCondition,
      // writer.tag( <field no>, <wire type> ).string(message.stringField)
      ts.createExpressionStatement(
        this.makeWriterCall(
          this.makeWriterTagCall(source, 'writer', field.no, this.wireTypeForSingleScalar(type)),
          type,
          field.kind == 'enum' ? enumWriteExp : fieldPropertyAccess
        )
      ),
      undefined
    );

    ts.addSyntheticLeadingComment(
      statement, ts.SyntaxKind.MultiLineCommentTrivia, ' ' + fieldDeclarationComment + ' ', true
    );
    return [statement];
  }


  scalarRepeated (source: TypescriptFile, field: rt.FieldInfo & { kind: "scalar" | "enum"; oneof: undefined; repeat: rt.RepeatType.PACKED | rt.RepeatType.UNPACKED }, fieldPropertyAccess: ts.PropertyAccessExpression, fieldDeclarationComment: string): ts.Statement[] {
    let statement;
    let type: rt.ScalarType = field.kind == "enum" ? rt.ScalarType.INT32 : field.T;
    let enumName: string = ''
    let enumMap: string = ''
    if (field.kind == "enum") {
      const enumDescriptor = this.registry.resolveTypeName(field.T()[0])
      enumName = this.imports.type(source, enumDescriptor)
      enumMap = this.imports.type(source, enumDescriptor, 'object')
    }

    if (field.repeat === rt.RepeatType.PACKED) {

      // if (message.int32Field.length) {
      statement = ts.createIf(
        ts.createPropertyAccess(fieldPropertyAccess, ts.createIdentifier("length")),
        ts.createBlock([
          // writer.tag(3, WireType.LengthDelimited).fork();
          ts.createExpressionStatement(
            this.makeWriterCall(
              this.makeWriterTagCall(source, 'writer', field.no, rt.WireType.LengthDelimited),
              'fork'
            )
          ),
          // for (let i = 0; i < message.int32Field.length; i++)
          ts.createFor(
            ts.createVariableDeclarationList([ts.createVariableDeclaration(ts.createIdentifier("i"), undefined, ts.createNumericLiteral("0"))], ts.NodeFlags.Let),
            ts.createBinary(
              ts.createIdentifier("i"),
              ts.createToken(ts.SyntaxKind.LessThanToken),
              ts.createPropertyAccess(fieldPropertyAccess, ts.createIdentifier("length"))
            ),
            ts.createPostfix(ts.createIdentifier("i"), ts.SyntaxKind.PlusPlusToken),
            // `writer.int32(message.int32Field[i]);`
            // Or `writer.int32((EnumType_TagAndValueMap[EnumType[message.enumField[i]]] as number));` for enums.
            ts.createExpressionStatement(
              this.makeWriterCall(
                'writer', type,
                field.kind == "enum" ?
                  this.createEnumValueWriteExpression(
                    enumName, enumMap,
                    ts.createElementAccess(fieldPropertyAccess, ts.createIdentifier("i")
                    )
                  ) :
                  ts.createElementAccess(fieldPropertyAccess, ts.createIdentifier("i"))
              )
            )
          ),
          // writer.join();
          ts.createExpressionStatement(
            this.makeWriterCall('writer', 'join')
          ),
        ], true),
        undefined
      );

    } else {
      // never packed

      // for (let i = 0; i < message.bytesField.length; i++)
      statement = ts.createFor(
        ts.createVariableDeclarationList([ts.createVariableDeclaration(ts.createIdentifier("i"), undefined, ts.createNumericLiteral("0"))], ts.NodeFlags.Let),
        ts.createBinary(
          ts.createIdentifier("i"),
          ts.createToken(ts.SyntaxKind.LessThanToken),
          ts.createPropertyAccess(fieldPropertyAccess, ts.createIdentifier("length"))
        ),
        ts.createPostfix(ts.createIdentifier("i"), ts.SyntaxKind.PlusPlusToken),
        //   writer.tag( <field number>, <wire type> ).bytes( message.bytesField[i] )
        ts.createExpressionStatement(
          this.makeWriterCall(
            this.makeWriterTagCall(source, "writer", field.no, this.wireTypeForSingleScalar(type)),
            type,
            ts.createElementAccess(fieldPropertyAccess, ts.createIdentifier("i"))
          )
        )
      );
    }

    ts.addSyntheticLeadingComment(
      statement, ts.SyntaxKind.MultiLineCommentTrivia, ' ' + fieldDeclarationComment + ' ', true
    );
    return [statement];
  }


  scalarOneof (source: TypescriptFile, field: rt.FieldInfo & { kind: "scalar" | "enum"; oneof: string; repeat: undefined | rt.RepeatType.NO }, fieldDeclarationComment: string): ts.Statement[] {
    let type = field.kind == "enum" ? rt.ScalarType.INT32 : field.T;
    let groupPropertyAccess = ts.createPropertyAccess(
      ts.createIdentifier("message"),
      ts.createIdentifier(field.oneof)
    );
    let enumWriteExp
    if (field.kind == "enum") {
      const enumDescriptor = this.registry.resolveTypeName(field.T()[0])
      const enumName = this.imports.type(source, enumDescriptor)
      const enumMap = this.imports.type(source, enumDescriptor, 'object')
      const fieldPropertyAccess = ts.createPropertyAccess(
        groupPropertyAccess,
        field.localName
      )
      enumWriteExp = this.createEnumValueWriteExpression(enumName, enumMap, fieldPropertyAccess)
    }
    this.imports.name(source, 'UndefinedOneOf', this.options.runtimeImportPath, true);
    let statement = ts.createIf(
      // if (message.result instanceof UndefinedOneOf)
      //   console.log('Undefined oneofKind handled')
      // else if (message.result.oneofKind === 'value')
      ts.createBinary(
        groupPropertyAccess,
        ts.createToken(ts.SyntaxKind.InstanceOfKeyword),
        ts.createIdentifier("UndefinedOneOf")
      ),
      ts.createExpressionStatement(ts.createCall(
        ts.createPropertyAccess(
          ts.createIdentifier("console"),
          ts.createIdentifier("log")
        ),
        undefined,
        [ts.createStringLiteral("Undefined oneofKind handled.")]
      )),
      ts.createIf(
        ts.createBinary(
          ts.createPropertyAccess(
            groupPropertyAccess,
            ts.createIdentifier(this.options.oneofKindDiscriminator)
          ),
          ts.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
          ts.createStringLiteral(field.localName)
        ),
        // writer.tag( <field no>, <wire type> ).string(message.stringField)
        ts.createExpressionStatement(
          this.makeWriterCall(
            this.makeWriterTagCall(source, 'writer', field.no, this.wireTypeForSingleScalar(type)),
            type,
            field.kind == "enum" ?
              enumWriteExp :
              ts.createPropertyAccess(
                groupPropertyAccess,
                field.localName
              )
          )
        ),
        undefined
      )
    );
    ts.addSyntheticLeadingComment(
      statement, ts.SyntaxKind.MultiLineCommentTrivia, ' ' + fieldDeclarationComment + ' ', true
    );
    return [statement];
  }


  message (source: TypescriptFile, field: rt.FieldInfo & { kind: "message"; repeat: undefined | rt.RepeatType.NO; oneof: undefined; }, fieldPropertyAccess: ts.PropertyAccessExpression, fieldDeclarationComment: string): ts.Statement[] {

    let messageDescriptor = this.registry.resolveTypeName(field.T().typeName);
    assert(DescriptorProto.is(messageDescriptor));

    // writer.tag(<field no>, WireType.LengthDelimited).fork();
    let writeTagAndFork = this.makeWriterCall(
      this.makeWriterTagCall(source, 'writer', field.no, rt.WireType.LengthDelimited),
      'fork'
    );

    const isTimeStampField = field.T().typeName === "google.protobuf.Timestamp"
    const timestampFieldAccess = ts.createCall(
      ts.createPropertyAccess(
        ts.createIdentifier("Timestamp"),
        ts.createIdentifier("fromDate")
      ),
      undefined,
      [fieldPropertyAccess]
    )

    // MessageFieldMessage_TestMessage.internalBinaryWrite(message.messageField, <writeTagAndFork>, options);
    let binaryWrite = ts.createCall(
      ts.createPropertyAccess(
        ts.createIdentifier(this.imports.type(source, messageDescriptor)),
        ts.createIdentifier("internalBinaryWrite")
      ),
      undefined,
      [isTimeStampField ? timestampFieldAccess : fieldPropertyAccess, writeTagAndFork, ts.createIdentifier("options")],
    );

    // <...>.join()
    let binaryWriteAndJoin = this.makeWriterCall(binaryWrite, 'join');

    // if (message.messageField) {
    let statement = ts.createIf(
      fieldPropertyAccess,
      ts.createExpressionStatement(binaryWriteAndJoin),
      undefined
    )

    ts.addSyntheticLeadingComment(
      statement, ts.SyntaxKind.MultiLineCommentTrivia, ' ' + fieldDeclarationComment + ' ', true
    );
    return [statement];
  }


  messageRepeated (source: TypescriptFile, field: rt.FieldInfo & { kind: "message"; repeat: rt.RepeatType.PACKED | rt.RepeatType.UNPACKED; oneof: undefined; }, fieldPropertyAccess: ts.PropertyAccessExpression, fieldDeclarationComment: string): ts.Statement[] {

    let messageDescriptor = this.registry.resolveTypeName(field.T().typeName);
    assert(DescriptorProto.is(messageDescriptor));

    // message.repeatedMessageField[i]
    let fieldPropI = ts.createElementAccess(fieldPropertyAccess, ts.createIdentifier("i"));

    // writer.tag(<field no>, WireType.LengthDelimited).fork();
    let writeTagAndFork = this.makeWriterCall(
      this.makeWriterTagCall(source, 'writer', field.no, rt.WireType.LengthDelimited),
      'fork'
    );

    // MessageFieldMessage_TestMessage.internalBinaryWrite(message.repeatedMessageField, <writeTagAndFork>, options);
    let binaryWrite = ts.createCall(
      ts.createPropertyAccess(
        ts.createIdentifier(this.imports.type(source, messageDescriptor)),
        ts.createIdentifier("internalBinaryWrite")
      ),
      undefined,
      [fieldPropI, writeTagAndFork, ts.createIdentifier("options")],
    );

    // <...>.join()
    let binaryWriteAndJoin = this.makeWriterCall(binaryWrite, 'join');

    // for (let i = 0; i < message.repeatedMessageField.length; i++) {
    let statement = ts.createFor(
      ts.createVariableDeclarationList([ts.createVariableDeclaration(ts.createIdentifier("i"), undefined, ts.createNumericLiteral("0"))], ts.NodeFlags.Let),
      ts.createBinary(
        ts.createIdentifier("i"),
        ts.createToken(ts.SyntaxKind.LessThanToken),
        ts.createPropertyAccess(fieldPropertyAccess, ts.createIdentifier("length"))
      ),
      ts.createPostfix(ts.createIdentifier("i"), ts.SyntaxKind.PlusPlusToken),
      ts.createExpressionStatement(binaryWriteAndJoin),
    );
    ts.addSyntheticLeadingComment(
      statement, ts.SyntaxKind.MultiLineCommentTrivia, ' ' + fieldDeclarationComment + ' ', true
    );
    return [statement];
  }


  messageOneof (source: TypescriptFile, field: rt.FieldInfo & { kind: "message"; repeat: undefined | rt.RepeatType.NO; oneof: string; }, fieldDeclarationComment: string): ts.Statement[] {

    let messageDescriptor = this.registry.resolveTypeName(field.T().typeName);
    assert(DescriptorProto.is(messageDescriptor));

    // message.<oneof name>
    let groupPropertyAccess = ts.createPropertyAccess(
      ts.createIdentifier("message"),
      ts.createIdentifier(field.oneof)
    );

    // writer.tag(<field no>, WireType.LengthDelimited).fork();
    let writeTagAndFork = this.makeWriterCall(
      this.makeWriterTagCall(source, 'writer', field.no, rt.WireType.LengthDelimited),
      'fork'
    );

    // MessageFieldMessage_TestMessage.internalBinaryWrite(message.<groupPropertyAccess>.<fieldLocalName>, <writeTagAndFork>, options);
    let binaryWrite = ts.createCall(
      ts.createPropertyAccess(
        ts.createIdentifier(this.imports.type(source, messageDescriptor)),
        ts.createIdentifier("internalBinaryWrite")
      ),
      undefined,
      [
        ts.createPropertyAccess(
          groupPropertyAccess,
          field.localName
        ),
        writeTagAndFork,
        ts.createIdentifier("options")
      ],
    );

    // <...>.join()
    let binaryWriteAndJoin = this.makeWriterCall(binaryWrite, 'join');

    this.imports.name(source, 'UndefinedOneOf', this.options.runtimeImportPath, true);
    let statement = ts.createIf(
      // if (message.objects instanceof UndefinedOneOf)
      //   console.log('Undefined oneofKind handled')
      // else if (message.objects.oneofKind === 'a') {
      ts.createBinary(
        groupPropertyAccess,
        ts.createToken(ts.SyntaxKind.InstanceOfKeyword),
        ts.createIdentifier("UndefinedOneOf")
      ),
      ts.createExpressionStatement(ts.createCall(
        ts.createPropertyAccess(
          ts.createIdentifier("console"),
          ts.createIdentifier("log")
        ),
        undefined,
        [ts.createStringLiteral("Undefined oneofKind handled.")]
      )),
      ts.createIf(
        ts.createBinary(
          ts.createPropertyAccess(
            groupPropertyAccess,
            ts.createIdentifier(this.options.oneofKindDiscriminator)
          ),
          ts.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken),
          ts.createStringLiteral(field.localName)
        ),
        ts.createExpressionStatement(binaryWriteAndJoin),
        undefined
      )
    );

    ts.addSyntheticLeadingComment(
      statement, ts.SyntaxKind.MultiLineCommentTrivia, ' ' + fieldDeclarationComment + ' ', true
    );
    return [statement];
  }


  map (source: TypescriptFile, field: rt.FieldInfo & { kind: "map" }, fieldPropertyAccess: ts.PropertyAccessExpression, fieldDeclarationComment: string): ts.Statement[] {

    // all javascript property keys are strings, need to do some conversion for wire format
    let mapEntryKeyRead: ts.Expression;
    let mapEntryValueRead: ts.Expression = ts.createElementAccess(fieldPropertyAccess, ts.createIdentifier("k"));
    switch (field.K) {
      case rt.ScalarType.BOOL:
        // parse bool for writer
        mapEntryKeyRead = ts.createBinary(ts.createIdentifier("k"), ts.createToken(ts.SyntaxKind.EqualsEqualsEqualsToken), ts.createStringLiteral("true"));
        break;
      case rt.ScalarType.INT32:
      case rt.ScalarType.SINT32:
      case rt.ScalarType.UINT32:
      case rt.ScalarType.FIXED32:
      case rt.ScalarType.SFIXED32:
        // parse int for writer
        mapEntryKeyRead = ts.createCall(ts.createIdentifier("parseInt"), undefined, [ts.createIdentifier("k")]);
        // convince compiler key works for index type
        // message.int32KeyedMap[k as any]
        //                      ^^^^^^^^^^
        mapEntryValueRead = ts.createElementAccess(
          fieldPropertyAccess,
          ts.createAsExpression(ts.createIdentifier("k"), ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword))
        );
        break;
      default:
        // writer method accepts string for all other cases, no need to modify
        mapEntryKeyRead = ts.createIdentifier("k");
        break;
    }


    // loop body for every map entry. looks different for messages.
    let forBody;
    if (field.V.kind == "message") {

      let messageDescriptor = this.registry.resolveTypeName(field.V.T().typeName);
      assert(DescriptorProto.is(messageDescriptor));

      forBody = ts.createBlock(
        [
          // same as for scalar maps
          ts.createExpressionStatement(
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
          ts.createExpressionStatement(
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
          ts.createExpressionStatement(ts.createCall(
            ts.createPropertyAccess(
              ts.createIdentifier(this.imports.type(source, messageDescriptor)),
              ts.createIdentifier("internalBinaryWrite")
            ),
            undefined,
            [
              mapEntryValueRead,
              ts.createIdentifier("writer"),
              ts.createIdentifier("options")
            ]
          )),

          // end message and end map entry
          ts.createExpressionStatement(
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

      let enumWriteExp
      if (field.V.kind == "enum") {
        const enumDescriptor = this.registry.resolveTypeName(field.V.T()[0])
        const enumName = this.imports.type(source, enumDescriptor)
        const enumMap = this.imports.type(source, enumDescriptor, 'object')
        enumWriteExp = this.createEnumValueWriteExpression(enumName, enumMap, mapEntryValueRead)
      }
      // writer.tag(1, WireType.Varint).int32((SimpleEnum_TagAndValueMap[SimpleEnum[message.enumField]] as number));

      // *rolleyes*
      forBody = ts.createExpressionStatement(
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
            field.V.kind == "enum" ? enumWriteExp : mapEntryValueRead
          ),
          'join'
        )
      );
    }

    // for (let k of Object.keys(message.strStrField))
    let statement = ts.createForOf(
      undefined,
      ts.createVariableDeclarationList([ts.createVariableDeclaration(ts.createIdentifier("k"), undefined, undefined)], ts.NodeFlags.Let),
      ts.createCall(
        ts.createPropertyAccess(ts.createIdentifier("Object"), ts.createIdentifier("keys")),
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


  protected makeWriterCall (writerExpressionOrName: string | ts.Expression, type: rt.ScalarType | 'fork' | 'join', argument?: ts.Expression): ts.Expression {
    let methodName = typeof type == "string" ? type : StringFormat.formatScalarType(type as number as ScalarValueType);
    let writerExpression = typeof writerExpressionOrName == "string" ? ts.createIdentifier(writerExpressionOrName) : writerExpressionOrName;
    let methodProp = ts.createPropertyAccess(writerExpression, ts.createIdentifier(methodName));
    return ts.createCall(methodProp, undefined, argument ? [argument] : undefined);
  }


  protected makeWriterTagCall (source: TypescriptFile, writerExpressionOrName: string | ts.Expression, fieldNo: number, wireType: rt.WireType): ts.Expression {
    let writerExpression = typeof writerExpressionOrName == "string" ? ts.createIdentifier(writerExpressionOrName) : writerExpressionOrName;
    let methodProp = ts.createPropertyAccess(writerExpression, ts.createIdentifier("tag"));
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
    let wireTypeAccess = ts.createPropertyAccess(
      ts.createIdentifier(this.imports.name(source, 'WireType', this.options.runtimeImportPath)),
      wireTypeName
    );
    return ts.createCall(methodProp, undefined, [
      ts.createNumericLiteral(fieldNo.toString()),
      wireTypeAccess
    ]);
  }


  protected wireTypeForSingleScalar (scalarType: rt.ScalarType): rt.WireType {
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

  protected createEnumValueWriteExpression (enumName: string, enumMapName: string, fieldPropertyAccess: ts.Expression) {
    const enumSubElementAccess = ts.createElementAccess(
      ts.createIdentifier(enumName),
      fieldPropertyAccess
    )
    const enumMapElementAccess = ts.createElementAccess(ts.createIdentifier(enumMapName), enumSubElementAccess)
    return ts.createAsExpression(enumMapElementAccess, ts.createTypeReferenceNode('number', undefined))
  }
}
