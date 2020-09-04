import * as ts from "typescript";
import * as rt from "@protobuf-ts/runtime";
import {
    DescriptorRegistry,
    EnumDescriptorProto,
    TypescriptEnumBuilder,
    TypescriptImportManager,
    TypescriptFile
} from "@protobuf-ts/plugin-framework";
import {CommentGenerator} from "./comment-generator";
import {Interpreter} from "../interpreter";


export class EnumGenerator {


    constructor(
        private readonly registry: DescriptorRegistry,
        private readonly imports: TypescriptImportManager,
        private readonly interpreter: Interpreter,
        private readonly commentGenerator: CommentGenerator,
    ) {
    }

    /**
     * For the following .proto:
     *
     * ```proto
     *   enum MyEnum {
     *     ANY = 0;
     *     YES = 1;
     *     NO = 2;
     *   }
     * ```
     *
     * We generate the following enum:
     *
     * ```typescript
     *   enum MyEnum {
     *       ANY = 0,
     *       YES = 1,
     *       NO = 2
     *   }
     * ```
     *
     * We drop a shared prefix, for example:
     *
     * ```proto
     * enum MyEnum {
     *     MY_ENUM_FOO = 0;
     *     MY_ENUM_BAR = 1;
     * }
     * ```
     *
     * Becomes:
     *
     * ```typescript
     *   enum MyEnum {
     *       FOO = 0,
     *       BAR = 1,
     *   }
     * ```
     *
     */
    generateEnum(descriptor: EnumDescriptorProto, source: TypescriptFile): ts.EnumDeclaration {
        let enumObject = this.interpreter.getEnumInfo(descriptor)[1],
            builder = new TypescriptEnumBuilder();
        for (let ev of rt.listEnumValues(enumObject)) {
            let evDescriptor = descriptor.value.find(v => v.number === ev.number);
            let comments = evDescriptor
                ? this.commentGenerator.getCommentBlock(evDescriptor, true)
                : "@generated synthetic value - protobuf-ts requires all enums to have a 0 value";
            builder.add(ev.name, ev.number, comments);
        }
        let statement = builder.build(
            this.imports.type(descriptor),
            [ts.createModifier(ts.SyntaxKind.ExportKeyword)]
        );
        // add to our file
        source.addStatement(statement);
        this.commentGenerator.addCommentsForDescriptor(statement, descriptor, 'appendToLeadingBlock');
        return statement;
    }


}
