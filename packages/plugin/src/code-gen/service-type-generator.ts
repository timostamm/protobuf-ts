import {
  addCommentBlockAsJsDoc,
  AnyTypeDescriptorProto,
  DescriptorRegistry,
  FileDescriptorProto,
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
import { OutFile } from "../out-file";
import { FileTable } from "../file-table";
import { InternalOptions } from "../our-options";
import { camelToUnderscore } from "./util";

let kindConfigMap = new Map<string, string>([
  ["ACTION", "Action"],
  ["TASK", "Task"],
  ["QUESTION", "Question"],
  ["EVENT", "Event"],
]);

let kindCollectionMap = new Map<string, string>([
  ["ACTION", "Actions"],
  ["TASK", "Tasks"],
  ["QUESTION", "Questions"],
  ["EVENT", "Events"],
]);

const qetaKindOptionName = "chipper.qeta.kind"
const qetaKindTypeName = ".chipper.qeta.QetaKind"

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
    let qetaKindDescriptor: AnyTypeDescriptorProto | undefined
    const MyService = this.imports.type(source, descriptor);
    const interpreterType = this.interpreter.getServiceType(descriptor);
    const propertySignatures: ts.TypeElement[] = []
    const propertyAssignments: ts.PropertyAssignment[] = []
    let i = 0
    for (const method of descriptor.method) {
      /* Properties for Qeta config interface e.g.
         interface SagaServiceConfig {
          GetSagaQuestion: {
              request: GetSagaQuestionRequest;
              response: GetSagaQuestionResponse;
          };
          ...
        }
      */
      const options = interpreterType.methods[i].options
      let kind: string | undefined
      for (const [optionName, value] of Object.entries(options)) {
        if (optionName === qetaKindOptionName) {
          kind = value!.toString()
          qetaKindDescriptor = this.registry.resolveTypeName(qetaKindTypeName)
        }
      }
      i++
        
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
          ),
          ts.createPropertySignature(
            undefined,
            ts.createIdentifier("kind"),
            undefined,
            qetaKindDescriptor ?
              ts.createTypeReferenceNode(
                ts.createQualifiedName(
                  ts.createIdentifier(this.imports.type(
                    source,
                    qetaKindDescriptor
                  )),
                  ts.createIdentifier(kind!)
                ),
                undefined
              )
              :
              ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
            ,
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
            ),
            ts.createPropertyAssignment(
              ts.createIdentifier("kind"),
              qetaKindDescriptor ?
                ts.createPropertyAccess(
                  ts.createIdentifier(this.imports.type(
                    source,
                    qetaKindDescriptor
                  )),
                  ts.createIdentifier(kind!)
                )
                :
                typescriptLiteralFromValue(kind)
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
          ts.createIdentifier(`${MyService}Parsers`),
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

  generateQetaPublisher (
    descriptor: ServiceDescriptorProto,
    fileTable: FileTable,
    fileDescriptor: FileDescriptorProto,
    registry: DescriptorRegistry,
    options: InternalOptions): OutFile[]
  {
    const files: OutFile[] = []
    let i = 0;
    for (const method of descriptor.method) {
      const methodName = method.name!
      const source = new OutFile(
        fileTable.get(fileDescriptor, `${camelToUnderscore(methodName)}_publisher`).name, fileDescriptor, registry, options);
      const MyService = this.imports.type(source, descriptor);
      const interpreterType = this.interpreter.getServiceType(descriptor);
      this.imports.name(source, "QetaQueueManager", "@chippercash/chipper-mq")
      this.imports.name(source, "MessagePublishSettings", "@chippercash/chipper-mq")
      this.imports.name(source, "Services", "./services")
      let kind: string | undefined
      for (const [optionName, value] of Object.entries(interpreterType.methods[i].options)) {
        if (optionName === qetaKindOptionName) {
          kind = value?.toString()
        }
      }
      i++
      // kind = "ACTION"
      if (kind) {
        const kindName = kindConfigMap.get(kind)!
        const kindConfigName = `${kindName}Config`
        const kindCollectionName = kindCollectionMap.get(kind)!
        this.imports.name(source, kindConfigName, "@chippercash/chipper-mq")
        this.imports.name(source, kindCollectionName, `./${kind.toLowerCase()}`)
        
        const exportParamsStatement = ts.createTypeAliasDeclaration(
          undefined,
          [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
          ts.createIdentifier("Params"),
          undefined,
          ts.createTypeReferenceNode(
            ts.createIdentifier(this.imports.type(
              source,
              this.registry.resolveTypeName(method.inputType!)
            )),
            undefined
          )
        )
        source.addStatement(exportParamsStatement)
        const requestResponseConfig: boolean = kind === "ACTION" || kind === "QUESTION"
        if (requestResponseConfig) {
          const exportResponseStatement = ts.createTypeAliasDeclaration(
            undefined,
            [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
            ts.createIdentifier("Response"),
            undefined,
            ts.createTypeReferenceNode(
              ts.createIdentifier(this.imports.type(
                source,
                this.registry.resolveTypeName(method.outputType!)
              )),
              undefined
            )
          )
          source.addStatement(exportResponseStatement)
        }

        const cfgStatement = requestResponseConfig 
          ? this.createRequestResponseConfigStatement(kind, kindConfigName, kindCollectionName, methodName, MyService)
          : this.createRequestOnlyConfigStatement(kind, kindConfigName, kindCollectionName, methodName, MyService)
        
        const functionStatement = requestResponseConfig
          ? this.createRequestResponsePublishFunction(kindName)
          : this.createRequestOnlyPublishFunction(kindName)

        source.addStatement(cfgStatement)
        source.addStatement(functionStatement)
      }
      files.push(source)
    }
    return files
  }

  createRequestOnlyConfigStatement(
    kind: string,
    kindConfigName: string,
    kindCollectionName: string,
    methodName: string,
    service: string)
    : ts.VariableStatement 
  {
    return ts.createVariableStatement(
      [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.createVariableDeclarationList(
        [ts.createVariableDeclaration(
          ts.createIdentifier("config"),
          ts.createTypeReferenceNode(
            ts.createIdentifier(kindConfigName),
            [
              ts.createTypeReferenceNode(
                ts.createIdentifier("Params"),
                undefined
              )
            ]
          ),
          ts.createObjectLiteral(
            [
              ts.createPropertyAssignment(
                ts.createIdentifier(kind),
                ts.createPropertyAccess(
                  ts.createIdentifier(kindCollectionName),
                  ts.createIdentifier(methodName)
                )
              ),
              ts.createPropertyAssignment(
                ts.createIdentifier("subscriber"),
                ts.createPropertyAccess(
                  ts.createIdentifier("Services"),
                  ts.createIdentifier(service)
                )
              )
            ],
            true
          )
        )],
        ts.NodeFlags.Const
      )
    )
  }

  createRequestResponseConfigStatement(
    kind: string,
    kindConfigName: string,
    kindCollectionName: string,
    methodName: string,
    service: string)
    : ts.VariableStatement 
  {
    return ts.createVariableStatement(
      [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
      ts.createVariableDeclarationList(
        [ts.createVariableDeclaration(
          ts.createIdentifier("config"),
          ts.createTypeReferenceNode(
            ts.createIdentifier(kindConfigName),
            [
              ts.createTypeReferenceNode(
                ts.createIdentifier("Params"),
                undefined
              ),
              ts.createTypeReferenceNode(
                ts.createIdentifier("Response"),
                undefined
              )
            ]
          ),
          ts.createObjectLiteral(
            [
              ts.createPropertyAssignment(
                ts.createIdentifier(kind),
                ts.createPropertyAccess(
                  ts.createIdentifier(kindCollectionName),
                  ts.createIdentifier(methodName)
                )
              ),
              ts.createPropertyAssignment(
                ts.createIdentifier("subscriber"),
                ts.createPropertyAccess(
                  ts.createIdentifier("Services"),
                  ts.createIdentifier(service)
                )
              )
            ],
            true
          )
        )],
        ts.NodeFlags.Const
      )
    )
  }

  createRequestOnlyPublishFunction(kindName: string) : ts.FunctionDeclaration {
    return ts.createFunctionDeclaration(
      undefined,
      [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
      undefined,
      ts.createIdentifier("publish"),
      undefined,
      [
        ts.createParameter(
          undefined,
          undefined,
          undefined,
          ts.createIdentifier("qm"),
          undefined,
          ts.createTypeReferenceNode(
            ts.createIdentifier("QetaQueueManager"),
            undefined
          ),
          undefined
        ),
        ts.createParameter(
          undefined,
          undefined,
          undefined,
          ts.createIdentifier("params"),
          undefined,
          ts.createTypeReferenceNode(
            ts.createIdentifier("Params"),
            undefined
          ),
          undefined
        ),
        ts.createParameter(
          undefined,
          undefined,
          undefined,
          ts.createIdentifier("settings"),
          ts.createToken(ts.SyntaxKind.QuestionToken),
          ts.createTypeReferenceNode(
            ts.createIdentifier("MessagePublishSettings"),
            undefined
          ),
          undefined
        )
      ],
      ts.createTypeReferenceNode(
        ts.createIdentifier("Promise"),
        [ts.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword)]
      ),
      ts.createBlock(
        [ts.createReturn(ts.createCall(
          ts.createPropertyAccess(
            ts.createIdentifier("qm"),
            ts.createIdentifier(`publish${kindName}`)
          ),
          undefined,
          [
            ts.createIdentifier("config"),
            ts.createIdentifier("params"),
            ts.createIdentifier("settings")
          ]
        ))],
        true
      )
    )
  }

  createRequestResponsePublishFunction(kindName: string) : ts.FunctionDeclaration {
    return ts.createFunctionDeclaration(
      undefined,
      [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
      undefined,
      ts.createIdentifier("publish"),
      undefined,
      [
        ts.createParameter(
          undefined,
          undefined,
          undefined,
          ts.createIdentifier("qm"),
          undefined,
          ts.createTypeReferenceNode(
            ts.createIdentifier("QetaQueueManager"),
            undefined
          ),
          undefined
        ),
        ts.createParameter(
          undefined,
          undefined,
          undefined,
          ts.createIdentifier("params"),
          undefined,
          ts.createTypeReferenceNode(
            ts.createIdentifier("Params"),
            undefined
          ),
          undefined
        ),
        ts.createParameter(
          undefined,
          undefined,
          undefined,
          ts.createIdentifier("settings"),
          ts.createToken(ts.SyntaxKind.QuestionToken),
          ts.createTypeReferenceNode(
            ts.createIdentifier("MessagePublishSettings"),
            undefined
          ),
          undefined
        )
      ],
      ts.createTypeReferenceNode(
        ts.createIdentifier("Promise"),
        [ts.createTypeReferenceNode(
          ts.createIdentifier("Response"),
          undefined
        )]
      ),
      ts.createBlock(
        [ts.createReturn(ts.createCall(
          ts.createPropertyAccess(
            ts.createIdentifier("qm"),
            ts.createIdentifier(`publish${kindName}`)
          ),
          undefined,
          [
            ts.createIdentifier("config"),
            ts.createIdentifier("params"),
            ts.createIdentifier("settings")
          ]
        ))],
        true
      )
    )
  }


}
