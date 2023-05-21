import { TimeOfDay as TimeOfDay_Speed } from "../ts-out/speed/google/type/timeofday";
import { TimeOfDay as TimeOfDay_Size } from "../ts-out/size/google/type/timeofday";
import { TimeOfDay as TimeOfDay_SpeedBigInt } from "../ts-out/speed-bigint/google/type/timeofday";
import { TimeOfDay as TimeOfDay_SizeBigInt } from "../ts-out/size-bigint/google/type/timeofday";

describe("google.type.TimeOfDay", function () {
  const msgs = {
    speed: TimeOfDay_Speed,
    size: TimeOfDay_Size,
    speedBigInt: TimeOfDay_SpeedBigInt,
    sizeBigInt: TimeOfDay_SizeBigInt,
  };

  Object.entries(msgs).forEach(([name, messageType]) => {
    describe("fromJsDate() " + name, function () {
      it("creates expected message", function () {
        let now = new globalThis.Date();
        let tod = messageType.fromJsDate(now);
        expect(tod.hours).toBe(now.getHours());
        expect(tod.minutes).toBe(now.getMinutes());
        expect(tod.seconds).toBe(now.getSeconds());
        expect(tod.nanos).toBe(now.getMilliseconds() * 1000);
      });
    });
  });
});
