import {fixtures} from "../../test-fixtures";
import {EnumInfo, JsonObject, normalizeFieldInfo, jsonReadOptions, ReflectionJsonReader} from "../src";
import {RepeatType} from "../src";

describe('ReflectionJsonReader', function () {


    describe('read() returns message as expected by fixture', function () {
        fixtures.usingPairs((typeName, key, msg, json) => {

            const reader = new ReflectionJsonReader(fixtures.makeMessageInfo(typeName));

            it(`${typeName} '${key}'`, function () {
                let output = fixtures.getMessage(typeName, 'default');
                reader.read(json, output, {ignoreUnknownFields: false});
                expect(output).toEqual(msg);
            });
        });
    });


    describe('read() understands original proto field names of fixture', function () {
        fixtures.usingPairs((typeName: string, key, msg, json) => {

            const reader = new ReflectionJsonReader(fixtures.makeMessageInfo(typeName));

            // rewrite json keys to be original proto field names:
            for (let field of fixtures.makeMessageInfo(typeName).fields) {
                if (!json.hasOwnProperty(field.jsonName)) continue;
                if (field.jsonName === field.name) continue;
                json[field.name] = json[field.jsonName];
                delete json[field.jsonName];
            }

            it(`${typeName} '${key}'`, function () {
                let output = fixtures.getMessage(typeName, 'default');
                reader.read(json, output, {ignoreUnknownFields: false});
                expect(output).toEqual(msg);
            });
        });
    });


    describe('read() understands json `null` as field default values if expected by fixture', function () {
        fixtures.usingJson((typeName, key, json) => {

            if (key !== 'nulls equalling defaults') return;
            const reader = new ReflectionJsonReader(fixtures.makeMessageInfo(typeName));

            it(`${typeName}`, function () {
                let output = fixtures.getMessage(typeName, 'default');
                reader.read(json, output, {ignoreUnknownFields: false});

                let defaults = fixtures.getMessage(typeName, 'default');
                expect(output).toEqual(defaults);
            });
        });
    });


    describe('read() reads field as expected by fixture', function () {
        fixtures.usingJsonReads((typeName, field, key, input, exp, defaults) => {
            const reader = new ReflectionJsonReader({typeName: typeName, fields: [field]});
            it(`${typeName}.${field.name} '${key}'`, function () {
                reader.read(input, defaults, {ignoreUnknownFields: false});
                expect(defaults[field.localName]).toEqual(exp[field.localName]);
            });
        });
    });


    describe('read() throws as expected by fixture', function () {
        fixtures.usingJsonReadErrors((typeName, field, key, input, exp, defaults) => {
            const reader = new ReflectionJsonReader({typeName: typeName, fields: [field]});
            it(`${typeName}.${field.name} '${key}'`, function () {
                expect(() => {
                    reader.read(input, defaults, {ignoreUnknownFields: false});
                }).toThrowError(exp);

            });
        });
    });


    describe('read() merges', function () {

        it(`repeated values`, function () {
            const reader = new ReflectionJsonReader({
                typeName: 'test',
                fields: [
                    normalizeFieldInfo({no: 1, name: "field", kind: "scalar", T: 9 /*string*/, repeat: RepeatType.PACKED}),
                ]
            });
            let output = {
                field: ["a"]
            };
            reader.read({
                field: ["b"]
            }, output, {ignoreUnknownFields: false});
            expect(output.field).toEqual(["a", "b"]);
        });

        it(`maps`, function () {
            const reader = new ReflectionJsonReader({
                typeName: 'test',
                fields: [
                    normalizeFieldInfo({no: 1, name: "field", kind: "map", K: 9 /*string*/, V: {kind: "scalar", T: 9}}),
                ]
            });
            let output: any = {
                field: {a: "A"}
            };
            reader.read({
                field: {b: "B"}
            }, output, {ignoreUnknownFields: false});
            expect(output.field).toEqual({a: "A", b: "B"});
        });


    });


    describe('read() oneof', () => {

        const typeName = 'spec.OneofScalarMemberMessage';
        const reader = new ReflectionJsonReader(fixtures.makeMessageInfo(typeName));

        it('throws on invalid input', () => {
            const output = fixtures.getMessage(typeName, 'default');
            const input: JsonObject = {
                value: 123,
                error: 'hello'
            };
            expect(() => reader.read(input, output, jsonReadOptions()))
                .toThrowError(/Multiple members of the oneof group/);
        });

        it('null selects kind with scalar default value', () => {
            const output = fixtures.getMessage(typeName, 'default');
            const input: JsonObject = {
                value: null,
            };
            reader.read(input, output, jsonReadOptions());
            expect(output).toEqual({
                result: {oneofKind: 'value', value: 0}
            });
        });

        it('deletes existing oneof member', () => {
            const output: object = {
                result: {
                    oneofKind: 'value',
                    value: 123
                }
            };
            const input: JsonObject = {
                error: 'message',
            };
            reader.read(input, output, jsonReadOptions());
            expect(output).toEqual({
                result: {oneofKind: 'error', error: 'message'}
            });
        });

    });

    describe('read() enum', function () {
        enum SimpleEnum {
            ANY = 0
        }

        it('throws if unknown value was found', function () {
            const reader = new ReflectionJsonReader({typeName: '.test.Message', fields: []});
            expect(() => reader.enum([".spec.SimpleEnum", SimpleEnum], 'test', '')).toThrowError(/enum \.spec\.SimpleEnum has no value for "test"/);
        })

        it('return -1 if unknown value was found, but ignoreUnknownFields was set', function () {
            const reader = new ReflectionJsonReader({typeName: '.test.Message', fields: []});
            expect(reader.enum([".spec.SimpleEnum", SimpleEnum], 'test', '', true)).toEqual(0);
        })

    });


    describe('read() throws', function () {

        it('for unknown field', function () {
            const reader = new ReflectionJsonReader({typeName: '.test.Message', fields: []});
            expect(() => reader.read({unknown_field: true}, {}, {ignoreUnknownFields: false}))
                .toThrowError(/Found unknown field/);
        });

        it('not for unknown field if ignoreUnknownFields: true', function () {
            const format = new ReflectionJsonReader({typeName: '.test.Message', fields: []});
            expect(() => format.read({unknown_field: true}, {}, {ignoreUnknownFields: true})).not.toThrow();
        });

    });


    describe('enum() google.protobuf.NullValue', function () {
        enum NullValue {
            NULL_VALUE = 0
        }

        const reader = new ReflectionJsonReader({typeName: '.test.Message', fields: []});
        const handler: EnumInfo = ["google.protobuf.NullValue", NullValue];
        const field = normalizeFieldInfo({
            no: 1,
            name: 'enum_field',
            kind: 'enum',
            T: () => ["google.protobuf.NullValue", NullValue]
        });
        it('`null` parses as `null`', () => {
            const val = reader.enum(handler, null, field.name);
            expect(val).toBe(NullValue.NULL_VALUE);
        });
        it('other value throws', () => {
            expect(() => reader.enum(handler, 0, field.name))
                .toThrow();
            expect(() => reader.enum(handler, 'NULL_VALUE', field.name))
                .toThrow();
        });
        it('`0` throws', () => {
            expect(() => reader.enum(handler, 0, field.name)).toThrowError(/only accepts null/);
        });
        it('`NULL_VALUE` throws', () => {
            expect(() => reader.enum(handler, 'NULL_VALUE', field.name)).toThrowError(/only accepts null/);
        });

    });


});
