import type {IMessageType, PartialMessage} from "./message-type-contract";
import type {FieldInfo, PartialFieldInfo} from "./reflection-info";
import {normalizeFieldInfo} from "./reflection-info";
import {ReflectionTypeCheck} from "./reflection-type-check";
import {ReflectionJsonReader} from "./reflection-json-reader";
import {ReflectionJsonWriter} from "./reflection-json-writer";
import {ReflectionBinaryReader} from "./reflection-binary-reader";
import {ReflectionBinaryWriter} from "./reflection-binary-writer";
import {reflectionCreate} from "./reflection-create";
import {reflectionMergePartial} from "./reflection-merge-partial";
import type {JsonValue} from "./json-typings";
import {typeofJsonValue} from "./json-typings";
import type {JsonReadOptions, JsonWriteOptions, JsonWriteStringOptions} from "./json-format-contract";
import {jsonReadOptions, jsonWriteOptions,} from "./json-format-contract";
import type {BinaryReadOptions, BinaryWriteOptions, IBinaryReader, IBinaryWriter} from "./binary-format-contract";
import {reflectionEquals} from "./reflection-equals";
import type {UnknownMessage} from "./unknown-types";
import {binaryWriteOptions} from "./binary-writer";
import {binaryReadOptions} from "./binary-reader";

/**
 * This standard message type provides reflection-based
 * operations to work with a message.
 */
export class MessageType<T extends object> implements IMessageType<T> {

    /**
     * The protobuf type name of the message, including package and
     * parent types if present.
     *
     * If the .proto file included a `package` statement,
     * the type name will always start with a '.'.
     *
     * Examples:
     * 'MyNamespaceLessMessage'
     * '.my_package.MyMessage'
     * '.my_package.ParentMessage.ChildMessage'
     */
    readonly typeName: string;

    /**
     * Simple information for each message field, in the order
     * of declaration in the .proto.
     */
    readonly fields: readonly FieldInfo[];

    /**
     * Contains custom service options from the .proto source in JSON format.
     */
    readonly options: JsonOptionsMap;


    protected readonly defaultCheckDepth = 16;
    protected readonly refTypeCheck: ReflectionTypeCheck;
    protected readonly refJsonReader: ReflectionJsonReader;
    protected readonly refJsonWriter: ReflectionJsonWriter;
    protected readonly refBinReader: ReflectionBinaryReader;
    protected readonly refBinWriter: ReflectionBinaryWriter;

    constructor(name: string, fields: readonly PartialFieldInfo[], options?: JsonOptionsMap) {
        this.typeName = name;
        this.fields = fields.map(normalizeFieldInfo);
        this.options = options ?? {};
        this.refTypeCheck = new ReflectionTypeCheck(this);
        this.refJsonReader = new ReflectionJsonReader(this);
        this.refJsonWriter = new ReflectionJsonWriter(this);
        this.refBinReader = new ReflectionBinaryReader(this);
        this.refBinWriter = new ReflectionBinaryWriter(this);
    }


    /**
     * Create a new message with default values.
     *
     * For example, a protobuf `string name = 1;` has the default value `""`.
     */
    create(): T;


    /**
     * Create a new message from partial data.
     * Where a field is omitted, the default value is used.
     *
     * Unknown fields are discarded.
     *
     * `PartialMessage<T>` is similar to `Partial<T>`,
     * but it is recursive, and it keeps `oneof` groups
     * intact.
     */
    create(value: PartialMessage<T>): T;


    create(value?: PartialMessage<T>): T {
        let message = reflectionCreate(this);
        if (value !== undefined) {
            reflectionMergePartial<T>(this, message, value);
        }
        return message as T;
    }


    /**
     * Clone the message.
     *
     * Unknown fields are discarded.
     */
    clone(message: T): T {
        let copy = this.create();
        reflectionMergePartial<T>(this, copy, message);
        return copy;
    }


    /**
     * Determines whether two message of the same type have the same field values.
     * Checks for deep equality, traversing repeated fields, oneof groups, maps
     * and messages recursively.
     * Will also return true if both messages are `undefined`.
     */
    equals(a: T | undefined, b: T | undefined): boolean {
        return reflectionEquals(this, a as UnknownMessage | undefined, b as UnknownMessage | undefined);
    }


