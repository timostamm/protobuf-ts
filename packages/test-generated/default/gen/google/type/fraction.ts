// @generated by protobuf-ts 2.9.5
// @generated from protobuf file "google/type/fraction.proto" (package "google.type", syntax proto3)
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
 * Represents a fraction in terms of a numerator divided by a denominator.
 *
 * @generated from protobuf message google.type.Fraction
 */
export interface Fraction {
    /**
     * The portion of the denominator in the faction, e.g. 2 in 2/3.
     *
     * @generated from protobuf field: int64 numerator = 1;
     */
    numerator: bigint;
    /**
     * The value by which the numerator is divided, e.g. 3 in 2/3. Must be
     * positive.
     *
     * @generated from protobuf field: int64 denominator = 2;
     */
    denominator: bigint;
}
// @generated message type with reflection information, may provide speed optimized methods
class Fraction$Type extends MessageType<Fraction> {
    constructor() {
        super("google.type.Fraction", [
            { no: 1, name: "numerator", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 2, name: "denominator", kind: "scalar", T: 3 /*ScalarType.INT64*/, L: 0 /*LongType.BIGINT*/ }
        ]);
    }
    create(value?: PartialMessage<Fraction>): Fraction {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.numerator = 0n;
        message.denominator = 0n;
        if (value !== undefined)
            reflectionMergePartial<Fraction>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Fraction): Fraction {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int64 numerator */ 1:
                    message.numerator = reader.int64().toBigInt();
                    break;
                case /* int64 denominator */ 2:
                    message.denominator = reader.int64().toBigInt();
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
    internalBinaryWrite(message: Fraction, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* int64 numerator = 1; */
        if (message.numerator !== 0n)
            writer.tag(1, WireType.Varint).int64(message.numerator);
        /* int64 denominator = 2; */
        if (message.denominator !== 0n)
            writer.tag(2, WireType.Varint).int64(message.denominator);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message google.type.Fraction
 */
export const Fraction = new Fraction$Type();
