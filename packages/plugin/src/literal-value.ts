import {Printable} from "./printable";
import {createLiteralArray, createLiteralString,} from "@bufbuild/protoplugin-print";

export function literalValue(value: unknown): Printable {
    switch (typeof value) {
        case "string":
            return createLiteralString(value);
        case "boolean":
        case "number":
        case "bigint":
            return value;
        case "undefined":
            return "undefined";
        case "object":
            if (value === null) {
                return "null";
            }
            if (value instanceof Uint8Array) {
                return value;
            }
            if (Array.isArray(value)) {
                return createLiteralArray(value.map(literalValue));
            }
            if (value.constructor === Object) {

                // TODO return literals as is

                const props: Printable[] = [];
                for (let [k, v] of Object.entries(value)) {
                    if (props.length > 0) {
                        props.push(", ");
                    }
                    const key: Printable = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(k) ? k : createLiteralString(k);
                    props.push(key, ": ", literalValue(v));
                }
                if (props.length === 0) {
                    return "{}";
                }
                return ["{ ", props, " }"];
            }
            break;
    }
    throw new Error(`Value ${value} ${typeof value} is not supported`);
}