    /**
     * Is the given value assignable to our message type
     * and contains no [excess properties](https://www.typescriptlang.org/docs/handbook/interfaces.html#excess-property-checks)?
     */
    is(arg: any, depth = this.defaultCheckDepth): arg is T {
        return this.refTypeCheck.is(arg, depth, false);
    }


    /**
     * Is the given value assignable to our message type,
     * regardless of [excess properties](https://www.typescriptlang.org/docs/handbook/interfaces.html#excess-property-checks)?
     */
    isAssignable(arg: any, depth = this.defaultCheckDepth): arg is T {
        return this.refTypeCheck.is(arg, depth, true);
    }


    /**
     * Copy partial data into the target message.
     *
     * See MessageCreator.merge() for details.
     */
    mergePartial(target: T, source: PartialMessage<T>): void {
        reflectionMergePartial<T>(this, target, source);
    }


    /**
     * Create a new message from binary format.
     */
    fromBinary(data: Uint8Array, options?: Partial<BinaryReadOptions>): T {
        let opt = binaryReadOptions(options);
        return this.internalBinaryRead(opt.readerFactory(data), data.byteLength, opt);
    }


    /**
     * Read a new message from a JSON value.
     */
    fromJson(json: JsonValue, options?: Partial<JsonReadOptions>): T {
        return this.internalJsonRead(json, jsonReadOptions(options));
    }


    /**
     * Read a new message from a JSON string.
     * This is equivalent to `T.fromJson(JSON.parse(json))`.
     */
    fromJsonString(json: string, options?: Partial<JsonReadOptions>): T {
        let value = JSON.parse(json) as JsonValue;
        return this.fromJson(value, options);
    }


    /**
     * Write the message to canonical JSON value.
     */
    toJson(message: T, options?: Partial<JsonWriteOptions>): JsonValue {
        return this.internalJsonWrite(message, jsonWriteOptions(options));
    }

    /**
     * Convert the message to canonical JSON string.
     * This is equivalent to `JSON.stringify(T.toJson(t))`
     */
    toJsonString(message: T, options?: Partial<JsonWriteStringOptions>): string {
        let value = this.toJson(message, options);
        return JSON.stringify(value, null, options?.prettySpaces ?? 0);
    }


    /**
     * Write the message to binary format.
     */
    toBinary(message: T, options?: Partial<BinaryWriteOptions>): Uint8Array {
        let opt = binaryWriteOptions(options);
        return this.internalBinaryWrite(message, opt.writerFactory(), opt).finish();
    }


    /**
     * This is an internal method. If you just want to read a message from
     * JSON, use `fromJson()` or `fromJsonString()`.
     *
     * Reads JSON value and merges the fields into the target
     * according to protobuf rules. If the target is omitted,
     * a new instance is created first.
     */
    internalJsonRead(json: JsonValue, options: JsonReadOptions, target?: T): T {
        if (json !== null && typeof json == "object" && !Array.isArray(json)) {
            let message = target ?? this.create();
            this.refJsonReader.read(json, message, options);
            return message;
        }
        throw new Error(`Unable to parse message ${this.typeName} from JSON ${typeofJsonValue(json)}.`);
    }


    /**
     * This is an internal method. If you just want to write a message
     * to JSON, use `toJson()` or `toJsonString().
     *
     * Writes JSON value and returns it.
     */
    internalJsonWrite(message: T, options: JsonWriteOptions): JsonValue {
        return this.refJsonWriter.write(message, options);
    }


    /**
     * This is an internal method. If you just want to write a message
     * in binary format, use `toBinary()`.
     *
     * Serializes the message in binary format and appends it to the given
     * writer. Returns passed writer.
     */
    internalBinaryWrite(message: T, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        this.refBinWriter.write(message, writer, options);
        return writer;
    }


    /**
     * This is an internal method. If you just want to read a message from
     * binary data, use `fromBinary()`.
     *
     * Reads data from binary format and merges the fields into
     * the target according to protobuf rules. If the target is
     * omitted, a new instance is created first.
     */
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: T): T {
        let message = target ?? this.create();
        this.refBinReader.read(reader, message, options, length);
        return message as T;
    }

}


type JsonOptionsMap = {
    [extensionName: string]: JsonValue;
};
