import { Empty as Empty_Speed } from "../ts-out/speed/google/protobuf/empty";
import { Empty as Empty_Size } from "../ts-out/size/google/protobuf/empty";
import { Empty as Empty_SpeedBigInt } from "../ts-out/speed-bigint/google/protobuf/empty";
import { Empty as Empty_SizeBigInt } from "../ts-out/size-bigint/google/protobuf/empty";
import type { JsonValue } from "@protobuf-ts/runtime";

const msgs = {
  speed: Empty_Speed,
  size: Empty_Size,
  speedBigInt: Empty_SpeedBigInt,
  sizeBigInt: Empty_SizeBigInt,
};

Object.entries(msgs).forEach(([name, messageType]) => {
  describe("google.protobuf.Empty " + name, function () {
    let fixMessage = messageType.create();

    let fixJson: JsonValue = {};

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
      let e = messageType.fromJson(fixJson);
      expect(e).toEqual(fixMessage);
    });

    it("fromJsonString() parses to expected message", function () {
      let e = messageType.fromJsonString(fixJsonString);
      expect(e).toEqual(fixMessage);
    });

    it("create() creates expected empty message", function () {
      let e = messageType.create();
      expect(e).toEqual({});
    });

    it("clone() creates exact copy", function () {
      let e = messageType.clone(fixMessage);
      expect(e).toEqual(fixMessage);
    });

    it("survives binary round-trip", function () {
      let bin = messageType.toBinary(fixMessage);
      let e = messageType.fromBinary(bin);
      expect(e).toEqual(fixMessage);
    });

    it("survives JSON round-trip", function () {
      let json = messageType.toJsonString(fixMessage);
      let e = messageType.fromJsonString(json);
      expect(e).toEqual(fixMessage);
    });
  });
});
