// @generated by protobuf-ts 2.9.5 with parameter force_optimize_speed
// @generated from protobuf file "google/protobuf/unittest_no_generic_services.proto" (package "protobuf_unittest.no_generic_services_test", syntax proto2)
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
//
import { ServiceType } from "@protobuf-ts/runtime-rpc";
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
// *_generic_services are false by default.

/**
 * @generated from protobuf message protobuf_unittest.no_generic_services_test.TestMessage
 */
export interface TestMessage {
    /**
     * @generated from protobuf field: optional int32 a = 1;
     */
    a?: number;
}
/**
 * @generated from protobuf enum protobuf_unittest.no_generic_services_test.TestEnum
 */
export enum TestEnum {
    /**
     * @generated synthetic value - protobuf-ts requires all enums to have a 0 value
     */
    UNSPECIFIED$ = 0,
    /**
     * @generated from protobuf enum value: FOO = 1;
     */
    FOO = 1
}
// @generated message type with reflection information, may provide speed optimized methods
class TestMessage$Type extends MessageType<TestMessage> {
    constructor() {
        super("protobuf_unittest.no_generic_services_test.TestMessage", [
            { no: 1, name: "a", kind: "scalar", opt: true, T: 5 /*ScalarType.INT32*/ }
        ]);
    }
    create(value?: PartialMessage<TestMessage>): TestMessage {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<TestMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TestMessage): TestMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* optional int32 a */ 1:
                    message.a = reader.int32();
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
    internalBinaryWrite(message: TestMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* optional int32 a = 1; */
        if (message.a !== undefined)
            writer.tag(1, WireType.Varint).int32(message.a);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest.no_generic_services_test.TestMessage
 */
export const TestMessage = new TestMessage$Type();
/**
 * @generated ServiceType for protobuf service protobuf_unittest.no_generic_services_test.TestService
 */
export const TestService = new ServiceType("protobuf_unittest.no_generic_services_test.TestService", [
    { name: "Foo", options: {}, I: TestMessage, O: TestMessage }
]);
