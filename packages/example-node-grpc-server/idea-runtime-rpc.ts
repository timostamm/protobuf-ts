import {MethodInfo, RpcMetadata, RpcStatus} from "@protobuf-ts/runtime-rpc";


// TODO provide in runtime-rpc
export interface ServerCallContext {

    /**
     * Reflection information about this call.
     */
    readonly method: MethodInfo;

    /**
     * Request headers.
     */
    readonly headers: Readonly<RpcMetadata>;

    /**
     * Deadline for this call.
     */
    readonly deadline: Date;

    /**
     * Trailers to send when the response is finished.
     */
    trailers: RpcMetadata;

    /**
     * Status to send when the response is finished.
     */
    status: RpcStatus;

    /**
     * Send response headers.
     */
    sendResponseHeaders(data: RpcMetadata): void;
}
