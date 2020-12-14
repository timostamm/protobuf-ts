import {
    ClientStreamingCall,
    DuplexStreamingCall,
    mergeRpcOptions,
    MethodInfo,
    RpcOptions,
    RpcTransport,
    ServerStreamingCall,
    UnaryCall
} from "../../runtime-rpc/src";


export class GrpcTransport implements RpcTransport {


    private readonly defaultOptions: RpcOptions;

    constructor(defaultOptions: RpcOptions) {
        this.defaultOptions = defaultOptions;
    }

    mergeOptions(options?: Partial<RpcOptions>): RpcOptions {
        return mergeRpcOptions(this.defaultOptions, options);
    }


    clientStreaming<I extends object, O extends object>(method: MethodInfo<I, O>, options: RpcOptions): ClientStreamingCall<I, O> {
        throw new Error("NOT IMPLEMENTED");
    }

    duplex<I extends object, O extends object>(method: MethodInfo<I, O>, options: RpcOptions): DuplexStreamingCall<I, O> {
        throw new Error("NOT IMPLEMENTED");
    }

    serverStreaming<I extends object, O extends object>(method: MethodInfo<I, O>, input: I, options: RpcOptions): ServerStreamingCall<I, O> {
        throw new Error("NOT IMPLEMENTED");
    }

    unary<I extends object, O extends object>(method: MethodInfo<I, O>, input: I, options: RpcOptions): UnaryCall<I, O> {
        throw new Error("NOT IMPLEMENTED");
    }


}
