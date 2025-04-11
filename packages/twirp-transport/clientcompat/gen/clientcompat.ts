// @generated by protobuf-ts 2.9.6
// @generated from protobuf file "clientcompat.proto" (package "twirp.clientcompat", syntax proto3)
// tslint:disable
import { ServiceType } from "@protobuf-ts/runtime-rpc";
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message twirp.clientcompat.Empty
 */
export interface Empty {
}
/**
 * @generated from protobuf message twirp.clientcompat.Req
 */
export interface Req {
    /**
     * @generated from protobuf field: string v = 1;
     */
    v: string;
}
/**
 * @generated from protobuf message twirp.clientcompat.Resp
 */
export interface Resp {
    /**
     * @generated from protobuf field: int32 v = 1;
     */
    v: number;
}
/**
 * @generated from protobuf message twirp.clientcompat.ClientCompatMessage
 */
export interface ClientCompatMessage {
    /**
     * @generated from protobuf field: string service_address = 1;
     */
    serviceAddress: string;
    /**
     * @generated from protobuf field: twirp.clientcompat.ClientCompatMessage.CompatServiceMethod method = 2;
     */
    method: ClientCompatMessage_CompatServiceMethod;
    /**
     * @generated from protobuf field: bytes request = 3;
     */
    request: Uint8Array;
}
/**
 * @generated from protobuf enum twirp.clientcompat.ClientCompatMessage.CompatServiceMethod
 */
export enum ClientCompatMessage_CompatServiceMethod {
    /**
     * @generated from protobuf enum value: NOOP = 0;
     */
    NOOP = 0,
    /**
     * @generated from protobuf enum value: METHOD = 1;
     */
    METHOD = 1
}
// @generated message type with reflection information, may provide speed optimized methods
class Empty$Type extends MessageType<Empty> {
    constructor() {
        super("twirp.clientcompat.Empty", []);
    }
    create(value?: PartialMessage<Empty>): Empty {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<Empty>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Empty): Empty {
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
    internalBinaryWrite(message: Empty, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message twirp.clientcompat.Empty
 */
export const Empty = new Empty$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Req$Type extends MessageType<Req> {
    constructor() {
        super("twirp.clientcompat.Req", [
            { no: 1, name: "v", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<Req>): Req {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.v = "";
        if (value !== undefined)
            reflectionMergePartial<Req>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Req): Req {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string v */ 1:
                    message.v = reader.string();
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
    internalBinaryWrite(message: Req, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string v = 1; */
        if (message.v !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.v);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message twirp.clientcompat.Req
 */
export const Req = new Req$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Resp$Type extends MessageType<Resp> {
    constructor() {
        super("twirp.clientcompat.Resp", [
            { no: 1, name: "v", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
    create(value?: PartialMessage<Resp>): Resp {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.v = 0;
        if (value !== undefined)
            reflectionMergePartial<Resp>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Resp): Resp {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 v */ 1:
                    message.v = reader.int32();
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
    internalBinaryWrite(message: Resp, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* int32 v = 1; */
        if (message.v !== 0)
            writer.tag(1, WireType.Varint).int32(message.v);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message twirp.clientcompat.Resp
 */
export const Resp = new Resp$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ClientCompatMessage$Type extends MessageType<ClientCompatMessage> {
    constructor() {
        super("twirp.clientcompat.ClientCompatMessage", [
            { no: 1, name: "service_address", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "method", kind: "enum", T: () => ["twirp.clientcompat.ClientCompatMessage.CompatServiceMethod", ClientCompatMessage_CompatServiceMethod] },
            { no: 3, name: "request", kind: "scalar", T: 12 /*ScalarType.BYTES*/ }
        ]);
    }
    create(value?: PartialMessage<ClientCompatMessage>): ClientCompatMessage {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.serviceAddress = "";
        message.method = 0;
        message.request = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<ClientCompatMessage>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ClientCompatMessage): ClientCompatMessage {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string service_address */ 1:
                    message.serviceAddress = reader.string();
                    break;
                case /* twirp.clientcompat.ClientCompatMessage.CompatServiceMethod method */ 2:
                    message.method = reader.int32();
                    break;
                case /* bytes request */ 3:
                    message.request = reader.bytes();
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
    internalBinaryWrite(message: ClientCompatMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string service_address = 1; */
        if (message.serviceAddress !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.serviceAddress);
        /* twirp.clientcompat.ClientCompatMessage.CompatServiceMethod method = 2; */
        if (message.method !== 0)
            writer.tag(2, WireType.Varint).int32(message.method);
        /* bytes request = 3; */
        if (message.request.length)
            writer.tag(3, WireType.LengthDelimited).bytes(message.request);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message twirp.clientcompat.ClientCompatMessage
 */
export const ClientCompatMessage = new ClientCompatMessage$Type();
/**
 * @generated ServiceType for protobuf service twirp.clientcompat.CompatService
 */
export const CompatService = new ServiceType("twirp.clientcompat.CompatService", [
    { name: "Method", options: {}, I: Req, O: Resp },
    { name: "NoopMethod", options: {}, I: Empty, O: Empty }
]);
