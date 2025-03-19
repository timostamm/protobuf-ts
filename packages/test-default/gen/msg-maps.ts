// @generated by protobuf-ts 2.9.6
// @generated from protobuf file "msg-maps.proto" (package "spec", syntax proto3)
// tslint:disable
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message spec.ScalarMapsMessage
 */
export interface ScalarMapsMessage {
    /**
     * @generated from protobuf field: map<string, string> str_str_field = 1;
     */
    strStrField: {
        [key: string]: string;
    };
    /**
     * @generated from protobuf field: map<string, int32> str_int32_field = 2;
     */
    strInt32Field: {
        [key: string]: number;
    };
    /**
     * @generated from protobuf field: map<string, int64> str_int64_field = 3;
     */
    strInt64Field: {
        [key: string]: bigint;
    };
    /**
     * @generated from protobuf field: map<string, bool> str_bool_field = 4;
     */
    strBoolField: {
        [key: string]: boolean;
    };
    /**
     * @generated from protobuf field: map<string, bytes> str_bytes_field = 5;
     */
    strBytesField: {
        [key: string]: Uint8Array;
    };
    /**
     * @generated from protobuf field: map<int32, string> int32_str_field = 6;
     */
    int32StrField: {
        [key: number]: string;
    };
    /**
     * @generated from protobuf field: map<int64, string> int64_str_field = 7;
     */
    int64StrField: {
        [key: string]: string;
    };
    /**
     * @generated from protobuf field: map<bool, string> bool_str_field = 8;
     */
    boolStrField: {
        [key: string]: string;
    };
}
/**
 * @generated from protobuf message spec.MessageMapMessage
 */
export interface MessageMapMessage {
    /**
     * @generated from protobuf field: map<string, spec.MessageMapMessage.MyItem> str_msg_field = 1;
     */
    strMsgField: {
        [key: string]: MessageMapMessage_MyItem;
    };
    /**
     * @generated from protobuf field: map<int32, spec.MessageMapMessage.MyItem> int32_msg_field = 2;
     */
    int32MsgField: {
        [key: number]: MessageMapMessage_MyItem;
    };
    /**
     * @generated from protobuf field: map<int64, spec.MessageMapMessage.MyItem> int64_msg_field = 3;
     */
    int64MsgField: {
        [key: string]: MessageMapMessage_MyItem;
    };
}
/**
 * @generated from protobuf message spec.MessageMapMessage.MyItem
 */
export interface MessageMapMessage_MyItem {
    /**
     * @generated from protobuf field: string text = 1;
     */
    text: string;
}
/**
 * @generated from protobuf message spec.EnumMapMessage
 */
export interface EnumMapMessage {
    /**
     * @generated from protobuf field: map<string, spec.EnumMapMessage.MyEnum> str_enu_field = 1;
     */
    strEnuField: {
        [key: string]: EnumMapMessage_MyEnum;
    };
    /**
     * @generated from protobuf field: map<int32, spec.EnumMapMessage.MyEnum> int32_enu_field = 2;
     */
    int32EnuField: {
        [key: number]: EnumMapMessage_MyEnum;
    };
    /**
     * @generated from protobuf field: map<int64, spec.EnumMapMessage.MyEnum> int64_enu_field = 3;
     */
    int64EnuField: {
        [key: string]: EnumMapMessage_MyEnum;
    };
}
/**
 * @generated from protobuf enum spec.EnumMapMessage.MyEnum
 */
