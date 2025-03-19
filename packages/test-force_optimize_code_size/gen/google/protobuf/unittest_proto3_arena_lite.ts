// @generated by protobuf-ts 2.9.6 with parameter force_optimize_code_size
// @generated from protobuf file "google/protobuf/unittest_proto3_arena_lite.proto" (package "proto3_arena_lite_unittest", syntax proto3)
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
import { PublicImportMessage } from "./unittest_import_public";
import { ImportMessage } from "./unittest_import";
/**
 * This proto includes every type of field in both singular and repeated
 * forms.
 *
 * @generated from protobuf message proto3_arena_lite_unittest.TestAllTypes
 */
export interface TestAllTypes {
    /**
     * Singular
     *
     * @generated from protobuf field: int32 optional_int32 = 1;
     */
    optionalInt32: number;
    /**
     * @generated from protobuf field: int64 optional_int64 = 2;
     */
    optionalInt64: bigint;
    /**
     * @generated from protobuf field: uint32 optional_uint32 = 3;
     */
    optionalUint32: number;
    /**
     * @generated from protobuf field: uint64 optional_uint64 = 4;
     */
    optionalUint64: bigint;
    /**
     * @generated from protobuf field: sint32 optional_sint32 = 5;
     */
    optionalSint32: number;
    /**
     * @generated from protobuf field: sint64 optional_sint64 = 6;
     */
    optionalSint64: bigint;
    /**
     * @generated from protobuf field: fixed32 optional_fixed32 = 7;
     */
    optionalFixed32: number;
    /**
     * @generated from protobuf field: fixed64 optional_fixed64 = 8;
     */
    optionalFixed64: bigint;
    /**
     * @generated from protobuf field: sfixed32 optional_sfixed32 = 9;
     */
    optionalSfixed32: number;
    /**
     * @generated from protobuf field: sfixed64 optional_sfixed64 = 10;
     */
    optionalSfixed64: bigint;
    /**
     * @generated from protobuf field: float optional_float = 11;
     */
    optionalFloat: number;
    /**
     * @generated from protobuf field: double optional_double = 12;
     */
    optionalDouble: number;
    /**
     * @generated from protobuf field: bool optional_bool = 13;
     */
    optionalBool: boolean;
    /**
     * @generated from protobuf field: string optional_string = 14;
     */
    optionalString: string;
    /**
     * @generated from protobuf field: bytes optional_bytes = 15;
     */
    optionalBytes: Uint8Array;
    // Groups are not allowed in proto3.
    // optional group OptionalGroup = 16 {
    //   optional int32 a = 17;
    // }

    /**
     * @generated from protobuf field: proto3_arena_lite_unittest.TestAllTypes.NestedMessage optional_nested_message = 18;
     */
    optionalNestedMessage?: TestAllTypes_NestedMessage;
    /**
     * @generated from protobuf field: proto3_arena_lite_unittest.ForeignMessage optional_foreign_message = 19;
     */
    optionalForeignMessage?: ForeignMessage;
    /**
     * @generated from protobuf field: protobuf_unittest_import.ImportMessage optional_import_message = 20;
     */
    optionalImportMessage?: ImportMessage;
    /**
     * @generated from protobuf field: proto3_arena_lite_unittest.TestAllTypes.NestedEnum optional_nested_enum = 21;
     */
    optionalNestedEnum: TestAllTypes_NestedEnum;
    /**
     * @generated from protobuf field: proto3_arena_lite_unittest.ForeignEnum optional_foreign_enum = 22;
     */
    optionalForeignEnum: ForeignEnum;
    // Omitted (compared to unittest.proto) because proto2 enums are not allowed
    // inside proto2 messages.
    // 
    // optional protobuf_unittest_import.ImportEnum    optional_import_enum  = 23;

