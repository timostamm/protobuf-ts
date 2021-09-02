import {IMessageType, MESSAGE_TYPE} from './message-type-contract';

/**
 * The interface that models storing type in a symbol property.
 */
export interface MessageTypeContainer<T extends object> {
    [MESSAGE_TYPE]: IMessageType<T>;
}

/**
 * Check if the provided object is a proto message.
 */
export function containsMessageType<T extends object>(msg: T): msg is (T & MessageTypeContainer<T>) {
    return (msg as MessageTypeContainer<T>)[MESSAGE_TYPE] != null;
}
