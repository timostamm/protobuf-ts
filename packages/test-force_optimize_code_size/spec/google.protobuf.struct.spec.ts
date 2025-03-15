import {NullValue, Struct} from "../gen/google/protobuf/struct";
import type {JsonObject} from "@protobuf-ts/runtime";

// Copied from test-default/google.protobuf.struct.spec.ts. Do not edit.
describe('google.protobuf.Struct', function () {


    let fixMessage: Struct = {
        fields: {
            "bool": {kind: {oneofKind: 'boolValue', boolValue: true}},
            "null": {kind: {oneofKind: 'nullValue', nullValue: NullValue.NULL_VALUE}},
            "string": {kind: {oneofKind: 'stringValue', stringValue: "a string"}},
            "number": {kind: {oneofKind: 'numberValue', numberValue: 123}},
            "list": {
                kind: {
                    oneofKind: 'listValue',
                    listValue: {
                        values: [
                            {kind: {oneofKind: 'boolValue', boolValue: true}},
                            {kind: {oneofKind: 'nullValue', nullValue: NullValue.NULL_VALUE}},
                            {kind: {oneofKind: 'stringValue', stringValue: "a string"}},
                            {kind: {oneofKind: 'numberValue', numberValue: 123}},
                        ]
                    }
                }
            },
            "struct": {
                kind: {
                    oneofKind: 'structValue',
                    structValue: {
                        fields: {
                            "bool": {kind: {oneofKind: 'boolValue', boolValue: true}},
                            "null": {kind: {oneofKind: 'nullValue', nullValue: NullValue.NULL_VALUE}},
                            "string": {kind: {oneofKind: 'stringValue', stringValue: "a string"}},
                            "number": {kind: {oneofKind: 'numberValue', numberValue: 123}},
                        }
                    }
                }
            },
        }
    };

    let fixJson: JsonObject = {
        "bool": true,
        "null": null,
        "string": "a string",
        "number": 123,
        "list": [true, null, "a string", 123],
        "struct": {
            "bool": true,
            "null": null,
            "string": "a string",
            "number": 123,
        }
    };


    let fixJsonString = JSON.stringify(fixJson);


    it('toJson() creates expected JSON', function () {
        let json = Struct.toJson(fixMessage);
        expect(json).toEqual(fixJson);
    });


    it('toJsonString() creates expected JSON', function () {
        let json = Struct.toJsonString(fixMessage);
        expect(json).toEqual(fixJsonString);
    });


    it('fromJson() parses to expected message', function () {
        let struct = Struct.fromJson(fixJson);
        expect(struct).toEqual(fixMessage);
    });


    it('fromJsonString() parses to expected message', function () {
        let struct = Struct.fromJsonString(fixJsonString);
        expect(struct).toEqual(fixMessage);
    });


    it('create() creates expected empty message', function () {
        let struct = Struct.create()
        expect(struct).toEqual({
            fields: {}
        });
    });


    it('clone() creates exact copy', function () {
        let struct = Struct.clone(fixMessage);
        expect(struct).toEqual(fixMessage);
    });


    it('survives binary round-trip', function () {
        let bin = Struct.toBinary(fixMessage);
        let struct = Struct.fromBinary(bin);
        expect(struct).toEqual(fixMessage);
    });


    it('survives JSON round-trip', function () {
        let json = Struct.toJsonString(fixMessage);
        let struct = Struct.fromJsonString(json);
        expect(struct).toEqual(fixMessage);
    });


});
