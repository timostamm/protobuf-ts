import * as ts from "typescript";
import {LongType} from "@protobuf-ts/runtime";
import {
    addCommentBlockAsJsDoc,
    DescriptorProto,
    DescriptorRegistry,
    FileOptions_OptimizeMode as OptimizeMode,
    SymbolTable,
    TypescriptFile,
    TypeScriptImports, typescriptLiteralFromValue
} from "@protobuf-ts/plugin-framework";
import {CommentGenerator} from "./comment-generator";
import {WellKnownTypes} from "../message-type-extensions/well-known-types";
import {GoogleTypes} from "../message-type-extensions/google-types";
import {Create} from "../message-type-extensions/create";
import {InternalBinaryRead} from "../message-type-extensions/internal-binary-read";
import {InternalBinaryWrite} from "../message-type-extensions/internal-binary-write";
import {Interpreter} from "../interpreter";
import {FieldInfoGenerator} from "./field-info-generator";
import {GeneratorBase} from "./generator-base";


export interface CustomMethodGenerator {
    make(source: TypescriptFile, descriptor: DescriptorProto): ts.MethodDeclaration[];
}


export class MessageTypeGenerator extends GeneratorBase {


    private readonly wellKnown: WellKnownTypes;
    private readonly googleTypes: GoogleTypes;
    private readonly typeMethodCreate: Create;
    private readonly typeMethodInternalBinaryRead: InternalBinaryRead;
    private readonly typeMethodInternalBinaryWrite: InternalBinaryWrite;
    private readonly fieldInfoGenerator: FieldInfoGenerator;


    constructor(symbols: SymbolTable, registry: DescriptorRegistry, imports: TypeScriptImports, comments: CommentGenerator, interpreter: Interpreter,
                private readonly options: {
                    runtimeImportPath: string;
                    normalLongType: LongType;
                    oneofKindDiscriminator: string;
                    useProtoFieldName: boolean;
                }) {
        super(symbols, registry, imports, comments, interpreter);
        this.fieldInfoGenerator = new FieldInfoGenerator(this.registry, this.imports, this.options);
        this.wellKnown = new WellKnownTypes(this.registry, this.imports, this.options);
        this.googleTypes = new GoogleTypes(this.registry, this.imports, this.options);
        this.typeMethodCreate = new Create(this.registry, this.imports, this.interpreter, this.options);
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
    generateMessageType(source: TypescriptFile, descriptor: DescriptorProto, optimizeFor: OptimizeMode): void {
        const
            // identifier for the message
            MyMessage = this.imports.type(source, descriptor),
            Message$Type = ts.createIdentifier(this.imports.type(source, descriptor) + '$Type'),
            MessageType = ts.createIdentifier(this.imports.name(source, "MessageType", this.options.runtimeImportPath)),
            interpreterType = this.interpreter.getMessageType(descriptor),
            classDecMembers: ts.ClassElement[] = [],
            classDecSuperArgs: ts.Expression[] = [ // arguments to the MessageType CTOR
                // arg 0: type name
                ts.createStringLiteral(this.registry.makeTypeName(descriptor)),
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
        classDecMembers.push(...this.wellKnown.make(source, descriptor));
        classDecMembers.push(...this.googleTypes.make(source, descriptor));

        // "MyMessage$Type" members for optimized binary format
        if (optimizeFor === OptimizeMode.SPEED) {
            classDecMembers.push(
                ...this.typeMethodCreate.make(source, descriptor),
                ...this.typeMethodInternalBinaryRead.make(source, descriptor),
                ...this.typeMethodInternalBinaryWrite.make(source, descriptor),
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
        let comment = this.comments.makeDeprecatedTag(descriptor);
        comment += this.comments.makeGeneratedTag(descriptor).replace("@generated from ", "@generated MessageType for ");
        addCommentBlockAsJsDoc(exportConst, comment);

        return;
    }



}
