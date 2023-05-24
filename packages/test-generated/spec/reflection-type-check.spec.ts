import {
  assert,
  isOneofGroup,
  normalizeFieldInfo,
  ReflectionTypeCheck,
  ScalarType,
  UnknownMessage,
} from "@protobuf-ts/runtime";
import {
  RepeatedScalarValuesMessage as RepeatedScalarValuesMessage_Speed,
  ScalarValuesMessage as ScalarValuesMessage_Speed,
} from "../ts-out/speed/msg-scalar";
import {
  RepeatedScalarValuesMessage as RepeatedScalarValuesMessage_Size,
  ScalarValuesMessage as ScalarValuesMessage_Size,
} from "../ts-out/size/msg-scalar";
import {
  RepeatedScalarValuesMessage as RepeatedScalarValuesMessage_SpeedBigInt,
  ScalarValuesMessage as ScalarValuesMessage_SpeedBigInt,
} from "../ts-out/speed-bigint/msg-scalar";
import {
  RepeatedScalarValuesMessage as RepeatedScalarValuesMessage_SizeBigInt,
  ScalarValuesMessage as ScalarValuesMessage_SizeBigInt,
} from "../ts-out/size-bigint/msg-scalar";
import { OneofScalarMemberMessage as OneofScalarMemberMessage_Speed } from "../ts-out/speed/msg-oneofs";
import { OneofScalarMemberMessage as OneofScalarMemberMessage_Size } from "../ts-out/size/msg-oneofs";
import { OneofScalarMemberMessage as OneofScalarMemberMessage_SpeedBigInt } from "../ts-out/speed-bigint/msg-oneofs";
import { OneofScalarMemberMessage as OneofScalarMemberMessage_SizeBigInt } from "../ts-out/size-bigint/msg-oneofs";

const msgs = {
  speed: {
    repeatedScalarValuesMessage: RepeatedScalarValuesMessage_Speed,
    scalarValuesMessage: ScalarValuesMessage_Speed,
    oneofScalarMemberMessage: OneofScalarMemberMessage_Speed,
  },
  size: {
    repeatedScalarValuesMessage: RepeatedScalarValuesMessage_Size,
    scalarValuesMessage: ScalarValuesMessage_Size,
    oneofScalarMemberMessage: OneofScalarMemberMessage_Size,
  },
  speedBigInt: {
    repeatedScalarValuesMessage: RepeatedScalarValuesMessage_SpeedBigInt,
    scalarValuesMessage: ScalarValuesMessage_SpeedBigInt,
    oneofScalarMemberMessage: OneofScalarMemberMessage_SpeedBigInt,
  },
  sizeBigInt: {
    repeatedScalarValuesMessage: RepeatedScalarValuesMessage_SizeBigInt,
    scalarValuesMessage: ScalarValuesMessage_SizeBigInt,
    oneofScalarMemberMessage: OneofScalarMemberMessage_SizeBigInt,
  },
};

