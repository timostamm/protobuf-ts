// @generated by protobuf-ts 2.9.5 with parameter force_optimize_speed,long_type_string
// @generated from protobuf file "msg-oneofs.proto" (package "spec", syntax proto3)
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
 * Oneof with 2 scalar members
 *
 * @generated from protobuf message spec.OneofScalarMemberMessage
 */
export interface OneofScalarMemberMessage {
    /**
     * @generated from protobuf oneof: result
     */
    result: {
        oneofKind: "value";
        /**
         * Contains the value if result available
         *
         * @generated from protobuf field: int32 value = 1;
         */
        value: number;
    } | {
        oneofKind: "error";
        /**
         * Contains error message if result not available
         *
         * @generated from protobuf field: string error = 2;
         */
        error: string;
    } | {
        oneofKind: undefined;
    };
}
/**
 * Oneof with 2 message members
 *
 * @generated from protobuf message spec.OneofMessageMemberMessage
 */
export interface OneofMessageMemberMessage {
    /**
     * @generated from protobuf oneof: objects
     */
    objects: {
        oneofKind: "a";
        /**
         * @generated from protobuf field: spec.OneofMessageMemberMessage.TestMessageA a = 1;
         */
        a: OneofMessageMemberMessage_TestMessageA;
    } | {
        oneofKind: "b";
        /**
         * @generated from protobuf field: spec.OneofMessageMemberMessage.TestMessageB b = 2;
         */
        b: OneofMessageMemberMessage_TestMessageB;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message spec.OneofMessageMemberMessage.TestMessageA
 */
export interface OneofMessageMemberMessage_TestMessageA {
    /**
     * @generated from protobuf field: string name = 1;
     */
    name: string;
}
/**
 * @generated from protobuf message spec.OneofMessageMemberMessage.TestMessageB
 */
export interface OneofMessageMemberMessage_TestMessageB {
    /**
     * @generated from protobuf field: string name = 1;
     */
    name: string;
}
// @generated message type with reflection information, may provide speed optimized methods
class OneofScalarMemberMessage$Type extends MessageType<OneofScalarMemberMessage> {
    constructor() {
        super("spec.OneofScalarMemberMessage", [
            { no: 1, name: "value", kind: "scalar", oneof: "result", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "error", kind: "scalar", oneof: "result", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<OneofScalarMemberMessage>): OneofScalarMemberMessage {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.result = { oneofKind: undefined };
        if (value !== undefined)
            reflectionMergePartial<OneofScalarMemberMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: OneofScalarMemberMessage): OneofScalarMemberMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 value */ 1:
                    message.result = {
                        oneofKind: "value",
                        value: reader.int32()
                    };
                    break;
                case /* string error */ 2:
                    message.result = {
                        oneofKind: "error",
                        error: reader.string()
                    };
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
    internalBinaryWrite(message: OneofScalarMemberMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* int32 value = 1; */
        if (message.result.oneofKind === "value")
            writer.tag(1, WireType.Varint).int32(message.result.value);
        /* string error = 2; */
        if (message.result.oneofKind === "error")
            writer.tag(2, WireType.LengthDelimited).string(message.result.error);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message spec.OneofScalarMemberMessage
 */
export const OneofScalarMemberMessage = new OneofScalarMemberMessage$Type();
// @generated message type with reflection information, may provide speed optimized methods
class OneofMessageMemberMessage$Type extends MessageType<OneofMessageMemberMessage> {
    constructor() {
        super("spec.OneofMessageMemberMessage", [
            { no: 1, name: "a", kind: "message", oneof: "objects", T: () => OneofMessageMemberMessage_TestMessageA },
            { no: 2, name: "b", kind: "message", oneof: "objects", T: () => OneofMessageMemberMessage_TestMessageB }
        ]);
    }
    create(value?: PartialMessage<OneofMessageMemberMessage>): OneofMessageMemberMessage {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.objects = { oneofKind: undefined };
        if (value !== undefined)
            reflectionMergePartial<OneofMessageMemberMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: OneofMessageMemberMessage): OneofMessageMemberMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* spec.OneofMessageMemberMessage.TestMessageA a */ 1:
                    message.objects = {
                        oneofKind: "a",
                        a: OneofMessageMemberMessage_TestMessageA.internalBinaryRead(reader, reader.uint32(), options, (message.objects as any).a)
                    };
                    break;
                case /* spec.OneofMessageMemberMessage.TestMessageB b */ 2:
                    message.objects = {
                        oneofKind: "b",
                        b: OneofMessageMemberMessage_TestMessageB.internalBinaryRead(reader, reader.uint32(), options, (message.objects as any).b)
                    };
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
    internalBinaryWrite(message: OneofMessageMemberMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* spec.OneofMessageMemberMessage.TestMessageA a = 1; */
        if (message.objects.oneofKind === "a")
            OneofMessageMemberMessage_TestMessageA.internalBinaryWrite(message.objects.a, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* spec.OneofMessageMemberMessage.TestMessageB b = 2; */
        if (message.objects.oneofKind === "b")
            OneofMessageMemberMessage_TestMessageB.internalBinaryWrite(message.objects.b, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message spec.OneofMessageMemberMessage
 */
export const OneofMessageMemberMessage = new OneofMessageMemberMessage$Type();
// @generated message type with reflection information, may provide speed optimized methods
class OneofMessageMemberMessage_TestMessageA$Type extends MessageType<OneofMessageMemberMessage_TestMessageA> {
    constructor() {
        super("spec.OneofMessageMemberMessage.TestMessageA", [
            { no: 1, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<OneofMessageMemberMessage_TestMessageA>): OneofMessageMemberMessage_TestMessageA {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.name = "";
        if (value !== undefined)
            reflectionMergePartial<OneofMessageMemberMessage_TestMessageA>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: OneofMessageMemberMessage_TestMessageA): OneofMessageMemberMessage_TestMessageA {
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
    internalBinaryWrite(message: OneofMessageMemberMessage_TestMessageA, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
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
 * @generated MessageType for protobuf message spec.OneofMessageMemberMessage.TestMessageA
 */
export const OneofMessageMemberMessage_TestMessageA = new OneofMessageMemberMessage_TestMessageA$Type();
// @generated message type with reflection information, may provide speed optimized methods
class OneofMessageMemberMessage_TestMessageB$Type extends MessageType<OneofMessageMemberMessage_TestMessageB> {
    constructor() {
        super("spec.OneofMessageMemberMessage.TestMessageB", [
            { no: 1, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<OneofMessageMemberMessage_TestMessageB>): OneofMessageMemberMessage_TestMessageB {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.name = "";
        if (value !== undefined)
            reflectionMergePartial<OneofMessageMemberMessage_TestMessageB>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: OneofMessageMemberMessage_TestMessageB): OneofMessageMemberMessage_TestMessageB {
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
    internalBinaryWrite(message: OneofMessageMemberMessage_TestMessageB, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
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
 * @generated MessageType for protobuf message spec.OneofMessageMemberMessage.TestMessageB
 */
export const OneofMessageMemberMessage_TestMessageB = new OneofMessageMemberMessage_TestMessageB$Type();
