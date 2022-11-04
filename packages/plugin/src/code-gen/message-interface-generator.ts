import * as ts from "typescript";
import * as rt from "@chippercash/protobuf-runtime";
import { assert } from "@chippercash/protobuf-runtime";
import {
  DescriptorProto,
  DescriptorRegistry,
  EnumDescriptorProto,
  FieldDescriptorProto,
  OneofDescriptorProto,
  SymbolTable,
  TypescriptFile,
  TypeScriptImports
} from "@chippercash/protobuf-plugin-framework";
import { CommentGenerator } from "./comment-generator";
import { Interpreter } from "../interpreter";
import { GeneratorBase } from "./generator-base";
import { createLocalTypeName } from "./local-type-name";


export class MessageInterfaceGenerator extends GeneratorBase {


  constructor (symbols: SymbolTable, registry: DescriptorRegistry, imports: TypeScriptImports, comments: CommentGenerator, interpreter: Interpreter,
    private readonly options: {
      oneofKindDiscriminator: string;
      normalLongType: rt.LongType;
      runtimeImportPath: string;
    }) {
    super(symbols, registry, imports, comments, interpreter);
  }


  registerSymbols (source: TypescriptFile, descriptor: DescriptorProto): void {
    const name = createLocalTypeName(descriptor, this.registry);
    this.symbols.register(name, descriptor, source);
  }


