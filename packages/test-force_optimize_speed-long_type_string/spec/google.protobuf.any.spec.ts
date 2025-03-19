import {Any} from "../gen/google/protobuf/any";
import {StructMessage} from "../gen/wkt-struct";
import {Duration} from "../gen/google/protobuf/duration";
import type {JsonObject} from "@protobuf-ts/runtime";
import {makeDuration} from "./helpers";
import {ScalarValuesMessage} from "../gen/msg-scalar";

// Copied from test-default/google.protobuf.any.spec.ts. Do not edit.

describe('google.protobuf.Any', function () {


    let scalarMsg: ScalarValuesMessage = ScalarValuesMessage.create({
        doubleField: 0.5,
        stringField: "hello",
        boolField: true,
    });


    describe('pack()', function () {

        let scalarMsgAny = Any.pack(scalarMsg, ScalarValuesMessage);

        it('sets expected typeUrl', function () {
            expect(scalarMsgAny.typeUrl).toEqual("type.googleapis.com/spec.ScalarValuesMessage");
        });

        it('sets expected bytes value', function () {
            expect(scalarMsgAny.value).toEqual(ScalarValuesMessage.toBinary(scalarMsg));
        });

    });


    describe('contains()', function () {

        let scalarMsgAny = Any.pack(scalarMsg, ScalarValuesMessage);

        it('returns false for empty Any', function () {
            expect(Any.contains(Any.create(), "")).toBeFalse();
        });

        it('returns false for wrong type name', function () {
            expect(Any.contains(scalarMsgAny, ".other.Type")).toBeFalse();
        });

        it('returns false for wrong message Type', function () {
            expect(Any.contains(scalarMsgAny, StructMessage)).toBeFalse();
        });

        it('returns true for correct type name', function () {
            expect(Any.contains(scalarMsgAny, "spec.ScalarValuesMessage")).toBeTrue();
        });

        it('returns true for correct message type', function () {
            expect(Any.contains(scalarMsgAny, ScalarValuesMessage)).toBeTrue();
        });

    });


    describe('unpack()', function () {

        let scalarMsgAny = Any.pack(scalarMsg, ScalarValuesMessage);

        it('unpacks', function () {
            let msg = Any.unpack(scalarMsgAny, ScalarValuesMessage);
            expect(ScalarValuesMessage.is(msg)).toBeTrue();
            expect(msg).toEqual(scalarMsg);
        });

        it('with wrong message type throws', function () {
            expect(() => Any.unpack(scalarMsgAny, StructMessage))
                .toThrowError('Cannot unpack google.protobuf.Any with typeUrl \'type.googleapis.com/spec.ScalarValuesMessage\' as spec.StructMessage.');
        });

    });

    describe('toJson()', function () {

        let scalarMsgAny = Any.pack(scalarMsg, ScalarValuesMessage);

        it('throws without type registry', function () {
            expect(() => Any.toJson(scalarMsgAny)).toThrow();
        });

        it('throws when type not in registry', function () {
            expect(
                () => Any.toJson(scalarMsgAny, {typeRegistry: [StructMessage]})
            ).toThrow();
        });

        it('creates expected JSON', function () {
            let registry = [StructMessage, ScalarValuesMessage];
            let json = Any.toJson(scalarMsgAny, {typeRegistry: registry});
            expect(json).toEqual({
                "@type": "type.googleapis.com/spec.ScalarValuesMessage",
                doubleField: 0.5,
                stringField: "hello",
                boolField: true,
            });
        });

        it('puts specialized JSON representation into the "value" property', function () {
            let duration = makeDuration(1);
            let durationAny = Any.pack(duration, Duration);
            let json = Any.toJson(durationAny, {typeRegistry: [Duration]});
            expect(json).toEqual({
                "@type": "type.googleapis.com/google.protobuf.Duration",
                value: "1s",
            });
        });

        it('empty Any toJson() creates JSON {}', function () {
            let any = Any.create();
            let json = Any.toJson(any);
            expect(json).toEqual({});
        });

    });


    describe('fromJson()', function () {

        let scalarMsgAnyJson: JsonObject = {
            "@type": "type.googleapis.com/spec.ScalarValuesMessage",
            doubleField: 0.5,
            stringField: "hello",
            boolField: true,
        };

        it('throws without type registry', function () {
            expect(() => Any.fromJson(scalarMsgAnyJson)).toThrow();
        });

        it('throws when type not in registry', function () {
            expect(
                () => Any.fromJson(scalarMsgAnyJson, {typeRegistry: [StructMessage]})
            ).toThrow();
        });

        it('can read JSON', function () {
            let registry = [StructMessage, ScalarValuesMessage];
            let scalarMsgAny = Any.fromJson(scalarMsgAnyJson, {typeRegistry: registry});
            expect(scalarMsgAny).toEqual(Any.pack(scalarMsg, ScalarValuesMessage));
        });

        it('can read specialized JSON', function () {
            let duration = makeDuration(1);
            let durationAny = Any.pack(duration, Duration);
            let durationAnyJson: JsonObject = {
                "@type": "type.googleapis.com/google.protobuf.Duration",
                value: "1s",
            };
            let read = Any.fromJson(durationAnyJson, {typeRegistry: [Duration]});
            expect(read).toEqual(durationAny);
        });

    });


});
