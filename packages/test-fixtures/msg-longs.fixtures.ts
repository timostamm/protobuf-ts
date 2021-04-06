import type {Fixture} from "./index";

/**
 * Bytes of the file `msg-longs.bin`
 *
 * This data is generated using the `spec.LongsMessage`
 * using Grpc.AspNetCore v2.30.0 (C#).
 *
 * Each field has the appropriate minimum or maximum
 * value of the native type.
 */
export const msg_longs_bytes = new Uint8Array([17, 255, 255, 255, 255, 255, 255, 255, 255, 24, 128, 128, 128, 128, 128, 128, 128, 128, 128, 1, 32, 255, 255, 255, 255, 255, 255, 255, 255, 127, 41, 0, 0, 0, 0, 0, 0, 0, 128, 49, 255, 255, 255, 255, 255, 255, 255, 127, 56, 255, 255, 255, 255, 255, 255, 255, 255, 255, 1, 64, 254, 255, 255, 255, 255, 255, 255, 255, 255, 1, 80, 255, 255, 255, 255, 255, 255, 255, 255, 255, 1, 97, 255, 255, 255, 255, 255, 255, 255, 255, 104, 128, 128, 128, 128, 128, 128, 128, 128, 128, 1, 112, 255, 255, 255, 255, 255, 255, 255, 255, 127, 121, 0, 0, 0, 0, 0, 0, 0, 128, 129, 1, 255, 255, 255, 255, 255, 255, 255, 127, 136, 1, 255, 255, 255, 255, 255, 255, 255, 255, 255, 1, 144, 1, 254, 255, 255, 255, 255, 255, 255, 255, 255, 1, 160, 1, 255, 255, 255, 255, 255, 255, 255, 255, 255, 1, 177, 1, 255, 255, 255, 255, 255, 255, 255, 255, 184, 1, 128, 128, 128, 128, 128, 128, 128, 128, 128, 1, 192, 1, 255, 255, 255, 255, 255, 255, 255, 255, 127, 201, 1, 0, 0, 0, 0, 0, 0, 0, 128, 209, 1, 255, 255, 255, 255, 255, 255, 255, 127, 216, 1, 255, 255, 255, 255, 255, 255, 255, 255, 255, 1, 224, 1, 254, 255, 255, 255, 255, 255, 255, 255, 255, 1, 240, 1, 255, 255, 255, 255, 255, 255, 255, 255, 255, 1]);

/**
 * The file `msg-long.bin`, read by Grpc.AspNetCore v2.30.0 (C#)
 * and printed in canonical JSON format.
 */
export const msg_long_json = {
    "fixed64FieldMax": "18446744073709551615",
    "int64FieldMin": "-9223372036854775808",
    "int64FieldMax": "9223372036854775807",
    "sfixed64FieldMin": "-9223372036854775808",
    "sfixed64FieldMax": "9223372036854775807",
    "sint64FieldMin": "-9223372036854775808",
    "sint64FieldMax": "9223372036854775807",
    "uint64FieldMax": "18446744073709551615",
    "fixed64FieldMaxStr": "18446744073709551615",
    "int64FieldMinStr": "-9223372036854775808",
    "int64FieldMaxStr": "9223372036854775807",
    "sfixed64FieldMinStr": "-9223372036854775808",
    "sfixed64FieldMaxStr": "9223372036854775807",
    "sint64FieldMinStr": "-9223372036854775808",
    "fixed64FieldMaxNum": "18446744073709551615",
    "int64FieldMinNum": "-9223372036854775808",
    "int64FieldMaxNum": "9223372036854775807",
    "sfixed64FieldMinNum": "-9223372036854775808",
    "sfixed64FieldMaxNum": "9223372036854775807",
    "sint64FieldMinNum": "-9223372036854775808",
    "sint64FieldMaxStr": "9223372036854775807",
    "uint64FieldMaxStr": "18446744073709551615",
    "sint64FieldMaxNum": "9223372036854775807",
    "uint64FieldMaxNum": "18446744073709551615"
};

/**
 * The file `msg-long.bin`, read by the Javascript package
 * google-protobuf v3.12.2.
 */
