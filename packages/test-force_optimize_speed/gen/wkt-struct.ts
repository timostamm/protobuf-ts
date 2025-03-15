// @generated by protobuf-ts 2.9.5 with parameter force_optimize_speed
// @generated from protobuf file "wkt-struct.proto" (package "spec", syntax proto3)
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
import { Struct } from "./google/protobuf/struct";
/**
 * @generated from protobuf message spec.StructMessage
 */
export interface StructMessage {
    /**
     * @generated from protobuf field: google.protobuf.Struct struct_field = 1;
     */
    structField?: Struct;
}
// @generated message type with reflection information, may provide speed optimized methods
class StructMessage$Type extends MessageType<StructMessage> {
    constructor() {
        super("spec.StructMessage", [
            { no: 1, name: "struct_field", kind: "message", T: () => Struct }
        ]);
    }
    create(value?: PartialMessage<StructMessage>): StructMessage {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<StructMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: StructMessage): StructMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* google.protobuf.Struct struct_field */ 1:
                    message.structField = Struct.internalBinaryRead(reader, reader.uint32(), options, message.structField);
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
    internalBinaryWrite(message: StructMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* google.protobuf.Struct struct_field = 1; */
        if (message.structField)
            Struct.internalBinaryWrite(message.structField, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message spec.StructMessage
 */
export const StructMessage = new StructMessage$Type();
