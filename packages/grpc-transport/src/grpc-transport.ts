import {
    ClientStreamingCall,
    Deferred,
    DeferredState,
    DuplexStreamingCall,
    mergeRpcOptions,
    MethodInfo,
    RpcError,
    RpcInputStream,
    RpcMetadata,
    RpcOptions,
    RpcOutputStreamController,
    RpcStatus,
    RpcTransport,
    ServerStreamingCall,
    UnaryCall
} from "@protobuf-ts/runtime-rpc";
import {GrpcCallOptions, GrpcOptions} from "./grpc-options";
import {CallOptions, Client, ClientWritableStream, Metadata, status as GrpcStatus} from "@grpc/grpc-js";
import {assert} from "@protobuf-ts/runtime";
import {metadataFromGrpc, isServiceError, metadataToGrpc} from "./util";


export class GrpcTransport implements RpcTransport {


    private readonly defaultOptions: GrpcOptions;
    private readonly client: Client;

    constructor(defaultOptions: GrpcOptions) {
        this.defaultOptions = defaultOptions;

        this.client = new Client(
          defaultOptions.host,
          defaultOptions.channelCredentials,
          defaultOptions.clientOptions
        );
    }

    mergeOptions(options?: Partial<RpcOptions>): RpcOptions {
        return mergeRpcOptions(this.defaultOptions, options);
    }

    private pickCallOptions(options: GrpcCallOptions): CallOptions {
        if (options.callOptions) {
            return options.callOptions;
        }
        const co: CallOptions = {};
        if (typeof options.timeout === "number") {
            co.deadline = Date.now() + options.timeout;
        } else if (options.timeout) {
            co.deadline = options.timeout;
        }
        return co;
    }

