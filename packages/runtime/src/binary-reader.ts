import type {BinaryReadOptions, IBinaryReader} from "./binary-format-contract";
import {WireType} from "./binary-format-contract";
import {PbLong, PbULong} from "./pb-long";
import {varint32read, varint64read} from "./goog-varint";


const defaultsRead: Readonly<BinaryReadOptions> = {
    readUnknownField: true,
    readerFactory: bytes => new BinaryReader(bytes),
};


/**
 * Make options for reading binary data form partial options.
 */
export function binaryReadOptions(options?: Partial<BinaryReadOptions>): Readonly<BinaryReadOptions> {
    return options ? {...defaultsRead, ...options} : defaultsRead;
}


/**
 * TextDecoderLike is the subset of the TextDecoder API required by protobuf-ts.
 */
interface TextDecoderLike {
    decode(input?: Uint8Array): string;
}

export class BinaryReader implements IBinaryReader {

    /**
     * Current position.
     */
    pos: number;

    /**
     * Number of bytes available in this reader.
     */
    readonly len: number;

    private readonly buf: Uint8Array;
    private readonly view: DataView;
    private readonly textDecoder: TextDecoderLike;


    constructor(buf: Uint8Array, textDecoder?: TextDecoderLike) {
        this.buf = buf;
        this.len = buf.length;
        this.pos = 0;
        this.view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
        this.textDecoder = textDecoder ?? new TextDecoder("utf-8", {
            fatal: true,
            ignoreBOM: true,
        });
    }


    /**
     * Reads a tag - field number and wire type.
     */
    tag(): [number, WireType] {
        let tag = this.uint32(),
            fieldNo = tag >>> 3,
            wireType = tag & 7;
        if (fieldNo <= 0 || wireType < 0 || wireType > 5)
            throw new Error("illegal tag: field no " + fieldNo + " wire type " + wireType);
        return [fieldNo, wireType];
    }


    /**
     * Skip one element on the wire and return the skipped data.
     * Supports WireType.StartGroup since v2.0.0-alpha.23.
     */
    skip(wireType: WireType): Uint8Array {
        let start = this.pos;
        // noinspection FallThroughInSwitchStatementJS
        switch (wireType) {
            case WireType.Varint:
                while (this.buf[this.pos++] & 0x80) {
                    // ignore
                }
                break;
            case WireType.Bit64:
                this.pos += 4;
            case WireType.Bit32:
                this.pos += 4;
                break;
            case WireType.LengthDelimited:
                let len = this.uint32();
                this.pos += len;
                break;
            case WireType.StartGroup:
                // From descriptor.proto: Group type is deprecated, not supported in proto3.
                // But we must still be able to parse and treat as unknown.
                let t: WireType
                while ((t = this.tag()[1]) !== WireType.EndGroup) {
                    this.skip(t);
                }
                break;
            default:
                throw new Error("cant skip wire type " + wireType);
        }
        this.assertBounds();
        return this.buf.subarray(start, this.pos);
    }


    protected varint64 = varint64read as () => [number, number]; // dirty cast for `this`


    /**
     * Throws error if position in byte array is out of range.
     */
    protected assertBounds(): void {
        if (this.pos > this.len)
            throw new RangeError("premature EOF");
    }


    /**
     * Read a `uint32` field, an unsigned 32 bit varint.
     */
    uint32 = varint32read as IBinaryReader["uint32"]; // dirty cast for `this` and access to protected `buf`


    /**
     * Read a `int32` field, a signed 32 bit varint.
     */
    int32(): number {
        return this.uint32() | 0;
    }


    /**
     * Read a `sint32` field, a signed, zigzag-encoded 32-bit varint.
     */
    sint32(): number {
        let zze = this.uint32();
        // decode zigzag
        return (zze >>> 1) ^ -(zze & 1);
    }


    /**
     * Read a `int64` field, a signed 64-bit varint.
     */
    int64(): PbLong {
        return new PbLong(...this.varint64());
    }


    /**
     * Read a `uint64` field, an unsigned 64-bit varint.
     */
    uint64(): PbULong {
        return new PbULong(...this.varint64());
    }


    /**
     * Read a `sint64` field, a signed, zig-zag-encoded 64-bit varint.
     */
    sint64(): PbLong {
        let [lo, hi] = this.varint64();
        // decode zig zag
        let s = -(lo & 1);
        lo = ((lo >>> 1 | (hi & 1) << 31) ^ s);
        hi = (hi >>> 1 ^ s);
        return new PbLong(lo, hi);
    }


    /**
     * Read a `bool` field, a variant.
     */
    bool(): boolean {
        let [lo, hi] = this.varint64();
        return lo !== 0 || hi !== 0;
    }


    /**
     * Read a `fixed32` field, an unsigned, fixed-length 32-bit integer.
     */
    fixed32(): number {
        return this.view.getUint32((this.pos += 4) - 4, true);
    }


    /**
     * Read a `sfixed32` field, a signed, fixed-length 32-bit integer.
     */
    sfixed32(): number {
        return this.view.getInt32((this.pos += 4) - 4, true);
    }


    /**
     * Read a `fixed64` field, an unsigned, fixed-length 64 bit integer.
     */
    fixed64(): PbULong {
        return new PbULong(this.sfixed32(), this.sfixed32());
    }


    /**
     * Read a `fixed64` field, a signed, fixed-length 64-bit integer.
     */
    sfixed64(): PbLong {
        return new PbLong(this.sfixed32(), this.sfixed32());
    }


    /**
     * Read a `float` field, 32-bit floating point number.
     */
    float(): number {
        return this.view.getFloat32((this.pos += 4) - 4, true);
    }


    /**
     * Read a `double` field, a 64-bit floating point number.
     */
    double(): number {
        return this.view.getFloat64((this.pos += 8) - 8, true);
    }


    /**
     * Read a `bytes` field, length-delimited arbitrary data.
     */
    bytes(): Uint8Array {
        let len = this.uint32();
        let start = this.pos;
        this.pos += len;
        this.assertBounds();
        return this.buf.subarray(start, start + len);
    }


    /**
     * Read a `string` field, length-delimited data converted to UTF-8 text.
     */
    string(): string {
        return this.textDecoder.decode(this.bytes());
    }

}

