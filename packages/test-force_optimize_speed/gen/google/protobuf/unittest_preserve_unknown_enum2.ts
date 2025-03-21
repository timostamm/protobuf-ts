// @generated by protobuf-ts 2.9.6 with parameter force_optimize_speed
// @generated from protobuf file "google/protobuf/unittest_preserve_unknown_enum2.proto" (package "proto2_preserve_unknown_enum_unittest", syntax proto2)
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
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message proto2_preserve_unknown_enum_unittest.MyMessage
 */
export interface MyMessage {
    /**
     * @generated from protobuf field: optional proto2_preserve_unknown_enum_unittest.MyEnum e = 1;
     */
    e?: MyEnum;
    /**
     * @generated from protobuf field: repeated proto2_preserve_unknown_enum_unittest.MyEnum repeated_e = 2;
     */
    repeatedE: MyEnum[];
    /**
     * @generated from protobuf field: repeated proto2_preserve_unknown_enum_unittest.MyEnum repeated_packed_e = 3 [packed = true];
     */
    repeatedPackedE: MyEnum[];
    /**
     * @generated from protobuf field: repeated proto2_preserve_unknown_enum_unittest.MyEnum repeated_packed_unexpected_e = 4;
     */
    repeatedPackedUnexpectedE: MyEnum[]; // not packed
    /**
     * @generated from protobuf oneof: o
     */
    o: {
        oneofKind: "oneofE1";
        /**
         * @generated from protobuf field: proto2_preserve_unknown_enum_unittest.MyEnum oneof_e_1 = 5;
         */
        oneofE1: MyEnum;
    } | {
        oneofKind: "oneofE2";
        /**
         * @generated from protobuf field: proto2_preserve_unknown_enum_unittest.MyEnum oneof_e_2 = 6;
         */
        oneofE2: MyEnum;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf enum proto2_preserve_unknown_enum_unittest.MyEnum
 */
export enum MyEnum {
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
// @generated message type with reflection information, may provide speed optimized methods
class MyMessage$Type extends MessageType<MyMessage> {
    constructor() {
        super("proto2_preserve_unknown_enum_unittest.MyMessage", [
            { no: 1, name: "e", kind: "enum", opt: true, T: () => ["proto2_preserve_unknown_enum_unittest.MyEnum", MyEnum] },
            { no: 2, name: "repeated_e", kind: "enum", repeat: 2 /*RepeatType.UNPACKED*/, T: () => ["proto2_preserve_unknown_enum_unittest.MyEnum", MyEnum] },
            { no: 3, name: "repeated_packed_e", kind: "enum", repeat: 1 /*RepeatType.PACKED*/, T: () => ["proto2_preserve_unknown_enum_unittest.MyEnum", MyEnum] },
            { no: 4, name: "repeated_packed_unexpected_e", kind: "enum", repeat: 2 /*RepeatType.UNPACKED*/, T: () => ["proto2_preserve_unknown_enum_unittest.MyEnum", MyEnum] },
            { no: 5, name: "oneof_e_1", kind: "enum", oneof: "o", T: () => ["proto2_preserve_unknown_enum_unittest.MyEnum", MyEnum] },
            { no: 6, name: "oneof_e_2", kind: "enum", oneof: "o", T: () => ["proto2_preserve_unknown_enum_unittest.MyEnum", MyEnum] }
        ]);
    }
    create(value?: PartialMessage<MyMessage>): MyMessage {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.repeatedE = [];
        message.repeatedPackedE = [];
        message.repeatedPackedUnexpectedE = [];
        message.o = { oneofKind: undefined };
        if (value !== undefined)
            reflectionMergePartial<MyMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MyMessage): MyMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* optional proto2_preserve_unknown_enum_unittest.MyEnum e */ 1:
                    message.e = reader.int32();
                    break;
                case /* repeated proto2_preserve_unknown_enum_unittest.MyEnum repeated_e */ 2:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.repeatedE.push(reader.int32());
                    else
                        message.repeatedE.push(reader.int32());
                    break;
                case /* repeated proto2_preserve_unknown_enum_unittest.MyEnum repeated_packed_e = 3 [packed = true];*/ 3:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.repeatedPackedE.push(reader.int32());
                    else
                        message.repeatedPackedE.push(reader.int32());
                    break;
                case /* repeated proto2_preserve_unknown_enum_unittest.MyEnum repeated_packed_unexpected_e */ 4:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.repeatedPackedUnexpectedE.push(reader.int32());
                    else
                        message.repeatedPackedUnexpectedE.push(reader.int32());
                    break;
                case /* proto2_preserve_unknown_enum_unittest.MyEnum oneof_e_1 */ 5:
                    message.o = {
                        oneofKind: "oneofE1",
                        oneofE1: reader.int32()
                    };
                    break;
                case /* proto2_preserve_unknown_enum_unittest.MyEnum oneof_e_2 */ 6:
                    message.o = {
                        oneofKind: "oneofE2",
                        oneofE2: reader.int32()
                    };
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
    internalBinaryWrite(message: MyMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* optional proto2_preserve_unknown_enum_unittest.MyEnum e = 1; */
        if (message.e !== undefined)
            writer.tag(1, WireType.Varint).int32(message.e);
        /* repeated proto2_preserve_unknown_enum_unittest.MyEnum repeated_e = 2; */
        for (let i = 0; i < message.repeatedE.length; i++)
            writer.tag(2, WireType.Varint).int32(message.repeatedE[i]);
        /* repeated proto2_preserve_unknown_enum_unittest.MyEnum repeated_packed_e = 3 [packed = true]; */
        if (message.repeatedPackedE.length) {
            writer.tag(3, WireType.LengthDelimited).fork();
            for (let i = 0; i < message.repeatedPackedE.length; i++)
                writer.int32(message.repeatedPackedE[i]);
            writer.join();
        }
        /* repeated proto2_preserve_unknown_enum_unittest.MyEnum repeated_packed_unexpected_e = 4; */
        for (let i = 0; i < message.repeatedPackedUnexpectedE.length; i++)
            writer.tag(4, WireType.Varint).int32(message.repeatedPackedUnexpectedE[i]);
        /* proto2_preserve_unknown_enum_unittest.MyEnum oneof_e_1 = 5; */
        if (message.o.oneofKind === "oneofE1")
            writer.tag(5, WireType.Varint).int32(message.o.oneofE1);
        /* proto2_preserve_unknown_enum_unittest.MyEnum oneof_e_2 = 6; */
        if (message.o.oneofKind === "oneofE2")
            writer.tag(6, WireType.Varint).int32(message.o.oneofE2);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message proto2_preserve_unknown_enum_unittest.MyMessage
 */
export const MyMessage = new MyMessage$Type();
