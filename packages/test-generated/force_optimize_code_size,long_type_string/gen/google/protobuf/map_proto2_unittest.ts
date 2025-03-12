// @generated by protobuf-ts 2.9.5 with parameter force_optimize_code_size,long_type_string
// @generated from protobuf file "google/protobuf/map_proto2_unittest.proto" (package "protobuf_unittest", syntax proto2)
// tslint:disable
//
// Protocol Buffers - Google's data interchange format
// Copyright 2008 Google Inc.  All rights reserved.
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd
//
import { MessageType } from "@protobuf-ts/runtime";
import { ImportEnumForMap } from "./unittest_import";
/**
 * @generated from protobuf message protobuf_unittest.TestEnumMap
 */
export interface TestEnumMap {
    /**
     * @generated from protobuf field: map<int32, protobuf_unittest.Proto2MapEnum> known_map_field = 101;
     */
    knownMapField: {
        [key: number]: Proto2MapEnum;
    };
    /**
     * @generated from protobuf field: map<int32, protobuf_unittest.Proto2MapEnum> unknown_map_field = 102;
     */
    unknownMapField: {
        [key: number]: Proto2MapEnum;
    };
    /**
     * Other maps with all key types to test the unknown entry serialization
     *
     * @generated from protobuf field: map<int64, protobuf_unittest.Proto2MapEnum> unknown_map_field_int64 = 200;
     */
    unknownMapFieldInt64: {
        [key: string]: Proto2MapEnum;
    };
    /**
     * @generated from protobuf field: map<uint64, protobuf_unittest.Proto2MapEnum> unknown_map_field_uint64 = 201;
     */
    unknownMapFieldUint64: {
        [key: string]: Proto2MapEnum;
    };
    /**
     * @generated from protobuf field: map<int32, protobuf_unittest.Proto2MapEnum> unknown_map_field_int32 = 202;
     */
    unknownMapFieldInt32: {
        [key: number]: Proto2MapEnum;
    };
    /**
     * @generated from protobuf field: map<uint32, protobuf_unittest.Proto2MapEnum> unknown_map_field_uint32 = 203;
     */
    unknownMapFieldUint32: {
        [key: number]: Proto2MapEnum;
    };
    /**
     * @generated from protobuf field: map<fixed32, protobuf_unittest.Proto2MapEnum> unknown_map_field_fixed32 = 204;
     */
    unknownMapFieldFixed32: {
        [key: number]: Proto2MapEnum;
    };
    /**
     * @generated from protobuf field: map<fixed64, protobuf_unittest.Proto2MapEnum> unknown_map_field_fixed64 = 205;
     */
    unknownMapFieldFixed64: {
        [key: string]: Proto2MapEnum;
    };
    /**
     * @generated from protobuf field: map<bool, protobuf_unittest.Proto2MapEnum> unknown_map_field_bool = 206;
     */
    unknownMapFieldBool: {
        [key: string]: Proto2MapEnum;
    };
    /**
     * @generated from protobuf field: map<string, protobuf_unittest.Proto2MapEnum> unknown_map_field_string = 207;
     */
    unknownMapFieldString: {
        [key: string]: Proto2MapEnum;
    };
    /**
     * @generated from protobuf field: map<sint32, protobuf_unittest.Proto2MapEnum> unknown_map_field_sint32 = 208;
     */
    unknownMapFieldSint32: {
        [key: number]: Proto2MapEnum;
    };
    /**
     * @generated from protobuf field: map<sint64, protobuf_unittest.Proto2MapEnum> unknown_map_field_sint64 = 209;
     */
    unknownMapFieldSint64: {
        [key: string]: Proto2MapEnum;
    };
    /**
     * @generated from protobuf field: map<sfixed32, protobuf_unittest.Proto2MapEnum> unknown_map_field_sfixed32 = 210;
     */
    unknownMapFieldSfixed32: {
        [key: number]: Proto2MapEnum;
    };
    /**
     * @generated from protobuf field: map<sfixed64, protobuf_unittest.Proto2MapEnum> unknown_map_field_sfixed64 = 211;
     */
    unknownMapFieldSfixed64: {
        [key: string]: Proto2MapEnum;
    };
}
/**
 * @generated from protobuf message protobuf_unittest.TestEnumMapPlusExtra
 */
