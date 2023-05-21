import {
  BoolValue as BoolValue_Speed,
  BytesValue as BytesValue_Speed,
  DoubleValue as DoubleValue_Speed,
  FloatValue as FloatValue_Speed,
  Int32Value as Int32Value_Speed,
  Int64Value as Int64Value_Speed,
  StringValue as StringValue_Speed,
  UInt64Value as UInt64Value_Speed,
} from "../ts-out/speed/google/protobuf/wrappers";
import {
  BoolValue as BoolValue_Size,
  BytesValue as BytesValue_Size,
  DoubleValue as DoubleValue_Size,
  FloatValue as FloatValue_Size,
  Int32Value as Int32Value_Size,
  Int64Value as Int64Value_Size,
  StringValue as StringValue_Size,
  UInt64Value as UInt64Value_Size,
} from "../ts-out/size/google/protobuf/wrappers";
import {
  BoolValue as BoolValue_SpeedBigInt,
  BytesValue as BytesValue_SpeedBigInt,
  DoubleValue as DoubleValue_SpeedBigInt,
  FloatValue as FloatValue_SpeedBigInt,
  Int32Value as Int32Value_SpeedBigInt,
  Int64Value as Int64Value_SpeedBigInt,
  StringValue as StringValue_SpeedBigInt,
  UInt64Value as UInt64Value_SpeedBigInt,
} from "../ts-out/speed-bigint/google/protobuf/wrappers";
import {
  BoolValue as BoolValue_SizeBigInt,
  BytesValue as BytesValue_SizeBigInt,
  DoubleValue as DoubleValue_SizeBigInt,
  FloatValue as FloatValue_SizeBigInt,
  Int32Value as Int32Value_SizeBigInt,
  Int64Value as Int64Value_SizeBigInt,
  StringValue as StringValue_SizeBigInt,
  UInt64Value as UInt64Value_SizeBigInt,
} from "../ts-out/size-bigint/google/protobuf/wrappers";
import { makeInt64Value, makeUInt64Value } from "./support/helpers";
import type { MessageType } from "@protobuf-ts/runtime";

interface MessageMap {
  speed: {
    int64Value: MessageType<Int64Value_Speed>;
    uint64Value: MessageType<UInt64Value_Speed>;
    [x: string]: any;
  };
  size: {
    int64Value: MessageType<Int64Value_Size>;
    uint64Value: MessageType<UInt64Value_Size>;
    [x: string]: any;
  };
  speedBigInt: {
    int64Value: MessageType<Int64Value_SpeedBigInt>;
    uint64Value: MessageType<UInt64Value_SpeedBigInt>;
    [x: string]: any;
  };
  sizeBigInt: {
    int64Value: MessageType<Int64Value_SizeBigInt>;
    uint64Value: MessageType<UInt64Value_SizeBigInt>;
    [x: string]: any;
  };
}

const msgs: MessageMap = {
  speed: {
    boolValue: BoolValue_Speed,
    bytesValue: BytesValue_Speed,
    doubleValue: DoubleValue_Speed,
    floatValue: FloatValue_Speed,
    int32Value: Int32Value_Speed,
    int64Value: Int64Value_Speed,
    stringValue: StringValue_Speed,
    uint64Value: UInt64Value_Speed,
  },
  size: {
    boolValue: BoolValue_Size,
    bytesValue: BytesValue_Size,
    doubleValue: DoubleValue_Size,
    floatValue: FloatValue_Size,
    int32Value: Int32Value_Size,
    int64Value: Int64Value_Size,
    stringValue: StringValue_Size,
    uint64Value: UInt64Value_Size,
  },
  speedBigInt: {
    boolValue: BoolValue_SpeedBigInt,
    bytesValue: BytesValue_SpeedBigInt,
    doubleValue: DoubleValue_SpeedBigInt,
    floatValue: FloatValue_SpeedBigInt,
    int32Value: Int32Value_SpeedBigInt,
    int64Value: Int64Value_SpeedBigInt,
    stringValue: StringValue_SpeedBigInt,
    uint64Value: UInt64Value_SpeedBigInt,
  },
  sizeBigInt: {
    boolValue: BoolValue_SizeBigInt,
    bytesValue: BytesValue_SizeBigInt,
    doubleValue: DoubleValue_SizeBigInt,
    floatValue: FloatValue_SizeBigInt,
    int32Value: Int32Value_SizeBigInt,
    int64Value: Int64Value_SizeBigInt,
    stringValue: StringValue_SizeBigInt,
    uint64Value: UInt64Value_SizeBigInt,
  },
};