    /**
     * @generated from protobuf field: string optional_string_piece = 24;
     */
    optionalStringPiece: string;
    /**
     * @generated from protobuf field: string optional_cord = 25;
     */
    optionalCord: string;
    /**
     * Defined in unittest_import_public.proto
     *
     * @generated from protobuf field: protobuf_unittest_import.PublicImportMessage optional_public_import_message = 26;
     */
    optionalPublicImportMessage?: PublicImportMessage;
    /**
     * @generated from protobuf field: proto3_arena_lite_unittest.TestAllTypes.NestedMessage optional_lazy_message = 27;
     */
    optionalLazyMessage?: TestAllTypes_NestedMessage;
    /**
     * Repeated
     *
     * @generated from protobuf field: repeated int32 repeated_int32 = 31;
     */
    repeatedInt32: number[];
    /**
     * @generated from protobuf field: repeated int64 repeated_int64 = 32;
     */
    repeatedInt64: bigint[];
    /**
     * @generated from protobuf field: repeated uint32 repeated_uint32 = 33;
     */
    repeatedUint32: number[];
    /**
     * @generated from protobuf field: repeated uint64 repeated_uint64 = 34;
     */
    repeatedUint64: bigint[];
    /**
     * @generated from protobuf field: repeated sint32 repeated_sint32 = 35;
     */
    repeatedSint32: number[];
    /**
     * @generated from protobuf field: repeated sint64 repeated_sint64 = 36;
     */
    repeatedSint64: bigint[];
    /**
     * @generated from protobuf field: repeated fixed32 repeated_fixed32 = 37;
     */
    repeatedFixed32: number[];
    /**
     * @generated from protobuf field: repeated fixed64 repeated_fixed64 = 38;
     */
    repeatedFixed64: bigint[];
    /**
     * @generated from protobuf field: repeated sfixed32 repeated_sfixed32 = 39;
     */
    repeatedSfixed32: number[];
    /**
     * @generated from protobuf field: repeated sfixed64 repeated_sfixed64 = 40;
     */
    repeatedSfixed64: bigint[];
    /**
     * @generated from protobuf field: repeated float repeated_float = 41;
     */
    repeatedFloat: number[];
    /**
     * @generated from protobuf field: repeated double repeated_double = 42;
     */
    repeatedDouble: number[];
    /**
     * @generated from protobuf field: repeated bool repeated_bool = 43;
     */
    repeatedBool: boolean[];
    /**
     * @generated from protobuf field: repeated string repeated_string = 44;
     */
    repeatedString: string[];
    /**
     * @generated from protobuf field: repeated bytes repeated_bytes = 45;
     */
    repeatedBytes: Uint8Array[];
    // Groups are not allowed in proto3.
    // repeated group RepeatedGroup = 46 {
    //   optional int32 a = 47;
    // }

    /**
     * @generated from protobuf field: repeated proto3_arena_lite_unittest.TestAllTypes.NestedMessage repeated_nested_message = 48;
     */
    repeatedNestedMessage: TestAllTypes_NestedMessage[];
    /**
     * @generated from protobuf field: repeated proto3_arena_lite_unittest.ForeignMessage repeated_foreign_message = 49;
     */
    repeatedForeignMessage: ForeignMessage[];
    /**
     * @generated from protobuf field: repeated protobuf_unittest_import.ImportMessage repeated_import_message = 50;
     */
    repeatedImportMessage: ImportMessage[];
    /**
     * @generated from protobuf field: repeated proto3_arena_lite_unittest.TestAllTypes.NestedEnum repeated_nested_enum = 51;
     */
    repeatedNestedEnum: TestAllTypes_NestedEnum[];
    /**
     * @generated from protobuf field: repeated proto3_arena_lite_unittest.ForeignEnum repeated_foreign_enum = 52;
     */
    repeatedForeignEnum: ForeignEnum[];
    // Omitted (compared to unittest.proto) because proto2 enums are not allowed
    // inside proto2 messages.
    // 
    // repeated protobuf_unittest_import.ImportEnum    repeated_import_enum  = 53;

