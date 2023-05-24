import type { UnknownMessage } from "@protobuf-ts/runtime";
import {
  normalizeFieldInfo,
  reflectionEquals,
  ScalarType,
} from "@protobuf-ts/runtime";
import { EnumFieldMessage as EnumFieldMessage_Speed } from "../ts-out/speed/msg-enum";
import { EnumFieldMessage as EnumFieldMessage_Size } from "../ts-out/size/msg-enum";
import { EnumFieldMessage as EnumFieldMessage_SpeedBigInt } from "../ts-out/speed-bigint/msg-enum";
import { EnumFieldMessage as EnumFieldMessage_SizeBigInt } from "../ts-out/size-bigint/msg-enum";
import { OneofScalarMemberMessage as OneofScalarMemberMessage_Speed } from "../ts-out/speed/msg-oneofs";
import { OneofScalarMemberMessage as OneofScalarMemberMessage_Size } from "../ts-out/size/msg-oneofs";
import { OneofScalarMemberMessage as OneofScalarMemberMessage_SpeedBigInt } from "../ts-out/speed-bigint/msg-oneofs";
import { OneofScalarMemberMessage as OneofScalarMemberMessage_SizeBigInt } from "../ts-out/size-bigint/msg-oneofs";

enum TestEnum {
  A = 0,
  B = 1,
  C = 2,
}

describe("reflectionEquals()", function () {
  beforeEach(function () {
    jasmine.addCustomEqualityTester((a, b) =>
      a instanceof Uint8Array && b instanceof Uint8Array
        ? a.byteLength === b.byteLength
        : undefined
    );
  });

  it("should return true for same instance", function () {
    let eq = reflectionEquals(
      { typeName: "test", fields: [], options: {} },
      {},
      {}
    );
    expect(eq).toBeTrue();
  });

  it("should return true for undefined, undefined", function () {
    let eq = reflectionEquals(
      { typeName: "test", fields: [], options: {} },
      undefined,
      undefined
    );
    expect(eq).toBeTrue();
  });

  it("should return false for message, undefined", function () {
    let eq = reflectionEquals(
      { typeName: "test", fields: [], options: {} },
      {},
      undefined
    );
    expect(eq).toBeFalse();
  });

  it("should return false for different scalar field value", function () {
    let eq = reflectionEquals(
      {
        typeName: "test",
        fields: [
          normalizeFieldInfo({
            no: 1,
            name: "value",
            kind: "scalar",
            T: ScalarType.INT32,
          }),
          normalizeFieldInfo({
            no: 2,
            name: "unit",
            kind: "enum",
            T: () => ["spec.TestEnum", TestEnum],
          }),
        ],
        options: {},
      },
      {
        unit: 1,
        value: 429,
      },
      {
        unit: 1,
        value: 458,
      }
    );
    expect(eq).toBeFalse();
  });

  it("should ignore excess properties", function () {
    let info = { typeName: "test", fields: [], options: {} };
    let eq = reflectionEquals(info, { x: 123 }, {});
    expect(eq).toBeTrue();
  });

  it("should detect non-equal bytes fields", function () {
    let info = {
      typeName: "test",
      fields: [
        normalizeFieldInfo({
          no: 1,
          name: "bytes",
          kind: "scalar",
          T: ScalarType.BYTES,
        }),
      ],
      options: {},
    };
    let a = { bytes: new Uint8Array([1, 2, 3]) };
    let b = { bytes: new Uint8Array([4, 5, 6]) };
    let c = { bytes: new Uint8Array([1, 2, 3]) };
    expect(reflectionEquals(info, a, b)).toBeFalse();
    expect(reflectionEquals(info, a, c)).toBeTrue();
  });

  // Note that we can't test generated code that uses int64
  // (for example, ScalarMapsMessage) since the int64 fields may be generated
  // as bigint, number, or string, depending on plugin options and field
  // option JS_TYPE.
  // We should cover all three cases explicitly, but we currently cannot,
  // because the same tests are run on different generated code.
});

describe("OneofScalarMemberMessage", () => {
  const msgs = {
    speed: OneofScalarMemberMessage_Speed,
    size: OneofScalarMemberMessage_Size,
    speedBigInt: OneofScalarMemberMessage_SpeedBigInt,
    sizeBigInt: OneofScalarMemberMessage_SizeBigInt,
  };
  Object.entries(msgs).forEach(([name, oneofScalarMemberMessage]) => {
    it("oneof scalars are equal " + name, () => {
      const msg = oneofScalarMemberMessage.create({
        result: {
          oneofKind: "value",
          value: 42,
        },
      });
      const eq = reflectionEquals(
        oneofScalarMemberMessage,
        msg as unknown as UnknownMessage,
        msg as unknown as UnknownMessage
      );
      expect(eq).toBeTrue();
    });
  });
});

describe("EnumFieldMessage", () => {
  const enumFieldMessages = {
    speed: EnumFieldMessage_Speed,
    size: EnumFieldMessage_Size,
    speedBigInt: EnumFieldMessage_SpeedBigInt,
    sizeBigInt: EnumFieldMessage_SizeBigInt,
  };
  Object.entries(enumFieldMessages).forEach(([name, enumFieldMessage]) => {
    it("enum messages are equal " + name, () => {
      const msg = enumFieldMessage.create({
        enumField: 1,
        repeatedEnumField: [0, 1, 2],
        aliasEnumField: 1,
        prefixEnumField: 2,
      });

      const eq = reflectionEquals(
        enumFieldMessage,
        msg as unknown as UnknownMessage,
        msg as unknown as UnknownMessage
      );
      expect(eq).toBeTrue();
    });
  });
});
