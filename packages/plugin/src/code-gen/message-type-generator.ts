import * as ts from "typescript";
import {LongType} from "@protobuf-ts/runtime";
import {TypescriptFile} from "@protobuf-ts/plugin-framework";
import {CommentGenerator} from "./comment-generator";
import {WellKnownTypes} from "../message-type-extensions/well-known-types";
import {GoogleTypes} from "../message-type-extensions/google-types";
import {Create} from "../message-type-extensions/create";
import {InternalBinaryRead} from "../message-type-extensions/internal-binary-read";
import {InternalBinaryWrite} from "../message-type-extensions/internal-binary-write";
import {FieldInfoGenerator} from "./field-info-generator";
import {Interpreter} from "../interpreter";
import {DescMessage, FileRegistry} from "@bufbuild/protobuf";
import {FileOptions_OptimizeMode} from "@bufbuild/protobuf/wkt";
import {TypeScriptImports} from "../framework/typescript-imports";
import {addCommentBlockAsJsDoc} from "../framework/typescript-comments";
import {typescriptLiteralFromValue} from "../framework/typescript-literal-from-value";


export interface CustomMethodGenerator {
    make(source: TypescriptFile, descMessage: DescMessage): ts.MethodDeclaration[];
}


export class MessageTypeGenerator {


    private readonly wellKnown: WellKnownTypes;
    private readonly googleTypes: GoogleTypes;
    private readonly typeMethodCreate: Create;
    private readonly typeMethodInternalBinaryRead: InternalBinaryRead;
    private readonly typeMethodInternalBinaryWrite: InternalBinaryWrite;
    private readonly fieldInfoGenerator: FieldInfoGenerator;


    constructor(
        private readonly registry: FileRegistry,
        private readonly imports: TypeScriptImports,
        private readonly comments: CommentGenerator,
        private readonly interpreter: Interpreter,
        private readonly options: {
            runtimeImportPath: string;
            normalLongType: LongType;
            oneofKindDiscriminator: string;
            useProtoFieldName: boolean;
        },
    ) {
        this.fieldInfoGenerator = new FieldInfoGenerator(this.registry, this.imports);
        this.wellKnown = new WellKnownTypes(this.imports, this.options);
        this.googleTypes = new GoogleTypes(this.imports, this.options);
        this.typeMethodCreate = new Create(this.imports, this.interpreter, this.options);
        this.typeMethodInternalBinaryRead = new InternalBinaryRead(this.registry, this.imports, this.interpreter, this.options);
        this.typeMethodInternalBinaryWrite = new InternalBinaryWrite(this.registry, this.imports, this.interpreter, this.options);
    }


    /**
     * Declare a handler for the message. The handler provides
     * functions to read / write messages of the specific type.
     *
     * For the following .proto:
     *
     *   package test;
     *   message MyMessage {
     *     string str_field = 1;
     *   }
     *
     * We generate the following variable declaration:
     *
     *   import { H } from "R";
     *   const MyMessage: H<MyMessage> =
     *     new H<MyMessage>(
     *       ".test.MyMessage",
     *       [{ no: 0, name: "str_field", kind: "scalar", T: 9 }]
     *     );
     *
     * H is the concrete class imported from runtime R.
     * Some field information is passed to the handler's
     * constructor.
     */
    generateMessageType(source: TypescriptFile, descMessage: DescMessage, optimizeFor: FileOptions_OptimizeMode): void {
        const
            // identifier for the message
            MyMessage = this.imports.type(source, descMessage),
            Message$Type = ts.createIdentifier(this.imports.type(source, descMessage) + '$Type'),
            MessageType = ts.createIdentifier(this.imports.name(source, "MessageType", this.options.runtimeImportPath)),
            interpreterType = this.interpreter.getMessageType(descMessage),
            classDecMembers: ts.ClassElement[] = [],
            classDecSuperArgs: ts.Expression[] = [ // arguments to the MessageType CTOR
                // arg 0: type name
                ts.createStringLiteral(descMessage.typeName),
                // arg 1: field infos
                this.fieldInfoGenerator.createFieldInfoLiterals(source, interpreterType.fields)
            ];

        // if present, add message options in json format to MessageType CTOR args
        if (Object.keys(interpreterType.options).length) {
            classDecSuperArgs.push(
                typescriptLiteralFromValue(interpreterType.options)
            );
        }

        // "MyMessage$Type" constructor() { super(...) }
        classDecMembers.push(
            ts.createConstructor(
                undefined, undefined, [],
                ts.createBlock([ts.createExpressionStatement(
                    ts.createCall(ts.createSuper(), undefined, classDecSuperArgs)
                )], true)
            )
        );

        // "MyMessage$Type" members for supported standard types
        classDecMembers.push(...this.wellKnown.make(source, descMessage));
        classDecMembers.push(...this.googleTypes.make(source, descMessage));

        // "MyMessage$Type" members for optimized binary format
        if (optimizeFor === FileOptions_OptimizeMode.SPEED) {
            classDecMembers.push(
                ...this.typeMethodCreate.make(source, descMessage),
                ...this.typeMethodInternalBinaryRead.make(source, descMessage),
                ...this.typeMethodInternalBinaryWrite.make(source, descMessage),
            );
        }

        // class "MyMessage$Type" extends "MessageType"<"MyMessage"> {
        const classDec = ts.createClassDeclaration(
            undefined, undefined, Message$Type, undefined,
            [ts.createHeritageClause(
                ts.SyntaxKind.ExtendsKeyword,
                [ts.createExpressionWithTypeArguments([ts.createTypeReferenceNode(MyMessage, undefined)], MessageType)]
            )],
            classDecMembers
        );


        // export const "messageId" = new "MessageTypeId"();
        const exportConst = ts.createVariableStatement(
            [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
            ts.createVariableDeclarationList(
                [ts.createVariableDeclaration(
                    MyMessage, undefined,
                    ts.createNew(Message$Type, undefined, [])
                )],
                ts.NodeFlags.Const
            )
        );


        // add to our file
        source.addStatement(classDec);
        source.addStatement(exportConst);


        // add comments
        ts.addSyntheticLeadingComment(classDec, ts.SyntaxKind.SingleLineCommentTrivia,
            " @generated message type with reflection information, may provide speed optimized methods",
            false);
        let comment = this.comments.makeDeprecatedTag(descMessage);
        comment += this.comments.makeGeneratedTag(descMessage).replace("@generated from ", "@generated MessageType for ");
        addCommentBlockAsJsDoc(exportConst, comment);

        return;
    }



}
