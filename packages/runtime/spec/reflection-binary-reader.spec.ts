import {fixtures} from "../../test-fixtures";
import {BinaryReader, BinaryWriter, binaryReadOptions, ReflectionBinaryReader, WireType} from "../src";

describe('ReflectionBinaryReader', () => {

    beforeEach(function () {
        jasmine.addCustomEqualityTester((a, b) =>
            (a instanceof Uint8Array && b instanceof Uint8Array) ? a.byteLength === b.byteLength : undefined
        );
    });

    describe('reads 0 bytes as default fixture message', function () {
        fixtures.usingMessages((typeName, key, msg) => {
            if (key !== 'default') return
            const format = new ReflectionBinaryReader(fixtures.makeMessageInfo(typeName));
            it(`${typeName}`, function () {
                let output = fixtures.getMessage(typeName, key); // need default map and array fields
                let reader = new BinaryReader(new Uint8Array(0));
                format.read(reader, output, binaryReadOptions());
                expect(output).toEqual(msg);
            });
        });
    });

    describe('with unknown field', function () {

        it('should throw error if `readUnknownField: "throw"`', function () {
            let input = new BinaryWriter().tag(1, WireType.Bit64).fixed64(123).finish();
            const refReader = new ReflectionBinaryReader({typeName: "test", fields: []});
            expect(() => {
                refReader.read(new BinaryReader(input), {}, {
                    readUnknownField: "throw",
                    readerFactory: bytes => new BinaryReader(bytes),
                });
            }).toThrowError("Unknown field 1 (wire type 1) for test");
        });

        it('should ignore if `readUnknownField: false`', function () {
            let input = new BinaryWriter().tag(1, WireType.Bit64).fixed64(123).finish();
            const refReader = new ReflectionBinaryReader({typeName: "test", fields: []});
            refReader.read(new BinaryReader(input), {}, {
                readUnknownField: false,
                readerFactory: bytes => new BinaryReader(bytes),
            });
            expect(true).toBeTrue();
        });

        it('should call if `readUnknownField: UnknownFieldReader`', function () {
            let input = new BinaryWriter().tag(1, WireType.Bit64).fixed64(123).finish();
            let unknown: [string, object, number, WireType, Uint8Array] | undefined;
            const refReader = new ReflectionBinaryReader({typeName: "test", fields: []});
            refReader.read(new BinaryReader(input), {}, {
                readUnknownField: (typeName, message, fieldNo, wireType, data) => unknown = [typeName, message, fieldNo, wireType, data],
                readerFactory: bytes => new BinaryReader(bytes),
            });
            expect(unknown).toEqual([
                "test", {}, 1, WireType.Bit64, new Uint8Array([123, 0, 0, 0, 0, 0, 0, 0])
            ]);
        });

    });

});
