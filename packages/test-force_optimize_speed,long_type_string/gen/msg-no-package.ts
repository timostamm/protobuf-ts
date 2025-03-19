// @generated by protobuf-ts 2.9.6 with parameter force_optimize_speed,long_type_string
// @generated from protobuf file "msg-no-package.proto" (syntax proto3)
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
import { SubPackageMessage } from "./msg-sub-package";
import { ParentMessage_ChildMessage_GrandChildMessage } from "./msg-nesting";
/**
 * This message has no package.
 *
 * @generated from protobuf message NoPackageMessage
 */
export interface NoPackageMessage {
    /**
     * @generated from protobuf field: spec.ParentMessage.ChildMessage.GrandChildMessage grand_child = 1;
     */
    grandChild?: ParentMessage_ChildMessage_GrandChildMessage;
    /**
     * @generated from protobuf field: spec.sub_package.SubPackageMessage sub_package_message = 2;
     */
    subPackageMessage?: SubPackageMessage;
}
// @generated message type with reflection information, may provide speed optimized methods
class NoPackageMessage$Type extends MessageType<NoPackageMessage> {
    constructor() {
        super("NoPackageMessage", [
            { no: 1, name: "grand_child", kind: "message", T: () => ParentMessage_ChildMessage_GrandChildMessage },
            { no: 2, name: "sub_package_message", kind: "message", T: () => SubPackageMessage }
        ]);
    }
    create(value?: PartialMessage<NoPackageMessage>): NoPackageMessage {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<NoPackageMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: NoPackageMessage): NoPackageMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* spec.ParentMessage.ChildMessage.GrandChildMessage grand_child */ 1:
                    message.grandChild = ParentMessage_ChildMessage_GrandChildMessage.internalBinaryRead(reader, reader.uint32(), options, message.grandChild);
                    break;
                case /* spec.sub_package.SubPackageMessage sub_package_message */ 2:
                    message.subPackageMessage = SubPackageMessage.internalBinaryRead(reader, reader.uint32(), options, message.subPackageMessage);
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
    internalBinaryWrite(message: NoPackageMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* spec.ParentMessage.ChildMessage.GrandChildMessage grand_child = 1; */
        if (message.grandChild)
            ParentMessage_ChildMessage_GrandChildMessage.internalBinaryWrite(message.grandChild, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* spec.sub_package.SubPackageMessage sub_package_message = 2; */
        if (message.subPackageMessage)
            SubPackageMessage.internalBinaryWrite(message.subPackageMessage, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message NoPackageMessage
 */
export const NoPackageMessage = new NoPackageMessage$Type();
