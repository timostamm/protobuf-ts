import {
    CodeGeneratorRequest,
    CodeGeneratorResponse_Feature,
    DescriptorProto,
    DescriptorRegistry,
    EnumDescriptorProto,
    FileDescriptorProto,
    FileOptions_OptimizeMode as OptimizeMode,
    IStringFormat,
    PluginBase,
    ServiceDescriptorProto,
    SymbolTable
} from "@protobuf-ts/plugin-framework";
import {OutFile} from "./out-file";
import {createLocalTypeName} from "./code-gen/local-type-name";
import * as rt from "@protobuf-ts/runtime";
import {Interpreter} from "./interpreter";
import {ClientStyle, makeInternalOptions, ServerStyle} from "./our-options";


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
            options = {
                pluginCredit: `by protobuf-ts ${this.version}` + (request.parameter ? ` with parameters ${request.parameter}` : ''),
                emitAngularAnnotations: params.enable_angular_annotations,
                normalLongType: ProtobuftsPlugin.determineNormalLongType(params),
            },
            registry = DescriptorRegistry.createFrom(request),
            symbols = new SymbolTable(),
            interpreter = new Interpreter(registry, makeInternalOptions(options)),
            getClientStyles = ProtobuftsPlugin.makeClientStyleGetter(params, interpreter, registry),
            getServerStyles = ProtobuftsPlugin.makeServerStyleGetter(params, interpreter, registry),
            getFileOptimizeMode = ProtobuftsPlugin.makeFileOptimizeGetter(params);

        let outFiles: OutFile[] = [];

        for (let fileDescriptor of registry.allFiles()) {
            const
                outBasename = fileDescriptor.name!.replace('.proto', ''),
                outOptions = makeInternalOptions({...options, optimizeFor: getFileOptimizeMode(fileDescriptor)}),

                // TODO #55 prevent file name clashes
                outMain = new OutFile(outBasename + '.ts', fileDescriptor, registry, symbols, interpreter, outOptions),
                outServerGrpc = new OutFile(outBasename + '.grpc-server.ts', fileDescriptor, registry, symbols, interpreter, outOptions),
                outClientCall = new OutFile(outBasename + '.client.ts', fileDescriptor, registry, symbols, interpreter, outOptions),
                outClientRx = new OutFile(outBasename + '.rx-client.ts', fileDescriptor, registry, symbols, interpreter, outOptions),
                outClientPromise = new OutFile(outBasename + '.promise-client.ts', fileDescriptor, registry, symbols, interpreter, outOptions)
            ;

            outFiles.push(outMain, outServerGrpc, outClientCall, outClientRx, outClientPromise);

            registry.visitTypes(fileDescriptor, descriptor => {
                // we are not interested in synthetic types like map entry messages
                if (registry.isSyntheticElement(descriptor)) return;

                // create the symbol name for the type
                let name = createLocalTypeName(descriptor, registry);

                // we need some special handling for services
                if (ServiceDescriptorProto.is(descriptor)) {

                    // service type
                    symbols.register(name, descriptor, outMain);

                    // client symbols
                    const clientStyles = getClientStyles(descriptor);
                    if (clientStyles.includes(ClientStyle.CALL_CLIENT)) {
                        symbols.register(`${name}Client`, descriptor, outClientCall, `call-client`);
                        symbols.register(`I${name}Client`, descriptor, outClientCall, `call-client-interface`);
                    }
                    if (clientStyles.includes(ClientStyle.RX_CLIENT)) {
                        symbols.register(`${name}Client`, descriptor, outClientRx, `rx-client`);
                        symbols.register(`I${name}Client`, descriptor, outClientRx, `rx-client-interface`);
                    }
                    if (clientStyles.includes(ClientStyle.PROMISE_CLIENT)) {
                        symbols.register(`${name}Client`, descriptor, outClientPromise, `promise-client`);
                        symbols.register(`I${name}Client`, descriptor, outClientPromise, `promise-client-interface`);
                    }

                    // server symbols
                    if (getServerStyles(descriptor).includes(ServerStyle.GRPC_SERVER)) {
                        symbols.register(`I${name}`, descriptor, outServerGrpc, `grpc-server-interface`);
                        symbols.register(`${name[0].toLowerCase()}${name.substring(1)}Definition`, descriptor, outServerGrpc, `grpc-server-definition`);
                    }

                } else {
                    symbols.register(name, descriptor, outMain);
                }
            });

            registry.visitTypes(fileDescriptor, descriptor => {
                // we are not interested in synthetic types like map entry messages
                if (registry.isSyntheticElement(descriptor)) return;

                if (DescriptorProto.is(descriptor)) {
                    outMain.generateMessageInterface(descriptor);
                }
                if (EnumDescriptorProto.is(descriptor)) {
                    outMain.generateEnum(descriptor);
                }
            });

            registry.visitTypes(fileDescriptor, descriptor => {
                // still not interested in synthetic types like map entry messages
                if (registry.isSyntheticElement(descriptor)) return;

                if (DescriptorProto.is(descriptor)) {
                    outMain.generateMessageType(descriptor);
                }
                if (ServiceDescriptorProto.is(descriptor)) {

                    // service type
                    outMain.generateServiceType(descriptor);

                    // clients
                    const clientStyles = getClientStyles(descriptor);
                    if (clientStyles.includes(ClientStyle.CALL_CLIENT)) {
                        outClientCall.generateServiceClientInterface(descriptor, ClientStyle.CALL_CLIENT);
                        outClientCall.generateServiceClientImplementation(descriptor, ClientStyle.CALL_CLIENT);
                    }
                    if (clientStyles.includes(ClientStyle.RX_CLIENT)) {
                        outClientRx.generateServiceClientInterface(descriptor, ClientStyle.RX_CLIENT);
                        outClientRx.generateServiceClientImplementation(descriptor, ClientStyle.RX_CLIENT);
                    }
                    if (clientStyles.includes(ClientStyle.PROMISE_CLIENT)) {
                        outClientPromise.generateServiceClientInterface(descriptor, ClientStyle.PROMISE_CLIENT);
                        outClientPromise.generateServiceClientImplementation(descriptor, ClientStyle.PROMISE_CLIENT);
                    }

                    // grpc server
                    if (getServerStyles(descriptor).includes(ServerStyle.GRPC_SERVER)) {
                        outServerGrpc.generateServerGrpcInterface(descriptor);
                        outServerGrpc.generateServerGrpcDefinition(descriptor);
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


    private static makeClientStyleGetter(
        params: {
            force_client_none: boolean,
            client_none: boolean,
            client_rx: boolean,
            client_promise: boolean
        },
        interpreter: Interpreter,
        stringFormat: IStringFormat
    ): (descriptor: ServiceDescriptorProto) => ClientStyle[] {
        return (descriptor: ServiceDescriptorProto) => {

            const opt = interpreter.readOurServiceOptions(descriptor)["ts.client"];

            // always check service options valid
            if (opt.includes(ClientStyle.NO_CLIENT) && opt.some(s => s !== ClientStyle.NO_CLIENT)) {
                let err = new Error(`You provided invalid options for ${stringFormat.formatQualifiedName(descriptor, true)}. If you set (ts.client) = NONE, you cannot set additional client styles.`);
                err.name = `PluginMessageError`;
                throw err;
            }

            // clients disabled altogether?
            if (params.force_client_none) {
                return [];
            }

            // look for service options
            if (opt.length) {
                return opt
                    .filter(s => s !== ClientStyle.NO_CLIENT)
                    .filter((value, index, array) => array.indexOf(value) === index);
            }

            // fall back to normal style set by parameter
            if (params.client_none)
                return [];
            else if (params.client_rx)
                return [ClientStyle.RX_CLIENT];
            else if (params.client_promise)
                return [ClientStyle.PROMISE_CLIENT];
            else
                return [ClientStyle.CALL_CLIENT];
        };
    }


    private static makeServerStyleGetter(
        params: {
            force_server_none: boolean,
            server_none: boolean,
            server_grpc: boolean
        },
        interpreter: Interpreter,
        stringFormat: IStringFormat
    ): (descriptor: ServiceDescriptorProto) => ServerStyle[] {
        return (descriptor: ServiceDescriptorProto) => {

            const opt = interpreter.readOurServiceOptions(descriptor)["ts.server"];

            // always check service options valid
            if (opt.includes(ServerStyle.NO_SERVER) && opt.some(s => s !== ServerStyle.NO_SERVER)) {
                let err = new Error(`You provided invalid options for ${stringFormat.formatQualifiedName(descriptor, true)}. If you set (ts.server) = NONE, you cannot set additional server styles.`);
                err.name = `PluginMessageError`;
                throw err;
            }

            // clients disabled altogether?
            if (params.force_server_none) {
                return [];
            }

            // look for service options
            if (opt.length) {
                return opt
                    .filter(s => s !== ServerStyle.NO_SERVER)
                    .filter((value, index, array) => array.indexOf(value) === index);
            }

            // fall back to normal style set by parameter
            if (params.server_grpc) {
                return [ServerStyle.GRPC_SERVER];
            }
            return [];
        };
    }


    private static makeFileOptimizeGetter(
        params: {
            force_optimize_code_size: boolean,
            force_optimize_speed: boolean,
            optimize_code_size: boolean,
        }
    ): (file: FileDescriptorProto) => OptimizeMode {
        return (file: FileDescriptorProto) => {
            if (params.force_optimize_code_size)
                return OptimizeMode.CODE_SIZE;
            if (params.force_optimize_speed)
                return OptimizeMode.SPEED;
            if (file.options?.optimizeFor)
                return file.options.optimizeFor;
            if (params.optimize_code_size)
                return OptimizeMode.CODE_SIZE;
            return OptimizeMode.SPEED;
        };
    }

    private static determineNormalLongType(
        params: {
            long_type_string: boolean,
            long_type_number: boolean,
            long_type_bigint: boolean,
        }
    ): rt.LongType {
        if (params.long_type_string) {
            return rt.LongType.STRING;
        }
        if (params.long_type_number) {
            return rt.LongType.NUMBER;
        }
        return rt.LongType.BIGINT;
    }


}
