import {CodeGeneratorRequest, FileDescriptorProto, FileDescriptorSet} from "@protobuf-ts/plugin-framework";
import {normalize} from "path";
import {existsSync, readFileSync} from "fs";


const descriptorSetPath = normalize('./descriptors.binpb');
let descriptorSet: FileDescriptorSet;


interface MakeCodeGeneratorRequestOptions {
    parameter?: string;
    includeFiles?: string[]; // defaults to all files
    fileToGenerate?: string[]; // defaults to includeFiles
}

/**
 * Synthesize a CodeGeneratorRequest from a pre-generated descriptor set.
 *
 * You can specify options to simulate a plugin request.
 *
 * To work correctly, the descriptor set must be generated with the protoc
 * options --include_source_info and --include_imports.
 */
export function getCodeGeneratorRequest(options: MakeCodeGeneratorRequestOptions): CodeGeneratorRequest {

    // read the pre-generated descriptor set
    let allFiles = readDescriptorSet();
    const availableFilenames = allFiles.map(x => x.name).filter(x => x !== undefined) as string[];

    // create request
    let request = CodeGeneratorRequest.create();
    request.parameter = options.parameter ?? '';
    request.fileToGenerate = options.fileToGenerate ?? options.includeFiles ?? availableFilenames;
    request.protoFile =
        allFiles.filter(f => (options.includeFiles ?? availableFilenames).some(n => n === f.name));

    // check if demand is satisfied
    const missingFileToGenerate = request.fileToGenerate.filter(n => !request.protoFile.some(f => f.name === n));
    if (missingFileToGenerate.length > 0) {
        let msg = `You requested ${missingFileToGenerate.length} files to generate that are not available in ${descriptorSetPath}:\n`;
        msg += missingFileToGenerate.join('\n');

        msg += "\n\navailable files: "
        msg += availableFilenames.join('\n');
        throw msg;
    }
    const missingIncludes = (options.includeFiles ?? []).filter(n => !request.protoFile.some(f => f.name === n));
    if (missingIncludes.length > 0) {
        let msg = `You requested to include ${missingIncludes.length} files that are not available in ${descriptorSetPath}:\n`;
        msg += missingIncludes.join('\n');
        throw msg;
    }

    // make sure to clone so that our cached descriptors stay unchanged
    return CodeGeneratorRequest.create(request);
}

/**
 * Get a FileDescriptorProto from a pre-generated descriptor set.
 */
export function getFileDescriptor(protoFile: string): FileDescriptorProto {
    let allFiles = readDescriptorSet();
    const file = allFiles.find(f => protoFile === f.name);
    if (file === undefined) {
        throw new Error(`Missing file: ${protoFile} in ${descriptorSetPath}`);
    }
    return FileDescriptorProto.create(file);
}


function readDescriptorSet(): FileDescriptorProto[] {
    if (!descriptorSet) {
        if (!existsSync(descriptorSetPath)) {
            const reason = `Did not find '${descriptorSetPath}'. \n`
                + `The file has to be generated by a protobuf compiler and contain a serialized FileDescriptorSet of all .protos in packages/proto.`
            pending(reason);
            throw reason;
        }
        const bytes = readFileSync(descriptorSetPath);
        descriptorSet = FileDescriptorSet.fromBinary(bytes);
    }
    return FileDescriptorSet.create(descriptorSet).file;
}
