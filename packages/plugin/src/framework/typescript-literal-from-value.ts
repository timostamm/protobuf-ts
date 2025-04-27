import {assertNever} from "@protobuf-ts/runtime";
import * as ts from "typescript";


export type SimpleJsValue =
    | string
    | number
    | bigint
    | boolean
    | undefined
    | null
    | SimpleJsValue[]
    | { [k: string]: SimpleJsValue }
    | TypedArray
    ;

type TypedArray =
    | Uint8Array
    | Int8Array
    | Uint8ClampedArray
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array
    | Float64Array;


const validPropertyKey = /^(?![0-9])[a-zA-Z0-9$_]+$/;


/**
 * Creates nodes for simple JavaScript values.
 *
 * Simple JavaScript values include:
 * - all primitives: number, bigint, string, boolean
 * - undefined, null
 * - plain objects containing only simple JavaScript values
 * - arrays containing only simple JavaScript values
 * - typed arrays
 */
export function typescriptLiteralFromValue(value: SimpleJsValue): ts.Expression {
    switch (typeof value) {
        case "undefined":
            return ts.createIdentifier("undefined");
        case "boolean":
            return value ? ts.createTrue() : ts.createFalse();
        case "string":
            return ts.createStringLiteral(value);
        case "bigint":
            return ts.createNumericLiteral(`${value}n`);
        case "number":
            if (isNaN(value)) {
                return ts.createPropertyAccess(
                    ts.createIdentifier("Number"),
                    ts.createIdentifier("Nan")
                );
            } else if (value === Number.POSITIVE_INFINITY) {
                return ts.createPropertyAccess(
                    ts.createIdentifier("Number"),
                    ts.createIdentifier("POSITIVE_INFINITY")
                );
            } else if (value === Number.NEGATIVE_INFINITY) {
                return ts.createPropertyAccess(
                    ts.createIdentifier("Number"),
                    ts.createIdentifier("NEGATIVE_INFINITY")
                );
            }
            return ts.createNumericLiteral(`${value}`);
        case "object":
            if (value === null) {
                return ts.createNull();
            }
            if (isTypedArray(value)) {
                if (value.length == 0) {
                    return ts.createNew(
                        ts.createIdentifier(typedArrayName(value)), undefined, [ts.createNumericLiteral("0")]
                    );
                }
                let values: ts.NumericLiteral[] = [];
                for (let i = 0; i < value.length; i++) {
                    values.push(ts.createNumericLiteral(value.toString()));
                }
                return ts.createNew(
                    ts.createIdentifier(typedArrayName(value)), undefined, [ts.createArrayLiteral(values, false)]
                );
            }
            if (Array.isArray(value)) {
                let elements = value.map(ele => typescriptLiteralFromValue(ele));
                return ts.createArrayLiteral(elements, false);
            }
            if (value.constructor !== Object) {
                throw new Error(`got a non-plain object ${value.constructor}`);
            }
            let props: ts.PropertyAssignment[] = [];
            for (let key of Object.keys(value)) {
                let propName = validPropertyKey.test(key) ? key : ts.createStringLiteral(key);
                let propVal = typescriptLiteralFromValue(value[key]);
                props.push(
                    ts.createPropertyAssignment(propName, propVal)
                );
            }
            return ts.createObjectLiteral(props, false);
    }
    assertNever(value);
}


function isTypedArray(arg: any): arg is TypedArray {
    return arg instanceof Uint8Array
        || arg instanceof Int8Array
        || arg instanceof Uint8ClampedArray
        || arg instanceof Int16Array
        || arg instanceof Uint16Array
        || arg instanceof Int32Array
        || arg instanceof Uint32Array
        || arg instanceof Float32Array
        || arg instanceof Float64Array;
}


function typedArrayName(arg: TypedArray): string {
    if (arg instanceof Uint8Array) {
        return 'Uint8Array';
    }
    if (arg instanceof Int8Array) {
        return 'Int8Array';
    }
    if (arg instanceof Uint8ClampedArray) {
        return 'Uint8ClampedArray';
    }
    if (arg instanceof Int16Array) {
        return 'Int16Array';
    }
    if (arg instanceof Uint16Array) {
        return 'Uint16Array';
    }
    if (arg instanceof Int32Array) {
        return 'Int32Array';
    }
    if (arg instanceof Uint32Array) {
        return 'Uint32Array';
    }
    if (arg instanceof Float32Array) {
        return 'Float32Array';
    }
    return 'Float64Array';
}
