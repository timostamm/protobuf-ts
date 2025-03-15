// @generated by protobuf-ts 2.9.5 with parameter force_optimize_speed
// @generated from protobuf file "google/type/money.proto" (package "google.type", syntax proto3)
// tslint:disable
//
// Copyright 2019 Google LLC.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
//
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
 * Represents an amount of money with its currency type.
 *
 * @generated from protobuf message google.type.Money
 */
export interface Money {
    /**
     * The 3-letter currency code defined in ISO 4217.
     *
     * @generated from protobuf field: string currency_code = 1;
     */
    currencyCode: string;
    /**
     * The whole units of the amount.
     * For example if `currencyCode` is `"USD"`, then 1 unit is one US dollar.
     *
     * @generated from protobuf field: int64 units = 2;
     */
    units: bigint;
    /**
     * Number of nano (10^-9) units of the amount.
     * The value must be between -999,999,999 and +999,999,999 inclusive.
     * If `units` is positive, `nanos` must be positive or zero.
     * If `units` is zero, `nanos` can be positive, zero, or negative.
     * If `units` is negative, `nanos` must be negative or zero.
     * For example $-1.75 is represented as `units`=-1 and `nanos`=-750,000,000.
     *
     * @generated from protobuf field: int32 nanos = 3;
     */
    nanos: number;
}
// @generated message type with reflection information, may provide speed optimized methods
class Money$Type extends MessageType<Money> {
    constructor() {
        super("google.type.Money", [
            { no: 1, name: "currency_code", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "units", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 3, name: "nanos", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
    create(value?: PartialMessage<Money>): Money {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.currencyCode = "";
        message.units = 0n;
        message.nanos = 0;
        if (value !== undefined)
            reflectionMergePartial<Money>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Money): Money {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string currency_code */ 1:
                    message.currencyCode = reader.string();
                    break;
                case /* int64 units */ 2:
                    message.units = reader.int64().toBigInt();
                    break;
                case /* int32 nanos */ 3:
                    message.nanos = reader.int32();
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
    internalBinaryWrite(message: Money, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string currency_code = 1; */
        if (message.currencyCode !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.currencyCode);
        /* int64 units = 2; */
        if (message.units !== 0n)
            writer.tag(2, WireType.Varint).int64(message.units);
        /* int32 nanos = 3; */
        if (message.nanos !== 0)
            writer.tag(3, WireType.Varint).int32(message.nanos);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message google.type.Money
 */
export const Money = new Money$Type();
