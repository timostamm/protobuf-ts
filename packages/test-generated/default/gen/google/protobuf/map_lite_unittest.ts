// @generated by protobuf-ts 2.9.5
// @generated from protobuf file "google/protobuf/map_lite_unittest.proto" (package "protobuf_unittest", syntax proto2)
// tslint:disable
//
// Protocol Buffers - Google's data interchange format
// Copyright 2008 Google Inc.  All rights reserved.
// https://developers.google.com/protocol-buffers/
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//     * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
//     * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
import { MessageType } from "@protobuf-ts/runtime";
import { TestAllTypesLite } from "./unittest_lite";
import { ForeignMessageLite } from "./unittest_lite";
/**
 * @generated from protobuf message protobuf_unittest.TestMapLite
 */
export interface TestMapLite {
    /**
     * @generated from protobuf field: map<int32, int32> map_int32_int32 = 1;
     */
    mapInt32Int32: {
        [key: number]: number;
    };
    /**
     * @generated from protobuf field: map<int64, int64> map_int64_int64 = 2;
     */
    mapInt64Int64: {
        [key: string]: bigint;
    };
    /**
     * @generated from protobuf field: map<uint32, uint32> map_uint32_uint32 = 3;
     */
    mapUint32Uint32: {
        [key: number]: number;
    };
    /**
     * @generated from protobuf field: map<uint64, uint64> map_uint64_uint64 = 4;
     */
    mapUint64Uint64: {
        [key: string]: bigint;
    };
    /**
     * @generated from protobuf field: map<sint32, sint32> map_sint32_sint32 = 5;
     */
    mapSint32Sint32: {
        [key: number]: number;
    };
    /**
     * @generated from protobuf field: map<sint64, sint64> map_sint64_sint64 = 6;
     */
    mapSint64Sint64: {
        [key: string]: bigint;
    };
    /**
     * @generated from protobuf field: map<fixed32, fixed32> map_fixed32_fixed32 = 7;
     */
    mapFixed32Fixed32: {
        [key: number]: number;
    };
    /**
     * @generated from protobuf field: map<fixed64, fixed64> map_fixed64_fixed64 = 8;
     */
    mapFixed64Fixed64: {
        [key: string]: bigint;
    };
    /**
     * @generated from protobuf field: map<sfixed32, sfixed32> map_sfixed32_sfixed32 = 9;
     */
    mapSfixed32Sfixed32: {
        [key: number]: number;
    };
    /**
     * @generated from protobuf field: map<sfixed64, sfixed64> map_sfixed64_sfixed64 = 10;
     */
    mapSfixed64Sfixed64: {
        [key: string]: bigint;
    };
    /**
     * @generated from protobuf field: map<int32, float> map_int32_float = 11;
     */
    mapInt32Float: {
        [key: number]: number;
    };
    /**
     * @generated from protobuf field: map<int32, double> map_int32_double = 12;
     */
    mapInt32Double: {
        [key: number]: number;
    };
    /**
     * @generated from protobuf field: map<bool, bool> map_bool_bool = 13;
     */
    mapBoolBool: {
        [key: string]: boolean;
    };
    /**
     * @generated from protobuf field: map<string, string> map_string_string = 14;
     */
    mapStringString: {
        [key: string]: string;
    };
    /**
     * @generated from protobuf field: map<int32, bytes> map_int32_bytes = 15;
     */
    mapInt32Bytes: {
        [key: number]: Uint8Array;
    };
    /**
     * @generated from protobuf field: map<int32, protobuf_unittest.MapEnumLite> map_int32_enum = 16;
     */
    mapInt32Enum: {
        [key: number]: MapEnumLite;
    };
    /**
     * @generated from protobuf field: map<int32, protobuf_unittest.ForeignMessageLite> map_int32_foreign_message = 17;
     */
    mapInt32ForeignMessage: {
        [key: number]: ForeignMessageLite;
    };
    /**
     * @generated from protobuf field: map<int32, int32> teboring = 18;
     */
    teboring: {
        [key: number]: number;
    };
}
/**
 * @generated from protobuf message protobuf_unittest.TestArenaMapLite
 */
