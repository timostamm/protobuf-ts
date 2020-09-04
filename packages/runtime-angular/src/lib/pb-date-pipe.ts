import {Inject, LOCALE_ID, Pipe, PipeTransform} from "@angular/core";
import {formatDate} from "@angular/common";
import {isOneofGroup, PbLong} from "@protobuf-ts/runtime";


/**
 * The `PbDatePipe` works exactly like the original angular `DatePipe`,
 * but also understands `google.protobuf.Timestamp` and `google.type.DateTime`.
 */
@Pipe({name: 'date', pure: true})
export class PbDatePipe implements PipeTransform {


  constructor(@Inject(LOCALE_ID) private readonly locale: string) {
  }


  transform(value: any, format = 'mediumDate', timezone?: string, locale?: string): string | null {
    if (value == null || value === '' || value !== value) {
      return null;
    }
    if (isPbDateTime(value)) {
      let dt = new Date(value.year, value.month - 1, value.day, value.hours, value.minutes, value.seconds, value.nanos / 1000);
      if (value.timeOffset) {
        if (value.timeOffset.oneofKind === "timeZone") {
          throw new Error("Do not understand IANA time zone. Cannot convert to javascript Date.");
        } else if (value.timeOffset.oneofKind === "utcOffset") {
          let pbOffset = PbLong.from(value.timeOffset.utcOffset.seconds).toNumber() / 60;
          let jsOffset = dt.getTimezoneOffset();
          dt.setMinutes(dt.getMinutes() + (pbOffset - jsOffset))
        }
      }
      return formatDate(dt, format, locale ?? this.locale, timezone);
    }
    if (isPbTimestamp(value)) {
      let tsSeconds = PbLong.from(value.seconds).toNumber();
      let dt = new Date(tsSeconds * 1000 + Math.ceil(value.nanos / 1000000));
      return formatDate(dt, format, locale ?? this.locale, timezone);
    }
    return formatDate(value, format, locale ?? this.locale, timezone);
  }

}


function isPbTimestamp(arg: any): arg is PbTimestamp {
  if (typeof arg != "object" || arg === null)
    return false;
  if (typeof arg.nanos !== "number")
    return false;
  let st = typeof arg.seconds;
  return st == "number" || st == "string" || st == "bigint";
}


/**
 * @generated from protobuf message google.protobuf.Timestamp
 */
interface PbTimestamp {
  /**
   * Represents seconds of UTC time since Unix epoch
   * 1970-01-01T00:00:00Z. Must be from 0001-01-01T00:00:00Z to
   * 9999-12-31T23:59:59Z inclusive.
   *
   * @generated from protobuf field: int64 seconds = 1;
   */
  seconds: number | string | bigint;
  /**
   * Non-negative fractions of a second at nanosecond resolution. Negative
   * second values with fractions must still have non-negative nanos values
   * that count forward in time. Must be from 0 to 999,999,999
   * inclusive.
   *
   * @generated from protobuf field: int32 nanos = 2;
   */
  nanos: number;
}


function isPbDateTime(arg: any): arg is PbDateTime {
  if (typeof arg != "object" || arg === null)
    return false;
  if (typeof arg.year != "number")
    return false;
  if (typeof arg.month != "number")
    return false;
  if (typeof arg.day != "number")
    return false;
  if (typeof arg.hours != "number")
    return false;
  if (typeof arg.minutes != "number")
    return false;
  if (typeof arg.seconds != "number")
    return false;
  if (typeof arg.nanos != "number")
    return false;
  if (!isOneofGroup(arg.timeOffset))
    return false;
  let k = arg.timeOffset.oneofKind;
  if (k !== undefined && k != "timeZone" && k != "utcOffset")
    return false;
  return arg.timeOffset.utcOffset === undefined || isPbDuration(arg.timeOffset.utcOffset);
}


/**
 * @generated from protobuf message google.type.DateTime
 */
interface PbDateTime {
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
    utcOffset: PbDuration;
  } | {
    oneofKind: "timeZone";
    /**
     * Time zone.
     *
     * @generated from protobuf field: google.type.TimeZone time_zone = 9;
     */
    timeZone: any;
  } | {
    oneofKind: undefined;
  };
}


function isPbDuration(arg: any): arg is PbDuration {
  if (typeof arg != "object" || arg === null)
    return false;
  if (typeof arg.nanos !== "number")
    return false;
  let st = typeof arg.seconds;
  return st == "number" || st == "string" || st == "bigint";
}


/**
 * @generated from protobuf message google.protobuf.Duration
 */
interface PbDuration {
  /**
   * Signed seconds of the span of time. Must be from -315,576,000,000
   * to +315,576,000,000 inclusive. Note: these bounds are computed from:
   * 60 sec/min * 60 min/hr * 24 hr/day * 365.25 days/year * 10000 years
   *
   * @generated from protobuf field: int64 seconds = 1;
   */
  seconds: number | string | bigint;
  /**
   * Signed fractions of a second at nanosecond resolution of the span
   * of time. Durations less than one second are represented with a 0
   * `seconds` field and a positive or negative `nanos` field. For durations
   * of one second or more, a non-zero value for the `nanos` field must be
   * of the same sign as the `seconds` field. Must be from -999,999,999
   * to +999,999,999 inclusive.
   *
   * @generated from protobuf field: int32 nanos = 2;
   */
  nanos: number;
}
