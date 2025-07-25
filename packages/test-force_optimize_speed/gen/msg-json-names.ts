// @generated by protobuf-ts 2.11.1 with parameter force_optimize_speed
// @generated from protobuf file "msg-json-names.proto" (package "spec", syntax proto3)
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
 * @generated from protobuf message spec.JsonNamesMessage
 */
export interface JsonNamesMessage {
    /**
     * @generated from protobuf field: string scalar_field = 1 [json_name = "scalarFieldJsonName"]
     */
    scalarField: string;
    /**
     * @generated from protobuf field: repeated string repeated_scalar_field = 2 [json_name = "repeatedScalarFieldJsonName"]
     */
    repeatedScalarField: string[];
}
// @generated message type with reflection information, may provide speed optimized methods
class JsonNamesMessage$Type extends MessageType<JsonNamesMessage> {
    constructor() {
        super("spec.JsonNamesMessage", [
            { no: 1, name: "scalar_field", kind: "scalar", jsonName: "scalarFieldJsonName", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "repeated_scalar_field", kind: "scalar", jsonName: "repeatedScalarFieldJsonName", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<JsonNamesMessage>): JsonNamesMessage {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.scalarField = "";
        message.repeatedScalarField = [];
        if (value !== undefined)
            reflectionMergePartial<JsonNamesMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: JsonNamesMessage): JsonNamesMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string scalar_field = 1 [json_name = "scalarFieldJsonName"] */ 1:
                    message.scalarField = reader.string();
                    break;
                case /* repeated string repeated_scalar_field = 2 [json_name = "repeatedScalarFieldJsonName"] */ 2:
                    message.repeatedScalarField.push(reader.string());
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
    internalBinaryWrite(message: JsonNamesMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string scalar_field = 1 [json_name = "scalarFieldJsonName"]; */
        if (message.scalarField !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.scalarField);
        /* repeated string repeated_scalar_field = 2 [json_name = "repeatedScalarFieldJsonName"]; */
        for (let i = 0; i < message.repeatedScalarField.length; i++)
            writer.tag(2, WireType.LengthDelimited).string(message.repeatedScalarField[i]);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message spec.JsonNamesMessage
 */
export const JsonNamesMessage = new JsonNamesMessage$Type();
