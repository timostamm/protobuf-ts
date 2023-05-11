import { assert, LongType, PbLong, PbULong } from "@protobuf-ts/runtime";
import { Duration } from "../../ts-out/speed/google/protobuf/duration";
import { Timestamp } from "../../ts-out/speed/google/protobuf/timestamp";
import {
  Int64Value,
  UInt64Value,
} from "../../ts-out/speed/google/protobuf/wrappers";

export function describeMT<T>(
  name: string,
  opt: {
    speed: T;
    size: T;
    speedBigInt: T;
    sizeBigInt: T;
  },
  fn: (type: T) => void
) {
  [
    {
      genType: "(speed)",
      messageType: opt.speed,
    },
    {
      genType: "(size)",
      messageType: opt.size,
    },
    {
      genType: "(speed/bigint)",
      messageType: opt.speedBigInt,
    },
    {
      genType: "(size/bigint)",
      messageType: opt.sizeBigInt,
    },
  ].forEach(({ genType, messageType }) => {
    describe(`${genType} ${name}`, () => {
      fn(messageType);
    });
  });
}

export function makeInt64Value(value: number | string): Int64Value {
  let valueField = Int64Value.fields.find((f) => f.name === "value");
  assert(valueField);
  assert(valueField.kind === "scalar");

  let longValue = PbLong.from(value);
  let localValue = longToLocal(longValue, valueField.L);

  return {
    value: localValue,
  };
}

export function makeUInt64Value(value: number | string): UInt64Value {
  let valueField = UInt64Value.fields.find((f) => f.name === "value");
  assert(valueField);
  assert(valueField.kind === "scalar");

  let longValue = PbULong.from(value);
  let localValue = longToLocal(longValue, valueField.L);

  return {
    value: localValue,
  };
}

export function makeDuration(seconds: number): Duration {
  let secondsField = Duration.fields.find((f) => f.name === "seconds");
  assert(secondsField);
  assert(secondsField.kind === "scalar");

  let longSeconds = PbLong.from(seconds);
  let secondsValue = longToLocal(longSeconds, secondsField.L);

  return Duration.create({
    seconds: secondsValue,
    nanos: 0,
  });
}

export function makeTimestamp(unixEpoch: number, nanos = 0): Timestamp {
  let secondsField = Timestamp.fields.find((f) => f.name === "seconds");
  assert(secondsField);
  assert(secondsField.kind === "scalar");

  let longSeconds = PbLong.from(unixEpoch);
  let secondsValue = longToLocal(longSeconds, secondsField.L);

  return Timestamp.create({
    seconds: secondsValue,
    nanos: nanos,
  });
}

function longToLocal(long: PbLong | PbULong, local: LongType | undefined): any {
  switch (local) {
    case LongType.NUMBER:
      return long.toNumber();
    case LongType.BIGINT:
      return long.toBigInt();
    default:
      return long.toString();
  }
}

/**
 * Runs a describe.each() with three test cases:
 * 1. the TS generated MessageType
 * 2. the JS generated MessageType
 * 3. a dynamic version of the MessageType
 */
// export function describeMT<MessageType<T>>(
//   opt: {
//     ts: MessageType<T>;
//     js: MessageType<T>;
//   },
//   fn: (type: MessageType<T>) => void
// ) {
//   const tsDynType = makeMessageTypeDynamic(opt.ts);
//   type testCase = { name: string; messageType: MessageType<T> };
//   describe.each<testCase>([
//     { name: opt.ts.typeName + " (generated ts)", messageType: opt.ts },
//     { name: opt.js.typeName + " (generated js)", messageType: opt.js },
//     { name: tsDynType.typeName + " (dynamic)", messageType: tsDynType },
//   ])("$name", function (testCase: testCase) {
//     fn(testCase.messageType);
//   });
// }
