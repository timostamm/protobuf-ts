import {existsSync, mkdirSync, writeFileSync} from "fs";
import * as path from "path";
import {
    CodeGeneratorRequest,
    CodeGeneratorResponse_Feature,
    GeneratedFile,
    PluginBase
} from "@protobuf-ts/plugin-framework";


const BIN_SUFFIX = '.codegenreq';
const JSON_SUFFIX = '.json';

const USAGE = `protoc-gen-dump can be run in 2 ways, depending on the given parameter (--dump_opt=<parameter>)
1) parameter ending in ${BIN_SUFFIX}
Dumps a 'CodeGeneratorRequest' in binary format. 
The request is dumped to the path specified by the parameter.
Example: 
    protoc --plugin node_modules/.bin/protoc-gen-dump --dump_opt my-dump.bin --dump_out . -I protos/ protos/*.proto

2) parameter ending in ${JSON_SUFFIX}
Dumps a 'CodeGeneratorRequest' in JSON format. 
The request is dumped to the path specified by the parameter.
Example:
    protoc --plugin node_modules/.bin/protoc-gen-dump --dump_opt my-dump.json --dump_out . -I protos/ protos/*.proto

`;


export class DumpPlugin extends PluginBase<GeneratedFile> {

    generate(request: CodeGeneratorRequest): GeneratedFile[] {

        const parameter = request.parameter;

        if (parameter?.endsWith(JSON_SUFFIX)) {

            DumpPlugin.mkdir(parameter);
            writeFileSync(parameter, CodeGeneratorRequest.toJsonString(request, {prettySpaces: 2}));

        } else if (parameter?.endsWith(BIN_SUFFIX)) {

            DumpPlugin.mkdir(parameter);
            let bytes = CodeGeneratorRequest.toBinary(request);
            writeFileSync(parameter, bytes);

            try {
                CodeGeneratorRequest.fromBinary(bytes)
            } catch (e) {
                throw new Error("Sanity check failed: " + e)
            }

        } else {

            throw USAGE;

        }

        return [];
    }


    private static mkdir(file: string): void {
        if (!existsSync(path.dirname(file))) {
            mkdirSync(path.dirname(file), {recursive: true});
        }
    }


    // we support proto3-optionals, so we let protoc know
    protected getSupportedFeatures = () => [CodeGeneratorResponse_Feature.PROTO3_OPTIONAL];


}
