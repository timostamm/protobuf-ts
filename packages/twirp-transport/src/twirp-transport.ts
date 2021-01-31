import {TwirpOptions} from "./twirp-options";
import {createTwirpRequestHeader, parseMetadataFromResponseHeaders, parseTwirpErrorResponse} from "./twirp-format";
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
import {lowerCamelCase} from "@protobuf-ts/runtime";
import {TwirpErrorCode} from "./twitch-twirp-error-code";

/**
 * Implements the Twirp protocol, supporting JSON or binary format on
 * the wire. Uses the fetch API to do the HTTP requests.
 *
 * See https://twitchtv.github.io/twirp/docs/spec_v5.html
 */
export class TwirpFetchTransport implements RpcTransport {

    protected readonly defaultOptions: TwirpOptions;

    constructor(options: TwirpOptions) {
        this.defaultOptions = options;
    }

    mergeOptions(options?: Partial<RpcOptions>): RpcOptions {
        return mergeRpcOptions(this.defaultOptions, options);
    }

    unary<I extends object, O extends object>(method: MethodInfo<I, O>, input: I, options: RpcOptions): UnaryCall<I, O> {

        let
            opt = options as TwirpOptions,
            url = this.makeUrl(method, opt),
            requestBody = opt.sendJson ? method.I.toJsonString(input, opt.jsonOptions) : method.I.toBinary(input, opt.binaryOptions),
            defHeader = new Deferred<RpcMetadata>(),
            defMessage = new Deferred<O>(),
            defStatus = new Deferred<RpcStatus>(),
            defTrailer = new Deferred<RpcMetadata>();

        globalThis.fetch(url, {
            method: 'POST',
            headers: createTwirpRequestHeader(new globalThis.Headers(), !!opt.sendJson, opt.meta),
            body: requestBody,
            signal: options.abort ?? null // node-fetch@3.0.0-beta.9 rejects `undefined`
        })
            .then(fetchResponse => {

                defHeader.resolve(parseMetadataFromResponseHeaders(fetchResponse.headers));

                if (!fetchResponse.body)
                    throw new RpcError('premature end of response', TwirpErrorCode[TwirpErrorCode.dataloss]);

                switch (fetchResponse.type) {
                    case "error":
                    case "opaque":
                    case "opaqueredirect":
                        // see https://developer.mozilla.org/en-US/docs/Web/API/Response/type
                        throw new RpcError(`fetch response type ${fetchResponse.type}`, TwirpErrorCode[TwirpErrorCode.unknown]);
                }

                if (!fetchResponse.ok) {
                    return fetchResponse.json().then(
                        value => {
                            throw parseTwirpErrorResponse(value);
                        },
                        () => {
                            throw new RpcError('received HTTP ' + fetchResponse.status + ', unable to read response body as json', TwirpErrorCode[TwirpErrorCode.internal]);
                        }
                    );
                }

                if (opt.sendJson) {
                    return fetchResponse.json().then(
                        value => method.O.fromJson(value, opt.jsonOptions),
                        () => {
                            throw new RpcError('unable to read response body as json', TwirpErrorCode[TwirpErrorCode.dataloss]);
                        }
                    );
                }

                return fetchResponse.arrayBuffer().then(
                    value => method.O.fromBinary(new Uint8Array(value), opt.binaryOptions),
                    () => {
                        throw new RpcError('unable to read response body', TwirpErrorCode[TwirpErrorCode.dataloss]);
                    }
                );

            }, (reason: any) => {
                // failed to fetch, aborted, wrong url or network problem
                if (reason instanceof Error && reason.name === 'AbortError')
                    throw new RpcError(reason.message, TwirpErrorCode[TwirpErrorCode.cancelled]);
                throw new RpcError(reason instanceof Error ? reason.message : reason);
            })

            .then(message => {

                defMessage.resolve(message);
                defStatus.resolve({code: 'OK', detail: ''});
                defTrailer.resolve({});

            })

            .catch((reason: any) => {
                // RpcErrors are thrown by us, everything else is an internal error
                let error = reason instanceof RpcError ? reason
                    : new RpcError(reason instanceof Error ? reason.message : reason, TwirpErrorCode[TwirpErrorCode.internal]);
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


    /**
     * Create an URI for a RPC call.
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
     * The method name is CamelCased just as it would be in Go, unless the
     * option `useProtoMethodName` is `true`.
     */
    protected makeUrl(method: MethodInfo, options: TwirpOptions): string {
        let base = options.baseUrl;
        if (base.endsWith('/'))
            base = base.substring(0, base.length - 1);
        let methodName = method.name;
        if (options.useProtoMethodName !== true) {
            methodName = lowerCamelCase(methodName);
            methodName = methodName.substring(0, 1).toUpperCase() + methodName.substring(1);
        }
        return `${base}/${method.service.typeName}/${methodName}`;
    }


    clientStreaming<I extends object, O extends object>(/*service: ServiceInfo, method: MethodInfo<I, O>, options: RpcOptions*/): ClientStreamingCall<I, O> {
        throw new RpcError('Client streaming is not supported by Twirp', TwirpErrorCode[TwirpErrorCode.unimplemented]);
    }

    duplex<I extends object, O extends object>(/*service: ServiceInfo, method: MethodInfo<I, O>, options: RpcOptions*/): DuplexStreamingCall<I, O> {
        throw new RpcError('Duplex streaming is not supported by Twirp', TwirpErrorCode[TwirpErrorCode.unimplemented]);
    }

    serverStreaming<I extends object, O extends object>(/*service: ServiceInfo, method: MethodInfo<I, O>, input: I, options?: RpcOptions*/): ServerStreamingCall<I, O> {
        throw new RpcError('Server streaming is not supported by Twirp', TwirpErrorCode[TwirpErrorCode.unimplemented]);
    }

}
