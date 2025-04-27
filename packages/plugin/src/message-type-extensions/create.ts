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
            ts.createReturn(ts.createIdentifier("message"))
        )
        return [methodDeclaration];
    }


    makeMethod(source: TypescriptFile, descMessage: DescMessage, ...bodyStatements: readonly ts.Statement[]): ts.MethodDeclaration {
        const
            MessageInterface = this.imports.type(source, descMessage),
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


    makeMessageVariable() {
        return ts.createVariableStatement(
            undefined,
            ts.createVariableDeclarationList(
                [ts.createVariableDeclaration(
                    ts.createIdentifier("message"),
                    undefined,
                    ts.createCall(
                        ts.createPropertyAccess(
                            ts.createPropertyAccess(
                                ts.createIdentifier("globalThis"),
                                ts.createIdentifier("Object")
                            ),
                            ts.createIdentifier("create")
                        ),
                        undefined,
                        [
                            ts.createNonNullExpression(
                                ts.createPropertyAccess(
                                    ts.createThis(),
                                    ts.createIdentifier("messagePrototype")
                                )
                            )
                        ]
                    )
                )],
                ts.NodeFlags.Const
            )
        );
    }


    makeMessagePropertyAssignments(source: TypescriptFile, descMessage: DescMessage) {
        let messageType = this.interpreter.getMessageType(descMessage);
        let defaultMessage = messageType.create();
        return Object.entries(defaultMessage).map(([key, value]): ts.ExpressionStatement => (
            ts.createExpressionStatement(
                ts.createBinary(
                    ts.createPropertyAccess(
                        ts.createIdentifier("message"),
                        ts.createIdentifier(key)
                    ),
                    ts.createToken(ts.SyntaxKind.EqualsToken),
                    typescriptLiteralFromValue(value)
                )
            )
        ));
    }


    makeMergeIf(source: TypescriptFile, descMessage: DescMessage) {
        const MessageInterface = this.imports.type(source, descMessage);
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
