// @generated by protobuf-ts 2.9.5 with parameter long_type_string
// @generated from protobuf file "msg-nesting.proto" (package "spec", syntax proto3)
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
 * @generated from protobuf message spec.ParentMessage
 */
export interface ParentMessage {
    /**
     * @generated from protobuf field: spec.ParentMessage.ChildMessage child = 1;
     */
    child?: ParentMessage_ChildMessage;
    /**
     * @generated from protobuf field: repeated spec.ParentMessage.ChildMessage children = 2;
     */
    children: ParentMessage_ChildMessage[];
    /**
     * @generated from protobuf field: spec.ParentMessage.ChildMessage.ChildEnum child_enum = 3;
     */
    childEnum: ParentMessage_ChildMessage_ChildEnum;
    /**
     * @generated from protobuf field: spec.ParentMessage.ChildMessage.GrandChildMessage grand_child = 4;
     */
    grandChild?: ParentMessage_ChildMessage_GrandChildMessage;
    /**
     * @generated from protobuf field: spec.ParentMessage.ChildMessage.GrandChildMessage other_grand_child = 5;
     */
    otherGrandChild?: ParentMessage_ChildMessage_GrandChildMessage;
}
/**
 * @generated from protobuf message spec.ParentMessage.ChildMessage
 */
export interface ParentMessage_ChildMessage {
    /**
     * @generated from protobuf field: string child = 1;
     */
    child: string;
}
/**
 * @generated from protobuf message spec.ParentMessage.ChildMessage.GrandChildMessage
 */
export interface ParentMessage_ChildMessage_GrandChildMessage {
    /**
     * @generated from protobuf field: string grand_child = 1;
     */
    grandChild: string;
}
/**
 * @generated from protobuf enum spec.ParentMessage.ChildMessage.GrandChildMessage.GrandChildEnum
 */
export enum ParentMessage_ChildMessage_GrandChildMessage_GrandChildEnum {
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
/**
 * @generated from protobuf enum spec.ParentMessage.ChildMessage.ChildEnum
 */
export enum ParentMessage_ChildMessage_ChildEnum {
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
/**
 * @generated from protobuf enum spec.ParentMessage.ParentEnum
 */
export enum ParentMessage_ParentEnum {
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
class ParentMessage$Type extends MessageType<ParentMessage> {
    constructor() {
        super("spec.ParentMessage", [
            { no: 1, name: "child", kind: "message", T: () => ParentMessage_ChildMessage },
            { no: 2, name: "children", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => ParentMessage_ChildMessage },
            { no: 3, name: "child_enum", kind: "enum", T: () => ["spec.ParentMessage.ChildMessage.ChildEnum", ParentMessage_ChildMessage_ChildEnum] },
            { no: 4, name: "grand_child", kind: "message", T: () => ParentMessage_ChildMessage_GrandChildMessage },
            { no: 5, name: "other_grand_child", kind: "message", T: () => ParentMessage_ChildMessage_GrandChildMessage }
        ]);
    }
    create(value?: PartialMessage<ParentMessage>): ParentMessage {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.children = [];
        message.childEnum = 0;
        if (value !== undefined)
            reflectionMergePartial<ParentMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ParentMessage): ParentMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* spec.ParentMessage.ChildMessage child */ 1:
                    message.child = ParentMessage_ChildMessage.internalBinaryRead(reader, reader.uint32(), options, message.child);
                    break;
                case /* repeated spec.ParentMessage.ChildMessage children */ 2:
                    message.children.push(ParentMessage_ChildMessage.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* spec.ParentMessage.ChildMessage.ChildEnum child_enum */ 3:
                    message.childEnum = reader.int32();
                    break;
                case /* spec.ParentMessage.ChildMessage.GrandChildMessage grand_child */ 4:
                    message.grandChild = ParentMessage_ChildMessage_GrandChildMessage.internalBinaryRead(reader, reader.uint32(), options, message.grandChild);
                    break;
                case /* spec.ParentMessage.ChildMessage.GrandChildMessage other_grand_child */ 5:
                    message.otherGrandChild = ParentMessage_ChildMessage_GrandChildMessage.internalBinaryRead(reader, reader.uint32(), options, message.otherGrandChild);
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
    internalBinaryWrite(message: ParentMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* spec.ParentMessage.ChildMessage child = 1; */
        if (message.child)
            ParentMessage_ChildMessage.internalBinaryWrite(message.child, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* repeated spec.ParentMessage.ChildMessage children = 2; */
        for (let i = 0; i < message.children.length; i++)
            ParentMessage_ChildMessage.internalBinaryWrite(message.children[i], writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* spec.ParentMessage.ChildMessage.ChildEnum child_enum = 3; */
        if (message.childEnum !== 0)
            writer.tag(3, WireType.Varint).int32(message.childEnum);
        /* spec.ParentMessage.ChildMessage.GrandChildMessage grand_child = 4; */
        if (message.grandChild)
            ParentMessage_ChildMessage_GrandChildMessage.internalBinaryWrite(message.grandChild, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        /* spec.ParentMessage.ChildMessage.GrandChildMessage other_grand_child = 5; */
        if (message.otherGrandChild)
            ParentMessage_ChildMessage_GrandChildMessage.internalBinaryWrite(message.otherGrandChild, writer.tag(5, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message spec.ParentMessage
 */
export const ParentMessage = new ParentMessage$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ParentMessage_ChildMessage$Type extends MessageType<ParentMessage_ChildMessage> {
    constructor() {
        super("spec.ParentMessage.ChildMessage", [
            { no: 1, name: "child", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<ParentMessage_ChildMessage>): ParentMessage_ChildMessage {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.child = "";
        if (value !== undefined)
            reflectionMergePartial<ParentMessage_ChildMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ParentMessage_ChildMessage): ParentMessage_ChildMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string child */ 1:
                    message.child = reader.string();
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
    internalBinaryWrite(message: ParentMessage_ChildMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string child = 1; */
        if (message.child !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.child);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message spec.ParentMessage.ChildMessage
 */
export const ParentMessage_ChildMessage = new ParentMessage_ChildMessage$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ParentMessage_ChildMessage_GrandChildMessage$Type extends MessageType<ParentMessage_ChildMessage_GrandChildMessage> {
    constructor() {
        super("spec.ParentMessage.ChildMessage.GrandChildMessage", [
            { no: 1, name: "grand_child", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<ParentMessage_ChildMessage_GrandChildMessage>): ParentMessage_ChildMessage_GrandChildMessage {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.grandChild = "";
        if (value !== undefined)
            reflectionMergePartial<ParentMessage_ChildMessage_GrandChildMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ParentMessage_ChildMessage_GrandChildMessage): ParentMessage_ChildMessage_GrandChildMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string grand_child */ 1:
                    message.grandChild = reader.string();
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
    internalBinaryWrite(message: ParentMessage_ChildMessage_GrandChildMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string grand_child = 1; */
        if (message.grandChild !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.grandChild);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message spec.ParentMessage.ChildMessage.GrandChildMessage
 */
export const ParentMessage_ChildMessage_GrandChildMessage = new ParentMessage_ChildMessage_GrandChildMessage$Type();
