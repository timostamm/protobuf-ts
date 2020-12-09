import {RpcError} from "./rpc-error";
import {RpcMetadata} from "./rpc-metadata";
import {RpcStatus} from "./rpc-status";
import {RpcTransport} from "./rpc-transport";
import {MethodInfo} from "./reflection-info";
import {assert} from "@protobuf-ts/runtime";
import {RpcOutputStreamController} from "./rpc-output-stream";
import {mergeRpcOptions, RpcOptions} from "./rpc-options";
import {UnaryCall} from "./unary-call";
import {ServerStreamingCall} from "./server-streaming-call";
import {ClientStreamingCall} from "./client-streaming-call";
import {DuplexStreamingCall} from "./duplex-streaming-call";
import {RpcInputStream} from "./rpc-input-stream";


/**
 * Mock data for the TestTransport.
 */
interface TestTransportMockData {

    /**
     * Input stream behaviour for client streaming and bidi calls.
     * If RpcError, sending a message rejects with this error.
     * If number, sending message is delayed for N milliseconds.
     * If omitted, sending a message is delayed for 10 milliseconds.
     */
    inputMessage?: RpcError | number;

    /**
     * Input stream behaviour for client streaming and bidi calls.
     * If RpcError, completing the stream rejects with this error.
     * If number, completing the stream is delayed for N milliseconds.
     * If omitted, completing the stream is delayed for 10 milliseconds.
     */
    inputComplete?: RpcError | number;

    /**
     * If not provided, defaults to `{ responseHeader: "test" }`
     * If RpcError, the "headers" promise is rejected with this error.
     */
    headers?: RpcMetadata | RpcError;

    /**
     * If not provided, transport creates default output message using method info
     * If RpcError, the "response" promise / stream is rejected with this error.
     */
    response?: object | readonly object[] | RpcError;

    /**
     * If not provided, defaults to `{ code: "OK", detail: "all good" }`
     * If RpcError, the "status" promise is rejected with this error.
     */
    status?: RpcStatus | RpcError;

    /**
     * If not provided, defaults to `{ responseTrailer: "test" }`
     * If RpcError, the "trailers" promise is rejected with this error.
     */
    trailers?: RpcMetadata | RpcError;
}


/**
 * Transport for testing.
 */
export class TestTransport implements RpcTransport {

    static readonly defaultHeaders: Readonly<RpcMetadata> = {
        responseHeader: "test"
    };

    static readonly defaultStatus: Readonly<RpcStatus> = {
        code: "OK", detail: "all good"
    };

    static readonly defaultTrailers: Readonly<RpcMetadata> = {
        responseTrailer: "test"
    };

    /**
     * Sent message(s) during the last operation.
     */
    public get sentMessages(): any[] {
        if (this.lastInput instanceof TestInputStream) {
            return this.lastInput.sent;
        } else if (typeof this.lastInput == "object") {
            return [this.lastInput.single];
        }
        return [];
    }

    /**
     * Sending message(s) completed?
     */
    public get sendComplete(): boolean {
        if (this.lastInput instanceof TestInputStream) {
            return this.lastInput.completed;
        } else if (typeof this.lastInput == "object") {
            return true;
        }
        return false;
    }

    /**
     * Suppress warning / error about uncaught rejections of
     * "status" and "trailers".
     */
    public suppressUncaughtRejections = true;


    private readonly data: TestTransportMockData;
    private readonly headerDelay = 10;
    private readonly responseDelay = 50;
    private readonly betweenResponseDelay = 10;
    private readonly afterResponseDelay = 10;
    private lastInput: TestInputStream<any> | { single: any } | undefined


    /**
     * Initialize with mock data. Omitted fields have default value.
     */
    constructor(data?: TestTransportMockData) {
        this.data = data ?? {};
    }


    // Creates a promise for response headers from the mock data.
    private promiseHeaders(): Promise<RpcMetadata> {
        const headers = this.data.headers ?? TestTransport.defaultHeaders;
        return headers instanceof RpcError
            ? Promise.reject(headers)
            : Promise.resolve(headers);
    }


    // Creates a promise for a single, valid, message from the mock data.
    private promiseSingleResponse(method: MethodInfo): Promise<any> {
        if (this.data.response instanceof RpcError) {
            return Promise.reject(this.data.response);
        }
        let r: object;
        if (Array.isArray(this.data.response)) {
            assert(this.data.response.length > 0);
            r = this.data.response[0];
        } else if (this.data.response !== undefined) {
            r = this.data.response;
        } else {
            r = method.O.create();
        }
        assert(method.O.is(r));
        return Promise.resolve(r);
    }