export interface TestEnumMapPlusExtra {
    /**
     * @generated from protobuf field: map<int32, protobuf_unittest.Proto2MapEnumPlusExtra> known_map_field = 101;
     */
    knownMapField: {
        [key: number]: Proto2MapEnumPlusExtra;
    };
    /**
     * @generated from protobuf field: map<int32, protobuf_unittest.Proto2MapEnumPlusExtra> unknown_map_field = 102;
     */
    unknownMapField: {
        [key: number]: Proto2MapEnumPlusExtra;
    };
    /**
     * Other maps with all key types to test the unknown entry serialization
     *
     * @generated from protobuf field: map<int64, protobuf_unittest.Proto2MapEnumPlusExtra> unknown_map_field_int64 = 200;
     */
    unknownMapFieldInt64: {
        [key: string]: Proto2MapEnumPlusExtra;
    };
    /**
     * @generated from protobuf field: map<uint64, protobuf_unittest.Proto2MapEnumPlusExtra> unknown_map_field_uint64 = 201;
     */
    unknownMapFieldUint64: {
        [key: string]: Proto2MapEnumPlusExtra;
    };
    /**
     * @generated from protobuf field: map<int32, protobuf_unittest.Proto2MapEnumPlusExtra> unknown_map_field_int32 = 202;
     */
    unknownMapFieldInt32: {
        [key: number]: Proto2MapEnumPlusExtra;
    };
    /**
     * @generated from protobuf field: map<uint32, protobuf_unittest.Proto2MapEnumPlusExtra> unknown_map_field_uint32 = 203;
     */
    unknownMapFieldUint32: {
        [key: number]: Proto2MapEnumPlusExtra;
    };
    /**
     * @generated from protobuf field: map<fixed32, protobuf_unittest.Proto2MapEnumPlusExtra> unknown_map_field_fixed32 = 204;
     */
    unknownMapFieldFixed32: {
        [key: number]: Proto2MapEnumPlusExtra;
    };
    /**
     * @generated from protobuf field: map<fixed64, protobuf_unittest.Proto2MapEnumPlusExtra> unknown_map_field_fixed64 = 205;
     */
    unknownMapFieldFixed64: {
        [key: string]: Proto2MapEnumPlusExtra;
    };
    /**
     * @generated from protobuf field: map<bool, protobuf_unittest.Proto2MapEnumPlusExtra> unknown_map_field_bool = 206;
     */
    unknownMapFieldBool: {
        [key: string]: Proto2MapEnumPlusExtra;
    };
    /**
     * @generated from protobuf field: map<string, protobuf_unittest.Proto2MapEnumPlusExtra> unknown_map_field_string = 207;
     */
    unknownMapFieldString: {
        [key: string]: Proto2MapEnumPlusExtra;
    };
    /**
     * @generated from protobuf field: map<sint32, protobuf_unittest.Proto2MapEnumPlusExtra> unknown_map_field_sint32 = 208;
     */
    unknownMapFieldSint32: {
        [key: number]: Proto2MapEnumPlusExtra;
    };
    /**
     * @generated from protobuf field: map<sint64, protobuf_unittest.Proto2MapEnumPlusExtra> unknown_map_field_sint64 = 209;
     */
    unknownMapFieldSint64: {
        [key: string]: Proto2MapEnumPlusExtra;
    };
    /**
     * @generated from protobuf field: map<sfixed32, protobuf_unittest.Proto2MapEnumPlusExtra> unknown_map_field_sfixed32 = 210;
     */
    unknownMapFieldSfixed32: {
        [key: number]: Proto2MapEnumPlusExtra;
    };
    /**
     * @generated from protobuf field: map<sfixed64, protobuf_unittest.Proto2MapEnumPlusExtra> unknown_map_field_sfixed64 = 211;
     */
    unknownMapFieldSfixed64: {
        [key: string]: Proto2MapEnumPlusExtra;
    };
}
/**
 * @generated from protobuf message protobuf_unittest.TestImportEnumMap
 */
export interface TestImportEnumMap {
    /**
     * @generated from protobuf field: map<int32, protobuf_unittest_import.ImportEnumForMap> import_enum_amp = 1;
     */
    importEnumAmp: {
        [key: number]: ImportEnumForMap;
    };
}
/**
 * @generated from protobuf message protobuf_unittest.TestIntIntMap
 */
export interface TestIntIntMap {
    /**
     * @generated from protobuf field: map<int32, int32> m = 1;
     */
    m: {
        [key: number]: number;
    };
}
/**
 * Test all key types: string, plus the non-floating-point scalars.
 *
 * @generated from protobuf message protobuf_unittest.TestMaps
 */
