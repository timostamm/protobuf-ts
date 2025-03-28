import {
    BoolValue,
    BytesValue,
    DoubleValue,
    FloatValue,
    Int32Value,
    Int64Value,
    StringValue,
    UInt64Value
} from "../gen/google/protobuf/wrappers";
import {makeInt64Value, makeUInt64Value} from "./helpers";

// Copied from test-default/google.protobuf.wrappers.spec.ts. Do not edit.

describe('google.protobuf.BoolValue', function () {
    describe('toJson()', function () {
        it('should encode wrapped true value in JSON format as true', function () {
            let json = BoolValue.toJson({value: true});
            expect(json).toBe(true);
        });
        it('should encode wrapped false value in JSON format as false', function () {
            let json = BoolValue.toJson({value: true});
            expect(json).toBe(true);
        });
    });
    describe('fromJson()', function () {
        it('can read true', function () {
            expect(BoolValue.fromJson(true)).toEqual({
                value: true
            });
        });
        it('can read false', function () {
            expect(BoolValue.fromJson(false)).toEqual({
                value: false
            });
        });
    });
});


describe('google.protobuf.StringValue', function () {
    describe('toJson()', function () {
        it('should encode string value in JSON format as string', function () {
            let json = StringValue.toJson({value: "hello"});
            expect(json).toBe("hello");
        });
    });
    describe('fromJson()', function () {
        it('can read string value', function () {
            expect(StringValue.fromJson("hello")).toEqual({
                value: "hello"
            });
        });
    });
});


describe('google.protobuf.DoubleValue', function () {
    describe('toJson()', function () {
        it('should encode double value in JSON format as number', function () {
            let json = DoubleValue.toJson({value: 1.25});
            expect(json).toBe(1.25);
        });
    });
    describe('fromJson()', function () {
        it('can read number value', function () {
            expect(DoubleValue.fromJson(1.25)).toEqual({
                value: 1.25
            });
        });
    });
});


describe('google.protobuf.FloatValue', function () {
    describe('toJson()', function () {
        it('should encode float value in JSON format as number', function () {
            let json = FloatValue.toJson({value: 1.25});
            expect(json).toBe(1.25);
        });
    });
    describe('fromJson()', function () {
        it('can read number value', function () {
            expect(FloatValue.fromJson(1.25)).toEqual({
                value: 1.25
            });
        });
    });
});


describe('google.protobuf.Int32Value', function () {
    describe('toJson()', function () {
        it('should encode int32 value in JSON format as number', function () {
            let json = Int32Value.toJson({value: 123});
            expect(json).toBe(123);
        });
    });
    describe('fromJson()', function () {
        it('can read number value', function () {
            expect(Int32Value.fromJson(123)).toEqual({
                value: 123
            });
        });
    });
});


describe('google.protobuf.Int64Value', function () {
    describe('toJson()', function () {
        it('should encode int64 value in JSON format as string', function () {
            let json = Int64Value.toJson(
                makeInt64Value("9223372036854775807")
            );
            expect(json).toBe("9223372036854775807");
        });
    });
    describe('fromJson()', function () {
        it('can read string value', function () {
            let act = Int64Value.fromJson("9223372036854775807");
            let exp = makeInt64Value("9223372036854775807");
            expect(act).toEqual(exp);
        });
    });
});


describe('google.protobuf.UInt64Value', function () {
    describe('toJson()', function () {
        it('should encode int64 value in JSON format as string', function () {
            let json = UInt64Value.toJson(
                makeInt64Value("9223372036854775807")
            );
            expect(json).toBe("9223372036854775807");
        });
    });
    describe('fromJson()', function () {
        it('can read string value', function () {
            let act = UInt64Value.fromJson("9223372036854775807");
            let exp = makeUInt64Value("9223372036854775807");
            expect(act).toEqual(exp);
        });
    });
});


describe('google.protobuf.BytesValue', function () {
    describe('toJson()', function () {
        it('should encode string value in JSON format as string', function () {
            let json = BytesValue.toJson({
                value: new Uint8Array([104, 101, 108, 108, 111, 32, 240, 159, 140, 141])
            });
            expect(json).toBe("aGVsbG8g8J+MjQ==");
        });
    });
    describe('fromJson()', function () {
        it('can read string value', function () {
            expect(BytesValue.fromJson("aGVsbG8g8J+MjQ==")).toEqual({
                value: new Uint8Array([104, 101, 108, 108, 111, 32, 240, 159, 140, 141])
            });
        });
    });
});
