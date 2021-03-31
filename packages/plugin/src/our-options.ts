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
    readonly pluginCredit?: string;
    readonly normalLongType: rt.LongType,
    readonly emitAngularAnnotations: boolean;
    // create a "synthetic" enum value with this string as name if no 0 value is present
    readonly synthesizeEnumZeroValue: string | false;
    readonly oneofKindDiscriminator: string;
    readonly angularCoreImportPath: string;
    readonly runtimeAngularImportPath: string;
    readonly runtimeRpcImportPath: string;
    readonly runtimeImportPath: string;
}

export function makeInternalOptions(options?: Partial<InternalOptions>): InternalOptions {
    let o = options as any, i = defaultOptions as any;
    if (!o) return i;
    for (let k of Object.keys(defaultOptions)) {
        if (o[k] === undefined) {
            o[k] = i[k];
        }
    }
    return o as InternalOptions;
}

const defaultOptions: InternalOptions = {
    normalLongType: rt.LongType.BIGINT,
    emitAngularAnnotations: false,
    synthesizeEnumZeroValue: 'UNSPECIFIED$',
    oneofKindDiscriminator: 'oneofKind',
    runtimeAngularImportPath: '@protobuf-ts/runtime-angular',
    runtimeRpcImportPath: '@protobuf-ts/runtime-rpc',
    angularCoreImportPath: '@angular/core',
    runtimeImportPath: '@protobuf-ts/runtime',
} as const;


export class OptionResolver {


    constructor(
        private readonly interpreter: Interpreter,
        private readonly stringFormat: IStringFormat,
        private readonly params: {
            force_optimize_code_size: boolean,
            force_optimize_speed: boolean,
            optimize_code_size: boolean,
            force_server_none: boolean,
            server_none: boolean,
            server_generic: boolean
            server_grpc1: boolean
            force_client_none: boolean,
            client_none: boolean,
            client_grpc1: boolean,
        }
    ) {
    }


    getOptimizeMode(file: FileDescriptorProto): OptimizeMode {
        if (this.params.force_optimize_code_size)
            return OptimizeMode.CODE_SIZE;
        if (this.params.force_optimize_speed)
            return OptimizeMode.SPEED;
        if (file.options?.optimizeFor)
            return file.options.optimizeFor;
        if (this.params.optimize_code_size)
            return OptimizeMode.CODE_SIZE;
        return OptimizeMode.SPEED;
    }


    getClientStyles(descriptor: ServiceDescriptorProto): ClientStyle[] {
        const opt = this.interpreter.readOurServiceOptions(descriptor)["ts.client"];

        // always check service options valid
        if (opt.includes(ClientStyle.NO_CLIENT) && opt.some(s => s !== ClientStyle.NO_CLIENT)) {
            let err = new Error(`You provided invalid options for ${this.stringFormat.formatQualifiedName(descriptor, true)}. If you set (ts.client) = NO_CLIENT, you cannot set additional client styles.`);
            err.name = `PluginMessageError`;
            throw err;
        }

        // clients disabled altogether?
        if (this.params.force_client_none) {
            return [];
        }

        // look for service options
        if (opt.length) {
            return opt
                .filter(s => s !== ClientStyle.NO_CLIENT)
                .filter((value, index, array) => array.indexOf(value) === index);
        }

        // fall back to normal style set by parameter
        if (this.params.client_none)
            return [];
        else if (this.params.client_grpc1)
            return [ClientStyle.GRPC1_CLIENT];
        else
            return [ClientStyle.GENERIC_CLIENT];
    }


    getServerStyles(descriptor: ServiceDescriptorProto): ServerStyle[] {
        const opt = this.interpreter.readOurServiceOptions(descriptor)["ts.server"];

        // always check service options valid
        if (opt.includes(ServerStyle.NO_SERVER) && opt.some(s => s !== ServerStyle.NO_SERVER)) {
            let err = new Error(`You provided invalid options for ${this.stringFormat.formatQualifiedName(descriptor, true)}. If you set (ts.server) = NO_SERVER, you cannot set additional server styles.`);
            err.name = `PluginMessageError`;
            throw err;
        }

        // clients disabled altogether?
        if (this.params.force_server_none) {
            return [];
        }

        // look for service options
        if (opt.length) {
            return opt
                .filter(s => s !== ServerStyle.NO_SERVER)
                .filter((value, index, array) => array.indexOf(value) === index);
        }

        // fall back to normal style set by parameter
        if (this.params.server_generic) {
            return [ServerStyle.GENERIC_SERVER];
        }
        if (this.params.server_grpc1) {
            return [ServerStyle.GRPC1_SERVER];
        }
        return [];
    }

}