    /**
     * Pushes response messages from the mock data to the output stream.
     * If an error response, status or trailers are mocked, the stream is
     * closed with the respective error.
     * Otherwise, stream is completed successfully.
     *
     * The returned promise resolves when the stream is closed. It should
     * not reject. If it does, code is broken.
     */
    private async streamResponses<I extends object, O extends object>(method: MethodInfo<I, O>, stream: RpcOutputStreamController<O>, abort?: AbortSignal): Promise<void> {
        // normalize "data.response" into an array of valid output messages
        const messages: O[] = [];
        if (this.data.response === undefined) {
            messages.push(method.O.create());
        } else if (Array.isArray(this.data.response)) {
            for (let msg of this.data.response) {
                assert(method.O.is(msg));
                messages.push(msg);
            }
        } else if (!(this.data.response instanceof RpcError)) {
            assert(method.O.is(this.data.response));
            messages.push(this.data.response);
        }

        // start the stream with an initial delay.
        // if the request is cancelled, notify() error and exit.
        try {
            await delay(this.responseDelay, abort)(undefined);
        } catch (error) {
            stream.notifyError(error);
            return;
        }

        // if error response was mocked, notify() error (stream is now closed with error) and exit.
        if (this.data.response instanceof RpcError) {
            stream.notifyError(this.data.response);
            return;
        }

        // regular response messages were mocked. notify() them.
        for (let msg of messages) {
            stream.notifyMessage(msg);

            // add a short delay between responses
            // if the request is cancelled, notify() error and exit.
            try {
                await delay(this.betweenResponseDelay, abort)(undefined);
            } catch (error) {
                stream.notifyError(error);
                return;
            }
        }

        // error status was mocked, notify() error (stream is now closed with error) and exit.
        if (this.data.status instanceof RpcError) {
            stream.notifyError(this.data.status);
            return;
        }

        // error trailers were mocked, notify() error (stream is now closed with error) and exit.
        if (this.data.trailers instanceof RpcError) {
            stream.notifyError(this.data.trailers);
            return;
        }

        // stream completed successfully
        stream.notifyComplete();
    }


    // Creates a promise for response status from the mock data.
    private promiseStatus(): Promise<RpcStatus> {
        const status = this.data.status ?? TestTransport.defaultStatus;
        return status instanceof RpcError
            ? Promise.reject(status)
            : Promise.resolve(status);
    }


    // Creates a promise for response trailers from the mock data.
    private promiseTrailers(): Promise<RpcMetadata> {
        const trailers = this.data.trailers ?? TestTransport.defaultTrailers;
        return trailers instanceof RpcError
            ? Promise.reject(trailers)
            : Promise.resolve(trailers);
    }


    private maybeSuppressUncaught(...promise: Promise<any>[]): void {
        if (this.suppressUncaughtRejections) {
            for (let p of promise) {
                p.catch(() => {
                });
            }
        }
    }


    mergeOptions(options?: Partial<RpcOptions>): RpcOptions {
        return mergeRpcOptions({}, options);
    }


    unary<I extends object, O extends object>(method: MethodInfo<I, O>, input: I, options: RpcOptions): UnaryCall<I, O> {
        const
            requestHeaders = options.meta ?? {},
            headersPromise = this.promiseHeaders()
                .then(delay(this.headerDelay, options.abort)),
            responsePromise: Promise<O> = headersPromise
                .catch(_ => {
                })
                .then(delay(this.responseDelay, options.abort))
                .then(_ => this.promiseSingleResponse(method)),
            statusPromise = responsePromise
                .catch(_ => {
                })
                .then(delay(this.afterResponseDelay, options.abort))
                .then(_ => this.promiseStatus()),
            trailersPromise = responsePromise
                .catch(_ => {
                })
                .then(delay(this.afterResponseDelay, options.abort))
                .then(_ => this.promiseTrailers());
        this.maybeSuppressUncaught(statusPromise, trailersPromise);
        this.lastInput = {single: input};
        return new UnaryCall(method, requestHeaders, input, headersPromise, responsePromise, statusPromise, trailersPromise);
    }


    serverStreaming<I extends object, O extends object>(method: MethodInfo<I, O>, input: I, options: RpcOptions): ServerStreamingCall<I, O> {
        const
            requestHeaders = options.meta ?? {},
            headersPromise = this.promiseHeaders()
                .then(delay(this.headerDelay, options.abort)),
            outputStream = new RpcOutputStreamController<O>(),
            responseStreamClosedPromise = headersPromise
                .then(delay(this.responseDelay, options.abort))
                .catch(() => {
                })
                .then(() => this.streamResponses(method, outputStream, options.abort))
                .then(delay(this.afterResponseDelay, options.abort)),
            statusPromise = responseStreamClosedPromise
                .then(() => this.promiseStatus()),
            trailersPromise = responseStreamClosedPromise
                .then(() => this.promiseTrailers());
        this.maybeSuppressUncaught(statusPromise, trailersPromise);
        this.lastInput = {single: input};
        return new ServerStreamingCall<I, O>(method, requestHeaders, input, headersPromise, outputStream, statusPromise, trailersPromise);
    }


