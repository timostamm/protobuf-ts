// @generated by protobuf-ts 2.11.1 with parameter force_optimize_speed
// @generated from protobuf file "google/protobuf/unittest_mset.proto" (package "protobuf_unittest", syntax proto2)
// tslint:disable
//
// Protocol Buffers - Google's data interchange format
// Copyright 2008 Google Inc.  All rights reserved.
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd
//
//
// Author: kenton@google.com (Kenton Varda)
//  Based on original Protocol Buffers design by
//  Sanjay Ghemawat, Jeff Dean, and others.
//
// This file is similar to unittest_mset_wire_format.proto, but does not
// have a TestMessageSet, so it can be downgraded to proto1.
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
import { TestMessageSet } from "./unittest_mset_wire_format";
/**
 * @generated from protobuf message protobuf_unittest.TestMessageSetContainer
 */
export interface TestMessageSetContainer {
    /**
     * @generated from protobuf field: optional proto2_wireformat_unittest.TestMessageSet message_set = 1
     */
    messageSet?: TestMessageSet;
}
/**
 * @generated from protobuf message protobuf_unittest.NestedTestMessageSetContainer
 */
export interface NestedTestMessageSetContainer {
    /**
     * @generated from protobuf field: optional protobuf_unittest.TestMessageSetContainer container = 1
     */
    container?: TestMessageSetContainer;
    /**
     * @generated from protobuf field: optional protobuf_unittest.NestedTestMessageSetContainer child = 2
     */
    child?: NestedTestMessageSetContainer;
    /**
     * @generated from protobuf field: optional protobuf_unittest.NestedTestMessageSetContainer lazy_child = 3
     */
    lazyChild?: NestedTestMessageSetContainer;
}
/**
 * @generated from protobuf message protobuf_unittest.NestedTestInt
 */
export interface NestedTestInt {
    /**
     * @generated from protobuf field: optional fixed32 a = 1
     */
    a?: number;
    /**
     * @generated from protobuf field: optional int32 b = 3
     */
    b?: number;
    /**
     * @generated from protobuf field: optional protobuf_unittest.NestedTestInt child = 2
     */
    child?: NestedTestInt;
}
/**
 * @generated from protobuf message protobuf_unittest.TestMessageSetExtension1
 */
export interface TestMessageSetExtension1 {
    /**
     * @generated from protobuf field: optional int32 i = 15
     */
    i?: number;
    /**
     * @generated from protobuf field: optional proto2_wireformat_unittest.TestMessageSet recursive = 16
     */
    recursive?: TestMessageSet;
    /**
     * @generated from protobuf field: optional string test_aliasing = 17
     */
    testAliasing?: string;
}
/**
 * @generated from protobuf message protobuf_unittest.TestMessageSetExtension2
 */
export interface TestMessageSetExtension2 {
    /**
     * @generated from protobuf field: optional string str = 25
     */
    str?: string;
}
/**
 * @generated from protobuf message protobuf_unittest.TestMessageSetExtension3
 */
export interface TestMessageSetExtension3 {
    /**
     * @generated from protobuf field: optional protobuf_unittest.NestedTestInt msg = 35
     */
    msg?: NestedTestInt;
    /**
     * @generated from protobuf field: required int32 required_int = 36
     */
    requiredInt: number;
}
// This message was used to generate
// //net/proto2/python/internal/testdata/message_set_message, but is commented
// out since it must not actually exist in code, to simulate an "unknown"
// extension.
// message TestMessageSetUnknownExtension {
//   extend TestMessageSet {
//     optional TestMessageSetUnknownExtension message_set_extension = 56141421;
//   }
//   optional int64 a = 1;
// }

/**
 * MessageSet wire format is equivalent to this.
 *
 * @generated from protobuf message protobuf_unittest.RawMessageSet
 */
export interface RawMessageSet {
}
/**
 * @generated from protobuf message protobuf_unittest.RawMessageSet.Item
 */