export interface TestArenaMapLite {
    /**
     * @generated from protobuf field: map<int32, int32> map_int32_int32 = 1;
     */
    mapInt32Int32: {
        [key: number]: number;
    };
    /**
     * @generated from protobuf field: map<int64, int64> map_int64_int64 = 2;
     */
    mapInt64Int64: {
        [key: string]: bigint;
    };
    /**
     * @generated from protobuf field: map<uint32, uint32> map_uint32_uint32 = 3;
     */
    mapUint32Uint32: {
        [key: number]: number;
    };
    /**
     * @generated from protobuf field: map<uint64, uint64> map_uint64_uint64 = 4;
     */
    mapUint64Uint64: {
        [key: string]: bigint;
    };
    /**
     * @generated from protobuf field: map<sint32, sint32> map_sint32_sint32 = 5;
     */
    mapSint32Sint32: {
        [key: number]: number;
    };
    /**
     * @generated from protobuf field: map<sint64, sint64> map_sint64_sint64 = 6;
     */
    mapSint64Sint64: {
        [key: string]: bigint;
    };
    /**
     * @generated from protobuf field: map<fixed32, fixed32> map_fixed32_fixed32 = 7;
     */
    mapFixed32Fixed32: {
        [key: number]: number;
    };
    /**
     * @generated from protobuf field: map<fixed64, fixed64> map_fixed64_fixed64 = 8;
     */
    mapFixed64Fixed64: {
        [key: string]: bigint;
    };
    /**
     * @generated from protobuf field: map<sfixed32, sfixed32> map_sfixed32_sfixed32 = 9;
     */
    mapSfixed32Sfixed32: {
        [key: number]: number;
    };
    /**
     * @generated from protobuf field: map<sfixed64, sfixed64> map_sfixed64_sfixed64 = 10;
     */
    mapSfixed64Sfixed64: {
        [key: string]: bigint;
    };
    /**
     * @generated from protobuf field: map<int32, float> map_int32_float = 11;
     */
    mapInt32Float: {
        [key: number]: number;
    };
    /**
     * @generated from protobuf field: map<int32, double> map_int32_double = 12;
     */
    mapInt32Double: {
        [key: number]: number;
    };
    /**
     * @generated from protobuf field: map<bool, bool> map_bool_bool = 13;
     */
    mapBoolBool: {
        [key: string]: boolean;
    };
    /**
     * @generated from protobuf field: map<string, string> map_string_string = 14;
     */
    mapStringString: {
        [key: string]: string;
    };
    /**
     * @generated from protobuf field: map<int32, bytes> map_int32_bytes = 15;
     */
    mapInt32Bytes: {
        [key: number]: Uint8Array;
    };
    /**
     * @generated from protobuf field: map<int32, protobuf_unittest.MapEnumLite> map_int32_enum = 16;
     */
    mapInt32Enum: {
        [key: number]: MapEnumLite;
    };
    /**
     * @generated from protobuf field: map<int32, protobuf_unittest.ForeignMessageArenaLite> map_int32_foreign_message = 17;
     */
    mapInt32ForeignMessage: {
        [key: number]: ForeignMessageArenaLite;
    };
}
/**
 * Test embedded message with required fields
 *
 * @generated from protobuf message protobuf_unittest.TestRequiredMessageMapLite
 */
export interface TestRequiredMessageMapLite {
    /**
     * @generated from protobuf field: map<int32, protobuf_unittest.TestRequiredLite> map_field = 1;
     */
    mapField: {
        [key: number]: TestRequiredLite;
    };
}
/**
 * @generated from protobuf message protobuf_unittest.TestEnumMapLite
 */
export interface TestEnumMapLite {
    /**
     * @generated from protobuf field: map<int32, protobuf_unittest.Proto2MapEnumLite> known_map_field = 101;
     */
    knownMapField: {
        [key: number]: Proto2MapEnumLite;
    };
    /**
     * @generated from protobuf field: map<int32, protobuf_unittest.Proto2MapEnumLite> unknown_map_field = 102;
     */
    unknownMapField: {
        [key: number]: Proto2MapEnumLite;
    };
}
/**
 * @generated from protobuf message protobuf_unittest.TestEnumMapPlusExtraLite
 */
