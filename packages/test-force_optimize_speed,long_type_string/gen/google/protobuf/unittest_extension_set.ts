// @generated by protobuf-ts 2.9.6 with parameter force_optimize_speed,long_type_string
// @generated from protobuf file "google/protobuf/unittest_extension_set.proto" (package "protobuf_unittest", syntax proto2)
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
// This file contains messages for testing extensions.
//
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * A message with message_set_wire_format.
 *
 * @generated from protobuf message protobuf_unittest.TestExtensionSet
 */
export interface TestExtensionSet {
}
/**
 * @generated from protobuf message protobuf_unittest.TestExtensionSetContainer
 */
export interface TestExtensionSetContainer {
    /**
     * @generated from protobuf field: optional protobuf_unittest.TestExtensionSet extension = 1;
     */
    extension?: TestExtensionSet;
}
// @generated message type with reflection information, may provide speed optimized methods
class TestExtensionSet$Type extends MessageType<TestExtensionSet> {
    constructor() {
        super("protobuf_unittest.TestExtensionSet", []);
    }
    create(value?: PartialMessage<TestExtensionSet>): TestExtensionSet {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<TestExtensionSet>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TestExtensionSet): TestExtensionSet {
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
    internalBinaryWrite(message: TestExtensionSet, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.TestExtensionSet
 */
export const TestExtensionSet = new TestExtensionSet$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TestExtensionSetContainer$Type extends MessageType<TestExtensionSetContainer> {
    constructor() {
        super("protobuf_unittest.TestExtensionSetContainer", [
            { no: 1, name: "extension", kind: "message", T: () => TestExtensionSet }
        ]);
    }
    create(value?: PartialMessage<TestExtensionSetContainer>): TestExtensionSetContainer {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<TestExtensionSetContainer>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TestExtensionSetContainer): TestExtensionSetContainer {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* optional protobuf_unittest.TestExtensionSet extension */ 1:
                    message.extension = TestExtensionSet.internalBinaryRead(reader, reader.uint32(), options, message.extension);
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
    internalBinaryWrite(message: TestExtensionSetContainer, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* optional protobuf_unittest.TestExtensionSet extension = 1; */
        if (message.extension)
            TestExtensionSet.internalBinaryWrite(message.extension, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.TestExtensionSetContainer
 */
export const TestExtensionSetContainer = new TestExtensionSetContainer$Type();
