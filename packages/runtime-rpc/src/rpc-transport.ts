import {UnaryCall} from "./unary-call";
import {ServerStreamingCall} from "./server-streaming-call";
import {ClientStreamingCall} from "./client-streaming-call";
import {DuplexStreamingCall} from "./duplex-streaming-call";
import {MethodInfo} from "./reflection-info";
import {RpcOptions} from "./rpc-options";


/**
 * A `RpcTransport` executes Remote Procedure Calls defined by a protobuf
 * service.
 *
 * This interface is the contract between a generated service client and
 * some wire protocol like grpc, grpc-web, Twirp or other.
 *
 * The transport receives reflection information about the service and
 * method being called.
 *
 * Your implementation **should** accept default `RpcOptions` (or an
 * interface that extends `RpcOptions`) in the constructor.
 *
 * You **must** merge the options given to `mergeOptions()` with your default
 * options. If you do not implement any extra options, or only primitive
 * values, you can use `mergeExtendedRpcOptions()` to get the desired
 * behaviour.
 *
 * You **must** pass `RpcOptions.jsonOptions` and `RpcOptions.binaryOptions`
 * to the `fromBinary`, `toBinary`, `fromJson` and `toJson` methods when
 * preparing a request or parsing a response.
 *
 * Your implementation can support arbitrary other options, but they must not
 * interfere with options keys of the binary or JSON options.
 */
export interface RpcTransport {

    /**
     * Merge call options with default options.
     * Generated service clients will call this method with the users'
     * call options and pass the result to the execute-method below.
     */
    mergeOptions(options?: Partial<RpcOptions>): RpcOptions;

    /**
     * Execute an unary RPC.
     */
    unary<I extends object, O extends object>(
        method: MethodInfo<I, O>,
        input: I, options: RpcOptions): UnaryCall<I, O>;

    /**
     * Execute a server streaming RPC.
     */
    serverStreaming<I extends object, O extends object>(
        method: MethodInfo<I, O>,
        input: I, options: RpcOptions): ServerStreamingCall<I, O>;

    /**
     * Execute a client streaming RPC.
     */
    clientStreaming<I extends object, O extends object>(
        method: MethodInfo<I, O>,
        options: RpcOptions): ClientStreamingCall<I, O>;

    /**
     * Execute a duplex streaming RPC.
     */
    duplex<I extends object, O extends object>(
        method: MethodInfo<I, O>,
        options: RpcOptions): DuplexStreamingCall<I, O>;

}