  /**
   * `message` as an interface.
   *
   * For the following .proto:
   *
   *   message MyMessage {
   *     string str_field = 1;
   *   }
   *
   * We generate the following interface:
   *
   *   interface MyMessage {
   *     strField: string;
   *   }
   *
   */
  generateMessageInterface (source: TypescriptFile, descriptor: DescriptorProto): ts.InterfaceDeclaration {
    const
      interpreterType = this.interpreter.getMessageType(descriptor),
      processedOneofs: string[] = [], // oneof groups already processed
      members: ts.TypeElement[] = []; // the interface members

    for (let fieldInfo of interpreterType.fields) {
      let fieldDescriptor = descriptor.field.find(fd => fd.number === fieldInfo.no);
      assert(fieldDescriptor !== undefined);

      if (fieldInfo.oneof) {
        if (processedOneofs.includes(fieldInfo.oneof)) {
          continue;
        }
        // create single property for entire oneof group
        assert(fieldDescriptor.oneofIndex !== undefined);
        let oneofDescriptor = descriptor.oneofDecl[fieldDescriptor.oneofIndex];
        assert(oneofDescriptor !== undefined);
        members.push(this.createOneofADTPropertySignature(source, oneofDescriptor));
        processedOneofs.push(fieldInfo.oneof);
      } else {
        // create regular properties
        members.push(this.createFieldPropertySignature(source, fieldDescriptor, fieldInfo));
      }
    }

    // export interface MyMessage { ...
    const statement = ts.createInterfaceDeclaration(
      undefined,
      [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
      this.imports.type(source, descriptor),
      undefined,
      undefined,
      members
    );

    // add to our file
    source.addStatement(statement);
    this.comments.addCommentsForDescriptor(statement, descriptor, 'appendToLeadingBlock');
    return statement;
  }


  /**
   * Create property signature for a protobuf field. Example:
   *
   *    fieldName: number
   *
   */
  protected createFieldPropertySignature (source: TypescriptFile, fieldDescriptor: FieldDescriptorProto, fieldInfo: rt.FieldInfo): ts.PropertySignature {
    let type: ts.TypeNode; // the property type, may be made optional or wrapped into array at the end

    switch (fieldInfo.kind) {
      case "scalar":
        type = this.createScalarTypeNode(fieldInfo.T, fieldInfo.L);
        break;

      case "enum":
        type = this.createEnumTypeNode(source, fieldInfo.T());
        break;

      case "message":
        type = this.createMessageTypeNode(source, fieldInfo.T());
        break;

      case "map":
        let keyType = fieldInfo.K === rt.ScalarType.BOOL
          ? ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
          : this.createScalarTypeNode(fieldInfo.K, rt.LongType.STRING);
        let valueType;
        switch (fieldInfo.V.kind) {
          case "scalar":
            valueType = this.createScalarTypeNode(fieldInfo.V.T, fieldInfo.V.L);
            break;
          case "enum":
            valueType = this.createEnumTypeNode(source, fieldInfo.V.T());
            break;
          case "message":
            valueType = this.createMessageTypeNode(source, fieldInfo.V.T());
            break;
        }
        type = ts.createTypeLiteralNode([
          ts.createIndexSignature(
            undefined,
            undefined,
            [
              ts.createParameter(
                undefined,
                undefined,
                undefined,
                ts.createIdentifier('key'),
                undefined,
                keyType,
                undefined
              )
            ],
            valueType
          )
        ]);
        break;
      default:
        throw new Error("unkown kind " + fieldDescriptor.name);
    }

    // if repeated, wrap type into array type
    if (fieldInfo.repeat) {
      type = ts.createArrayTypeNode(type);
    }

    // if optional, add question mark
    let questionToken = fieldInfo.opt ? ts.createToken(ts.SyntaxKind.QuestionToken) : undefined;

    // create property
    const property = ts.createPropertySignature(
      undefined,
      ts.createIdentifier(fieldInfo.localName),
      questionToken,
      type,
      undefined
    );
    this.comments.addCommentsForDescriptor(property, fieldDescriptor, 'trailingLines');
    return property;
  }

  /**
   * `oneof` as an algebraic data type.
   *
   * For the following .proto:
   *
   *   oneof result {
   *     int32 value = 1;
   *     string error = 2;
   *   }
   *
   * We generate the following property signature:
   *
   *   result: { oneofKind: "value"; value: number; }
   *         | { oneofKind: "error"; error: string; }
   *         | UndefinedOneOf; // old: { oneofKind: undefined; };
   */
  protected createOneofADTPropertySignature (source: TypescriptFile, oneofDescriptor: OneofDescriptorProto): ts.PropertySignature {
    const
      oneofCases: ts.TypeNode[] = [],
      [messageDescriptor, interpreterType, oneofLocalName] = this.oneofInfo(oneofDescriptor),
      memberFieldInfos = interpreterType.fields.filter(fi => fi.oneof === oneofLocalName);

    assert(oneofDescriptor !== undefined);

    // create a type for each selection case
    for (let fieldInfo of memberFieldInfos) {

      // { oneofKind: 'fieldName' ... } part
      const kindProperty = ts.createPropertySignature(
        undefined,
        ts.createIdentifier(this.options.oneofKindDiscriminator),
        undefined,
        ts.createLiteralTypeNode(ts.createStringLiteral(fieldInfo.localName)),
        undefined
      );

      // { ..., fieldName: type } part
      let fieldDescriptor = messageDescriptor.field.find(fd => fd.number === fieldInfo.no);
      assert(fieldDescriptor !== undefined);
      let valueProperty = this.createFieldPropertySignature(source, fieldDescriptor, fieldInfo);

      // add this case
      oneofCases.push(
        ts.createTypeLiteralNode([kindProperty, valueProperty])
      );

    }

    this.imports.name(source, 'UndefinedOneOf', this.options.runtimeImportPath, false);
    // case for no selection: UndefinedOneOf // old: { oneofKind: undefined; }
    oneofCases.push(
      ts.createTypeReferenceNode(
        ts.createIdentifier("UndefinedOneOf"),
        undefined
      )
    );

    // final property signature for the oneof group, with a union type for all oneof cases
    const property = ts.createPropertySignature(
      undefined,
      ts.createIdentifier(oneofLocalName),
      undefined,
      ts.createUnionTypeNode(oneofCases),
      undefined
    );

    // add comments
    this.comments.addCommentsForDescriptor(property, oneofDescriptor, 'appendToLeadingBlock');
    return property;
  }


  /**
   * Helper to find for a OneofDescriptorProto:
   * [0] the message descriptor
   * [1] a corresponding message type generated by the interpreter
   * [2] the runtime local name of the oneof
   */
  private oneofInfo (oneofDescriptor: OneofDescriptorProto): [DescriptorProto, rt.IMessageType<rt.UnknownMessage>, string] {
    const messageDescriptor = this.registry.parentOf(oneofDescriptor);
    assert(DescriptorProto.is(messageDescriptor));
    const interpreterType = this.interpreter.getMessageType(messageDescriptor);
    const oneofIndex = messageDescriptor.oneofDecl.indexOf(oneofDescriptor);
    assert(oneofIndex !== undefined);
    const sampleFieldDescriptor = messageDescriptor.field.find(fd => fd.oneofIndex === oneofIndex);
    assert(sampleFieldDescriptor !== undefined);
    const sampleFieldInfo = interpreterType.fields.find(fi => fi.no === sampleFieldDescriptor.number);
    assert(sampleFieldInfo !== undefined);
    const oneofName = sampleFieldInfo.oneof;
    assert(oneofName !== undefined);
    return [messageDescriptor, interpreterType, oneofName];
  }


  private createScalarTypeNode (scalarType: rt.ScalarType, longType?: rt.LongType): ts.TypeNode {
    switch (scalarType) {
      case rt.ScalarType.BOOL:
        return ts.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
      case rt.ScalarType.STRING:
        return ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
      case rt.ScalarType.BYTES:
        return ts.createTypeReferenceNode('Uint8Array', undefined);
      case rt.ScalarType.DOUBLE:
      case rt.ScalarType.FLOAT:
      case rt.ScalarType.INT32:
      case rt.ScalarType.FIXED32:
      case rt.ScalarType.UINT32:
      case rt.ScalarType.SFIXED32:
      case rt.ScalarType.SINT32:
        return ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
      case rt.ScalarType.SFIXED64:
      case rt.ScalarType.INT64:
      case rt.ScalarType.UINT64:
      case rt.ScalarType.FIXED64:
      case rt.ScalarType.SINT64:
        switch (longType ?? rt.LongType.STRING) {
          case rt.LongType.STRING:
            return ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
          case rt.LongType.NUMBER:
            return ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
          case rt.LongType.BIGINT:
            return ts.createKeywordTypeNode(ts.SyntaxKind.BigIntKeyword);
        }
    }
  }

  private createMessageTypeNode (source: TypescriptFile, type: rt.IMessageType<rt.UnknownMessage>): ts.TypeNode {
    // Replace Timestamp with typescript Date.
    if (type.typeName === 'google.protobuf.Timestamp') {
      return ts.createTypeReferenceNode("Date", undefined);
    }
    let messageDescriptor = this.registry.resolveTypeName(type.typeName);
    assert(DescriptorProto.is(messageDescriptor));
    return ts.createTypeReferenceNode(this.imports.type(source, messageDescriptor), undefined);
  }


  private createEnumTypeNode (source: TypescriptFile, ei: rt.EnumInfo): ts.TypeNode {
    let [enumTypeName] = ei;
    let enumDescriptor = this.registry.resolveTypeName(enumTypeName);
    assert(EnumDescriptorProto.is(enumDescriptor));
    return ts.createTypeReferenceNode(this.imports.type(source, enumDescriptor), undefined);
  }


}
