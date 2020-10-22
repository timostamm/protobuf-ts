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
import * as rpc from "@protobuf-ts/runtime-rpc";
import {Interpreter} from "./interpreter";
import {makeInternalOptions} from "./our-options";


export class ProtobuftsPlugin extends PluginBase<OutFile> {

    parameters = {
        // @formatter:off
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
        generate_dependencies: {
            description: "By default, only the PROTO_FILES passed as input to protoc are generated, \n" +
                         "not the files they import. Set this option to generate code for dependencies \n" +
                         "too.",
        },
        client_none: {
            description: "Do not generate service clients. \n" +
                         "Only applies to services that do *not* use the option `ts.client`. \n" +
                         "If you do not want service clients at all, use `force_client_none`.",
            excludes: ['client_call', 'client_promise', 'client_rx'],
        },
        client_call: {
            description: "Use *Call return types for service clients. \n" +
                         "Only applies to services that do *not* use the option `ts.client`. \n" +
                         "Since CALL is the default, this option has no effect.",
            excludes: ['client_none', 'client_promise', 'client_rx', 'force_client_none'],
        },
        client_promise: {
            description: "Use Promise return types for service clients. \n" +
                         "Only applies to services that do *not* use the option `ts.client`.",
            excludes: ['client_none', 'client_call', 'client_rx', 'force_client_none'],
        },
        client_rx: {
            description: "Use Observable return types from the `rxjs` package for service clients. \n" +
                         "Only applies to services that do *not* use the option `ts.client`." ,
            excludes: ['client_none', 'client_call', 'client_promise', 'force_client_none'],
        },
        force_client_none: {
            description: "Do not generate service clients, ignore service options.",
        },
        enable_angular_annotations: {
            description: "If set, the generated service client will have an angular @Injectable() \n" +
                         "annotation and the `RpcTransport` constructor argument is annotated with a \n" +
                         "@Inject annotation. For this feature, you will need the npm package \n" +
                         "'@protobuf-ts/runtime-angular'.",
            excludes: ['force_client_none'],
        },
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
        const params = this.parseParameters(this.parameters, request.parameter);

        let normalLongType = rt.LongType.BIGINT;
        if (params.long_type_string) {
            normalLongType = rt.LongType.STRING;
        } else if (params.long_type_number) {
            normalLongType = rt.LongType.NUMBER;
        }

        const options = {
                pluginCredit: `by protobuf-ts ${this.version}` + (request.parameter ? ` with parameters ${request.parameter}` : ''),
                emitAngularAnnotations: params.enable_angular_annotations,
                normalLongType,
            },
            registry = DescriptorRegistry.createFrom(request),
            symbols = new SymbolTable(),
            interpreter = new Interpreter(registry, makeInternalOptions(options)),
            getClientStyles = ProtobuftsPlugin.makeClientStyleGetter(params, interpreter, registry),
            getFileOptimizeMode = ProtobuftsPlugin.makeFileOptimizeGetter(params);


        let outFiles = registry.allFiles().map(fileDescriptor => {

            const
                fileName = fileDescriptor.name!.replace('.proto', '.ts'),
                fileOptimizeMode = getFileOptimizeMode(fileDescriptor),
                fileOptions = makeInternalOptions({...options, optimizeFor: fileOptimizeMode}),
                file = new OutFile(fileName, fileDescriptor, registry, symbols, interpreter, fileOptions);

            registry.visitTypes(fileDescriptor, descriptor => {
                // we are not interested in synthetic types like map entry messages
                if (registry.isSyntheticElement(descriptor)) return;

                // create the symbol name for the type
                let name = createLocalTypeName(descriptor, registry);

                // we need some special handling for services
                if (ServiceDescriptorProto.is(descriptor)) {

                    // service type
                    symbols.register(name, descriptor, file);

                    // client symbols
                    const styles = getClientStyles(descriptor);
                    for (let style of styles) {
                        const styleNameLc = rpc.ClientStyle[style].toLowerCase(),
                            styleNameUcFirst = styleNameLc[0].toUpperCase() + styleNameLc.substring(1),
                            localTypeName = createLocalTypeName(descriptor, registry),
                            clientName = styles.length > 1 ? `${localTypeName}${styleNameUcFirst}Client` : `${localTypeName}Client`,
                            clientInterfaceName = styles.length > 1 ? `I${localTypeName}${styleNameUcFirst}Client` : `I${localTypeName}Client`;
                        symbols.register(clientName, descriptor, file, `${styleNameLc}-client`);
                        symbols.register(clientInterfaceName, descriptor, file, `${styleNameLc}-client-interface`);
                    }

                } else {
                    symbols.register(name, descriptor, file);
                }
            });

            registry.visitTypes(fileDescriptor, descriptor => {
                // we are not interested in synthetic types like map entry messages
                if (registry.isSyntheticElement(descriptor)) return;

                if (DescriptorProto.is(descriptor)) {
                    file.generateMessageInterface(descriptor);
                }
                if (EnumDescriptorProto.is(descriptor)) {
                    file.generateEnum(descriptor);
                }
            });

            registry.visitTypes(fileDescriptor, descriptor => {
                // still not interested in synthetic types like map entry messages
                if (registry.isSyntheticElement(descriptor)) return;

                if (DescriptorProto.is(descriptor)) {
                    file.generateMessageType(descriptor);
                }
                if (ServiceDescriptorProto.is(descriptor)) {
                    file.generateServiceType(descriptor);
                    for (let style of getClientStyles(descriptor)) {
                        file.generateServiceClientInterface(descriptor, style);
                        file.generateServiceClientImplementation(descriptor, style);
                    }
                }
            });


            return file;
        });

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
    ): (descriptor: ServiceDescriptorProto) => rpc.ClientStyle[] {
        return (descriptor: ServiceDescriptorProto) => {

            // always check service options valid
            const service = interpreter.readOurServiceOptions(descriptor)["ts.client"];
            if (service.includes(rpc.ClientStyle.NONE) && service.some(s => s !== rpc.ClientStyle.NONE)) {
                let err = new Error(`You provided invalid options for ${stringFormat.formatQualifiedName(descriptor, true)}. If you set (ts.client) = NONE, you cannot set additional client styles.`);
                err.name = `PluginMessageError`;
                throw err;
            }

            // clients disabled altogether?
            if (params.force_client_none) {
                return [];
            }

            // look for service options
            if (service.length) {
                return service
                    .filter(s => s !== rpc.ClientStyle.NONE)
                    .filter((value, index, array) => array.indexOf(value) === index);
            }

            // fall back to normal style
            if (params.client_none)
                return [];
            else if (params.client_rx)
                return [rpc.ClientStyle.RX];
             else if (params.client_promise)
                return [rpc.ClientStyle.PROMISE];
             else
                return [rpc.ClientStyle.CALL];
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


}
