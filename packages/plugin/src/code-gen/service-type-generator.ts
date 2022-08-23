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
    const propertySignatures: ts.TypeElement[] = []
    const propertyAssignments: ts.PropertyAssignment[] = []
    for (const method of descriptor.method) {
      /* Properties for Qeta config interface e.g.
         interface SagaServiceQetaConfigInterface {
          GetSagaQuestion: {
              request: GetSagaQuestionRequest;
              response: GetSagaQuestionResponse;
          };
          ...
        }
      */
      const propSignature = ts.createPropertySignature(
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
      propertySignatures.push(propSignature);
      /* Properties for Qeta config object, e.g. 
        export const SagaServiceConfig = {
          GetSagaQuestion: {
              request: GetSagaQuestionRequest,
              response: GetSagaQuestionResponse,
          },
          ...
        }
      */
      const propAssignment = ts.createPropertyAssignment(
        ts.createIdentifier(method.name!),
        ts.createObjectLiteral(
          [
            ts.createPropertyAssignment(
              ts.createIdentifier("request"),
              ts.createIdentifier(this.imports.type(
                source,
                this.registry.resolveTypeName(method.inputType!)
              ))
            ),
            ts.createPropertyAssignment(
              ts.createIdentifier("response"),
              ts.createIdentifier(this.imports.type(
                source,
                this.registry.resolveTypeName(method.outputType!)
              ))
            )
          ],
          true
        )
      )
      propertyAssignments.push(propAssignment)
      // Imports {Request}$Type class.
      this.imports.type(
        source,
        this.registry.resolveTypeName(method.inputType!), 'message-class'
      )
      // Imports {Response}$Type class.
      this.imports.type(
        source,
        this.registry.resolveTypeName(method.outputType!), 'message-class'
      )
    }

    const configInterface = ts.createInterfaceDeclaration(
      undefined,
      [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.createIdentifier(`${MyService}Config`),
      undefined,
      undefined,
      propertySignatures
    )

    const configObject = ts.createVariableStatement(
      [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.createVariableDeclarationList(
        [ts.createVariableDeclaration(
          ts.createIdentifier(`${MyService}Config`),
          undefined,
          ts.createAsExpression(
            ts.createObjectLiteral(
              propertyAssignments,
              true
            ),
            ts.createTypeReferenceNode(
              ts.createIdentifier("const"),
              undefined
            )
          )
        )],
        ts.NodeFlags.Const
      )
    )
    // add to our file
    source.addStatement(configInterface);
    source.addStatement(configObject)

    return;
  }

}
