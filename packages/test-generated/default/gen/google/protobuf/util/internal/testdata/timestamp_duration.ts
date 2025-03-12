// @generated by protobuf-ts 2.9.5
// @generated from protobuf file "google/protobuf/util/internal/testdata/timestamp_duration.proto" (package "proto_util_converter.testing", syntax proto3)
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
import { Duration } from "../../../duration";
import { Timestamp } from "../../../timestamp";
/**
 * @generated from protobuf message proto_util_converter.testing.TimestampDurationTestCases
 */
export interface TimestampDurationTestCases {
    /**
     * Timestamp tests
     *
     * @generated from protobuf field: proto_util_converter.testing.TimeStampType epoch = 1;
     */
    epoch?: TimeStampType;
    /**
     * @generated from protobuf field: proto_util_converter.testing.TimeStampType epoch2 = 2;
     */
    epoch2?: TimeStampType;
    /**
     * @generated from protobuf field: proto_util_converter.testing.TimeStampType mintime = 3;
     */
    mintime?: TimeStampType;
    /**
     * @generated from protobuf field: proto_util_converter.testing.TimeStampType maxtime = 4;
     */
    maxtime?: TimeStampType;
    /**
     * @generated from protobuf field: proto_util_converter.testing.TimeStampType timeval1 = 5;
     */
    timeval1?: TimeStampType;
    /**
     * @generated from protobuf field: proto_util_converter.testing.TimeStampType timeval2 = 6;
     */
    timeval2?: TimeStampType;
    /**
     * @generated from protobuf field: proto_util_converter.testing.TimeStampType timeval3 = 7;
     */
    timeval3?: TimeStampType;
    /**
     * @generated from protobuf field: proto_util_converter.testing.TimeStampType timeval4 = 8;
     */
    timeval4?: TimeStampType;
    /**
     * @generated from protobuf field: proto_util_converter.testing.TimeStampType timeval5 = 9;
     */
    timeval5?: TimeStampType;
    /**
     * @generated from protobuf field: proto_util_converter.testing.TimeStampType timeval6 = 10;
     */
    timeval6?: TimeStampType;
    /**
     * @generated from protobuf field: proto_util_converter.testing.TimeStampType timeval7 = 11;
     */
    timeval7?: TimeStampType;
    /**
     * @generated from protobuf field: google.protobuf.Timestamp timeval8 = 12;
     */
    timeval8?: Timestamp;
    /**
     * Duration tests
     *
     * @generated from protobuf field: proto_util_converter.testing.DurationType zero_duration = 101;
     */
    zeroDuration?: DurationType;
    /**
     * @generated from protobuf field: proto_util_converter.testing.DurationType min_duration = 102;
     */
    minDuration?: DurationType;
    /**
     * @generated from protobuf field: proto_util_converter.testing.DurationType max_duration = 103;
     */
    maxDuration?: DurationType;
    /**
     * @generated from protobuf field: proto_util_converter.testing.DurationType duration1 = 104;
     */
    duration1?: DurationType;
    /**
     * @generated from protobuf field: proto_util_converter.testing.DurationType duration2 = 105;
     */
    duration2?: DurationType;
    /**
     * @generated from protobuf field: proto_util_converter.testing.DurationType duration3 = 106;
     */
    duration3?: DurationType;
    /**
     * @generated from protobuf field: proto_util_converter.testing.DurationType duration4 = 107;
     */
    duration4?: DurationType;
    /**
     * @generated from protobuf field: google.protobuf.Duration duration5 = 108;
     */
    duration5?: Duration;
}
/**
 * @generated from protobuf message proto_util_converter.testing.TimeStampType
 */
export interface TimeStampType {
    /**
     * @generated from protobuf field: google.protobuf.Timestamp timestamp = 1;
     */
    timestamp?: Timestamp;
}
/**
 * @generated from protobuf message proto_util_converter.testing.DurationType
 */
export interface DurationType {
    /**
     * @generated from protobuf field: google.protobuf.Duration duration = 1;
     */
    duration?: Duration;
}
/**
 * @generated from protobuf message proto_util_converter.testing.TimestampDuration
 */
