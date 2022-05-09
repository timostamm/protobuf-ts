import {Deferred, DeferredState} from "./deferred";
import {assert} from "@chippercash/protobuf-runtime";


/**
 * A stream of response messages. Messages can be read from the stream via
 * the AsyncIterable interface:
 *
 * ```typescript
 * for await (let message of response) {...
 * ```
 *
 * Some things to note:
 * - If an error occurs, the `for await` will throw it.
 * - If an error occurred before the `for await` was started, `for await`
 *   will re-throw it.
 * - If the stream is already complete, the `for await` will be empty.
 * - If your `for await` consumes slower than the stream produces,
 *   for example because you are relaying messages in a slow operation,
 *   messages are queued.
 */
export interface RpcOutputStream<T extends object = object> extends AsyncIterable<T> {

    /**
     * Add a callback for every new datum.
     * If a new message arrived, the "message" argument is set.
     * If an error occurred, the "error" argument is set.
     * If the stream is complete, the "complete" argument is `true`.
     * Only one of the arguments is used at a time.
     */
    onNext(callback: NextCallback<T>): RemoveListenerFn;

    /**
     * Add a callback for every new message.
     */
    onMessage(callback: MessageCallback<T>): RemoveListenerFn;

    /**
     * Add a callback for stream completion.
     * Called only when all messages have been read without error.
     * The stream is closed when this callback is called.
     */
    onComplete(callback: CompleteCallback): RemoveListenerFn;

    /**
     * Add a callback for errors.
     * The stream is closed when this callback is called.
     */
    onError(callback: ErrorCallback): RemoveListenerFn;

}


type NextCallback<T extends object> = (message: T | undefined, error: Error | undefined, complete: boolean) => void;
type MessageCallback<T extends object> = (message: T) => void;
type CompleteCallback = () => void;
type ErrorCallback = (reason: Error) => void;
type RemoveListenerFn = () => void;


/**
 * A `RpcOutputStream` that you control.
 */
export class RpcOutputStreamController<T extends object = object> {


    constructor() {
    }


    // --- RpcOutputStream callback API

    onNext(callback: NextCallback<T>): RemoveListenerFn {
        return this.addLis(callback, this._lis.nxt);
    }

    onMessage(callback: MessageCallback<T>): RemoveListenerFn {
        return this.addLis(callback, this._lis.msg);
    }

    onError(callback: ErrorCallback): RemoveListenerFn {
        return this.addLis(callback, this._lis.err);
    }

    onComplete(callback: CompleteCallback): RemoveListenerFn {
        return this.addLis(callback, this._lis.cmp);
    }

    private addLis<C>(callback: C, list: C[]): RemoveListenerFn {
        list.push(callback);
        return () => {
            let i = list.indexOf(callback);
            if (i >= 0)
                list.splice(i, 1);
        };
    }

    // remove all listeners
    private clearLis(): void {
        for (let l of Object.values(this._lis))
            l.splice(0, l.length);
    }

    private readonly _lis = {
        nxt: [] as NextCallback<T>[],
        msg: [] as MessageCallback<T>[],
        err: [] as ErrorCallback[],
        cmp: [] as CompleteCallback[],
    };


    // --- Controller API

    /**
     * Is this stream already closed by a completion or error?
     */
    get closed(): boolean {
        return this._closed !== false;
    }

    /**
     * Emit message, close with error, or close successfully, but only one
     * at a time.
     * Can be used to wrap a stream by using the other stream's `onNext`.
     */
    notifyNext(message: T | undefined, error: Error | undefined, complete: boolean): void {
        assert((message ? 1 : 0) + (error ? 1 : 0) + (complete ? 1 : 0) <= 1, 'only one emission at a time');
        if (message)
            this.notifyMessage(message);
        if (error)
            this.notifyError(error);
        if (complete)
            this.notifyComplete();
    }