Object.entries(msgs).forEach(
  ([
    name,
    {
      repeatedScalarValuesMessage,
      scalarValuesMessage,
      oneofScalarMemberMessage,
    },
  ]) => {
    describe("ReflectionTypeCheck.is() " + name, function () {
      it("oneof scalars type check correctly", () => {
        const mi = {
          typeName: oneofScalarMemberMessage.typeName,
          fields: oneofScalarMemberMessage.fields.map(normalizeFieldInfo),
          options: {},
        };
        const msg = {
          result: {
            oneofKind: "value",
            value: 42,
          },
        } as UnknownMessage;
        let check = new ReflectionTypeCheck(mi);
        let is = check.is(msg, 16, false);
        expect(is).toBe(true);
      });

      describe("check() with depth < 0", function () {
        it("always returns true", function () {
          let check = new ReflectionTypeCheck({ typeName: "fake", fields: [] });
          let is = check.is("not a message", -1, false);
          expect(is).toBeTrue();
        });
      });

      describe("with a depth of 0", function () {
        it("checks if an object is passed", function () {
          let check = new ReflectionTypeCheck({
            typeName: "fake",
            fields: [
              normalizeFieldInfo({
                no: 1,
                name: "field",
                kind: "scalar",
                T: ScalarType.BOOL,
              }),
            ],
          });
          expect(check.is(false, 0, false)).toBe(false);
          expect(check.is(undefined, 0, false)).toBe(false);
          expect(check.is(null, 0, false)).toBe(false);
        });

        describe("scalar values message", () => {
          const mi = {
            typeName: scalarValuesMessage.typeName,
            fields: scalarValuesMessage.fields.map(normalizeFieldInfo),
            options: {},
          };
          let m = {
            doubleField: 0,
            floatField: 0,
            int32Field: 0,
            fixed32Field: 0,
            boolField: false,
            stringField: "",
            bytesField: new Uint8Array(0),
            uint32Field: 0,
            sfixed32Field: 0,
            sint32Field: 0,
          } as UnknownMessage;

          it("detects missing field", function () {
            let check = new ReflectionTypeCheck(mi);
            delete m["doubleField"];
            let is = check.is(m, 0, false);
            expect(is).toBe(false);
          });
        });
      });

      describe("with a depth of 1", function () {
        const depth = 1;

        describe("oneof scalar member messages", () => {
          const mi = {
            typeName: oneofScalarMemberMessage.typeName,
            fields: oneofScalarMemberMessage.fields.map(normalizeFieldInfo),
            options: {},
          };
          it("checks oneof group structure", function () {
            let check = new ReflectionTypeCheck(mi);
            let m = { result: { oneofKind: "error", error: "hello" } };
            assert(isOneofGroup(m.result));
            m.result.oneofKind = "xxx";
            let is = check.is(m, depth, false);
            expect(is).toBe(false);
          });
          it("checks oneof member type", function () {
            let check = new ReflectionTypeCheck(mi);
            let m = {
              result: { oneofKind: "error", error: "hello" },
            } as UnknownMessage;
            assert(isOneofGroup(m.result));
            m.result.error = 123;
            let is = check.is(m, depth, false);
            expect(is).toBe(false);
          });
          it("checks oneof discriminator", function () {
            let check = new ReflectionTypeCheck(mi);
            let m = {
              result: { oneofKind: "error", error: "hello" },
            } as UnknownMessage;
            assert(isOneofGroup(m.result));
            m.result = {
              oneofKind: "wrong",
              wrong: 123,
            };
            let is = check.is(m, depth, false);
            expect(is).toBe(false);
          });
        });

        it("checks repeated is array", function () {
          const mi = {
            typeName: repeatedScalarValuesMessage.typeName,
            fields: repeatedScalarValuesMessage.fields.map(normalizeFieldInfo),
            options: {},
          };
          const m = {
            doubleField: [0.75, 0, 1],
            floatField: [0.75, -0.75],
            int64Field: ["-1", "-2"],
            uint64Field: ["1", "2"],
            int32Field: [-123, 500],
            fixed64Field: ["1", "99"],
            fixed32Field: [123, 999],
            boolField: [true, false, true],
            stringField: ["hello", "world"],
            bytesField: [
              new Uint8Array([
                104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100,
              ]),
            ],
            uint32Field: [123, 123],
            sfixed32Field: [-123, -123, -123],
            sfixed64Field: ["-1", "-2", "100"],
            sint32Field: [-1, -2, 999],
            sint64Field: ["-1", "-99", "99"],
          } as UnknownMessage;

          let check = new ReflectionTypeCheck(mi);
          m.doubleField = "str";

          let is = check.is(m, depth, false);
          expect(is).toBe(false);

          m.doubleField = ["str"];
          is = check.is(m, depth, false);
          expect(is).toBe(true);
        });
      });

      describe("with simple string field", function () {
        let check = new ReflectionTypeCheck({
          typeName: ".test.TestMessage",
          fields: [
            normalizeFieldInfo({
              kind: "scalar",
              T: ScalarType.STRING,
              no: 1,
              name: "field",
            }),
          ],
        });

        const checkAssignable = (arg: any) => check.is(arg, 16, true);
        const checkLiteral = (arg: any) => check.is(arg, 16, false);

        it("requires property", () => {
          const is = checkLiteral({});
          expect(is).toBeFalse();
        });

        it("requires scalar value type", () => {
          const is = checkLiteral({ field: 123 });
          expect(is).toBeFalse();
        });

        it("recognizes scalar value", () => {
          const is = checkLiteral({ field: "hello" });
          expect(is).toBeTrue();
        });

        it("ignores unknown property", () => {
          const is = checkAssignable({ field: "string", extra: 123 });
          expect(is).toBeTrue();
        });

        it("checkLiteral() rejects unknown property", () => {
          const is = checkLiteral({ field: "string", extra: 123 });
          expect(is).toBeFalse();
        });
      });
    });
  }
);
