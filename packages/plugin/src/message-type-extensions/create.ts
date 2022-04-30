import {
  DescriptorProto,
  DescriptorRegistry,
  FileOptions_OptimizeMode,
  TypescriptFile,
  TypeScriptImports,
  typescriptLiteralFromValueAndDescriptor
} from "@protobuf-ts/plugin-framework";
import * as ts from "typescript";
import { LongType } from "@protobuf-ts/runtime";
import { Interpreter } from "../interpreter";
import { CustomMethodGenerator } from "../code-gen/message-type-generator";


/**
 * Generates a "create()" method for an `IMessageType`
 */
export class Create implements CustomMethodGenerator {


  constructor (
    private readonly registry: DescriptorRegistry,
    private readonly imports: TypeScriptImports,
    private readonly interpreter: Interpreter,
    private readonly options: { normalLongType: LongType; oneofKindDiscriminator: string; runtimeImportPath: string },
  ) {
  }


  // create(value?: PartialMessage<ScalarValuesMessage>): ScalarValuesMessage {
  make (source: TypescriptFile, descriptor: DescriptorProto): ts.MethodDeclaration[] {
    // create(value?: PartialMessage<ScalarValuesMessage>): ScalarValuesMessage {
    let methodDeclaration = this.makeMethod(
      source,
      descriptor,

      // const message = { boolField: false, ... };
      this.makeMessageVariable(source, descriptor),

      // Object.defineProperty(message, MESSAGE_TYPE, {enumerable: false, value: this});
      this.makeDefineMessageTypeSymbolProperty(source),

      // if (value !== undefined)
      //     reflectionMergePartial<ScalarValuesMessage>(message, value, this);
      this.makeMergeIf(source, descriptor),

      // return message;
      ts.createReturn(ts.createIdentifier("message"))
    )
    return [methodDeclaration];
  }


  makeMethod (source: TypescriptFile, descriptor: DescriptorProto, ...bodyStatements: readonly ts.Statement[]): ts.MethodDeclaration {
    const
      MessageInterface = this.imports.type(source, descriptor),
      PartialMessage = this.imports.name(source, 'PartialMessage', this.options.runtimeImportPath, true)
      ;
    return ts.createMethod(undefined, undefined, undefined, ts.createIdentifier("create"), undefined, undefined,
      [
        ts.createParameter(
          undefined, undefined, undefined, ts.createIdentifier("value"),
          ts.createToken(ts.SyntaxKind.QuestionToken),
          ts.createTypeReferenceNode(PartialMessage, [
            ts.createTypeReferenceNode((MessageInterface), undefined)]
          ),
          undefined
        )
      ],
      ts.createTypeReferenceNode(MessageInterface, undefined),
      ts.createBlock(bodyStatements, true)
    );
  }


  makeMessageVariable (source: TypescriptFile, descriptor: DescriptorProto) {
    let messageType = this.interpreter.getMessageType(descriptor);
    let defaultMessage = messageType.create();

    return ts.createVariableStatement(
      undefined,
      ts.createVariableDeclarationList(
        [ts.createVariableDeclaration(
          ts.createIdentifier("message"),
          undefined,
          typescriptLiteralFromValueAndDescriptor(defaultMessage, descriptor)
        )],
        ts.NodeFlags.Const
      )
    );
  }


  makeDefineMessageTypeSymbolProperty (source: TypescriptFile) {
    const MESSAGE_TYPE = this.imports.name(source, 'MESSAGE_TYPE', this.options.runtimeImportPath);

    return ts.createExpressionStatement(ts.createCall(
      ts.createPropertyAccess(
        ts.createPropertyAccess(
          ts.createIdentifier("globalThis"),
          ts.createIdentifier("Object")
        ),
        ts.createIdentifier("defineProperty")
      ),
      undefined,
      [
        ts.createIdentifier("message"),
        ts.createIdentifier(MESSAGE_TYPE),
        ts.createObjectLiteral(
          [
            ts.createPropertyAssignment(
              ts.createIdentifier("enumerable"),
              ts.createFalse()
            ),
            ts.createPropertyAssignment(
              ts.createIdentifier("value"),
              ts.createThis()
            )
          ],
          false
        )
      ]
    ));
  }


  makeMergeIf (source: TypescriptFile, descriptor: DescriptorProto) {
    const MessageInterface = this.imports.type(source, descriptor);
    return ts.createIf(
      ts.createBinary(
        ts.createIdentifier("value"),
        ts.createToken(ts.SyntaxKind.ExclamationEqualsEqualsToken),
        ts.createIdentifier("undefined")
      ),
      ts.createExpressionStatement(ts.createCall(
        ts.createIdentifier(this.imports.name(source, 'reflectionMergePartial', this.options.runtimeImportPath)),
        [ts.createTypeReferenceNode(
          MessageInterface,
          undefined
        )],
        [
          ts.createThis(),
          ts.createIdentifier("message"),
          ts.createIdentifier("value"),
        ]
      )),
      undefined
    );
  }


}