export enum EnumMapMessage_MyEnum {
    /**
     * @generated from protobuf enum value: ANY = 0;
     */
    ANY = 0,
    /**
     * @generated from protobuf enum value: YES = 1;
     */
    YES = 1,
    /**
     * @generated from protobuf enum value: NO = 2;
     */
    NO = 2
}
// @generated message type with reflection information, may provide speed optimized methods
class ScalarMapsMessage$Type extends MessageType<ScalarMapsMessage> {
    constructor() {
        super("spec.ScalarMapsMessage", [
            { no: 1, name: "str_str_field", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } },
            { no: 2, name: "str_int32_field", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 5 /*ScalarType.INT32*/ } },
            { no: 3, name: "str_int64_field", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 0 /*LongType.BIGINT*/ } },
            { no: 4, name: "str_bool_field", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 8 /*ScalarType.BOOL*/ } },
            { no: 5, name: "str_bytes_field", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 12 /*ScalarType.BYTES*/ } },
            { no: 6, name: "int32_str_field", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } },
            { no: 7, name: "int64_str_field", kind: "map", K: 3 /*ScalarType.INT64*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } },
            { no: 8, name: "bool_str_field", kind: "map", K: 8 /*ScalarType.BOOL*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } }
        ]);
    }
    create(value?: PartialMessage<ScalarMapsMessage>): ScalarMapsMessage {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.strStrField = {};
        message.strInt32Field = {};
        message.strInt64Field = {};
        message.strBoolField = {};
        message.strBytesField = {};
        message.int32StrField = {};
        message.int64StrField = {};
        message.boolStrField = {};
        if (value !== undefined)
            reflectionMergePartial<ScalarMapsMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ScalarMapsMessage): ScalarMapsMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* map<string, string> str_str_field */ 1:
                    this.binaryReadMap1(message.strStrField, reader, options);
                    break;
                case /* map<string, int32> str_int32_field */ 2:
                    this.binaryReadMap2(message.strInt32Field, reader, options);
                    break;
                case /* map<string, int64> str_int64_field */ 3:
                    this.binaryReadMap3(message.strInt64Field, reader, options);
                    break;
                case /* map<string, bool> str_bool_field */ 4:
                    this.binaryReadMap4(message.strBoolField, reader, options);
                    break;
                case /* map<string, bytes> str_bytes_field */ 5:
                    this.binaryReadMap5(message.strBytesField, reader, options);
                    break;
                case /* map<int32, string> int32_str_field */ 6:
                    this.binaryReadMap6(message.int32StrField, reader, options);
                    break;
                case /* map<int64, string> int64_str_field */ 7:
                    this.binaryReadMap7(message.int64StrField, reader, options);
                    break;
                case /* map<bool, string> bool_str_field */ 8:
                    this.binaryReadMap8(message.boolStrField, reader, options);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    private binaryReadMap1(map: ScalarMapsMessage["strStrField"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof ScalarMapsMessage["strStrField"] | undefined, val: ScalarMapsMessage["strStrField"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = reader.string();
                    break;
                default: throw new globalThis.Error("unknown map entry field for field spec.ScalarMapsMessage.str_str_field");
            }
        }
        map[key ?? ""] = val ?? "";
    }
    private binaryReadMap2(map: ScalarMapsMessage["strInt32Field"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof ScalarMapsMessage["strInt32Field"] | undefined, val: ScalarMapsMessage["strInt32Field"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = reader.int32();
                    break;
                default: throw new globalThis.Error("unknown map entry field for field spec.ScalarMapsMessage.str_int32_field");
            }
        }
        map[key ?? ""] = val ?? 0;
    }
    private binaryReadMap3(map: ScalarMapsMessage["strInt64Field"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof ScalarMapsMessage["strInt64Field"] | undefined, val: ScalarMapsMessage["strInt64Field"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = reader.int64().toBigInt();
                    break;
                default: throw new globalThis.Error("unknown map entry field for field spec.ScalarMapsMessage.str_int64_field");
            }
        }
        map[key ?? ""] = val ?? 0n;
    }
    private binaryReadMap4(map: ScalarMapsMessage["strBoolField"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof ScalarMapsMessage["strBoolField"] | undefined, val: ScalarMapsMessage["strBoolField"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = reader.bool();
                    break;
                default: throw new globalThis.Error("unknown map entry field for field spec.ScalarMapsMessage.str_bool_field");
            }
        }
        map[key ?? ""] = val ?? false;
    }
    private binaryReadMap5(map: ScalarMapsMessage["strBytesField"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof ScalarMapsMessage["strBytesField"] | undefined, val: ScalarMapsMessage["strBytesField"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = reader.bytes();
                    break;
                default: throw new globalThis.Error("unknown map entry field for field spec.ScalarMapsMessage.str_bytes_field");
            }
        }
        map[key ?? ""] = val ?? new Uint8Array(0);
    }
    private binaryReadMap6(map: ScalarMapsMessage["int32StrField"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof ScalarMapsMessage["int32StrField"] | undefined, val: ScalarMapsMessage["int32StrField"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.int32();
                    break;
                case 2:
                    val = reader.string();
                    break;
                default: throw new globalThis.Error("unknown map entry field for field spec.ScalarMapsMessage.int32_str_field");
            }
        }
        map[key ?? 0] = val ?? "";
    }
    private binaryReadMap7(map: ScalarMapsMessage["int64StrField"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof ScalarMapsMessage["int64StrField"] | undefined, val: ScalarMapsMessage["int64StrField"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.int64().toString();
                    break;
                case 2:
                    val = reader.string();
                    break;
                default: throw new globalThis.Error("unknown map entry field for field spec.ScalarMapsMessage.int64_str_field");
            }
        }
        map[key ?? "0"] = val ?? "";
    }
    private binaryReadMap8(map: ScalarMapsMessage["boolStrField"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof ScalarMapsMessage["boolStrField"] | undefined, val: ScalarMapsMessage["boolStrField"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.bool().toString();
                    break;
                case 2:
                    val = reader.string();
                    break;
                default: throw new globalThis.Error("unknown map entry field for field spec.ScalarMapsMessage.bool_str_field");
            }
        }
        map[key ?? "false"] = val ?? "";
    }
    internalBinaryWrite(message: ScalarMapsMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* map<string, string> str_str_field = 1; */
        for (let k of globalThis.Object.keys(message.strStrField))
            writer.tag(1, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k).tag(2, WireType.LengthDelimited).string(message.strStrField[k]).join();
        /* map<string, int32> str_int32_field = 2; */
        for (let k of globalThis.Object.keys(message.strInt32Field))
            writer.tag(2, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k).tag(2, WireType.Varint).int32(message.strInt32Field[k]).join();
        /* map<string, int64> str_int64_field = 3; */
        for (let k of globalThis.Object.keys(message.strInt64Field))
            writer.tag(3, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k).tag(2, WireType.Varint).int64(message.strInt64Field[k]).join();
        /* map<string, bool> str_bool_field = 4; */
        for (let k of globalThis.Object.keys(message.strBoolField))
            writer.tag(4, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k).tag(2, WireType.Varint).bool(message.strBoolField[k]).join();
        /* map<string, bytes> str_bytes_field = 5; */
        for (let k of globalThis.Object.keys(message.strBytesField))
            writer.tag(5, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k).tag(2, WireType.LengthDelimited).bytes(message.strBytesField[k]).join();
        /* map<int32, string> int32_str_field = 6; */
        for (let k of globalThis.Object.keys(message.int32StrField))
            writer.tag(6, WireType.LengthDelimited).fork().tag(1, WireType.Varint).int32(parseInt(k)).tag(2, WireType.LengthDelimited).string(message.int32StrField[k as any]).join();
        /* map<int64, string> int64_str_field = 7; */
        for (let k of globalThis.Object.keys(message.int64StrField))
            writer.tag(7, WireType.LengthDelimited).fork().tag(1, WireType.Varint).int64(k).tag(2, WireType.LengthDelimited).string(message.int64StrField[k]).join();
        /* map<bool, string> bool_str_field = 8; */
        for (let k of globalThis.Object.keys(message.boolStrField))
            writer.tag(8, WireType.LengthDelimited).fork().tag(1, WireType.Varint).bool(k === "true").tag(2, WireType.LengthDelimited).string(message.boolStrField[k]).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message spec.ScalarMapsMessage
 */
export const ScalarMapsMessage = new ScalarMapsMessage$Type();
// @generated message type with reflection information, may provide speed optimized methods
class MessageMapMessage$Type extends MessageType<MessageMapMessage> {
    constructor() {
        super("spec.MessageMapMessage", [
            { no: 1, name: "str_msg_field", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "message", T: () => MessageMapMessage_MyItem } },
            { no: 2, name: "int32_msg_field", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "message", T: () => MessageMapMessage_MyItem } },
            { no: 3, name: "int64_msg_field", kind: "map", K: 3 /*ScalarType.INT64*/, V: { kind: "message", T: () => MessageMapMessage_MyItem } }
        ]);
    }
    create(value?: PartialMessage<MessageMapMessage>): MessageMapMessage {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.strMsgField = {};
        message.int32MsgField = {};
        message.int64MsgField = {};
        if (value !== undefined)
            reflectionMergePartial<MessageMapMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MessageMapMessage): MessageMapMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* map<string, spec.MessageMapMessage.MyItem> str_msg_field */ 1:
                    this.binaryReadMap1(message.strMsgField, reader, options);
                    break;
                case /* map<int32, spec.MessageMapMessage.MyItem> int32_msg_field */ 2:
                    this.binaryReadMap2(message.int32MsgField, reader, options);
                    break;
                case /* map<int64, spec.MessageMapMessage.MyItem> int64_msg_field */ 3:
                    this.binaryReadMap3(message.int64MsgField, reader, options);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    private binaryReadMap1(map: MessageMapMessage["strMsgField"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof MessageMapMessage["strMsgField"] | undefined, val: MessageMapMessage["strMsgField"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = MessageMapMessage_MyItem.internalBinaryRead(reader, reader.uint32(), options);
                    break;
                default: throw new globalThis.Error("unknown map entry field for field spec.MessageMapMessage.str_msg_field");
            }
        }
        map[key ?? ""] = val ?? MessageMapMessage_MyItem.create();
    }
    private binaryReadMap2(map: MessageMapMessage["int32MsgField"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof MessageMapMessage["int32MsgField"] | undefined, val: MessageMapMessage["int32MsgField"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.int32();
                    break;
                case 2:
                    val = MessageMapMessage_MyItem.internalBinaryRead(reader, reader.uint32(), options);
                    break;
                default: throw new globalThis.Error("unknown map entry field for field spec.MessageMapMessage.int32_msg_field");
            }
        }
        map[key ?? 0] = val ?? MessageMapMessage_MyItem.create();
    }
    private binaryReadMap3(map: MessageMapMessage["int64MsgField"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof MessageMapMessage["int64MsgField"] | undefined, val: MessageMapMessage["int64MsgField"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.int64().toString();
                    break;
                case 2:
                    val = MessageMapMessage_MyItem.internalBinaryRead(reader, reader.uint32(), options);
                    break;
                default: throw new globalThis.Error("unknown map entry field for field spec.MessageMapMessage.int64_msg_field");
            }
        }
        map[key ?? "0"] = val ?? MessageMapMessage_MyItem.create();
    }
    internalBinaryWrite(message: MessageMapMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* map<string, spec.MessageMapMessage.MyItem> str_msg_field = 1; */
        for (let k of globalThis.Object.keys(message.strMsgField)) {
            writer.tag(1, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k);
            writer.tag(2, WireType.LengthDelimited).fork();
            MessageMapMessage_MyItem.internalBinaryWrite(message.strMsgField[k], writer, options);
            writer.join().join();
        }
        /* map<int32, spec.MessageMapMessage.MyItem> int32_msg_field = 2; */
        for (let k of globalThis.Object.keys(message.int32MsgField)) {
            writer.tag(2, WireType.LengthDelimited).fork().tag(1, WireType.Varint).int32(parseInt(k));
            writer.tag(2, WireType.LengthDelimited).fork();
            MessageMapMessage_MyItem.internalBinaryWrite(message.int32MsgField[k as any], writer, options);
            writer.join().join();
        }
        /* map<int64, spec.MessageMapMessage.MyItem> int64_msg_field = 3; */
        for (let k of globalThis.Object.keys(message.int64MsgField)) {
            writer.tag(3, WireType.LengthDelimited).fork().tag(1, WireType.Varint).int64(k);
            writer.tag(2, WireType.LengthDelimited).fork();
            MessageMapMessage_MyItem.internalBinaryWrite(message.int64MsgField[k], writer, options);
            writer.join().join();
        }
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message spec.MessageMapMessage
 */
export const MessageMapMessage = new MessageMapMessage$Type();
// @generated message type with reflection information, may provide speed optimized methods
class MessageMapMessage_MyItem$Type extends MessageType<MessageMapMessage_MyItem> {
    constructor() {
        super("spec.MessageMapMessage.MyItem", [
            { no: 1, name: "text", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<MessageMapMessage_MyItem>): MessageMapMessage_MyItem {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.text = "";
        if (value !== undefined)
            reflectionMergePartial<MessageMapMessage_MyItem>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MessageMapMessage_MyItem): MessageMapMessage_MyItem {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string text */ 1:
                    message.text = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: MessageMapMessage_MyItem, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string text = 1; */
        if (message.text !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.text);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message spec.MessageMapMessage.MyItem
 */
export const MessageMapMessage_MyItem = new MessageMapMessage_MyItem$Type();
// @generated message type with reflection information, may provide speed optimized methods
class EnumMapMessage$Type extends MessageType<EnumMapMessage> {
    constructor() {
        super("spec.EnumMapMessage", [
            { no: 1, name: "str_enu_field", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "enum", T: () => ["spec.EnumMapMessage.MyEnum", EnumMapMessage_MyEnum] } },
            { no: 2, name: "int32_enu_field", kind: "map", K: 5 /*ScalarType.INT32*/, V: { kind: "enum", T: () => ["spec.EnumMapMessage.MyEnum", EnumMapMessage_MyEnum] } },
            { no: 3, name: "int64_enu_field", kind: "map", K: 3 /*ScalarType.INT64*/, V: { kind: "enum", T: () => ["spec.EnumMapMessage.MyEnum", EnumMapMessage_MyEnum] } }
        ]);
    }
    create(value?: PartialMessage<EnumMapMessage>): EnumMapMessage {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.strEnuField = {};
        message.int32EnuField = {};
        message.int64EnuField = {};
        if (value !== undefined)
            reflectionMergePartial<EnumMapMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: EnumMapMessage): EnumMapMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* map<string, spec.EnumMapMessage.MyEnum> str_enu_field */ 1:
                    this.binaryReadMap1(message.strEnuField, reader, options);
                    break;
                case /* map<int32, spec.EnumMapMessage.MyEnum> int32_enu_field */ 2:
                    this.binaryReadMap2(message.int32EnuField, reader, options);
                    break;
                case /* map<int64, spec.EnumMapMessage.MyEnum> int64_enu_field */ 3:
                    this.binaryReadMap3(message.int64EnuField, reader, options);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    private binaryReadMap1(map: EnumMapMessage["strEnuField"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof EnumMapMessage["strEnuField"] | undefined, val: EnumMapMessage["strEnuField"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = reader.int32();
                    break;
                default: throw new globalThis.Error("unknown map entry field for field spec.EnumMapMessage.str_enu_field");
            }
        }
        map[key ?? ""] = val ?? 0;
    }
    private binaryReadMap2(map: EnumMapMessage["int32EnuField"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof EnumMapMessage["int32EnuField"] | undefined, val: EnumMapMessage["int32EnuField"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.int32();
                    break;
                case 2:
                    val = reader.int32();
                    break;
                default: throw new globalThis.Error("unknown map entry field for field spec.EnumMapMessage.int32_enu_field");
            }
        }
        map[key ?? 0] = val ?? 0;
    }
    private binaryReadMap3(map: EnumMapMessage["int64EnuField"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof EnumMapMessage["int64EnuField"] | undefined, val: EnumMapMessage["int64EnuField"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.int64().toString();
                    break;
                case 2:
                    val = reader.int32();
                    break;
                default: throw new globalThis.Error("unknown map entry field for field spec.EnumMapMessage.int64_enu_field");
            }
        }
        map[key ?? "0"] = val ?? 0;
    }
    internalBinaryWrite(message: EnumMapMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* map<string, spec.EnumMapMessage.MyEnum> str_enu_field = 1; */
        for (let k of globalThis.Object.keys(message.strEnuField))
            writer.tag(1, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k).tag(2, WireType.Varint).int32(message.strEnuField[k]).join();
        /* map<int32, spec.EnumMapMessage.MyEnum> int32_enu_field = 2; */
        for (let k of globalThis.Object.keys(message.int32EnuField))
            writer.tag(2, WireType.LengthDelimited).fork().tag(1, WireType.Varint).int32(parseInt(k)).tag(2, WireType.Varint).int32(message.int32EnuField[k as any]).join();
        /* map<int64, spec.EnumMapMessage.MyEnum> int64_enu_field = 3; */
        for (let k of globalThis.Object.keys(message.int64EnuField))
            writer.tag(3, WireType.LengthDelimited).fork().tag(1, WireType.Varint).int64(k).tag(2, WireType.Varint).int32(message.int64EnuField[k]).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message spec.EnumMapMessage
 */
export const EnumMapMessage = new EnumMapMessage$Type();
