import {MethodInfo} from "./reflection-info";
import {RpcMetadata} from "./rpc-metadata";
import {RpcStatus} from "./rpc-status";


/**
 * Context for a RPC call on the server side.
 */
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
