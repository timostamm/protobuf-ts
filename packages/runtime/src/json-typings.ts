/**
 * Represents any possible JSON value:
 * - number
 * - string
 * - boolean
 * - null
 * - object (with any JSON value as property)
 * - array (with any JSON value as element)
 */
export type JsonValue = number | string | boolean | null | JsonObject | JsonArray;


/**
 * Represents a JSON object.
 */
export type JsonObject = { [k: string]: JsonValue };


// should be replaced by JsonValue = ... JsonValue[] but that throws off jasmine toEqual with TS2589
interface JsonArray extends Array<JsonValue> {
}


/**
 * Get the type of a JSON value.
 * Distinguishes between array, null and object.
 */
export function typeofJsonValue(value: JsonValue | undefined): 'string' | 'number' | 'object' | 'array' | 'null' | 'boolean' | 'undefined' {
    let t = typeof value;
    if (t == "object") {
        if (Array.isArray(value))
            return "array";
        if (value === null)
            return "null"
    }
    return t as any;
}

/**
 * Is this a JSON object (instead of an array or null)?
 */
export function isJsonObject(value: JsonValue): value is JsonObject {
    return value !== null && typeof value == "object" && !Array.isArray(value);
}
