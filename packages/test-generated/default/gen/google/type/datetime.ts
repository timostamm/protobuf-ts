// @generated by protobuf-ts 2.9.5
// @generated from protobuf file "google/type/datetime.proto" (package "google.type", syntax proto3)
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
import { PbLong } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { Duration } from "../protobuf/duration";
/**
 * Represents civil time in one of a few possible ways:
 *
 *  * When utc_offset is set and time_zone is unset: a civil time on a calendar
 *    day with a particular offset from UTC.
 *  * When time_zone is set and utc_offset is unset: a civil time on a calendar
 *    day in a particular time zone.
 *  * When neither time_zone nor utc_offset is set: a civil time on a calendar
 *    day in local time.
 *
 * The date is relative to the Proleptic Gregorian Calendar.
 *
 * If year is 0, the DateTime is considered not to have a specific year. month
 * and day must have valid, non-zero values.
 *
 * This type is more flexible than some applications may want. Make sure to
 * document and validate your application's limitations.
 *
 * @generated from protobuf message google.type.DateTime
 */
export interface DateTime {
    /**
     * Optional. Year of date. Must be from 1 to 9999, or 0 if specifying a
     * datetime without a year.
     *
     * @generated from protobuf field: int32 year = 1;
     */
    year: number;
    /**
     * Required. Month of year. Must be from 1 to 12.
     *
     * @generated from protobuf field: int32 month = 2;
     */
    month: number;
    /**
     * Required. Day of month. Must be from 1 to 31 and valid for the year and
     * month.
     *
     * @generated from protobuf field: int32 day = 3;
     */
    day: number;
    /**
     * Required. Hours of day in 24 hour format. Should be from 0 to 23. An API
     * may choose to allow the value "24:00:00" for scenarios like business
     * closing time.
     *
     * @generated from protobuf field: int32 hours = 4;
     */
    hours: number;
    /**
     * Required. Minutes of hour of day. Must be from 0 to 59.
     *
     * @generated from protobuf field: int32 minutes = 5;
     */
    minutes: number;
    /**
     * Required. Seconds of minutes of the time. Must normally be from 0 to 59. An
     * API may allow the value 60 if it allows leap-seconds.
     *
     * @generated from protobuf field: int32 seconds = 6;
     */
    seconds: number;
    /**
     * Required. Fractions of seconds in nanoseconds. Must be from 0 to
     * 999,999,999.
     *
     * @generated from protobuf field: int32 nanos = 7;
     */
    nanos: number;
    /**
     * @generated from protobuf oneof: time_offset
     */
    timeOffset: {
        oneofKind: "utcOffset";
        /**
         * UTC offset. Must be whole seconds, between -18 hours and +18 hours.
         * For example, a UTC offset of -4:00 would be represented as
         * { seconds: -14400 }.
         *
         * @generated from protobuf field: google.protobuf.Duration utc_offset = 8;
         */
        utcOffset: Duration;
    } | {
        oneofKind: "timeZone";
        /**
         * Time zone.
         *
         * @generated from protobuf field: google.type.TimeZone time_zone = 9;
         */
        timeZone: TimeZone;
    } | {
        oneofKind: undefined;
    };
}
/**
 * Represents a time zone from the
 * [IANA Time Zone Database](https://www.iana.org/time-zones).
 *
 * @generated from protobuf message google.type.TimeZone
 */