Object.entries(msgs).forEach(
  ([
    name,
    {
      boolValue,
      bytesValue,
      doubleValue,
      floatValue,
      int32Value,
      int64Value,
      stringValue,
      uint64Value,
    },
  ]) => {
    describe("google.protobuf.BoolValue " + name, function () {
      describe("toJson()", function () {
        it("should encode wrapped true value in JSON format as true", function () {
          let json = boolValue.toJson({ value: true });
          expect(json).toBe(true);
        });
        it("should encode wrapped false value in JSON format as false", function () {
          let json = boolValue.toJson({ value: true });
          expect(json).toBe(true);
        });
      });
      describe("fromJson()", function () {
        it("can read true", function () {
          expect(boolValue.fromJson(true)).toEqual({
            value: true,
          });
        });
        it("can read false", function () {
          expect(boolValue.fromJson(false)).toEqual({
            value: false,
          });
        });
      });
    });

    describe("google.protobuf.StringValue " + name, function () {
      describe("toJson()", function () {
        it("should encode string value in JSON format as string", function () {
          let json = stringValue.toJson({ value: "hello" });
          expect(json).toBe("hello");
        });
      });
      describe("fromJson()", function () {
        it("can read string value", function () {
          expect(stringValue.fromJson("hello")).toEqual({
            value: "hello",
          });
        });
      });
    });

    describe("google.protobuf.DoubleValue", function () {
      describe("toJson()", function () {
        it("should encode double value in JSON format as number", function () {
          let json = doubleValue.toJson({ value: 1.25 });
          expect(json).toBe(1.25);
        });
      });
      describe("fromJson()", function () {
        it("can read number value", function () {
          expect(doubleValue.fromJson(1.25)).toEqual({
            value: 1.25,
          });
        });
      });
    });

    describe("google.protobuf.FloatValue", function () {
      describe("toJson()", function () {
        it("should encode float value in JSON format as number", function () {
          let json = floatValue.toJson({ value: 1.25 });
          expect(json).toBe(1.25);
        });
      });
      describe("fromJson()", function () {
        it("can read number value", function () {
          expect(floatValue.fromJson(1.25)).toEqual({
            value: 1.25,
          });
        });
      });
    });

    describe("google.protobuf.Int32Value", function () {
      describe("toJson()", function () {
        it("should encode int32 value in JSON format as number", function () {
          let json = int32Value.toJson({ value: 123 });
          expect(json).toBe(123);
        });
      });
      describe("fromJson()", function () {
        it("can read number value", function () {
          expect(int32Value.fromJson(123)).toEqual({
            value: 123,
          });
        });
      });
    });

    describe("google.protobuf.Int64Value", function () {
      describe("toJson()", function () {
        it("should encode int64 value in JSON format as string", function () {
          let json = int64Value.toJson(
            makeInt64Value("9223372036854775807", int64Value)
          );
          expect(json).toBe("9223372036854775807");
        });
      });
      describe("fromJson()", function () {
        it("can read string value", function () {
          let act = int64Value.fromJson("9223372036854775807");
          let exp = makeInt64Value("9223372036854775807", int64Value);
          expect(act).toEqual(exp);
        });
      });
    });

    describe("google.protobuf.UInt64Value", function () {
      describe("toJson()", function () {
        it("should encode int64 value in JSON format as string", function () {
          let json = uint64Value.toJson(
            makeUInt64Value("9223372036854775807", uint64Value)
          );
          expect(json).toBe("9223372036854775807");
        });
      });
      describe("fromJson()", function () {
        it("can read string value", function () {
          let act = uint64Value.fromJson("9223372036854775807");
          let exp = makeUInt64Value("9223372036854775807", uint64Value);
          expect(act).toEqual(exp);
        });
      });
    });

    describe("google.protobuf.BytesValue " + name, function () {
      describe("toJson()", function () {
        it("should encode string value in JSON format as string", function () {
          let json = bytesValue.toJson({
            value: new Uint8Array([
              104, 101, 108, 108, 111, 32, 240, 159, 140, 141,
            ]),
          });
          expect(json).toBe("aGVsbG8g8J+MjQ==");
        });
      });
      describe("fromJson()", function () {
        it("can read string value", function () {
          expect(bytesValue.fromJson("aGVsbG8g8J+MjQ==")).toEqual({
            value: new Uint8Array([
              104, 101, 108, 108, 111, 32, 240, 159, 140, 141,
            ]),
          });
        });
      });
    });
  }
);
