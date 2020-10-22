import {
    addCommentBlockAsJsDoc,
    DescriptorRegistry,
    ServiceDescriptorProto,
    TypescriptFile,
    TypescriptImportManager,
    typescriptLiteralFromValue
} from "@protobuf-ts/plugin-framework";
import {Interpreter} from "../interpreter";
import {CommentGenerator} from "./comment-generator";
import * as ts from "typescript";
import {MethodInfoGenerator} from "./method-info-generator";


export class ServiceTypeGenerator {

    private readonly methodInfoGenerator: MethodInfoGenerator;

    constructor(
        private readonly registry: DescriptorRegistry,
        private readonly imports: TypescriptImportManager,
        private readonly interpreter: Interpreter,
        private readonly commentGenerator: CommentGenerator,
        private readonly options: {
            runtimeRpcImportPath: string;
        }
    ) {
        this.methodInfoGenerator = new MethodInfoGenerator(this.registry, this.imports, this.options);
    }


    // export const Haberdasher = new ServiceType("spec.haberdasher.Haberdasher", [
    //     { name: "MakeHat", localName: "makeHat", I: Size, O: Hat },
    // ], {});
    generateServiceType(descriptor: ServiceDescriptorProto, source: TypescriptFile): void {

        const
            // identifier for the service
            MyService = this.imports.type(descriptor),
            ServiceType = this.imports.name("ServiceType", this.options.runtimeRpcImportPath),
            interpreterType = this.interpreter.getServiceType(descriptor);

        const args: ts.Expression[] = [
            ts.createStringLiteral(interpreterType.typeName),
            this.methodInfoGenerator.createMethodInfoLiterals(interpreterType.methods)
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
        let comment = this.commentGenerator.makeDeprecatedTag(descriptor);
        comment += this.commentGenerator.makeGeneratedTag(descriptor).replace("@generated from ", "@generated ServiceType for ");
        addCommentBlockAsJsDoc(exportConst, comment);

        return;
    }

}
