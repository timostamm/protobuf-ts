import * as rpc from "@protobuf-ts/runtime-rpc";
import {CommentGenerator} from "./comment-generator";
import {DescriptorRegistry, TypescriptImportManager} from "@protobuf-ts/plugin-framework";
import {Interpreter} from "../interpreter";


export abstract class ServiceServerGeneratorBase {


    abstract readonly style: rpc.ServerStyle;
    protected readonly commentGenerator: CommentGenerator;


    constructor(
        protected readonly registry: DescriptorRegistry,
        protected readonly imports: TypescriptImportManager,
        protected readonly interpreter: Interpreter,
        protected readonly options: {
            runtimeRpcImportPath: string;
        },
    ) {
        this.commentGenerator = new CommentGenerator(this.registry);
    }

}