export interface TestMaps {
    /**
     * @generated from protobuf field: map<int32, protobuf_unittest.TestIntIntMap> m_int32 = 1;
     */
    mInt32: {
        [key: number]: TestIntIntMap;
    };
    /**
     * @generated from protobuf field: map<int64, protobuf_unittest.TestIntIntMap> m_int64 = 2;
     */
    mInt64: {
        [key: string]: TestIntIntMap;
    };
    /**
     * @generated from protobuf field: map<uint32, protobuf_unittest.TestIntIntMap> m_uint32 = 3;
     */
    mUint32: {
        [key: number]: TestIntIntMap;
    };
    /**
     * @generated from protobuf field: map<uint64, protobuf_unittest.TestIntIntMap> m_uint64 = 4;
     */
    mUint64: {
        [key: string]: TestIntIntMap;
    };
    /**
     * @generated from protobuf field: map<sint32, protobuf_unittest.TestIntIntMap> m_sint32 = 5;
     */
    mSint32: {
        [key: number]: TestIntIntMap;
    };
    /**
     * @generated from protobuf field: map<sint64, protobuf_unittest.TestIntIntMap> m_sint64 = 6;
     */
    mSint64: {
        [key: string]: TestIntIntMap;
    };
    /**
     * @generated from protobuf field: map<fixed32, protobuf_unittest.TestIntIntMap> m_fixed32 = 7;
     */
    mFixed32: {
        [key: number]: TestIntIntMap;
    };
    /**
     * @generated from protobuf field: map<fixed64, protobuf_unittest.TestIntIntMap> m_fixed64 = 8;
     */
    mFixed64: {
        [key: string]: TestIntIntMap;
    };
    /**
     * @generated from protobuf field: map<sfixed32, protobuf_unittest.TestIntIntMap> m_sfixed32 = 9;
     */
    mSfixed32: {
        [key: number]: TestIntIntMap;
    };
    /**
     * @generated from protobuf field: map<sfixed64, protobuf_unittest.TestIntIntMap> m_sfixed64 = 10;
     */
    mSfixed64: {
        [key: string]: TestIntIntMap;
    };
    /**
     * @generated from protobuf field: map<bool, protobuf_unittest.TestIntIntMap> m_bool = 11;
     */
    mBool: {
        [key: string]: TestIntIntMap;
    };
    /**
     * @generated from protobuf field: map<string, protobuf_unittest.TestIntIntMap> m_string = 12;
     */
    mString: {
        [key: string]: TestIntIntMap;
    };
}
/**
 * Test maps in submessages.
 *
 * @generated from protobuf message protobuf_unittest.TestSubmessageMaps
 */
export interface TestSubmessageMaps {
    /**
     * @generated from protobuf field: optional protobuf_unittest.TestMaps m = 1;
     */
    m?: TestMaps;
}
/**
 * @generated from protobuf message protobuf_unittest.TestProto2BytesMap
 */
export interface TestProto2BytesMap {
    /**
     * @generated from protobuf field: map<int32, bytes> map_bytes = 1;
     */
    mapBytes: {
        [key: number]: Uint8Array;
    };
    /**
     * @generated from protobuf field: map<int32, string> map_string = 2;
     */
    mapString: {
        [key: number]: string;
    };
}
/**
 * @generated from protobuf enum protobuf_unittest.Proto2MapEnum
 */
export enum Proto2MapEnum {
    /**
     * @generated from protobuf enum value: PROTO2_MAP_ENUM_FOO = 0;
     */
    FOO = 0,
    /**
     * @generated from protobuf enum value: PROTO2_MAP_ENUM_BAR = 1;
     */
    BAR = 1,
    /**
     * @generated from protobuf enum value: PROTO2_MAP_ENUM_BAZ = 2;
     */
    BAZ = 2
}
/**
 * @generated from protobuf enum protobuf_unittest.Proto2MapEnumPlusExtra
 */
