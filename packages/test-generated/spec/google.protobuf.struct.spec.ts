import {NullValue, Struct} from "../ts-out/google/protobuf/struct";
import type {JsonObject} from "@protobuf-ts/runtime";

describe('google.protobuf.Struct', function () {


    let fixMessage: Struct = {
        fields: {
            "bool": {kind: {kind: 'boolValue', value: true}},
            "null": {kind: {kind: 'nullValue', value: NullValue.NULL_VALUE}},
            "string": {kind: {kind: 'stringValue', value: "a string"}},
            "number": {kind: {kind: 'numberValue', value: 123}},
            "list": {
                kind: {
                    kind: 'listValue',
                    value: {
                        values: [
                            {kind: {kind: 'boolValue', value: true}},
                            {kind: {kind: 'nullValue', value: NullValue.NULL_VALUE}},
                            {kind: {kind: 'stringValue', value: "a string"}},
                            {kind: {kind: 'numberValue', value: 123}},
                        ]
                    }
                }
            },
            "struct": {
                kind: {
                    kind: 'structValue',
                    value: {
                        fields: {
                            "bool": {kind: {kind: 'boolValue', value: true}},
                            "null": {kind: {kind: 'nullValue', value: NullValue.NULL_VALUE}},
                            "string": {kind: {kind: 'stringValue', value: "a string"}},
                            "number": {kind: {kind: 'numberValue', value: 123}},
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
