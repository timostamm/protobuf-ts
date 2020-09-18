import {
    CodeGeneratorRequest,
    CodeGeneratorResponse_Feature,
    DescriptorProto,
    DescriptorRegistry,
    EnumDescriptorProto,
    FileDescriptorProto,
    FileOptions_OptimizeMode as OptimizeMode,
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
            description: "Sets jstype = JS_STRING for all fields where no option `jstype` was \n"+
                         "specified. The default behaviour is to use native `bigint`.",
            excludes: [],
        },
        disable_service_client: {
            description: "Disables generation of service clients. By default, we generate a client \n" +
                         "(an interface and an implementation class) for each service.",
            excludes: ['enable_angular_annotations'],
        },
        generate_dependencies: {
            description: "By default, only the PROTO_FILES passed as input to protoc are generated, \n" +
                         "not the files they import. Set this option to generate code for dependencies \n" +
                         "too.",
        },
        enable_angular_annotations: {
            description: "If set, the generated service client will have an angular @Injectable() \n" +
                         "annotation and the `RpcTransport` constructor argument is annotated with a \n" +
                         "@Inject annotation. For this feature, you will need the npm package \n" +
                         "'@protobuf-ts/runtime-angular'.",
            excludes: ['disable_service_client'],
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


    // TODO #8 parameters for client style - allow multiple times as well?
    //
    // i.E: "client_style_promise"
    // Generate service clients with Promise return types.
    // Ignores services with the option (ts.client_style).
    //
    // And: "force_client_style_promise"
    // Generate service clients with Promise return types, even if the service option (ts.client_style) is set.


    // TODO #8 update "disable_service_client"


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
                normalLongType: params.long_type_string ? rt.LongType.STRING : rt.LongType.BIGINT
            },
            normalClientStyles = [rpc.ClientMethodStyle.CALL],
            registry = DescriptorRegistry.createFrom(request),
            symbols = new SymbolTable(),
            interpreter = new Interpreter(registry, makeInternalOptions(options));

        let outFiles = registry.allFiles().map(fileDescriptor => {

            const
                fileName = fileDescriptor.name!.replace('.proto', '.ts'),
                fileOptimizeMode = ProtobuftsPlugin.getFileOptimizeMode(fileDescriptor, params.force_optimize_code_size, params.force_optimize_speed, params.optimize_code_size),
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
                    const styles = ProtobuftsPlugin.getClientStyles(descriptor, normalClientStyles, [], interpreter);
                    for (let style of styles) {
                        const styleNameLc = rpc.ClientMethodStyle[style].toLowerCase(),
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
                // if (ServiceDescriptorProto.is(descriptor) && !params.disable_service_client) {
                //     file.generateServiceClientInterface(descriptor);
                // }
            });

            registry.visitTypes(fileDescriptor, descriptor => {
                // still not interested in synthetic types like map entry messages
                if (registry.isSyntheticElement(descriptor)) return;

                if (DescriptorProto.is(descriptor)) {
                    file.generateMessageType(descriptor);
                }
                if (ServiceDescriptorProto.is(descriptor)) {
                    file.generateServiceType(descriptor);
                    for (let style of ProtobuftsPlugin.getClientStyles(descriptor, normalClientStyles, [], interpreter)) {
                        file.generateServiceClientInterface(descriptor, style);
                        file.generateServiceClientImplementation(descriptor, style);
                    }
                }
                // if (ServiceDescriptorProto.is(descriptor) && !params.disable_service_client) {
                //     file.generateServiceClientImplementation(descriptor);
                // }
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


    private static getClientStyles(descriptor: ServiceDescriptorProto, normalStyles: rpc.ClientMethodStyle[], forcedStyles: rpc.ClientMethodStyle[], interpreter: Interpreter): rpc.ClientMethodStyle[] {
        const styles = [...forcedStyles];
        const service = interpreter.readOurServiceOptions(descriptor)["ts.client_style"];
        if (service.length > 0) {
            styles.push(...service);
        } else {
            styles.push(...normalStyles);
        }
        return styles;
    }


    private static getFileOptimizeMode(file: FileDescriptorProto, forceCodeSize: boolean, forceSpeed: boolean, speed: boolean): OptimizeMode {
        if (forceCodeSize)
            return OptimizeMode.CODE_SIZE;
        if (forceSpeed)
            return OptimizeMode.SPEED;
        if (file.options?.optimizeFor)
            return file.options.optimizeFor;
        if (speed)
            return OptimizeMode.CODE_SIZE;
        return OptimizeMode.SPEED;
    }


}
