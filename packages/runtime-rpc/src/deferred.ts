export const enum DeferredState {
    PENDING,
    REJECTED,
    RESOLVED
}

/**
 * A deferred promise. This is a "controller" for a promise,
 * which lets you pass a promise around and reject or resolve
 * it from the outside.
 *
 * The actual promise is only created when the "promise"
 * property is accessed.
 */
export class Deferred<T> {

    /**
     * Get the current state of the promise.
     */
    get state() {
        return this._state;
    }

    /**
     * Has the promise been acquired by accessing the "promise"
     * property?
     */
    get hot(): boolean {
        return !!this._promise;
    }

    /**
     * Get the underlying promise.
     * This changes the state from COLD to PENDING.
     */
    get promise(): Promise<T> {
        if (this._promise)
            return this._promise;

        switch (this._state) {
            case DeferredState.PENDING:
                if (!this._promise) {
                    this._promise = new Promise<T>((resolve, reject) => {
                            this._resolve = resolve;
                            this._reject = reject;
                        }
                    )
                }
                return this._promise!;

            case DeferredState.REJECTED:
                if (!this._promise)
                    if (!this.coldReject)
                        throw new Error('broken state');
                    else
                        this._promise = Promise.reject(this.coldReject.reason);
                return this._promise;

            case DeferredState.RESOLVED:
                if (!this._promise)
                    if (!this.coldResolve)
                        throw new Error('broken state');
                    else
                        this._promise = Promise.resolve(this.coldResolve.value);
                return this._promise;

        }
    }

    private _state = DeferredState.PENDING;

    private coldReject: undefined | {
        reason: any;
    };

    private coldResolve: undefined | {
        value: T | PromiseLike<T>;
    };

    private _promise: Promise<T> | undefined;
    private _resolve: any;
    private _reject: any;


    constructor() {
    }


    /**
     * Resolve the promise. Throws if the promise is already resolved or rejected.
     */
    resolve(value: T | PromiseLike<T>): void {
        if (this._state !== DeferredState.PENDING)
            throw new Error('cannot reject ' + this.state);

        this._state = DeferredState.RESOLVED;
        if (this._resolve)
            this._resolve(value);
        else
            this.coldResolve = {value};
    }


    /**
     * Reject the promise. Throws if the promise is pending.
     */
    reject(reason: any): void {
        if (this._state !== DeferredState.PENDING)
            throw new Error('cannot reject ' + this.state);

        this._state = DeferredState.REJECTED;
        if (this._reject)
            this._reject(reason);
        else
            this.coldReject = {reason};
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
