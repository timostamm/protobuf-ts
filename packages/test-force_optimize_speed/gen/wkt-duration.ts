// @generated by protobuf-ts 2.9.6 with parameter force_optimize_speed
// @generated from protobuf file "wkt-duration.proto" (package "spec", syntax proto3)
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
import { Duration } from "./google/protobuf/duration";
/**
 * @generated from protobuf message spec.DurationMessage
 */
export interface DurationMessage {
    /**
     * https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/duration.proto
     *
     * @generated from protobuf field: google.protobuf.Duration duration_field = 1;
     */
    durationField?: Duration;
}
// @generated message type with reflection information, may provide speed optimized methods
class DurationMessage$Type extends MessageType<DurationMessage> {
    constructor() {
        super("spec.DurationMessage", [
            { no: 1, name: "duration_field", kind: "message", T: () => Duration }
        ]);
    }
    create(value?: PartialMessage<DurationMessage>): DurationMessage {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<DurationMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: DurationMessage): DurationMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* google.protobuf.Duration duration_field */ 1:
                    message.durationField = Duration.internalBinaryRead(reader, reader.uint32(), options, message.durationField);
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
    internalBinaryWrite(message: DurationMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* google.protobuf.Duration duration_field = 1; */
        if (message.durationField)
            Duration.internalBinaryWrite(message.durationField, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message spec.DurationMessage
 */
export const DurationMessage = new DurationMessage$Type();
