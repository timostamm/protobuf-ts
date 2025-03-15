import {Date} from "../gen/google/type/date";

// Copied from test-default/google.type.date.spec.ts. Do not edit.

describe('google.type.Date', function () {

    describe('toJsDate()', function () {
        it('creates javascript Date object', function () {
            let dt = Date.toJsDate({
                year: 2020,
                month: 12,
                day: 24,
            });
            expect(dt).toBeInstanceOf(globalThis.Date);
        });
        it('uses current time if not presented', function () {
            let dt = Date.toJsDate({
                year: 2020,
                month: 12,
                day: 24,
            });
            let now = new globalThis.Date();
            expect(dt.getHours()).toBe(now.getHours());
            expect(dt.getMinutes()).toBe(now.getMinutes());
            expect(dt.getSeconds()).toBe(now.getSeconds());
        });
    });

    describe('fromJsDate()', function () {
        it('creates expected message', function () {
            let now = new globalThis.Date();
            let dt = Date.fromJsDate(now);
            expect(dt.year).toBe(now.getFullYear());
            expect(dt.month).toBe(now.getMonth() + 1);
            expect(dt.day).toBe(now.getDate());
        });
    });

});