export interface TimeZone {
    /**
     * IANA Time Zone Database time zone, e.g. "America/New_York".
     *
     * @generated from protobuf field: string id = 1;
     */
    id: string;
    /**
     * Optional. IANA Time Zone Database version number, e.g. "2019a".
     *
     * @generated from protobuf field: string version = 2;
     */
    version: string;
}
// @generated message type with reflection information, may provide speed optimized methods
class DateTime$Type extends MessageType<DateTime> {
    constructor() {
        super("google.type.DateTime", [
            { no: 1, name: "year", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "month", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 3, name: "day", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 4, name: "hours", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 5, name: "minutes", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 6, name: "seconds", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 7, name: "nanos", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 8, name: "utc_offset", kind: "message", oneof: "timeOffset", T: () => Duration },
            { no: 9, name: "time_zone", kind: "message", oneof: "timeOffset", T: () => TimeZone }
        ]);
    }
    /**
     * Creates `DateTime` for the current time.
     */
    now(): DateTime {
        return this.fromJsDate(new globalThis.Date());
    }
    /**
     * Creates a javascript Date object from the message.
     *
     * If a the message has a UTC offset, the javascript Date is converted
     * into your local time zone, because javascript Dates are always in the
     * local time zone.
     *
     * If the message has an offset given as an IANA timezone id, an error is
     * thrown, because javascript has no on-board support for IANA time zone
     * ids.
     */
    toJsDate(message: DateTime): globalThis.Date {
        let dt = new globalThis.Date(message.year, message.month - 1, message.day, message.hours, message.minutes, message.seconds, message.nanos / 1000), to = message.timeOffset;
        if (to) {
            if (to.oneofKind === "timeZone")
                throw new globalThis.Error("IANA time zone not supported");
            if (to.oneofKind === "utcOffset") {
                let s = PbLong.from(to.utcOffset.seconds).toNumber();
                dt = new globalThis.Date(dt.getTime() - (s * 1000));
            }
        }
        return dt;
    }
    /**
     * Creates a Date message from a javascript Date object.
     *
     * Values are in local time and a proper UTF offset is provided.
     */
    fromJsDate(date: globalThis.Date): DateTime {
        return {
            year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate(), hours: date.getHours(), minutes: date.getMinutes(), seconds: date.getSeconds(), nanos: date.getMilliseconds() * 1000, timeOffset: {
                oneofKind: "utcOffset", utcOffset: {
                    seconds: PbLong.from(date.getTimezoneOffset() * 60).toBigInt(), nanos: 0,
                }
            }
        };
    }
    create(value?: PartialMessage<DateTime>): DateTime {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.year = 0;
        message.month = 0;
        message.day = 0;
        message.hours = 0;
        message.minutes = 0;
        message.seconds = 0;
        message.nanos = 0;
        message.timeOffset = { oneofKind: undefined };
        if (value !== undefined)
            reflectionMergePartial<DateTime>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DateTime): DateTime {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 year */ 1:
                    message.year = reader.int32();
                    break;
                case /* int32 month */ 2:
                    message.month = reader.int32();
                    break;
                case /* int32 day */ 3:
                    message.day = reader.int32();
                    break;
                case /* int32 hours */ 4:
                    message.hours = reader.int32();
                    break;
                case /* int32 minutes */ 5:
                    message.minutes = reader.int32();
                    break;
                case /* int32 seconds */ 6:
                    message.seconds = reader.int32();
                    break;
                case /* int32 nanos */ 7:
                    message.nanos = reader.int32();
                    break;
                case /* google.protobuf.Duration utc_offset */ 8:
                    message.timeOffset = {
                        oneofKind: "utcOffset",
                        utcOffset: Duration.internalBinaryRead(reader, reader.uint32(), options, (message.timeOffset as any).utcOffset)
                    };
                    break;
                case /* google.type.TimeZone time_zone */ 9:
                    message.timeOffset = {
                        oneofKind: "timeZone",
                        timeZone: TimeZone.internalBinaryRead(reader, reader.uint32(), options, (message.timeOffset as any).timeZone)
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
    internalBinaryWrite(message: DateTime, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* int32 year = 1; */
        if (message.year !== 0)
            writer.tag(1, WireType.Varint).int32(message.year);
        /* int32 month = 2; */
        if (message.month !== 0)
            writer.tag(2, WireType.Varint).int32(message.month);
        /* int32 day = 3; */
        if (message.day !== 0)
            writer.tag(3, WireType.Varint).int32(message.day);
        /* int32 hours = 4; */
        if (message.hours !== 0)
            writer.tag(4, WireType.Varint).int32(message.hours);
        /* int32 minutes = 5; */
        if (message.minutes !== 0)
            writer.tag(5, WireType.Varint).int32(message.minutes);
        /* int32 seconds = 6; */
        if (message.seconds !== 0)
            writer.tag(6, WireType.Varint).int32(message.seconds);
        /* int32 nanos = 7; */
        if (message.nanos !== 0)
            writer.tag(7, WireType.Varint).int32(message.nanos);
        /* google.protobuf.Duration utc_offset = 8; */
        if (message.timeOffset.oneofKind === "utcOffset")
            Duration.internalBinaryWrite(message.timeOffset.utcOffset, writer.tag(8, WireType.LengthDelimited).fork(), options).join();
        /* google.type.TimeZone time_zone = 9; */
        if (message.timeOffset.oneofKind === "timeZone")
            TimeZone.internalBinaryWrite(message.timeOffset.timeZone, writer.tag(9, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message google.type.DateTime
 */
export const DateTime = new DateTime$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TimeZone$Type extends MessageType<TimeZone> {
    constructor() {
        super("google.type.TimeZone", [
            { no: 1, name: "id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "version", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<TimeZone>): TimeZone {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.id = "";
        message.version = "";
        if (value !== undefined)
            reflectionMergePartial<TimeZone>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TimeZone): TimeZone {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string id */ 1:
                    message.id = reader.string();
                    break;
                case /* string version */ 2:
                    message.version = reader.string();
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
    internalBinaryWrite(message: TimeZone, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string id = 1; */
        if (message.id !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.id);
        /* string version = 2; */
        if (message.version !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.version);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message google.type.TimeZone
 */
export const TimeZone = new TimeZone$Type();