export enum Proto2MapEnumPlusExtra {
    /**
     * @generated from protobuf enum value: E_PROTO2_MAP_ENUM_FOO = 0;
     */
    E_PROTO2_MAP_ENUM_FOO = 0,
    /**
     * @generated from protobuf enum value: E_PROTO2_MAP_ENUM_BAR = 1;
     */
    E_PROTO2_MAP_ENUM_BAR = 1,
    /**
     * @generated from protobuf enum value: E_PROTO2_MAP_ENUM_BAZ = 2;
     */
    E_PROTO2_MAP_ENUM_BAZ = 2,
    /**
     * @generated from protobuf enum value: E_PROTO2_MAP_ENUM_EXTRA = 3;
     */
    E_PROTO2_MAP_ENUM_EXTRA = 3
}
// @generated message type with reflection information, may provide speed optimized methods
class TestEnumMap$Type extends MessageType<TestEnumMap> {
    constructor() {
        super("protobuf_unittest.TestEnumMap", [
            { no: 101, name: "known_map_field", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnum", Proto2MapEnum, "PROTO2_MAP_ENUM_"] } },
            { no: 102, name: "unknown_map_field", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnum", Proto2MapEnum, "PROTO2_MAP_ENUM_"] } },
            { no: 200, name: "unknown_map_field_int64", kind: "map", K: 3 /*ScalarType.INT64*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnum", Proto2MapEnum, "PROTO2_MAP_ENUM_"] } },
            { no: 201, name: "unknown_map_field_uint64", kind: "map", K: 4 /*ScalarType.UINT64*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnum", Proto2MapEnum, "PROTO2_MAP_ENUM_"] } },
            { no: 202, name: "unknown_map_field_int32", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnum", Proto2MapEnum, "PROTO2_MAP_ENUM_"] } },
            { no: 203, name: "unknown_map_field_uint32", kind: "map", K: 13 /*ScalarType.UINT32*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnum", Proto2MapEnum, "PROTO2_MAP_ENUM_"] } },
            { no: 204, name: "unknown_map_field_fixed32", kind: "map", K: 7 /*ScalarType.FIXED32*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnum", Proto2MapEnum, "PROTO2_MAP_ENUM_"] } },
            { no: 205, name: "unknown_map_field_fixed64", kind: "map", K: 6 /*ScalarType.FIXED64*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnum", Proto2MapEnum, "PROTO2_MAP_ENUM_"] } },
            { no: 206, name: "unknown_map_field_bool", kind: "map", K: 8 /*ScalarType.BOOL*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnum", Proto2MapEnum, "PROTO2_MAP_ENUM_"] } },
            { no: 207, name: "unknown_map_field_string", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnum", Proto2MapEnum, "PROTO2_MAP_ENUM_"] } },
            { no: 208, name: "unknown_map_field_sint32", kind: "map", K: 17 /*ScalarType.SINT32*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnum", Proto2MapEnum, "PROTO2_MAP_ENUM_"] } },
            { no: 209, name: "unknown_map_field_sint64", kind: "map", K: 18 /*ScalarType.SINT64*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnum", Proto2MapEnum, "PROTO2_MAP_ENUM_"] } },
            { no: 210, name: "unknown_map_field_sfixed32", kind: "map", K: 15 /*ScalarType.SFIXED32*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnum", Proto2MapEnum, "PROTO2_MAP_ENUM_"] } },
            { no: 211, name: "unknown_map_field_sfixed64", kind: "map", K: 16 /*ScalarType.SFIXED64*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnum", Proto2MapEnum, "PROTO2_MAP_ENUM_"] } }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.TestEnumMap
 */
export const TestEnumMap = new TestEnumMap$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TestEnumMapPlusExtra$Type extends MessageType<TestEnumMapPlusExtra> {
    constructor() {
        super("protobuf_unittest.TestEnumMapPlusExtra", [
            { no: 101, name: "known_map_field", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnumPlusExtra", Proto2MapEnumPlusExtra] } },
            { no: 102, name: "unknown_map_field", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnumPlusExtra", Proto2MapEnumPlusExtra] } },
            { no: 200, name: "unknown_map_field_int64", kind: "map", K: 3 /*ScalarType.INT64*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnumPlusExtra", Proto2MapEnumPlusExtra] } },
            { no: 201, name: "unknown_map_field_uint64", kind: "map", K: 4 /*ScalarType.UINT64*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnumPlusExtra", Proto2MapEnumPlusExtra] } },
            { no: 202, name: "unknown_map_field_int32", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnumPlusExtra", Proto2MapEnumPlusExtra] } },
            { no: 203, name: "unknown_map_field_uint32", kind: "map", K: 13 /*ScalarType.UINT32*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnumPlusExtra", Proto2MapEnumPlusExtra] } },
            { no: 204, name: "unknown_map_field_fixed32", kind: "map", K: 7 /*ScalarType.FIXED32*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnumPlusExtra", Proto2MapEnumPlusExtra] } },
            { no: 205, name: "unknown_map_field_fixed64", kind: "map", K: 6 /*ScalarType.FIXED64*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnumPlusExtra", Proto2MapEnumPlusExtra] } },
            { no: 206, name: "unknown_map_field_bool", kind: "map", K: 8 /*ScalarType.BOOL*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnumPlusExtra", Proto2MapEnumPlusExtra] } },
            { no: 207, name: "unknown_map_field_string", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnumPlusExtra", Proto2MapEnumPlusExtra] } },
            { no: 208, name: "unknown_map_field_sint32", kind: "map", K: 17 /*ScalarType.SINT32*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnumPlusExtra", Proto2MapEnumPlusExtra] } },
            { no: 209, name: "unknown_map_field_sint64", kind: "map", K: 18 /*ScalarType.SINT64*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnumPlusExtra", Proto2MapEnumPlusExtra] } },
            { no: 210, name: "unknown_map_field_sfixed32", kind: "map", K: 15 /*ScalarType.SFIXED32*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnumPlusExtra", Proto2MapEnumPlusExtra] } },
            { no: 211, name: "unknown_map_field_sfixed64", kind: "map", K: 16 /*ScalarType.SFIXED64*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnumPlusExtra", Proto2MapEnumPlusExtra] } }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.TestEnumMapPlusExtra
 */
export const TestEnumMapPlusExtra = new TestEnumMapPlusExtra$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TestImportEnumMap$Type extends MessageType<TestImportEnumMap> {
    constructor() {
        super("protobuf_unittest.TestImportEnumMap", [
            { no: 1, name: "import_enum_amp", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "enum", T: () => ["protobuf_unittest_import.ImportEnumForMap", ImportEnumForMap] } }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.TestImportEnumMap
 */
export const TestImportEnumMap = new TestImportEnumMap$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TestIntIntMap$Type extends MessageType<TestIntIntMap> {
    constructor() {
        super("protobuf_unittest.TestIntIntMap", [
            { no: 1, name: "m", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "scalar", T: 5 /*ScalarType.INT32*/ } }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.TestIntIntMap
 */
export const TestIntIntMap = new TestIntIntMap$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TestMaps$Type extends MessageType<TestMaps> {
    constructor() {
        super("protobuf_unittest.TestMaps", [
            { no: 1, name: "m_int32", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "message", T: () => TestIntIntMap } },
            { no: 2, name: "m_int64", kind: "map", K: 3 /*ScalarType.INT64*/, V: { kind: "message", T: () => TestIntIntMap } },
            { no: 3, name: "m_uint32", kind: "map", K: 13 /*ScalarType.UINT32*/, V: { kind: "message", T: () => TestIntIntMap } },
            { no: 4, name: "m_uint64", kind: "map", K: 4 /*ScalarType.UINT64*/, V: { kind: "message", T: () => TestIntIntMap } },
            { no: 5, name: "m_sint32", kind: "map", K: 17 /*ScalarType.SINT32*/, V: { kind: "message", T: () => TestIntIntMap } },
            { no: 6, name: "m_sint64", kind: "map", K: 18 /*ScalarType.SINT64*/, V: { kind: "message", T: () => TestIntIntMap } },
            { no: 7, name: "m_fixed32", kind: "map", K: 7 /*ScalarType.FIXED32*/, V: { kind: "message", T: () => TestIntIntMap } },
            { no: 8, name: "m_fixed64", kind: "map", K: 6 /*ScalarType.FIXED64*/, V: { kind: "message", T: () => TestIntIntMap } },
            { no: 9, name: "m_sfixed32", kind: "map", K: 15 /*ScalarType.SFIXED32*/, V: { kind: "message", T: () => TestIntIntMap } },
            { no: 10, name: "m_sfixed64", kind: "map", K: 16 /*ScalarType.SFIXED64*/, V: { kind: "message", T: () => TestIntIntMap } },
            { no: 11, name: "m_bool", kind: "map", K: 8 /*ScalarType.BOOL*/, V: { kind: "message", T: () => TestIntIntMap } },
            { no: 12, name: "m_string", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "message", T: () => TestIntIntMap } }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.TestMaps
 */
export const TestMaps = new TestMaps$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TestSubmessageMaps$Type extends MessageType<TestSubmessageMaps> {
    constructor() {
        super("protobuf_unittest.TestSubmessageMaps", [
            { no: 1, name: "m", kind: "message", T: () => TestMaps }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.TestSubmessageMaps
 */
export const TestSubmessageMaps = new TestSubmessageMaps$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TestProto2BytesMap$Type extends MessageType<TestProto2BytesMap> {
    constructor() {
        super("protobuf_unittest.TestProto2BytesMap", [
            { no: 1, name: "map_bytes", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "scalar", T: 12 /*ScalarType.BYTES*/ } },
            { no: 2, name: "map_string", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.TestProto2BytesMap
 */
export const TestProto2BytesMap = new TestProto2BytesMap$Type();
