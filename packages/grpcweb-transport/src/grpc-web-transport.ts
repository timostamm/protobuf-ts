import {
    ClientStreamingCall,
    Deferred,
    DuplexStreamingCall,
    MethodInfo,
    RpcError,
    RpcMetadata,
    RpcOptions,
    RpcOutputStreamController,
    RpcStatus,
    RpcTransport,
    ServerStreamingCall,
    UnaryCall,
    mergeRpcOptions
} from "@protobuf-ts/runtime-rpc";
import {
    GrpcWebFrame,
    createGrpcWebRequestBody,
    createGrpcWebRequestHeader,
    readGrpcWebResponseBody,
    readGrpcWebResponseHeader,
    readGrpcWebResponseTrailer
} from "./grpc-web-format";

import {GrpcStatusCode} from "./goog-grpc-status-code";
import {GrpcWebOptions} from "./grpc-web-options";

/**
 * Implements the grpc-web protocol, supporting text format or binary
 * format on the wire. Uses the fetch API to do the HTTP requests.
 *
 * Does not support client streaming or duplex calls because grpc-web
 * does not support them.
 */
export class GrpcWebFetchTransport implements RpcTransport {


    private readonly defaultOptions: GrpcWebOptions;

    constructor(defaultOptions: GrpcWebOptions) {
        this.defaultOptions = defaultOptions;
    }

    mergeOptions(options?: Partial<RpcOptions>): RpcOptions {
        return mergeRpcOptions(this.defaultOptions, options);
    }


    /**
     * Create an URI for a gRPC web call.
     *
     * Takes the `baseUrl` option and appends:
     * - slash "/"
     * - package name
     * - dot "."
     * - service name
     * - slash "/"
     * - method name
     *
     * If the service was declared without a package, the package name and dot
     * are omitted.
     *
     * All names are used exactly like declared in .proto.
     */
    protected makeUrl(method: MethodInfo, options: GrpcWebOptions): string {
        let base = options.baseUrl;
        if (base.endsWith('/'))
            base = base.substring(0, base.length - 1);
        return `${base}/${method.service.typeName}/${method.name}`;
    }


    clientStreaming<I extends object, O extends object>(method: MethodInfo<I, O>/*, options: RpcOptions*/): ClientStreamingCall<I, O> {
        const e = new RpcError('Client streaming is not supported by grpc-web', GrpcStatusCode[GrpcStatusCode.UNIMPLEMENTED]);
        e.methodName = method.name;
        e.serviceName  = method.service.typeName;
        throw e;
    }

    duplex<I extends object, O extends object>(method: MethodInfo<I, O>/*, options: RpcOptions*/): DuplexStreamingCall<I, O> {
        const e = new RpcError('Duplex streaming is not supported by grpc-web', GrpcStatusCode[GrpcStatusCode.UNIMPLEMENTED]);
        e.methodName = method.name;
        e.serviceName  = method.service.typeName;
        throw e;
    }