export interface RawMessageSet_Item {
    /**
     * @generated from protobuf field: required int32 type_id = 2
     */
    typeId: number;
    /**
     * @generated from protobuf field: required bytes message = 3
     */
    message: Uint8Array;
}
// @generated message type with reflection information, may provide speed optimized methods
class TestMessageSetContainer$Type extends MessageType<TestMessageSetContainer> {
    constructor() {
        super("protobuf_unittest.TestMessageSetContainer", [
            { no: 1, name: "message_set", kind: "message", T: () => TestMessageSet }
        ]);
    }
    create(value?: PartialMessage<TestMessageSetContainer>): TestMessageSetContainer {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<TestMessageSetContainer>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TestMessageSetContainer): TestMessageSetContainer {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* optional proto2_wireformat_unittest.TestMessageSet message_set */ 1:
                    message.messageSet = TestMessageSet.internalBinaryRead(reader, reader.uint32(), options, message.messageSet);
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
    internalBinaryWrite(message: TestMessageSetContainer, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* optional proto2_wireformat_unittest.TestMessageSet message_set = 1; */
        if (message.messageSet)
            TestMessageSet.internalBinaryWrite(message.messageSet, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.TestMessageSetContainer
 */
export const TestMessageSetContainer = new TestMessageSetContainer$Type();
// @generated message type with reflection information, may provide speed optimized methods
class NestedTestMessageSetContainer$Type extends MessageType<NestedTestMessageSetContainer> {
    constructor() {
        super("protobuf_unittest.NestedTestMessageSetContainer", [
            { no: 1, name: "container", kind: "message", T: () => TestMessageSetContainer },
            { no: 2, name: "child", kind: "message", T: () => NestedTestMessageSetContainer },
            { no: 3, name: "lazy_child", kind: "message", T: () => NestedTestMessageSetContainer }
        ]);
    }
    create(value?: PartialMessage<NestedTestMessageSetContainer>): NestedTestMessageSetContainer {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<NestedTestMessageSetContainer>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: NestedTestMessageSetContainer): NestedTestMessageSetContainer {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* optional protobuf_unittest.TestMessageSetContainer container */ 1:
                    message.container = TestMessageSetContainer.internalBinaryRead(reader, reader.uint32(), options, message.container);
                    break;
                case /* optional protobuf_unittest.NestedTestMessageSetContainer child */ 2:
                    message.child = NestedTestMessageSetContainer.internalBinaryRead(reader, reader.uint32(), options, message.child);
                    break;
                case /* optional protobuf_unittest.NestedTestMessageSetContainer lazy_child */ 3:
                    message.lazyChild = NestedTestMessageSetContainer.internalBinaryRead(reader, reader.uint32(), options, message.lazyChild);
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
    internalBinaryWrite(message: NestedTestMessageSetContainer, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* optional protobuf_unittest.TestMessageSetContainer container = 1; */
        if (message.container)
            TestMessageSetContainer.internalBinaryWrite(message.container, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* optional protobuf_unittest.NestedTestMessageSetContainer child = 2; */
        if (message.child)
            NestedTestMessageSetContainer.internalBinaryWrite(message.child, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* optional protobuf_unittest.NestedTestMessageSetContainer lazy_child = 3; */
        if (message.lazyChild)
            NestedTestMessageSetContainer.internalBinaryWrite(message.lazyChild, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.NestedTestMessageSetContainer
 */
export const NestedTestMessageSetContainer = new NestedTestMessageSetContainer$Type();
// @generated message type with reflection information, may provide speed optimized methods
class NestedTestInt$Type extends MessageType<NestedTestInt> {
    constructor() {
        super("protobuf_unittest.NestedTestInt", [
            { no: 1, name: "a", kind: "scalar", opt: true, T: 7 /*ScalarType.FIXED32*/ },
            { no: 3, name: "b", kind: "scalar", opt: true, T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "child", kind: "message", T: () => NestedTestInt }
        ]);
    }
    create(value?: PartialMessage<NestedTestInt>): NestedTestInt {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<NestedTestInt>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: NestedTestInt): NestedTestInt {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* optional fixed32 a */ 1:
                    message.a = reader.fixed32();
                    break;
                case /* optional int32 b */ 3:
                    message.b = reader.int32();
                    break;
                case /* optional protobuf_unittest.NestedTestInt child */ 2:
                    message.child = NestedTestInt.internalBinaryRead(reader, reader.uint32(), options, message.child);
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
    internalBinaryWrite(message: NestedTestInt, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* optional fixed32 a = 1; */
        if (message.a !== undefined)
            writer.tag(1, WireType.Bit32).fixed32(message.a);
        /* optional protobuf_unittest.NestedTestInt child = 2; */
        if (message.child)
            NestedTestInt.internalBinaryWrite(message.child, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* optional int32 b = 3; */
        if (message.b !== undefined)
            writer.tag(3, WireType.Varint).int32(message.b);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.NestedTestInt
 */
export const NestedTestInt = new NestedTestInt$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TestMessageSetExtension1$Type extends MessageType<TestMessageSetExtension1> {
    constructor() {
        super("protobuf_unittest.TestMessageSetExtension1", [
            { no: 15, name: "i", kind: "scalar", opt: true, T: 5 /*ScalarType.INT32*/ },
            { no: 16, name: "recursive", kind: "message", T: () => TestMessageSet },
            { no: 17, name: "test_aliasing", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<TestMessageSetExtension1>): TestMessageSetExtension1 {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<TestMessageSetExtension1>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TestMessageSetExtension1): TestMessageSetExtension1 {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* optional int32 i */ 15:
                    message.i = reader.int32();
                    break;
                case /* optional proto2_wireformat_unittest.TestMessageSet recursive */ 16:
                    message.recursive = TestMessageSet.internalBinaryRead(reader, reader.uint32(), options, message.recursive);
                    break;
                case /* optional string test_aliasing */ 17:
                    message.testAliasing = reader.string();
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
    internalBinaryWrite(message: TestMessageSetExtension1, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* optional int32 i = 15; */
        if (message.i !== undefined)
            writer.tag(15, WireType.Varint).int32(message.i);
        /* optional proto2_wireformat_unittest.TestMessageSet recursive = 16; */
        if (message.recursive)
            TestMessageSet.internalBinaryWrite(message.recursive, writer.tag(16, WireType.LengthDelimited).fork(), options).join();
        /* optional string test_aliasing = 17; */
        if (message.testAliasing !== undefined)
            writer.tag(17, WireType.LengthDelimited).string(message.testAliasing);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.TestMessageSetExtension1
 */
export const TestMessageSetExtension1 = new TestMessageSetExtension1$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TestMessageSetExtension2$Type extends MessageType<TestMessageSetExtension2> {
    constructor() {
        super("protobuf_unittest.TestMessageSetExtension2", [
            { no: 25, name: "str", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<TestMessageSetExtension2>): TestMessageSetExtension2 {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<TestMessageSetExtension2>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TestMessageSetExtension2): TestMessageSetExtension2 {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* optional string str */ 25:
                    message.str = reader.string();
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
    internalBinaryWrite(message: TestMessageSetExtension2, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* optional string str = 25; */
        if (message.str !== undefined)
            writer.tag(25, WireType.LengthDelimited).string(message.str);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.TestMessageSetExtension2
 */
export const TestMessageSetExtension2 = new TestMessageSetExtension2$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TestMessageSetExtension3$Type extends MessageType<TestMessageSetExtension3> {
    constructor() {
        super("protobuf_unittest.TestMessageSetExtension3", [
            { no: 35, name: "msg", kind: "message", T: () => NestedTestInt },
            { no: 36, name: "required_int", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
    create(value?: PartialMessage<TestMessageSetExtension3>): TestMessageSetExtension3 {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.requiredInt = 0;
        if (value !== undefined)
            reflectionMergePartial<TestMessageSetExtension3>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TestMessageSetExtension3): TestMessageSetExtension3 {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* optional protobuf_unittest.NestedTestInt msg */ 35:
                    message.msg = NestedTestInt.internalBinaryRead(reader, reader.uint32(), options, message.msg);
                    break;
                case /* required int32 required_int */ 36:
                    message.requiredInt = reader.int32();
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
    internalBinaryWrite(message: TestMessageSetExtension3, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* optional protobuf_unittest.NestedTestInt msg = 35; */
        if (message.msg)
            NestedTestInt.internalBinaryWrite(message.msg, writer.tag(35, WireType.LengthDelimited).fork(), options).join();
        /* required int32 required_int = 36; */
        if (message.requiredInt !== 0)
            writer.tag(36, WireType.Varint).int32(message.requiredInt);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.TestMessageSetExtension3
 */
export const TestMessageSetExtension3 = new TestMessageSetExtension3$Type();
// @generated message type with reflection information, may provide speed optimized methods
class RawMessageSet$Type extends MessageType<RawMessageSet> {
    constructor() {
        super("protobuf_unittest.RawMessageSet", []);
    }
    create(value?: PartialMessage<RawMessageSet>): RawMessageSet {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<RawMessageSet>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RawMessageSet): RawMessageSet {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
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
    internalBinaryWrite(message: RawMessageSet, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.RawMessageSet
 */
export const RawMessageSet = new RawMessageSet$Type();
// @generated message type with reflection information, may provide speed optimized methods
class RawMessageSet_Item$Type extends MessageType<RawMessageSet_Item> {
    constructor() {
        super("protobuf_unittest.RawMessageSet.Item", [
            { no: 2, name: "type_id", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 3, name: "message", kind: "scalar", T: 12 /*ScalarType.BYTES*/ }
        ]);
    }
    create(value?: PartialMessage<RawMessageSet_Item>): RawMessageSet_Item {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.typeId = 0;
        message.message = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<RawMessageSet_Item>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RawMessageSet_Item): RawMessageSet_Item {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* required int32 type_id */ 2:
                    message.typeId = reader.int32();
                    break;
                case /* required bytes message */ 3:
                    message.message = reader.bytes();
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
    internalBinaryWrite(message: RawMessageSet_Item, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* required int32 type_id = 2; */
        if (message.typeId !== 0)
            writer.tag(2, WireType.Varint).int32(message.typeId);
        /* required bytes message = 3; */
        if (message.message.length)
            writer.tag(3, WireType.LengthDelimited).bytes(message.message);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.RawMessageSet.Item
 */
export const RawMessageSet_Item = new RawMessageSet_Item$Type();
