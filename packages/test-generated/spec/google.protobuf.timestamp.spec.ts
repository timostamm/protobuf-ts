import {Timestamp} from "../ts-out/google/protobuf/timestamp";
import {makeTimestamp} from "./support/helpers";
import {PbLong} from "@protobuf-ts/runtime";


describe('google.protobuf.Timestamp', function () {


    describe('now()', function () {

        it('creates Timestamp for current time', function () {
            let dateNowSeconds = Math.floor(Date.now() / 1000);
            let timestamp = Timestamp.now();
            let timestampSeconds = PbLong.from(timestamp.seconds).toNumber();
            expect(timestampSeconds).toEqual(dateNowSeconds);
        });

    });


    describe('fromDate()', function () {

        it('creates expected Timestamp', function () {
            let date = new Date();
            date.setUTCFullYear(2017, 0, 15);
            date.setUTCHours(1, 30, 15, 0);
            let ts = Timestamp.fromDate(date);
            expect(ts).toEqual(makeTimestamp(1484443815));
        });

        it('creates expected Timestamp with milliseconds', function () {
            let date = new Date();
            date.setUTCFullYear(2017, 0, 15);
            date.setUTCHours(1, 30, 15, 600);
            let ts = Timestamp.fromDate(date);
            expect(ts).toEqual(makeTimestamp(1484443815, 600000000));
        });

    });


    describe('toDate()', function () {

        it('creates expected Date', function () {
            let ts = makeTimestamp(1484443815);

            let date = new Date();
            date.setUTCFullYear(2017, 0, 15);
            date.setUTCHours(1, 30, 15, 0);

            expect(Timestamp.toDate(ts)).toEqual(date);
        });

        it('creates expected Date with milliseconds', function () {
            let ts = makeTimestamp(1484443815, 600000000);

            let date = new Date();
            date.setUTCFullYear(2017, 0, 15);
            date.setUTCHours(1, 30, 15, 600);

            expect(Timestamp.toDate(ts)).toEqual(date);
        });

    });


    describe('toJson()', function () {

        it('creates specialized JSON', function () {
            let json = Timestamp.toJson(
                makeTimestamp(1484443815)
            );
            expect(json).toEqual("2017-01-15T01:30:15Z");
        });

        it('creates specialized JSON with milliseconds', function () {
            let json = Timestamp.toJson(
                makeTimestamp(1484443815, 600000000)
            );
            expect(json).toEqual("2017-01-15T01:30:15.600Z");
        });

    });


    describe('fromJson()', function () {

        it('can read specialized JSON', function () {
            let ts = Timestamp.fromJson("2017-01-15T01:30:15Z");
            expect(ts).toEqual(makeTimestamp(1484443815));
        });

        it('can read specialized JSON with milliseconds', function () {
            let ts = Timestamp.fromJson("2017-01-15T01:30:15.600Z");
            expect(ts).toEqual(makeTimestamp(1484443815, 600000000));
        });

    });


});
