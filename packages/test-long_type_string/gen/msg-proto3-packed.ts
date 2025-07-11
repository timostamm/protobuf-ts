// @generated by protobuf-ts 2.11.1 with parameter long_type_string
// @generated from protobuf file "msg-proto3-packed.proto" (package "spec", syntax proto3)
// tslint:disable
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message spec.Proto3PackedMessage
 */
export interface Proto3PackedMessage {
    /**
     * @generated from protobuf field: repeated double double_field = 1
     */
    doubleField: number[];
    /**
     * @generated from protobuf field: repeated uint32 uint32_field = 2
     */
    uint32Field: number[];
    /**
     * @generated from protobuf field: repeated uint64 uint64_field = 3
     */
    uint64Field: string[];
    /**
     * @generated from protobuf field: repeated double packed_double_field = 101 [packed = true]
     */
    packedDoubleField: number[];
    /**
     * @generated from protobuf field: repeated uint32 packed_uint32_field = 102 [packed = true]
     */
    packedUint32Field: number[];
    /**
     * @generated from protobuf field: repeated uint64 packed_uint64_field = 103 [packed = true]
     */
    packedUint64Field: string[];
    /**
     * @generated from protobuf field: repeated double unpacked_double_field = 201 [packed = false]
     */
    unpackedDoubleField: number[];
    /**
     * @generated from protobuf field: repeated uint32 unpacked_uint32_field = 202 [packed = false]
     */
    unpackedUint32Field: number[];
    /**
     * @generated from protobuf field: repeated uint64 unpacked_uint64_field = 203 [packed = false]
     */
    unpackedUint64Field: string[];
}
// @generated message type with reflection information, may provide speed optimized methods
class Proto3PackedMessage$Type extends MessageType<Proto3PackedMessage> {
    constructor() {
        super("spec.Proto3PackedMessage", [
            { no: 1, name: "double_field", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 1 /*ScalarType.DOUBLE*/ },
            { no: 2, name: "uint32_field", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 13 /*ScalarType.UINT32*/ },
            { no: 3, name: "uint64_field", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 4 /*ScalarType.UINT64*/ },
            { no: 101, name: "packed_double_field", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 1 /*ScalarType.DOUBLE*/ },
            { no: 102, name: "packed_uint32_field", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 13 /*ScalarType.UINT32*/ },
            { no: 103, name: "packed_uint64_field", kind: "scalar", repeat: 1 /*RepeatType.PACKED*/, T: 4 /*ScalarType.UINT64*/ },
            { no: 201, name: "unpacked_double_field", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 1 /*ScalarType.DOUBLE*/ },
            { no: 202, name: "unpacked_uint32_field", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 13 /*ScalarType.UINT32*/ },
            { no: 203, name: "unpacked_uint64_field", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 4 /*ScalarType.UINT64*/ }
        ]);
    }
    create(value?: PartialMessage<Proto3PackedMessage>): Proto3PackedMessage {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.doubleField = [];
        message.uint32Field = [];
        message.uint64Field = [];
        message.packedDoubleField = [];
        message.packedUint32Field = [];
        message.packedUint64Field = [];
        message.unpackedDoubleField = [];
        message.unpackedUint32Field = [];
        message.unpackedUint64Field = [];
        if (value !== undefined)
            reflectionMergePartial<Proto3PackedMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Proto3PackedMessage): Proto3PackedMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated double double_field */ 1:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.doubleField.push(reader.double());
                    else
                        message.doubleField.push(reader.double());
                    break;
                case /* repeated uint32 uint32_field */ 2:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.uint32Field.push(reader.uint32());
                    else
                        message.uint32Field.push(reader.uint32());
                    break;
                case /* repeated uint64 uint64_field */ 3:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.uint64Field.push(reader.uint64().toString());
                    else
                        message.uint64Field.push(reader.uint64().toString());
                    break;
                case /* repeated double packed_double_field = 101 [packed = true] */ 101:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.packedDoubleField.push(reader.double());
                    else
                        message.packedDoubleField.push(reader.double());
                    break;
                case /* repeated uint32 packed_uint32_field = 102 [packed = true] */ 102:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.packedUint32Field.push(reader.uint32());
                    else
                        message.packedUint32Field.push(reader.uint32());
                    break;
                case /* repeated uint64 packed_uint64_field = 103 [packed = true] */ 103:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.packedUint64Field.push(reader.uint64().toString());
                    else
                        message.packedUint64Field.push(reader.uint64().toString());
                    break;
                case /* repeated double unpacked_double_field = 201 [packed = false] */ 201:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.unpackedDoubleField.push(reader.double());
                    else
                        message.unpackedDoubleField.push(reader.double());
                    break;
                case /* repeated uint32 unpacked_uint32_field = 202 [packed = false] */ 202:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.unpackedUint32Field.push(reader.uint32());
                    else
                        message.unpackedUint32Field.push(reader.uint32());
                    break;
                case /* repeated uint64 unpacked_uint64_field = 203 [packed = false] */ 203:
                    if (wireType === WireType.LengthDelimited)
                        for (let e = reader.int32() + reader.pos; reader.pos < e;)
                            message.unpackedUint64Field.push(reader.uint64().toString());
                    else
                        message.unpackedUint64Field.push(reader.uint64().toString());
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
    internalBinaryWrite(message: Proto3PackedMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* repeated double double_field = 1; */
        if (message.doubleField.length) {
            writer.tag(1, WireType.LengthDelimited).fork();
            for (let i = 0; i < message.doubleField.length; i++)
                writer.double(message.doubleField[i]);
            writer.join();
        }
        /* repeated uint32 uint32_field = 2; */
        if (message.uint32Field.length) {
            writer.tag(2, WireType.LengthDelimited).fork();
            for (let i = 0; i < message.uint32Field.length; i++)
                writer.uint32(message.uint32Field[i]);
            writer.join();
        }
        /* repeated uint64 uint64_field = 3; */
        if (message.uint64Field.length) {
            writer.tag(3, WireType.LengthDelimited).fork();
            for (let i = 0; i < message.uint64Field.length; i++)
                writer.uint64(message.uint64Field[i]);
            writer.join();
        }
        /* repeated double packed_double_field = 101 [packed = true]; */
        if (message.packedDoubleField.length) {
            writer.tag(101, WireType.LengthDelimited).fork();
            for (let i = 0; i < message.packedDoubleField.length; i++)
                writer.double(message.packedDoubleField[i]);
            writer.join();
        }
        /* repeated uint32 packed_uint32_field = 102 [packed = true]; */
        if (message.packedUint32Field.length) {
            writer.tag(102, WireType.LengthDelimited).fork();
            for (let i = 0; i < message.packedUint32Field.length; i++)
                writer.uint32(message.packedUint32Field[i]);
            writer.join();
        }
        /* repeated uint64 packed_uint64_field = 103 [packed = true]; */
        if (message.packedUint64Field.length) {
            writer.tag(103, WireType.LengthDelimited).fork();
            for (let i = 0; i < message.packedUint64Field.length; i++)
                writer.uint64(message.packedUint64Field[i]);
            writer.join();
        }
        /* repeated double unpacked_double_field = 201 [packed = false]; */
        for (let i = 0; i < message.unpackedDoubleField.length; i++)
            writer.tag(201, WireType.Bit64).double(message.unpackedDoubleField[i]);
        /* repeated uint32 unpacked_uint32_field = 202 [packed = false]; */
        for (let i = 0; i < message.unpackedUint32Field.length; i++)
            writer.tag(202, WireType.Varint).uint32(message.unpackedUint32Field[i]);
        /* repeated uint64 unpacked_uint64_field = 203 [packed = false]; */
        for (let i = 0; i < message.unpackedUint64Field.length; i++)
            writer.tag(203, WireType.Varint).uint64(message.unpackedUint64Field[i]);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message spec.Proto3PackedMessage
 */
export const Proto3PackedMessage = new Proto3PackedMessage$Type();
