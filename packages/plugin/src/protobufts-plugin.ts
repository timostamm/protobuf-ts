import {DescEnum, DescExtension, DescFile, DescMessage, DescService} from "@bufbuild/protobuf";
import {create, createFileRegistry, FileRegistry} from "@bufbuild/protobuf";
import type {FileDescriptorSet} from "@bufbuild/protobuf/wkt";
import {CodeGeneratorResponse_Feature, FileDescriptorSetSchema} from "@bufbuild/protobuf/wkt";
import {nestedTypes} from "@bufbuild/protobuf/reflect";
import type {CodeGeneratorRequest} from "@bufbuild/protobuf/wkt";
import {setupCompiler} from "./framework/typescript-compile";
import {GeneratedFile} from "./framework/generated-file";
import {OutFile} from "./out-file";
import {Options, parseOptions} from "./options";
import {ServiceServerGeneratorGrpc} from "./code-gen/service-server-generator-grpc";
import {CommentGenerator} from "./code-gen/comment-generator";
import {MessageInterfaceGenerator} from "./code-gen/message-interface-generator";
import {MessageTypeGenerator} from "./code-gen/message-type-generator";
import {EnumGenerator} from "./code-gen/enum-generator";
import {ServiceTypeGenerator} from "./code-gen/service-type-generator";
import {ServiceClientGeneratorGeneric} from "./code-gen/service-client-generator-generic";
import {FileTable} from "./file-table";
import {ServiceServerGeneratorGeneric} from "./code-gen/service-server-generator-generic";
import {ServiceClientGeneratorGrpc} from "./code-gen/service-client-generator-grpc";
import * as ts from "typescript";
import {WellKnownTypes} from "./message-type-extensions/well-known-types";
import {Interpreter} from "./interpreter";
import {SymbolTable} from "./framework/symbol-table";
import {TypeScriptImports} from "./framework/typescript-imports";
import {PluginBaseProtobufES} from "./framework/plugin-base";
import {ServerStyle, ClientStyle} from "./gen/protobuf-ts_pb";


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
            symbols = new SymbolTable(),
            fileTable = new FileTable(options),
            imports = new TypeScriptImports(symbols, registry),
            comments = new CommentGenerator(),
            interpreter = new Interpreter(registry, options),
            genMessageInterface = new MessageInterfaceGenerator(symbols, imports, comments, interpreter, options),
            genEnum = new EnumGenerator(symbols, imports, comments, interpreter),
            genMessageType = new MessageTypeGenerator(registry, imports, comments, interpreter, options),
            genServiceType = new ServiceTypeGenerator(symbols, imports, comments, interpreter, options),
            genServerGeneric = new ServiceServerGeneratorGeneric(symbols, imports, comments, interpreter, options),
            genServerGrpc = new ServiceServerGeneratorGrpc(symbols, imports, comments, interpreter),
            genClientGeneric = new ServiceClientGeneratorGeneric(symbols, registry, imports, comments, interpreter, options),
            genClientGrpc = new ServiceClientGeneratorGrpc(symbols, registry, imports, comments, interpreter, options)
        ;

        // in first pass, register standard file names
        for (let fileDescriptor of registry.files) {
            const base = fileDescriptor.name + (options.addPbSuffix ? "_pb" : "");
            fileTable.register(base + '.ts', fileDescriptor);
        }

        // in second pass, register client and server file names
        for (let descFile of registry.files) {
            const base = descFile.name + (options.addPbSuffix ? "_pb" : "");
            fileTable.register(base + '.server.ts', descFile, 'generic-server');
            fileTable.register(base + '.grpc-server.ts', descFile, 'grpc1-server');
            fileTable.register(base + '.client.ts', descFile, 'client');
            fileTable.register(base + '.promise-client.ts', descFile, 'promise-client');
            fileTable.register(base + '.rx-client.ts', descFile, 'rx-client');
            fileTable.register(base + '.grpc-client.ts', descFile, 'grpc1-client');
        }

        // in third pass, generate files
        for (let descFile of registry.files) {
            const
                outMain = fileTable.create(descFile),
                outServerGeneric = fileTable.create(descFile, 'generic-server'),
                outServerGrpc = fileTable.create(descFile, 'grpc1-server'),
                outClientCall = fileTable.create(descFile, 'client'),
                // TODO
                //outClientPromise = fileTable.create(descFile, 'promise-client'),
                //outClientRx = fileTable.create(descFile, 'rx-client'),
                outClientGrpc = fileTable.create(descFile, 'grpc1-client');

            // in first pass over types, register all symbols, regardless whether they are going to be used
            for (const desc of nestedTypes(descFile)) {
                switch (desc.kind) {
                    case "enum":
                        genEnum.registerSymbols(outMain, desc);
                        break;
                    case "message":
                        genMessageInterface.registerSymbols(outMain, desc);
                        break;
                    case "service":
                        genServiceType.registerSymbols(outMain, desc);
                        genClientGeneric.registerSymbols(outClientCall, desc);
                        genClientGrpc.registerSymbols(outClientGrpc, desc);
                        genServerGeneric.registerSymbols(outServerGeneric, desc);
                        genServerGrpc.registerSymbols(outServerGrpc, desc);
                        break;
                }
            }

            // in second pass over types, generate message interfaces and enums
            for (const desc of nestedTypes(descFile)) {
                switch (desc.kind) {
                    case "message":
                        genMessageInterface.generateMessageInterface(outMain, desc)
                        break;
                    case "enum":
                        genEnum.generateEnum(outMain, desc);
                        break;
                }
            }

            // in third pass over types, generate message and service types
            for (const desc of nestedTypes(descFile)) {
                switch (desc.kind) {
                    case "message":
                        genMessageType.generateMessageType(outMain, desc, options.getOptimizeMode(descFile));
                        break;
                    case "service":
                        if (options.forceDisableServices) {
                            break;
                        }
                        // service type
                        genServiceType.generateServiceType(outMain, desc);
                        // clients
                        const clientStyles = options.getClientStyles(desc);
                        if (clientStyles.includes(ClientStyle.GENERIC_CLIENT)) {
                            genClientGeneric.generateInterface(outClientCall, desc);
                            genClientGeneric.generateImplementationClass(outClientCall, desc);
                        }
                        if (clientStyles.includes(ClientStyle.GRPC1_CLIENT)) {
                            genClientGrpc.generateInterface(outClientGrpc, desc);
                            genClientGrpc.generateImplementationClass(outClientGrpc, desc);
                        }
                        // servers
                        const serverStyles = options.getServerStyles(desc);
                        if (serverStyles.includes(ServerStyle.GENERIC_SERVER)) {
                            genServerGeneric.generateInterface(outServerGeneric, desc);
                        }
                        if (serverStyles.includes(ServerStyle.GRPC1_SERVER)) {
                            genServerGrpc.generateInterface(outServerGrpc, desc);
                            genServerGrpc.generateDefinition(outServerGrpc, desc);
                        }
                        break;
                }
            }

        }


        // plugins should only return files requested to generate
        // unless our option "generate_dependencies" is set.
        // We always return well-known types, because we do not
        // maintain them in a package - they are always generated
        // on demand.
        let tsFiles = fileTable.outFiles.concat();
        if (!options.generateDependencies) {
            tsFiles = tsFiles.filter(file => {
                const protoFilename = file.descFile.proto.name;
                if (request.fileToGenerate.includes(protoFilename)) {
                    return true;
                }
                if (WellKnownTypes.protoFilenames.includes(protoFilename)) {
                    return true;
                }
                return false;
            });
        }

        // if a proto file is imported to use custom options, or if a proto file declares custom options,
        // we do not to emit it. unless it was explicitly requested.
        // TODO why does the fallback condition include "used" files? isn't that what generateDependencies should do?
        tsFiles = tsFiles.filter(of =>
            request.fileToGenerate.includes(of.descFile.proto.name)
            || this.isFileUsed(of.descFile, tsFiles.map(x => x.descFile))
        );

        return this.transpile(tsFiles, options);
    }


    protected transpile(tsFiles: OutFile[], options: Options): GeneratedFile[] {
        if (options.transpileTarget === undefined) {
            return tsFiles;
        }
        const opt: ts.CompilerOptions = {
            moduleResolution: ts.ModuleResolutionKind.NodeJs,
            skipLibCheck: true,
            declaration: true,
            noResolve: true,
            module: options.transpileModule,
            target: options.transpileTarget,
        };
        const [program,] = setupCompiler(opt, tsFiles, tsFiles.map(f => f.getFilename()));
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
            const tsFile = tsFiles.find(x => sourceFiles[0].fileName === x.getFilename());
            if (!tsFile) {
                err = new Error(`unable to map emitted file "${fileName}" to a source file: not found`)
                return;
            }
            const content = tsFile.getHeader() + data;
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


    private isFileUsed(descFile: DescFile, files: Iterable<DescFile>): boolean {
        for (const type of nestedTypes(descFile)) {
            // TODO do not consider referencing a type that a file defines itself used - filter the second argument to exclude the current file
            if (this.isTypeUsed(type, files)) {
                return true;
            }
        }
        return false;
    }

    private isTypeUsed(type: DescMessage | DescEnum | DescService | DescExtension, files: Iterable<DescFile>): boolean {
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

}

export function createFileRegistryFromRequest(request: CodeGeneratorRequest): FileRegistry {
    const set = create(FileDescriptorSetSchema, {
        file: request.protoFile,
    }) as FileDescriptorSet;
    return createFileRegistry(set);
}
