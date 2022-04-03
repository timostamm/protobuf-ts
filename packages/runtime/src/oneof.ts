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
 * 2) Must have a "kind" discriminator property.
 *
 * 3) If "kind" is `undefined`, no member field is selected. The object
 * must not have any other properties.
 *
 * 4) If "kind" is a `string`, the member field with this name is
 * selected.
 *
 * 5) If a member field is selected, the object must have a second property
 * `value` that contains the field's value. The property must not be `undefined`.
 *
 * 6) No extra properties are allowed. The object has either one property
 * (no selection) or two properties (selection).
 *
 */
export function isOneofGroup(any: any): any is UnknownOneofGroup {
    if (typeof any != 'object' || any === null || !any.hasOwnProperty('kind')) {
        return false;
    }
    switch (typeof any.kind) {
        case "string":
            if (any.value === undefined || !any.hasOwnProperty('value'))
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
    K extends T extends { kind: string }
        ? T["kind"]
        : never,
    V extends T extends { kind: K }
        ? T["value"]
        : never,
    >(
    oneof: T, kind: K
): V | undefined {
    if (oneof.kind === kind) return oneof.value as V;
}


/**
 * Selects the given field in a oneof group.
 *
 * Note that the recommended way to modify a oneof group is to set
 * a new object:
 *
 * ```ts
 * message.result = {
 *   kind: "error",
 *   value: "foo"
 * };
 * ```
 */
export function setOneofValue<T extends UnknownOneofGroup,
    K extends T["kind"],
    V extends T extends { kind: K }
        ? T["value"]
        : never,
    >(oneof: T, kind: K, value: V): void;
export function setOneofValue<T extends UnknownOneofGroup>(oneof: T, kind: undefined, value?: undefined): void;
export function setOneofValue(oneof: any, kind: any, value?: any): void {
    if (oneof.kind !== undefined) {
        delete oneof.value;
    }
    oneof.kind = kind;
    if (value !== undefined) {
        oneof.value = value;
    }
}


/**
 * Selects the given field in a oneof group, just like `setOneofValue()`,
 * but works with unknown oneof groups.
 */
export function setUnknownOneofValue(oneof: UnknownOneofGroup, kind: string, value: UnknownScalar | UnknownEnum | UnknownMessage): void;
export function setUnknownOneofValue(oneof: UnknownOneofGroup, kind: undefined, value?: undefined): void;
export function setUnknownOneofValue(oneof: UnknownOneofGroup, kind?: string, value?: any): void {
    if (oneof.kind !== undefined) {
        delete oneof.value;
    }
    oneof.kind = kind;
    if (value !== undefined && kind !== undefined) {
        oneof.value = value;
    }
}


/**
 * Removes the selected field in a oneof group.
 *
 * Note that the recommended way to modify a oneof group is to set
 * a new object:
 *
 * ```ts
 * message.result = { kind: undefined };
 * ```
 */
export function clearOneofValue<T extends UnknownOneofGroup>(oneof: T) {
    if (oneof.kind !== undefined) {
        delete oneof.value;
    }
    oneof.kind = undefined;
}


/**
 * Returns the selected value of the given oneof group.
 *
 * Not that the recommended way to access a oneof group is to check
 * the "kind" property and let TypeScript narrow down the union
 * type for you:
 *
 * ```ts
 * if (message.result.kind === "error") {
 *   message.result.value; // string
 * }
 * ```
 *
 * In the rare case you just need the value, and do not care about
 * which protobuf field is selected, you can use this function
 * for convenience.
 */
export function getSelectedOneofValue<T extends UnknownOneofGroup, V extends T["value"]>(oneof: T): V {
    return oneof.value as V;
}