    /**
     * @generated from protobuf field: repeated string repeated_string_piece = 54;
     */
    repeatedStringPiece: string[];
    /**
     * @generated from protobuf field: repeated string repeated_cord = 55;
     */
    repeatedCord: string[];
    /**
     * @generated from protobuf field: repeated proto3_arena_lite_unittest.TestAllTypes.NestedMessage repeated_lazy_message = 57;
     */
    repeatedLazyMessage: TestAllTypes_NestedMessage[];
    /**
     * @generated from protobuf oneof: oneof_field
     */
    oneofField: {
        oneofKind: "oneofUint32";
        /**
         * @generated from protobuf field: uint32 oneof_uint32 = 111;
         */
        oneofUint32: number;
    } | {
        oneofKind: "oneofNestedMessage";
        /**
         * @generated from protobuf field: proto3_arena_lite_unittest.TestAllTypes.NestedMessage oneof_nested_message = 112;
         */
        oneofNestedMessage: TestAllTypes_NestedMessage;
    } | {
        oneofKind: "oneofString";
        /**
         * @generated from protobuf field: string oneof_string = 113;
         */
        oneofString: string;
    } | {
        oneofKind: "oneofBytes";
        /**
         * @generated from protobuf field: bytes oneof_bytes = 114;
         */
        oneofBytes: Uint8Array;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message proto3_arena_lite_unittest.TestAllTypes.NestedMessage
 */
export interface TestAllTypes_NestedMessage {
    /**
     * The field name "b" fails to compile in proto1 because it conflicts with
     * a local variable named "b" in one of the generated methods.  Doh.
     * This file needs to compile in proto1 to test backwards-compatibility.
     *
     * @generated from protobuf field: int32 bb = 1;
     */
    bb: number;
}
/**
 * @generated from protobuf enum proto3_arena_lite_unittest.TestAllTypes.NestedEnum
 */
export enum TestAllTypes_NestedEnum {
    /**
     * @generated from protobuf enum value: ZERO = 0;
     */
    ZERO = 0,
    /**
     * @generated from protobuf enum value: FOO = 1;
     */
    FOO = 1,
    /**
     * @generated from protobuf enum value: BAR = 2;
     */
    BAR = 2,
    /**
     * @generated from protobuf enum value: BAZ = 3;
     */
    BAZ = 3,
    /**
     * Intentionally negative.
     *
     * @generated from protobuf enum value: NEG = -1;
     */
    NEG = -1
}
// Test messages for packed fields

/**
 * @generated from protobuf message proto3_arena_lite_unittest.TestPackedTypes
 */
export interface TestPackedTypes {
    /**
     * @generated from protobuf field: repeated int32 packed_int32 = 90 [packed = true];
     */
    packedInt32: number[];
    /**
     * @generated from protobuf field: repeated int64 packed_int64 = 91 [packed = true];
     */
    packedInt64: bigint[];
    /**
     * @generated from protobuf field: repeated uint32 packed_uint32 = 92 [packed = true];
     */
    packedUint32: number[];
    /**
     * @generated from protobuf field: repeated uint64 packed_uint64 = 93 [packed = true];
     */
    packedUint64: bigint[];
    /**
     * @generated from protobuf field: repeated sint32 packed_sint32 = 94 [packed = true];
     */
    packedSint32: number[];
    /**
     * @generated from protobuf field: repeated sint64 packed_sint64 = 95 [packed = true];
     */
    packedSint64: bigint[];
    /**
     * @generated from protobuf field: repeated fixed32 packed_fixed32 = 96 [packed = true];
     */
    packedFixed32: number[];
    /**
     * @generated from protobuf field: repeated fixed64 packed_fixed64 = 97 [packed = true];
     */
    packedFixed64: bigint[];
    /**
     * @generated from protobuf field: repeated sfixed32 packed_sfixed32 = 98 [packed = true];
     */
    packedSfixed32: number[];
    /**
     * @generated from protobuf field: repeated sfixed64 packed_sfixed64 = 99 [packed = true];
     */
    packedSfixed64: bigint[];
    /**
     * @generated from protobuf field: repeated float packed_float = 100 [packed = true];
     */
    packedFloat: number[];
    /**
     * @generated from protobuf field: repeated double packed_double = 101 [packed = true];
     */
    packedDouble: number[];
    /**
     * @generated from protobuf field: repeated bool packed_bool = 102 [packed = true];
     */
    packedBool: boolean[];
    /**
     * @generated from protobuf field: repeated proto3_arena_lite_unittest.ForeignEnum packed_enum = 103 [packed = true];
     */
    packedEnum: ForeignEnum[];
}
/**
 * Explicitly set packed to false
 *
 * @generated from protobuf message proto3_arena_lite_unittest.TestUnpackedTypes
 */
export interface TestUnpackedTypes {
    /**
     * @generated from protobuf field: repeated int32 repeated_int32 = 1 [packed = false];
     */
    repeatedInt32: number[];
    /**
     * @generated from protobuf field: repeated int64 repeated_int64 = 2 [packed = false];
     */
    repeatedInt64: bigint[];
    /**
     * @generated from protobuf field: repeated uint32 repeated_uint32 = 3 [packed = false];
     */
    repeatedUint32: number[];
    /**
     * @generated from protobuf field: repeated uint64 repeated_uint64 = 4 [packed = false];
     */
    repeatedUint64: bigint[];
    /**
     * @generated from protobuf field: repeated sint32 repeated_sint32 = 5 [packed = false];
     */
    repeatedSint32: number[];
    /**
     * @generated from protobuf field: repeated sint64 repeated_sint64 = 6 [packed = false];
     */
    repeatedSint64: bigint[];
    /**
     * @generated from protobuf field: repeated fixed32 repeated_fixed32 = 7 [packed = false];
     */
    repeatedFixed32: number[];
    /**
     * @generated from protobuf field: repeated fixed64 repeated_fixed64 = 8 [packed = false];
     */
    repeatedFixed64: bigint[];
    /**
     * @generated from protobuf field: repeated sfixed32 repeated_sfixed32 = 9 [packed = false];
     */
    repeatedSfixed32: number[];
    /**
     * @generated from protobuf field: repeated sfixed64 repeated_sfixed64 = 10 [packed = false];
     */
    repeatedSfixed64: bigint[];
    /**
     * @generated from protobuf field: repeated float repeated_float = 11 [packed = false];
     */
    repeatedFloat: number[];
    /**
     * @generated from protobuf field: repeated double repeated_double = 12 [packed = false];
     */
    repeatedDouble: number[];
    /**
     * @generated from protobuf field: repeated bool repeated_bool = 13 [packed = false];
     */
    repeatedBool: boolean[];
    /**
     * @generated from protobuf field: repeated proto3_arena_lite_unittest.TestAllTypes.NestedEnum repeated_nested_enum = 14 [packed = false];
     */
    repeatedNestedEnum: TestAllTypes_NestedEnum[];
}
/**
 * This proto includes a recursively nested message.
 *
 * @generated from protobuf message proto3_arena_lite_unittest.NestedTestAllTypes
 */
export interface NestedTestAllTypes {
    /**
     * @generated from protobuf field: proto3_arena_lite_unittest.NestedTestAllTypes child = 1;
     */
    child?: NestedTestAllTypes;
    /**
     * @generated from protobuf field: proto3_arena_lite_unittest.TestAllTypes payload = 2;
     */
    payload?: TestAllTypes;
}
/**
 * Define these after TestAllTypes to make sure the compiler can handle
 * that.
 *
 * @generated from protobuf message proto3_arena_lite_unittest.ForeignMessage
 */
export interface ForeignMessage {
    /**
     * @generated from protobuf field: int32 c = 1;
     */
    c: number;
}
/**
 * TestEmptyMessage is used to test behavior of unknown fields.
 *
 * @generated from protobuf message proto3_arena_lite_unittest.TestEmptyMessage
 */
export interface TestEmptyMessage {
}
/**
 * @generated from protobuf enum proto3_arena_lite_unittest.ForeignEnum
 */
export enum ForeignEnum {
    /**
     * @generated from protobuf enum value: FOREIGN_ZERO = 0;
     */
    FOREIGN_ZERO = 0,
    /**
     * @generated from protobuf enum value: FOREIGN_FOO = 4;
     */
    FOREIGN_FOO = 4,
    /**
     * @generated from protobuf enum value: FOREIGN_BAR = 5;
     */
    FOREIGN_BAR = 5,
    /**
     * @generated from protobuf enum value: FOREIGN_BAZ = 6;
     */
    FOREIGN_BAZ = 6
}
// @generated message type with reflection information, may provide speed optimized methods
class TestAllTypes$Type extends MessageType<TestAllTypes> {
    constructor() {
        super("proto3_arena_lite_unittest.TestAllTypes", [
            { no: 1, name: "optional_int32", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "optional_int64", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 3, name: "optional_uint32", kind: "scalar", T: 13 /*ScalarType.UINT32*/ },
            { no: 4, name: "optional_uint64", kind: "scalar", T: 4 /*ScalarType.UINT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 5, name: "optional_sint32", kind: "scalar", T: 17 /*ScalarType.SINT32*/ },
            { no: 6, name: "optional_sint64", kind: "scalar", T: 18 /*ScalarType.SINT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 7, name: "optional_fixed32", kind: "scalar", T: 7 /*ScalarType.FIXED32*/ },
            { no: 8, name: "optional_fixed64", kind: "scalar", T: 6 /*ScalarType.FIXED64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 9, name: "optional_sfixed32", kind: "scalar", T: 15 /*ScalarType.SFIXED32*/ },
            { no: 10, name: "optional_sfixed64", kind: "scalar", T: 16 /*ScalarType.SFIXED64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 11, name: "optional_float", kind: "scalar", T: 2 /*ScalarType.FLOAT*/ },
            { no: 12, name: "optional_double", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 13, name: "optional_bool", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 14, name: "optional_string", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 15, name: "optional_bytes", kind: "scalar", T: 12 /*ScalarType.BYTES*/ },
            { no: 18, name: "optional_nested_message", kind: "message", T: () => TestAllTypes_NestedMessage },
            { no: 19, name: "optional_foreign_message", kind: "message", T: () => ForeignMessage },
            { no: 20, name: "optional_import_message", kind: "message", T: () => ImportMessage },
            { no: 21, name: "optional_nested_enum", kind: "enum", T: () => ["proto3_arena_lite_unittest.TestAllTypes.NestedEnum", TestAllTypes_NestedEnum] },
            { no: 22, name: "optional_foreign_enum", kind: "enum", T: () => ["proto3_arena_lite_unittest.ForeignEnum", ForeignEnum] },
            { no: 24, name: "optional_string_piece", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 25, name: "optional_cord", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 26, name: "optional_public_import_message", kind: "message", T: () => PublicImportMessage },
            { no: 27, name: "optional_lazy_message", kind: "message", T: () => TestAllTypes_NestedMessage },
            { no: 31, name: "repeated_int32", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 5 /*ScalarType.INT32*/ },
            { no: 32, name: "repeated_int64", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 3 /*ScalarType.INT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 33, name: "repeated_uint32", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 13 /*ScalarType.UINT32*/ },
            { no: 34, name: "repeated_uint64", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 4 /*ScalarType.UINT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 35, name: "repeated_sint32", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 17 /*ScalarType.SINT32*/ },
            { no: 36, name: "repeated_sint64", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 18 /*ScalarType.SINT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 37, name: "repeated_fixed32", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 7 /*ScalarType.FIXED32*/ },
            { no: 38, name: "repeated_fixed64", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 6 /*ScalarType.FIXED64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 39, name: "repeated_sfixed32", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 15 /*ScalarType.SFIXED32*/ },
            { no: 40, name: "repeated_sfixed64", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 16 /*ScalarType.SFIXED64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 41, name: "repeated_float", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 2 /*ScalarType.FLOAT*/ },
            { no: 42, name: "repeated_double", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 1 /*ScalarType.DOUBLE*/ },
            { no: 43, name: "repeated_bool", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 8 /*ScalarType.BOOL*/ },
            { no: 44, name: "repeated_string", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ },
            { no: 45, name: "repeated_bytes", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 12 /*ScalarType.BYTES*/ },
            { no: 48, name: "repeated_nested_message", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => TestAllTypes_NestedMessage },
            { no: 49, name: "repeated_foreign_message", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => ForeignMessage },
            { no: 50, name: "repeated_import_message", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => ImportMessage },
            { no: 51, name: "repeated_nested_enum", kind: "enum", repeat: 1 /*RepeatType.PACKED*/, T: () => ["proto3_arena_lite_unittest.TestAllTypes.NestedEnum", TestAllTypes_NestedEnum] },
            { no: 52, name: "repeated_foreign_enum", kind: "enum", repeat: 1 /*RepeatType.PACKED*/, T: () => ["proto3_arena_lite_unittest.ForeignEnum", ForeignEnum] },
            { no: 54, name: "repeated_string_piece", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ },
            { no: 55, name: "repeated_cord", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ },
            { no: 57, name: "repeated_lazy_message", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => TestAllTypes_NestedMessage },
            { no: 111, name: "oneof_uint32", kind: "scalar", oneof: "oneofField", T: 13 /*ScalarType.UINT32*/ },
            { no: 112, name: "oneof_nested_message", kind: "message", oneof: "oneofField", T: () => TestAllTypes_NestedMessage },
            { no: 113, name: "oneof_string", kind: "scalar", oneof: "oneofField", T: 9 /*ScalarType.STRING*/ },
            { no: 114, name: "oneof_bytes", kind: "scalar", oneof: "oneofField", T: 12 /*ScalarType.BYTES*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message proto3_arena_lite_unittest.TestAllTypes
 */
export const TestAllTypes = new TestAllTypes$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TestAllTypes_NestedMessage$Type extends MessageType<TestAllTypes_NestedMessage> {
    constructor() {
        super("proto3_arena_lite_unittest.TestAllTypes.NestedMessage", [
            { no: 1, name: "bb", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message proto3_arena_lite_unittest.TestAllTypes.NestedMessage
 */
export const TestAllTypes_NestedMessage = new TestAllTypes_NestedMessage$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TestPackedTypes$Type extends MessageType<TestPackedTypes> {
    constructor() {
        super("proto3_arena_lite_unittest.TestPackedTypes", [
            { no: 90, name: "packed_int32", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 5 /*ScalarType.INT32*/ },
            { no: 91, name: "packed_int64", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 3 /*ScalarType.INT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 92, name: "packed_uint32", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 13 /*ScalarType.UINT32*/ },
            { no: 93, name: "packed_uint64", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 4 /*ScalarType.UINT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 94, name: "packed_sint32", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 17 /*ScalarType.SINT32*/ },
            { no: 95, name: "packed_sint64", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 18 /*ScalarType.SINT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 96, name: "packed_fixed32", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 7 /*ScalarType.FIXED32*/ },
            { no: 97, name: "packed_fixed64", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 6 /*ScalarType.FIXED64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 98, name: "packed_sfixed32", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 15 /*ScalarType.SFIXED32*/ },
            { no: 99, name: "packed_sfixed64", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 16 /*ScalarType.SFIXED64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 100, name: "packed_float", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 2 /*ScalarType.FLOAT*/ },
            { no: 101, name: "packed_double", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 1 /*ScalarType.DOUBLE*/ },
            { no: 102, name: "packed_bool", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 8 /*ScalarType.BOOL*/ },
            { no: 103, name: "packed_enum", kind: "enum", repeat: 1 /*RepeatType.PACKED*/, T: () => ["proto3_arena_lite_unittest.ForeignEnum", ForeignEnum] }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message proto3_arena_lite_unittest.TestPackedTypes
 */
export const TestPackedTypes = new TestPackedTypes$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TestUnpackedTypes$Type extends MessageType<TestUnpackedTypes> {
    constructor() {
        super("proto3_arena_lite_unittest.TestUnpackedTypes", [
            { no: 1, name: "repeated_int32", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "repeated_int64", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 3 /*ScalarType.INT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 3, name: "repeated_uint32", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 13 /*ScalarType.UINT32*/ },
            { no: 4, name: "repeated_uint64", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 4 /*ScalarType.UINT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 5, name: "repeated_sint32", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 17 /*ScalarType.SINT32*/ },
            { no: 6, name: "repeated_sint64", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 18 /*ScalarType.SINT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 7, name: "repeated_fixed32", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 7 /*ScalarType.FIXED32*/ },
            { no: 8, name: "repeated_fixed64", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 6 /*ScalarType.FIXED64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 9, name: "repeated_sfixed32", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 15 /*ScalarType.SFIXED32*/ },
            { no: 10, name: "repeated_sfixed64", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 16 /*ScalarType.SFIXED64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 11, name: "repeated_float", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 2 /*ScalarType.FLOAT*/ },
            { no: 12, name: "repeated_double", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 1 /*ScalarType.DOUBLE*/ },
            { no: 13, name: "repeated_bool", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 8 /*ScalarType.BOOL*/ },
            { no: 14, name: "repeated_nested_enum", kind: "enum", repeat: 2 /*RepeatType.UNPACKED*/, T: () => ["proto3_arena_lite_unittest.TestAllTypes.NestedEnum", TestAllTypes_NestedEnum] }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message proto3_arena_lite_unittest.TestUnpackedTypes
 */
export const TestUnpackedTypes = new TestUnpackedTypes$Type();
// @generated message type with reflection information, may provide speed optimized methods
class NestedTestAllTypes$Type extends MessageType<NestedTestAllTypes> {
    constructor() {
        super("proto3_arena_lite_unittest.NestedTestAllTypes", [
            { no: 1, name: "child", kind: "message", T: () => NestedTestAllTypes },
            { no: 2, name: "payload", kind: "message", T: () => TestAllTypes }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message proto3_arena_lite_unittest.NestedTestAllTypes
 */
export const NestedTestAllTypes = new NestedTestAllTypes$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ForeignMessage$Type extends MessageType<ForeignMessage> {
    constructor() {
        super("proto3_arena_lite_unittest.ForeignMessage", [
            { no: 1, name: "c", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message proto3_arena_lite_unittest.ForeignMessage
 */
export const ForeignMessage = new ForeignMessage$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TestEmptyMessage$Type extends MessageType<TestEmptyMessage> {
    constructor() {
        super("proto3_arena_lite_unittest.TestEmptyMessage", []);
    }
}
/**
 * @generated MessageType for protobuf message proto3_arena_lite_unittest.TestEmptyMessage
 */
export const TestEmptyMessage = new TestEmptyMessage$Type();
