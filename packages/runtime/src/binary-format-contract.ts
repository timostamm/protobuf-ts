import {BinaryReader} from "./binary-reader";
import {BinaryWriter} from "./binary-writer";
import type {PbLong, PbULong} from "./pb-long";


/**
 * Options for writing binary data.
 */
export interface BinaryWriteOptions {

    /**
     * Shall unknown fields be written back on wire?
     *
     * `true`: unknown fields stored in a symbol property of the message
     * are written back. This is the default behaviour.
     *
     * `false`: unknown fields are not written.
     *
     * `UnknownFieldWriter`: Your own behaviour for unknown fields.
     */
    writeUnknownFields: boolean | UnknownFieldWriter;

    /**
     * Allows to use a custom implementation to encode binary data.
     */
    writerFactory: () => IBinaryWriter;

}

/**
 * Options for reading binary data.
 */
export interface BinaryReadOptions {

    /**
     * Shall unknown fields be read, ignored or raise an error?
     *
     * `true`: stores the unknown field on a symbol property of the
     * message. This is the default behaviour.
     *
     * `false`: ignores the unknown field.
     *
     * `"throw"`: throws an error.
     *
     * `UnknownFieldReader`: Your own behaviour for unknown fields.
     */
    readUnknownField: boolean | 'throw' | UnknownFieldReader;

    /**
     * Allows to use a custom implementation to parse binary data.
     */
    readerFactory: (bytes: Uint8Array) => IBinaryReader;

}

/**
 * Store an unknown field for a message somewhere.
 */
type UnknownFieldReader = (typeName: string, message: any, fieldNo: number, wireType: WireType, data: Uint8Array) => void;

/**
 * Write unknown fields stored for the message to the writer.
 */
type UnknownFieldWriter = (typeName: string, message: any, writer: IBinaryWriter) => void;


/**
 * This handler implements the default behaviour for unknown fields.
 * When reading data, unknown fields are stored on the message, in a
 * symbol property.
 * When writing data, the symbol property is queried and unknown fields
 * are serialized into the output again.
 */
export namespace UnknownFieldHandler {


    /**
     * The symbol used to store unknown fields for a message.
     * The property must conform to `UnknownFieldContainer`.
     */
    export const symbol: unique symbol = Symbol.for("protobuf-ts/unknown");


    /**
     * Store an unknown field during binary read directly on the message.
     * This method is compatible with `BinaryReadOptions.readUnknownField`.
     */
    export const onRead: UnknownFieldReader = (typeName: string, message: any, fieldNo: number, wireType: WireType, data: Uint8Array) => {
        let container = is(message) ? message[symbol] : message[symbol] = [];
        container.push({no: fieldNo, wireType, data});
    }


    /**
     * Write unknown fields stored for the message to the writer.
     * This method is compatible with `BinaryWriteOptions.writeUnknownFields`.
     */
    export const onWrite: UnknownFieldWriter = (typeName: string, message: any, writer: IBinaryWriter) => {
        for (let {no, wireType, data} of UnknownFieldHandler.list(message))
            writer.tag(no, wireType).raw(data);
    }


    /**
     * List unknown fields stored for the message.
     * Note that there may be multiples fields with the same number.
     */
    export const list = (message: any, fieldNo?: number): UnknownField[] => {
        if (is(message)) {
            let all = message[symbol];
            return fieldNo ? all.filter(uf => uf.no == fieldNo) : all;
        }
        return [];
    }


    /**
     * Returns the last unknown field by field number.
     */
    export const last = (message: any, fieldNo: number): UnknownField | undefined =>
        list(message, fieldNo).slice(-1)[0];


    const is = (message: any): message is UnknownFieldContainer =>
        message && Array.isArray(message[symbol]);

}

interface UnknownField {
    no: number;
    wireType: WireType;
    data: Uint8Array;
}

