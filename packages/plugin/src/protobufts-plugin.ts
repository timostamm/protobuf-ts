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
import {LongType} from "@protobuf-ts/runtime";
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


    // TODO #8 add parameters: method_style_call, method_style_rxjs, method_style_promise; force_method_style_call, force_method_style_rxjs, force_method_style_promise



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
                normalLongType: params.long_type_string ? LongType.STRING : LongType.BIGINT
            },
            registry = DescriptorRegistry.createFrom(request),
            symbols = new SymbolTable(),
            interpreter = new Interpreter(registry, makeInternalOptions(options));


        let outFiles = registry.allFiles().map(fileDescriptor => {

            const file = new OutFile(fileDescriptor, registry, symbols, interpreter, makeInternalOptions({
                ...options,
                optimizeFor: ProtobuftsPlugin.getFileOptimizeMode(
                    fileDescriptor, params.force_optimize_code_size,
                    params.force_optimize_speed, params.optimize_code_size
                ),
            }));

            registry.visitTypes(fileDescriptor, descriptor => {
                // we are not interested in synthetic types like map entry messages
                if (registry.isSyntheticElement(descriptor)) return;

                // create the symbol name for the type
                let name = createLocalTypeName(descriptor, registry);

                // we need some special handling for services
                if (ServiceDescriptorProto.is(descriptor)) {
                    // we are generating clients only ATM. but we still need separate names.
                    // we intentionally reserve the names for services even if the user opted
                    // out of service client generation to make the generated code more stable.
                    symbols.register(name + 'Client', descriptor, file, 'client-implementation');
                    symbols.register('I' + name + 'Client', descriptor, file, 'client-interface');
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
                if (ServiceDescriptorProto.is(descriptor) && !params.disable_service_client) {
                    file.generateServiceClientInterface(descriptor);
                }
            });

            registry.visitTypes(fileDescriptor, descriptor => {
                // still not interested in synthetic types like map entry messages
                if (registry.isSyntheticElement(descriptor)) return;

                if (DescriptorProto.is(descriptor)) {
                    file.generateMessageType(descriptor);
                }
                if (ServiceDescriptorProto.is(descriptor) && !params.disable_service_client) {
                    file.generateServiceClientImplementation(descriptor);
                }
            });

            return file;
        });

        // plugins should only return files requested to generate
        // unless our option "generate_dependencies" is set
        return params.generate_dependencies
            ? outFiles
            : outFiles.filter(file => request.fileToGenerate.includes(file.fileDescriptor.name!));
    }


    // we support proto3-optionals, so we let protoc know
    protected getSupportedFeatures = () => [CodeGeneratorResponse_Feature.PROTO3_OPTIONAL];


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
