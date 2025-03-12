// @generated by protobuf-ts 2.9.5 with parameter force_optimize_code_size,long_type_string
// @generated from protobuf file "google/protobuf/wrappers.proto" (package "google.protobuf", syntax proto3)
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
// Wrappers for primitive (non-message) types. These types are useful
// for embedding primitives in the `google.protobuf.Any` type and for places
// where we need to distinguish between the absence of a primitive
// typed field and its default value.
//
// These wrappers have no meaningful use within repeated fields as they lack
// the ability to detect presence on individual elements.
// These wrappers have no meaningful use within a map or a oneof since
// individual entries of a map or fields of a oneof can already detect presence.
//
import { ScalarType } from "@protobuf-ts/runtime";
import { LongType } from "@protobuf-ts/runtime";
import type { JsonValue } from "@protobuf-ts/runtime";
import type { JsonReadOptions } from "@protobuf-ts/runtime";
import type { JsonWriteOptions } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * Wrapper message for `double`.
 *
 * The JSON representation for `DoubleValue` is JSON number.
 *
 * @generated from protobuf message google.protobuf.DoubleValue
 */
export interface DoubleValue {
    /**
     * The double value.
     *
     * @generated from protobuf field: double value = 1;
     */
    value: number;
}
/**
 * Wrapper message for `float`.
 *
 * The JSON representation for `FloatValue` is JSON number.
 *
 * @generated from protobuf message google.protobuf.FloatValue
 */
export interface FloatValue {
    /**
     * The float value.
     *
     * @generated from protobuf field: float value = 1;
     */
    value: number;
}
/**
 * Wrapper message for `int64`.
 *
 * The JSON representation for `Int64Value` is JSON string.
 *
 * @generated from protobuf message google.protobuf.Int64Value
 */
export interface Int64Value {
    /**
     * The int64 value.
     *
     * @generated from protobuf field: int64 value = 1;
     */
    value: string;
}
/**
 * Wrapper message for `uint64`.
 *
 * The JSON representation for `UInt64Value` is JSON string.
 *
 * @generated from protobuf message google.protobuf.UInt64Value
 */
export interface UInt64Value {
    /**
     * The uint64 value.
     *
     * @generated from protobuf field: uint64 value = 1;
     */
    value: string;
}
/**
 * Wrapper message for `int32`.
 *
 * The JSON representation for `Int32Value` is JSON number.
 *
 * @generated from protobuf message google.protobuf.Int32Value
 */
export interface Int32Value {
    /**
     * The int32 value.
     *
     * @generated from protobuf field: int32 value = 1;
     */
    value: number;
}
/**
 * Wrapper message for `uint32`.
 *
 * The JSON representation for `UInt32Value` is JSON number.
 *
 * @generated from protobuf message google.protobuf.UInt32Value
 */
export interface UInt32Value {
    /**
     * The uint32 value.
     *
     * @generated from protobuf field: uint32 value = 1;
     */
    value: number;
}
/**
 * Wrapper message for `bool`.
 *
 * The JSON representation for `BoolValue` is JSON `true` and `false`.
 *
 * @generated from protobuf message google.protobuf.BoolValue
 */
export interface BoolValue {
    /**
     * The bool value.
     *
     * @generated from protobuf field: bool value = 1;
     */
    value: boolean;
}
/**
 * Wrapper message for `string`.
 *
 * The JSON representation for `StringValue` is JSON string.
 *
 * @generated from protobuf message google.protobuf.StringValue
 */
export interface StringValue {
    /**
     * The string value.
     *
     * @generated from protobuf field: string value = 1;
     */
    value: string;
}
/**
 * Wrapper message for `bytes`.
 *
 * The JSON representation for `BytesValue` is JSON string.
 *
 * @generated from protobuf message google.protobuf.BytesValue
 */