export interface TestEnumMapPlusExtraLite {
    /**
     * @generated from protobuf field: map<int32, protobuf_unittest.Proto2MapEnumPlusExtraLite> known_map_field = 101;
     */
    knownMapField: {
        [key: number]: Proto2MapEnumPlusExtraLite;
    };
    /**
     * @generated from protobuf field: map<int32, protobuf_unittest.Proto2MapEnumPlusExtraLite> unknown_map_field = 102;
     */
    unknownMapField: {
        [key: number]: Proto2MapEnumPlusExtraLite;
    };
}
/**
 * @generated from protobuf message protobuf_unittest.TestMessageMapLite
 */
export interface TestMessageMapLite {
    /**
     * @generated from protobuf field: map<int32, protobuf_unittest.TestAllTypesLite> map_int32_message = 1;
     */
    mapInt32Message: {
        [key: number]: TestAllTypesLite;
    };
}
/**
 * @generated from protobuf message protobuf_unittest.TestRequiredLite
 */
export interface TestRequiredLite {
    /**
     * @generated from protobuf field: int32 a = 1;
     */
    a: number;
    /**
     * @generated from protobuf field: int32 b = 2;
     */
    b: number;
    /**
     * @generated from protobuf field: int32 c = 3;
     */
    c: number;
}
/**
 * @generated from protobuf message protobuf_unittest.ForeignMessageArenaLite
 */
export interface ForeignMessageArenaLite {
    /**
     * @generated from protobuf field: optional int32 c = 1;
     */
    c?: number;
}
/**
 * @generated from protobuf enum protobuf_unittest.Proto2MapEnumLite
 */
export enum Proto2MapEnumLite {
    /**
     * @generated from protobuf enum value: PROTO2_MAP_ENUM_FOO_LITE = 0;
     */
    PROTO2_MAP_ENUM_FOO_LITE = 0,
    /**
     * @generated from protobuf enum value: PROTO2_MAP_ENUM_BAR_LITE = 1;
     */
    PROTO2_MAP_ENUM_BAR_LITE = 1,
    /**
     * @generated from protobuf enum value: PROTO2_MAP_ENUM_BAZ_LITE = 2;
     */
    PROTO2_MAP_ENUM_BAZ_LITE = 2
}
/**
 * @generated from protobuf enum protobuf_unittest.Proto2MapEnumPlusExtraLite
 */
export enum Proto2MapEnumPlusExtraLite {
    /**
     * @generated from protobuf enum value: E_PROTO2_MAP_ENUM_FOO_LITE = 0;
     */
    E_PROTO2_MAP_ENUM_FOO_LITE = 0,
    /**
     * @generated from protobuf enum value: E_PROTO2_MAP_ENUM_BAR_LITE = 1;
     */
    E_PROTO2_MAP_ENUM_BAR_LITE = 1,
    /**
     * @generated from protobuf enum value: E_PROTO2_MAP_ENUM_BAZ_LITE = 2;
     */
    E_PROTO2_MAP_ENUM_BAZ_LITE = 2,
    /**
     * @generated from protobuf enum value: E_PROTO2_MAP_ENUM_EXTRA_LITE = 3;
     */
    E_PROTO2_MAP_ENUM_EXTRA_LITE = 3
}
/**
 * @generated from protobuf enum protobuf_unittest.MapEnumLite
 */
