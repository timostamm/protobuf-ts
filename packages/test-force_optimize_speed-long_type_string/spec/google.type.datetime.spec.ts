import {DateTime} from "../gen/google/type/datetime";
import {makeDuration} from "./helpers";
import {PbLong} from "@protobuf-ts/runtime";

// Copied from test-default/google.type.datetime.spec.ts. Do not edit.

describe('google.type.DateTime', function () {


    describe('now()', function () {
        it('creates DateTime for now', function () {
            let nowDate = new Date();
            let nowPb = DateTime.now();
            expect(nowPb.year).toBe(nowDate.getFullYear());
            expect(nowPb.month).toBe(nowDate.getMonth() + 1);
            expect(nowPb.day).toBe(nowDate.getDate());
            expect(nowPb.hours).toBe(nowDate.getHours());
            expect(nowPb.minutes).toBe(nowDate.getMinutes());
            expect(nowPb.seconds).toBe(nowDate.getSeconds());
            expect(nowPb.timeOffset.oneofKind).toBe("utcOffset");
            if (nowPb.timeOffset.oneofKind === "utcOffset") {
                let offsetSeconds = PbLong.from(nowPb.timeOffset.utcOffset.seconds).toNumber();
                expect(offsetSeconds / 60).toBe(nowDate.getTimezoneOffset());
            }
        });
    });


    describe('toJsDate()', function () {
        it('creates javascript Date object', function () {
            let dt = DateTime.toJsDate({
                year: 2020,
                month: 12,
                day: 24,
                hours: 13,
                minutes: 45,
                seconds: 59,
                nanos: 500 * 1000,
                timeOffset: {
                    oneofKind: undefined
                }
            });
            expect(dt).toBeInstanceOf(globalThis.Date);
        });
        it('sets the correct time', function () {
            let dt = DateTime.toJsDate({
                year: 2020,
                month: 12,
                day: 24,
                hours: 13,
                minutes: 45,
                seconds: 59,
                nanos: 500 * 1000,
                timeOffset: {
                    oneofKind: undefined
                }
            });
            expect(dt.getFullYear()).toBe(2020);
            expect(dt.getMonth()).toBe(11);
            expect(dt.getDate()).toBe(24);
            expect(dt.getHours()).toBe(13);
            expect(dt.getMinutes()).toBe(45);
            expect(dt.getSeconds()).toBe(59);
            expect(dt.getMilliseconds()).toBe(500);
        });
        it('throws if timezone id present', function () {
            let dt: DateTime = {
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
                        version: "bar"
                    }
                }
            };
            expect(() => DateTime.toJsDate(dt))
                .toThrowError('IANA time zone not supported');
        });
        it('converts utc offset to local time', function () {
            let now = new globalThis.Date();
            let utcOffset = makeDuration(now.getTimezoneOffset() * 60);
            let dt = DateTime.toJsDate({
                year: now.getUTCFullYear(),
                month: now.getUTCMonth() + 1,
                day: now.getUTCDate(),
                hours: now.getUTCHours(),
                minutes: now.getUTCMinutes(),
                seconds: now.getUTCSeconds(),
                nanos: now.getUTCMilliseconds() * 1000,
                timeOffset: {
                    oneofKind: "utcOffset",
                    utcOffset: utcOffset
                }
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

    describe('fromJsDate()', function () {
        it('creates expected message', function () {
            let now = new globalThis.Date();
            let dt = DateTime.fromJsDate(now);
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
                let exp = makeDuration(now.getTimezoneOffset() * 60);
                expect(act).toEqual(exp);
            }
        });
    });


});