export interface UnknownFieldContainer {
    [UnknownFieldHandler.symbol]: UnknownField[];
}


/**
 * Make options for writing binary data form partial options.
 */
export function binaryWriteOptions(options?: Partial<BinaryWriteOptions>): Readonly<BinaryWriteOptions> {
    return options ? {...defaultsWrite, ...options} : defaultsWrite;
}


/**
 * Make options for reading binary data form partial options.
 */
export function binaryReadOptions(options?: Partial<BinaryReadOptions>): Readonly<BinaryReadOptions> {
    return options ? {...defaultsRead, ...options} : defaultsRead;
}

const defaultsRead: Readonly<BinaryReadOptions> = {
        readUnknownField: true,
        readerFactory: bytes => new BinaryReader(bytes),
    },
    defaultsWrite: Readonly<BinaryWriteOptions> = {
        writeUnknownFields: true,
        writerFactory: () => new BinaryWriter(),
    }


/**
 * Merges binary write or read options. Later values override earlier values.
 */
export function mergeBinaryOptions<T extends BinaryWriteOptions | BinaryReadOptions>(a?: Partial<T>, b?: Partial<T>): Partial<T> {
    return {...a, ...b};
}


/**
 * This interface is used throughout @protobuf-ts to read
 * protobuf binary format.
 *
 * While not completely compatible, this interface is closely aligned
 * with the `Reader` class of `protobufjs` to make it easier to swap
 * the implementation.
 */
export interface IBinaryReader {

    /**
     * Current position.
     */
    readonly pos: number;

    /**
     * Number of bytes available in this reader.
     */
    readonly len: number;

    /**
     * Reads a tag - field number and wire type.
     */
    tag(): [number, WireType];

    /**
     * Skip one element on the wire and return the skipped data.
     */
    skip(wireType: WireType): Uint8Array;

    /**
     * Read a `int32` field, a signed 32 bit varint.
     */
    uint32(): number;

    /**
     * Read a `sint32` field, a signed, zigzag-encoded 32-bit varint.
     */
    int32(): number;

    /**
     * Read a `sint32` field, a signed, zigzag-encoded 32-bit varint.
     */
    sint32(): number;

    /**
     * Read a `int64` field, a signed 64-bit varint.
     */
    int64(): PbLong;

    /**
     * Read a `sint64` field, a signed, zig-zag-encoded 64-bit varint.
     */
    sint64(): PbLong;

    /**
     * Read a `fixed64` field, a signed, fixed-length 64-bit integer.
     */
    sfixed64(): PbLong;

    /**
     * Read a `uint64` field, an unsigned 64-bit varint.
     */
    uint64(): PbULong;

    /**
     * Read a `fixed64` field, an unsigned, fixed-length 64 bit integer.
     */
    fixed64(): PbULong;

    /**
     * Read a `bool` field, a variant.
     */
    bool(): boolean;

    /**
     * Read a `fixed32` field, an unsigned, fixed-length 32-bit integer.
     */
    fixed32(): number;

    /**
     * Read a `sfixed32` field, a signed, fixed-length 32-bit integer.
     */
    sfixed32(): number;

    /**
     * Read a `float` field, 32-bit floating point number.
     */
    float(): number;

    /**
     * Read a `double` field, a 64-bit floating point number.
     */
    double(): number;

    /**
     * Read a `bytes` field, length-delimited arbitrary data.
     */
    bytes(): Uint8Array;

    /**
     * Read a `string` field, length-delimited data converted to UTF-8 text.
     */
    string(): string;

}


/**
 * This interface is used throughout @protobuf-ts to write
 * protobuf binary format.
 *
 * While not completely compatible, this interface is closely aligned
 * with the `Writer` class of `protobufjs` to make it easier to swap
 * the implementation.
 */
export interface IBinaryWriter {

    /**
     * Return all bytes written and reset this writer.
     */
    finish(): Uint8Array;

