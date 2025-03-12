// @generated by protobuf-ts 2.9.5
// @generated from protobuf file "google/protobuf/unittest_drop_unknown_fields.proto" (package "unittest_drop_unknown_fields", syntax proto3)
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
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message unittest_drop_unknown_fields.Foo
 */
export interface Foo {
    /**
     * @generated from protobuf field: int32 int32_value = 1;
     */
    int32Value: number;
    /**
     * @generated from protobuf field: unittest_drop_unknown_fields.Foo.NestedEnum enum_value = 2;
     */
    enumValue: Foo_NestedEnum;
}
/**
 * @generated from protobuf enum unittest_drop_unknown_fields.Foo.NestedEnum
 */
export enum Foo_NestedEnum {
    /**
     * @generated from protobuf enum value: FOO = 0;
     */
    FOO = 0,
    /**
     * @generated from protobuf enum value: BAR = 1;
     */
    BAR = 1,
    /**
     * @generated from protobuf enum value: BAZ = 2;
     */
    BAZ = 2
}
/**
 * @generated from protobuf message unittest_drop_unknown_fields.FooWithExtraFields
 */
export interface FooWithExtraFields {
    /**
     * @generated from protobuf field: int32 int32_value = 1;
     */
    int32Value: number;
    /**
     * @generated from protobuf field: unittest_drop_unknown_fields.FooWithExtraFields.NestedEnum enum_value = 2;
     */
    enumValue: FooWithExtraFields_NestedEnum;
    /**
     * @generated from protobuf field: int32 extra_int32_value = 3;
     */
    extraInt32Value: number;
}
/**
 * @generated from protobuf enum unittest_drop_unknown_fields.FooWithExtraFields.NestedEnum
 */
export enum FooWithExtraFields_NestedEnum {
    /**
     * @generated from protobuf enum value: FOO = 0;
     */
    FOO = 0,
    /**
     * @generated from protobuf enum value: BAR = 1;
     */
    BAR = 1,
    /**
     * @generated from protobuf enum value: BAZ = 2;
     */
    BAZ = 2,
    /**
     * @generated from protobuf enum value: QUX = 3;
     */
    QUX = 3
}
// @generated message type with reflection information, may provide speed optimized methods
class Foo$Type extends MessageType<Foo> {
    constructor() {
        super("unittest_drop_unknown_fields.Foo", [
            { no: 1, name: "int32_value", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "enum_value", kind: "enum", T: () => ["unittest_drop_unknown_fields.Foo.NestedEnum", Foo_NestedEnum] }
        ]);
    }
    create(value?: PartialMessage<Foo>): Foo {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.int32Value = 0;
        message.enumValue = 0;
        if (value !== undefined)
            reflectionMergePartial<Foo>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Foo): Foo {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 int32_value */ 1:
                    message.int32Value = reader.int32();
                    break;
                case /* unittest_drop_unknown_fields.Foo.NestedEnum enum_value */ 2:
                    message.enumValue = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: Foo, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* int32 int32_value = 1; */
        if (message.int32Value !== 0)
            writer.tag(1, WireType.Varint).int32(message.int32Value);
        /* unittest_drop_unknown_fields.Foo.NestedEnum enum_value = 2; */
        if (message.enumValue !== 0)
            writer.tag(2, WireType.Varint).int32(message.enumValue);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message unittest_drop_unknown_fields.Foo
 */
export const Foo = new Foo$Type();
// @generated message type with reflection information, may provide speed optimized methods
class FooWithExtraFields$Type extends MessageType<FooWithExtraFields> {
    constructor() {
        super("unittest_drop_unknown_fields.FooWithExtraFields", [
            { no: 1, name: "int32_value", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "enum_value", kind: "enum", T: () => ["unittest_drop_unknown_fields.FooWithExtraFields.NestedEnum", FooWithExtraFields_NestedEnum] },
            { no: 3, name: "extra_int32_value", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
    create(value?: PartialMessage<FooWithExtraFields>): FooWithExtraFields {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.int32Value = 0;
        message.enumValue = 0;
        message.extraInt32Value = 0;
        if (value !== undefined)
            reflectionMergePartial<FooWithExtraFields>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FooWithExtraFields): FooWithExtraFields {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 int32_value */ 1:
                    message.int32Value = reader.int32();
                    break;
                case /* unittest_drop_unknown_fields.FooWithExtraFields.NestedEnum enum_value */ 2:
                    message.enumValue = reader.int32();
                    break;
                case /* int32 extra_int32_value */ 3:
                    message.extraInt32Value = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: FooWithExtraFields, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* int32 int32_value = 1; */
        if (message.int32Value !== 0)
            writer.tag(1, WireType.Varint).int32(message.int32Value);
        /* unittest_drop_unknown_fields.FooWithExtraFields.NestedEnum enum_value = 2; */
        if (message.enumValue !== 0)
            writer.tag(2, WireType.Varint).int32(message.enumValue);
        /* int32 extra_int32_value = 3; */
        if (message.extraInt32Value !== 0)
            writer.tag(3, WireType.Varint).int32(message.extraInt32Value);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message unittest_drop_unknown_fields.FooWithExtraFields
 */
export const FooWithExtraFields = new FooWithExtraFields$Type();
