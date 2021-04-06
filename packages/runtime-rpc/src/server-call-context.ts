import type {MethodInfo} from "./reflection-info";
import type {RpcMetadata} from "./rpc-metadata";
import type {RpcStatus} from "./rpc-status";

type CancelCallback = () => void;
type RemoveListenerFn = () => void;
type SendResponseHeadersFn = (headers: RpcMetadata) => void;


export class ServerCallContextController implements ServerCallContext {


    private _cancelled = false;
    private readonly _sendRH: SendResponseHeadersFn;
    private readonly _listeners: CancelCallback[] = [];

    constructor(
        method: MethodInfo,
        headers: Readonly<RpcMetadata>,
        deadline: Date,
        sendResponseHeadersFn: SendResponseHeadersFn,
        defaultStatus: RpcStatus = {code: 'OK', detail: ''}
    ) {
        this.method = method;
        this.headers = headers;
        this.deadline = deadline;
        this.trailers = {};
        this._sendRH = sendResponseHeadersFn;
        this.status = defaultStatus;
    }

    /**
     * Set the call cancelled.
     *
     * Invokes all callbacks registered with onCancel() and
     * sets `cancelled = true`.
     */
    notifyCancelled(): void {
        if (!this._cancelled) {
            this._cancelled = true;
            for (let l of this._listeners) {
                l();
            }
        }
    }

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
    sendResponseHeaders(data: RpcMetadata): void {
        this._sendRH(data);
    }

    /**
     * Is the call cancelled?
     *
     * When the client closes the connection before the server
     * is done, the call is cancelled.
     *
     * If you want to cancel a request on the server, throw a
     * RpcError with the CANCELLED status code.
     */
    get cancelled(): boolean {
        return this._cancelled;
    }

    /**
     * Add a callback for cancellation.
     */
    onCancel(callback: CancelCallback): RemoveListenerFn {
        const l = this._listeners;
        l.push(callback);
        return () => {
            let i = l.indexOf(callback);
            if (i >= 0)
                l.splice(i, 1);
        };
    }

}


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

    /**
     * Is the call cancelled?
     *
     * When the client closes the connection before the server
     * is done, the call is cancelled.
     *
     * If you want to cancel a request on the server, throw a
     * RpcError with the CANCELLED status code.
     */
    readonly cancelled: boolean;

    /**
     * Add a callback for cancellation.
     */
    onCancel(cb: CancelCallback): RemoveListenerFn;

}
