import type {RpcCallShared} from "./rpc-call-shared";
import type {RpcInputStream} from "./rpc-input-stream";
import type {RpcStatus} from "./rpc-status";
import type {RpcMetadata} from "./rpc-metadata";
import type {MethodInfo} from "./reflection-info";


/**
 * A client streaming RPC call. This means that the clients sends 0, 1, or
 * more messages to the server, and the server replies with exactly one
 * message.
 */
export class ClientStreamingCall<I extends object = object, O extends object = object> implements RpcCallShared<I, O> {

    /**
     * Reflection information about this call.
     */
    readonly method: MethodInfo<I, O>;

    /**
     * Request headers being sent with the request.
     *
     * Request headers are provided in the `meta` property of the
     * `RpcOptions` passed to a call.
     */
    readonly requestHeaders: Readonly<RpcMetadata>;

    /**
     * Request messages from the client.
     */
    readonly requests: RpcInputStream<I>;

    /**
     * The response headers that the server sent.
     *
     * This promise will reject with a `RpcError` when the server sends a
     * error status code.
     */
    readonly headers: Promise<RpcMetadata>;

    /**
     * The message the server replied with.
     */
    readonly response: Promise<O>;

    /**
     * The response status the server replied with.
     *
     * This promise will resolve when the server has finished the request
     * successfully.
     *
     * If the server replies with an error status, this promise will
     * reject with a `RpcError`.
     */
    readonly status: Promise<RpcStatus>;

    /**
     * The trailers the server attached to the response.
     *
     * This promise will resolve when the server has finished the request
     * successfully.
     *
     * If the server replies with an error status, this promise will
     * reject with a `RpcError`.
     */
    readonly trailers: Promise<RpcMetadata>;


    constructor(
        method: MethodInfo<I, O>,
        requestHeaders: Readonly<RpcMetadata>,
        request: RpcInputStream<I>,
        headers: Promise<RpcMetadata>,
        response: Promise<O>,
        status: Promise<RpcStatus>,
        trailers: Promise<RpcMetadata>,
    ) {
        this.method = method;
        this.requestHeaders = requestHeaders;
        this.requests = request;
        this.headers = headers;
        this.response = response;
        this.status = status;
        this.trailers = trailers;
    }


    /**
     * Instead of awaiting the response status and trailers, you can
     * just as well await this call itself to receive the server outcome.
     * Note that it may still be valid to send more request messages.
     */
    then<TResult1 = FinishedClientStreamingCall<I, O>, TResult2 = never>(
        onfulfilled?: ((value: FinishedClientStreamingCall<I, O>) => (PromiseLike<TResult1> | TResult1)) | undefined | null,
        onrejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | undefined | null
    ): Promise<TResult1 | TResult2> {
        return this.promiseFinished().then(
            value => onfulfilled ? Promise.resolve(onfulfilled(value)) : value as unknown as TResult1,
            reason => onrejected ? Promise.resolve(onrejected(reason)) : Promise.reject(reason));
    }


    private async promiseFinished(): Promise<FinishedClientStreamingCall<I, O>> {
        let [headers, response, status, trailers] =
            await Promise.all([this.headers, this.response, this.status, this.trailers]);
        return {
            method: this.method,
            requestHeaders: this.requestHeaders,
            headers,
            response,
            status,
            trailers
        };
    }

}


/**
 * A completed client streaming RPC call. The server will not send any more
 * messages, but it may still be valid to send request messages.
 */
export interface FinishedClientStreamingCall<I extends object, O extends object> {

    /**
     * Reflection information about this call.
     */
    readonly method: MethodInfo<I, O>;

    /**
     * Request headers being sent with the request.
     */
    readonly requestHeaders: Readonly<RpcMetadata>;

    /**
     * The response headers that the server sent.
     */
    readonly headers: RpcMetadata;

    /**
     * The message the server replied with.
     */
    readonly response: O;

    /**
     * The response status the server replied with.
     * The status code will always be OK.
     */
    readonly status: RpcStatus;

    /**
     * The trailers the server attached to the response.
     */
    readonly trailers: RpcMetadata;
}

