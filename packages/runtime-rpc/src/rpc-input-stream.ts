/**
 * A stream of input messages.
 *
 * Heads up! At the moment, client streaming and duplex RPC are not
 * implemented and this class is nothing more than a placeholder for now.
 */
export abstract class RpcInputStream<T> {

    completed: boolean = false;

    send(message: T): Promise<void> {
        throw new Error('not implemented');
    }

    complete(): Promise<void> {
        throw new Error('not implemented');
    }
}
