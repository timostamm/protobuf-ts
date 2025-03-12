// @generated by protobuf-ts 2.9.5 with parameter force_optimize_code_size,long_type_string
// @generated from protobuf file "google/type/date.proto" (package "google.type", syntax proto3)
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
import { MessageType } from "@protobuf-ts/runtime";
/**
 * Represents a whole or partial calendar date, e.g. a birthday. The time of day
 * and time zone are either specified elsewhere or are not significant. The date
 * is relative to the Proleptic Gregorian Calendar. This can represent:
 *
 * * A full date, with non-zero year, month and day values
 * * A month and day value, with a zero year, e.g. an anniversary
 * * A year on its own, with zero month and day values
 * * A year and month value, with a zero day, e.g. a credit card expiration date
 *
 * Related types are [google.type.TimeOfDay][google.type.TimeOfDay] and `google.protobuf.Timestamp`.
 *
 * @generated from protobuf message google.type.Date
 */
export interface Date {
    /**
     * Year of date. Must be from 1 to 9999, or 0 if specifying a date without
     * a year.
     *
     * @generated from protobuf field: int32 year = 1;
     */
    year: number;
    /**
     * Month of year. Must be from 1 to 12, or 0 if specifying a year without a
     * month and day.
     *
     * @generated from protobuf field: int32 month = 2;
     */
    month: number;
    /**
     * Day of month. Must be from 1 to 31 and valid for the year and month, or 0
     * if specifying a year by itself or a year and month where the day is not
     * significant.
     *
     * @generated from protobuf field: int32 day = 3;
     */
    day: number;
}
// @generated message type with reflection information, may provide speed optimized methods
class Date$Type extends MessageType<Date> {
    constructor() {
        super("google.type.Date", [
            { no: 1, name: "year", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "month", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 3, name: "day", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
    /**
     * Creates a javascript Date object from the message.
     *
     * If you do not provide the optional parameters for time,
     * the current time is used.
     */
    toJsDate(message: Date, hours?: number, minutes?: number, seconds?: number, ms?: number): globalThis.Date {
        let now = new globalThis.Date();
        return new globalThis.Date(message.year, message.month - 1, message.day, hours ?? now.getHours(), minutes ?? now.getMinutes(), seconds ?? now.getSeconds(), ms ?? now.getMilliseconds());
    }
    /**
     * Creates a Date message from a javascript Date object.
     */
    fromJsDate(date: globalThis.Date): Date {
        return {
            year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate(),
        };
    }
}
/**
 * @generated MessageType for protobuf message google.type.Date
 */
export const Date = new Date$Type();
