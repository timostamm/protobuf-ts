import { Any as Any_Speed } from "../ts-out/speed/google/protobuf/any";
import { Any as Any_Size } from "../ts-out/size/google/protobuf/any";
import { Any as Any_SpeedBigInt } from "../ts-out/speed-bigint/google/protobuf/any";
import { Any as Any_SizeBigInt } from "../ts-out/size-bigint/google/protobuf/any";
import { StructMessage } from "../ts-out/speed/wkt-struct";
import { Duration } from "../ts-out/speed/google/protobuf/duration";
import type { JsonObject } from "@protobuf-ts/runtime";
import { makeDuration } from "./support/helpers";
import { ScalarValuesMessage } from "../ts-out/speed/msg-scalar";

describe("google.protobuf.Any", function () {
  const msgs = {
    speed: Any_Speed,
    size: Any_Size,
    speedBigInt: Any_SpeedBigInt,
    sizeBigInt: Any_SizeBigInt,
  };

  let scalarMsg: ScalarValuesMessage = ScalarValuesMessage.create({
    doubleField: 0.5,
    stringField: "hello",
    boolField: true,
  });

  Object.entries(msgs).forEach(([name, messageType]) => {
    describe("pack() " + name, function () {
      let scalarMsgAny = messageType.pack(scalarMsg, ScalarValuesMessage);

      it("sets expected typeUrl", function () {
        expect(scalarMsgAny.typeUrl).toEqual(
          "type.googleapis.com/spec.ScalarValuesMessage"
        );
      });

      it("sets expected bytes value", function () {
        expect(scalarMsgAny.value).toEqual(
          ScalarValuesMessage.toBinary(scalarMsg)
        );
      });
    });

    describe("contains() " + name, function () {
      let scalarMsgAny = messageType.pack(scalarMsg, ScalarValuesMessage);

      it("returns false for empty Any", function () {
        expect(messageType.contains(messageType.create(), "")).toBeFalse();
      });

      it("returns false for wrong type name", function () {
        expect(messageType.contains(scalarMsgAny, ".other.Type")).toBeFalse();
      });

      it("returns false for wrong message Type", function () {
        expect(messageType.contains(scalarMsgAny, StructMessage)).toBeFalse();
      });

      it("returns true for correct type name", function () {
        expect(
          messageType.contains(scalarMsgAny, "spec.ScalarValuesMessage")
        ).toBeTrue();
      });

      it("returns true for correct message type", function () {
        expect(
          messageType.contains(scalarMsgAny, ScalarValuesMessage)
        ).toBeTrue();
      });
    });

    describe("unpack() " + name, function () {
      let scalarMsgAny = messageType.pack(scalarMsg, ScalarValuesMessage);

      it("unpacks", function () {
        let msg = messageType.unpack(scalarMsgAny, ScalarValuesMessage);
        expect(ScalarValuesMessage.is(msg)).toBeTrue();
        expect(msg).toEqual(scalarMsg);
      });

      it("with wrong message type throws", function () {
        expect(() =>
          messageType.unpack(scalarMsgAny, StructMessage)
        ).toThrowError(
          "Cannot unpack google.protobuf.Any with typeUrl 'type.googleapis.com/spec.ScalarValuesMessage' as spec.StructMessage."
        );
      });
    });

    describe("toJson() " + name, function () {
      let scalarMsgAny = messageType.pack(scalarMsg, ScalarValuesMessage);

      it("throws without type registry", function () {
        expect(() => messageType.toJson(scalarMsgAny)).toThrow();
      });

      it("throws when type not in registry", function () {
        expect(() =>
          messageType.toJson(scalarMsgAny, { typeRegistry: [StructMessage] })
        ).toThrow();
      });

      it("creates expected JSON", function () {
        let registry = [StructMessage, ScalarValuesMessage];
        let json = messageType.toJson(scalarMsgAny, { typeRegistry: registry });
        expect(json).toEqual({
          "@type": "type.googleapis.com/spec.ScalarValuesMessage",
          doubleField: 0.5,
          stringField: "hello",
          boolField: true,
        });
      });

      it('puts specialized JSON representation into the "value" property', function () {
        let duration = makeDuration(1, Duration);
        let durationAny = messageType.pack(duration, Duration);
        let json = messageType.toJson(durationAny, {
          typeRegistry: [Duration],
        });
        expect(json).toEqual({
          "@type": "type.googleapis.com/google.protobuf.Duration",
          value: "1s",
        });
      });

      it("empty Any toJson() creates JSON {}", function () {
        let any = messageType.create();
        let json = messageType.toJson(any);
        expect(json).toEqual({});
      });
    });

    describe("fromJson() " + name, function () {
      let scalarMsgAnyJson: JsonObject = {
        "@type": "type.googleapis.com/spec.ScalarValuesMessage",
        doubleField: 0.5,
        stringField: "hello",
        boolField: true,
      };

      it("throws without type registry", function () {
        expect(() => messageType.fromJson(scalarMsgAnyJson)).toThrow();
      });

      it("throws when type not in registry", function () {
        expect(() =>
          messageType.fromJson(scalarMsgAnyJson, {
            typeRegistry: [StructMessage],
          })
        ).toThrow();
      });

      it("can read JSON", function () {
        let registry = [StructMessage, ScalarValuesMessage];
        let scalarMsgAny = messageType.fromJson(scalarMsgAnyJson, {
          typeRegistry: registry,
        });
        expect(scalarMsgAny).toEqual(
          messageType.pack(scalarMsg, ScalarValuesMessage)
        );
      });

      it("can read specialized JSON", function () {
        let duration = makeDuration(1, Duration);
        let durationAny = messageType.pack(duration, Duration);
        let durationAnyJson: JsonObject = {
          "@type": "type.googleapis.com/google.protobuf.Duration",
          value: "1s",
        };
        let read = messageType.fromJson(durationAnyJson, {
          typeRegistry: [Duration],
        });
        expect(read).toEqual(durationAny);
      });
    });
  });
});
