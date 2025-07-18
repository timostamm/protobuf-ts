// @generated by protobuf-ts 2.11.1 with parameter long_type_string
// @generated from protobuf file "msg-self-reference.proto" (package "spec", syntax proto3)
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
/**
 * @generated from protobuf message spec.SelfReferencingMessage
 */
export interface SelfReferencingMessage {
    /**
     * @generated from protobuf field: spec.SelfReferencingMessage self = 1
     */
    self?: SelfReferencingMessage;
    /**
     * @generated from protobuf field: repeated spec.SelfReferencingMessage self_list = 2
     */
    selfList: SelfReferencingMessage[];
    /**
     * @generated from protobuf field: map<string, spec.SelfReferencingMessage> self_map = 3
     */
    selfMap: {
        [key: string]: SelfReferencingMessage;
    };
}
// @generated message type with reflection information, may provide speed optimized methods
class SelfReferencingMessage$Type extends MessageType<SelfReferencingMessage> {
    constructor() {
        super("spec.SelfReferencingMessage", [
            { no: 1, name: "self", kind: "message", T: () => SelfReferencingMessage },
            { no: 2, name: "self_list", kind: "message", repeat: 2 /*RepeatType.UNPACKED*/, T: () => SelfReferencingMessage },
            { no: 3, name: "self_map", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "message", T: () => SelfReferencingMessage } }
        ]);
    }
    create(value?: PartialMessage<SelfReferencingMessage>): SelfReferencingMessage {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.selfList = [];
        message.selfMap = {};
        if (value !== undefined)
            reflectionMergePartial<SelfReferencingMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SelfReferencingMessage): SelfReferencingMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* spec.SelfReferencingMessage self */ 1:
                    message.self = SelfReferencingMessage.internalBinaryRead(reader, reader.uint32(), options, message.self);
                    break;
                case /* repeated spec.SelfReferencingMessage self_list */ 2:
                    message.selfList.push(SelfReferencingMessage.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* map<string, spec.SelfReferencingMessage> self_map */ 3:
                    this.binaryReadMap3(message.selfMap, reader, options);
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
    private binaryReadMap3(map: SelfReferencingMessage["selfMap"], reader: IBinaryReader, options: BinaryReadOptions): void {
        let len = reader.uint32(), end = reader.pos + len, key: keyof SelfReferencingMessage["selfMap"] | undefined, val: SelfReferencingMessage["selfMap"][any] | undefined;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case 1:
                    key = reader.string();
                    break;
                case 2:
                    val = SelfReferencingMessage.internalBinaryRead(reader, reader.uint32(), options);
                    break;
                default: throw new globalThis.Error("unknown map entry field for spec.SelfReferencingMessage.self_map");
            }
        }
        map[key ?? ""] = val ?? SelfReferencingMessage.create();
    }
    internalBinaryWrite(message: SelfReferencingMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* spec.SelfReferencingMessage self = 1; */
        if (message.self)
            SelfReferencingMessage.internalBinaryWrite(message.self, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* repeated spec.SelfReferencingMessage self_list = 2; */
        for (let i = 0; i < message.selfList.length; i++)
            SelfReferencingMessage.internalBinaryWrite(message.selfList[i], writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* map<string, spec.SelfReferencingMessage> self_map = 3; */
        for (let k of globalThis.Object.keys(message.selfMap)) {
            writer.tag(3, WireType.LengthDelimited).fork().tag(1, WireType.LengthDelimited).string(k);
            writer.tag(2, WireType.LengthDelimited).fork();
            SelfReferencingMessage.internalBinaryWrite(message.selfMap[k], writer, options);
            writer.join().join();
        }
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message spec.SelfReferencingMessage
 */
export const SelfReferencingMessage = new SelfReferencingMessage$Type();
