import type {JsonObject, JsonValue} from "./json-typings";
import {isJsonObject, typeofJsonValue} from "./json-typings";
import {base64decode} from "./base64";
import type {JsonReadOptions} from "./json-format-contract";
import type {EnumInfo, FieldInfo} from "./reflection-info";
import {LongType, PartialMessageInfo, ScalarType} from "./reflection-info";
import {PbLong, PbULong} from "./pb-long";
import {assert, assertFloat32, assertInt32, assertUInt32} from "./assert";
import {reflectionLongConvert} from "./reflection-long-convert";
import type {UnknownEnum, UnknownMessage, UnknownOneofGroup, UnknownScalar} from "./unknown-types";


/**
 * Reads proto3 messages in canonical JSON format using reflection information.
 *
 * https://developers.google.com/protocol-buffers/docs/proto3#json
 */
export class ReflectionJsonReader {

    /**
     * JSON key to field.
     * Accepts the original proto field name in the .proto, the
     * lowerCamelCase name, or the name specified by the json_name option.
     */
    private fMap?: { [k: string]: FieldInfo };


    constructor(private readonly info: PartialMessageInfo) {
    }


    protected prepare() {
        if (this.fMap === undefined) {
            this.fMap = {};
            const fieldsInput = this.info.fields ?? [];
            for (const field of fieldsInput) {
                this.fMap[field.name] = field;
                this.fMap[field.jsonName] = field;
                this.fMap[field.localName] = field;
            }
        }
    }



    // Cannot parse JSON <type of jsonValue> for <type name>#<fieldName>.
    assert(condition: any, fieldName: string, jsonValue: JsonValue): asserts condition {
        if (!condition) {
            let what: string = typeofJsonValue(jsonValue);
            if (what == "number" || what == "boolean")
                what = jsonValue!.toString();
            throw new Error(`Cannot parse JSON ${what} for ${this.info.typeName}#${fieldName}`);
        }
    }


    /**
     * Reads a message from canonical JSON format into the target message.
     *
     * Repeated fields are appended. Map entries are added, overwriting
     * existing keys.
     *
     * If a message field is already present, it will be merged with the
     * new data.
     */
    read<T extends object>(input: JsonObject, message: T, options: JsonReadOptions): void {
        this.prepare();
        const oneofsHandled: string[] = [];

        for (const [jsonKey, jsonValue] of Object.entries(input)) {
            const field = this.fMap![jsonKey]
            if (!field) {
                if (!options.ignoreUnknownFields)
                    throw new Error(`Found unknown field while reading ${this.info.typeName} from JSON format. JSON key: ${jsonKey}`);
                continue;
            }
            const localName = field.localName;

            // handle oneof ADT
            let target: UnknownMessage | UnknownOneofGroup; // this will be the target for the field value, whether it is member of a oneof or not
            if (field.oneof) {
                // since json objects are unordered by specification, it is not possible to take the last of multiple oneofs
                if (oneofsHandled.includes(field.oneof)) throw new Error(`Multiple members of the oneof group "${field.oneof}" of ${this.info.typeName} are present in JSON.`);
                oneofsHandled.push(field.oneof);
                target = (message as UnknownMessage)[field.oneof] = {
                    oneofKind: localName
                }
            } else {
                target = message as UnknownMessage;
            }


            // we have handled oneof above. we just have read the value into `target`.
            if (field.kind == 'map') {
                if (jsonValue === null) {
                    continue;
                }

                // check input
                this.assert(isJsonObject(jsonValue), field.name, jsonValue);

                // our target to put map entries into
                const fieldObj = target[localName] as { [k: string]: unknown };

                // read entries
                for (const [jsonObjKey, jsonObjValue] of Object.entries(jsonValue)) {

                    this.assert(jsonObjValue !== null, field.name + " map value", null);

                    // read value
                    let val;
                    switch (field.V.kind) {
                        case "message":
                            val = field.V.T().internalJsonRead(jsonObjValue, options);
                            break;

                        case "enum":
                            val = this.enum(field.V.T(), jsonObjValue, field.name, options.ignoreUnknownFields);
                            break;

                        case "scalar":
                            val = this.scalar(jsonObjValue, field.V.T, field.V.L, field.name);
                            break;
                    }
                    this.assert(val !== undefined, field.name + " map value", jsonObjValue);

                    // read key
                    let key: JsonValue = jsonObjKey;
                    if (field.K == ScalarType.BOOL)
                        key = key == "true" ? true : key == "false" ? false : key;
                    key = this.scalar(key, field.K, LongType.STRING, field.name).toString();
                    fieldObj[key] = val;
                }

            } else if (field.repeat) {
                if (jsonValue === null)
                    continue;

                // check input
                this.assert(Array.isArray(jsonValue), field.name, jsonValue);

                // our target to put array entries into
                const fieldArr = target[localName] as unknown[];

                // read array entries
                for (const jsonItem of jsonValue) {

                    this.assert(jsonItem !== null, field.name, null);

                    let val;
                    switch (field.kind) {
                        case "message":
                            val = field.T().internalJsonRead(jsonItem, options);
                            break;

                        case "enum":
                            val = this.enum(field.T(), jsonItem, field.name, options.ignoreUnknownFields);
                            break;

                        case "scalar":
                            val = this.scalar(jsonItem, field.T, field.L, field.name);
                            break;

                    }

                    this.assert(val !== undefined, field.name, jsonValue);
                    fieldArr.push(val);
                }

            } else {

                switch (field.kind) {

                    case "message":
                        if (jsonValue === null && field.T().typeName != 'google.protobuf.Value') {
                            this.assert(field.oneof === undefined, field.name + " (oneof member)", null);
                            continue;
                        }
                        target[localName] = field.T().internalJsonRead(jsonValue, options, target[localName]);
                        break;

                    case "enum":
                        target[localName] = this.enum(field.T(), jsonValue, field.name, options.ignoreUnknownFields);
                        break;

                    case "scalar":
                        target[localName] = this.scalar(jsonValue, field.T, field.L, field.name);
                        break;
                }

            }
        }
    }


