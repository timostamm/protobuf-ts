import { Date as Date_Speed } from "../ts-out/speed/google/type/date";
import { Date as Date_Size } from "../ts-out/size/google/type/date";
import { Date as Date_SpeedBigInt } from "../ts-out/speed-bigint/google/type/date";
import { Date as Date_SizeBigInt } from "../ts-out/size-bigint/google/type/date";

const msgs = {
  speed: Date_Speed,
  size: Date_Size,
  speedBigInt: Date_SpeedBigInt,
  sizeBigInt: Date_SizeBigInt,
};

describe("google.type.Date", function () {
  Object.entries(msgs).forEach(([name, messageType]) => {
    describe("toJsDate() " + name, function () {
      it("creates javascript Date object", function () {
        let dt = messageType.toJsDate({
          year: 2020,
          month: 12,
          day: 24,
        });
        expect(dt).toBeInstanceOf(globalThis.Date);
      });
      it("uses current time if not presented", function () {
        let dt = messageType.toJsDate({
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

    describe("fromJsDate() " + name, function () {
      it("creates expected message", function () {
        let now = new globalThis.Date();
        let dt = messageType.fromJsDate(now);
        expect(dt.year).toBe(now.getFullYear());
        expect(dt.month).toBe(now.getMonth() + 1);
        expect(dt.day).toBe(now.getDate());
      });
    });
  });
});
