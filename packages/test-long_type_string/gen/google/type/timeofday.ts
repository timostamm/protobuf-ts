// @generated by protobuf-ts 2.9.6 with parameter long_type_string
// @generated from protobuf file "google/type/timeofday.proto" (package "google.type", syntax proto3)
// tslint:disable
//
// Copyright 2019 Google LLC.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
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
 * Represents a time of day. The date and time zone are either not significant
 * or are specified elsewhere. An API may choose to allow leap seconds. Related
 * types are [google.type.Date][google.type.Date] and `google.protobuf.Timestamp`.
 *
 * @generated from protobuf message google.type.TimeOfDay
 */
export interface TimeOfDay {
    /**
     * Hours of day in 24 hour format. Should be from 0 to 23. An API may choose
     * to allow the value "24:00:00" for scenarios like business closing time.
     *
     * @generated from protobuf field: int32 hours = 1;
     */
    hours: number;
    /**
     * Minutes of hour of day. Must be from 0 to 59.
     *
     * @generated from protobuf field: int32 minutes = 2;
     */
    minutes: number;
    /**
     * Seconds of minutes of the time. Must normally be from 0 to 59. An API may
     * allow the value 60 if it allows leap-seconds.
     *
     * @generated from protobuf field: int32 seconds = 3;
     */
    seconds: number;
    /**
     * Fractions of seconds in nanoseconds. Must be from 0 to 999,999,999.
     *
     * @generated from protobuf field: int32 nanos = 4;
     */
    nanos: number;
}
// @generated message type with reflection information, may provide speed optimized methods
class TimeOfDay$Type extends MessageType<TimeOfDay> {
    constructor() {
        super("google.type.TimeOfDay", [
            { no: 1, name: "hours", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "minutes", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 3, name: "seconds", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 4, name: "nanos", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
    /**
     * Creates a TimeOfDay message from a javascript Date object.
     */
    fromJsDate(date: globalThis.Date): TimeOfDay {
        return {
            hours: date.getHours(), minutes: date.getMinutes(), seconds: date.getSeconds(), nanos: date.getMilliseconds() * 1000,
        };
    }
    create(value?: PartialMessage<TimeOfDay>): TimeOfDay {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.hours = 0;
        message.minutes = 0;
        message.seconds = 0;
        message.nanos = 0;
        if (value !== undefined)
            reflectionMergePartial<TimeOfDay>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TimeOfDay): TimeOfDay {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 hours */ 1:
                    message.hours = reader.int32();
                    break;
                case /* int32 minutes */ 2:
                    message.minutes = reader.int32();
                    break;
                case /* int32 seconds */ 3:
                    message.seconds = reader.int32();
                    break;
                case /* int32 nanos */ 4:
                    message.nanos = reader.int32();
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
    internalBinaryWrite(message: TimeOfDay, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* int32 hours = 1; */
        if (message.hours !== 0)
            writer.tag(1, WireType.Varint).int32(message.hours);
        /* int32 minutes = 2; */
        if (message.minutes !== 0)
            writer.tag(2, WireType.Varint).int32(message.minutes);
        /* int32 seconds = 3; */
        if (message.seconds !== 0)
            writer.tag(3, WireType.Varint).int32(message.seconds);
        /* int32 nanos = 4; */
        if (message.nanos !== 0)
            writer.tag(4, WireType.Varint).int32(message.nanos);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message google.type.TimeOfDay
 */
export const TimeOfDay = new TimeOfDay$Type();