export enum MapEnumLite {
    /**
     * @generated from protobuf enum value: MAP_ENUM_FOO_LITE = 0;
     */
    MAP_ENUM_FOO_LITE = 0,
    /**
     * @generated from protobuf enum value: MAP_ENUM_BAR_LITE = 1;
     */
    MAP_ENUM_BAR_LITE = 1,
    /**
     * @generated from protobuf enum value: MAP_ENUM_BAZ_LITE = 2;
     */
    MAP_ENUM_BAZ_LITE = 2
}
// @generated message type with reflection information, may provide speed optimized methods
class TestMapLite$Type extends MessageType<TestMapLite> {
    constructor() {
        super("protobuf_unittest.TestMapLite", [
            { no: 1, name: "map_int32_int32", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "scalar", T: 5 /*ScalarType.INT32*/ } },
            { no: 2, name: "map_int64_int64", kind: "map", K: 3 /*ScalarType.INT64*/, V: { kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 0 /*LongType.BIGINT*/ } },
            { no: 3, name: "map_uint32_uint32", kind: "map", K: 13 /*ScalarType.UINT32*/, V: { kind: "scalar", T: 13 /*ScalarType.UINT32*/ } },
            { no: 4, name: "map_uint64_uint64", kind: "map", K: 4 /*ScalarType.UINT64*/, V: { kind: "scalar", T: 4 /*ScalarType.UINT64*/, L: 0 /*LongType.BIGINT*/ } },
            { no: 5, name: "map_sint32_sint32", kind: "map", K: 17 /*ScalarType.SINT32*/, V: { kind: "scalar", T: 17 /*ScalarType.SINT32*/ } },
            { no: 6, name: "map_sint64_sint64", kind: "map", K: 18 /*ScalarType.SINT64*/, V: { kind: "scalar", T: 18 /*ScalarType.SINT64*/, L: 0 /*LongType.BIGINT*/ } },
            { no: 7, name: "map_fixed32_fixed32", kind: "map", K: 7 /*ScalarType.FIXED32*/, V: { kind: "scalar", T: 7 /*ScalarType.FIXED32*/ } },
            { no: 8, name: "map_fixed64_fixed64", kind: "map", K: 6 /*ScalarType.FIXED64*/, V: { kind: "scalar", T: 6 /*ScalarType.FIXED64*/, L: 0 /*LongType.BIGINT*/ } },
            { no: 9, name: "map_sfixed32_sfixed32", kind: "map", K: 15 /*ScalarType.SFIXED32*/, V: { kind: "scalar", T: 15 /*ScalarType.SFIXED32*/ } },
            { no: 10, name: "map_sfixed64_sfixed64", kind: "map", K: 16 /*ScalarType.SFIXED64*/, V: { kind: "scalar", T: 16 /*ScalarType.SFIXED64*/, L: 0 /*LongType.BIGINT*/ } },
            { no: 11, name: "map_int32_float", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "scalar", T: 2 /*ScalarType.FLOAT*/ } },
            { no: 12, name: "map_int32_double", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ } },
            { no: 13, name: "map_bool_bool", kind: "map", K: 8 /*ScalarType.BOOL*/, V: { kind: "scalar", T: 8 /*ScalarType.BOOL*/ } },
            { no: 14, name: "map_string_string", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } },
            { no: 15, name: "map_int32_bytes", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "scalar", T: 12 /*ScalarType.BYTES*/ } },
            { no: 16, name: "map_int32_enum", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "enum", T: () => ["protobuf_unittest.MapEnumLite", MapEnumLite] } },
            { no: 17, name: "map_int32_foreign_message", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "message", T: () => ForeignMessageLite } },
            { no: 18, name: "teboring", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "scalar", T: 5 /*ScalarType.INT32*/ } }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.TestMapLite
 */
