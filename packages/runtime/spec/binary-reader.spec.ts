import {WireDataDelimited, WireDataPlain} from "./support/wire-data";
import {BinaryReader, WireType} from "../src";
import {msg_longs_bytes} from "../../test-fixtures/msg-longs.fixtures";


describe('BinaryReader', () => {

    beforeEach(function () {
        jasmine.addCustomEqualityTester((a, b) =>
            (a instanceof Uint8Array && b instanceof Uint8Array) ? a.byteLength === b.byteLength : undefined
        );
    });

    it('tag() reads expected fieldNo', function () {
        let reader = new BinaryReader(WireDataPlain.tag_field_4_wire_type_varint);
        let [fieldNo] = reader.tag();
        expect(fieldNo).toBe(4);
    });

    it('reading length delimited', function () {
        let reader = new BinaryReader(WireDataDelimited.fixed32_666);
        let length = reader.uint32();
        expect(length).toBe(reader.len - reader.pos);
        let value = reader.fixed32();
        expect(value).toBe(666);
    });

    it('tag() reads expected wireType', function () {
        let reader = new BinaryReader(WireDataPlain.tag_field_4_wire_type_varint);
        let [, wireType] = reader.tag();
        expect(wireType).toBe(WireType.Varint);
    });

    it('skip() skips varint 64', function () {
        let reader = new BinaryReader(WireDataPlain.sfixed64_123);
        let skipped = reader.skip(WireType.Bit64);
        expect(reader.pos).toBe(reader.len);
        expect(skipped).toEqual(WireDataPlain.sfixed64_123);
    });

    it('skip() skips varint 32', function () {
        let reader = new BinaryReader(WireDataPlain.int32_123);
        let skipped = reader.skip(WireType.Varint);
        expect(reader.pos).toBe(reader.len);
        expect(skipped).toEqual(WireDataPlain.int32_123);
    });

    it('skip() skips fixed 64', function () {
        let reader = new BinaryReader(WireDataPlain.int64_123);
        let skipped = reader.skip(WireType.Varint);
        expect(reader.pos).toBe(reader.len);
        expect(skipped).toEqual(WireDataPlain.int64_123);
    });

    it('skip() skips length-delimited', function () {
        let reader = new BinaryReader(WireDataDelimited.fixed32_666);
        let skipped = reader.skip(WireType.LengthDelimited);
        expect(reader.pos).toBe(reader.len);
        expect(skipped).toEqual(WireDataDelimited.fixed32_666);
    });

    it('reads spec.LongsMessage with min / max values', function () {

        let reader = new BinaryReader(msg_longs_bytes);
        let fieldNo: number;
        let wireType: WireType;

        // jstype = normal

        // 1: fixed64_field_min
        // not present, because value 0 equals default value and is not written

        // 2: fixed64_field_max
        [fieldNo, wireType] = reader.tag();
        expect(fieldNo).toBe(2);
        expect(wireType).toBe(WireType.Bit64);
        expect(reader.fixed64().toString()).toBe("18446744073709551615");

        // 3: int64_field_min
        [fieldNo, wireType] = reader.tag();
        expect(fieldNo).toBe(3);
        expect(wireType).toBe(WireType.Varint);
        expect(reader.int64().toString()).toBe("-9223372036854775808");

        // 4: int64_field_max
        [fieldNo, wireType] = reader.tag();
        expect(fieldNo).toBe(4);
        expect(wireType).toBe(WireType.Varint);
        expect(reader.int64().toString()).toBe("9223372036854775807");

        // 5: sfixed64_field_min
        [fieldNo, wireType] = reader.tag();
        expect(fieldNo).toBe(5);
        expect(wireType).toBe(WireType.Bit64);
        expect(reader.sfixed64().toString()).toBe("-9223372036854775808");

        // 6: sfixed64_field_max
        [fieldNo, wireType] = reader.tag();
        expect(fieldNo).toBe(6);
        expect(wireType).toBe(WireType.Bit64);
        expect(reader.sfixed64().toString()).toBe("9223372036854775807");

        // 7: sint64_field_min
        [fieldNo, wireType] = reader.tag();
        expect(fieldNo).toBe(7);
        expect(wireType).toBe(WireType.Varint);
        expect(reader.sint64().toString()).toBe("-9223372036854775808");

        // 8: sint64_field_max
        [fieldNo, wireType] = reader.tag();
        expect(fieldNo).toBe(8);
        expect(wireType).toBe(WireType.Varint);
        expect(reader.sint64().toString()).toBe("9223372036854775807");

        // 9: uint64_field_min
        // not present, because value 0 equals default value and is not written

        // 10: uint64_field_max
        [fieldNo, wireType] = reader.tag();
        expect(fieldNo).toBe(10);
        expect(wireType).toBe(WireType.Varint);
        expect(reader.uint64().toString()).toBe("18446744073709551615");


        // jstype = string

        // 11: fixed64_field_min
        // not present, because value 0 equals default value and is not written

        // 12: fixed64_field_max
        [fieldNo, wireType] = reader.tag();
        expect(fieldNo).toBe(12);
        expect(wireType).toBe(WireType.Bit64);
        expect(reader.fixed64().toString()).toBe("18446744073709551615");

        // 13: int64_field_min
        [fieldNo, wireType] = reader.tag();
        expect(fieldNo).toBe(13);
        expect(wireType).toBe(WireType.Varint);
        expect(reader.int64().toString()).toBe("-9223372036854775808");

        // 14: int64_field_max
        [fieldNo, wireType] = reader.tag();
        expect(fieldNo).toBe(14);
        expect(wireType).toBe(WireType.Varint);
        expect(reader.int64().toString()).toBe("9223372036854775807");

        // 15: sfixed64_field_min
        [fieldNo, wireType] = reader.tag();
        expect(fieldNo).toBe(15);
        expect(wireType).toBe(WireType.Bit64);
        expect(reader.sfixed64().toString()).toBe("-9223372036854775808");

        // 16: sfixed64_field_max
        [fieldNo, wireType] = reader.tag();
        expect(fieldNo).toBe(16);
        expect(wireType).toBe(WireType.Bit64);
        expect(reader.sfixed64().toString()).toBe("9223372036854775807");

        // 17: sint64_field_min
        [fieldNo, wireType] = reader.tag();
        expect(fieldNo).toBe(17);
        expect(wireType).toBe(WireType.Varint);
        expect(reader.sint64().toString()).toBe("-9223372036854775808");

        // 18: sint64_field_max
        [fieldNo, wireType] = reader.tag();
        expect(fieldNo).toBe(18);
        expect(wireType).toBe(WireType.Varint);
        expect(reader.sint64().toString()).toBe("9223372036854775807");

        // 19: uint64_field_min
        // not present, because value 0 equals default value and is not written

        // 20: uint64_field_max
        [fieldNo, wireType] = reader.tag();
        expect(fieldNo).toBe(20);
        expect(wireType).toBe(WireType.Varint);
        expect(reader.uint64().toString()).toBe("18446744073709551615");


        // jstype = number

        // 21: fixed64_field_min
        // not present, because value 0 equals default value and is not written

        // 22: fixed64_field_max
        [fieldNo, wireType] = reader.tag();
        expect(fieldNo).toBe(22);
        expect(wireType).toBe(WireType.Bit64);
        expect(reader.fixed64().toString()).toBe("18446744073709551615");

        // 23: int64_field_min
        [fieldNo, wireType] = reader.tag();
        expect(fieldNo).toBe(23);
        expect(wireType).toBe(WireType.Varint);
        expect(reader.int64().toString()).toBe("-9223372036854775808");

        // 24: int64_field_max
        [fieldNo, wireType] = reader.tag();
        expect(fieldNo).toBe(24);
        expect(wireType).toBe(WireType.Varint);
        expect(reader.int64().toString()).toBe("9223372036854775807");

        // 25: sfixed64_field_min
        [fieldNo, wireType] = reader.tag();
        expect(fieldNo).toBe(25);
        expect(wireType).toBe(WireType.Bit64);
        expect(reader.sfixed64().toString()).toBe("-9223372036854775808");

        // 26: sfixed64_field_max
        [fieldNo, wireType] = reader.tag();
        expect(fieldNo).toBe(26);
        expect(wireType).toBe(WireType.Bit64);
        expect(reader.sfixed64().toString()).toBe("9223372036854775807");

        // 27: sint64_field_min
        [fieldNo, wireType] = reader.tag();
        expect(fieldNo).toBe(27);
        expect(wireType).toBe(WireType.Varint);
        expect(reader.sint64().toString()).toBe("-9223372036854775808");

        // 28: sint64_field_max
        [fieldNo, wireType] = reader.tag();
        expect(fieldNo).toBe(28);
        expect(wireType).toBe(WireType.Varint);
        expect(reader.sint64().toString()).toBe("9223372036854775807");

        // 29: uint64_field_min
        // not present, because value 0 equals default value and is not written

        // 30: uint64_field_max
        [fieldNo, wireType] = reader.tag();
        expect(fieldNo).toBe(30);
        expect(wireType).toBe(WireType.Varint);
        expect(reader.uint64().toString()).toBe("18446744073709551615");
    });

    it('bool() reads true', function () {
        let reader = new BinaryReader(WireDataPlain.bool_true);
        let value = reader.bool();
        expect(value).toBe(true);
    });

    it('bool() reads false', function () {
        let reader = new BinaryReader(WireDataPlain.bool_false);
        let value = reader.bool();
        expect(value).toBe(false);
    });

    it('fixed64() reads 123', function () {
        let reader = new BinaryReader(WireDataPlain.fixed64_123);
        let value = reader.fixed64();
        expect(value.toString()).toBe("123");
        expect(value.toNumber()).toBe(123);
        if (globalThis.BigInt)
            expect(value.toBigInt()).toBe(globalThis.BigInt(123));
    });

    it('sfixed64() reads 123', function () {
        let reader = new BinaryReader(WireDataPlain.sfixed64_123);
        let value = reader.sfixed64();
        expect(value.toString()).toBe("123");
        expect(value.toNumber()).toBe(123);
        if (globalThis.BigInt)
            expect(value.toBigInt()).toBe(globalThis.BigInt(123));
    });

    it('sfixed64() reads -123', function () {
        let reader = new BinaryReader(WireDataPlain.sfixed64_minus_123);
        let value = reader.sfixed64();
        expect(value.toString()).toBe("-123");
        expect(value.toNumber()).toBe(-123);
        if (globalThis.BigInt)
            expect(value.toBigInt()).toBe(globalThis.BigInt(-123));
    });

    it('uint64() reads 123', function () {
        let reader = new BinaryReader(WireDataPlain.uint64_123);
        let value = reader.uint64();
        expect(value.toString()).toBe("123");
        expect(value.toNumber()).toBe(123);
        if (globalThis.BigInt)
            expect(value.toBigInt()).toBe(globalThis.BigInt(123));
    });

    it('sint64() reads 123', function () {
        let reader = new BinaryReader(WireDataPlain.sint64_123);
        let value = reader.sint64();
        expect(value.toString()).toBe("123");
        expect(value.toNumber()).toBe(123);
        if (globalThis.BigInt)
            expect(value.toBigInt()).toBe(globalThis.BigInt(123));
    });

    it('sint64() reads -123', function () {
        let reader = new BinaryReader(WireDataPlain.sint64_minus_123);
        let value = reader.sint64();
        expect(value.toString()).toBe("-123");
        expect(value.toNumber()).toBe(-123);
        if (globalThis.BigInt)
            expect(value.toBigInt()).toBe(globalThis.BigInt(-123));
    });

    it('int32() reads 123', function () {
        let reader = new BinaryReader(WireDataPlain.int32_123);
        let value = reader.int32();
        expect(value).toBe(123);
    });

    it('int32() reads -123', function () {
        let reader = new BinaryReader(WireDataPlain.int32_minus_123);
        let value = reader.int32();
        expect(value).toBe(-123);
    });

    it('uint32() reads 123', function () {
        let reader = new BinaryReader(WireDataPlain.uint32_123);
        let value = reader.uint32();
        expect(value).toBe(123);
    });

    it('float() reads 0.75', function () {
        let reader = new BinaryReader(WireDataPlain.float_0_75);
        let value = reader.float();
        expect(value).toBe(0.75);
    });

    it('float() reads -0.75', function () {
        let reader = new BinaryReader(WireDataPlain.float_minus_0_75);
        let value = reader.float();
        expect(value).toBe(-0.75);
    });

    it('double() reads 0.75', function () {
        let reader = new BinaryReader(WireDataPlain.double_0_75);
        let value = reader.double();
        expect(value).toBe(0.75);
    });

    it('double() reads -0.75', function () {
        let reader = new BinaryReader(WireDataPlain.double_minus_0_75);
        let value = reader.double();
        expect(value).toBe(-0.75);
    });

    it('fixed32() reads 123', function () {
        let reader = new BinaryReader(WireDataPlain.fixed32_123);
        let value = reader.fixed32();
        expect(value).toBe(123);
    });

    it('sfixed32() reads 123', function () {
        let reader = new BinaryReader(WireDataPlain.sfixed32_123);
        let value = reader.sfixed32();
        expect(value).toBe(123);
    });

    it('sfixed32() reads -123', function () {
        let reader = new BinaryReader(WireDataPlain.sfixed32_minus_123);
        let value = reader.sfixed32();
        expect(value).toBe(-123);
    });

    it('sint32() reads 123', function () {
        let reader = new BinaryReader(WireDataPlain.sint32_123);
        let value = reader.sint32();
        expect(value).toBe(123);
    });

    it('sint32() reads -123', function () {
        let reader = new BinaryReader(WireDataPlain.sint32_minus_123);
        let value = reader.sint32();
        expect(value).toBe(-123);
    });

    it('string() reads hello 🌍', function () {
        let reader = new BinaryReader(WireDataPlain.string_hello_world_emoji);
        let value = reader.string();
        expect(value).toBe('hello 🌍');
    });

    it('bytes() reads de ad be ef', function () {
        let reader = new BinaryReader(WireDataPlain.bytes_deadbeef);
        let value = reader.bytes();
        expect(value).toEqual(new Uint8Array([0xde, 0xad, 0xbe, 0xef]));
    });


});