export const msg_longs_deserialized_by_google_protobuf = {
    "fixed64FieldMin": 0,
    "fixed64FieldMax": 18446744073709552000,
    "int64FieldMin": -9223372036854776000,
    "int64FieldMax": 9223372036854776000,
    "sfixed64FieldMin": -9223372036854776000,
    "sfixed64FieldMax": 9223372036854776000,
    "sint64FieldMin": -9223372036854776000,
    "sint64FieldMax": 9223372036854776000,
    "uint64FieldMin": 0,
    "uint64FieldMax": 18446744073709552000,
    "fixed64FieldMinStr": "0",
    "fixed64FieldMaxStr": "18446744073709551615",
    "int64FieldMinStr": "-9223372036854775808",
    "int64FieldMaxStr": "9223372036854775807",
    "sfixed64FieldMinStr": "-9223372036854775808",
    "sfixed64FieldMaxStr": "9223372036854775807",
    "sint64FieldMinStr": "-9223372036854775808",
    "sint64FieldMaxStr": "9223372036854775807",
    "uint64FieldMinStr": "0",
    "uint64FieldMaxStr": "18446744073709551615",
    "fixed64FieldMinNum": 0,
    "fixed64FieldMaxNum": 18446744073709552000,
    "int64FieldMinNum": -9223372036854776000,
    "int64FieldMaxNum": 9223372036854776000,
    "sfixed64FieldMinNum": -9223372036854776000,
    "sfixed64FieldMaxNum": 9223372036854776000,
    "sint64FieldMinNum": -9223372036854776000,
    "sint64FieldMaxNum": 9223372036854776000,
    "uint64FieldMinNum": 0,
    "uint64FieldMaxNum": 18446744073709552000
};


const f: Fixture[] = [];
export default f;

