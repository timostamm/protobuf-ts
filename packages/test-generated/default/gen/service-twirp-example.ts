// @generated by protobuf-ts 2.9.5
// @generated from protobuf file "service-twirp-example.proto" (package "spec.haberdasher", syntax proto3)
// tslint:disable
//
// Twirp example RPC
// https://github.com/twitchtv/twirp-example/blob/c1501aeb89609a522db7d79d4c2e71b6c032af28/rpc/haberdasher/haberdasher.proto
//
import { ServiceType } from "@protobuf-ts/runtime-rpc";
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
 * A Hat is a piece of headwear made by a Haberdasher.
 *
 * @generated from protobuf message spec.haberdasher.Hat
 */
export interface Hat {
    /**
     * The size of a hat should always be in inches.
     *
     * @generated from protobuf field: int32 size = 1;
     */
    size: number;
    /**
     * The color of a hat will never be 'invisible', but other than
     * that, anything is fair game.
     *
     * @generated from protobuf field: string color = 2;
     */
    color: string;
    /**
     * The name of a hat is it's type. Like, 'bowler', or something.
     *
     * @generated from protobuf field: string name = 3;
     */
    name: string;
}
/**
 * Size is passed when requesting a new hat to be made. It's always measured in
 * inches.
 *
 * @generated from protobuf message spec.haberdasher.Size
 */
export interface Size {
    /**
     * @generated from protobuf field: int32 inches = 1;
     */
    inches: number;
}
// @generated message type with reflection information, may provide speed optimized methods
class Hat$Type extends MessageType<Hat> {
    constructor() {
        super("spec.haberdasher.Hat", [
            { no: 1, name: "size", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "color", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<Hat>): Hat {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.size = 0;
        message.color = "";
        message.name = "";
        if (value !== undefined)
            reflectionMergePartial<Hat>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Hat): Hat {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 size */ 1:
                    message.size = reader.int32();
                    break;
                case /* string color */ 2:
                    message.color = reader.string();
                    break;
                case /* string name */ 3:
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
    internalBinaryWrite(message: Hat, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* int32 size = 1; */
        if (message.size !== 0)
            writer.tag(1, WireType.Varint).int32(message.size);
        /* string color = 2; */
        if (message.color !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.color);
        /* string name = 3; */
        if (message.name !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.name);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message spec.haberdasher.Hat
 */
export const Hat = new Hat$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Size$Type extends MessageType<Size> {
    constructor() {
        super("spec.haberdasher.Size", [
            { no: 1, name: "inches", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
    create(value?: PartialMessage<Size>): Size {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.inches = 0;
        if (value !== undefined)
            reflectionMergePartial<Size>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Size): Size {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 inches */ 1:
                    message.inches = reader.int32();
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
    internalBinaryWrite(message: Size, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* int32 inches = 1; */
        if (message.inches !== 0)
            writer.tag(1, WireType.Varint).int32(message.inches);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message spec.haberdasher.Size
 */
export const Size = new Size$Type();
/**
 * @generated ServiceType for protobuf service spec.haberdasher.Haberdasher
 */
export const Haberdasher = new ServiceType("spec.haberdasher.Haberdasher", [
    { name: "MakeHat", options: {}, I: Size, O: Hat }
]);
