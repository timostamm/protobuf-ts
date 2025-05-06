/**
 * Custom file options interpreted by @protobuf-ts/plugin
 */
import * as rt from "@protobuf-ts/runtime";
import {
    FileDescriptorProto,
    FileOptions,
    FileOptions_OptimizeMode as OptimizeMode,
    IStringFormat,
    MethodOptions,
    ServiceDescriptorProto,
    ServiceOptions
} from "@protobuf-ts/plugin-framework";
import {Interpreter} from "./interpreter";
import * as ts from "typescript";


/**
 * Custom file options interpreted by @protobuf-ts/plugin
 * The extensions are declared in protobuf-ts.proto
 */
export interface OurFileOptions {

    /**
     * Exclude field or method options from being emitted in reflection data.
     *
     * For example, to stop the data of the "google.api.http" method option
     * from being exported in the reflection information, set the following
     * file option:
     *
     * ```proto
     * option (ts.exclude_options) = "google.api.http";
     * ```
     *
     * The option can be set multiple times.
     * `*` serves as a wildcard and will greedily match anything.
     */
    readonly ["ts.exclude_options"]: readonly string[];
}


/**
 * Custom service options interpreted by @protobuf-ts/plugin
 */
export interface OurServiceOptions {

    /**
     * Generate a client for this service with this style.
     * Can be set multiple times to generate several styles.
     */
    readonly ["ts.client"]: ClientStyle[];

    /**
     * Generate a server for this service with this style.
     * Can be set multiple times to generate several styles.
     */
    readonly ["ts.server"]: ServerStyle[];
}


/**
 * Read the custom file options declared in protobuf-ts.proto
 */
export function readOurFileOptions(file: FileDescriptorProto): OurFileOptions {
    return read<OurFileOptions>(file.options, emptyFileOptions, OurFileOptions);
}

/**
 * Read the custom service options declared in protobuf-ts.proto
 */
export function readOurServiceOptions(service: ServiceDescriptorProto): OurServiceOptions {
    return read<OurServiceOptions>(service.options, emptyServiceOptions, OurServiceOptions);
}


function read<T extends object>(options: FileOptions | MethodOptions | ServiceOptions | undefined, defaults: T, type: rt.IMessageType<T>): T {
    if (!options) {
        return defaults;
    }
    let unknownFields = rt.UnknownFieldHandler.list(options);
    if (!unknownFields.length) {
        return defaults;
    }
    // concat all unknown field data
    let unknownWriter = new rt.BinaryWriter();
    for (let {no, wireType, data} of unknownFields)
        unknownWriter.tag(no, wireType).raw(data);
    let unknownBytes = unknownWriter.finish();
    return type.fromBinary(unknownBytes, {readUnknownField: false});
}


const OurFileOptions = new rt.MessageType<OurFileOptions>("$synthetic.OurFileOptions", [
    {
        no: 777701,
        name: "ts.exclude_options", localName: "ts.exclude_options", jsonName: "ts.exclude_options",
        kind: "scalar",
        T: rt.ScalarType.STRING,
        repeat: rt.RepeatType.PACKED
    }
]);


const OurServiceOptions = new rt.MessageType<OurServiceOptions>("$synthetic.OurServiceOptions", [
    {
        no: 777701,
        name: "ts.client", localName: "ts.client", jsonName: "ts.client",
        kind: "enum",
        T: () => ["ts.ClientStyle", ClientStyle],
        repeat: rt.RepeatType.UNPACKED,
    },
    {
        no: 777702,
        name: "ts.server", localName: "ts.server", jsonName: "ts.server",
        kind: "enum",
        T: () => ["ts.ServerStyle", ServerStyle],
        repeat: rt.RepeatType.UNPACKED,
    }

]);


/**
 * The available client styles from @protobuf-ts/plugin
 * The extensions are declared in protobuf-ts.proto
 */
export enum ClientStyle {

    /**
     * Do not emit a client for this service.
     */
    NO_CLIENT = 0,

    /**
     * Use the call implementations of @protobuf-ts/runtime-rpc.
     * This is the default behaviour.
     */
    GENERIC_CLIENT = 1,

    /**
     * Generate a client using @grpc/grpc-js (major version 1).
     */
    GRPC1_CLIENT = 4
}


/**
 * The available server styles from @protobuf-ts/plugin
 * The extensions are declared in protobuf-ts.proto
 */
export enum ServerStyle {

    /**
     * Do not emit a server for this service.
     * This is the default behaviour.
     */
    NO_SERVER = 0,

    /**
     * Generate a generic server interface.
     * Adapters be used to serve the service, for example @protobuf-ts/grpc-backend
     * for gRPC.
     */
    GENERIC_SERVER = 1,

