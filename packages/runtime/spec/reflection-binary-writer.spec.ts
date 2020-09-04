import {fixtures} from "../../test-fixtures";
import {BinaryWriter, ReflectionBinaryWriter} from "../src";
import {binaryWriteOptions} from "../src";

describe('ReflectionBinaryWriter', () => {

    beforeEach(function () {
        jasmine.addCustomEqualityTester((a, b) =>
            (a instanceof Uint8Array && b instanceof Uint8Array) ? a.byteLength === b.byteLength : undefined
        );
    });

    describe('writes 0 bytes for all default fixture messages', function () {
        fixtures.usingMessages((typeName, key, msg) => {
            if (key !== 'default') return
            const format = new ReflectionBinaryWriter(fixtures.makeMessageInfo(typeName));
            it(`${typeName}`, function () {
                // let writer = Writer.create();
                // let writer = new ProtobufJsBinaryWriter();
                let writer = new BinaryWriter();
                format.write(msg, writer, binaryWriteOptions());
                expect(writer.finish().length).toBe(0);
            });
        });
    });

});
