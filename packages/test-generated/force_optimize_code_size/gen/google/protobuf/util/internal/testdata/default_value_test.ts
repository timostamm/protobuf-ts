// @generated by protobuf-ts 2.9.5 with parameter force_optimize_code_size
// @generated from protobuf file "google/protobuf/util/internal/testdata/default_value_test.proto" (package "proto_util_converter.testing", syntax proto3)
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
/**
 * @generated from protobuf message proto_util_converter.testing.DefaultValueTest
 */
export interface DefaultValueTest {
    /**
     * @generated from protobuf field: double double_value = 1;
     */
    doubleValue: number;
    /**
     * @generated from protobuf field: repeated double repeated_double = 2;
     */
    repeatedDouble: number[];
    /**
     * @generated from protobuf field: float float_value = 3;
     */
    floatValue: number;
    /**
     * @generated from protobuf field: int64 int64_value = 5;
     */
    int64Value: bigint;
    /**
     * @generated from protobuf field: uint64 uint64_value = 7;
     */
    uint64Value: bigint;
    /**
     * @generated from protobuf field: int32 int32_value = 9;
     */
    int32Value: number;
    /**
     * @generated from protobuf field: uint32 uint32_value = 11;
     */
    uint32Value: number;
    /**
     * @generated from protobuf field: bool bool_value = 13;
     */
    boolValue: boolean;
    /**
     * @generated from protobuf field: string string_value = 15;
     */
    stringValue: string;
    /**
     * @generated from protobuf field: bytes bytes_value = 17;
     */
    bytesValue: Uint8Array;
    /**
     * @generated from protobuf field: proto_util_converter.testing.DefaultValueTest.EnumDefault enum_value = 18;
     */
    enumValue: DefaultValueTest_EnumDefault;
}
/**
 * @generated from protobuf enum proto_util_converter.testing.DefaultValueTest.EnumDefault
 */
export enum DefaultValueTest_EnumDefault {
    /**
     * @generated from protobuf enum value: ENUM_FIRST = 0;
     */
    ENUM_FIRST = 0,
    /**
     * @generated from protobuf enum value: ENUM_SECOND = 1;
     */
    ENUM_SECOND = 1,
    /**
     * @generated from protobuf enum value: ENUM_THIRD = 2;
     */
    ENUM_THIRD = 2
}
// @generated message type with reflection information, may provide speed optimized methods
class DefaultValueTest$Type extends MessageType<DefaultValueTest> {
    constructor() {
        super("proto_util_converter.testing.DefaultValueTest", [
            { no: 1, name: "double_value", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 2, name: "repeated_double", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 1 /*ScalarType.DOUBLE*/ },
            { no: 3, name: "float_value", kind: "scalar", T: 2 /*ScalarType.FLOAT*/ },
            { no: 5, name: "int64_value", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 7, name: "uint64_value", kind: "scalar", T: 4 /*ScalarType.UINT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 9, name: "int32_value", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 11, name: "uint32_value", kind: "scalar", T: 13 /*ScalarType.UINT32*/ },
            { no: 13, name: "bool_value", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 15, name: "string_value", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 17, name: "bytes_value", kind: "scalar", T: 12 /*ScalarType.BYTES*/ },
            { no: 18, name: "enum_value", kind: "enum", T: () => ["proto_util_converter.testing.DefaultValueTest.EnumDefault", DefaultValueTest_EnumDefault] }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message proto_util_converter.testing.DefaultValueTest
 */
export const DefaultValueTest = new DefaultValueTest$Type();