f.push({
    typeName: "spec.LongsMessage",
    fields: [
        {no: 1, name: "fixed64_field_min", kind: "scalar", T: 6 /* FIXED64 */},
        {no: 2, name: "fixed64_field_max", kind: "scalar", T: 6 /* FIXED64 */},
        {no: 3, name: "int64_field_min", kind: "scalar", T: 3 /* INT64 */},
        {no: 4, name: "int64_field_max", kind: "scalar", T: 3 /* INT64 */},
        {no: 5, name: "sfixed64_field_min", kind: "scalar", T: 16 /* SFIXED64 */},
        {no: 6, name: "sfixed64_field_max", kind: "scalar", T: 16 /* SFIXED64 */},
        {no: 7, name: "sint64_field_min", kind: "scalar", T: 18 /* SINT64 */},
        {no: 8, name: "sint64_field_max", kind: "scalar", T: 18 /* SINT64 */},
        {no: 9, name: "uint64_field_min", kind: "scalar", T: 4 /* UINT64 */},
        {no: 10, name: "uint64_field_max", kind: "scalar", T: 4 /* UINT64 */},
        {no: 11, name: "fixed64_field_min_str", kind: "scalar", T: 6 /* FIXED64 */},
        {no: 12, name: "fixed64_field_max_str", kind: "scalar", T: 6 /* FIXED64 */},
        {no: 13, name: "int64_field_min_str", kind: "scalar", T: 3 /* INT64 */},
        {no: 14, name: "int64_field_max_str", kind: "scalar", T: 3 /* INT64 */},
        {no: 15, name: "sfixed64_field_min_str", kind: "scalar", T: 16 /* SFIXED64 */},
        {no: 16, name: "sfixed64_field_max_str", kind: "scalar", T: 16 /* SFIXED64 */},
        {no: 17, name: "sint64_field_min_str", kind: "scalar", T: 18 /* SINT64 */},
        {no: 18, name: "sint64_field_max_str", kind: "scalar", T: 18 /* SINT64 */},
        {no: 19, name: "uint64_field_min_str", kind: "scalar", T: 4 /* UINT64 */},
        {no: 20, name: "uint64_field_max_str", kind: "scalar", T: 4 /* UINT64 */},
        {no: 21, name: "fixed64_field_min_num", kind: "scalar", T: 6 /* FIXED64 */, L: 2 /* NUMBER */},
        {no: 22, name: "fixed64_field_max_num", kind: "scalar", T: 6 /* FIXED64 */, L: 2 /* NUMBER */},
        {no: 23, name: "int64_field_min_num", kind: "scalar", T: 3 /* INT64 */, L: 2 /* NUMBER */},
        {no: 24, name: "int64_field_max_num", kind: "scalar", T: 3 /* INT64 */, L: 2 /* NUMBER */},
        {no: 25, name: "sfixed64_field_min_num", kind: "scalar", T: 16 /* SFIXED64 */, L: 2 /* NUMBER */},
        {no: 26, name: "sfixed64_field_max_num", kind: "scalar", T: 16 /* SFIXED64 */, L: 2 /* NUMBER */},
        {no: 27, name: "sint64_field_min_num", kind: "scalar", T: 18 /* SINT64 */, L: 2 /* NUMBER */},
        {no: 28, name: "sint64_field_max_num", kind: "scalar", T: 18 /* SINT64 */, L: 2 /* NUMBER */},
        {no: 29, name: "uint64_field_min_num", kind: "scalar", T: 4 /* UINT64 */, L: 2 /* NUMBER */},
        {no: 30, name: "uint64_field_max_num", kind: "scalar", T: 4 /* UINT64 */, L: 2 /* NUMBER */}
    ],
    messages: {
        "default": {
            fixed64FieldMin: '0',
            fixed64FieldMax: '0',
            int64FieldMin: '0',
            int64FieldMax: '0',
            sfixed64FieldMin: '0',
            sfixed64FieldMax: '0',
            sint64FieldMin: '0',
            sint64FieldMax: '0',
            uint64FieldMin: '0',
            uint64FieldMax: '0',
            fixed64FieldMinStr: '0',
            fixed64FieldMaxStr: '0',
            int64FieldMinStr: '0',
            int64FieldMaxStr: '0',
            sfixed64FieldMinStr: '0',
            sfixed64FieldMaxStr: '0',
            sint64FieldMinStr: '0',
            sint64FieldMaxStr: '0',
            uint64FieldMinStr: '0',
            uint64FieldMaxStr: '0',
            fixed64FieldMinNum: 0,
            fixed64FieldMaxNum: 0,
            int64FieldMinNum: 0,
            int64FieldMaxNum: 0,
            sfixed64FieldMinNum: 0,
            sfixed64FieldMaxNum: 0,
            sint64FieldMinNum: 0,
            sint64FieldMaxNum: 0,
            uint64FieldMinNum: 0,
            uint64FieldMaxNum: 0,
        },
        "example": {
            "fixed64FieldMin": "0",
            "fixed64FieldMax": "18446744073709551615",
            "int64FieldMin": "-9223372036854775808",
            "int64FieldMax": "9223372036854775807",
            "sfixed64FieldMin": "-9223372036854775808",
            "sfixed64FieldMax": "9223372036854775807",
            "sint64FieldMin": "-9223372036854775808",
            "sint64FieldMax": "9223372036854775807",
            "uint64FieldMin": "0",
            "uint64FieldMax": "18446744073709551615",
            "fixed64FieldMinStr": "0",
            "fixed64FieldMaxStr": "18446744073709551615",
            "int64FieldMinStr": "-9223372036854775808",
            "int64FieldMaxStr": "9223372036854775807",
            "sfixed64FieldMinStr": "-9223372036854775808",
            "sfixed64FieldMaxStr": "9223372036854775807",
            "sint64FieldMinStr": "-9223372036854775808",
            "sint64FieldMaxStr": "9223372036854775807",
            "uint64FieldMinStr": "0",
            "uint64FieldMaxStr": "18446744073709551615",
            fixed64FieldMinNum: 0,
            fixed64FieldMaxNum: 0,
            int64FieldMinNum: 0,
            int64FieldMaxNum: 0,
            sfixed64FieldMinNum: 0,
            sfixed64FieldMaxNum: 0,
            sint64FieldMinNum: 0,
            sint64FieldMaxNum: 0,
            uint64FieldMinNum: 0,
            uint64FieldMaxNum: 0,
        },
    },
    json: {
        "default": {},
        "example": {
            // number representations explicitly excluded because precision loss will fail unit tests
            "fixed64FieldMax": "18446744073709551615",
            "int64FieldMin": "-9223372036854775808",
            "int64FieldMax": "9223372036854775807",
            "sfixed64FieldMin": "-9223372036854775808",
            "sfixed64FieldMax": "9223372036854775807",
            "sint64FieldMin": "-9223372036854775808",
            "sint64FieldMax": "9223372036854775807",
            "uint64FieldMax": "18446744073709551615",
            "fixed64FieldMaxStr": "18446744073709551615",
            "int64FieldMinStr": "-9223372036854775808",
            "int64FieldMaxStr": "9223372036854775807",
            "sfixed64FieldMinStr": "-9223372036854775808",
            "sfixed64FieldMaxStr": "9223372036854775807",
            "sint64FieldMinStr": "-9223372036854775808",
            "sint64FieldMaxStr": "9223372036854775807",
            "uint64FieldMaxStr": "18446744073709551615"
        },
    },
});
