// @generated by protobuf-ts 2.9.5 with parameter long_type_string
// @generated from protobuf file "wkt-empty.proto" (package "spec", syntax proto3)
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
import { Empty } from "./google/protobuf/empty";
/**
 * @generated from protobuf message spec.EmptyMessage
 */
export interface EmptyMessage {
    /**
     * https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/empty.proto
     * https://github.com/Microsoft/TypeScript/issues/8032
     *
     * @generated from protobuf field: google.protobuf.Empty empty_field = 1;
     */
    emptyField?: Empty;
}
// @generated message type with reflection information, may provide speed optimized methods
class EmptyMessage$Type extends MessageType<EmptyMessage> {
    constructor() {
        super("spec.EmptyMessage", [
            { no: 1, name: "empty_field", kind: "message", T: () => Empty }
        ]);
    }
    create(value?: PartialMessage<EmptyMessage>): EmptyMessage {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<EmptyMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: EmptyMessage): EmptyMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* google.protobuf.Empty empty_field */ 1:
                    message.emptyField = Empty.internalBinaryRead(reader, reader.uint32(), options, message.emptyField);
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
    internalBinaryWrite(message: EmptyMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* google.protobuf.Empty empty_field = 1; */
        if (message.emptyField)
            Empty.internalBinaryWrite(message.emptyField, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message spec.EmptyMessage
 */
export const EmptyMessage = new EmptyMessage$Type();
