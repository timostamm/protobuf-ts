import {
    create,
    createFileRegistry,
    DescEnum,
    DescExtension,
    DescFile,
    DescMessage,
    DescService,
    FileRegistry
} from "@bufbuild/protobuf";
import type {CodeGeneratorRequest, FileDescriptorSet} from "@bufbuild/protobuf/wkt";
import {CodeGeneratorResponse_Feature, FileDescriptorSetSchema} from "@bufbuild/protobuf/wkt";
import {nestedTypes} from "@bufbuild/protobuf/reflect";
import {setupCompiler} from "./framework/typescript-compile";
import {GeneratedFile} from "./framework/generated-file";
import {Options, parseOptions} from "./options";
import * as ts from "typescript";
import {Interpreter} from "./interpreter";
import {PluginBaseProtobufES} from "./framework/plugin-base";
import {ClientStyle, ServerStyle} from "./gen/protobuf-ts_pb";
import {createSchema, File} from "./schema";
import {printEnum} from "./generators/enum";
import {printMessageInterface} from "./generators/message-interface";
import {printMessageType} from "./generators/message-type";
import {printServiceType} from "./generators/service-type";
import {printClientGeneric, printClientInterface} from "./generators/client-generic";
import {printServerInterface} from "./generators/server-generic";
import {printServerGrpc1Definition, printServerGrpc1Interface} from "./generators/server-grpc1";
import {printClientGrpc1, printClientGrpc1Interface} from "./generators/client-grpc1";


export class ProtobuftsPlugin extends PluginBaseProtobufES {


    constructor(private readonly version: string) {
        super();
        this.version = version;
    }


    generate(request: CodeGeneratorRequest): GeneratedFile[] {
        const
            options = parseOptions(
                request.parameter,
                `by protobuf-ts ${this.version}` + (request.parameter ? ` with parameter ${request.parameter}` : '')
            ),
            registry = createFileRegistryFromRequest(request),
            interpreter = new Interpreter(registry, options),
            schema = createSchema(interpreter, options)
        ;
        for (const desc of filterFilesToGenerate(registry, request, options)) {
            const file = schema.createFile(desc, ".ts");
            const clientFile = schema.createFile(desc, ".client.ts");
            const clientGrpcFile = schema.createFile(desc, ".grpc-client.ts");
            const serverFile = schema.createFile(desc, ".server.ts");
            const serverGrpcFile = schema.createFile(desc, ".grpc-server.ts");
            for (const type of nestedTypes(desc)) {
                switch (type.kind) {
                    case "enum":
                        printEnum(schema, file, type);
                        break;
                    case "message":
                        printMessageInterface(schema, file, type);
                        break;
                }
            }
            for (const type of nestedTypes(desc)) {
                switch (type.kind) {
                    case "message":
                        printMessageType(schema, file, type);
                        break;
                }
            }
            for (const type of nestedTypes(desc)) {
                switch (type.kind) {
                    case "service":
                        if (options.forceDisableServices) {
                            break;
                        }
                        printServiceType(schema, file, type);
                        // clients
                        const clientStyles = options.getClientStyles(type);
                        if (clientStyles.includes(ClientStyle.GENERIC_CLIENT)) {
                            printClientInterface(schema, clientFile, type);
                            printClientGeneric(schema, clientFile, type);
                        }
                        if (clientStyles.includes(ClientStyle.GRPC1_CLIENT)) {
                            printClientGrpc1Interface(schema, clientGrpcFile, type);
                            printClientGrpc1(schema, clientGrpcFile, type);
                        }
                        // servers
                        const serverStyles = options.getServerStyles(type);
                        if (serverStyles.includes(ServerStyle.GENERIC_SERVER)) {
                            printServerInterface(schema, serverFile, type);
                        }
                        if (serverStyles.includes(ServerStyle.GRPC1_SERVER)) {
                            printServerGrpc1Interface(schema, serverGrpcFile, type);
                            printServerGrpc1Definition(schema, serverGrpcFile, type);
                        }
                        break;
                }
            }
        }
        return this.transpile(schema.getFiles(), options);
    }


