// @generated by protobuf-ts 2.9.6 with parameter long_type_string
// @generated from protobuf file "deprecation-implicit.proto" (package "spec", syntax proto3)
// tslint:disable
// @deprecated
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @deprecated
 * @generated from protobuf message spec.ImplicitlyDeprecatedMessage
 */
export interface ImplicitlyDeprecatedMessage {
}
// @generated message type with reflection information, may provide speed optimized methods
class ImplicitlyDeprecatedMessage$Type extends MessageType<ImplicitlyDeprecatedMessage> {
    constructor() {
        super("spec.ImplicitlyDeprecatedMessage", []);
    }
    create(value?: PartialMessage<ImplicitlyDeprecatedMessage>): ImplicitlyDeprecatedMessage {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<ImplicitlyDeprecatedMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ImplicitlyDeprecatedMessage): ImplicitlyDeprecatedMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
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
    internalBinaryWrite(message: ImplicitlyDeprecatedMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @deprecated
 * @generated MessageType for protobuf message spec.ImplicitlyDeprecatedMessage
 */
export const ImplicitlyDeprecatedMessage = new ImplicitlyDeprecatedMessage$Type();
