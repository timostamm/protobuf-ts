/**
 * Custom file options interpreted by @protobuf-ts/plugin
 */
import * as rt from "@protobuf-ts/runtime";
import * as rpc from "@protobuf-ts/runtime-rpc";
import {
    FileDescriptorProto,
    FileOptions,
    FileOptions_OptimizeMode,
    MethodOptions,
    ServiceDescriptorProto,
    ServiceOptions
} from "@protobuf-ts/plugin-framework";


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
    readonly ["ts.client"]: rpc.ClientStyle[];

    /**
     * Generate a server for this service with this style.
     * Can be set multiple times to generate several styles.
     */
    readonly ["ts.server"]: rpc.ServerStyle[];
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
        T: () => ["ts.ClientStyle", rpc.ClientStyle],
        repeat: rt.RepeatType.UNPACKED,
    },
    {
        no: 777702,
        name: "ts.server", localName: "ts.server", jsonName: "ts.server",
        kind: "enum",
        T: () => ["ts.ServerStyle", rpc.ServerStyle],
        repeat: rt.RepeatType.UNPACKED,
    }

]);

const emptyFileOptions = OurFileOptions.create();
const emptyServiceOptions = OurServiceOptions.create();


/**
 * Internal settings for the file generation.
 */
export interface InternalOptions {
    readonly pluginCredit?: string;
    readonly optimizeFor: FileOptions_OptimizeMode;
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
    optimizeFor: FileOptions_OptimizeMode.SPEED,
    normalLongType: rt.LongType.BIGINT,
    emitAngularAnnotations: false,
    synthesizeEnumZeroValue: 'UNSPECIFIED$',
    oneofKindDiscriminator: 'oneofKind',
    runtimeAngularImportPath: '@protobuf-ts/runtime-angular',
    runtimeRpcImportPath: '@protobuf-ts/runtime-rpc',
    angularCoreImportPath: '@angular/core',
    runtimeImportPath: '@protobuf-ts/runtime',
} as const;
