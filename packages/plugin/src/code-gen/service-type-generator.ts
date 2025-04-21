import {
    addCommentBlockAsJsDoc,
    DescriptorRegistry,
    ServiceDescriptorProto,
    SymbolTable,
    TypescriptFile,
    TypeScriptImports,
    typescriptLiteralFromValue
} from "@protobuf-ts/plugin-framework";
import {Interpreter} from "../interpreter";
import {CommentGenerator} from "./comment-generator";
import * as ts from "typescript";
import {MethodInfoGenerator} from "./method-info-generator";
import {GeneratorBase} from "./generator-base";


export class ServiceTypeGenerator extends GeneratorBase {

    private readonly methodInfoGenerator: MethodInfoGenerator;


    constructor(symbols: SymbolTable, registry: DescriptorRegistry, imports: TypeScriptImports, comments: CommentGenerator, interpreter: Interpreter,
                private readonly options: {
                    runtimeRpcImportPath: string;
                }) {
        super(symbols, registry, imports, comments, interpreter);
        this.methodInfoGenerator = new MethodInfoGenerator(this.registry, this.imports)
    }


    // export const Haberdasher = new ServiceType("spec.haberdasher.Haberdasher", [
    //     { name: "MakeHat", localName: "makeHat", I: Size, O: Hat },
    // ], {});
    generateServiceType(source: TypescriptFile, descriptor: ServiceDescriptorProto): void {

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
        let comment = this.comments.legacyMakeDeprecatedTag(descriptor);
        comment += this.comments.legacyMakeGeneratedTag(descriptor).replace("@generated from ", "@generated ServiceType for ");
        addCommentBlockAsJsDoc(exportConst, comment);

        return;
    }

}
