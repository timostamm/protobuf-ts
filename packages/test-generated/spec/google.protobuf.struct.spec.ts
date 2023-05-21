import { NullValue } from "../ts-out/speed/google/protobuf/struct";
import { Struct as Struct_Speed } from "../ts-out/speed/google/protobuf/struct";
import { Struct as Struct_Size } from "../ts-out/size/google/protobuf/struct";
import { Struct as Struct_SpeedBigInt } from "../ts-out/speed-bigint/google/protobuf/struct";
import { Struct as Struct_SizeBigInt } from "../ts-out/size-bigint/google/protobuf/struct";
import type { JsonObject } from "@protobuf-ts/runtime";

const msgs = {
  speed: Struct_Speed,
  size: Struct_Size,
  speedBigInt: Struct_SpeedBigInt,
  sizeBigInt: Struct_SizeBigInt,
};

Object.entries(msgs).forEach(([name, messageType]) => {
  describe("google.protobuf.Struct " + name, function () {
    let fixMessage = messageType.create({
      fields: {
        bool: { kind: { oneofKind: "boolValue", boolValue: true } },
        null: {
          kind: { oneofKind: "nullValue", nullValue: NullValue.NULL_VALUE },
        },
        string: { kind: { oneofKind: "stringValue", stringValue: "a string" } },
        number: { kind: { oneofKind: "numberValue", numberValue: 123 } },
        list: {
          kind: {
            oneofKind: "listValue",
            listValue: {
              values: [
                { kind: { oneofKind: "boolValue", boolValue: true } },
                {
                  kind: {
                    oneofKind: "nullValue",
                    nullValue: NullValue.NULL_VALUE,
                  },
                },
                { kind: { oneofKind: "stringValue", stringValue: "a string" } },
                { kind: { oneofKind: "numberValue", numberValue: 123 } },
              ],
            },
          },
        },
        struct: {
          kind: {
            oneofKind: "structValue",
            structValue: {
              fields: {
                bool: { kind: { oneofKind: "boolValue", boolValue: true } },
                null: {
                  kind: {
                    oneofKind: "nullValue",
                    nullValue: NullValue.NULL_VALUE,
                  },
                },
                string: {
                  kind: { oneofKind: "stringValue", stringValue: "a string" },
                },
                number: {
                  kind: { oneofKind: "numberValue", numberValue: 123 },
                },
              },
            },
          },
        },
      },
    });

    let fixJson: JsonObject = {
      bool: true,
      null: null,
      string: "a string",
      number: 123,
      list: [true, null, "a string", 123],
      struct: {
        bool: true,
        null: null,
        string: "a string",
        number: 123,
      },
    };

    let fixJsonString = JSON.stringify(fixJson);

    it("toJson() creates expected JSON", function () {
      let json = messageType.toJson(fixMessage);
      expect(json).toEqual(fixJson);
    });

    it("toJsonString() creates expected JSON", function () {
      let json = messageType.toJsonString(fixMessage);
      expect(json).toEqual(fixJsonString);
    });

    it("fromJson() parses to expected message", function () {
      let struct = messageType.fromJson(fixJson);
      expect(struct).toEqual(fixMessage);
    });

    it("fromJsonString() parses to expected message", function () {
      let struct = messageType.fromJsonString(fixJsonString);
      expect(struct).toEqual(fixMessage);
    });

    it("create() creates expected empty message", function () {
      let struct = messageType.create();
      expect(struct).toEqual({
        fields: {},
      });
    });

    it("clone() creates exact copy", function () {
      let struct = messageType.clone(fixMessage);
      expect(struct).toEqual(fixMessage);
    });

    it("survives binary round-trip", function () {
      let bin = messageType.toBinary(fixMessage);
      let struct = messageType.fromBinary(bin);
      expect(struct).toEqual(fixMessage);
    });

    it("survives JSON round-trip", function () {
      let json = messageType.toJsonString(fixMessage);
      let struct = messageType.fromJsonString(json);
      expect(struct).toEqual(fixMessage);
    });
  });
});
