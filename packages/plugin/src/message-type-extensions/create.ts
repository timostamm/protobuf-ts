import {
    DescriptorProto,
    DescriptorRegistry,
    FileOptions_OptimizeMode,
    TypescriptFile,
    TypeScriptImports,
    typescriptLiteralFromValue
} from "@protobuf-ts/plugin-framework";
import * as ts from "typescript";
import {LongType} from "@protobuf-ts/runtime";
import {Interpreter} from "../interpreter";
import {CustomMethodGenerator} from "../code-gen/message-type-generator";


/**
 * Generates a "create()" method for an `IMessageType`
 */
export class Create implements CustomMethodGenerator {


    constructor(
        private readonly registry: DescriptorRegistry,
        private readonly imports: TypeScriptImports,
        private readonly interpreter: Interpreter,
        private readonly options: { normalLongType: LongType; oneofKindDiscriminator: string; runtimeImportPath: string },
    ) {
    }


    // create(value?: PartialMessage<ScalarValuesMessage>): ScalarValuesMessage {
    make(source: TypescriptFile, descriptor: DescriptorProto): ts.MethodDeclaration[] {
        // create(value?: PartialMessage<ScalarValuesMessage>): ScalarValuesMessage {
        let methodDeclaration = this.makeMethod(
            source,
            descriptor,

            // const message = { boolField: false, ... };
            this.makeMessageVariable(source, descriptor),

            // (message as unknown as MessageTypeContainer<ScalarValuesMessage>)[MESSAGE_TYPE] = this;
            this.makeTypeAssignment(source, descriptor),

            // if (value !== undefined)
            //     reflectionMergePartial<ScalarValuesMessage>(message, value, this);
            this.makeMergeIf(source, descriptor),

            // return message;
            ts.createReturn(ts.createIdentifier("message"))
        )
        return [methodDeclaration];
    }


    makeMethod(source: TypescriptFile, descriptor: DescriptorProto, ...bodyStatements: readonly ts.Statement[]): ts.MethodDeclaration {
        const
            MessageInterface = this.imports.type(source, descriptor),
            PartialMessage = this.imports.name(source,'PartialMessage', this.options.runtimeImportPath, true)
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


    makeMessageVariable(source: TypescriptFile, descriptor: DescriptorProto) {
        let messageType = this.interpreter.getMessageType(descriptor);
        let defaultMessage = messageType.create();
        return ts.createVariableStatement(
            undefined,
            ts.createVariableDeclarationList(
                [ts.createVariableDeclaration(
                    ts.createIdentifier("message"),
                    undefined,
                    typescriptLiteralFromValue(defaultMessage)
                )],
                ts.NodeFlags.Const
            )
        );
    }


    makeTypeAssignment(source: TypescriptFile, descriptor: DescriptorProto) {
        const
            MessageTypeContainer = this.imports.name(source, 'MessageTypeContainer', this.options.runtimeImportPath, true),
            MESSAGE_TYPE = this.imports.name(source, 'MESSAGE_TYPE', this.options.runtimeImportPath),
            MessageInterface = this.imports.type(source, descriptor);
        ;

        return ts.createExpressionStatement(
            ts.createAssignment(
                ts.createElementAccess(
                    ts.createAsExpression(
                        ts.createAsExpression(
                            ts.createIdentifier("message"),
                            ts.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
                        ),
                        ts.createTypeReferenceNode(MessageTypeContainer, [
                            ts.createTypeReferenceNode(MessageInterface, undefined),
                        ]),
                    ),
                    ts.createIdentifier(MESSAGE_TYPE)
                ),
                ts.createThis(),
            ),
        );
    }


    makeMergeIf(source: TypescriptFile, descriptor: DescriptorProto) {
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
