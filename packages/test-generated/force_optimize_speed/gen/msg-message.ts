// @generated by protobuf-ts 2.9.5 with parameter force_optimize_speed,long_type_string
// @generated from protobuf file "msg-message.proto" (package "spec", syntax proto3)
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
 * @generated from protobuf message spec.MessageFieldMessage
 */
export interface MessageFieldMessage {
    /**
     * @generated from protobuf field: spec.MessageFieldMessage.TestMessage message_field = 1;
     */
    messageField?: MessageFieldMessage_TestMessage;
    /**
     * @generated from protobuf field: repeated spec.MessageFieldMessage.TestMessage repeated_message_field = 2;
     */
    repeatedMessageField: MessageFieldMessage_TestMessage[];
}
/**
 * @generated from protobuf message spec.MessageFieldMessage.TestMessage
 */
export interface MessageFieldMessage_TestMessage {
    /**
     * @generated from protobuf field: string name = 1;
     */
    name: string;
}
// @generated message type with reflection information, may provide speed optimized methods
class MessageFieldMessage$Type extends MessageType<MessageFieldMessage> {
    constructor() {
        super("spec.MessageFieldMessage", [
            { no: 1, name: "message_field", kind: "message", T: () => MessageFieldMessage_TestMessage },
            { no: 2, name: "repeated_message_field", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => MessageFieldMessage_TestMessage }
        ]);
    }
    create(value?: PartialMessage<MessageFieldMessage>): MessageFieldMessage {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.repeatedMessageField = [];
        if (value !== undefined)
            reflectionMergePartial<MessageFieldMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MessageFieldMessage): MessageFieldMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* spec.MessageFieldMessage.TestMessage message_field */ 1:
                    message.messageField = MessageFieldMessage_TestMessage.internalBinaryRead(reader, reader.uint32(), options, message.messageField);
                    break;
                case /* repeated spec.MessageFieldMessage.TestMessage repeated_message_field */ 2:
                    message.repeatedMessageField.push(MessageFieldMessage_TestMessage.internalBinaryRead(reader, reader.uint32(), options));
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
    internalBinaryWrite(message: MessageFieldMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* spec.MessageFieldMessage.TestMessage message_field = 1; */
        if (message.messageField)
            MessageFieldMessage_TestMessage.internalBinaryWrite(message.messageField, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* repeated spec.MessageFieldMessage.TestMessage repeated_message_field = 2; */
        for (let i = 0; i < message.repeatedMessageField.length; i++)
            MessageFieldMessage_TestMessage.internalBinaryWrite(message.repeatedMessageField[i], writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message spec.MessageFieldMessage
 */
export const MessageFieldMessage = new MessageFieldMessage$Type();
// @generated message type with reflection information, may provide speed optimized methods
class MessageFieldMessage_TestMessage$Type extends MessageType<MessageFieldMessage_TestMessage> {
    constructor() {
        super("spec.MessageFieldMessage.TestMessage", [
            { no: 1, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<MessageFieldMessage_TestMessage>): MessageFieldMessage_TestMessage {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.name = "";
        if (value !== undefined)
            reflectionMergePartial<MessageFieldMessage_TestMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MessageFieldMessage_TestMessage): MessageFieldMessage_TestMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string name */ 1:
                    message.name = reader.string();
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
    internalBinaryWrite(message: MessageFieldMessage_TestMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string name = 1; */
        if (message.name !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.name);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message spec.MessageFieldMessage.TestMessage
 */
export const MessageFieldMessage_TestMessage = new MessageFieldMessage_TestMessage$Type();
