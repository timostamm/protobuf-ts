import {REFLECTION_BRAND} from './reflection-brand';
import type {IMessageType} from './message-type-contract';
import type {UnknownMessage} from './unknown-types';

/**
 * Check if the provided object is a proto message.
 */
export function reflectionIsProtoMessage<T extends object>(msg: T): boolean {
    const msgType = (msg as UnknownMessage)[REFLECTION_BRAND];

    return msgType != null;
}

/**
 * Get a message type from a proto message.
 */
export function reflectionGetType<T extends object>(msg: T): IMessageType<T> {
    const msgType = (msg as UnknownMessage)[REFLECTION_BRAND];

    if (msgType == null) {
        throw Error('reflectionGetType: msg is not a protobuf message');
    }

    return msgType as IMessageType<T>;
}
