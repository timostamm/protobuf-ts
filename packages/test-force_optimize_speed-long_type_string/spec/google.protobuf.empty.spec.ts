import {Empty} from "../gen/google/protobuf/empty";
import type {JsonValue} from "@protobuf-ts/runtime";

// Copied from test-default/google.protobuf.empty.spec.ts. Do not edit.


describe('google.protobuf.Empty', function () {

    let fixMessage: Empty = {
    };

    let fixJson: JsonValue = {};


    let fixJsonString = JSON.stringify(fixJson);


    it('toJson() creates expected JSON', function () {
        let json = Empty.toJson(fixMessage);
        expect(json).toEqual(fixJson);
    });


    it('toJsonString() creates expected JSON', function () {
        let json = Empty.toJsonString(fixMessage);
        expect(json).toEqual(fixJsonString);
    });


    it('fromJson() parses to expected message', function () {
        let e = Empty.fromJson(fixJson);
        expect(e).toEqual(fixMessage);
    });


    it('fromJsonString() parses to expected message', function () {
        let e = Empty.fromJsonString(fixJsonString);
        expect(e).toEqual(fixMessage);
    });


    it('create() creates expected empty message', function () {
        let e = Empty.create()
        expect(e).toEqual({});
    });


    it('clone() creates exact copy', function () {
        let e = Empty.clone(fixMessage);
        expect(e).toEqual(fixMessage);
    });


    it('survives binary round-trip', function () {
        let bin = Empty.toBinary(fixMessage);
        let e = Empty.fromBinary(bin);
        expect(e).toEqual(fixMessage);
    });


    it('survives JSON round-trip', function () {
        let json = Empty.toJsonString(fixMessage);
        let e = Empty.fromJsonString(json);
        expect(e).toEqual(fixMessage);
    });



});
