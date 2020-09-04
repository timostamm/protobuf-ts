import {Deferred, DeferredState} from "./deferred";


/**
 * A stream of response messages. Messages can be read from
 * the stream via the AsyncIterable interface:
 *
 * ```typescript
 * for await (let message of response) {...
 * ```
 */
export interface RpcOutputStream<T extends object = object> extends AsyncIterable<T> {

    /**
     * Add a callback for every new datum.
     * If a new message arrived, the "message" argument is set.
     * If an error occurred, the "error" argument is set.
     * If no more messages will be arriving, the "done" argument is true.
     */
    onNext(callback: (message: T | undefined, error: Error | undefined, done: boolean) => void): RemoveListenerFn;

    /**
     * Add a callback for every new message.
     */
    onMessage(callback: (message: T) => void): RemoveListenerFn;

    /**
     * Add a callback for stream completion.
     * Called when all messages have been read without error.
     */
    onComplete(callback: () => void): RemoveListenerFn;

    /**
     * Add a callback for errors.
     * After an error occurred, the stream will no longer receive messages or
     * anything else.
     */
    onError(callback: (reason: Error) => void): RemoveListenerFn;

}


type NextCallback<T> = (message: T | undefined, error: Error | undefined, done: boolean) => void;

type RemoveListenerFn = () => void;


/**
 * A `RpcOutputStream` that you control.
 */
export class RpcOutputStreamController<T extends object = object> {

    /**
     * Is this stream already closed by a completion or error?
     */
    get closed(): boolean {
        return this._closed;
    }

    private readonly _onNextListeners: NextCallback<T>[] = [];
    private readonly _onMessageListeners: any[] = [];
    private readonly _onErrorListeners: any[] = [];
    private readonly _onCompleteListeners: any[] = [];
    private _pendingResult = new Deferred<IteratorResult<T, null>>();
    private _closed = false;


    constructor() {
    }

    private assertOpen() {
        if (this._closed)
            throw new Error('stream is already closed');
    }


    onNext(callback: NextCallback<T>): RemoveListenerFn {
        this._onNextListeners.push(callback);
        return () => {
            let i = this._onNextListeners.indexOf(callback);
            if (i >= 0)
                this._onNextListeners.splice(i, 1);
        };
    }

    onMessage(callback: (message: T) => void): RemoveListenerFn {
        this._onMessageListeners.push(callback);
        return () => {
            let i = this._onMessageListeners.indexOf(callback);
            if (i >= 0)
                this._onMessageListeners.splice(i, 1);
        };
    }

    onError(callback: (reason: Error) => void): RemoveListenerFn {
        this._onErrorListeners.push(callback);
        return () => {
            let i = this._onErrorListeners.indexOf(callback);
            if (i >= 0)
                this._onErrorListeners.splice(i, 1);
        };
    }

    onComplete(callback: () => void): RemoveListenerFn {
        this._onCompleteListeners.push(callback);
        return () => {
            let i = this._onCompleteListeners.indexOf(callback);
            if (i >= 0)
                this._onCompleteListeners.splice(i, 1);
        };
    }


    [Symbol.asyncIterator](): AsyncIterator<T> {
        if (!this._pendingResult) {
            return {
                next: () => Promise.resolve({
                    done: true,
                    value: null,
                })
            };
        }
        return {
            next: () => this._pendingResult.promise,
        };
    }

    /**
     * Emits a new message. Throws if stream is already closed.
     */
    notifyMessage(message: T): void {
        this.assertOpen();
        if (this._pendingResult.state === DeferredState.PENDING) {
            let cur = this._pendingResult;
            this._pendingResult = new Deferred<IteratorResult<T, null>>();
            cur.resolve({
                value: message,
                done: false,
            });
        }
        for (let i = 0; i < this._onMessageListeners.length; i++)
            this._onMessageListeners[i](message);
        for (let i = 0; i < this._onNextListeners.length; i++)
            this._onNextListeners[i](message, undefined, false);
    }

    /**
     * Closes the stream with an error. Throws if stream is already closed.
     */
    notifyError(error: Error): void {
        this.assertOpen();
        this._closed = true;
        this._pendingResult.rejectPending(error);
        for (let i = 0; i < this._onErrorListeners.length; i++)
            this._onErrorListeners[i](error);
        for (let i = 0; i < this._onNextListeners.length; i++)
            this._onNextListeners[i](undefined, error, true);
    }

    /**
     * Closes the stream successfully. Throws if stream is already closed.
     */
    notifyComplete(): void {
        this.assertOpen();
        this._closed = true;
        this._pendingResult.resolvePending({
            value: null,
            done: true,
        });
        for (let i = 0; i < this._onCompleteListeners.length; i++)
            this._onCompleteListeners[i]();
        for (let i = 0; i < this._onNextListeners.length; i++)
            this._onNextListeners[i](undefined, undefined, true);
        this._onErrorListeners.splice(0, this._onErrorListeners.length);
        this._onMessageListeners.splice(0, this._onMessageListeners.length);
        this._onCompleteListeners.splice(0, this._onCompleteListeners.length);
    }


}
