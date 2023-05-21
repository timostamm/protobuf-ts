import {
  assert,
  LongType,
  MessageType,
  PartialMessage,
  PbLong,
  PbULong,
} from "@protobuf-ts/runtime";

export function makeInt64Value<T extends object>(
  value: number | string,
  msg: MessageType<T>
): T {
  let valueField = msg.fields.find((f) => f.name === "value");
  assert(valueField);
  assert(valueField.kind === "scalar");

  let longValue = PbLong.from(value);
  let localValue = longToLocal(longValue, valueField.L);

  const val = {
    value: localValue,
  } as PartialMessage<T>;

  return msg.create(val);
}

export function makeUInt64Value<T extends object>(
  value: number | string,
  msg: MessageType<T>
): T {
  let valueField = msg.fields.find((f) => f.name === "value");
  assert(valueField);
  assert(valueField.kind === "scalar");

  let longValue = PbULong.from(value);
  let localValue = longToLocal(longValue, valueField.L);

  const val = {
    value: localValue,
  } as PartialMessage<T>;

  return msg.create(val);
}

export function makeDuration<T extends object>(
  seconds: number,
  msg: MessageType<T>
): T {
  let secondsField = msg.fields.find((f) => f.name === "seconds");
  assert(secondsField);
  assert(secondsField.kind === "scalar");

  let longSeconds = PbLong.from(seconds);
  let secondsValue = longToLocal(longSeconds, secondsField.L);

  const val = {
    seconds: secondsValue,
    nanos: 0,
  } as PartialMessage<T>;

  return msg.create(val);
}

export function makeTimestamp<T extends object>(
  unixEpoch: number,
  msg: MessageType<T>,
  nanos = 0
): T {
  let secondsField = msg.fields.find((f) => f.name === "seconds");
  assert(secondsField);
  assert(secondsField.kind === "scalar");

  let longSeconds = PbLong.from(unixEpoch);
  let secondsValue = longToLocal(longSeconds, secondsField.L);

  const val = {
    seconds: secondsValue,
    nanos: nanos,
  } as PartialMessage<T>;

  return msg.create(val);
}

export function longToLocal(
  long: PbLong | PbULong,
  local: LongType | undefined
): any {
  switch (local) {
    case LongType.NUMBER:
      return long.toNumber();
    case LongType.BIGINT:
      return long.toBigInt();
    default:
      return long.toString();
  }
}
