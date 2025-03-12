// @generated by protobuf-ts 2.9.5 with parameter force_optimize_code_size
// @generated from protobuf file "msg-longs.proto" (package "spec", syntax proto3)
// tslint:disable
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message spec.LongsMessage
 */
export interface LongsMessage {
    /**
     * @generated from protobuf field: fixed64 fixed64_field_min = 1 [jstype = JS_NORMAL];
     */
    fixed64FieldMin: bigint;
    /**
     * @generated from protobuf field: fixed64 fixed64_field_max = 2 [jstype = JS_NORMAL];
     */
    fixed64FieldMax: bigint;
    /**
     * @generated from protobuf field: int64 int64_field_min = 3 [jstype = JS_NORMAL];
     */
    int64FieldMin: bigint;
    /**
     * @generated from protobuf field: int64 int64_field_max = 4 [jstype = JS_NORMAL];
     */
    int64FieldMax: bigint;
    /**
     * @generated from protobuf field: sfixed64 sfixed64_field_min = 5;
     */
    sfixed64FieldMin: bigint;
    /**
     * @generated from protobuf field: sfixed64 sfixed64_field_max = 6;
     */
    sfixed64FieldMax: bigint;
    /**
     * @generated from protobuf field: sint64 sint64_field_min = 7;
     */
    sint64FieldMin: bigint;
    /**
     * @generated from protobuf field: sint64 sint64_field_max = 8;
     */
    sint64FieldMax: bigint;
    /**
     * @generated from protobuf field: uint64 uint64_field_min = 9;
     */
    uint64FieldMin: bigint;
    /**
     * @generated from protobuf field: uint64 uint64_field_max = 10;
     */
    uint64FieldMax: bigint;
    // 

    /**
     * @generated from protobuf field: fixed64 fixed64_field_min_str = 11 [jstype = JS_STRING];
     */
    fixed64FieldMinStr: string;
    /**
     * @generated from protobuf field: fixed64 fixed64_field_max_str = 12 [jstype = JS_STRING];
     */
    fixed64FieldMaxStr: string;
    /**
     * @generated from protobuf field: int64 int64_field_min_str = 13 [jstype = JS_STRING];
     */
    int64FieldMinStr: string;
    /**
     * @generated from protobuf field: int64 int64_field_max_str = 14 [jstype = JS_STRING];
     */
    int64FieldMaxStr: string;
    /**
     * @generated from protobuf field: sfixed64 sfixed64_field_min_str = 15 [jstype = JS_STRING];
     */
    sfixed64FieldMinStr: string;
    /**
     * @generated from protobuf field: sfixed64 sfixed64_field_max_str = 16 [jstype = JS_STRING];
     */
    sfixed64FieldMaxStr: string;
    /**
     * @generated from protobuf field: sint64 sint64_field_min_str = 17 [jstype = JS_STRING];
     */
    sint64FieldMinStr: string;
    /**
     * @generated from protobuf field: sint64 sint64_field_max_str = 18 [jstype = JS_STRING];
     */
    sint64FieldMaxStr: string;
    /**
     * @generated from protobuf field: uint64 uint64_field_min_str = 19 [jstype = JS_STRING];
     */
    uint64FieldMinStr: string;
    /**
     * @generated from protobuf field: uint64 uint64_field_max_str = 20 [jstype = JS_STRING];
     */
    uint64FieldMaxStr: string;
    // 

