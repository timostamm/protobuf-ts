import {
    ClientStreamingCall,
    Deferred,
    DuplexStreamingCall,
    mergeRpcOptions,
    MethodInfo,
    RpcError,
    RpcMetadata,
    RpcOptions,
    RpcStatus,
    RpcTransport,
    ServerStreamingCall,
    UnaryCall
} from "@protobuf-ts/runtime-rpc";
import {GrpcOptions} from "./grpc-options";
import {Client, Metadata, status as GrpcStatus} from "@grpc/grpc-js";


function rpcMetaToGrpc(from: RpcMetadata, base?: Metadata): Metadata {
    const to = base ?? new Metadata();
    for (let k of Object.keys(from)) {
        let v = from[k];
        if (typeof v == 'string') {
            to.add(k, v);
        } else {
            for (let vv of v) {
                to.add(k, vv);
            }
        }
    }
    return to;
}


function grpcMetaToRpc(from: Metadata): RpcMetadata {
    const meta: RpcMetadata = {};
    const h2 = from.toHttp2Headers();
    for (let k of Object.keys(h2)) {
        let v = h2[k];
        if (v === undefined) {
            continue;
        }
        if (typeof v === "number") {
            v = v.toString();
        }
        meta[k] = v;
    }
    return meta;
}


export class GrpcTransport implements RpcTransport {


    private readonly defaultOptions: GrpcOptions;

    constructor(defaultOptions: GrpcOptions) {
        this.defaultOptions = defaultOptions;
    }

    mergeOptions(options?: Partial<RpcOptions>): RpcOptions {
        return mergeRpcOptions(this.defaultOptions, options);
    }

    unary<I extends object, O extends object>(method: MethodInfo<I, O>, input: I, options: RpcOptions): UnaryCall<I, O> {

        const opt = options as GrpcOptions,
            meta = opt.meta ?? {},
            gMeta = rpcMetaToGrpc(meta, new Metadata({
                idempotentRequest: method.idempotency === "IDEMPOTENT"
            })),
            client = new Client(opt.host, opt.channelCredentials, opt.clientOptions),
            defHeader = new Deferred<RpcMetadata>(),
            defMessage = new Deferred<O>(),
            defStatus = new Deferred<RpcStatus>(),
            defTrailer = new Deferred<RpcMetadata>(),
            call = new UnaryCall<I, O>(method, meta, input, defHeader.promise, defMessage.promise, defStatus.promise, defTrailer.promise)
        ;

        const gCall = client.makeUnaryRequest<I, O>(
            `/${method.service.typeName}/${method.name}`,
            (value: I): Buffer => Buffer.from(method.I.toBinary(value, opt.binaryOptions)),
            (value: Buffer): O => method.O.fromBinary(value, opt.binaryOptions),
            input,
            gMeta,
            // callOpts,
            (err, value) => {
                if (value) {
                    defMessage.resolve(value);
                }
                if (err) {
                    const e = new RpcError(err.message, GrpcStatus[err.code], grpcMetaToRpc(err.metadata));
                    defHeader.rejectPending(e);
                    defMessage.rejectPending(e);
                    defStatus.rejectPending(e);
                    defTrailer.rejectPending(e);
                }
            }
        );

        if (opt.abort) {
            opt.abort.addEventListener('abort', ev => {
                gCall.cancel();
            });
        }

        gCall.addListener('metadata', val => {
            defHeader.resolve(grpcMetaToRpc(val));
        });

        gCall.addListener('status', val => {
            defStatus.resolve({
                code: GrpcStatus[val.code],
                detail: val.details
            });
            defTrailer.resolve(grpcMetaToRpc(val.metadata));
        });

        return call;
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


}