export const TestMapLite = new TestMapLite$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TestArenaMapLite$Type extends MessageType<TestArenaMapLite> {
    constructor() {
        super("protobuf_unittest.TestArenaMapLite", [
            { no: 1, name: "map_int32_int32", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "scalar", T: 5 /*ScalarType.INT32*/ } },
            { no: 2, name: "map_int64_int64", kind: "map", K: 3 /*ScalarType.INT64*/, V: { kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 0 /*LongType.BIGINT*/ } },
            { no: 3, name: "map_uint32_uint32", kind: "map", K: 13 /*ScalarType.UINT32*/, V: { kind: "scalar", T: 13 /*ScalarType.UINT32*/ } },
            { no: 4, name: "map_uint64_uint64", kind: "map", K: 4 /*ScalarType.UINT64*/, V: { kind: "scalar", T: 4 /*ScalarType.UINT64*/, L: 0 /*LongType.BIGINT*/ } },
            { no: 5, name: "map_sint32_sint32", kind: "map", K: 17 /*ScalarType.SINT32*/, V: { kind: "scalar", T: 17 /*ScalarType.SINT32*/ } },
            { no: 6, name: "map_sint64_sint64", kind: "map", K: 18 /*ScalarType.SINT64*/, V: { kind: "scalar", T: 18 /*ScalarType.SINT64*/, L: 0 /*LongType.BIGINT*/ } },
            { no: 7, name: "map_fixed32_fixed32", kind: "map", K: 7 /*ScalarType.FIXED32*/, V: { kind: "scalar", T: 7 /*ScalarType.FIXED32*/ } },
            { no: 8, name: "map_fixed64_fixed64", kind: "map", K: 6 /*ScalarType.FIXED64*/, V: { kind: "scalar", T: 6 /*ScalarType.FIXED64*/, L: 0 /*LongType.BIGINT*/ } },
            { no: 9, name: "map_sfixed32_sfixed32", kind: "map", K: 15 /*ScalarType.SFIXED32*/, V: { kind: "scalar", T: 15 /*ScalarType.SFIXED32*/ } },
            { no: 10, name: "map_sfixed64_sfixed64", kind: "map", K: 16 /*ScalarType.SFIXED64*/, V: { kind: "scalar", T: 16 /*ScalarType.SFIXED64*/, L: 0 /*LongType.BIGINT*/ } },
            { no: 11, name: "map_int32_float", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "scalar", T: 2 /*ScalarType.FLOAT*/ } },
            { no: 12, name: "map_int32_double", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ } },
            { no: 13, name: "map_bool_bool", kind: "map", K: 8 /*ScalarType.BOOL*/, V: { kind: "scalar", T: 8 /*ScalarType.BOOL*/ } },
            { no: 14, name: "map_string_string", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } },
            { no: 15, name: "map_int32_bytes", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "scalar", T: 12 /*ScalarType.BYTES*/ } },
            { no: 16, name: "map_int32_enum", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "enum", T: () => ["protobuf_unittest.MapEnumLite", MapEnumLite] } },
            { no: 17, name: "map_int32_foreign_message", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "message", T: () => ForeignMessageArenaLite } }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.TestArenaMapLite
 */
export const TestArenaMapLite = new TestArenaMapLite$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TestRequiredMessageMapLite$Type extends MessageType<TestRequiredMessageMapLite> {
    constructor() {
        super("protobuf_unittest.TestRequiredMessageMapLite", [
            { no: 1, name: "map_field", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "message", T: () => TestRequiredLite } }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.TestRequiredMessageMapLite
 */
export const TestRequiredMessageMapLite = new TestRequiredMessageMapLite$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TestEnumMapLite$Type extends MessageType<TestEnumMapLite> {
    constructor() {
        super("protobuf_unittest.TestEnumMapLite", [
            { no: 101, name: "known_map_field", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnumLite", Proto2MapEnumLite] } },
            { no: 102, name: "unknown_map_field", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnumLite", Proto2MapEnumLite] } }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.TestEnumMapLite
 */
export const TestEnumMapLite = new TestEnumMapLite$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TestEnumMapPlusExtraLite$Type extends MessageType<TestEnumMapPlusExtraLite> {
    constructor() {
        super("protobuf_unittest.TestEnumMapPlusExtraLite", [
            { no: 101, name: "known_map_field", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnumPlusExtraLite", Proto2MapEnumPlusExtraLite] } },
            { no: 102, name: "unknown_map_field", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "enum", T: () => ["protobuf_unittest.Proto2MapEnumPlusExtraLite", Proto2MapEnumPlusExtraLite] } }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.TestEnumMapPlusExtraLite
 */
export const TestEnumMapPlusExtraLite = new TestEnumMapPlusExtraLite$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TestMessageMapLite$Type extends MessageType<TestMessageMapLite> {
    constructor() {
        super("protobuf_unittest.TestMessageMapLite", [
            { no: 1, name: "map_int32_message", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "message", T: () => TestAllTypesLite } }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.TestMessageMapLite
 */
export const TestMessageMapLite = new TestMessageMapLite$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TestRequiredLite$Type extends MessageType<TestRequiredLite> {
    constructor() {
        super("protobuf_unittest.TestRequiredLite", [
            { no: 1, name: "a", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "b", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 3, name: "c", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.TestRequiredLite
 */
export const TestRequiredLite = new TestRequiredLite$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ForeignMessageArenaLite$Type extends MessageType<ForeignMessageArenaLite> {
    constructor() {
        super("protobuf_unittest.ForeignMessageArenaLite", [
            { no: 1, name: "c", kind: "scalar", opt: true, T: 5 /*ScalarType.INT32*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.ForeignMessageArenaLite
 */
export const ForeignMessageArenaLite = new ForeignMessageArenaLite$Type();
