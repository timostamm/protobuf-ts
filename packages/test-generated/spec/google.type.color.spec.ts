import { Color as Color_Speed } from "../ts-out/speed/google/type/color";
import { Color as Color_Size } from "../ts-out/size/google/type/color";
import { Color as Color_SpeedBigInt } from "../ts-out/speed-bigint/google/type/color";
import { Color as Color_SizeBigInt } from "../ts-out/size-bigint/google/type/color";

const msgs = {
  speed: Color_Speed,
  size: Color_Size,
  speedBigInt: Color_SpeedBigInt,
  sizeBigInt: Color_SizeBigInt,
};

describe("google.type.Color", function () {
  Object.entries(msgs).forEach(([name, messageType]) => {
    describe("toHex() " + name, () => {
      it("rgb(0,80,170) is #0050aa", function () {
        let col = messageType.create({ red: 0, green: 80, blue: 170 });
        expect(messageType.toHex(col)).toBe("#0050aa");
      });
      it("rgb(193,231,225) is #c1e7e1", function () {
        let col = messageType.create({ red: 193, green: 231, blue: 225 });
        expect(messageType.toHex(col)).toBe("#c1e7e1");
      });
      it("rgba(193,231,225,0) is #c1e7e100", function () {
        let col = messageType.create({
          red: 193,
          green: 231,
          blue: 225,
          alpha: { value: 0.0 },
        });
        expect(messageType.toHex(col)).toBe("#c1e7e100");
      });
      it("rgba(193,231,225,1) is #c1e7e1ff", function () {
        let col = messageType.create({
          red: 193,
          green: 231,
          blue: 225,
          alpha: { value: 1.0 },
        });
        expect(messageType.toHex(col)).toBe("#c1e7e1ff");
      });
      it("rgba(193,231,225,0.8) is #c1e7e1cc", function () {
        let col = messageType.create({
          red: 193,
          green: 231,
          blue: 225,
          alpha: { value: 0.8 },
        });
        expect(messageType.toHex(col)).toBe("#c1e7e1cc");
      });
    });

    describe("fromHex() " + name, () => {
      it("understands six-digit form", function () {
        expect(messageType.fromHex("#ff0000")).toEqual({
          red: 255,
          green: 0,
          blue: 0,
        });
      });
      it("understands three-digit form", function () {
        expect(messageType.fromHex("#f00")).toEqual({
          red: 255,
          green: 0,
          blue: 0,
        });
      });
      it("understands four-digit form", function () {
        expect(messageType.fromHex("#0f3c")).toEqual({
          red: 0,
          green: 255,
          blue: 51,
          alpha: { value: 0.8 },
        });
      });
      it("understands four-digit form", function () {
        expect(messageType.fromHex("#00ff33cc")).toEqual({
          red: 0,
          green: 255,
          blue: 51,
          alpha: { value: 0.8 },
        });
      });
      it("throws if not understood", function () {
        expect(() => messageType.fromHex("rgba")).toThrowError(
          "invalid hex color"
        );
      });
    });
  });
});
