import {TimeOfDay} from "../gen/google/type/timeofday";

// Copied from default/spec/google.type.timeofday.spec.ts. Do not edit.

describe('google.type.TimeOfDay', function () {

    describe('fromJsDate()', function () {
        it('creates expected message', function () {
            let now = new globalThis.Date();
            let tod = TimeOfDay.fromJsDate(now);
            expect(tod.hours).toBe(now.getHours());
            expect(tod.minutes).toBe(now.getMinutes());
            expect(tod.seconds).toBe(now.getSeconds());
            expect(tod.nanos).toBe(now.getMilliseconds() * 1000);
        });
    });

});
