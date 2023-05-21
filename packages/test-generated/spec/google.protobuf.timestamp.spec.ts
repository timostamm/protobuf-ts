import { Timestamp as Timestamp_Speed } from "../ts-out/speed/google/protobuf/timestamp";
import { Timestamp as Timestamp_Size } from "../ts-out/size/google/protobuf/timestamp";
import { Timestamp as Timestamp_SpeedBigInt } from "../ts-out/speed-bigint/google/protobuf/timestamp";
import { Timestamp as Timestamp_SizeBigInt } from "../ts-out/size-bigint/google/protobuf/timestamp";
import { makeTimestamp } from "./support/helpers";
import { PbLong } from "@protobuf-ts/runtime";
import type { MessageType } from "@protobuf-ts/runtime";

interface MessageMap {
  speed: MessageType<Timestamp_Speed>;
  size: MessageType<Timestamp_Size>;
  speedBigInt: MessageType<Timestamp_SpeedBigInt>;
  sizeBigInt: MessageType<Timestamp_SizeBigInt>;
}

const msgs: MessageMap = {
  speed: Timestamp_Speed,
  size: Timestamp_Size,
  speedBigInt: Timestamp_SpeedBigInt,
  sizeBigInt: Timestamp_SizeBigInt,
};

Object.entries(msgs).forEach(([name, messageType]) => {
  describe("google.protobuf.Timestamp " + name, function () {
    describe("now()", function () {
      it("creates Timestamp for current time", function () {
        let dateNowSeconds = Math.floor(Date.now() / 1000);
        let timestamp = messageType.now();
        let timestampSeconds = PbLong.from(timestamp.seconds).toNumber();
        expect(timestampSeconds).toEqual(dateNowSeconds);
      });
    });

    describe("fromDate()", function () {
      it("creates expected Timestamp", function () {
        let date = new Date();
        date.setUTCFullYear(2017, 0, 15);
        date.setUTCHours(1, 30, 15, 0);
        let ts = messageType.fromDate(date);
        expect(ts).toEqual(makeTimestamp(1484443815, messageType));
      });

      it("creates expected Timestamp with milliseconds", function () {
        let date = new Date();
        date.setUTCFullYear(2017, 0, 15);
        date.setUTCHours(1, 30, 15, 600);
        let ts = messageType.fromDate(date);
        expect(ts).toEqual(makeTimestamp(1484443815, messageType, 600000000));
      });
    });

    describe("toDate()", function () {
      it("creates expected Date", function () {
        let ts = makeTimestamp(1484443815, messageType);

        let date = new Date();
        date.setUTCFullYear(2017, 0, 15);
        date.setUTCHours(1, 30, 15, 0);

        expect(messageType.toDate(ts)).toEqual(date);
      });

      it("creates expected Date with milliseconds", function () {
        let ts = makeTimestamp(1484443815, messageType, 600000000);

        let date = new Date();
        date.setUTCFullYear(2017, 0, 15);
        date.setUTCHours(1, 30, 15, 600);

        expect(messageType.toDate(ts)).toEqual(date);
      });
    });

    describe("toJson()", function () {
      it("creates specialized JSON", function () {
        let json = messageType.toJson(makeTimestamp(1484443815, messageType));
        expect(json).toEqual("2017-01-15T01:30:15Z");
      });

      it("creates specialized JSON with milliseconds", function () {
        let json = messageType.toJson(
          makeTimestamp(1484443815, messageType, 600000000)
        );
        expect(json).toEqual("2017-01-15T01:30:15.600Z");
      });
    });

    describe("fromJson()", function () {
      it("can read specialized JSON", function () {
        let ts = messageType.fromJson("2017-01-15T01:30:15Z");
        expect(ts).toEqual(makeTimestamp(1484443815, messageType));
      });

      it("can read specialized JSON with milliseconds", function () {
        let ts = messageType.fromJson("2017-01-15T01:30:15.600Z");
        expect(ts).toEqual(makeTimestamp(1484443815, messageType, 600000000));
      });
    });
  });
});
