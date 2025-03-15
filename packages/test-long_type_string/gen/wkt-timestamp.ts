// @generated by protobuf-ts 2.9.5 with parameter long_type_string
// @generated from protobuf file "wkt-timestamp.proto" (package "spec", syntax proto3)
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
import { Timestamp } from "./google/protobuf/timestamp";
/**
 * @generated from protobuf message spec.TimestampMessage
 */
export interface TimestampMessage {
    /**
     * https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/timestamp.proto
     *
     * @generated from protobuf field: google.protobuf.Timestamp timestamp_field = 1;
     */
    timestampField?: Timestamp;
}
// @generated message type with reflection information, may provide speed optimized methods
class TimestampMessage$Type extends MessageType<TimestampMessage> {
    constructor() {
        super("spec.TimestampMessage", [
            { no: 1, name: "timestamp_field", kind: "message", T: () => Timestamp }
        ]);
    }
    create(value?: PartialMessage<TimestampMessage>): TimestampMessage {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<TimestampMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TimestampMessage): TimestampMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* google.protobuf.Timestamp timestamp_field */ 1:
                    message.timestampField = Timestamp.internalBinaryRead(reader, reader.uint32(), options, message.timestampField);
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
    internalBinaryWrite(message: TimestampMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* google.protobuf.Timestamp timestamp_field = 1; */
        if (message.timestampField)
            Timestamp.internalBinaryWrite(message.timestampField, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message spec.TimestampMessage
 */
export const TimestampMessage = new TimestampMessage$Type();
