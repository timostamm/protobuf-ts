// @generated by protobuf-ts 2.11.1
// @generated from protobuf file "google/protobuf/java_features.proto" (package "pb", syntax proto2)
// tslint:disable
//
// Protocol Buffers - Google's data interchange format
// Copyright 2023 Google Inc.  All rights reserved.
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd
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
 * @generated from protobuf message pb.JavaFeatures
 */
export interface JavaFeatures {
    /**
     * Whether or not to treat an enum field as closed.  This option is only
     * applicable to enum fields, and will be removed in the future.  It is
     * consistent with the legacy behavior of using proto3 enum types for proto2
     * fields.
     *
     * @generated from protobuf field: optional bool legacy_closed_enum = 1
     */
    legacyClosedEnum?: boolean;
    /**
     * @generated from protobuf field: optional pb.JavaFeatures.Utf8Validation utf8_validation = 2
     */
    utf8Validation?: JavaFeatures_Utf8Validation;
}
/**
 * The UTF8 validation strategy to use.  See go/editions-utf8-validation for
 * more information on this feature.
 *
 * @generated from protobuf enum pb.JavaFeatures.Utf8Validation
 */
export enum JavaFeatures_Utf8Validation {
    /**
     * Invalid default, which should never be used.
     *
     * @generated from protobuf enum value: UTF8_VALIDATION_UNKNOWN = 0;
     */
    UTF8_VALIDATION_UNKNOWN = 0,
    /**
     * Respect the UTF8 validation behavior specified by the global
     * utf8_validation feature.
     *
     * @generated from protobuf enum value: DEFAULT = 1;
     */
    DEFAULT = 1,
    /**
     * Verifies UTF8 validity overriding the global utf8_validation
     * feature. This represents the legacy java_string_check_utf8 option.
     *
     * @generated from protobuf enum value: VERIFY = 2;
     */
    VERIFY = 2
}
// @generated message type with reflection information, may provide speed optimized methods
class JavaFeatures$Type extends MessageType<JavaFeatures> {
    constructor() {
        super("pb.JavaFeatures", [
            { no: 1, name: "legacy_closed_enum", kind: "scalar", opt: true, T: 8 /*ScalarType.BOOL*/ },
            { no: 2, name: "utf8_validation", kind: "enum", opt: true, T: () => ["pb.JavaFeatures.Utf8Validation", JavaFeatures_Utf8Validation] }
        ]);
    }
    create(value?: PartialMessage<JavaFeatures>): JavaFeatures {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<JavaFeatures>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: JavaFeatures): JavaFeatures {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* optional bool legacy_closed_enum */ 1:
                    message.legacyClosedEnum = reader.bool();
                    break;
                case /* optional pb.JavaFeatures.Utf8Validation utf8_validation */ 2:
                    message.utf8Validation = reader.int32();
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
    internalBinaryWrite(message: JavaFeatures, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* optional bool legacy_closed_enum = 1; */
        if (message.legacyClosedEnum !== undefined)
            writer.tag(1, WireType.Varint).bool(message.legacyClosedEnum);
        /* optional pb.JavaFeatures.Utf8Validation utf8_validation = 2; */
        if (message.utf8Validation !== undefined)
            writer.tag(2, WireType.Varint).int32(message.utf8Validation);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message pb.JavaFeatures
 */
export const JavaFeatures = new JavaFeatures$Type();
