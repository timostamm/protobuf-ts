import {PbLong, PbULong} from "../src";
import {int64toString} from '../src/goog-varint';


describe('PbULong', function () {

    it('can be constructed with bits', function () {
        let bi = new PbULong(0, 1);
        expect(bi.lo).toBe(0);
        expect(bi.hi).toBe(1);
    });

    it('should from() max unsigned int64 string', function () {
        let str = '18446744073709551615';
        let uLong = PbULong.from(str);
        expect(uLong.lo).toBe(-1);
        expect(uLong.hi).toBe(-1);
    });

    it('should from() max unsigned int64 native bigint', function () {
        if (globalThis.BigInt === undefined)
            pending('No BigInt support on current platform');

        // @ts-ignore
        let uLong = PbULong.from(18446744073709551615n);
        expect(uLong.lo).toBe(-1);
        expect(uLong.hi).toBe(-1);
    });

    it('should from() max safe integer number', function () {
        let uLong = PbULong.from(Number.MAX_SAFE_INTEGER);
        expect(uLong.lo).toBe(-1);
        expect(uLong.hi).toBe(2097151);
        expect(uLong.toNumber()).toBe(Number.MAX_SAFE_INTEGER);
    });

    it('should toString() max unsigned int64', function () {
        let uLong = new PbULong(-1, -1);
        expect(uLong.toString()).toBe('18446744073709551615');
    });

    it('should toBigInt()', function () {
        if (globalThis.BigInt === undefined)
            pending('No BigInt support on current platform');

        let uLong = new PbULong(-1, -1);
        // @ts-ignore
        expect(uLong.toBigInt()).toBe(18446744073709551615n);
    });

    it('should fail from() max unsigned int64 native bigint', function () {
        if (globalThis.BigInt === undefined)
            pending('No BigInt support on current platform');

        // @ts-ignore
        expect(() => PbULong.from(18446744073709551615n + 10n)).toThrowError("ulong too large");
    });

    it('should fail invalid from() value', function () {
        expect(() => PbULong.from("")).toThrowError();
        expect(() => PbULong.from("0.75")).toThrowError();
        expect(() => PbULong.from("1,000")).toThrowError();
        expect(() => PbULong.from("1-000")).toThrowError();
        expect(() => PbULong.from("-1")).toThrowError();
        expect(() => PbULong.from(-1)).toThrowError();
        expect(() => PbULong.from(Number.NaN)).toThrowError();
        expect(() => PbULong.from(Number.POSITIVE_INFINITY)).toThrowError();
    });

    it('0 has lo = 0, hi = 0', function () {
        let ulong = PbULong.from(0);
        expect(ulong.hi).toBe(0);
        expect(ulong.lo).toBe(0);
    });

    it('int64toString should serialize the same was as BigInt.toString()', function () {
        let ulong = PbULong.from(1661324400000);
        expect(ulong.hi).toBe(386);
        expect(ulong.lo).toBe(-827943552);
        expect(ulong.toString()).toBe('1661324400000')
        expect(int64toString(ulong.lo, ulong.hi)).toBe('1661324400000')
    });

});


