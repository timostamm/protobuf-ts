// @generated by protobuf-ts 2.9.5 with parameter force_optimize_code_size,long_type_string
// @generated from protobuf file "google/protobuf/unittest_proto3_optional.proto" (package "protobuf_unittest", syntax proto3)
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
/**
 * @generated from protobuf message protobuf_unittest.TestProto3Optional
 */
export interface TestProto3Optional {
    /**
     * Singular
     *
     * @generated from protobuf field: optional int32 optional_int32 = 1;
     */
    optionalInt32?: number;
    /**
     * @generated from protobuf field: optional int64 optional_int64 = 2;
     */
    optionalInt64?: string;
    /**
     * @generated from protobuf field: optional uint32 optional_uint32 = 3;
     */
    optionalUint32?: number;
    /**
     * @generated from protobuf field: optional uint64 optional_uint64 = 4;
     */
    optionalUint64?: string;
    /**
     * @generated from protobuf field: optional sint32 optional_sint32 = 5;
     */
    optionalSint32?: number;
    /**
     * @generated from protobuf field: optional sint64 optional_sint64 = 6;
     */
    optionalSint64?: string;
    /**
     * @generated from protobuf field: optional fixed32 optional_fixed32 = 7;
     */
    optionalFixed32?: number;
    /**
     * @generated from protobuf field: optional fixed64 optional_fixed64 = 8;
     */
    optionalFixed64?: string;
    /**
     * @generated from protobuf field: optional sfixed32 optional_sfixed32 = 9;
     */
    optionalSfixed32?: number;
    /**
     * @generated from protobuf field: optional sfixed64 optional_sfixed64 = 10;
     */
    optionalSfixed64?: string;
    /**
     * @generated from protobuf field: optional float optional_float = 11;
     */
    optionalFloat?: number;
    /**
     * @generated from protobuf field: optional double optional_double = 12;
     */
    optionalDouble?: number;
    /**
     * @generated from protobuf field: optional bool optional_bool = 13;
     */
    optionalBool?: boolean;
    /**
     * @generated from protobuf field: optional string optional_string = 14;
     */
    optionalString?: string;
    /**
     * @generated from protobuf field: optional bytes optional_bytes = 15;
     */
    optionalBytes?: Uint8Array;
    /**
     * @generated from protobuf field: optional string optional_cord = 16;
     */
    optionalCord?: string;
    /**
     * @generated from protobuf field: optional protobuf_unittest.TestProto3Optional.NestedMessage optional_nested_message = 18;
     */
    optionalNestedMessage?: TestProto3Optional_NestedMessage;
    /**
     * @generated from protobuf field: optional protobuf_unittest.TestProto3Optional.NestedMessage lazy_nested_message = 19;
     */
    lazyNestedMessage?: TestProto3Optional_NestedMessage;
    /**
     * @generated from protobuf field: optional protobuf_unittest.TestProto3Optional.NestedEnum optional_nested_enum = 21;
     */
    optionalNestedEnum?: TestProto3Optional_NestedEnum;
    /**
     * Add some non-optional fields to verify we can mix them.
     *
     * @generated from protobuf field: int32 singular_int32 = 22;
     */
    singularInt32: number;
    /**
     * @generated from protobuf field: int64 singular_int64 = 23;
     */
    singularInt64: string;
}
/**
 * @generated from protobuf message protobuf_unittest.TestProto3Optional.NestedMessage
 */
export interface TestProto3Optional_NestedMessage {
    /**
     * The field name "b" fails to compile in proto1 because it conflicts with
     * a local variable named "b" in one of the generated methods.  Doh.
     * This file needs to compile in proto1 to test backwards-compatibility.
     *
     * @generated from protobuf field: optional int32 bb = 1;
     */
    bb?: number;
}
/**
 * @generated from protobuf enum protobuf_unittest.TestProto3Optional.NestedEnum
 */
