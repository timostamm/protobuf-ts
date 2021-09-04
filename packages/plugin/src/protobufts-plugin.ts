import {
    CodeGeneratorRequest,
    CodeGeneratorResponse_Feature,
    DescriptorProto,
    DescriptorRegistry,
    EnumDescriptorProto,
    PluginBase,
    ServiceDescriptorProto,
    SymbolTable,
    TypeScriptImports
} from "@protobuf-ts/plugin-framework";
import {OutFile} from "./out-file";
import {createLocalTypeName} from "./code-gen/local-type-name";
import * as rt from "@protobuf-ts/runtime";
import {Interpreter} from "./interpreter";
import {ClientStyle, makeInternalOptions, OptionResolver, ServerStyle} from "./our-options";
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


export class ProtobuftsPlugin extends PluginBase<OutFile> {

    parameters = {
        // @formatter:off

        // long type
        long_type_string: {
            description: "Sets jstype = JS_STRING for message fields with 64 bit integral values. \n" +
                         "The default behaviour is to use native `bigint`. \n" +
                         "Only applies to fields that do *not* use the option `jstype`.",
            excludes: ["long_type_number", "long_type_bigint"],
        },
        long_type_number: {
            description: "Sets jstype = JS_NUMBER for message fields with 64 bit integral values. \n" +
                         "The default behaviour is to use native `bigint`. \n" +
                         "Only applies to fields that do *not* use the option `jstype`.",
            excludes: ["long_type_string", "long_type_bigint"],
        },
        long_type_bigint: {
            description: "Sets jstype = JS_NORMAL for message fields with 64 bit integral values. \n" +
                         "This is the default behavior. \n" +
                         "Only applies to fields that do *not* use the option `jstype`.",
            excludes: ["long_type_string", "long_type_number"],
        },

        // misc
        generate_dependencies: {
            description: "By default, only the PROTO_FILES passed as input to protoc are generated, \n" +
                "not the files they import. Set this option to generate code for dependencies \n" +
                "too.",
        },
        force_exclude_all_options: {
            description: "By default, custom options are included in the metadata and can be blacklisted \n" +
                "with our option (ts.exclude_options). Set this option if you are certain you do not want \n" +
                "to include any options at all.",
        },

        // client
        client_none: {
            description: "Do not generate rpc clients. \n" +
                         "Only applies to services that do *not* use the option `ts.client`. \n" +
                         "If you do not want rpc clients at all, use `force_client_none`.",
            excludes: ['client_generic', 'client_grpc1'],
        },
        client_generic: {
            description: "Only applies to services that do *not* use the option `ts.client`. \n" +
                         "Since GENERIC_CLIENT is the default, this option has no effect.",
            excludes: ['client_none', 'client_grpc1', 'force_client_none'],
        },
        client_grpc1: {
            description: "Generate a client using @grpc/grpc-js (major version 1). \n" +
                "Only applies to services that do *not* use the option `ts.client`." ,
            excludes: ['client_none', 'client_generic', 'force_client_none'],
        },
        force_client_none: {
            description: "Do not generate rpc clients, ignore options in proto files.",
            excludes: ['client_none', 'client_generic', 'client_grpc1'],
        },
        enable_angular_annotations: {
            description: "If set, the generated rpc client will have an angular @Injectable() \n" +
                         "annotation and the `RpcTransport` constructor argument is annotated with a \n" +
                         "@Inject annotation. For this feature, you will need the npm package \n" +
                         "'@protobuf-ts/runtime-angular'.",
            excludes: ['force_client_none'],
        },

        // server
        server_none: {
            description: "Do not generate rpc servers. \n" +
                         "This is the default behaviour, but only applies to services that do \n" +
                         "*not* use the option `ts.server`. \n" +
                         "If you do not want servers at all, use `force_server_none`.",
            excludes: ['server_grpc1'],
        },
        server_generic: {
            description: "Generate a generic server interface. Adapters are used to serve the service, \n" +
                         "for example @protobuf-ts/grpc-backend for gRPC. \n" +
                         "Note that this is an experimental feature and may change with a minor release. \n" +
                         "Only applies to services that do *not* use the option `ts.server`.",
            excludes: ['server_none', 'force_server_none'],
        },
        server_grpc1: {
            description: "Generate a server interface and definition for use with @grpc/grpc-js \n" +
                         "(major version 1). \n" +
                         "Only applies to services that do *not* use the option `ts.server`.",
            excludes: ['server_none', 'force_server_none'],
        },
        force_server_none: {
            description: "Do not generate rpc servers, ignore options in proto files.",
        },

        // optimization
        optimize_speed: {
            description: "Sets optimize_for = SPEED for proto files that have no file option \n" +
                         "'option optimize_for'. Since SPEED is the default, this option has no effect.",
            excludes: ['force_optimize_speed'],
        },
        optimize_code_size: {
            description: "Sets optimize_for = CODE_SIZE for proto files that have no file option \n" +
                         "'option optimize_for'.",
            excludes: ['force_optimize_speed'],
        },
        force_optimize_code_size: {
            description: "Forces optimize_for = CODE_SIZE for all proto files, ignore file options.",
            excludes: ['optimize_code_size', 'force_optimize_speed']
        },
        force_optimize_speed: {
            description: "Forces optimize_for = SPEED for all proto files, ignore file options.",
            excludes: ['optimize_code_size', 'force_optimize_code_size']
        },
        // @formatter:on
    }