    clientStreaming<I extends object, O extends object>(method: MethodInfo<I, O>, options: RpcOptions): ClientStreamingCall<I, O> {
        const
            requestHeaders = options.meta ?? {},
            headersPromise = this.promiseHeaders()
                .then(delay(this.headerDelay, options.abort)),
            responsePromise: Promise<O> = headersPromise
                .catch(_ => {
                })
                .then(delay(this.responseDelay, options.abort))
                .then(_ => this.promiseSingleResponse(method)),
            statusPromise = responsePromise
                .catch(_ => {
                })
                .then(delay(this.afterResponseDelay, options.abort))
                .then(_ => this.promiseStatus()),
            trailersPromise = responsePromise
                .catch(_ => {
                })
                .then(delay(this.afterResponseDelay, options.abort))
                .then(_ => this.promiseTrailers());
        this.maybeSuppressUncaught(statusPromise, trailersPromise);
        this.lastInput = new TestInputStream(this.data, options.abort);
        return new ClientStreamingCall<I, O>(method, requestHeaders, this.lastInput, headersPromise, responsePromise, statusPromise, trailersPromise);
    }


    duplex<I extends object, O extends object>(method: MethodInfo<I, O>, options: RpcOptions): DuplexStreamingCall<I, O> {
        const
            requestHeaders = options.meta ?? {},
            headersPromise = this.promiseHeaders()
                .then(delay(this.headerDelay, options.abort)),
            outputStream = new RpcOutputStreamController<O>(),
            responseStreamClosedPromise = headersPromise
                .then(delay(this.responseDelay, options.abort))
                .catch(() => {
                })
                .then(() => this.streamResponses(method, outputStream, options.abort))
                .then(delay(this.afterResponseDelay, options.abort)),
            statusPromise = responseStreamClosedPromise
                .then(() => this.promiseStatus()),
            trailersPromise = responseStreamClosedPromise
                .then(() => this.promiseTrailers());
        this.maybeSuppressUncaught(statusPromise, trailersPromise);
        this.lastInput = new TestInputStream(this.data, options.abort);
        return new DuplexStreamingCall<I, O>(method, requestHeaders, this.lastInput, headersPromise, outputStream, statusPromise, trailersPromise);
    }

}

function delay<T>(ms: number, abort?: AbortSignal): (v: T) => Promise<T> {
    return (v: T) => new Promise<T>((resolve, reject) => {
        if (abort?.aborted) {
            reject(new RpcError("user cancel", "CANCELLED"));
        } else {
            const id = setTimeout(() => resolve(v), ms);
            if (abort) {
                abort.addEventListener("abort", ev => {
                    clearTimeout(id);
                    reject(new RpcError("user cancel", "CANCELLED"));
                });
            }
        }
    });
}


class TestInputStream<T> implements RpcInputStream<T> {

    public get sent(): T[] {
        return this._sent;
    }

    public get completed(): boolean {
        return this._completed;
    }

    private _completed = false;
    private readonly _sent: T[] = [];
    private readonly data: Pick<TestTransportMockData, "inputMessage" | "inputComplete">;
    private readonly abort?: AbortSignal;

    constructor(data: Pick<TestTransportMockData, "inputMessage" | "inputComplete">, abort?: AbortSignal) {
        this.data = data;
        this.abort = abort;
    }

    send(message: T): Promise<void> {
        if (this.data.inputMessage instanceof RpcError) {
            return Promise.reject(this.data.inputMessage);
        }
        const delayMs = this.data.inputMessage === undefined
            ? 10
            : this.data.inputMessage;
        return Promise.resolve(undefined)
            .then(() => {
                this._sent.push(message);
            })
            .then(delay(delayMs, this.abort));
    }

    complete(): Promise<void> {
        if (this.data.inputComplete instanceof RpcError) {
            return Promise.reject(this.data.inputComplete);
        }
        const delayMs = this.data.inputComplete === undefined
            ? 10
            : this.data.inputComplete;
        return Promise.resolve(undefined)
            .then(() => {
                this._completed = true;
            })
            .then(delay(delayMs, this.abort));
    }


}