    serverStreaming<I extends object, O extends object>(method: MethodInfo<I, O>, input: I, options: RpcOptions): ServerStreamingCall<I, O> {
        let
            opt = options as GrpcWebOptions,
            format = opt.format ?? 'text',
            fetchInit = opt.fetchInit ?? {},
            url = this.makeUrl(method, opt),
            inputBytes = method.I.toBinary(input, opt.binaryOptions),
            defHeader = new Deferred<RpcMetadata>(),
            responseStream = new RpcOutputStreamController<O>(),
            responseEmptyBody = true,
            maybeStatus: RpcStatus | undefined,
            defStatus = new Deferred<RpcStatus>(),
            maybeTrailer: RpcMetadata | undefined,
            defTrailer = new Deferred<RpcMetadata>();

        globalThis.fetch(url, {
            ...fetchInit,
            method: 'POST',
            headers: createGrpcWebRequestHeader(new globalThis.Headers(), format, opt.timeout, opt.meta),
            body: createGrpcWebRequestBody(inputBytes, format),
            signal: options.abort ?? null // node-fetch@3.0.0-beta.9 rejects `undefined`
        })
            .then(fetchResponse => {
                let [code, detail, meta] = readGrpcWebResponseHeader(fetchResponse);
                defHeader.resolve(meta);
                if (code != null && code !== GrpcStatusCode.OK)
                    throw new RpcError(detail ?? GrpcStatusCode[code], GrpcStatusCode[code], meta);
                if (code != null)
                    maybeStatus = {
                        code: GrpcStatusCode[code],
                        detail: detail ?? GrpcStatusCode[code]
                    };
                return fetchResponse;
            })

            .then(fetchResponse => {
                if (!fetchResponse.body)
                    throw new RpcError('missing response body', GrpcStatusCode[GrpcStatusCode.INTERNAL]);
                return readGrpcWebResponseBody(fetchResponse.body!, fetchResponse.headers.get('content-type'), (type, data) => {
                    switch (type) {
                        case GrpcWebFrame.DATA:
                            responseStream.notifyMessage(
                                method.O.fromBinary(data, opt.binaryOptions)
                            );
                            responseEmptyBody = false;
                            break;
                        case GrpcWebFrame.TRAILER:
                            let code, detail;
                            [code, detail, maybeTrailer] = readGrpcWebResponseTrailer(data);
                            maybeStatus = {
                                code: GrpcStatusCode[code],
                                detail: detail ?? GrpcStatusCode[code]
                            };
                            break;
                    }
                });
            })

            .then(() => {
                if (!maybeTrailer && !responseEmptyBody)
                    throw new RpcError(`missing trailers`, GrpcStatusCode[GrpcStatusCode.DATA_LOSS]);

                // istanbul ignore if - this should be impossible and only here to satisfy TypeScript
                if (!maybeStatus)
                    throw new RpcError(`missing status`, GrpcStatusCode[GrpcStatusCode.INTERNAL]);

                if (maybeStatus.code !== 'OK')
                    throw new RpcError(maybeStatus.detail, maybeStatus.code, maybeTrailer);

                responseStream.notifyComplete();
                defStatus.resolve(maybeStatus);
                defTrailer.resolve(maybeTrailer || {});

            })

            .catch(reason => {
                let error: RpcError;
                if (reason instanceof RpcError)
                    error = reason;
                else if (reason instanceof Error && reason.name === 'AbortError')
                    // aborted
                    error = new RpcError(reason.message, GrpcStatusCode[GrpcStatusCode.CANCELLED]);
                else
                    // RpcErrors are thrown by us, everything else is an internal error
                    error = new RpcError(reason instanceof Error ? reason.message : "" + reason, GrpcStatusCode[GrpcStatusCode.INTERNAL]);
                error.methodName = method.name;
                error.serviceName  = method.service.typeName;
                defHeader.rejectPending(error);
                responseStream.notifyError(error)
                defStatus.rejectPending(error);
                defTrailer.rejectPending(error);
            });


        return new ServerStreamingCall<I, O>(
            method,
            opt.meta ?? {},
            input,
            defHeader.promise,
            responseStream,
            defStatus.promise,
            defTrailer.promise,
        );

    }


