import {
    addCommentBlockAsJsDoc,
    DescriptorRegistry,
    ServiceDescriptorProto,
    TypescriptFile,
    TypeScriptImports,
    typescriptLiteralFromValue
} from "@protobuf-ts/plugin-framework";
import {CommentGenerator} from "./comment-generator";
import * as ts from "typescript";
import {MethodInfoGenerator} from "./method-info-generator";
import {DescService} from "@bufbuild/protobuf";
import {ESInterpreter} from "../es-interpreter";
import {assert} from "@protobuf-ts/runtime";


export class ServiceTypeGenerator {

    private readonly methodInfoGenerator: MethodInfoGenerator;

    constructor(
        private readonly legacyRegistry: DescriptorRegistry,
        private readonly imports: TypeScriptImports,
        private readonly comments: CommentGenerator,
        private readonly interpreter: ESInterpreter,
        private readonly options: { runtimeRpcImportPath: string; },
    ) {
        this.methodInfoGenerator = new MethodInfoGenerator(legacyRegistry, this.imports)
    }


    // export const Haberdasher = new ServiceType("spec.haberdasher.Haberdasher", [
    //     { name: "MakeHat", localName: "makeHat", I: Size, O: Hat },
    // ], {});
    generateServiceType(source: TypescriptFile, descService: DescService): void {

        const legacyDescriptor = this.legacyRegistry.resolveTypeName(descService.typeName);
        assert(ServiceDescriptorProto.is(legacyDescriptor));

        const
            // identifier for the service
            MyService = this.imports.type(source, legacyDescriptor),
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
        let comment = this.comments.legacyMakeDeprecatedTag(legacyDescriptor);
        comment += this.comments.legacyMakeGeneratedTag(legacyDescriptor).replace("@generated from ", "@generated ServiceType for ");
        addCommentBlockAsJsDoc(exportConst, comment);

        return;
    }

}
