import * as ts from "typescript";
import {LongType} from "@protobuf-ts/runtime";
import {
    addCommentBlockAsJsDoc,
    AnyTypeDescriptorProto,
    DescriptorProto,
    DescriptorRegistry,
    FileOptions_OptimizeMode,
    TypescriptImportManager,
    TypescriptFile
} from "@protobuf-ts/plugin-framework";
import {CommentGenerator} from "./comment-generator";
import {WellKnownTypes} from "../message-type-extensions/well-known-types";
import {GoogleTypes} from "../message-type-extensions/google-types";
import {Create} from "../message-type-extensions/create";
import {InternalBinaryRead} from "../message-type-extensions/internal-binary-read";
import {InternalBinaryWrite} from "../message-type-extensions/internal-binary-write";
import {Interpreter} from "../interpreter";
import {FieldInfoGenerator} from "./field-info-generator";


export interface CustomMethodGenerator {
    make(descriptor: DescriptorProto): ts.MethodDeclaration[];
}


export class MessageTypeGenerator {


    private readonly wellKnown: WellKnownTypes;
    private readonly googleTypes: GoogleTypes;
    private readonly typeMethodCreate: Create;
    private readonly typeMethodInternalBinaryRead: InternalBinaryRead;
    private readonly typeMethodInternalBinaryWrite: InternalBinaryWrite;
    private readonly fieldInfoGenerator: FieldInfoGenerator;


    constructor(
        private readonly registry: DescriptorRegistry,
        private readonly imports: TypescriptImportManager,
        private readonly interpreter: Interpreter,
        private readonly commentGenerator: CommentGenerator,
        private readonly options: {
            runtimeImportPath: string;
            normalLongType: LongType;
            optimizeFor: FileOptions_OptimizeMode,
            oneofKindDiscriminator: string;
        }
    ) {
        this.fieldInfoGenerator = new FieldInfoGenerator(this.registry, this.imports, this.options);
        this.wellKnown = new WellKnownTypes(this.imports, this.options, this.registry);
        this.googleTypes = new GoogleTypes(this.imports, this.options, this.registry);
        this.typeMethodCreate = new Create(this.options, this.imports, this.registry, this.interpreter);
        this.typeMethodInternalBinaryRead = new InternalBinaryRead(this.imports, this.registry, this.interpreter, this.options);
        this.typeMethodInternalBinaryWrite = new InternalBinaryWrite(this.imports, this.registry, this.interpreter, this.options);
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
    generateMessageType(descriptor: DescriptorProto, source: TypescriptFile): void {
        const
            // identifier for the message
            MyMessage = this.imports.type(descriptor),
            Message$Type = ts.createIdentifier(this.imports.type(descriptor) + '$Type'),
            // import handler from runtime
            MessageType = ts.createIdentifier(this.imports.name("MessageType", this.options.runtimeImportPath)),
            // create field information for runtime
            interpreterType = this.interpreter.getMessageType(descriptor),
            fieldInfo = this.fieldInfoGenerator.createFieldInfoLiterals(interpreterType.fields);

        // class "MyMessage$Type" extends "MessageType"<"MyMessage"> {
        const classDec = ts.createClassDeclaration(
            undefined, undefined, Message$Type, undefined,
            [ts.createHeritageClause(
                ts.SyntaxKind.ExtendsKeyword,
                [ts.createExpressionWithTypeArguments([ts.createTypeReferenceNode(MyMessage, undefined)], MessageType)]
            )],
            [
                ts.createConstructor(
                    undefined, undefined, [],
                    ts.createBlock([ts.createExpressionStatement(
                        ts.createCall(ts.createSuper(), undefined, [
                            ts.createStringLiteral(this.registry.makeTypeName(descriptor)),
                            fieldInfo
                        ])
                    )], true)
                ),
                ...this.wellKnown.make(descriptor),
                ...this.googleTypes.make(descriptor),
                ...this.typeMethodCreate.make(descriptor),
                ...this.typeMethodInternalBinaryRead.make(descriptor),
                ...this.typeMethodInternalBinaryWrite.make(descriptor),
            ]
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

        this.addCommentsForHandler(classDec, descriptor);

        return;
    }


    /**
     * Four our handler declaration, we also add a comment
     * with the protobuf identifier and a `@deprecated` tag
     * if necessary.
     */
    protected addCommentsForHandler(node: ts.Node, descriptor: AnyTypeDescriptorProto): void {
        let comment = `Type for protobuf ${this.registry.formatQualifiedName(descriptor)}`;
        if (this.registry.isExplicitlyDeclaredDeprecated(descriptor) || this.registry.isExplicitlyDeclaredDeprecated(this.registry.fileOf(descriptor))) {
            comment += '\n@deprecated';
        }
        addCommentBlockAsJsDoc(node, comment);
    }


}
