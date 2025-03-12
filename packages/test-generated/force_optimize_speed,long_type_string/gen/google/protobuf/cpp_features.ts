// @generated by protobuf-ts 2.9.5 with parameter force_optimize_code_size,long_type_string
// @generated from protobuf file "google/protobuf/cpp_features.proto" (package "pb", syntax proto2)
// tslint:disable
//
// Protocol Buffers - Google's data interchange format
// Copyright 2023 Google Inc.  All rights reserved.
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd
//
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message pb.CppFeatures
 */
export interface CppFeatures {
    /**
     * Whether or not to treat an enum field as closed.  This option is only
     * applicable to enum fields, and will be removed in the future.  It is
     * consistent with the legacy behavior of using proto3 enum types for proto2
     * fields.
     *
     * @generated from protobuf field: optional bool legacy_closed_enum = 1;
     */
    legacyClosedEnum?: boolean;
    /**
     * @generated from protobuf field: optional pb.CppFeatures.StringType string_type = 2;
     */
    stringType?: CppFeatures_StringType;
    /**
     * @generated from protobuf field: optional bool enum_name_uses_string_view = 3;
     */
    enumNameUsesStringView?: boolean;
}
/**
 * @generated from protobuf enum pb.CppFeatures.StringType
 */
export enum CppFeatures_StringType {
    /**
     * @generated from protobuf enum value: STRING_TYPE_UNKNOWN = 0;
     */
    STRING_TYPE_UNKNOWN = 0,
    /**
     * @generated from protobuf enum value: VIEW = 1;
     */
    VIEW = 1,
    /**
     * @generated from protobuf enum value: CORD = 2;
     */
    CORD = 2,
    /**
     * @generated from protobuf enum value: STRING = 3;
     */
    STRING = 3
}
// @generated message type with reflection information, may provide speed optimized methods
class CppFeatures$Type extends MessageType<CppFeatures> {
    constructor() {
        super("pb.CppFeatures", [
            { no: 1, name: "legacy_closed_enum", kind: "scalar", opt: true, T: 8 /*ScalarType.BOOL*/ },
            { no: 2, name: "string_type", kind: "enum", opt: true, T: () => ["pb.CppFeatures.StringType", CppFeatures_StringType] },
            { no: 3, name: "enum_name_uses_string_view", kind: "scalar", opt: true, T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message pb.CppFeatures
 */
export const CppFeatures = new CppFeatures$Type();
