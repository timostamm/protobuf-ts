import {
  addCommentBlockAsJsDoc,
  DescriptorRegistry,
  ServiceDescriptorProto,
  SymbolTable,
  TypescriptFile,
  TypeScriptImports,
  typescriptLiteralFromValue
} from "@chippercash/protobuf-plugin-framework";
import { Interpreter } from "../interpreter";
import { CommentGenerator } from "./comment-generator";
import * as ts from "typescript";
import { MethodInfoGenerator } from "./method-info-generator";
import { GeneratorBase } from "./generator-base";


export class ServiceTypeGenerator extends GeneratorBase {

  private readonly methodInfoGenerator: MethodInfoGenerator;


  constructor (symbols: SymbolTable, registry: DescriptorRegistry, imports: TypeScriptImports, comments: CommentGenerator, interpreter: Interpreter,
    private readonly options: {
      runtimeRpcImportPath: string;
    }) {
    super(symbols, registry, imports, comments, interpreter);
    this.methodInfoGenerator = new MethodInfoGenerator(this.registry, this.imports)
  }


  // export const Haberdasher = new ServiceType("spec.haberdasher.Haberdasher", [
  //     { name: "MakeHat", localName: "makeHat", I: Size, O: Hat },
  // ], {});
  generateServiceType (source: TypescriptFile, descriptor: ServiceDescriptorProto): void {

    const
      // identifier for the service
      MyService = this.imports.type(source, descriptor),
      ServiceType = this.imports.name(source, "ServiceType", this.options.runtimeRpcImportPath),
      interpreterType = this.interpreter.getServiceType(descriptor);

    const args: ts.Expression[] = [
      ts.createStringLiteral(interpreterType.typeName),
      this.methodInfoGenerator.createMethodInfoLiterals(source, interpreterType.methods)
    ];

    if (Object.keys(interpreterType.options).length) {
      args.push(
        typescriptLiteralFromValue(interpreterType.options)
      );
    }

    const exportConst = ts.createVariableStatement(
      [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.createVariableDeclarationList(
        [ts.createVariableDeclaration(
          ts.createIdentifier(MyService),
          undefined,
          ts.createNew(
            ts.createIdentifier(ServiceType),
            undefined,
            args
          )
        )],
        ts.NodeFlags.Const
      )
    );

    // add to our file
    source.addStatement(exportConst);

    // add comments
    let comment = this.comments.makeDeprecatedTag(descriptor);
    comment += this.comments.makeGeneratedTag(descriptor).replace("@generated from ", "@generated ServiceType for ");
    addCommentBlockAsJsDoc(exportConst, comment);

    return;
  }

  generateQetaServiceConfig (source: TypescriptFile, descriptor: ServiceDescriptorProto): void {
    const MyService = this.imports.type(source, descriptor);
    const properties: ts.TypeElement[] = []
    for (const method of descriptor.method) {
      const prop = ts.createPropertySignature(
        undefined,
        ts.createIdentifier(method.name!),
        undefined,
        ts.createTypeLiteralNode([
          ts.createPropertySignature(
            undefined,
            ts.createIdentifier("request"),
            undefined,
            ts.createTypeReferenceNode(
              ts.createIdentifier(this.imports.type(
                source,
                this.registry.resolveTypeName(method.inputType!)
              )),
              undefined
            ),
            undefined
          ),
          ts.createPropertySignature(
            undefined,
            ts.createIdentifier("response"),
            undefined,
            ts.createTypeReferenceNode(
              ts.createIdentifier(this.imports.type(
                source,
                this.registry.resolveTypeName(method.outputType!)
              )),
              undefined
            ),
            undefined
          )
        ]),
        undefined
      )
      properties.push(prop);
    }

    const config = ts.createInterfaceDeclaration(
      undefined,
      undefined,
      ts.createIdentifier(`${MyService}QetaConfig`),
      undefined,
      undefined,
      properties
    )
    // add to our file
    source.addStatement(config);

    return;
  }

}
