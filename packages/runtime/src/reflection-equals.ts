import type {MessageInfo} from "./reflection-info";
import {ScalarType} from "./reflection-info";
import type {IMessageType} from "./message-type-contract";
import type {UnknownEnum, UnknownMap, UnknownMessage, UnknownOneofGroup, UnknownScalar} from "./unknown-types";


/**
 * Determines whether two message of the same type have the same field values.
 * Checks for deep equality, traversing repeated fields, oneof groups, maps
 * and messages recursively.
 * Will also return true if both messages are `undefined`.
 */
export function reflectionEquals(info: MessageInfo, a: UnknownMessage | undefined, b: UnknownMessage | undefined): boolean {
    if (a === b)
        return true;
    if (!a || !b)
        return false;
    for (let field of info.fields) {
        let localName = field.localName;
        let val_a = field.oneof ? (a[field.oneof] as UnknownOneofGroup)[localName] : a[localName];
        let val_b = field.oneof ? (b[field.oneof] as UnknownOneofGroup)[localName] : b[localName];
        switch (field.kind) {
            case "enum":
            case "scalar":
                let t = field.kind == "enum" ? ScalarType.INT32 : field.T;
                if (!(field.repeat
                    ? repeatedPrimitiveEq(t, val_a as Array<UnknownScalar | UnknownEnum>, val_b as Array<UnknownScalar | UnknownEnum>)
                    : primitiveEq(t, val_a as UnknownScalar | UnknownEnum, val_b as UnknownScalar | UnknownEnum)))
                    return false;
                break;
            case "map":
                if (!(field.V.kind == "message"
                    ? repeatedMsgEq(field.V.T(), objectValues(val_a as UnknownMap<UnknownMessage>), objectValues(val_b as UnknownMap<UnknownMessage>))
                    : repeatedPrimitiveEq(
                        field.V.kind == "enum" ? ScalarType.INT32 : field.V.T,
                        objectValues(val_a as UnknownMap<UnknownScalar | UnknownEnum>),
                        objectValues(val_b as UnknownMap<UnknownScalar | UnknownEnum>))))
                    return false;
                break;
            case "message":
                let T = field.T();
                if (!(field.repeat
                    ? repeatedMsgEq(T, val_a as Array<UnknownMessage>, val_b as Array<UnknownMessage>)
                    : T.equals(val_a, val_b)))
                    return false;
                break;
        }
    }
    return true;
}


const objectValues = Object.values;

function primitiveEq(type: ScalarType, a: UnknownScalar, b: UnknownScalar): boolean {
    if (a === b)
        return true;
    if (type !== ScalarType.BYTES)
        return false;
    let ba = a as Uint8Array;
    let bb = b as Uint8Array;
    if (ba.length !== bb.length)
        return false;
    for (let i = 0; i < ba.length; i++)
        if (ba[i] != bb[i])
            return false;
    return true;
}

function repeatedPrimitiveEq(type: ScalarType, a: Array<UnknownScalar | UnknownEnum>, b: Array<UnknownScalar | UnknownEnum>): boolean {
    if (a.length !== b.length)
        return false;
    for (let i = 0; i < a.length; i++)
        if (!primitiveEq(type, a[i], b[i]))
            return false;
    return true;
}

function repeatedMsgEq<T extends object>(type: IMessageType<T>, a: Array<T>, b: Array<T>): boolean {
    if (a.length !== b.length)
        return false;
    for (let i = 0; i < a.length; i++)
        if (!type.equals(a[i], b[i]))
            return false;
    return true;
}