    unary<I extends object, O extends object>(method: MethodInfo<I, O>, input: I, options: GrpcCallOptions): UnaryCall<I, O> {

        const opt = options,
            meta = opt.meta ?? {},
            gMeta = metadataToGrpc(meta, opt.metadataOptions, method.idempotency === "IDEMPOTENT"),
            defHeader = new Deferred<RpcMetadata>(),
            defMessage = new Deferred<O>(),
            defStatus = new Deferred<RpcStatus>(),
            defTrailer = new Deferred<RpcMetadata>(),
            call = new UnaryCall<I, O>(method, meta, input, defHeader.promise, defMessage.promise, defStatus.promise, defTrailer.promise)
        ;

        const gCall = this.client.makeUnaryRequest<I, O>(
            `/${method.service.typeName}/${method.name}`,
            (value: I): Buffer => Buffer.from(method.I.toBinary(value, opt.binaryOptions)),
            (value: Buffer): O => method.O.fromBinary(value, opt.binaryOptions),
            input,
            gMeta,
            this.pickCallOptions(opt),
            (err, value) => {
                if (value) {
                    defMessage.resolve(value);
                }
                if (err) {
                    const e = new RpcError(err.message, GrpcStatus[err.code], metadataFromGrpc(err.metadata));
                    e.methodName = method.name;
                    e.serviceName  = method.service.typeName;
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
            defHeader.resolve(metadataFromGrpc(val));
        });

        gCall.addListener('status', val => {

            // if we get a status (via trailer), but did not get a message,
            // we require that the status is an error status.
            if (defMessage.state === DeferredState.PENDING && val.code === GrpcStatus.OK) {
                const e = new RpcError('expected error status', GrpcStatus[GrpcStatus.DATA_LOSS]);
                e.methodName = method.name;
                e.serviceName  = method.service.typeName;
                defMessage.rejectPending(e);
                defStatus.rejectPending(e);
                defTrailer.rejectPending(e);
            } else {
                defStatus.resolvePending({
                    code: GrpcStatus[val.code],
                    detail: val.details
                });
                defTrailer.resolvePending(metadataFromGrpc(val.metadata));
            }
        });

        return call;
    }


    serverStreaming<I extends object, O extends object>(method: MethodInfo<I, O>, input: I, options: GrpcCallOptions): ServerStreamingCall<I, O> {

        const opt = options,
            meta = opt.meta ?? {},
            gMeta = metadataToGrpc(meta, opt.metadataOptions, method.idempotency === "IDEMPOTENT"),
            defHeader = new Deferred<RpcMetadata>(),
            outStream = new RpcOutputStreamController<O>(),
            defStatus = new Deferred<RpcStatus>(),
            defTrailer = new Deferred<RpcMetadata>(),
            call = new ServerStreamingCall<I, O>(method, meta, input, defHeader.promise, outStream, defStatus.promise, defTrailer.promise)
        ;

        const gCall = this.client.makeServerStreamRequest<I, O>(
            `/${method.service.typeName}/${method.name}`,
            (value: I): Buffer => Buffer.from(method.I.toBinary(value, opt.binaryOptions)),
            (value: Buffer): O => method.O.fromBinary(value, opt.binaryOptions),
            input,
            gMeta,
            this.pickCallOptions(opt),
        );

        if (opt.abort) {
            opt.abort.addEventListener('abort', ev => {
                gCall.cancel();
            });
        }

        gCall.addListener('error', err => {
            const e = isServiceError(err) ? new RpcError(err.message, GrpcStatus[err.code], metadataFromGrpc(err.metadata)) : new RpcError(err.message);
            e.methodName = method.name;
            e.serviceName  = method.service.typeName;
            defHeader.rejectPending(e);
            if (!outStream.closed) {
                outStream.notifyError(e);
            }
            defStatus.rejectPending(e);
            defTrailer.rejectPending(e);
        });

        gCall.addListener('end', () => {
            if (!outStream.closed) {
                outStream.notifyComplete();
            }
        });

        gCall.addListener('data', arg1 => {
            assert(method.O.is(arg1));
            outStream.notifyMessage(arg1);
        });

        gCall.addListener('metadata', val => {
            defHeader.resolve(metadataFromGrpc(val));
        });

        gCall.addListener('status', val => {
            defStatus.resolvePending({
                code: GrpcStatus[val.code],
                detail: val.details
            });
            defTrailer.resolvePending(metadataFromGrpc(val.metadata));
        });

        return call;
    }


    clientStreaming<I extends object, O extends object>(method: MethodInfo<I, O>, options: GrpcCallOptions): ClientStreamingCall<I, O> {

        const opt = options,
            meta = opt.meta ?? {},
            gMeta = metadataToGrpc(meta, opt.metadataOptions, method.idempotency === "IDEMPOTENT"),
            defHeader = new Deferred<RpcMetadata>(),
            defMessage = new Deferred<O>(),
            defStatus = new Deferred<RpcStatus>(),
            defTrailer = new Deferred<RpcMetadata>(),
            gCall = this.client.makeClientStreamRequest<I, O>(
                `/${method.service.typeName}/${method.name}`,
                (value: I): Buffer => Buffer.from(method.I.toBinary(value, opt.binaryOptions)),
                (value: Buffer): O => method.O.fromBinary(value, opt.binaryOptions),
                gMeta,
                this.pickCallOptions(opt),
                (err, value) => {
                    if (value) {
                        defMessage.resolve(value);
                    }
                    if (err) {
                        const e = new RpcError(err.message, GrpcStatus[err.code], metadataFromGrpc(err.metadata));
                        e.methodName = method.name;
                        e.serviceName  = method.service.typeName;
                        defHeader.rejectPending(e);
                        defMessage.rejectPending(e);
                        defStatus.rejectPending(e);
                        defTrailer.rejectPending(e);
                    }
                }
            ),
            inStream = new GrpcInputStreamWrapper(gCall),
            call = new ClientStreamingCall<I, O>(method, meta, inStream, defHeader.promise, defMessage.promise, defStatus.promise, defTrailer.promise)
        ;

        if (opt.abort) {
            opt.abort.addEventListener('abort', ev => {
                gCall.cancel();
            });
        }

        gCall.addListener('metadata', val => {
            defHeader.resolve(metadataFromGrpc(val));
        });

        gCall.addListener('status', val => {
            defStatus.resolvePending({
                code: GrpcStatus[val.code],
                detail: val.details
            });
            defTrailer.resolvePending(metadataFromGrpc(val.metadata));
        });

        return call;
    }


    duplex<I extends object, O extends object>(method: MethodInfo<I, O>, options: GrpcCallOptions): DuplexStreamingCall<I, O> {

        const opt = options,
            meta = opt.meta ?? {},
            gMeta = metadataToGrpc(meta, opt.metadataOptions, method.idempotency === "IDEMPOTENT"),
            defHeader = new Deferred<RpcMetadata>(),
            outStream = new RpcOutputStreamController<O>(),
            defStatus = new Deferred<RpcStatus>(),
            defTrailer = new Deferred<RpcMetadata>(),
            gCall = this.client.makeBidiStreamRequest<I, O>(
                `/${method.service.typeName}/${method.name}`,
                (value: I): Buffer => Buffer.from(method.I.toBinary(value, opt.binaryOptions)),
                (value: Buffer): O => method.O.fromBinary(value, opt.binaryOptions),
                gMeta,
                this.pickCallOptions(opt)
            ),
            inStream = new GrpcInputStreamWrapper(gCall),
            call = new DuplexStreamingCall<I, O>(method, meta, inStream, defHeader.promise, outStream, defStatus.promise, defTrailer.promise)
        ;

        if (opt.abort) {
            opt.abort.addEventListener('abort', ev => {
                gCall.cancel();
            });
        }

        gCall.addListener('error', err => {
            const e = isServiceError(err) ? new RpcError(err.message, GrpcStatus[err.code], metadataFromGrpc(err.metadata)) : new RpcError(err.message);
            e.methodName = method.name;
            e.serviceName  = method.service.typeName;
            defHeader.rejectPending(e);
            if (!outStream.closed) {
                outStream.notifyError(e);
            }
            defStatus.rejectPending(e);
            defTrailer.rejectPending(e);
        });

        gCall.addListener('end', () => {
            if (!outStream.closed) {
                outStream.notifyComplete();
            }
        });

        gCall.addListener('data', arg1 => {
            assert(method.O.is(arg1));
            outStream.notifyMessage(arg1);
        });

        gCall.addListener('metadata', val => {
            defHeader.resolve(metadataFromGrpc(val));
        });

        gCall.addListener('status', val => {
            defStatus.resolvePending({
                code: GrpcStatus[val.code],
                detail: val.details
            });
            defTrailer.resolvePending(metadataFromGrpc(val.metadata));
        });

        return call;
    }


    close(): void {
        this.client.close();
    }

}


class GrpcInputStreamWrapper<T> implements RpcInputStream<T> {

    constructor(private readonly inner: ClientWritableStream<T>) {

    }

    send(message: T): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.inner.write(message, resolve);
            // this.inner.end(message, resolve);
        });
    }

    complete(): Promise<void> {
        this.inner.end();
        return Promise.resolve(undefined);
    }


}