    /**
     * google.protobuf.NullValue accepts only JSON `null`.
     */
    enum(type: EnumInfo, json: unknown, fieldName: string, ignoreUnknownFields = false): UnknownEnum {
        if (type[0] == 'google.protobuf.NullValue')
            assert(json === null, `Unable to parse field ${this.info.typeName}#${fieldName}, enum ${type[0]} only accepts null.`);
        if (json === null)
            // we require 0 to be default value for all enums
            return 0;
        switch (typeof json) {
            case "number":
                assert(Number.isInteger(json), `Unable to parse field ${this.info.typeName}#${fieldName}, enum can only be integral number, got ${json}.`);
                return json;
            case "string":
                let localEnumName = json;
                if (type[2] && json.substring(0, type[2].length) === type[2])
                    // lookup without the shared prefix
                    localEnumName = json.substring(type[2].length);
                let enumNumber = type[1][localEnumName];
                if (typeof enumNumber === 'undefined' && ignoreUnknownFields) {
                    return 0;
                }
                assert(typeof enumNumber == "number", `Unable to parse field ${this.info.typeName}#${fieldName}, enum ${type[0]} has no value for "${json}".`);
                return enumNumber;
        }
        assert(false, `Unable to parse field ${this.info.typeName}#${fieldName}, cannot parse enum value from ${typeof json}".`);
    }


    scalar(json: JsonValue, type: ScalarType, longType: LongType | undefined, fieldName: string): UnknownScalar {
        let e: string | undefined;
        try {

            switch (type) {

                // float, double: JSON value will be a number or one of the special string values "NaN", "Infinity", and "-Infinity".
                // Either numbers or strings are accepted. Exponent notation is also accepted.
                case ScalarType.DOUBLE:
                case ScalarType.FLOAT:
                    if (json === null)
                        return .0;
                    if (json === "NaN")
                        return Number.NaN;
                    if (json === "Infinity")
                        return Number.POSITIVE_INFINITY;
                    if (json === "-Infinity")
                        return Number.NEGATIVE_INFINITY;
                    if (json === "") {
                        e = "empty string";
                        break;
                    }
                    if (typeof json == "string" && json.trim().length !== json.length) {
                        e = "extra whitespace";
                        break;
                    }
                    if (typeof json != "string" && typeof json != "number") {
                        break;
                    }
                    let float = Number(json);
                    if (Number.isNaN(float)) {
                        e = "not a number";
                        break;
                    }
                    if (!Number.isFinite(float)) {
                        // infinity and -infinity are handled by string representation above, so this is an error
                        e = "too large or small";
                        break;
                    }
                    if (type == ScalarType.FLOAT)
                        assertFloat32(float);
                    return float;


                // int32, fixed32, uint32: JSON value will be a decimal number. Either numbers or strings are accepted.
                case ScalarType.INT32:
                case ScalarType.FIXED32:
                case ScalarType.SFIXED32:
                case ScalarType.SINT32:
                case ScalarType.UINT32:
                    if (json === null)
                        return 0;
                    let int32: number | undefined;
                    if (typeof json == "number")
                        int32 = json;
                    else if (json === "")
                        e = "empty string";
                    else if (typeof json == "string") {
                        if (json.trim().length !== json.length)
                            e = "extra whitespace";
                        else
                            int32 = Number(json);
                    }
                    if (int32 === undefined)
                        break;
                    if (type == ScalarType.UINT32)
                        assertUInt32(int32);
                    else
                        assertInt32(int32);
                    return int32;


                // int64, fixed64, uint64: JSON value will be a decimal string. Either numbers or strings are accepted.
                case ScalarType.INT64:
                case ScalarType.SFIXED64:
                case ScalarType.SINT64:
                    if (json === null)
                        return reflectionLongConvert(PbLong.ZERO, longType);
                    if (typeof json != "number" && typeof json != "string")
                        break;
                    return reflectionLongConvert(PbLong.from(json), longType);

                case ScalarType.FIXED64:
                case ScalarType.UINT64:
                    if (json === null)
                        return reflectionLongConvert(PbULong.ZERO, longType);
                    if (typeof json != "number" && typeof json != "string")
                        break;
                    return reflectionLongConvert(PbULong.from(json), longType);

                // bool:
                case ScalarType.BOOL:
                    if (json === null)
                        return false;
                    if (typeof json !== "boolean")
                        break;
                    return json;

                // string:
                case ScalarType.STRING:
                    if (json === null)
                        return "";
                    if (typeof json !== "string") {
                        e = "extra whitespace";
                        break;
                    }
                    try {
                        encodeURIComponent(json);
                    } catch (e) {
                        e = "invalid UTF8";
                        break;
                    }
                    return json;

                // bytes: JSON value will be the data encoded as a string using standard base64 encoding with paddings.
                // Either standard or URL-safe base64 encoding with/without paddings are accepted.
                case ScalarType.BYTES:
                    if (json === null || json === "")
                        return new Uint8Array(0);
                    if (typeof json !== 'string')
                        break;
                    return base64decode(json);

            }
        } catch (error) {
            e = error.message;
        }
        this.assert(false, fieldName + (e ? " - " + e : ""), json);
    }

}
