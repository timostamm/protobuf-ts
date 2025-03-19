// @generated by protobuf-ts 2.9.6 with parameter force_optimize_speed,long_type_string
// @generated from protobuf file "optimize-for-code-size.proto" (package "spec", syntax proto3)
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
 * @generated from protobuf message spec.OptimizeForCodeSizeMessage
 */
export interface OptimizeForCodeSizeMessage {
    /**
     * @generated from protobuf field: double double_field = 1;
     */
    doubleField: number;
    /**
     * @generated from protobuf field: float float_field = 2;
     */
    floatField: number;
}
// @generated message type with reflection information, may provide speed optimized methods
class OptimizeForCodeSizeMessage$Type extends MessageType<OptimizeForCodeSizeMessage> {
    constructor() {
        super("spec.OptimizeForCodeSizeMessage", [
            { no: 1, name: "double_field", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 2, name: "float_field", kind: "scalar", T: 2 /*ScalarType.FLOAT*/ }
        ]);
    }
    create(value?: PartialMessage<OptimizeForCodeSizeMessage>): OptimizeForCodeSizeMessage {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.doubleField = 0;
        message.floatField = 0;
        if (value !== undefined)
            reflectionMergePartial<OptimizeForCodeSizeMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: OptimizeForCodeSizeMessage): OptimizeForCodeSizeMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* double double_field */ 1:
                    message.doubleField = reader.double();
                    break;
                case /* float float_field */ 2:
                    message.floatField = reader.float();
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
    internalBinaryWrite(message: OptimizeForCodeSizeMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* double double_field = 1; */
        if (message.doubleField !== 0)
            writer.tag(1, WireType.Bit64).double(message.doubleField);
        /* float float_field = 2; */
        if (message.floatField !== 0)
            writer.tag(2, WireType.Bit32).float(message.floatField);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message spec.OptimizeForCodeSizeMessage
 */
export const OptimizeForCodeSizeMessage = new OptimizeForCodeSizeMessage$Type();
