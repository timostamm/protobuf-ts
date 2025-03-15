// @generated by protobuf-ts 2.9.5 with parameter force_optimize_speed
// @generated from protobuf file "wkt-field-mask.proto" (package "spec", syntax proto3)
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
import { FieldMask } from "./google/protobuf/field_mask";
/**
 * @generated from protobuf message spec.FieldMaskMessage
 */
export interface FieldMaskMessage {
    /**
     * https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/field_mask.proto
     *
     * @generated from protobuf field: google.protobuf.FieldMask field_mask_field = 1;
     */
    fieldMaskField?: FieldMask;
}
// @generated message type with reflection information, may provide speed optimized methods
class FieldMaskMessage$Type extends MessageType<FieldMaskMessage> {
    constructor() {
        super("spec.FieldMaskMessage", [
            { no: 1, name: "field_mask_field", kind: "message", T: () => FieldMask }
        ]);
    }
    create(value?: PartialMessage<FieldMaskMessage>): FieldMaskMessage {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<FieldMaskMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: FieldMaskMessage): FieldMaskMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* google.protobuf.FieldMask field_mask_field */ 1:
                    message.fieldMaskField = FieldMask.internalBinaryRead(reader, reader.uint32(), options, message.fieldMaskField);
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
    internalBinaryWrite(message: FieldMaskMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* google.protobuf.FieldMask field_mask_field = 1; */
        if (message.fieldMaskField)
            FieldMask.internalBinaryWrite(message.fieldMaskField, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message spec.FieldMaskMessage
 */
export const FieldMaskMessage = new FieldMaskMessage$Type();
