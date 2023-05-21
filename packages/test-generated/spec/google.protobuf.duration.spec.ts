import { Duration as Duration_Speed } from "../ts-out/speed/google/protobuf/duration";
import { Duration as Duration_Size } from "../ts-out/size/google/protobuf/duration";
import { Duration as Duration_SizeBigInt } from "../ts-out/size-bigint/google/protobuf/duration";
import { Duration as Duration_SpeedBigInt } from "../ts-out/speed-bigint/google/protobuf/duration";
import type { MessageType } from "@protobuf-ts/runtime";
import { makeDuration } from "./support/helpers";

interface MessageMap {
  speed: MessageType<Duration_Speed>;
  size: MessageType<Duration_Size>;
  speedBigInt: MessageType<Duration_SpeedBigInt>;
  sizeBigInt: MessageType<Duration_SizeBigInt>;
}

describe("google.protobuf.Duration", function () {
  const msgs: MessageMap = {
    speed: Duration_Speed,
    size: Duration_Size,
    sizeBigInt: Duration_SizeBigInt,
    speedBigInt: Duration_SpeedBigInt,
  };

  Object.entries(msgs).forEach(([name, messageType]) => {
    describe("toJson() " + name, function () {
      it('should encode 3 seconds and 0 nanoseconds in JSON format as "3s"', function () {
        const duration = makeDuration(3, messageType);
        let json = messageType.toJson(duration);
        expect(json).toEqual("3s");
      });

      it('should encode 3 seconds and 1 nanosecond in JSON format as "3.000000001s"', function () {
        const duration: typeof messageType = makeDuration(3, messageType);
        duration.nanos = 1;
        let json = messageType.toJson(duration);
        expect(json).toEqual("3.000000001s");
      });

      it('should encode 3 seconds and 1 microsecond in JSON format as "3.000001s"', function () {
        const duration: typeof messageType = makeDuration(3, messageType);
        duration.nanos = 1000;
        let json = messageType.toJson(duration);
        expect(json).toEqual("3.000001s");
      });
    });

    describe("fromJson() " + name, function () {
      it('can read "3s"', function () {
        const duration = makeDuration(3, messageType);
        expect(messageType.fromJson("3s")).toEqual(duration);
      });

      it('can read "3.000000001s"', function () {
        const duration: typeof messageType = makeDuration(3, messageType);
        duration.nanos = 1;
        expect(messageType.fromJson("3.000000001s")).toEqual(duration);
      });

      it('can read "3.000001s"', function () {
        const duration: typeof messageType = makeDuration(3, messageType);
        duration.nanos = 1000;
        expect(messageType.fromJson("3.000001s")).toEqual(duration);
      });
    });
  });
});
