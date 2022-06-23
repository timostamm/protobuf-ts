import * as ts from "typescript";
import * as rt from "@chippercash/protobuf-runtime";
import {
  DescriptorRegistry,
  EnumDescriptorProto,
  SymbolTable,
  TypescriptEnumBuilder,
  TypescriptFile,
  TypeScriptImports,
  typescriptLiteralFromValue
} from "@chippercash/protobuf-plugin-framework";
import { CommentGenerator } from "./comment-generator";
import { Interpreter } from "../interpreter";
import { GeneratorBase } from "./generator-base";


export class EnumGenerator extends GeneratorBase {

  private enumMapTypeName: string = "TagAndValueMap"


  constructor (symbols: SymbolTable, registry: DescriptorRegistry, imports: TypeScriptImports, comments: CommentGenerator, interpreter: Interpreter,
   private readonly options: {
        runtimeImportPath: string;
   }) {
    super(symbols, registry, imports, comments, interpreter);
  }

  generateEnumMapTypeDeclaration (source: TypescriptFile) {
    // Added by Michael
    let TagAndValueMap = this.imports.name(source, 'TagAndValueMap', this.options.runtimeImportPath);
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
   *       ANY = 'ANY',
   *       YES = 'YES',
   *       NO = 'NO'
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
   *       FOO = 'FOO',
   *       BAR = 'BAR',
   *   }
   * ```
   *
   */
  generateEnum (source: TypescriptFile, descriptor: EnumDescriptorProto): ts.EnumDeclaration {
    let enumObject = this.interpreter.getEnumInfo(descriptor)[1],
      builder = new TypescriptEnumBuilder();
    for (let ev of rt.listEnumValues(enumObject)) {
      let evDescriptor = descriptor.value.find(v => v.number === ev.number);
      let comments = evDescriptor
        ? this.comments.getCommentBlock(evDescriptor, true)
        : "@generated synthetic value - protobuf-ts requires all enums to have a 0 value";
      builder.add(ev.name, ev.number, comments);
    }
    const enumName = this.imports.type(source, descriptor)
    const enumMapName = this.imports.type(source, descriptor, 'object')
    let statement = builder.build(
      enumName,
      [ts.createModifier(ts.SyntaxKind.ExportKeyword)]
    );
    const enumMapDefinition = ts.createVariableStatement(
      [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.createVariableDeclarationList(
        [ts.createVariableDeclaration(
          ts.createIdentifier(`${enumMapName}`),
          ts.createTypeReferenceNode(
            ts.createIdentifier(this.enumMapTypeName),
            undefined
          ),
          typescriptLiteralFromValue(enumObject)
        )],
        ts.NodeFlags.Const
      )
    )

    // add to our file
    source.addStatement(statement);
    source.addStatement(enumMapDefinition);

    this.comments.addCommentsForDescriptor(statement, descriptor, 'appendToLeadingBlock');
    return statement;
  }
}