export interface BytesValue {
    /**
     * The bytes value.
     *
     * @generated from protobuf field: bytes value = 1;
     */
    value: Uint8Array;
}
// @generated message type with reflection information, may provide speed optimized methods
class DoubleValue$Type extends MessageType<DoubleValue> {
    constructor() {
        super("google.protobuf.DoubleValue", [
            { no: 1, name: "value", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ }
        ]);
    }
    /**
     * Encode `DoubleValue` to JSON number.
     */
    internalJsonWrite(message: DoubleValue, options: JsonWriteOptions): JsonValue {
        return this.refJsonWriter.scalar(2, message.value, "value", false, true);
    }
    /**
     * Decode `DoubleValue` from JSON number.
     */
    internalJsonRead(json: JsonValue, options: JsonReadOptions, target?: DoubleValue): DoubleValue {
        if (!target)
            target = this.create();
        target.value = this.refJsonReader.scalar(json, 1, undefined, "value") as number;
        return target;
    }
}
/**
 * @generated MessageType for protobuf message google.protobuf.DoubleValue
 */
export const DoubleValue = new DoubleValue$Type();
// @generated message type with reflection information, may provide speed optimized methods
class FloatValue$Type extends MessageType<FloatValue> {
    constructor() {
        super("google.protobuf.FloatValue", [
            { no: 1, name: "value", kind: "scalar", T: 2 /*ScalarType.FLOAT*/ }
        ]);
    }
    /**
     * Encode `FloatValue` to JSON number.
     */
    internalJsonWrite(message: FloatValue, options: JsonWriteOptions): JsonValue {
        return this.refJsonWriter.scalar(1, message.value, "value", false, true);
    }
    /**
     * Decode `FloatValue` from JSON number.
     */
    internalJsonRead(json: JsonValue, options: JsonReadOptions, target?: FloatValue): FloatValue {
        if (!target)
            target = this.create();
        target.value = this.refJsonReader.scalar(json, 1, undefined, "value") as number;
        return target;
    }
}
/**
 * @generated MessageType for protobuf message google.protobuf.FloatValue
 */
export const FloatValue = new FloatValue$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Int64Value$Type extends MessageType<Int64Value> {
    constructor() {
        super("google.protobuf.Int64Value", [
            { no: 1, name: "value", kind: "scalar", T: 3 /*ScalarType.INT64*/ }
        ]);
    }
    /**
     * Encode `Int64Value` to JSON string.
     */
    internalJsonWrite(message: Int64Value, options: JsonWriteOptions): JsonValue {
        return this.refJsonWriter.scalar(ScalarType.INT64, message.value, "value", false, true);
    }
    /**
     * Decode `Int64Value` from JSON string.
     */
    internalJsonRead(json: JsonValue, options: JsonReadOptions, target?: Int64Value): Int64Value {
        if (!target)
            target = this.create();
        target.value = this.refJsonReader.scalar(json, ScalarType.INT64, LongType.STRING, "value") as any;
        return target;
    }
}
/**
 * @generated MessageType for protobuf message google.protobuf.Int64Value
 */
export const Int64Value = new Int64Value$Type();
// @generated message type with reflection information, may provide speed optimized methods
class UInt64Value$Type extends MessageType<UInt64Value> {
    constructor() {
        super("google.protobuf.UInt64Value", [
            { no: 1, name: "value", kind: "scalar", T: 4 /*ScalarType.UINT64*/ }
        ]);
    }
    /**
     * Encode `UInt64Value` to JSON string.
     */
    internalJsonWrite(message: UInt64Value, options: JsonWriteOptions): JsonValue {
        return this.refJsonWriter.scalar(ScalarType.UINT64, message.value, "value", false, true);
    }
    /**
     * Decode `UInt64Value` from JSON string.
     */
    internalJsonRead(json: JsonValue, options: JsonReadOptions, target?: UInt64Value): UInt64Value {
        if (!target)
            target = this.create();
        target.value = this.refJsonReader.scalar(json, ScalarType.UINT64, LongType.STRING, "value") as any;
        return target;
    }
}
/**
 * @generated MessageType for protobuf message google.protobuf.UInt64Value
 */
