import {RpcCallShared} from "./rpc-call-shared";
import {RpcInputStream} from "./rpc-input-stream";
import {RpcStatus} from "./rpc-status";
import {RpcMetadata} from "./rpc-metadata";
import {MethodInfo} from "./reflection-info";


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
    readonly request: RpcInputStream<I>;

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
        this.request = request;
        this.headers = headers;
        this.response = response;
        this.status = status;
        this.trailers = trailers;
    }


}