    unary<I extends object, O extends object>(method: MethodInfo<I, O>, input: I, options: RpcOptions): UnaryCall<I, O> {

        let
            opt = options as GrpcWebOptions,
            format = opt.format ?? 'text',
            fetchInit = opt.fetchInit ?? {},
            url = this.makeUrl(method, opt),
            inputBytes = method.I.toBinary(input, opt.binaryOptions),
            defHeader = new Deferred<RpcMetadata>(),
            maybeMessage: O | undefined,
            defMessage = new Deferred<O>(),
            maybeStatus: RpcStatus | undefined,
            defStatus = new Deferred<RpcStatus>(),
            maybeTrailer: RpcMetadata | undefined,
            defTrailer = new Deferred<RpcMetadata>();

        globalThis.fetch(url, {
            ...fetchInit,
            method: 'POST',
            headers: createGrpcWebRequestHeader(new globalThis.Headers(), format, opt.timeout, opt.meta),
            body: createGrpcWebRequestBody(inputBytes, format),
            signal: options.abort ?? null // node-fetch@3.0.0-beta.9 rejects `undefined`
        })
            .then(fetchResponse => {
                let [code, detail, meta] = readGrpcWebResponseHeader(fetchResponse);
                defHeader.resolve(meta);
                if (code != null && code !== GrpcStatusCode.OK)
                    throw new RpcError(detail ?? GrpcStatusCode[code], GrpcStatusCode[code], meta);
                if (code != null)
                    maybeStatus = {
                        code: GrpcStatusCode[code],
                        detail: detail ?? GrpcStatusCode[code]
                    };
                return fetchResponse;
            })

            .then(fetchResponse => {
                if (!fetchResponse.body)
                    throw new RpcError('missing response body', GrpcStatusCode[GrpcStatusCode.INTERNAL]);
                return readGrpcWebResponseBody(fetchResponse.body!, fetchResponse.headers.get('content-type'), (type, data) => {
                    switch (type) {
                        case GrpcWebFrame.DATA:
                            if (maybeMessage)
                                throw new RpcError(`unary call received 2nd message`, GrpcStatusCode[GrpcStatusCode.DATA_LOSS]);
                            maybeMessage = method.O.fromBinary(data, opt.binaryOptions);
                            break;
                        case GrpcWebFrame.TRAILER:
                            let code, detail;
                            [code, detail, maybeTrailer] = readGrpcWebResponseTrailer(data);
                            maybeStatus = {
                                code: GrpcStatusCode[code],
                                detail: detail ?? GrpcStatusCode[code]
                            };
                            break;
                    }
                });
            })

            .then(() => {
                if (!maybeTrailer && maybeMessage)
                    throw new RpcError(`missing trailers`, GrpcStatusCode[GrpcStatusCode.DATA_LOSS]);

                // istanbul ignore if - this should be impossible and only here to satisfy TypeScript
                if (!maybeStatus)
                    throw new RpcError(`missing status`, GrpcStatusCode[GrpcStatusCode.INTERNAL]);

                if (!maybeMessage && maybeStatus.code === 'OK')
                    throw new RpcError('expected error status', GrpcStatusCode[GrpcStatusCode.DATA_LOSS]);

                if (!maybeMessage)
                    throw new RpcError(maybeStatus.detail, maybeStatus.code, maybeTrailer);

                defMessage.resolve(maybeMessage);
                if (maybeStatus.code !== 'OK')
                    throw new RpcError(maybeStatus.detail, maybeStatus.code, maybeTrailer);

                defStatus.resolve(maybeStatus);
                defTrailer.resolve(maybeTrailer || {});

            })

            .catch(reason => {
                let error: RpcError;
                if (reason instanceof RpcError)
                    error = reason;
                else if (reason instanceof Error && reason.name === 'AbortError')
                    // aborted
                    error = new RpcError(reason.message, GrpcStatusCode[GrpcStatusCode.CANCELLED]);
                else
                    // RpcErrors are thrown by us, everything else is an internal error
                    error = new RpcError(reason instanceof Error ? reason.message : "" + reason, GrpcStatusCode[GrpcStatusCode.INTERNAL]);
                error.methodName = method.name;
                error.serviceName  = method.service.typeName;
                defHeader.rejectPending(error);
                defMessage.rejectPending(error);
                defStatus.rejectPending(error);
                defTrailer.rejectPending(error);
            });


        return new UnaryCall<I, O>(
            method,
            opt.meta ?? {},
            input,
            defHeader.promise,
            defMessage.promise,
            defStatus.promise,
            defTrailer.promise,
        );
    }

}