    constructor(private readonly version: string) {
        super();
        this.version = version;
    }


    generate(request: CodeGeneratorRequest): OutFile[] {
        const
            params = this.parseOptions(this.parameters, request.parameter),
            options = makeInternalOptions({
                pluginCredit: `by protobuf-ts ${this.version}` + (request.parameter ? ` with parameter ${request.parameter}` : ''),
                emitAngularAnnotations: params.enable_angular_annotations,
                normalLongType: params.long_type_string ? rt.LongType.STRING : params.long_type_number ? rt.LongType.NUMBER : rt.LongType.BIGINT,
                forceExcludeAllOptions: params.force_exclude_all_options,
            }),
            registry = DescriptorRegistry.createFrom(request),
            symbols = new SymbolTable(),
            fileTable = new FileTable(),
            imports = new TypeScriptImports(symbols),
            comments = new CommentGenerator(registry),
            interpreter = new Interpreter(registry, options),
            optionResolver = new OptionResolver(interpreter, registry, params),
            genMessageInterface = new MessageInterfaceGenerator(symbols, registry, imports, comments, interpreter, options),
            genEnum = new EnumGenerator(symbols, registry, imports, comments, interpreter, options),
            genMessageType = new MessageTypeGenerator(symbols, registry, imports, comments, interpreter, options),
            genServiceType = new ServiceTypeGenerator(symbols, registry, imports, comments, interpreter, options),
            genServerGeneric = new ServiceServerGeneratorGeneric(symbols, registry, imports, comments, interpreter, options),
            genServerGrpc = new ServiceServerGeneratorGrpc(symbols, registry, imports, comments, interpreter, options),
            genClientGeneric = new ServiceClientGeneratorGeneric(symbols, registry, imports, comments, interpreter, options),
            genClientGrpc = new ServiceClientGeneratorGrpc(symbols, registry, imports, comments, interpreter, options)
        ;


        let outFiles: OutFile[] = [];


        // ensure unique file names
        for (let fileDescriptor of registry.allFiles()) {
            const base = fileDescriptor.name!.replace('.proto', '');
            fileTable.register(base + '.ts', fileDescriptor);
        }
        for (let fileDescriptor of registry.allFiles()) {
            const base = fileDescriptor.name!.replace('.proto', '');
            fileTable.register(base + '.server.ts', fileDescriptor, 'generic-server');
            fileTable.register(base + '.grpc-server.ts', fileDescriptor, 'grpc1-server');
            fileTable.register(base + '.client.ts', fileDescriptor, 'client');
            fileTable.register(base + '.promise-client.ts', fileDescriptor, 'promise-client');
            fileTable.register(base + '.rx-client.ts', fileDescriptor, 'rx-client');
            fileTable.register(base + '.grpc-client.ts', fileDescriptor, 'grpc1-client');
        }


        for (let fileDescriptor of registry.allFiles()) {
            const
                outMain = new OutFile(fileTable.get(fileDescriptor).name, fileDescriptor, registry, options),
                outServerGeneric = new OutFile(fileTable.get(fileDescriptor, 'generic-server').name, fileDescriptor, registry, options),
                outServerGrpc = new OutFile(fileTable.get(fileDescriptor, 'grpc1-server').name, fileDescriptor, registry, options),
                outClientCall = new OutFile(fileTable.get(fileDescriptor, 'client').name, fileDescriptor, registry, options),
                outClientPromise = new OutFile(fileTable.get(fileDescriptor, 'promise-client').name, fileDescriptor, registry, options),
                outClientRx = new OutFile(fileTable.get(fileDescriptor, 'rx-client').name, fileDescriptor, registry, options),
                outClientGrpc = new OutFile(fileTable.get(fileDescriptor, 'grpc1-client').name, fileDescriptor, registry, options);
            outFiles.push(outMain, outServerGeneric, outServerGrpc, outClientCall, outClientPromise, outClientRx, outClientGrpc);

            registry.visitTypes(fileDescriptor, descriptor => {
                // we are not interested in synthetic types like map entry messages
                if (registry.isSyntheticElement(descriptor)) return;

                // register all symbols, regardless whether they are going to be used - we want stable behaviour
                symbols.register(createLocalTypeName(descriptor, registry), descriptor, outMain);
                if (ServiceDescriptorProto.is(descriptor)) {
                    genClientGeneric.registerSymbols(outClientCall, descriptor);
                    genClientGrpc.registerSymbols(outClientGrpc, descriptor);
                    genServerGeneric.registerSymbols(outServerGeneric, descriptor);
                    genServerGrpc.registerSymbols(outServerGrpc, descriptor);
                }
            });

            registry.visitTypes(fileDescriptor, descriptor => {
                // we are not interested in synthetic types like map entry messages
                if (registry.isSyntheticElement(descriptor)) return;

                if (DescriptorProto.is(descriptor)) {
                    genMessageInterface.generateMessageInterface(outMain, descriptor)
                }
                if (EnumDescriptorProto.is(descriptor)) {
                    genEnum.generateEnum(outMain, descriptor);
                }
            });

            registry.visitTypes(fileDescriptor, descriptor => {
                // still not interested in synthetic types like map entry messages
                if (registry.isSyntheticElement(descriptor)) return;

                if (DescriptorProto.is(descriptor)) {
                    genMessageType.generateMessageType(outMain, descriptor, optionResolver.getOptimizeMode(fileDescriptor));
                }
                if (ServiceDescriptorProto.is(descriptor)) {

                    // service type
                    genServiceType.generateServiceType(outMain, descriptor)

                    // clients
                    const clientStyles = optionResolver.getClientStyles(descriptor);
                    if (clientStyles.includes(ClientStyle.GENERIC_CLIENT)) {
                        genClientGeneric.generateInterface(outClientCall, descriptor);
                        genClientGeneric.generateImplementationClass(outClientCall, descriptor);
                    }
                    if (clientStyles.includes(ClientStyle.GRPC1_CLIENT)) {
                        genClientGrpc.generateInterface(outClientGrpc, descriptor);
                        genClientGrpc.generateImplementationClass(outClientGrpc, descriptor);
                    }

                    // servers
                    const serverStyles = optionResolver.getServerStyles(descriptor);
                    if (serverStyles.includes(ServerStyle.GENERIC_SERVER)) {
                        genServerGeneric.generateInterface(outServerGeneric, descriptor);
                    }
                    if (serverStyles.includes(ServerStyle.GRPC1_SERVER)) {
                        genServerGrpc.generateInterface(outServerGrpc, descriptor);
                        genServerGrpc.generateDefinition(outServerGrpc, descriptor);
                    }
                }
            });

        }


        // plugins should only return files requested to generate
        // unless our option "generate_dependencies" is set
        if (!params.generate_dependencies) {
            outFiles = outFiles.filter(file => request.fileToGenerate.includes(file.fileDescriptor.name!));
        }

        // if a proto file is imported to use custom options, or if a proto file declares custom options,
        // we do not to emit it. unless it was explicitly requested.
        const outFileDescriptors = outFiles.map(of => of.fileDescriptor);
        outFiles = outFiles.filter(of =>
            request.fileToGenerate.includes(of.fileDescriptor.name!)
            || registry.isFileUsed(of.fileDescriptor, outFileDescriptors)
        );

        return outFiles;
    }


    // we support proto3-optionals, so we let protoc know
    protected getSupportedFeatures = () => [CodeGeneratorResponse_Feature.PROTO3_OPTIONAL];


}
