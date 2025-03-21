import {assert, LongType, PbLong, PbULong} from "@protobuf-ts/runtime";
import {Duration} from "../gen/google/protobuf/duration";
import {Timestamp} from "../gen/google/protobuf/timestamp";
import {Int64Value, UInt64Value} from "../gen/google/protobuf/wrappers";

// Copied from test-default/helpers.ts. Do not edit.

export function makeInt64Value(value: number | string): Int64Value {
    let valueField = Int64Value.fields.find(f => f.name === "value");
    assert(valueField);
    assert(valueField.kind === "scalar");

    let longValue = PbLong.from(value);
    let localValue = longToLocal(longValue, valueField.L);

    return {
        value: localValue
    };
}

export function makeUInt64Value(value: number | string): UInt64Value {
    let valueField = UInt64Value.fields.find(f => f.name === "value");
    assert(valueField);
    assert(valueField.kind === "scalar");

    let longValue = PbULong.from(value);
    let localValue = longToLocal(longValue, valueField.L);

    return {
        value: localValue
    };
}


export function makeDuration(seconds: number): Duration {
    let secondsField = Duration.fields.find(f => f.name === "seconds");
    assert(secondsField);
    assert(secondsField.kind === "scalar");

    let longSeconds = PbLong.from(seconds);
    let secondsValue = longToLocal(longSeconds, secondsField.L);

    return Duration.create({
        seconds: secondsValue,
        nanos: 0,
    })
}


export function makeTimestamp(unixEpoch: number, nanos = 0): Timestamp {
    let secondsField = Timestamp.fields.find(f => f.name === "seconds");
    assert(secondsField);
    assert(secondsField.kind === "scalar");

    let longSeconds = PbLong.from(unixEpoch);
    let secondsValue = longToLocal(longSeconds, secondsField.L);

    return Timestamp.create({
        seconds: secondsValue,
        nanos: nanos,
    })
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
