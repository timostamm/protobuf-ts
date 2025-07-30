import type {UnknownEnum, UnknownMessage, UnknownOneofGroup, UnknownScalar} from "./unknown-types";


/**
 * Is the given value a valid oneof group?
 *
 * We represent protobuf `oneof` as algebraic data types (ADT) in generated
 * code. But when working with messages of unknown type, the ADT does not
 * help us.
 *
 * This type guard checks if the given object adheres to the ADT rules, which
 * are as follows:
 *
 * 1) Must be an object.
 *
 * 2) Must have a "oneofKind" discriminator property.
 *
 * 3) If "oneofKind" is `undefined`, no member field is selected. The object
 * must not have any other properties.
 *
 * 4) If "oneofKind" is a `string`, the member field with this name is
 * selected.
 *
 * 5) If a member field is selected, the object must have a second property
 * with this name. The property must not be `undefined`.
 *
 * 6) No extra properties are allowed. The object has either one property
 * (no selection) or two properties (selection).
 *
 */
export function isOneofGroup(any: any): any is UnknownOneofGroup {
    if (typeof any != 'object' || any === null || !any.hasOwnProperty('oneofKind')) {
        return false;
    }
    switch (typeof any.oneofKind) {
        case "string":
            if (any[any.oneofKind] === undefined)
                return false;
            return Object.keys(any).length == 2;
        case "undefined":
            return Object.keys(any).length == 1;
        default:
            return false;
    }
}


/**
 * Returns the value of the given field in a oneof group.
 */
export function getOneofValue<T extends UnknownOneofGroup,
    K extends T extends { oneofKind: keyof T }
        ? T["oneofKind"]
        : never,
    V extends T extends { oneofKind: K }
        ? T[K]
        : never,
    >(
    oneof: T, kind: K
): V | undefined {
    return oneof[kind] as any;
}


/**
 * Selects the given field in a oneof group.
 *
 * Note that the recommended way to modify a oneof group is to set
 * a new object:
 *
 * ```ts
 * message.result = {
 *   oneofKind: "error",
 *   error: "foo"
 * };
 * ```
 */
export function setOneofValue<T extends UnknownOneofGroup,
    K extends T extends { oneofKind: keyof T }
        ? T["oneofKind"]
        : never,
    V extends T extends { oneofKind: K }
        ? T[K]
        : never,
    >(oneof: T, kind: K, value: V): void;
export function setOneofValue<T extends UnknownOneofGroup>(oneof: T, kind: undefined, value?: undefined): void;
export function setOneofValue(oneof: any, kind: any, value?: any): void {
    if (oneof.oneofKind !== undefined) {
        delete oneof[oneof.oneofKind];
    }
    oneof.oneofKind = kind;
    if (value !== undefined) {
        oneof[kind] = value;
    }
}


/**
 * Selects the given field in a oneof group, just like `setOneofValue()`,
 * but works with unknown oneof groups.
 */
export function setUnknownOneofValue(oneof: UnknownOneofGroup, kind: string, value: UnknownScalar | UnknownEnum | UnknownMessage): void;
export function setUnknownOneofValue(oneof: UnknownOneofGroup, kind: undefined, value?: undefined): void;
export function setUnknownOneofValue(oneof: UnknownOneofGroup, kind?: string, value?: any): void {
    if (oneof.oneofKind !== undefined) {
        delete oneof[oneof.oneofKind];
    }
    oneof.oneofKind = kind;
    if (value !== undefined && kind !== undefined) {
        oneof[kind] = value;
    }
}


/**
 * Removes the selected field in a oneof group.
 *
 * Note that the recommended way to modify a oneof group is to set
 * a new object:
 *
 * ```ts
 * message.result = { oneofKind: undefined };
 * ```
 */
export function clearOneofValue<T extends UnknownOneofGroup>(oneof: T) {
    if (oneof.oneofKind !== undefined) {
        delete oneof[oneof.oneofKind];
    }
    oneof.oneofKind = undefined;
}


/**
 * Returns the selected value of the given oneof group.
 *
 * Not that the recommended way to access a oneof group is to check
 * the "oneofKind" property and let TypeScript narrow down the union
 * type for you:
 *
 * ```ts
 * if (message.result.oneofKind === "error") {
 *   message.result.error; // string
 * }
 * ```
 *
 * In the rare case you just need the value, and do not care about
 * which protobuf field is selected, you can use this function
 * for convenience.
 */
export function getSelectedOneofValue<T extends UnknownOneofGroup,
    V extends string extends keyof T ? UnknownOneofGroup[string]
        : T extends { oneofKind: keyof T } ? T[T["oneofKind"]]
            : never>(oneof: T): V | undefined {
    if (oneof.oneofKind === undefined) {
        return undefined;
    }
    return oneof[oneof.oneofKind] as any;
}


export function intoOneof<T, U extends { [key: string]: T} > (x: U): U & { oneofKind: keyof U} {
  return {
    ...x,
    oneofKind: Object.keys(x)[0]
  }
}


