import * as ts from "typescript";
import * as rt from "@protobuf-ts/runtime";
import {
    DescriptorRegistry,
    EnumDescriptorProto,
    SymbolTable,
    TypescriptEnumBuilder,
    TypescriptFile,
    TypeScriptImports,
    typescriptLiteralFromValue
} from "@protobuf-ts/plugin-framework";
import {CommentGenerator} from "./comment-generator";
import {Interpreter} from "../interpreter";
import {GeneratorBase} from "./generator-base";


export class EnumGenerator extends GeneratorBase {


    constructor(symbols: SymbolTable, registry: DescriptorRegistry, imports: TypeScriptImports, comments: CommentGenerator, interpreter: Interpreter,
                private readonly options: {
                    runtimeImportPath: string;
                }) {
        super(symbols, registry, imports, comments, interpreter);
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
    generateEnum(source: TypescriptFile, descriptor: EnumDescriptorProto): ts.EnumDeclaration {
        let enumObject = this.interpreter.getEnumInfo(descriptor)[1],
            builder = new TypescriptEnumBuilder();
        for (let ev of rt.listEnumValues(enumObject)) {
            let evDescriptor = descriptor.value.find(v => v.number === ev.number);
            let comments = evDescriptor
                ? this.comments.getCommentBlock(evDescriptor, true)
                : "@generated synthetic value - protobuf-ts requires all enums to have a 0 value";
            builder.add(ev.name, ev.number, comments);
        }
        let statement = builder.build(
            this.imports.type(source,descriptor),
            [ts.createModifier(ts.SyntaxKind.ExportKeyword)]
        );
        // add to our file
        source.addStatement(statement);
        this.generateEnumInfo(source, descriptor);
        this.comments.addCommentsForDescriptor(statement, descriptor, 'appendToLeadingBlock');
        return statement;
    }

    /**
     * For the following .proto:
     * 
     * ```proto
     *   enum MyEnum {
     *       option (enum_opt1) = 1003;
     *   
     *       MY_ENUM_FOO = 0 [(enum_value_opt1) = 1004];
     *       MY_ENUM_BAR = 1;
     *   }
     * ```
     * 
     * We generate the following enum info:
     * ```typescript
     *   export const MyEnumInfo: EnumInfo = [
     *       'package.MyEnum',
     *       MyEnum,
     *       'MY_ENUM_',
     *       registerEnumOptions(MyEnum, {options: {enum_opt1: 1003}, valueOptions: {FOO: {enum_value_opt1: 1004}}})
     *   ];
     * ```
     */
    generateEnumInfo(source: TypescriptFile, descriptor: EnumDescriptorProto): void {
        let enumInfo = this.interpreter.getEnumInfo(descriptor),
            [pbTypeName, , sharedPrefix, options] = enumInfo,
            EnumInfoType = this.imports.name(source, 'EnumInfo', this.options.runtimeImportPath, true),
            generatedEnum = this.imports.type(source, descriptor),
            generatedEnumInfo = this.symbols.register(`${generatedEnum}Info`, descriptor, source, 'info'),
            enumInfoLiteral: ts.Expression[] = [
                // 'package.MyEnum'
                ts.createStringLiteral(pbTypeName),
                // MyEnum,
                ts.createIdentifier(generatedEnum),
            ];

        if (sharedPrefix || options) {
            // 'MY_ENUM_'
            enumInfoLiteral[2] = typescriptLiteralFromValue(sharedPrefix);
            if (options) {
                // registerEnumOptions(MyEnum, {options: {enum_opt1: 1003}, valueOptions: {FOO: {enum_value_opt1: 1004}}})
                enumInfoLiteral[3] = ts.createCall(
                    ts.createIdentifier(
                        this.imports.name(source, 'registerEnumOptions', this.options.runtimeImportPath)
                    ),
                    undefined,
                    [ts.createIdentifier(generatedEnum), typescriptLiteralFromValue({...options})]
                )
            }
        }
        
        // export const MyEnumInfo: EnumInfo = [
        //     'package.MyEnum',
        //     MyEnum,
        //     'MY_ENUM_',
        //     registerEnumOptions(MyEnum, {options: {enum_opt1: 1003}, valueOptions: {FOO: {enum_value_opt1: 1004}}})
        // ];
        const exportConst = ts.createVariableStatement(
            [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
            ts.createVariableDeclarationList(
                [ts.createVariableDeclaration(
                    generatedEnumInfo,
                    ts.createTypeReferenceNode(
                        ts.createIdentifier(EnumInfoType),
                        undefined
                    ),
                    ts.createArrayLiteral(enumInfoLiteral, true)
                )],
                ts.NodeFlags.Const
            )
        );

        // add to our file
        source.addStatement(exportConst);
    }


}