export interface TimestampDuration {
    /**
     * @generated from protobuf field: google.protobuf.Timestamp ts = 1;
     */
    ts?: Timestamp;
    /**
     * @generated from protobuf field: google.protobuf.Duration dur = 2;
     */
    dur?: Duration;
    /**
     * @generated from protobuf field: repeated google.protobuf.Timestamp rep_ts = 3;
     */
    repTs: Timestamp[];
}
// @generated message type with reflection information, may provide speed optimized methods
class TimestampDurationTestCases$Type extends MessageType<TimestampDurationTestCases> {
    constructor() {
        super("proto_util_converter.testing.TimestampDurationTestCases", [
            { no: 1, name: "epoch", kind: "message", T: () => TimeStampType },
            { no: 2, name: "epoch2", kind: "message", T: () => TimeStampType },
            { no: 3, name: "mintime", kind: "message", T: () => TimeStampType },
            { no: 4, name: "maxtime", kind: "message", T: () => TimeStampType },
            { no: 5, name: "timeval1", kind: "message", T: () => TimeStampType },
            { no: 6, name: "timeval2", kind: "message", T: () => TimeStampType },
            { no: 7, name: "timeval3", kind: "message", T: () => TimeStampType },
            { no: 8, name: "timeval4", kind: "message", T: () => TimeStampType },
            { no: 9, name: "timeval5", kind: "message", T: () => TimeStampType },
            { no: 10, name: "timeval6", kind: "message", T: () => TimeStampType },
            { no: 11, name: "timeval7", kind: "message", T: () => TimeStampType },
            { no: 12, name: "timeval8", kind: "message", T: () => Timestamp },
            { no: 101, name: "zero_duration", kind: "message", T: () => DurationType },
            { no: 102, name: "min_duration", kind: "message", T: () => DurationType },
            { no: 103, name: "max_duration", kind: "message", T: () => DurationType },
            { no: 104, name: "duration1", kind: "message", T: () => DurationType },
            { no: 105, name: "duration2", kind: "message", T: () => DurationType },
            { no: 106, name: "duration3", kind: "message", T: () => DurationType },
            { no: 107, name: "duration4", kind: "message", T: () => DurationType },
            { no: 108, name: "duration5", kind: "message", T: () => Duration }
        ]);
    }
    create(value?: PartialMessage<TimestampDurationTestCases>): TimestampDurationTestCases {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<TimestampDurationTestCases>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TimestampDurationTestCases): TimestampDurationTestCases {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* proto_util_converter.testing.TimeStampType epoch */ 1:
                    message.epoch = TimeStampType.internalBinaryRead(reader, reader.uint32(), options, message.epoch);
                    break;
                case /* proto_util_converter.testing.TimeStampType epoch2 */ 2:
                    message.epoch2 = TimeStampType.internalBinaryRead(reader, reader.uint32(), options, message.epoch2);
                    break;
                case /* proto_util_converter.testing.TimeStampType mintime */ 3:
                    message.mintime = TimeStampType.internalBinaryRead(reader, reader.uint32(), options, message.mintime);
                    break;
                case /* proto_util_converter.testing.TimeStampType maxtime */ 4:
                    message.maxtime = TimeStampType.internalBinaryRead(reader, reader.uint32(), options, message.maxtime);
                    break;
                case /* proto_util_converter.testing.TimeStampType timeval1 */ 5:
                    message.timeval1 = TimeStampType.internalBinaryRead(reader, reader.uint32(), options, message.timeval1);
                    break;
                case /* proto_util_converter.testing.TimeStampType timeval2 */ 6:
                    message.timeval2 = TimeStampType.internalBinaryRead(reader, reader.uint32(), options, message.timeval2);
                    break;
                case /* proto_util_converter.testing.TimeStampType timeval3 */ 7:
                    message.timeval3 = TimeStampType.internalBinaryRead(reader, reader.uint32(), options, message.timeval3);
                    break;
                case /* proto_util_converter.testing.TimeStampType timeval4 */ 8:
                    message.timeval4 = TimeStampType.internalBinaryRead(reader, reader.uint32(), options, message.timeval4);
                    break;
                case /* proto_util_converter.testing.TimeStampType timeval5 */ 9:
                    message.timeval5 = TimeStampType.internalBinaryRead(reader, reader.uint32(), options, message.timeval5);
                    break;
                case /* proto_util_converter.testing.TimeStampType timeval6 */ 10:
                    message.timeval6 = TimeStampType.internalBinaryRead(reader, reader.uint32(), options, message.timeval6);
                    break;
                case /* proto_util_converter.testing.TimeStampType timeval7 */ 11:
                    message.timeval7 = TimeStampType.internalBinaryRead(reader, reader.uint32(), options, message.timeval7);
                    break;
                case /* google.protobuf.Timestamp timeval8 */ 12:
                    message.timeval8 = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.timeval8);
                    break;
                case /* proto_util_converter.testing.DurationType zero_duration */ 101:
                    message.zeroDuration = DurationType.internalBinaryRead(reader, reader.uint32(), options, message.zeroDuration);
                    break;
                case /* proto_util_converter.testing.DurationType min_duration */ 102:
                    message.minDuration = DurationType.internalBinaryRead(reader, reader.uint32(), options, message.minDuration);
                    break;
                case /* proto_util_converter.testing.DurationType max_duration */ 103:
                    message.maxDuration = DurationType.internalBinaryRead(reader, reader.uint32(), options, message.maxDuration);
                    break;
                case /* proto_util_converter.testing.DurationType duration1 */ 104:
                    message.duration1 = DurationType.internalBinaryRead(reader, reader.uint32(), options, message.duration1);
                    break;
                case /* proto_util_converter.testing.DurationType duration2 */ 105:
                    message.duration2 = DurationType.internalBinaryRead(reader, reader.uint32(), options, message.duration2);
                    break;
                case /* proto_util_converter.testing.DurationType duration3 */ 106:
                    message.duration3 = DurationType.internalBinaryRead(reader, reader.uint32(), options, message.duration3);
                    break;
                case /* proto_util_converter.testing.DurationType duration4 */ 107:
                    message.duration4 = DurationType.internalBinaryRead(reader, reader.uint32(), options, message.duration4);
                    break;
                case /* google.protobuf.Duration duration5 */ 108:
                    message.duration5 = Duration.internalBinaryRead(reader, reader.uint32(), options, message.duration5);
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
    internalBinaryWrite(message: TimestampDurationTestCases, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* proto_util_converter.testing.TimeStampType epoch = 1; */
        if (message.epoch)
            TimeStampType.internalBinaryWrite(message.epoch, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* proto_util_converter.testing.TimeStampType epoch2 = 2; */
        if (message.epoch2)
            TimeStampType.internalBinaryWrite(message.epoch2, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* proto_util_converter.testing.TimeStampType mintime = 3; */
        if (message.mintime)
            TimeStampType.internalBinaryWrite(message.mintime, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        /* proto_util_converter.testing.TimeStampType maxtime = 4; */
        if (message.maxtime)
            TimeStampType.internalBinaryWrite(message.maxtime, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        /* proto_util_converter.testing.TimeStampType timeval1 = 5; */
        if (message.timeval1)
            TimeStampType.internalBinaryWrite(message.timeval1, writer.tag(5, WireType.LengthDelimited).fork(), options).join();
        /* proto_util_converter.testing.TimeStampType timeval2 = 6; */
        if (message.timeval2)
            TimeStampType.internalBinaryWrite(message.timeval2, writer.tag(6, WireType.LengthDelimited).fork(), options).join();
        /* proto_util_converter.testing.TimeStampType timeval3 = 7; */
        if (message.timeval3)
            TimeStampType.internalBinaryWrite(message.timeval3, writer.tag(7, WireType.LengthDelimited).fork(), options).join();
        /* proto_util_converter.testing.TimeStampType timeval4 = 8; */
        if (message.timeval4)
            TimeStampType.internalBinaryWrite(message.timeval4, writer.tag(8, WireType.LengthDelimited).fork(), options).join();
        /* proto_util_converter.testing.TimeStampType timeval5 = 9; */
        if (message.timeval5)
            TimeStampType.internalBinaryWrite(message.timeval5, writer.tag(9, WireType.LengthDelimited).fork(), options).join();
        /* proto_util_converter.testing.TimeStampType timeval6 = 10; */
        if (message.timeval6)
            TimeStampType.internalBinaryWrite(message.timeval6, writer.tag(10, WireType.LengthDelimited).fork(), options).join();
        /* proto_util_converter.testing.TimeStampType timeval7 = 11; */
        if (message.timeval7)
            TimeStampType.internalBinaryWrite(message.timeval7, writer.tag(11, WireType.LengthDelimited).fork(), options).join();
        /* google.protobuf.Timestamp timeval8 = 12; */
        if (message.timeval8)
            Timestamp.internalBinaryWrite(message.timeval8, writer.tag(12, WireType.LengthDelimited).fork(), options).join();
        /* proto_util_converter.testing.DurationType zero_duration = 101; */
        if (message.zeroDuration)
            DurationType.internalBinaryWrite(message.zeroDuration, writer.tag(101, WireType.LengthDelimited).fork(), options).join();
        /* proto_util_converter.testing.DurationType min_duration = 102; */
        if (message.minDuration)
            DurationType.internalBinaryWrite(message.minDuration, writer.tag(102, WireType.LengthDelimited).fork(), options).join();
        /* proto_util_converter.testing.DurationType max_duration = 103; */
        if (message.maxDuration)
            DurationType.internalBinaryWrite(message.maxDuration, writer.tag(103, WireType.LengthDelimited).fork(), options).join();
        /* proto_util_converter.testing.DurationType duration1 = 104; */
        if (message.duration1)
            DurationType.internalBinaryWrite(message.duration1, writer.tag(104, WireType.LengthDelimited).fork(), options).join();
        /* proto_util_converter.testing.DurationType duration2 = 105; */
        if (message.duration2)
            DurationType.internalBinaryWrite(message.duration2, writer.tag(105, WireType.LengthDelimited).fork(), options).join();
        /* proto_util_converter.testing.DurationType duration3 = 106; */
        if (message.duration3)
            DurationType.internalBinaryWrite(message.duration3, writer.tag(106, WireType.LengthDelimited).fork(), options).join();
        /* proto_util_converter.testing.DurationType duration4 = 107; */
        if (message.duration4)
            DurationType.internalBinaryWrite(message.duration4, writer.tag(107, WireType.LengthDelimited).fork(), options).join();
        /* google.protobuf.Duration duration5 = 108; */
        if (message.duration5)
            Duration.internalBinaryWrite(message.duration5, writer.tag(108, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message proto_util_converter.testing.TimestampDurationTestCases
 */
export const TimestampDurationTestCases = new TimestampDurationTestCases$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TimeStampType$Type extends MessageType<TimeStampType> {
    constructor() {
        super("proto_util_converter.testing.TimeStampType", [
            { no: 1, name: "timestamp", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<TimeStampType>): TimeStampType {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<TimeStampType>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TimeStampType): TimeStampType {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* google.protobuf.Timestamp timestamp */ 1:
                    message.timestamp = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.timestamp);
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
    internalBinaryWrite(message: TimeStampType, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* google.protobuf.Timestamp timestamp = 1; */
        if (message.timestamp)
            Timestamp.internalBinaryWrite(message.timestamp, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message proto_util_converter.testing.TimeStampType
 */
export const TimeStampType = new TimeStampType$Type();
// @generated message type with reflection information, may provide speed optimized methods
class DurationType$Type extends MessageType<DurationType> {
    constructor() {
        super("proto_util_converter.testing.DurationType", [
            { no: 1, name: "duration", kind: "message", T: () => Duration }
        ]);
    }
    create(value?: PartialMessage<DurationType>): DurationType {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<DurationType>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DurationType): DurationType {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* google.protobuf.Duration duration */ 1:
                    message.duration = Duration.internalBinaryRead(reader, reader.uint32(), options, message.duration);
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
    internalBinaryWrite(message: DurationType, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* google.protobuf.Duration duration = 1; */
        if (message.duration)
            Duration.internalBinaryWrite(message.duration, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message proto_util_converter.testing.DurationType
 */
export const DurationType = new DurationType$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TimestampDuration$Type extends MessageType<TimestampDuration> {
    constructor() {
        super("proto_util_converter.testing.TimestampDuration", [
            { no: 1, name: "ts", kind: "message", T: () => Timestamp },
            { no: 2, name: "dur", kind: "message", T: () => Duration },
            { no: 3, name: "rep_ts", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<TimestampDuration>): TimestampDuration {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.repTs = [];
        if (value !== undefined)
            reflectionMergePartial<TimestampDuration>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TimestampDuration): TimestampDuration {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* google.protobuf.Timestamp ts */ 1:
                    message.ts = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.ts);
                    break;
                case /* google.protobuf.Duration dur */ 2:
                    message.dur = Duration.internalBinaryRead(reader, reader.uint32(), options, message.dur);
                    break;
                case /* repeated google.protobuf.Timestamp rep_ts */ 3:
                    message.repTs.push(Timestamp.internalBinaryRead(reader, reader.uint32(), options));
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
    internalBinaryWrite(message: TimestampDuration, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* google.protobuf.Timestamp ts = 1; */
        if (message.ts)
            Timestamp.internalBinaryWrite(message.ts, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* google.protobuf.Duration dur = 2; */
        if (message.dur)
            Duration.internalBinaryWrite(message.dur, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* repeated google.protobuf.Timestamp rep_ts = 3; */
        for (let i = 0; i < message.repTs.length; i++)
            Timestamp.internalBinaryWrite(message.repTs[i], writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message proto_util_converter.testing.TimestampDuration
 */
export const TimestampDuration = new TimestampDuration$Type();
/**
 * @generated ServiceType for protobuf service proto_util_converter.testing.TimestampDurationTestService
 */
export const TimestampDurationTestService = new ServiceType("proto_util_converter.testing.TimestampDurationTestService", [
    { name: "Call", options: {}, I: TimestampDurationTestCases, O: TimestampDurationTestCases }
]);
