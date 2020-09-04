import {fixtures} from "../../test-fixtures";
import {isJsonObject, ReflectionJsonReader, ReflectionJsonWriter} from "../src";


describe('ReflectionJsonReader and ReflectionJsonWriter', function () {

    describe('all message fixtures survive round trip', function () {
        fixtures.usingMessages((typeName, key, message) => {

            const reader = new ReflectionJsonReader(fixtures.makeMessageInfo(typeName));
            const writer = new ReflectionJsonWriter(fixtures.makeMessageInfo(typeName));

            it(`${typeName} '${key}'`, function () {
                let json = writer.write(message, {
                    emitDefaultValues: false,
                    enumAsInteger: false,
                    useProtoFieldName: false
                });
                if (!isJsonObject(json)) return fail();
                const output = fixtures.getMessage(typeName, 'default');
                reader.read(json, output, {ignoreUnknownFields: false});
                expect(output).toEqual(message);
            });
        });
    });

    describe('all message fixtures survive round trip with emitDefaultValues:true', function () {
        fixtures.usingMessages((typeName, key, message) => {

            const reader = new ReflectionJsonReader(fixtures.makeMessageInfo(typeName));
            const writer = new ReflectionJsonWriter(fixtures.makeMessageInfo(typeName));

            it(`${typeName} '${key}'`, function () {
                let json = writer.write(message, {
                    emitDefaultValues: true,
                    enumAsInteger: false,
                    useProtoFieldName: false
                });
                if (!isJsonObject(json)) return fail();
                const output = fixtures.getMessage(typeName, 'default');
                reader.read(json, output, {ignoreUnknownFields: false});
                expect(output).toEqual(message);
            });
        });
    });

    describe('all message fixtures survive round trip with enumAsInteger:true', function () {
        fixtures.usingMessages((typeName, key, message) => {

            const reader = new ReflectionJsonReader(fixtures.makeMessageInfo(typeName));
            const writer = new ReflectionJsonWriter(fixtures.makeMessageInfo(typeName));

            it(`${typeName} '${key}'`, function () {
                let json = writer.write(message, {
                    emitDefaultValues: false,
                    enumAsInteger: true,
                    useProtoFieldName: false
                });
                if (!isJsonObject(json)) return fail();
                const output = fixtures.getMessage(typeName, 'default');
                reader.read(json, output, {ignoreUnknownFields: false});
                expect(output).toEqual(message);
            });
        });
    });


});