export const UInt64Value = new UInt64Value$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Int32Value$Type extends MessageType<Int32Value> {
    constructor() {
        super("google.protobuf.Int32Value", [
            { no: 1, name: "value", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
    /**
     * Encode `Int32Value` to JSON string.
     */
    internalJsonWrite(message: Int32Value, options: JsonWriteOptions): JsonValue {
        return this.refJsonWriter.scalar(5, message.value, "value", false, true);
    }
    /**
     * Decode `Int32Value` from JSON string.
     */
    internalJsonRead(json: JsonValue, options: JsonReadOptions, target?: Int32Value): Int32Value {
        if (!target)
            target = this.create();
        target.value = this.refJsonReader.scalar(json, 5, undefined, "value") as number;
        return target;
    }
}
/**
 * @generated MessageType for protobuf message google.protobuf.Int32Value
 */
export const Int32Value = new Int32Value$Type();
// @generated message type with reflection information, may provide speed optimized methods
class UInt32Value$Type extends MessageType<UInt32Value> {
    constructor() {
        super("google.protobuf.UInt32Value", [
            { no: 1, name: "value", kind: "scalar", T: 13 /*ScalarType.UINT32*/ }
        ]);
    }
    /**
     * Encode `UInt32Value` to JSON string.
     */
    internalJsonWrite(message: UInt32Value, options: JsonWriteOptions): JsonValue {
        return this.refJsonWriter.scalar(13, message.value, "value", false, true);
    }
    /**
     * Decode `UInt32Value` from JSON string.
     */
    internalJsonRead(json: JsonValue, options: JsonReadOptions, target?: UInt32Value): UInt32Value {
        if (!target)
            target = this.create();
        target.value = this.refJsonReader.scalar(json, 13, undefined, "value") as number;
        return target;
    }
}
/**
 * @generated MessageType for protobuf message google.protobuf.UInt32Value
 */
export const UInt32Value = new UInt32Value$Type();
// @generated message type with reflection information, may provide speed optimized methods
class BoolValue$Type extends MessageType<BoolValue> {
    constructor() {
        super("google.protobuf.BoolValue", [
            { no: 1, name: "value", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
    /**
     * Encode `BoolValue` to JSON bool.
     */
    internalJsonWrite(message: BoolValue, options: JsonWriteOptions): JsonValue {
        return message.value;
    }
    /**
     * Decode `BoolValue` from JSON bool.
     */
    internalJsonRead(json: JsonValue, options: JsonReadOptions, target?: BoolValue): BoolValue {
        if (!target)
            target = this.create();
        target.value = this.refJsonReader.scalar(json, 8, undefined, "value") as boolean;
        return target;
    }
}
/**
 * @generated MessageType for protobuf message google.protobuf.BoolValue
 */
export const BoolValue = new BoolValue$Type();
// @generated message type with reflection information, may provide speed optimized methods
class StringValue$Type extends MessageType<StringValue> {
    constructor() {
        super("google.protobuf.StringValue", [
            { no: 1, name: "value", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    /**
     * Encode `StringValue` to JSON string.
     */
    internalJsonWrite(message: StringValue, options: JsonWriteOptions): JsonValue {
        return message.value;
    }
    /**
     * Decode `StringValue` from JSON string.
     */
    internalJsonRead(json: JsonValue, options: JsonReadOptions, target?: StringValue): StringValue {
        if (!target)
            target = this.create();
        target.value = this.refJsonReader.scalar(json, 9, undefined, "value") as string;
        return target;
    }
}
/**
 * @generated MessageType for protobuf message google.protobuf.StringValue
 */
export const StringValue = new StringValue$Type();
// @generated message type with reflection information, may provide speed optimized methods
class BytesValue$Type extends MessageType<BytesValue> {
    constructor() {
        super("google.protobuf.BytesValue", [
            { no: 1, name: "value", kind: "scalar", T: 12 /*ScalarType.BYTES*/ }
        ]);
    }
    /**
     * Encode `BytesValue` to JSON string.
     */
    internalJsonWrite(message: BytesValue, options: JsonWriteOptions): JsonValue {
        return this.refJsonWriter.scalar(12, message.value, "value", false, true);
    }
    /**
     * Decode `BytesValue` from JSON string.
     */
    internalJsonRead(json: JsonValue, options: JsonReadOptions, target?: BytesValue): BytesValue {
        if (!target)
            target = this.create();
        target.value = this.refJsonReader.scalar(json, 12, undefined, "value") as Uint8Array;
        return target;
    }
}
/**
 * @generated MessageType for protobuf message google.protobuf.BytesValue
 */
export const BytesValue = new BytesValue$Type();
