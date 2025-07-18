// @generated by protobuf-ts 2.11.1
// @generated from protobuf file "exclude-options.proto" (package "spec", syntax proto3)
// tslint:disable
import { Empty } from "./google/protobuf/empty";
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
 * @generated from protobuf message spec.MessageWithExcludedOptions
 */
export interface MessageWithExcludedOptions {
    /**
     * @generated from protobuf field: int32 field = 1
     */
    field: number;
}
// @generated message type with reflection information, may provide speed optimized methods
class MessageWithExcludedOptions$Type extends MessageType<MessageWithExcludedOptions> {
    constructor() {
        super("spec.MessageWithExcludedOptions", [
            { no: 1, name: "field", kind: "scalar", T: 5 /*ScalarType.INT32*/, options: { "spec.fld_opt2": true, "spec.fld_foo": true } }
        ]);
    }
    create(value?: PartialMessage<MessageWithExcludedOptions>): MessageWithExcludedOptions {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.field = 0;
        if (value !== undefined)
            reflectionMergePartial<MessageWithExcludedOptions>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MessageWithExcludedOptions): MessageWithExcludedOptions {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 field */ 1:
                    message.field = reader.int32();
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
    internalBinaryWrite(message: MessageWithExcludedOptions, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* int32 field = 1; */
        if (message.field !== 0)
            writer.tag(1, WireType.Varint).int32(message.field);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message spec.MessageWithExcludedOptions
 */
export const MessageWithExcludedOptions = new MessageWithExcludedOptions$Type();
/**
 * @generated ServiceType for protobuf service spec.ServiceWithExcludedOptions
 */
export const ServiceWithExcludedOptions = new ServiceType("spec.ServiceWithExcludedOptions", [
    { name: "Test", options: { "spec.mtd_opt2": true, "spec.mtd_foo": true }, I: Empty, O: Empty }
]);
