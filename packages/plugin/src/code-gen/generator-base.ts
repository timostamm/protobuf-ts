import {CommentGenerator} from "./comment-generator";
import {DescriptorRegistry, SymbolTable, TypeScriptImports} from "@protobuf-ts/plugin-framework";
import {LegacyInterpreter} from "../legacy-interpreter";


export abstract class GeneratorBase {


    protected constructor(
        protected readonly symbols: SymbolTable,
        protected readonly registry: DescriptorRegistry,
        protected readonly imports: TypeScriptImports,
        protected readonly comments: CommentGenerator,
        protected readonly interpreter: LegacyInterpreter,
    ) {
    }

}
