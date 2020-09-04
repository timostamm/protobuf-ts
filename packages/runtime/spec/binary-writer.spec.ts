import {BinaryReader, BinaryWriter, WireType} from "../src";
import {WireDataDelimited, WireDataPlain} from "./support/wire-data";
import {msg_longs_bytes} from "../../test-fixtures/msg-longs.fixtures";


describe('BinaryWriter', () => {

    beforeEach(function () {
        jasmine.addCustomEqualityTester((a, b) =>
            (a instanceof Uint8Array && b instanceof Uint8Array) ? a.byteLength === b.byteLength : undefined
        );
    });

    it('tag(4, WireType.VarInt) writes expected data', function () {
        let bytes = new BinaryWriter().tag(13, WireType.LengthDelimited).finish();
        expect(bytes).toEqual(WireDataPlain.tag_field_4_wire_type_varint);
    });

    it('join() writes expected length', function () {
        let reader = new BinaryReader(WireDataDelimited.fixed32_666);
        expect(reader.uint32()).toBe(4); // length of the fixed32: 666
        expect(reader.fixed32()).toBe(666);
    });

    it('writes spec.LongsMessage with min / max values', function () {
        let writer = new BinaryWriter();

        // jstype = normal

        // 1: fixed64_field_min
        // writer.tag(1, WireType.Bit64).fixed64("0");

        // 2: fixed64_field_max
        writer.tag(2, WireType.Bit64).fixed64("18446744073709551615");

        // 3: int64_field_min
        writer.tag(3, WireType.Varint).int64("-9223372036854775808");

        // 4: int64_field_max
        writer.tag(4, WireType.Varint).int64("9223372036854775807");

        // 5: sfixed64_field_min
        writer.tag(5, WireType.Bit64).sfixed64("-9223372036854775808");

        // 6: sfixed64_field_max
        writer.tag(6, WireType.Bit64).sfixed64("9223372036854775807");

        // 7: sint64_field_min
        writer.tag(7, WireType.Varint).sint64("-9223372036854775808");

        // 8: sint64_field_max
        writer.tag(8, WireType.Varint).sint64("9223372036854775807");

        // 9: uint64_field_min
        // writer.tag(9, WireType.Varint).uint64("0");

        // 10: uint64_field_max
        writer.tag(10, WireType.Varint).uint64("18446744073709551615");

        // jstype = string

        // 11: fixed64_field_min_str
        // writer.tag(11, WireType.Bit64).fixed64("0");

        // 12: fixed64_field_max_str
        writer.tag(12, WireType.Bit64).fixed64("18446744073709551615");

        // 13: int64_field_min_str
        writer.tag(13, WireType.Varint).int64("-9223372036854775808");

        // 14: int64_field_max_str
        writer.tag(14, WireType.Varint).int64("9223372036854775807");

        // 15: sfixed64_field_min_str
        writer.tag(15, WireType.Bit64).sfixed64("-9223372036854775808");

        // 16: sfixed64_field_max_str
        writer.tag(16, WireType.Bit64).sfixed64("9223372036854775807");

        // 17: sint64_field_min_str
        writer.tag(17, WireType.Varint).sint64("-9223372036854775808");

        // 18: sint64_field_max_str
        writer.tag(18, WireType.Varint).sint64("9223372036854775807");

        // 19: uint64_field_min_str
        // 10writer.tag(19, WireType.Varint).uint64("0");

        // 20: uint64_field_max_str
        writer.tag(20, WireType.Varint).uint64("18446744073709551615");

        // jstype = number

        // 21: fixed64_field_min_num
        // writer.tag(21, WireType.Bit64).fixed64("0");

        // 22: fixed64_field_max_num
        writer.tag(22, WireType.Bit64).fixed64("18446744073709551615");

        // 23: int64_field_min_num
        writer.tag(23, WireType.Varint).int64("-9223372036854775808");

        // 24: int64_field_max_num
        writer.tag(24, WireType.Varint).int64("9223372036854775807");

        // 25: sfixed64_field_min_num
        writer.tag(25, WireType.Bit64).sfixed64("-9223372036854775808");

        // 26: sfixed64_field_max_num
        writer.tag(26, WireType.Bit64).sfixed64("9223372036854775807");

        // 27: sint64_field_min_num
        writer.tag(27, WireType.Varint).sint64("-9223372036854775808");

        // 28: sint64_field_max_num
        writer.tag(28, WireType.Varint).sint64("9223372036854775807");

        // 29: uint64_field_min_num
        // 20writer.tag(29, WireType.Varint).uint64("0");

        // 30: uint64_field_max_num
        writer.tag(30, WireType.Varint).uint64("18446744073709551615");

        let bytes = writer.finish();
        expect(bytes).toEqual(msg_longs_bytes);
    });

    it('uint32(123)', function () {
        let bytes = new BinaryWriter().uint32(32).finish();
        expect(bytes).toEqual(WireDataPlain.uint32_32);
    });

    it('uint32(32).uint32(123)', function () {
        let bytes = new BinaryWriter().uint32(32).uint32(123).finish();
        let exp = new Uint8Array(WireDataPlain.uint32_32.length + WireDataPlain.uint32_123.length);
        exp.set(WireDataPlain.uint32_32, 0);
        exp.set(WireDataPlain.uint32_123, WireDataPlain.uint32_32.length);
        expect(bytes).toEqual(exp);
    });

    it('bool(true)', function () {
        let bytes = new BinaryWriter().bool(true).finish();
        expect(bytes).toEqual(WireDataPlain.bool_true);
    });
    it('bool(false)', function () {
        let bytes = new BinaryWriter().bool(false).finish();
        expect(bytes).toEqual(WireDataPlain.bool_false);
    });

    it('fixed32(123)', function () {
        let bytes = new BinaryWriter().fixed32(123).finish();
        expect(bytes).toEqual(WireDataPlain.fixed32_123);
    });

    it('sfixed32(123)', function () {
        let bytes = new BinaryWriter().sfixed32(123).finish();
        expect(bytes).toEqual(WireDataPlain.sfixed32_123);
    });

    it('sfixed32(-123)', function () {
        let bytes = new BinaryWriter().sfixed32(-123).finish();
        expect(bytes).toEqual(WireDataPlain.sfixed32_minus_123);
    });

    it('int32(123)', function () {
        let bytes = new BinaryWriter().int32(123).finish();
        expect(bytes).toEqual(WireDataPlain.int32_123);
    });

    it('int32(-123)', function () {
        let bytes = new BinaryWriter().int32(-123).finish();
        expect(bytes).toEqual(WireDataPlain.int32_minus_123);
    });

    it('sint32(123)', function () {
        let bytes = new BinaryWriter().sint32(123).finish();
        expect(bytes).toEqual(WireDataPlain.sint32_123);
    });

    it('sint32(-123)', function () {
        let bytes = new BinaryWriter().sint32(-123).finish();
        expect(bytes).toEqual(WireDataPlain.sint32_minus_123);
    });

    it('uint64(123)', function () {
        let bytes = new BinaryWriter().uint64(123).finish();
        expect(bytes).toEqual(WireDataPlain.uint64_123);
    });

    it('int64(123)', function () {
        let bytes = new BinaryWriter().int64(123).finish();
        expect(bytes).toEqual(WireDataPlain.int64_123);
    });

    it('sint64(123)', function () {
        let bytes = new BinaryWriter().sint64(123).finish();
        expect(bytes).toEqual(WireDataPlain.sint64_123);
    });

    it('sint64(-123)', function () {
        let bytes = new BinaryWriter().sint64(-123).finish();
        expect(bytes).toEqual(WireDataPlain.sint64_minus_123);
    });

    it('fixed64(123)', function () {
        let bytes = new BinaryWriter().fixed64(123).finish();
        expect(bytes).toEqual(WireDataPlain.fixed64_123);
    });

    it('sfixed64(123)', function () {
        let bytes = new BinaryWriter().sfixed64(123).finish();
        expect(bytes).toEqual(WireDataPlain.sfixed64_123);
    });

    it('sfixed64(-123)', function () {
        let bytes = new BinaryWriter().sfixed64(-123).finish();
        expect(bytes).toEqual(WireDataPlain.sfixed64_minus_123);
    });

    it('string("hello 🌍")', function () {
        let bytes = new BinaryWriter().string("hello 🌍").finish();
        expect(bytes).toEqual(WireDataPlain.string_hello_world_emoji);
    });

    it('bytes(de ad be ef)', function () {
        let bytes = new BinaryWriter().bytes(new Uint8Array([0xde, 0xad, 0xbe, 0xef])).finish();
        expect(bytes).toEqual(WireDataPlain.bytes_deadbeef);
    });

    it('float(0.75)', function () {
        let bytes = new BinaryWriter().float(0.75).finish();
        expect(bytes).toEqual(WireDataPlain.float_0_75);
    });

    it('float(-0.75)', function () {
        let bytes = new BinaryWriter().float(-0.75).finish();
        expect(bytes).toEqual(WireDataPlain.float_minus_0_75);
    });

    it('double(0.75)', function () {
        let bytes = new BinaryWriter().double(0.75).finish();
        expect(bytes).toEqual(WireDataPlain.double_0_75);
    });

    it('double(-0.75)', function () {
        let bytes = new BinaryWriter().double(-0.75).finish();
        expect(bytes).toEqual(WireDataPlain.double_minus_0_75);
    });


});
