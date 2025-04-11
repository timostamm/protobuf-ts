import {Duration} from "../gen/google/protobuf/duration";
import {makeDuration} from "./helpers";

// Copied from test-default/google.protobuf.duration.spec.ts. Do not edit.

describe('google.protobuf.Duration', function () {

    describe('toJson()', function () {

        it('should encode 3 seconds and 0 nanoseconds in JSON format as "3s"', function () {
            let json = Duration.toJson(
                makeDuration(3)
            );
            expect(json).toEqual("3s");
        });

        it('should encode 3 seconds and 1 nanosecond in JSON format as "3.000000001s"', function () {
            let duration = makeDuration(3);
            duration.nanos = 1;
            let json = Duration.toJson(duration);
            expect(json).toEqual("3.000000001s");
        });

        it('should encode 3 seconds and 1 microsecond in JSON format as "3.000001s"', function () {
            let duration = makeDuration(3);
            duration.nanos = 1000;
            let json = Duration.toJson(duration);
            expect(json).toEqual("3.000001s");
        });

    });


    describe('fromJson()', function () {

        it('can read "3s"', function () {
            let exp = makeDuration(3);
            expect(Duration.fromJson('3s')).toEqual(exp);
        });

        it('can read "3.000000001s"', function () {
            let exp = makeDuration(3);
            exp.nanos = 1;
            expect(Duration.fromJson('3.000000001s')).toEqual(exp);
        });

        it('can read "3.000001s"', function () {
            let exp = makeDuration(3);
            exp.nanos = 1000;

            expect(Duration.fromJson('3.000001s')).toEqual(exp);
        });

    });


});