    /**
     * Generate a server for @grpc/grpc-js (major version 1).
     */
    GRPC1_SERVER = 2,
}


const emptyFileOptions = OurFileOptions.create();
const emptyServiceOptions = OurServiceOptions.create();


/**
 * Internal settings for the file generation.
 */
export interface InternalOptions {
    readonly generateDependencies: boolean;
    readonly pluginCredit?: string;
    readonly normalLongType: rt.LongType,
    readonly normalOptimizeMode: OptimizeMode,
    readonly forcedOptimizeMode: OptimizeMode | undefined,
    readonly normalServerStyle: ServerStyle,
    readonly forcedServerStyle: ServerStyle | undefined,
    readonly normalClientStyle: ClientStyle,
    readonly forcedClientStyle: ClientStyle | undefined,
    readonly synthesizeEnumZeroValue: string | false; // create a "synthetic" enum value with this string as name if no 0 value is present
    readonly oneofKindDiscriminator: string;
    readonly runtimeRpcImportPath: string;
    readonly runtimeImportPath: string;
    readonly forceExcludeAllOptions: boolean;
    readonly keepEnumPrefix: boolean;
    readonly useProtoFieldName: boolean;
    readonly tsNoCheck: boolean;
    readonly esLintDisable: boolean;
    readonly transpileTarget: ts.ScriptTarget | undefined,
    readonly transpileModule: ts.ModuleKind,
    readonly forceDisableServices: boolean;
    readonly addPbSuffix: boolean;
    readonly enable_import_extensions: boolean;
}

export function makeInternalOptions(
    params?: {
        generate_dependencies: boolean,
        long_type_string: boolean,
        long_type_number: boolean,
        force_exclude_all_options: boolean,
        keep_enum_prefix: boolean,
        use_proto_field_name: boolean,
        ts_nocheck: boolean,
        eslint_disable: boolean,
        force_optimize_code_size: boolean,
        force_optimize_speed: boolean,
        optimize_code_size: boolean,
        force_server_none: boolean,
        server_none: boolean,
        server_generic: boolean
        server_grpc1: boolean
        force_client_none: boolean,
        client_generic: boolean,
        client_none: boolean,
        client_grpc1: boolean,
        add_pb_suffix: boolean,
        force_disable_services: boolean;
        output_typescript: boolean,
        output_javascript: boolean,
        output_javascript_es2015: boolean,
        output_javascript_es2016: boolean,
        output_javascript_es2017: boolean,
        output_javascript_es2018: boolean,
        output_javascript_es2019: boolean,
        output_javascript_es2020: boolean,
        output_legacy_commonjs: boolean,
        enable_import_extensions: boolean,
    },
    pluginCredit?: string,
): InternalOptions {
    type Writeable<T> = { -readonly [P in keyof T]: T[P] };
    const o = Object.assign<Partial<InternalOptions>, InternalOptions>(
        {},
        {
            generateDependencies: false,
            normalLongType: rt.LongType.BIGINT,
            normalOptimizeMode: OptimizeMode.SPEED,
            forcedOptimizeMode: undefined,
            normalClientStyle: ClientStyle.GENERIC_CLIENT,
            forcedClientStyle: undefined,
            normalServerStyle: ServerStyle.NO_SERVER,
            forcedServerStyle: undefined,
            synthesizeEnumZeroValue: 'UNSPECIFIED$',
            oneofKindDiscriminator: 'oneofKind',
            runtimeRpcImportPath: '@protobuf-ts/runtime-rpc',
            runtimeImportPath: '@protobuf-ts/runtime',
            forceExcludeAllOptions: false,
            keepEnumPrefix: false,
            useProtoFieldName: false,
            tsNoCheck: false,
            esLintDisable: false,
            transpileTarget: undefined,
            transpileModule: ts.ModuleKind.ES2015,
            forceDisableServices: false,
            addPbSuffix: false,
            enable_import_extensions: true,
        },
    ) as Writeable<InternalOptions>;
    if (pluginCredit) {
        o.pluginCredit = pluginCredit;
    }
    if (params?.generate_dependencies) {
        o.generateDependencies = true;
    }
    if (params?.force_exclude_all_options) {
        o.forceExcludeAllOptions = true;
    }
    if (params?.keep_enum_prefix) {
        o.keepEnumPrefix = true;
    }
    if (params?.use_proto_field_name) {
        o.useProtoFieldName = true;
    }
    if (params?.ts_nocheck) {
        o.tsNoCheck = true;
    }
    if (params?.eslint_disable) {
        o.esLintDisable = true;
    }
    if (params?.long_type_string) {
        o.normalLongType = rt.LongType.STRING;
    }
    if (params?.long_type_number) {
        o.normalLongType = rt.LongType.NUMBER;
    }
    if (params?.optimize_code_size) {
        o.normalOptimizeMode = OptimizeMode.CODE_SIZE;
    }
    if (params?.force_optimize_speed) {
        o.forcedOptimizeMode = OptimizeMode.SPEED;
    }
    if (params?.force_optimize_code_size) {
        o.forcedOptimizeMode = OptimizeMode.CODE_SIZE;
    }
    if (params?.client_none) {
        o.normalClientStyle = ClientStyle.NO_CLIENT;
    }
    if (params?.client_grpc1) {
        o.normalClientStyle = ClientStyle.GRPC1_CLIENT;
    }
    if (params?.force_client_none) {
        o.forcedClientStyle = ClientStyle.NO_CLIENT;
    }
    if (params?.server_generic) {
        o.normalServerStyle = ServerStyle.GENERIC_SERVER;
    }
    if (params?.server_grpc1) {
        o.normalServerStyle = ServerStyle.GRPC1_SERVER;
    }
    if (params?.force_server_none) {
        o.forcedServerStyle = ServerStyle.NO_SERVER;
    }
    if (params?.add_pb_suffix) {
        o.addPbSuffix = true;
    }
    if (params?.force_disable_services) {
      o.forceDisableServices = true;
    }
    if (params?.output_javascript) {
        o.transpileTarget = ts.ScriptTarget.ES2020;
    }
    if (params?.output_javascript_es2015) {
        o.transpileTarget = ts.ScriptTarget.ES2015;
    }
    if (params?.output_javascript_es2016) {
        o.transpileTarget = ts.ScriptTarget.ES2016;
    }
    if (params?.output_javascript_es2017) {
        o.transpileTarget = ts.ScriptTarget.ES2017;
    }
    if (params?.output_javascript_es2018) {
        o.transpileTarget = ts.ScriptTarget.ES2018;
    }
    if (params?.output_javascript_es2019) {
        o.transpileTarget = ts.ScriptTarget.ES2019;
    }
    if (params?.output_javascript_es2020) {
        o.transpileTarget = ts.ScriptTarget.ES2020;
    }
    if (params?.output_legacy_commonjs) {
        o.transpileModule = ts.ModuleKind.CommonJS;
    }
    return o;
}


