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
import {ServiceClientGeneratorCall} from "./code-gen/service-client-generator-call";
import {ServiceClientGeneratorPromise} from "./code-gen/service-client-generator-promise";
import {ServiceClientGeneratorRxjs} from "./code-gen/service-client-generator-rxjs";
import {FileTable} from "./file-table";
import {ServiceServerGeneratorGeneric} from "./code-gen/service-server-generator-generic";


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

        // client
        client_none: {
            description: "Do not generate rpc clients. \n" +
                         "Only applies to services that do *not* use the option `ts.client`. \n" +
                         "If you do not want rpc clients at all, use `force_client_none`.",
            excludes: ['client_call', 'client_promise', 'client_rx'],
        },
        client_call: {
            description: "Use *Call return types for rpc clients. \n" +
                         "Only applies to services that do *not* use the option `ts.client`. \n" +
                         "Since CALL is the default, this option has no effect.",
            excludes: ['client_none', 'client_promise', 'client_rx', 'force_client_none'],
        },
        client_promise: {
            description: "Use Promise return types for rpc clients. \n" +
                         "Only applies to services that do *not* use the option `ts.client`.",
            excludes: ['client_none', 'client_call', 'client_rx', 'force_client_none'],
        },
        client_rx: {
            description: "Use Observable return types from the `rxjs` package for rpc clients. \n" +
                         "Only applies to services that do *not* use the option `ts.client`." ,
            excludes: ['client_none', 'client_call', 'client_promise', 'force_client_none'],
        },
        force_client_none: {
            description: "Do not generate rpc clients, ignore options in proto files.",
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
            excludes: ['server_grpc'],
        },
        server_generic: {
            description: "Generate a generic server interface. Adapters be used to serve the service, \n" +
                         "for example @protobuf-ts/grpc-backend for gRPC. \n" +
                         "Only applies to services that do *not* use the option `ts.server`.",
            excludes: ['server_none', 'force_server_none'],
        },
        server_grpc: {
            description: "Generate a server interface and definition for use with @grpc/grpc-js. \n" +
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
            params = this.parseParameters(this.parameters, request.parameter),
            options = makeInternalOptions({
                pluginCredit: `by protobuf-ts ${this.version}` + (request.parameter ? ` with parameters ${request.parameter}` : ''),
                emitAngularAnnotations: params.enable_angular_annotations,
                normalLongType: params.long_type_string ? rt.LongType.STRING : params.long_type_number ? rt.LongType.NUMBER : rt.LongType.BIGINT,
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
            genClientCall = new ServiceClientGeneratorCall(symbols, registry, imports, comments, interpreter, options),
            genClientPromise = new ServiceClientGeneratorPromise(symbols, registry, imports, comments, interpreter, options),
            genClientRx = new ServiceClientGeneratorRxjs(symbols, registry, imports, comments, interpreter, options)
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
            fileTable.register(base + '.grpc-server.ts', fileDescriptor, 'grpc-server');
            fileTable.register(base + '.client.ts', fileDescriptor, 'client');
            fileTable.register(base + '.rx-client.ts', fileDescriptor, 'rx-client');
            fileTable.register(base + '.promise-client.ts', fileDescriptor, 'promise-client');
        }


        for (let fileDescriptor of registry.allFiles()) {
            const
                outMain = new OutFile(fileTable.get(fileDescriptor).name, fileDescriptor, registry, options),
                outServerGeneric = new OutFile(fileTable.get(fileDescriptor, 'generic-server').name, fileDescriptor, registry, options),
                outServerGrpc = new OutFile(fileTable.get(fileDescriptor, 'grpc-server').name, fileDescriptor, registry, options),
                outClientCall = new OutFile(fileTable.get(fileDescriptor, 'client').name, fileDescriptor, registry, options),
                outClientRx = new OutFile(fileTable.get(fileDescriptor, 'rx-client').name, fileDescriptor, registry, options),
                outClientPromise = new OutFile(fileTable.get(fileDescriptor, 'promise-client').name, fileDescriptor, registry, options);
            outFiles.push(outMain, outServerGeneric, outServerGrpc, outClientCall, outClientRx, outClientPromise);

            registry.visitTypes(fileDescriptor, descriptor => {
                // we are not interested in synthetic types like map entry messages
                if (registry.isSyntheticElement(descriptor)) return;

                // register all symbols, regardless whether they are going to be used - we want stable behaviour
                symbols.register(createLocalTypeName(descriptor, registry), descriptor, outMain);
                if (ServiceDescriptorProto.is(descriptor)) {
                    genClientCall.registerSymbols(outClientCall, descriptor);
                    genClientRx.registerSymbols(outClientRx, descriptor);
                    genClientPromise.registerSymbols(outClientPromise, descriptor);
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
                    if (clientStyles.includes(ClientStyle.CALL_CLIENT)) {
                        genClientCall.generateInterface(outClientCall, descriptor);
                        genClientCall.generateImplementationClass(outClientCall, descriptor);
                    }
                    if (clientStyles.includes(ClientStyle.RX_CLIENT)) {
                        genClientRx.generateInterface(outClientRx, descriptor);
                        genClientRx.generateImplementationClass(outClientRx, descriptor);
                    }
                    if (clientStyles.includes(ClientStyle.PROMISE_CLIENT)) {
                        genClientPromise.generateInterface(outClientPromise, descriptor);
                        genClientPromise.generateImplementationClass(outClientPromise, descriptor);
                    }

                    // grpc server
                    const serverStyles = optionResolver.getServerStyles(descriptor);
                    if (serverStyles.includes(ServerStyle.GENERIC_SERVER)) {
                        genServerGeneric.generateInterface(outServerGeneric, descriptor);
                    }
                    if (serverStyles.includes(ServerStyle.GRPC_SERVER)) {
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
