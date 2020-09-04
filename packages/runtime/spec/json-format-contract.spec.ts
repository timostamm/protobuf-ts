import {
    IMessageType,
    JsonReadOptions,
    JsonWriteStringOptions,
    mergeJsonOptions,
    jsonWriteOptions
} from "../src";


describe('jsonWriteOptions()', () => {

    it('should merge with defaults', function () {
        expect(jsonWriteOptions({
            emitDefaultValues: true,
            enumAsInteger: true,
        })).toEqual({
            emitDefaultValues: true,
            enumAsInteger: true,
            useProtoFieldName: false,
            prettySpaces: 0,
        });
        expect(jsonWriteOptions({
            useProtoFieldName: true,
            prettySpaces: 99,
        })).toEqual({
            emitDefaultValues: false,
            enumAsInteger: false,
            useProtoFieldName: true,
            prettySpaces: 99,
        });
        expect(jsonWriteOptions({
            emitDefaultValues: true,
            enumAsInteger: true,
            useProtoFieldName: true,
            prettySpaces: 99,
        })).toEqual({
            emitDefaultValues: true,
            enumAsInteger: true,
            useProtoFieldName: true,
            prettySpaces: 99,
        });
        expect(jsonWriteOptions({
            typeRegistry: [],
        })).toEqual({
            typeRegistry: [],
            emitDefaultValues: false,
            enumAsInteger: false,
            useProtoFieldName: false,
            prettySpaces: 0,
        });
    });

    it('should let defaults untouched', function () {
        let def: JsonWriteStringOptions = JSON.parse(JSON.stringify(jsonWriteOptions()));
        jsonWriteOptions({
            emitDefaultValues: true,
            enumAsInteger: true,
            useProtoFieldName: true,
            prettySpaces: 99,
        });
        expect(jsonWriteOptions()).toEqual(def);
    });

});


describe('mergeJsonOptions()', () => {

    it('should merge a and b', function () {
        let a: JsonReadOptions & JsonWriteStringOptions = {
            ignoreUnknownFields: true,
            useProtoFieldName: true,
            emitDefaultValues: true,
            enumAsInteger: true,
            typeRegistry: [1 as unknown as IMessageType<any>],
            prettySpaces: 0
        };
        let b: JsonReadOptions & JsonWriteStringOptions = {
            ignoreUnknownFields: false,
            useProtoFieldName: false,
            emitDefaultValues: false,
            enumAsInteger: false,
            typeRegistry: [2 as unknown as IMessageType<any>],
            prettySpaces: 1
        };
        let c = mergeJsonOptions(a, b);
        let exp: JsonReadOptions & JsonWriteStringOptions = {
            ignoreUnknownFields: false,
            useProtoFieldName: false,
            emitDefaultValues: false,
            enumAsInteger: false,
            typeRegistry: [1 as unknown as IMessageType<any>, 2 as unknown as IMessageType<any>],
            prettySpaces: 1
        };
        expect(c).toEqual(exp);
    });


    it('should merge undefined and b', function () {
        let a = undefined;
        let b: JsonReadOptions & JsonWriteStringOptions = {
            ignoreUnknownFields: false,
            useProtoFieldName: false,
            emitDefaultValues: false,
            enumAsInteger: false,
            typeRegistry: [2 as unknown as IMessageType<any>],
            prettySpaces: 1
        };
        let c = mergeJsonOptions(a, b);
        expect(c).toEqual(b);
    });


    it('should merge a and undefined', function () {
        let a: JsonReadOptions & JsonWriteStringOptions = {
            ignoreUnknownFields: true,
            useProtoFieldName: true,
            emitDefaultValues: true,
            enumAsInteger: true,
            typeRegistry: [1 as unknown as IMessageType<any>],
            prettySpaces: 0
        };
        let b = undefined;
        let c = mergeJsonOptions(a, b);
        expect(c).toEqual(a);
    });


});
