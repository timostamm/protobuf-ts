import {TypescriptFile} from "../framework/typescript-file";
import * as ts from "typescript";
import {LongType} from "@protobuf-ts/runtime";
import {CustomMethodGenerator} from "../code-gen/message-type-generator";
import {Interpreter} from "../interpreter";
import {DescMessage} from "@bufbuild/protobuf";
import {TypeScriptImports} from "../framework/typescript-imports";
import {typescriptLiteralFromValue} from "../framework/typescript-literal-from-value";


/**
 * Generates a "create()" method for an `IMessageType`
 */
export class Create implements CustomMethodGenerator {


    constructor(
        private readonly imports: TypeScriptImports,
        private readonly interpreter: Interpreter,
        private readonly options: { normalLongType: LongType; oneofKindDiscriminator: string; runtimeImportPath: string },
    ) {
    }


    // create(value?: PartialMessage<ScalarValuesMessage>): ScalarValuesMessage {
    make(source: TypescriptFile, descMessage: DescMessage): ts.MethodDeclaration[] {
        // create(value?: PartialMessage<ScalarValuesMessage>): ScalarValuesMessage {
        let methodDeclaration = this.makeMethod(
            source,
            descMessage,

            // const message = globalThis.Object.create(this.messagePrototype);
            this.makeMessageVariable(),

            // message.boolField = false;
            // message.repeatedField = [];
            // message.mapField = {};
            // ...
            ...this.makeMessagePropertyAssignments(source, descMessage),

            // if (value !== undefined)
            //     reflectionMergePartial<ScalarValuesMessage>(message, value, this);
            this.makeMergeIf(source, descMessage),

            // return message;
            ts.factory.createReturnStatement(ts.factory.createIdentifier("message"))
        )
        return [methodDeclaration];
    }


    private makeMethod(source: TypescriptFile, descMessage: DescMessage, ...bodyStatements: readonly ts.Statement[]): ts.MethodDeclaration {
        const
            MessageInterface = this.imports.type(source, descMessage),
            PartialMessage = this.imports.name(source,'PartialMessage', this.options.runtimeImportPath, true)
        ;
        return ts.factory.createMethodDeclaration(undefined, undefined, ts.factory.createIdentifier("create"), undefined, undefined,
            [
                ts.factory.createParameterDeclaration(
                    undefined, undefined, ts.factory.createIdentifier("value"),
                    ts.factory.createToken(ts.SyntaxKind.QuestionToken),
                    ts.factory.createTypeReferenceNode(PartialMessage, [
                        ts.factory.createTypeReferenceNode((MessageInterface), undefined)]
                    ),
                    undefined
                )
            ],
            ts.factory.createTypeReferenceNode(MessageInterface, undefined),
            ts.factory.createBlock(bodyStatements, true)
        );
    }


    private makeMessageVariable() {
        return ts.factory.createVariableStatement(
            undefined,
            ts.factory.createVariableDeclarationList(
                [ts.factory.createVariableDeclaration(
                    ts.factory.createIdentifier("message"),
                    undefined,
                    undefined,
                    ts.factory.createCallExpression(
                        ts.factory.createPropertyAccessExpression(
                            ts.factory.createPropertyAccessExpression(
                                ts.factory.createIdentifier("globalThis"),
                                ts.factory.createIdentifier("Object")
                            ),
                            ts.factory.createIdentifier("create")
                        ),
                        undefined,
                        [
                            ts.factory.createNonNullExpression(
                                ts.factory.createPropertyAccessExpression(
                                    ts.factory.createThis(),
                                    ts.factory.createIdentifier("messagePrototype")
                                )
                            )
                        ]
                    )
                )],
                ts.NodeFlags.Const
            )
        );
    }


    private makeMessagePropertyAssignments(source: TypescriptFile, descMessage: DescMessage) {
        let messageType = this.interpreter.getMessageType(descMessage);
        let defaultMessage = messageType.create();
        return Object.entries(defaultMessage).map(([key, value]): ts.ExpressionStatement => (
            ts.factory.createExpressionStatement(
                ts.factory.createBinaryExpression(
                    ts.factory.createPropertyAccessExpression(
                        ts.factory.createIdentifier("message"),
                        ts.factory.createIdentifier(key)
                    ),
                    ts.factory.createToken(ts.SyntaxKind.EqualsToken),
                    typescriptLiteralFromValue(value)
                )
            )
        ));
    }


    private makeMergeIf(source: TypescriptFile, descMessage: DescMessage) {
        const MessageInterface = this.imports.type(source, descMessage);
        return ts.factory.createIfStatement(
            ts.factory.createBinaryExpression(
                ts.factory.createIdentifier("value"),
                ts.factory.createToken(ts.SyntaxKind.ExclamationEqualsEqualsToken),
                ts.factory.createIdentifier("undefined")
            ),
            ts.factory.createExpressionStatement(ts.factory.createCallExpression(
                ts.factory.createIdentifier(this.imports.name(source, 'reflectionMergePartial', this.options.runtimeImportPath)),
                [ts.factory.createTypeReferenceNode(
                    MessageInterface,
                    undefined
                )],
                [
                    ts.factory.createThis(),
                    ts.factory.createIdentifier("message"),
                    ts.factory.createIdentifier("value"),
                ]
            )),
            undefined
        );
    }


}
