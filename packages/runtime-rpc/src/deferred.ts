export enum DeferredState {
    PENDING,
    REJECTED,
    RESOLVED
}

/**
 * A deferred promise. This is a "controller" for a promise, which lets you
 * pass a promise around and reject or resolve it from the outside.
 *
 * Warning: This class is to be used with care. Using it can make code very
 * difficult to read. It is intended for use in library code that exposes
 * promises, not for regular business logic.
 */
export class Deferred<T> {

    /**
     * Get the current state of the promise.
     */
    get state(): DeferredState {
        return this._state;
    }

    /**
     * Get the deferred promise.
     */
    get promise(): Promise<T> {
        return this._promise;
    }

    private readonly _promise: Promise<T>;
    private _state: DeferredState = DeferredState.PENDING;
    // @ts-ignore
    private _resolve: (value: T | PromiseLike<T>) => void;
    // @ts-ignore
    private _reject: (reason?: any) => void;


    constructor() {
        this._promise = new Promise<T>((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }


    /**
     * Resolve the promise. Throws if the promise is already resolved or rejected.
     */
    resolve(value: T | PromiseLike<T>): void {
        if (this.state !== DeferredState.PENDING)
            throw new Error(`cannot resolve ${DeferredState[this.state].toLowerCase()}`);
        this._resolve(value);
        this._state = DeferredState.RESOLVED;
    }


    /**
     * Reject the promise. Throws if the promise is already resolved or rejected.
     */
    reject(reason: any): void {
        if (this.state !== DeferredState.PENDING)
            throw new Error(`cannot reject ${DeferredState[this.state].toLowerCase()}`);
        this._reject(reason);
        this._state = DeferredState.REJECTED;
    }


    /**
     * Resolve the promise. Ignore if not pending.
     */
    resolvePending(val: T | PromiseLike<T>): void {
        if (this._state === DeferredState.PENDING)
            this.resolve(val);
    }


    /**
     * Reject the promise. Ignore if not pending.
     */
    rejectPending(reason: any): void {
        if (this._state === DeferredState.PENDING)
            this.reject(reason);
    }

}
