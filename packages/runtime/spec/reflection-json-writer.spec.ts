import {fixtures} from "../../test-fixtures";
import {scalarTypeToNameForTests} from "./support/helpers";
import {jsonWriteOptions, PbLong, PbULong, ReflectionJsonWriter, ScalarType} from "../src";


describe('ReflectionJsonWriter', function () {


    describe('write() returns json as expected by fixture', function () {
        fixtures.usingPairs((typeName, key, msg, json) => {

            const format = new ReflectionJsonWriter(fixtures.makeMessageInfo(typeName));

            it(`${typeName} '${key}'`, function () {
                let output = format.write(msg, {
                    emitDefaultValues: false,
                    enumAsInteger: false,
                    useProtoFieldName: false
                });
                expect(output).toEqual(json);
            });
        });
    });


    describe('write() writes field as expected by fixture', function () {
        fixtures.usingJsonWrites((typeName, field, key, input, exp, opt) => {
            const format = new ReflectionJsonWriter({typeName: typeName, fields: [field]});
            it(`${typeName}.${field.name} '${key}'`, function () {
                let written = format.write(input, jsonWriteOptions(opt));
                expect(written).toEqual(exp);
            });
        });
    });


    describe('scalar()', () => {
        const format = new ReflectionJsonWriter({
            typeName: '.test.Message',
            fields: []
        });
        const list: Array<[ScalarType, any]> = [
            [ScalarType.DOUBLE, 0],
            [ScalarType.FLOAT, 0],
            [ScalarType.INT64, PbLong.ZERO.toString()],
            [ScalarType.UINT64, PbULong.ZERO.toString()],
            [ScalarType.INT32, 0],
            [ScalarType.FIXED64, PbULong.ZERO.toString()],
            [ScalarType.FIXED32, 0],
            [ScalarType.BOOL, false],
            [ScalarType.STRING, ""],
            [ScalarType.BYTES, new Uint8Array(0)],
            [ScalarType.UINT32, 0],
            [ScalarType.SFIXED32, 0],
            [ScalarType.SFIXED64, PbLong.ZERO.toString()],
            [ScalarType.SINT32, 0],
            [ScalarType.SINT64, PbLong.ZERO.toString()],
        ];
        describe('honors `emitDefaultValue = false`', () => {
            for (const [type, defaultVal] of list) {
                it(`for ${scalarTypeToNameForTests(type)}`, () => {
                    const val = format.scalar(type, defaultVal, "fake-field-name", false, false);
                    expect(val).toBeUndefined();
                });
            }
        });
        describe('honors `emitDefaultValue = true`', () => {
            for (const [type, defaultVal] of list) {
                it(`for ${scalarTypeToNameForTests(type)}`, () => {
                    const val = format.scalar(type, defaultVal, "fake-field-name", false, true);
                    expect(val).toBeDefined();
                });
            }
        });
        describe('does not skip default value for optional fields', () => {
            for (const [type, defaultVal] of list) {
                it(`for ${scalarTypeToNameForTests(type)}`, () => {
                    const val = format.scalar(type, defaultVal, "fake-field-name", true, false);
                    expect(val).toBeDefined();
                });
            }
        });
    });


});
