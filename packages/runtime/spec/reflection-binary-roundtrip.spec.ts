import {fixtures} from "../../test-fixtures";
import {
    BinaryReader,
    BinaryReadOptions,
    BinaryWriteOptions,
    BinaryWriter,
    binaryReadOptions,
    binaryWriteOptions,
    ReflectionBinaryReader,
    ReflectionBinaryWriter,
    WireType
} from "../src";


describe('ReflectionBinaryWriter and ReflectionBinaryReader', () => {

    beforeEach(function () {
        jasmine.addCustomEqualityTester((a, b) =>
            (a instanceof Uint8Array && b instanceof Uint8Array) ? a.byteLength === b.byteLength : undefined
        );
    });


    describe('all fixture messages survive binary round trip', function () {
        fixtures.usingMessages((typeName, key, msg) => {
            const refReader = new ReflectionBinaryReader(fixtures.makeMessageInfo(typeName));
            const refWriter = new ReflectionBinaryWriter(fixtures.makeMessageInfo(typeName));
            it(`${typeName} '${key}'`, function () {

                // write fixture message to binary
                let writer = new BinaryWriter();
                refWriter.write(msg, writer, binaryWriteOptions());
                const bytes = writer.finish();

                // read binary into defaults
                let output = fixtures.getMessage(typeName, 'default');
                let reader = new BinaryReader(bytes);
                refReader.read(reader, output, binaryReadOptions());

                // now the output should be same as the original fixture message
                expect(output).toEqual(msg);
            });
        });
    });


    describe('with unknown fields', function () {
        const options: BinaryReadOptions & BinaryWriteOptions = {
            readerFactory: (data) => new BinaryReader(data),
            writerFactory: () => new BinaryWriter(),
            writeUnknownFields: true,
            readUnknownField: true,
        };
        const refReader = new ReflectionBinaryReader({typeName: "test", fields: []});
        const refWriter = new ReflectionBinaryWriter({typeName: "test", fields: []});
        it('should write back unknown fields with the right options', function () {
            let input = new BinaryWriter().tag(1, WireType.Bit64).fixed64(123).finish();
            let message = {};
            refReader.read(new BinaryReader(input), message, options);
            let writer = new BinaryWriter();
            refWriter.write(message, writer, options);
            let output = writer.finish();
            expect(output).toEqual(input);
        });
    });


});

