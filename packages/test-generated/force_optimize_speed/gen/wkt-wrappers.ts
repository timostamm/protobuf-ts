// @generated by protobuf-ts 2.9.5 with parameter force_optimize_speed,long_type_string
// @generated from protobuf file "wkt-wrappers.proto" (package "spec", syntax proto3)
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
import { BytesValue } from "./google/protobuf/wrappers";
import { StringValue } from "./google/protobuf/wrappers";
import { UInt32Value } from "./google/protobuf/wrappers";
import { Int32Value } from "./google/protobuf/wrappers";
import { UInt64Value } from "./google/protobuf/wrappers";
import { Int64Value } from "./google/protobuf/wrappers";
import { FloatValue } from "./google/protobuf/wrappers";
import { BoolValue } from "./google/protobuf/wrappers";
import { DoubleValue } from "./google/protobuf/wrappers";
// https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/wrappers.proto

/**
 * @generated from protobuf message spec.WrappersMessage
 */
export interface WrappersMessage {
    /**
     * @generated from protobuf field: google.protobuf.DoubleValue double_value_field = 1;
     */
    doubleValueField?: DoubleValue;
    /**
     * @generated from protobuf field: google.protobuf.BoolValue bool_value_field = 2;
     */
    boolValueField?: BoolValue;
    /**
     * @generated from protobuf field: google.protobuf.FloatValue float_value_field = 3;
     */
    floatValueField?: FloatValue;
    /**
     * @generated from protobuf field: google.protobuf.Int64Value int64_value_field = 4;
     */
    int64ValueField?: Int64Value;
    /**
     * @generated from protobuf field: google.protobuf.UInt64Value uint64_value_field = 5;
     */
    uint64ValueField?: UInt64Value;
    /**
     * @generated from protobuf field: google.protobuf.Int32Value int32_value_field = 6;
     */
    int32ValueField?: Int32Value;
    /**
     * @generated from protobuf field: google.protobuf.UInt32Value uint32_value_field = 7;
     */
    uint32ValueField?: UInt32Value;
    /**
     * @generated from protobuf field: google.protobuf.StringValue string_value_field = 8;
     */
    stringValueField?: StringValue;
    /**
     * @generated from protobuf field: google.protobuf.BytesValue bytes_value_field = 9;
     */
    bytesValueField?: BytesValue;
}
// @generated message type with reflection information, may provide speed optimized methods
class WrappersMessage$Type extends MessageType<WrappersMessage> {
    constructor() {
        super("spec.WrappersMessage", [
            { no: 1, name: "double_value_field", kind: "message", T: () => DoubleValue },
            { no: 2, name: "bool_value_field", kind: "message", T: () => BoolValue },
            { no: 3, name: "float_value_field", kind: "message", T: () => FloatValue },
            { no: 4, name: "int64_value_field", kind: "message", T: () => Int64Value },
            { no: 5, name: "uint64_value_field", kind: "message", T: () => UInt64Value },
            { no: 6, name: "int32_value_field", kind: "message", T: () => Int32Value },
            { no: 7, name: "uint32_value_field", kind: "message", T: () => UInt32Value },
            { no: 8, name: "string_value_field", kind: "message", T: () => StringValue },
            { no: 9, name: "bytes_value_field", kind: "message", T: () => BytesValue }
        ]);
    }
    create(value?: PartialMessage<WrappersMessage>): WrappersMessage {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<WrappersMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: WrappersMessage): WrappersMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* google.protobuf.DoubleValue double_value_field */ 1:
                    message.doubleValueField = DoubleValue.internalBinaryRead(reader, reader.uint32(), options, message.doubleValueField);
                    break;
                case /* google.protobuf.BoolValue bool_value_field */ 2:
                    message.boolValueField = BoolValue.internalBinaryRead(reader, reader.uint32(), options, message.boolValueField);
                    break;
                case /* google.protobuf.FloatValue float_value_field */ 3:
                    message.floatValueField = FloatValue.internalBinaryRead(reader, reader.uint32(), options, message.floatValueField);
                    break;
                case /* google.protobuf.Int64Value int64_value_field */ 4:
                    message.int64ValueField = Int64Value.internalBinaryRead(reader, reader.uint32(), options, message.int64ValueField);
                    break;
                case /* google.protobuf.UInt64Value uint64_value_field */ 5:
                    message.uint64ValueField = UInt64Value.internalBinaryRead(reader, reader.uint32(), options, message.uint64ValueField);
                    break;
                case /* google.protobuf.Int32Value int32_value_field */ 6:
                    message.int32ValueField = Int32Value.internalBinaryRead(reader, reader.uint32(), options, message.int32ValueField);
                    break;
                case /* google.protobuf.UInt32Value uint32_value_field */ 7:
                    message.uint32ValueField = UInt32Value.internalBinaryRead(reader, reader.uint32(), options, message.uint32ValueField);
                    break;
                case /* google.protobuf.StringValue string_value_field */ 8:
                    message.stringValueField = StringValue.internalBinaryRead(reader, reader.uint32(), options, message.stringValueField);
                    break;
                case /* google.protobuf.BytesValue bytes_value_field */ 9:
                    message.bytesValueField = BytesValue.internalBinaryRead(reader, reader.uint32(), options, message.bytesValueField);
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
    internalBinaryWrite(message: WrappersMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* google.protobuf.DoubleValue double_value_field = 1; */
        if (message.doubleValueField)
            DoubleValue.internalBinaryWrite(message.doubleValueField, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* google.protobuf.BoolValue bool_value_field = 2; */
        if (message.boolValueField)
            BoolValue.internalBinaryWrite(message.boolValueField, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* google.protobuf.FloatValue float_value_field = 3; */
        if (message.floatValueField)
            FloatValue.internalBinaryWrite(message.floatValueField, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        /* google.protobuf.Int64Value int64_value_field = 4; */
        if (message.int64ValueField)
            Int64Value.internalBinaryWrite(message.int64ValueField, writer.tag(4, WireType.LengthDelimited).fork(), options).join();
        /* google.protobuf.UInt64Value uint64_value_field = 5; */
        if (message.uint64ValueField)
            UInt64Value.internalBinaryWrite(message.uint64ValueField, writer.tag(5, WireType.LengthDelimited).fork(), options).join();
        /* google.protobuf.Int32Value int32_value_field = 6; */
        if (message.int32ValueField)
            Int32Value.internalBinaryWrite(message.int32ValueField, writer.tag(6, WireType.LengthDelimited).fork(), options).join();
        /* google.protobuf.UInt32Value uint32_value_field = 7; */
        if (message.uint32ValueField)
            UInt32Value.internalBinaryWrite(message.uint32ValueField, writer.tag(7, WireType.LengthDelimited).fork(), options).join();
        /* google.protobuf.StringValue string_value_field = 8; */
        if (message.stringValueField)
            StringValue.internalBinaryWrite(message.stringValueField, writer.tag(8, WireType.LengthDelimited).fork(), options).join();
        /* google.protobuf.BytesValue bytes_value_field = 9; */
        if (message.bytesValueField)
            BytesValue.internalBinaryWrite(message.bytesValueField, writer.tag(9, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message spec.WrappersMessage
 */
export const WrappersMessage = new WrappersMessage$Type();
