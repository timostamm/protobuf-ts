import { DateTime as DateTime_Speed } from "../ts-out/speed/google/type/datetime";
import { DateTime as DateTime_Size } from "../ts-out/size/google/type/datetime";
import { DateTime as DateTime_SpeedBigInt } from "../ts-out/speed-bigint/google/type/datetime";
import { DateTime as DateTime_SizeBigInt } from "../ts-out/size-bigint/google/type/datetime";
import { Duration as Duration_Speed } from "../ts-out/speed/google/protobuf/duration";
import { Duration as Duration_Size } from "../ts-out/size/google/protobuf/duration";
import { Duration as Duration_SpeedBigInt } from "../ts-out/speed-bigint/google/protobuf/duration";
import { Duration as Duration_SizeBigInt } from "../ts-out/size-bigint/google/protobuf/duration";
import { makeDuration } from "./support/helpers";
import { MessageType, PbLong } from "@protobuf-ts/runtime";

interface MessageMap {
  speed: {
    dateTime: MessageType<DateTime_Speed>;
    duration: MessageType<Duration_Speed>;
  };
  size: {
    dateTime: MessageType<DateTime_Size>;
    duration: MessageType<Duration_Size>;
  };
  speedBigInt: {
    dateTime: MessageType<DateTime_SpeedBigInt>;
    duration: MessageType<Duration_SpeedBigInt>;
  };
  sizeBigInt: {
    dateTime: MessageType<DateTime_SizeBigInt>;
    duration: MessageType<Duration_SizeBigInt>;
  };
}
const msgs: MessageMap = {
  speed: {
    dateTime: DateTime_Speed,
    duration: Duration_Speed,
  },
  size: {
    dateTime: DateTime_Size,
    duration: Duration_Size,
  },
  speedBigInt: {
    dateTime: DateTime_SpeedBigInt,
    duration: Duration_SpeedBigInt,
  },
  sizeBigInt: {
    dateTime: DateTime_SizeBigInt,
    duration: Duration_SizeBigInt,
  },
};

Object.entries(msgs).forEach(([name, { dateTime, duration }]) => {
  describe("google.type.DateTime " + name, function () {
    describe("now()", function () {
      it("creates DateTime for now", function () {
        let nowDate = new Date();
        let nowPb = dateTime.now();
        expect(nowPb.year).toBe(nowDate.getFullYear());
        expect(nowPb.month).toBe(nowDate.getMonth() + 1);
        expect(nowPb.day).toBe(nowDate.getDate());
        expect(nowPb.hours).toBe(nowDate.getHours());
        expect(nowPb.minutes).toBe(nowDate.getMinutes());
        expect(nowPb.seconds).toBe(nowDate.getSeconds());
        expect(nowPb.timeOffset.oneofKind).toBe("utcOffset");
        if (nowPb.timeOffset.oneofKind === "utcOffset") {
          let offsetSeconds = PbLong.from(
            nowPb.timeOffset.utcOffset.seconds
          ).toNumber();
          expect(offsetSeconds / 60).toBe(nowDate.getTimezoneOffset());
        }
      });
    });

    describe("toJsDate()", function () {
      it("creates javascript Date object", function () {
        let dt = dateTime.toJsDate({
          year: 2020,
          month: 12,
          day: 24,
          hours: 13,
          minutes: 45,
          seconds: 59,
          nanos: 500 * 1000,
          timeOffset: {
            oneofKind: undefined,
          },
        });
        expect(dt).toBeInstanceOf(globalThis.Date);
      });
      it("sets the correct time", function () {
        let dt = dateTime.toJsDate({
          year: 2020,
          month: 12,
          day: 24,
          hours: 13,
          minutes: 45,
          seconds: 59,
          nanos: 500 * 1000,
          timeOffset: {
            oneofKind: undefined,
          },
        });
        expect(dt.getFullYear()).toBe(2020);
        expect(dt.getMonth()).toBe(11);
        expect(dt.getDate()).toBe(24);
        expect(dt.getHours()).toBe(13);
        expect(dt.getMinutes()).toBe(45);
        expect(dt.getSeconds()).toBe(59);
        expect(dt.getMilliseconds()).toBe(500);
      });
      it("throws if timezone id present", function () {
        let dt = dateTime.create({
          year: 2020,
          month: 12,
          day: 24,
          hours: 13,
          minutes: 45,
          seconds: 59,
          nanos: 500 * 1000,
          timeOffset: {
            oneofKind: "timeZone",
            timeZone: {
              id: "foo",
              version: "bar",
            },
          },
        });

        expect(() => dateTime.toJsDate(dt)).toThrowError(
          "IANA time zone not supported"
        );
      });
      it("converts utc offset to local time", function () {
        let now = new globalThis.Date();
        let utcOffset = makeDuration(now.getTimezoneOffset() * 60, duration);
        let dt = dateTime.toJsDate({
          year: now.getUTCFullYear(),
          month: now.getUTCMonth() + 1,
          day: now.getUTCDate(),
          hours: now.getUTCHours(),
          minutes: now.getUTCMinutes(),
          seconds: now.getUTCSeconds(),
          nanos: now.getUTCMilliseconds() * 1000,
          timeOffset: {
            oneofKind: "utcOffset",
            utcOffset: utcOffset,
          },
        });
        expect(dt.getFullYear()).toBe(now.getFullYear());
        expect(dt.getMonth()).toBe(now.getMonth());
        expect(dt.getDate()).toBe(now.getDate());
        expect(dt.getHours()).toBe(now.getHours());
        expect(dt.getMinutes()).toBe(now.getMinutes());
        expect(dt.getSeconds()).toBe(now.getSeconds());
        expect(dt.getMilliseconds()).toBe(now.getMilliseconds());
      });
    });

    describe("fromJsDate()", function () {
      it("creates expected message", function () {
        let now = new globalThis.Date();
        let dt = dateTime.fromJsDate(now);
        expect(dt.year).toBe(now.getFullYear());
        expect(dt.month).toBe(now.getMonth() + 1);
        expect(dt.day).toBe(now.getDate());
        expect(dt.hours).toBe(now.getHours());
        expect(dt.minutes).toBe(now.getMinutes());
        expect(dt.seconds).toBe(now.getSeconds());
        expect(dt.nanos).toBe(now.getMilliseconds() * 1000);
        expect(dt.timeOffset.oneofKind).toBe("utcOffset");
        if (dt.timeOffset.oneofKind === "utcOffset") {
          let act = dt.timeOffset.utcOffset;
          let exp = makeDuration(now.getTimezoneOffset() * 60, duration);
          expect(act).toEqual(exp);
        }
      });
    });
  });
});