describe('PbLong', function () {

    it('can be constructed with bits', function () {
        let bi = new PbLong(0, 1);
        expect(bi.lo).toBe(0);
        expect(bi.hi).toBe(1);
    });

    it('should from() max signed int64 string', function () {
        let str = '9223372036854775807';
        let uLong = PbLong.from(str);
        expect(uLong.lo).toBe(-1);
        expect(uLong.hi).toBe(2147483647);
        expect(uLong.toString()).toBe("9223372036854775807");
    });

    it('should from() min signed int64 string', function () {
        let str = '-9223372036854775808';
        let uLong = PbLong.from(str);
        expect(uLong.lo).toBe(0);
        expect(uLong.hi).toBe(-2147483648);
    });

    it('should toString() min signed int64', function () {
        let uLong = new PbLong(0, -2147483648);
        expect(uLong.toString()).toBe('-9223372036854775808');
    });

    it('should from() max safe integer number', function () {
        let uLong = PbLong.from(Number.MAX_SAFE_INTEGER);
        expect(uLong.lo).toBe(-1);
        expect(uLong.hi).toBe(2097151);
        expect(uLong.toNumber()).toBe(Number.MAX_SAFE_INTEGER);
    });

    it('should from() min safe integer number', function () {
        let uLong = PbLong.from(Number.MIN_SAFE_INTEGER);
        expect(uLong.lo).toBe(1);
        expect(uLong.hi).toBe(-2097152);
        expect(uLong.toNumber()).toBe(Number.MIN_SAFE_INTEGER);
    });

    it('should fail invalid from() value', function () {
        expect(() => PbLong.from("")).toThrowError();
        expect(() => PbLong.from("0.75")).toThrowError();
        expect(() => PbLong.from("1,000")).toThrowError();
        expect(() => PbLong.from("1-000")).toThrowError();
        let maxSignedPlusOneStr = "9223372036854775808"
        expect(() => PbLong.from(maxSignedPlusOneStr)).toThrowError();
        expect(() => PbLong.from(Number.NaN)).toThrowError();
        expect(() => PbLong.from(Number.POSITIVE_INFINITY)).toThrowError();
    });

    it('should toBigInt()', function () {
        if (globalThis.BigInt === undefined)
            pending('No BigInt support on current platform');

        let bi = new PbLong(-620756991, 53471156);
        // @ts-ignore
        expect(bi.toBigInt()).toBe(229656869973524481n);

        bi = new PbLong(1234567890, 0);
        // @ts-ignore
        expect(bi.toBigInt()).toBe(1234567890n);

        // signed max value
        bi = new PbLong(-1, 2147483647);
        // @ts-ignore
        expect(bi.toBigInt()).toBe(9223372036854775807n);

    });


    it('should isNegative()', function () {
        let long = PbLong.from(-9223372)
        expect(long.isNegative()).toBeTrue();

        long = PbLong.from("-9223372")
        expect(long.isNegative()).toBeTrue();

        long = PbLong.from(9223372)
        expect(long.isNegative()).toBeFalse();

        long = PbLong.from("9223372")
        expect(long.isNegative()).toBeFalse();
    })


    it('should isNegative() with negative native bigint', function () {
        if (globalThis.BigInt === undefined)
            pending('No BigInt support on current platform');

        // @ts-ignore
        let long = PbLong.from(-9223372036854775808n)
        expect(long.isNegative()).toBeTrue();

        // @ts-ignore
        long = PbLong.from(9223372036854775807n)
        expect(long.isNegative()).toBeFalse();
    })


    it('from(bigint) set expected bits', function () {
        if (globalThis.BigInt === undefined)
            pending('No BigInt support on current platform');

        // @ts-ignore
        let bi = PbLong.from(9223372036854775807n);
        expect(bi.lo).toBe(0xFFFFFFFF | 0);
        expect(bi.hi).toBe(0x7FFFFFFF | 0);

        // @ts-ignore
        expect(bi.toBigInt()).toBe(9223372036854775807n);
    });


    it('0 has lo = 0, hi = 0', function () {
        let ulong = PbLong.from(0);
        expect(ulong.hi).toBe(0);
        expect(ulong.lo).toBe(0);
    });

});


describe('testing native bigint', function () {

    it('max uint64 value should survive string conversion', function () {
        if (globalThis.BigInt === undefined)
            pending('No BigInt support on current platform');

        // @ts-ignore
        let m = 18446744073709551615n;
        let s = "18446744073709551615"
        expect(m.toString()).toBe(s);
        expect(globalThis.BigInt(s)).toBe(m);
    });

    it('min int64 value should survive string conversion', function () {
        if (globalThis.BigInt === undefined)
            pending('No BigInt support on current platform');

        // @ts-ignore
        let m = -9223372036854775808n;
        let s = "-9223372036854775808"
        expect(m.toString()).toBe(s);
        expect(globalThis.BigInt(s)).toBe(m);
    });

    it('max int64 value should survive string conversion', function () {
        if (globalThis.BigInt === undefined)
            pending('No BigInt support on current platform');

        // @ts-ignore
        let m = 9223372036854775807n;
        let s = "9223372036854775807"
        expect(m.toString()).toBe(s);
        expect(globalThis.BigInt(s)).toBe(m);
    });


    it('max uint64 value should survive DataView round trip', function () {
        if (globalThis.BigInt === undefined)
            pending('No BigInt support on current platform');

        // @ts-ignore
        let expected = 18446744073709551615n;

        // write
        let view64 = new DataView(new ArrayBuffer(8));
        view64.setBigUint64(0, expected, true);
        let lo = view64.getInt32(0, true) | 0;
        let hi = view64.getInt32(4, true) | 0;

        // read
        view64.setInt32(0, lo, true);
        view64.setInt32(4, hi, true);
        let bigint = view64.getBigUint64(0, true);

        expect(bigint === expected).toBeTrue();
    });


    it('max int64 value should survive DataView round trip', function () {
        if (globalThis.BigInt === undefined)
            pending('No BigInt support on current platform');

        // @ts-ignore
        let expected = 9223372036854775807n;

        // write
        let view64 = new DataView(new ArrayBuffer(8));
        view64.setBigInt64(0, expected, true);
        let lo = view64.getInt32(0, true) | 0;
        let hi = view64.getInt32(4, true) | 0;

        // read
        view64.setInt32(0, lo, true);
        view64.setInt32(4, hi, true);
        let actual = view64.getBigInt64(0, true);

        expect(actual.toString()).toBe(expected.toString());
    });


    it('min int64 value should survive DataView round trip', function () {
        if (globalThis.BigInt === undefined)
            pending('No BigInt support on current platform');

        // @ts-ignore
        let expected = -9223372036854775808n;

        // write
        let view64 = new DataView(new ArrayBuffer(8));
        view64.setBigInt64(0, expected, true);
        let lo = view64.getInt32(0, true) | 0;
        let hi = view64.getInt32(4, true) | 0;

        // read
        view64.setInt32(0, lo, true);
        view64.setInt32(4, hi, true);
        let actual = view64.getBigInt64(0, true);

        expect(actual.toString()).toBe(expected.toString());
    });

});
