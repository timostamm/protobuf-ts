import type {
    BinaryReadOptions,
    BinaryWriteOptions,
} from "../src";
import {
    BinaryReader,
    BinaryWriter,
    binaryReadOptions,
    binaryWriteOptions,
    mergeBinaryOptions,
    MessageType,
    ScalarType,
    UnknownFieldHandler,
    WireType
} from "../src";
import type {UnknownFieldContainer} from "../src/binary-format-contract";


describe('binaryReadOptions()', function () {
    it('should have `readUnknownField: true`', function () {
        let opt = binaryReadOptions({});
        expect(opt.readUnknownField).toBeTrue();
    });
});


describe('binaryWriteOptions()', function () {
    it('should have `writeUnknownFields: true`', function () {
        let opt = binaryWriteOptions({});
        expect(opt.writeUnknownFields).toBeTrue();
    });
    it('should let defaults untouched', function () {
        let def: BinaryWriteOptions = Object.assign({}, binaryWriteOptions());
        binaryWriteOptions({
            writeUnknownFields: false
        });
        expect(binaryWriteOptions()).toEqual(def);
    });
    it('should merge with defaults', function () {
        expect(binaryWriteOptions({
            writeUnknownFields: false
        })).toEqual({
            writeUnknownFields: false,
            writerFactory: binaryWriteOptions().writerFactory,
        });
    });
});


describe('mergeBinaryOptions()', () => {

    it('should merge a and b', function () {
        let a: BinaryReadOptions & BinaryWriteOptions = {
            readUnknownField: true,
            writeUnknownFields: true,
            readerFactory: 1 as unknown as BinaryReadOptions["readerFactory"],
            writerFactory: 2 as unknown as BinaryWriteOptions["writerFactory"],
        };
        let b: BinaryReadOptions & BinaryWriteOptions = {
            readUnknownField: "throw",
            writeUnknownFields: false,
            readerFactory: 3 as unknown as BinaryReadOptions["readerFactory"],
            writerFactory: 4 as unknown as BinaryWriteOptions["writerFactory"],
        };
        let c = mergeBinaryOptions(a, b);
        expect(c).toEqual(b);
    });


    it('should merge undefined and b', function () {
        let a = undefined;
        let b: BinaryReadOptions & BinaryWriteOptions = {
            readUnknownField: "throw",
            writeUnknownFields: false,
            readerFactory: 3 as unknown as BinaryReadOptions["readerFactory"],
            writerFactory: 4 as unknown as BinaryWriteOptions["writerFactory"],
        };
        let c = mergeBinaryOptions(a, b);
        expect(c).toEqual(b);
    });


    it('should merge a and undefined', function () {
        let a: BinaryReadOptions & BinaryWriteOptions = {
            readUnknownField: true,
            writeUnknownFields: true,
            readerFactory: 1 as unknown as BinaryReadOptions["readerFactory"],
            writerFactory: 2 as unknown as BinaryWriteOptions["writerFactory"],
        };
        let b = undefined;
        let c = mergeBinaryOptions(a, b);
        expect(c).toEqual(a);
    });

});


