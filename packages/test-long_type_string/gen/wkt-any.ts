// @generated by protobuf-ts 2.9.6 with parameter long_type_string
// @generated from protobuf file "wkt-any.proto" (package "spec", syntax proto3)
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
import { Any } from "./google/protobuf/any";
/**
 * @generated from protobuf message spec.AnyMessage
 */
export interface AnyMessage {
    /**
     * https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/any.proto
     *
     * @generated from protobuf field: google.protobuf.Any any_field = 1;
     */
    anyField?: Any;
}
// @generated message type with reflection information, may provide speed optimized methods
class AnyMessage$Type extends MessageType<AnyMessage> {
    constructor() {
        super("spec.AnyMessage", [
            { no: 1, name: "any_field", kind: "message", T: () => Any }
        ]);
    }
    create(value?: PartialMessage<AnyMessage>): AnyMessage {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<AnyMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AnyMessage): AnyMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* google.protobuf.Any any_field */ 1:
                    message.anyField = Any.internalBinaryRead(reader, reader.uint32(), options, message.anyField);
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
    internalBinaryWrite(message: AnyMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* google.protobuf.Any any_field = 1; */
        if (message.anyField)
            Any.internalBinaryWrite(message.anyField, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message spec.AnyMessage
 */
export const AnyMessage = new AnyMessage$Type();
