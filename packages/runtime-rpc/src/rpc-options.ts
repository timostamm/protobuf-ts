import {RpcMetadata} from "./rpc-metadata";
import {
    BinaryReadOptions,
    BinaryWriteOptions,
    JsonReadOptions,
    JsonWriteOptions,
    mergeBinaryOptions,
    mergeJsonOptions
} from "@protobuf-ts/runtime";
import {RpcInterceptor} from "./rpc-interceptor";

/**
 * User-provided options for Remote Procedure Calls.
 *
 * Every generated service method accepts these options.
 * They are passed on to the `RpcTransport` and can be evaluated there.
 */
export interface RpcOptions {

    /**
     * Meta data for the call.
     *
     * RPC meta data are simple key-value pairs that usually translate
     * directly to HTTP request headers.
     *
     * If a key ends with `-bin`, it should contain binary data in base64
     * encoding, allowing you to send serialized messages.
     */
    meta?: RpcMetadata;

    /**
     * Deadline for the call. Can be given as a Date object or a
     * timestamp in milliseconds.
     */
    deadline?: Date | number;

    /**
     * Interceptors can be used to manipulate request and response data.
     * The most common use case is adding a "Authorization" header.
     */
    interceptors?: RpcInterceptor[],

    /**
     * Options for the JSON wire format.
     *
     * To send or receive `google.protobuf.Any` in JSON format, you must
     * provide `jsonOptions.typeRegistry` so that the runtime can discriminate
     * the packed type.
     */
    jsonOptions?: Partial<JsonReadOptions & JsonWriteOptions>;

    /**
     * Options for the binary wire format.
     */
    binaryOptions?: Partial<BinaryReadOptions & BinaryWriteOptions>;

    /**
     * A signal to cancel a call. Can be created with an [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
     * The npm package `abort-controller` provides a polyfill for Node.js.
     */
    abort?: AbortSignal;

    /**
     * A `RpcTransport` implementation may allow arbitrary
     * other options.
     */
    [extra: string]: unknown;
}


/**
 * Merges custom RPC options with defaults. Returns a new instance and keeps
 * the "defaults" and the "options" unmodified.
 *
 * Merges `RpcMetadata` "meta", overwriting values from "defaults" with
 * values from "options". Does not append values to existing entries.
 *
 * Merges "jsonOptions", including "jsonOptions.typeRegistry", by creating
 * a new array that contains types from "options.jsonOptions.typeRegistry"
 * first, then types from "defaults.jsonOptions.typeRegistry".
 *
 * Merges "binaryOptions".
 *
 * Merges "interceptors" by creating a new array that contains interceptors
 * from "defaults" first, then interceptors from "options".
 *
 * Works with objects that extend `RpcOptions`, but only if the added
 * properties are of type Date, primitive like string, boolean, or Array
 * of primitives. If you have other property types, you have to merge them
 * yourself.
 */
export function mergeRpcOptions<T extends RpcOptions>(defaults: T, options?: Partial<T>): T {
    if (!options)
        return defaults;
    let o = {} as any;
    copy(defaults, o);
    copy(options, o);
    for (let key of Object.keys(options)) {
        let val = options[key] as any;
        switch (key) {
            case "jsonOptions":
                o.jsonOptions = mergeJsonOptions(defaults.jsonOptions, o.jsonOptions);
                break;
            case "binaryOptions":
                o.binaryOptions = mergeBinaryOptions(defaults.binaryOptions, o.binaryOptions);
                break;
            case "meta":
                o.meta = {};
                copy(defaults.meta, o.meta);
                copy(options.meta, o.meta);
                break;
            case "interceptors":
                o.interceptors = defaults.interceptors ? defaults.interceptors.concat(val) : val.concat();
                break;
        }
    }
    return o;
}


function copy(a: object | undefined, into: object): void {
    if (!a)
        return;
    let c = into as any;
    for (let [k, v] of Object.entries(a)) {
        if (v instanceof Date)
            c[k] = new Date(v.getTime());
        else if (Array.isArray(v))
            c[k] = v.concat();
        else
            c[k] = v;
    }
}
