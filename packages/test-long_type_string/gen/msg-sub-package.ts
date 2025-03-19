// @generated by protobuf-ts 2.9.6 with parameter long_type_string
// @generated from protobuf file "msg-sub-package.proto" (package "spec.sub_package", syntax proto3)
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
import { ParentMessage_ChildMessage_GrandChildMessage } from "./msg-nesting";
/**
 * This message is in package `spec.sub_package`.
 *
 * @generated from protobuf message spec.sub_package.SubPackageMessage
 */
export interface SubPackageMessage {
    /**
     * @generated from protobuf field: spec.ParentMessage.ChildMessage.GrandChildMessage grand_child = 1;
     */
    grandChild?: ParentMessage_ChildMessage_GrandChildMessage;
}
// @generated message type with reflection information, may provide speed optimized methods
class SubPackageMessage$Type extends MessageType<SubPackageMessage> {
    constructor() {
        super("spec.sub_package.SubPackageMessage", [
            { no: 1, name: "grand_child", kind: "message", T: () => ParentMessage_ChildMessage_GrandChildMessage }
        ]);
    }
    create(value?: PartialMessage<SubPackageMessage>): SubPackageMessage {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<SubPackageMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SubPackageMessage): SubPackageMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* spec.ParentMessage.ChildMessage.GrandChildMessage grand_child */ 1:
                    message.grandChild = ParentMessage_ChildMessage_GrandChildMessage.internalBinaryRead(reader, reader.uint32(), options, message.grandChild);
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
    internalBinaryWrite(message: SubPackageMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* spec.ParentMessage.ChildMessage.GrandChildMessage grand_child = 1; */
        if (message.grandChild)
            ParentMessage_ChildMessage_GrandChildMessage.internalBinaryWrite(message.grandChild, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message spec.sub_package.SubPackageMessage
 */
export const SubPackageMessage = new SubPackageMessage$Type();