    /**
     * Start a new fork for length-delimited data like a message
     * or a packed repeated field.
     *
     * Must be joined later with `join()`.
     */
    fork(): IBinaryWriter;

    /**
     * Join the last fork. Write its length and bytes, then
     * return to the previous state.
     */
    join(): IBinaryWriter;

    /**
     * Writes a tag (field number and wire type).
     *
     * Equivalent to `uint32( (fieldNo << 3 | type) >>> 0 )`
     *
     * Generated code should compute the tag ahead of time and call `uint32()`.
     */
    tag(fieldNo: number, type: WireType): IBinaryWriter;

    /**
     * Write a chunk of raw bytes.
     */
    raw(chunk: Uint8Array): IBinaryWriter;

    /**
     * Write a `uint32` value, an unsigned 32 bit varint.
     */
    uint32(value: number): IBinaryWriter;

    /**
     * Write a `int32` value, a signed 32 bit varint.
     */
    int32(value: number): IBinaryWriter;

    /**
     * Write a `sint32` value, a signed, zigzag-encoded 32-bit varint.
     */
    sint32(value: number): IBinaryWriter;

    /**
     * Write a `int64` value, a signed 64-bit varint.
     */
    int64(value: string | number | bigint): IBinaryWriter;

    /**
     * Write a `uint64` value, an unsigned 64-bit varint.
     */
    uint64(value: string | number | bigint): IBinaryWriter;

    /**
     * Write a `sint64` value, a signed, zig-zag-encoded 64-bit varint.
     */
    sint64(value: string | number | bigint): IBinaryWriter;

    /**
     * Write a `fixed64` value, an unsigned, fixed-length 64 bit integer.
     */
    fixed64(value: string | number | bigint): IBinaryWriter;

    /**
     * Write a `fixed64` value, a signed, fixed-length 64-bit integer.
     */
    sfixed64(value: string | number | bigint): IBinaryWriter;

    /**
     * Write a `bool` value, a variant.
     */
    bool(value: boolean): IBinaryWriter;

    /**
     * Write a `fixed32` value, an unsigned, fixed-length 32-bit integer.
     */
    fixed32(value: number): IBinaryWriter;

    /**
     * Write a `sfixed32` value, a signed, fixed-length 32-bit integer.
     */
    sfixed32(value: number): IBinaryWriter;

    /**
     * Write a `float` value, 32-bit floating point number.
     */
    float(value: number): IBinaryWriter;

    /**
     * Write a `double` value, a 64-bit floating point number.
     */
    double(value: number): IBinaryWriter;

    /**
     * Write a `bytes` value, length-delimited arbitrary data.
     */
    bytes(value: Uint8Array): IBinaryWriter;

    /**
     * Write a `string` value, length-delimited data converted to UTF-8 text.
     */
    string(value: string): IBinaryWriter;

}


/**
 * Protobuf binary format wire types.
 *
 * A wire type provides just enough information to find the length of the
 * following value.
 *
 * See https://developers.google.com/protocol-buffers/docs/encoding#structure
 */
export enum WireType {

    /**
     * Used for int32, int64, uint32, uint64, sint32, sint64, bool, enum
     */
    Varint = 0,

    /**
     * Used for fixed64, sfixed64, double.
     * Always 8 bytes with little-endian byte order.
     */
    Bit64 = 1,

    /**
     * Used for string, bytes, embedded messages, packed repeated fields
     *
     * Only repeated numeric types (types which use the varint, 32-bit,
     * or 64-bit wire types) can be packed. In proto3, such fields are
     * packed by default.
     */
    LengthDelimited = 2,

    /**
     * Used for groups
     * @deprecated
     */
    StartGroup = 3,

    /**
     * Used for groups
     * @deprecated
     */
    EndGroup = 4,

    /**
     * Used for fixed32, sfixed32, float.
     * Always 4 bytes with little-endian byte order.
     */
    Bit32 = 5,
}

