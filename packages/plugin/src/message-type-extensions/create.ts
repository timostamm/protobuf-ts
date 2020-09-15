import {
    DescriptorProto,
    DescriptorRegistry,
    FileOptions_OptimizeMode,
    TypescriptImportManager,
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
        private readonly imports: TypescriptImportManager,
        private readonly interpreter: Interpreter,
        private readonly options: { optimizeFor: FileOptions_OptimizeMode; normalLongType: LongType; oneofKindDiscriminator: string; runtimeImportPath: string },
    ) {
    }


    // create(value?: PartialMessage<ScalarValuesMessage>): ScalarValuesMessage {
    make(descriptor: DescriptorProto): ts.MethodDeclaration[] {
        if (this.options.optimizeFor === FileOptions_OptimizeMode.CODE_SIZE) return [];

        // create(value?: PartialMessage<ScalarValuesMessage>): ScalarValuesMessage {
        let internalBinaryRead = this.makeMethod(
            descriptor,

            // const message = { boolField: false, ... };
            this.makeMessageVariable(descriptor),

            // if (value !== undefined)
            //     reflectionMergePartial<ScalarValuesMessage>(message, value, this);
            this.makeMergeIf(descriptor),

            // return message;
            ts.createReturn(ts.createIdentifier("message"))
        )
        return [internalBinaryRead];
    }


    makeMethod(descriptor: DescriptorProto, ...bodyStatements: readonly ts.Statement[]): ts.MethodDeclaration {
        const
            MessageInterface = this.imports.type(descriptor),
            PartialMessage = this.imports.name('PartialMessage', this.options.runtimeImportPath)
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


    makeMessageVariable(descriptor: DescriptorProto) {
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


    makeMergeIf(descriptor: DescriptorProto) {
        const MessageInterface = this.imports.type(descriptor);
        return ts.createIf(
            ts.createBinary(
                ts.createIdentifier("value"),
                ts.createToken(ts.SyntaxKind.ExclamationEqualsEqualsToken),
                ts.createIdentifier("undefined")
            ),
            ts.createExpressionStatement(ts.createCall(
                ts.createIdentifier(this.imports.name('reflectionMergePartial', this.options.runtimeImportPath)),
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
