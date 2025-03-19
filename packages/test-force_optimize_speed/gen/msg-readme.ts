// @generated by protobuf-ts 2.9.6 with parameter force_optimize_speed
// @generated from protobuf file "msg-readme.proto" (syntax proto3)
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
 * A very simple protobuf message.
 *
 * @generated from protobuf message Person
 */
export interface Person {
    /**
     * @generated from protobuf field: string name = 1;
     */
    name: string;
    /**
     * @generated from protobuf field: uint64 id = 2;
     */
    id: bigint;
    /**
     * @generated from protobuf field: int32 years = 3 [json_name = "baz"];
     */
    years: number;
    /**
     * maybe a jpeg?
     *
     * @generated from protobuf field: optional bytes data = 5;
     */
    data?: Uint8Array;
}
// @generated message type with reflection information, may provide speed optimized methods
class Person$Type extends MessageType<Person> {
    constructor() {
        super("Person", [
            { no: 1, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "id", kind: "scalar", T: 4 /*ScalarType.UINT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 3, name: "years", kind: "scalar", jsonName: "baz", T: 5 /*ScalarType.INT32*/ },
            { no: 5, name: "data", kind: "scalar", opt: true, T: 12 /*ScalarType.BYTES*/ }
        ]);
    }
    create(value?: PartialMessage<Person>): Person {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.name = "";
        message.id = 0n;
        message.years = 0;
        if (value !== undefined)
            reflectionMergePartial<Person>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Person): Person {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string name */ 1:
                    message.name = reader.string();
                    break;
                case /* uint64 id */ 2:
                    message.id = reader.uint64().toBigInt();
                    break;
                case /* int32 years = 3 [json_name = "baz"];*/ 3:
                    message.years = reader.int32();
                    break;
                case /* optional bytes data */ 5:
                    message.data = reader.bytes();
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
    internalBinaryWrite(message: Person, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string name = 1; */
        if (message.name !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.name);
        /* uint64 id = 2; */
        if (message.id !== 0n)
            writer.tag(2, WireType.Varint).uint64(message.id);
        /* int32 years = 3 [json_name = "baz"]; */
        if (message.years !== 0)
            writer.tag(3, WireType.Varint).int32(message.years);
        /* optional bytes data = 5; */
        if (message.data !== undefined)
            writer.tag(5, WireType.LengthDelimited).bytes(message.data);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message Person
 */
export const Person = new Person$Type();
