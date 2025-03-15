import {Color} from "../gen/google/type/color";

// Copied from test-default/google.type.color.spec.ts. Do not edit.

describe('google.type.Color', function () {

    describe('toHex()', function () {
        it('rgb(0,80,170) is #0050aa', function () {
            let col: Color = {red: 0, green: 80, blue: 170};
            expect(Color.toHex(col)).toBe("#0050aa");
        });
        it('rgb(193,231,225) is #c1e7e1', function () {
            let col: Color = {red: 193, green: 231, blue: 225};
            expect(Color.toHex(col)).toBe("#c1e7e1");
        });
        it('rgba(193,231,225,0) is #c1e7e100', function () {
            let col: Color = {red: 193, green: 231, blue: 225, alpha: {value: 0.0}};
            expect(Color.toHex(col)).toBe("#c1e7e100");
        });
        it('rgba(193,231,225,1) is #c1e7e1ff', function () {
            let col: Color = {red: 193, green: 231, blue: 225, alpha: {value: 1.0}};
            expect(Color.toHex(col)).toBe("#c1e7e1ff");
        });
        it('rgba(193,231,225,0.8) is #c1e7e1cc', function () {
            let col: Color = {red: 193, green: 231, blue: 225, alpha: {value: 0.8}};
            expect(Color.toHex(col)).toBe("#c1e7e1cc");
        });
    });

    describe('fromHex()', function () {
        it('understands six-digit form', function () {
            expect(Color.fromHex("#ff0000")).toEqual({
                red: 255, green: 0, blue: 0,
            });
        });
        it('understands three-digit form', function () {
            expect(Color.fromHex("#f00")).toEqual({
                red: 255, green: 0, blue: 0,
            });
        });
        it('understands four-digit form', function () {
            expect(Color.fromHex("#0f3c")).toEqual({
                red: 0, green: 255, blue: 51, alpha: {value: 0.8}
            });
        });
        it('understands four-digit form', function () {
            expect(Color.fromHex("#00ff33cc")).toEqual({
                red: 0, green: 255, blue: 51, alpha: {value: 0.8}
            });
        });
        it('throws if not understood', function () {
            expect(() => Color.fromHex("rgba")).toThrowError('invalid hex color');
        });
    });

});
