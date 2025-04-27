import {
    TypescriptFile,
} from "@protobuf-ts/plugin-framework";
import {CommentGenerator} from "./comment-generator";
import * as ts from "typescript";
import {MethodInfoGenerator} from "./method-info-generator";
import {DescService} from "@bufbuild/protobuf";
import {Interpreter} from "../interpreter";
import {createLocalTypeName} from "./local-type-name";
import {TypeScriptImports} from "../framework/typescript-imports";
import {SymbolTable} from "../framework/symbol-table";
import {addCommentBlockAsJsDoc} from "../framework/typescript-comments";
import {typescriptLiteralFromValue} from "../framework/typescript-literal-from-value";


export class ServiceTypeGenerator {

    private readonly methodInfoGenerator: MethodInfoGenerator;

    constructor(
        private readonly symbols: SymbolTable,
        private readonly imports: TypeScriptImports,
        private readonly comments: CommentGenerator,
        private readonly interpreter: Interpreter,
        private readonly options: { runtimeRpcImportPath: string; },
    ) {
        this.methodInfoGenerator = new MethodInfoGenerator(imports)
    }

    registerSymbols(source: TypescriptFile, descService: DescService): void {
        this.symbols.register(createLocalTypeName(descService), descService, source);
    }

    // export const Haberdasher = new ServiceType("spec.haberdasher.Haberdasher", [
    //     { name: "MakeHat", localName: "makeHat", I: Size, O: Hat },
    // ], {});
    generateServiceType(source: TypescriptFile, descService: DescService): void {
        const
            // identifier for the service
            MyService = this.imports.type(source, descService),
            ServiceType = this.imports.name(source, "ServiceType", this.options.runtimeRpcImportPath),
            interpreterType = this.interpreter.getServiceType(descService);

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
        let comment = this.comments.makeDeprecatedTag(descService);
        comment += this.comments.makeGeneratedTag(descService).replace("@generated from ", "@generated ServiceType for ");
        addCommentBlockAsJsDoc(exportConst, comment);

        return;
    }

}
