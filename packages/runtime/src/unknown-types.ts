/**
 * A message of unknown type.
 */
export interface UnknownMessage {
    [k: string]:
        | UnknownScalar
        | UnknownEnum
        | UnknownMessage
        | UnknownOneofGroup
        | UnknownMap
        | UnknownScalar[]
        | UnknownMessage[]
        | UnknownEnum[]
        | undefined;
}


/**
 * A map field of unknown type.
 */
export type UnknownMap<T = UnknownMessage | UnknownScalar | UnknownEnum> = {
    [key: string]: T;
};


/**
 * A scalar field of unknown type.
 */
export type UnknownScalar =
    | string
    | number
    | bigint
    | boolean
    | Uint8Array;


/**
 * A enum field of unknown type.
 */
export type UnknownEnum = number;


/**
 * A unknown oneof group. See `isOneofGroup()` for details.
 */
export type UnknownOneofGroup = {
    oneofKind: undefined | string;
    [k: string]:
        | UnknownScalar
        | UnknownEnum
        | UnknownMessage
        | undefined;
};