    /**
     * @generated from protobuf field: fixed64 fixed64_field_min_num = 21 [jstype = JS_NUMBER];
     */
    fixed64FieldMinNum: number;
    /**
     * @generated from protobuf field: fixed64 fixed64_field_max_num = 22 [jstype = JS_NUMBER];
     */
    fixed64FieldMaxNum: number;
    /**
     * @generated from protobuf field: int64 int64_field_min_num = 23 [jstype = JS_NUMBER];
     */
    int64FieldMinNum: number;
    /**
     * @generated from protobuf field: int64 int64_field_max_num = 24 [jstype = JS_NUMBER];
     */
    int64FieldMaxNum: number;
    /**
     * @generated from protobuf field: sfixed64 sfixed64_field_min_num = 25 [jstype = JS_NUMBER];
     */
    sfixed64FieldMinNum: number;
    /**
     * @generated from protobuf field: sfixed64 sfixed64_field_max_num = 26 [jstype = JS_NUMBER];
     */
    sfixed64FieldMaxNum: number;
    /**
     * @generated from protobuf field: sint64 sint64_field_min_num = 27 [jstype = JS_NUMBER];
     */
    sint64FieldMinNum: number;
    /**
     * @generated from protobuf field: sint64 sint64_field_max_num = 28 [jstype = JS_NUMBER];
     */
    sint64FieldMaxNum: number;
    /**
     * @generated from protobuf field: uint64 uint64_field_min_num = 29 [jstype = JS_NUMBER];
     */
    uint64FieldMinNum: number;
    /**
     * @generated from protobuf field: uint64 uint64_field_max_num = 30 [jstype = JS_NUMBER];
     */
    uint64FieldMaxNum: number;
}
// @generated message type with reflection information, may provide speed optimized methods
class LongsMessage$Type extends MessageType<LongsMessage> {
    constructor() {
        super("spec.LongsMessage", [
            { no: 1, name: "fixed64_field_min", kind: "scalar", T: 6 /*ScalarType.FIXED64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 2, name: "fixed64_field_max", kind: "scalar", T: 6 /*ScalarType.FIXED64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 3, name: "int64_field_min", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 4, name: "int64_field_max", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 5, name: "sfixed64_field_min", kind: "scalar", T: 16 /*ScalarType.SFIXED64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 6, name: "sfixed64_field_max", kind: "scalar", T: 16 /*ScalarType.SFIXED64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 7, name: "sint64_field_min", kind: "scalar", T: 18 /*ScalarType.SINT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 8, name: "sint64_field_max", kind: "scalar", T: 18 /*ScalarType.SINT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 9, name: "uint64_field_min", kind: "scalar", T: 4 /*ScalarType.UINT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 10, name: "uint64_field_max", kind: "scalar", T: 4 /*ScalarType.UINT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 11, name: "fixed64_field_min_str", kind: "scalar", T: 6 /*ScalarType.FIXED64*/ },
            { no: 12, name: "fixed64_field_max_str", kind: "scalar", T: 6 /*ScalarType.FIXED64*/ },
            { no: 13, name: "int64_field_min_str", kind: "scalar", T: 3 /*ScalarType.INT64*/ },
            { no: 14, name: "int64_field_max_str", kind: "scalar", T: 3 /*ScalarType.INT64*/ },
            { no: 15, name: "sfixed64_field_min_str", kind: "scalar", T: 16 /*ScalarType.SFIXED64*/ },
            { no: 16, name: "sfixed64_field_max_str", kind: "scalar", T: 16 /*ScalarType.SFIXED64*/ },
            { no: 17, name: "sint64_field_min_str", kind: "scalar", T: 18 /*ScalarType.SINT64*/ },
            { no: 18, name: "sint64_field_max_str", kind: "scalar", T: 18 /*ScalarType.SINT64*/ },
            { no: 19, name: "uint64_field_min_str", kind: "scalar", T: 4 /*ScalarType.UINT64*/ },
            { no: 20, name: "uint64_field_max_str", kind: "scalar", T: 4 /*ScalarType.UINT64*/ },
            { no: 21, name: "fixed64_field_min_num", kind: "scalar", T: 6 /*ScalarType.FIXED64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 22, name: "fixed64_field_max_num", kind: "scalar", T: 6 /*ScalarType.FIXED64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 23, name: "int64_field_min_num", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 24, name: "int64_field_max_num", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 25, name: "sfixed64_field_min_num", kind: "scalar", T: 16 /*ScalarType.SFIXED64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 26, name: "sfixed64_field_max_num", kind: "scalar", T: 16 /*ScalarType.SFIXED64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 27, name: "sint64_field_min_num", kind: "scalar", T: 18 /*ScalarType.SINT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 28, name: "sint64_field_max_num", kind: "scalar", T: 18 /*ScalarType.SINT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 29, name: "uint64_field_min_num", kind: "scalar", T: 4 /*ScalarType.UINT64*/, L: 2 /*LongType.NUMBER*/ },
            { no: 30, name: "uint64_field_max_num", kind: "scalar", T: 4 /*ScalarType.UINT64*/, L: 2 /*LongType.NUMBER*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message spec.LongsMessage
 */
export const LongsMessage = new LongsMessage$Type();