    protected transpile(files: File[], options: Options): GeneratedFile[] {
        const inputFiles: GeneratedFile[] = files.map(file => {
            let body: string | undefined;
            return {
                getContent(): string {
                    if (body === undefined) {
                        body = file.toString();
                        if (body.length && file.preamble?.length) {
                            return file.preamble + body;
                        }
                    }
                    return body;
                },
                getFilename(): string {
                    return file.name;
                }
            };
        });
        if (options.transpileTarget === undefined) {
            return inputFiles;
        }
        const opt: ts.CompilerOptions = {
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            skipLibCheck: true,
            declaration: true,
            module: options.transpileModule,
            target: options.transpileTarget,
        };
        const [program,] = setupCompiler(opt, inputFiles, inputFiles.map(f => f.getFilename()));
        const results: GeneratedFile[] = [];
        let err: Error | undefined;
        program.emit(undefined, (fileName: string, data: string, writeByteOrderMark: boolean, onError?: (message: string) => void, sourceFiles?: readonly ts.SourceFile[]) => {
            // We have to go through some hoops here because the header we add to each file
            // is not part of the AST. So we find the TypeScript file we generated for each
            // emitted file and add the header to each output ourselves.
            if (!sourceFiles) {
                err = new Error(`unable to map emitted file "${fileName}" to a source file: missing source files`)
                return;
            }
            if (sourceFiles.length !== 1) {
                err = new Error(`unable to map emitted file "${fileName}" to a source file: expected 1 source file, got ${sourceFiles.length}`)
                return;
            }
            const file = files.find(x => sourceFiles[0].fileName === x.name);
            if (!file) {
                err = new Error(`unable to map emitted file "${fileName}" to a source file: not found`)
                return;
            }
            const content = (file.preamble ?? "") + data;
            results.push({
                getFilename() {
                    return fileName;
                },
                getContent() {
                    return content;
                }
            });
        });
        if (err) {
            throw err;
        }
        return results;
    }

    // we support proto3-optionals, so we let protoc know
    protected getSupportedFeatures = () => [CodeGeneratorResponse_Feature.PROTO3_OPTIONAL];

}

function createFileRegistryFromRequest(request: CodeGeneratorRequest): FileRegistry {
    const set = create(FileDescriptorSetSchema, {
        file: request.protoFile,
    }) as FileDescriptorSet;
    return createFileRegistry(set);
}

function filterFilesToGenerate(registry: FileRegistry, request: CodeGeneratorRequest, options: Options): DescFile[] {
    const all = Array.from(registry.files);
    const firstPass = all.filter(file => {
        if (options.generateDependencies) {
            return true;
        }
        if (request.fileToGenerate.includes(file.proto.name)) {
            return true;
        }
        const wkt = [
            "google/protobuf/any.proto",
            "google/protobuf/api.proto",
            "google/protobuf/descriptor.proto",
            "google/protobuf/duration.proto",
            "google/protobuf/empty.proto",
            "google/protobuf/field_mask.proto",
            "google/protobuf/source_context.proto",
            "google/protobuf/struct.proto",
            "google/protobuf/timestamp.proto",
            "google/protobuf/type.proto",
            "google/protobuf/wrappers.proto",
            "google/protobuf/compiler/plugin.proto",
            "google/protobuf/any.proto",
        ];
        if (wkt.includes(file.proto.name)) {
            return true;
        }
        return false;
    });
    return firstPass.filter(file => {
        if (request.fileToGenerate.includes(file.proto.name)) {
            return true;
        }
        return isFileUsed(file, firstPass)
    });
}

function isFileUsed(descFile: DescFile, files: Iterable<DescFile>): boolean {
    for (const type of nestedTypes(descFile)) {
        // TODO do not consider referencing a type that a file defines itself used - filter the second argument to exclude the current file
        if (isTypeUsed(type, files)) {
            return true;
        }
    }
    return false;
}

function isTypeUsed(type: DescMessage | DescEnum | DescService | DescExtension, files: Iterable<DescFile>): boolean {
    for (const otherFile of files) {
        for (const otherType of nestedTypes(otherFile)) {
            switch (otherType.kind) {
                case "service":
                    if (type.kind == "message") {
                        if (otherType.methods.some(descMethod => descMethod.input.typeName == type.typeName)) {
                            return true;
                        }
                        if (otherType.methods.some(descMethod => descMethod.output.typeName == type.typeName)) {
                            return true;
                        }
                    }
                    break;
                case "message":
                    if (otherType.fields.some(descField => descField.message?.typeName === type.typeName)) {
                        return true;
                    }
                    if (otherType.fields.some(descField => descField.enum?.typeName === type.typeName)) {
                        return true;
                    }
                    break;
            }
        }
    }
    return false;
}