describe('UnknownFieldHandler()', function () {

    beforeEach(function () {
        jasmine.addCustomEqualityTester((a, b) =>
            (a instanceof Uint8Array && b instanceof Uint8Array) ? a.byteLength === b.byteLength : undefined
        );
    });

    it('should return empty array for list()`', function () {
        expect(UnknownFieldHandler.list({})).toEqual([]);
    });

    it('should return unknown fields in list()`', function () {
        let msg: UnknownFieldContainer = {
            [UnknownFieldHandler.symbol]: [
                {no: 1, wireType: WireType.Varint, data: new Uint8Array([1, 2, 3])}
            ]
        };
        expect(UnknownFieldHandler.list(msg)).toEqual([
            {no: 1, wireType: WireType.Varint, data: new Uint8Array([1, 2, 3])}
        ]);
    });

    it('should keep list() order`', function () {
        let msg: UnknownFieldContainer = {
            [UnknownFieldHandler.symbol]: [
                {no: 2, wireType: WireType.Varint, data: new Uint8Array([0])},
                {no: 1, wireType: WireType.Varint, data: new Uint8Array([0])},
                {no: 8, wireType: WireType.Varint, data: new Uint8Array([0])},
            ]
        };
        let order = UnknownFieldHandler.list(msg).map(f => f.no);
        expect(order).toEqual([
            2, 1, 8
        ]);
    });

    it('should optionally filter list() by field number`', function () {
        let msg: UnknownFieldContainer = {
            [UnknownFieldHandler.symbol]: [
                {no: 1, wireType: WireType.Varint, data: new Uint8Array([1])},
                {no: 1, wireType: WireType.Varint, data: new Uint8Array([2])},
                {no: 9, wireType: WireType.Varint, data: new Uint8Array([3])},
            ]
        };
        let list = UnknownFieldHandler.list(msg, 1);
        expect(list.length).toBe(2);
        expect(list).toEqual([
            {no: 1, wireType: WireType.Varint, data: new Uint8Array([1])},
            {no: 1, wireType: WireType.Varint, data: new Uint8Array([2])},
        ]);
    });

    it('should return last field in last()`', function () {
        let msg: UnknownFieldContainer = {
            [UnknownFieldHandler.symbol]: [
                {no: 1, wireType: WireType.Varint, data: new Uint8Array([1])},
                {no: 1, wireType: WireType.Varint, data: new Uint8Array([2])},
                {no: 9, wireType: WireType.Varint, data: new Uint8Array([3])},
            ]
        };
        let last = UnknownFieldHandler.last(msg, 1);
        expect(last).toEqual(
            {no: 1, wireType: WireType.Varint, data: new Uint8Array([2])},
        );
    });

    it('should set unknown field in onRead()`', function () {
        let msg = {};
        UnknownFieldHandler.onRead("foo", msg, 1, WireType.Varint, new Uint8Array([1, 2, 3]));
        expect(UnknownFieldHandler.list(msg)).toEqual([
            {no: 1, wireType: WireType.Varint, data: new Uint8Array([1, 2, 3])}
        ]);
    });

    it('should serialize unknown fields in onWrite()`', function () {
        let msg: UnknownFieldContainer = {
            [UnknownFieldHandler.symbol]: [
                {no: 1, wireType: WireType.Bit32, data: new BinaryWriter().fixed32(123).finish()},
                {no: 1, wireType: WireType.Bit32, data: new BinaryWriter().fixed32(777).finish()},
                {no: 2, wireType: WireType.Varint, data: new BinaryWriter().uint32(456).finish()},
                {no: 3, wireType: WireType.LengthDelimited, data: new BinaryWriter().string("hello").finish()},
            ]
        };

        let writer = new BinaryWriter();
        UnknownFieldHandler.onWrite("foo", msg, writer);
        let act = writer.finish();

        let exp = new BinaryWriter()
            .tag(1, WireType.Bit32).fixed32(132)
            .tag(1, WireType.Bit32).fixed32(777)
            .tag(2, WireType.Varint).uint32(465)
            .tag(3, WireType.LengthDelimited).string("hello")
            .finish();

        expect(act).toEqual(exp);
    });

});


describe('Unknown field handling example', function () {


    it('should work', function () {

        interface OldVersionMessage {
        }

        const OldVersionMessage = new MessageType("spec.OldVersionMessage", []);

        interface NewVersionMessage {
            added: number;
        }

        const NewVersionMessage = new MessageType("spec.NewVersionMessage", [{
            no: 22,
            name: "added",
            kind: "scalar",
            T: ScalarType.INT32
        }]);

        const newVersionData = NewVersionMessage.toBinary({added: 7777});

        // --- example start

        let message: OldVersionMessage = OldVersionMessage.fromBinary(newVersionData);

        let uf = UnknownFieldHandler.last(message, 22);
        if (uf) {
            uf.no; // 22
            uf.wireType; // WireType.Varint

            // use the binary reader to decode the raw data:
            let reader = new BinaryReader(uf.data);
            let addedNumber = reader.int32(); // 7777
        }

        // --- example end

        expect(uf).toBeDefined();
        if (uf) {
            expect(uf.no).toBe(22);
            expect(uf.wireType).toBe(WireType.Varint);
            let addedNumber = new BinaryReader(uf.data).int32(); // 7777
            expect(addedNumber).toBe(7777);
        }

    });

});