export class OptionResolver {


    constructor(
        private readonly interpreter: Interpreter,
        private readonly stringFormat: IStringFormat,
        private readonly options: InternalOptions,
    ) {
    }


    getOptimizeMode(file: FileDescriptorProto): OptimizeMode {
        if (this.options.forcedOptimizeMode !== undefined) {
            return this.options.forcedOptimizeMode;
        }
        if (file.options?.optimizeFor !== undefined) {
            return file.options.optimizeFor;
        }
        return this.options.normalOptimizeMode;
    }


    getClientStyles(descriptor: ServiceDescriptorProto): ClientStyle[] {
        const opt = this.interpreter.readOurServiceOptions(descriptor)["ts.client"];

        // always check service options valid
        if (opt.includes(ClientStyle.NO_CLIENT) && opt.some(s => s !== ClientStyle.NO_CLIENT)) {
            let err = new Error(`You provided invalid options for ${this.stringFormat.formatQualifiedName(descriptor, true)}. If you set (ts.client) = NO_CLIENT, you cannot set additional client styles.`);
            err.name = `PluginMessageError`;
            throw err;
        }

        if (this.options.forcedClientStyle !== undefined) {
            return [this.options.forcedClientStyle];
        }

        // look for service options
        if (opt.length) {
            return opt
                .filter(s => s !== ClientStyle.NO_CLIENT)
                .filter((value, index, array) => array.indexOf(value) === index);
        }

        // fall back to normal style set by option
        return [this.options.normalClientStyle];
    }


    getServerStyles(descriptor: ServiceDescriptorProto): ServerStyle[] {
        const opt = this.interpreter.readOurServiceOptions(descriptor)["ts.server"];

        // always check service options valid
        if (opt.includes(ServerStyle.NO_SERVER) && opt.some(s => s !== ServerStyle.NO_SERVER)) {
            let err = new Error(`You provided invalid options for ${this.stringFormat.formatQualifiedName(descriptor, true)}. If you set (ts.server) = NO_SERVER, you cannot set additional server styles.`);
            err.name = `PluginMessageError`;
            throw err;
        }

        if (this.options.forcedServerStyle !== undefined) {
            return [this.options.forcedServerStyle];
        }

        // look for service options
        if (opt.length) {
            return opt
                .filter(s => s !== ServerStyle.NO_SERVER)
                .filter((value, index, array) => array.indexOf(value) === index);
        }

        // fall back to normal style set by option
        return [this.options.normalServerStyle];
    }

}