export enum TestProto3Optional_NestedEnum {
    /**
     * @generated from protobuf enum value: UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
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
/**
 * @generated from protobuf message protobuf_unittest.TestProto3OptionalMessage
 */
export interface TestProto3OptionalMessage {
    /**
     * @generated from protobuf field: protobuf_unittest.TestProto3OptionalMessage.NestedMessage nested_message = 1;
     */
    nestedMessage?: TestProto3OptionalMessage_NestedMessage;
    /**
     * @generated from protobuf field: optional protobuf_unittest.TestProto3OptionalMessage.NestedMessage optional_nested_message = 2;
     */
    optionalNestedMessage?: TestProto3OptionalMessage_NestedMessage;
}
/**
 * @generated from protobuf message protobuf_unittest.TestProto3OptionalMessage.NestedMessage
 */
export interface TestProto3OptionalMessage_NestedMessage {
    /**
     * @generated from protobuf field: string s = 1;
     */
    s: string;
}
/**
 * @generated from protobuf message protobuf_unittest.Proto3OptionalExtensions
 */
export interface Proto3OptionalExtensions {
}
// @generated message type with reflection information, may provide speed optimized methods
class TestProto3Optional$Type extends MessageType<TestProto3Optional> {
    constructor() {
        super("protobuf_unittest.TestProto3Optional", [
            { no: 1, name: "optional_int32", kind: "scalar", opt: true, T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "optional_int64", kind: "scalar", opt: true, T: 3 /*ScalarType.INT64*/ },
            { no: 3, name: "optional_uint32", kind: "scalar", opt: true, T: 13 /*ScalarType.UINT32*/ },
            { no: 4, name: "optional_uint64", kind: "scalar", opt: true, T: 4 /*ScalarType.UINT64*/ },
            { no: 5, name: "optional_sint32", kind: "scalar", opt: true, T: 17 /*ScalarType.SINT32*/ },
            { no: 6, name: "optional_sint64", kind: "scalar", opt: true, T: 18 /*ScalarType.SINT64*/ },
            { no: 7, name: "optional_fixed32", kind: "scalar", opt: true, T: 7 /*ScalarType.FIXED32*/ },
            { no: 8, name: "optional_fixed64", kind: "scalar", opt: true, T: 6 /*ScalarType.FIXED64*/ },
            { no: 9, name: "optional_sfixed32", kind: "scalar", opt: true, T: 15 /*ScalarType.SFIXED32*/ },
            { no: 10, name: "optional_sfixed64", kind: "scalar", opt: true, T: 16 /*ScalarType.SFIXED64*/ },
            { no: 11, name: "optional_float", kind: "scalar", opt: true, T: 2 /*ScalarType.FLOAT*/ },
            { no: 12, name: "optional_double", kind: "scalar", opt: true, T: 1 /*ScalarType.DOUBLE*/ },
            { no: 13, name: "optional_bool", kind: "scalar", opt: true, T: 8 /*ScalarType.BOOL*/ },
            { no: 14, name: "optional_string", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 15, name: "optional_bytes", kind: "scalar", opt: true, T: 12 /*ScalarType.BYTES*/ },
            { no: 16, name: "optional_cord", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 18, name: "optional_nested_message", kind: "message", T: () => TestProto3Optional_NestedMessage },
            { no: 19, name: "lazy_nested_message", kind: "message", T: () => TestProto3Optional_NestedMessage },
            { no: 21, name: "optional_nested_enum", kind: "enum", opt: true, T: () => ["protobuf_unittest.TestProto3Optional.NestedEnum", TestProto3Optional_NestedEnum] },
            { no: 22, name: "singular_int32", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 23, name: "singular_int64", kind: "scalar", T: 3 /*ScalarType.INT64*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.TestProto3Optional
 */
export const TestProto3Optional = new TestProto3Optional$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TestProto3Optional_NestedMessage$Type extends MessageType<TestProto3Optional_NestedMessage> {
    constructor() {
        super("protobuf_unittest.TestProto3Optional.NestedMessage", [
            { no: 1, name: "bb", kind: "scalar", opt: true, T: 5 /*ScalarType.INT32*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.TestProto3Optional.NestedMessage
 */
export const TestProto3Optional_NestedMessage = new TestProto3Optional_NestedMessage$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TestProto3OptionalMessage$Type extends MessageType<TestProto3OptionalMessage> {
    constructor() {
        super("protobuf_unittest.TestProto3OptionalMessage", [
            { no: 1, name: "nested_message", kind: "message", T: () => TestProto3OptionalMessage_NestedMessage },
            { no: 2, name: "optional_nested_message", kind: "message", T: () => TestProto3OptionalMessage_NestedMessage }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.TestProto3OptionalMessage
 */
export const TestProto3OptionalMessage = new TestProto3OptionalMessage$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TestProto3OptionalMessage_NestedMessage$Type extends MessageType<TestProto3OptionalMessage_NestedMessage> {
    constructor() {
        super("protobuf_unittest.TestProto3OptionalMessage.NestedMessage", [
            { no: 1, name: "s", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.TestProto3OptionalMessage.NestedMessage
 */
export const TestProto3OptionalMessage_NestedMessage = new TestProto3OptionalMessage_NestedMessage$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Proto3OptionalExtensions$Type extends MessageType<Proto3OptionalExtensions> {
    constructor() {
        super("protobuf_unittest.Proto3OptionalExtensions", [], { "protobuf_unittest.Proto3OptionalExtensions.ext_no_optional": 8, "protobuf_unittest.Proto3OptionalExtensions.ext_with_optional": 16 });
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.Proto3OptionalExtensions
 */
export const Proto3OptionalExtensions = new Proto3OptionalExtensions$Type();