    /**
     * Emits a new message. Throws if stream is closed.
     *
     * Triggers onNext and onMessage callbacks.
     */
    notifyMessage(message: T): void {
        assert(!this.closed, 'stream is closed');
        this.pushIt({value: message, done: false});
        this._lis.msg.forEach(l => l(message));
        this._lis.nxt.forEach(l => l(message, undefined, false));
    }

    /**
     * Closes the stream with an error. Throws if stream is closed.
     *
     * Triggers onNext and onError callbacks.
     */
    notifyError(error: Error): void {
        assert(!this.closed, 'stream is closed');
        this._closed = error;
        this.pushIt(error);
        this._lis.err.forEach(l => l(error));
        this._lis.nxt.forEach(l => l(undefined, error, false));
        this.clearLis();
    }

    /**
     * Closes the stream successfully. Throws if stream is closed.
     *
     * Triggers onNext and onComplete callbacks.
     */
    notifyComplete(): void {
        assert(!this.closed, 'stream is closed');
        this._closed = true;
        this.pushIt({value: null, done: true});
        this._lis.cmp.forEach(l => l());
        this._lis.nxt.forEach(l => l(undefined, undefined, true));
        this.clearLis();
    }

    private _closed: false | true | Error = false;


    // --- RpcOutputStream async iterator API


    // iterator state.
    // is undefined when no iterator has been acquired yet.
    private _itState: undefined | {
        // a pending result. we yielded that because we were
        // waiting for messages at the time.
        p?: Deferred<IteratorResult<T, null>>,

        // a queue of results that we produced faster that the iterator consumed
        q: Array<IteratorResult<T, null> | Error>,
    };


    /**
     * Creates an async iterator (that can be used with `for await {...}`)
     * to consume the stream.
     *
     * Some things to note:
     * - If an error occurs, the `for await` will throw it.
     * - If an error occurred before the `for await` was started, `for await`
     *   will re-throw it.
     * - If the stream is already complete, the `for await` will be empty.
     * - If your `for await` consumes slower than the stream produces,
     *   for example because you are relaying messages in a slow operation,
     *   messages are queued.
     */
    [Symbol.asyncIterator](): AsyncIterator<T> {

        // init the iterator state, enabling pushIt()
        if (!this._itState) {
            this._itState = {q: []};
        }

        // if we are closed, we are definitely not receiving any more messages.
        // but we can't let the iterator get stuck. we want to either:
        // a) finish the new iterator immediately, because we are completed
        // b) reject the new iterator, because we errored
        if (this._closed === true)
            this.pushIt({value: null, done: true});
        else if (this._closed !== false)
            this.pushIt(this._closed);

        // the async iterator
        return {
            next: () => {
                let state = this._itState;
                assert(state, "bad state"); // if we don't have a state here, code is broken

                // there should be no pending result.
                // did the consumer call next() before we resolved our previous result promise?
                assert(!state.p, "iterator contract broken");

                // did we produce faster than the iterator consumed?
                // return the oldest result from the queue.
                let first = state.q.shift();
                if (first)
                    return ("value" in first) ? Promise.resolve(first) : Promise.reject(first);

                // we have no result ATM, but we promise one.
                // as soon as we have a result, we must resolve promise.
                state.p = new Deferred<IteratorResult<T, null>>();
                return state.p.promise;
            },
        };
    }


    // "push" a new iterator result.
    // this either resolves a pending promise, or enqueues the result.
    private pushIt(result: IteratorResult<T, null> | Error): void {
        let state = this._itState;
        if (!state)
            return;

        // is the consumer waiting for us?
        if (state.p) {
            // yes, consumer is waiting for this promise.
            const p = state.p;
            assert(p.state == DeferredState.PENDING, "iterator contract broken");

            // resolve the promise
            ("value" in result) ? p.resolve(result) : p.reject(result);

            // must cleanup, otherwise iterator.next() would pick it up again.
            delete state.p;

        } else {
            // we are producing faster than the iterator consumes.
            // push result onto queue.
            state.q.push(result);
        }
    }


}
