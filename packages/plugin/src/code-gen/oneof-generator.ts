import * as ts from "typescript";
import {
  DescriptorRegistry,
  SymbolTable,
  TypescriptFile,
  TypeScriptImports,
} from "@chippercash/protobuf-plugin-framework";
import { CommentGenerator } from "./comment-generator";
import { Interpreter } from "../interpreter";
import { GeneratorBase } from "./generator-base";


export class OneofGenerator extends GeneratorBase {

  constructor (symbols: SymbolTable, registry: DescriptorRegistry, imports: TypeScriptImports, comments: CommentGenerator, interpreter: Interpreter,
    private readonly options: {
    }) {
    super(symbols, registry, imports, comments, interpreter);
  }

  generateUndefinedOfDeclaration (source: TypescriptFile) {
    // Add UndefinedOneOf declaration.
    const oneOfDecl = ts.createClassDeclaration(
      undefined,
      [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.createIdentifier("UndefinedOneOf"),
      undefined,
      undefined,
      [ts.createProperty(
        undefined,
        undefined,
        ts.createIdentifier("oneofKind"),
        undefined,
        ts.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword),
        undefined
      )]
    )
    source.addStatement(oneOfDecl)
  }

}
