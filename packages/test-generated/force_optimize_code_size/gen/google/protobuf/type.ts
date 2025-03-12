// @generated by protobuf-ts 2.9.5 with parameter force_optimize_code_size
// @generated from protobuf file "google/protobuf/type.proto" (package "google.protobuf", syntax proto3)
// tslint:disable
//
// Protocol Buffers - Google's data interchange format
// Copyright 2008 Google Inc.  All rights reserved.
// https://developers.google.com/protocol-buffers/
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//     * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
//     * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
import { MessageType } from "@protobuf-ts/runtime";
import { Any } from "./any";
import { SourceContext } from "./source_context";
/**
 * A protocol buffer message type.
 *
 * @generated from protobuf message google.protobuf.Type
 */
export interface Type {
    /**
     * The fully qualified message name.
     *
     * @generated from protobuf field: string name = 1;
     */
    name: string;
    /**
     * The list of fields.
     *
     * @generated from protobuf field: repeated google.protobuf.Field fields = 2;
     */
    fields: Field[];
    /**
     * The list of types appearing in `oneof` definitions in this type.
     *
     * @generated from protobuf field: repeated string oneofs = 3;
     */
    oneofs: string[];
    /**
     * The protocol buffer options.
     *
     * @generated from protobuf field: repeated google.protobuf.Option options = 4;
     */
    options: Option[];
    /**
     * The source context.
     *
     * @generated from protobuf field: google.protobuf.SourceContext source_context = 5;
     */
    sourceContext?: SourceContext;
    /**
     * The source syntax.
     *
     * @generated from protobuf field: google.protobuf.Syntax syntax = 6;
     */
    syntax: Syntax;
    /**
     * The source edition string, only valid when syntax is SYNTAX_EDITIONS.
     *
     * @generated from protobuf field: string edition = 7;
     */
    edition: string;
}
/**
 * A single field of a message type.
 *
 * @generated from protobuf message google.protobuf.Field
 */
export interface Field {
    /**
     * The field type.
     *
     * @generated from protobuf field: google.protobuf.Field.Kind kind = 1;
     */
    kind: Field_Kind;
    /**
     * The field cardinality.
     *
     * @generated from protobuf field: google.protobuf.Field.Cardinality cardinality = 2;
     */
    cardinality: Field_Cardinality;
    /**
     * The field number.
     *
     * @generated from protobuf field: int32 number = 3;
     */
    number: number;
    /**
     * The field name.
     *
     * @generated from protobuf field: string name = 4;
     */
    name: string;
    /**
     * The field type URL, without the scheme, for message or enumeration
     * types. Example: `"type.googleapis.com/google.protobuf.Timestamp"`.
     *
     * @generated from protobuf field: string type_url = 6;
     */
    typeUrl: string;
    /**
     * The index of the field type in `Type.oneofs`, for message or enumeration
     * types. The first type has index 1; zero means the type is not in the list.
     *
     * @generated from protobuf field: int32 oneof_index = 7;
     */
    oneofIndex: number;
    /**
     * Whether to use alternative packed wire representation.
     *
     * @generated from protobuf field: bool packed = 8;
     */
    packed: boolean;
    /**
     * The protocol buffer options.
     *
     * @generated from protobuf field: repeated google.protobuf.Option options = 9;
     */
    options: Option[];
    /**
     * The field JSON name.
     *
     * @generated from protobuf field: string json_name = 10;
     */
    jsonName: string;
    /**
     * The string value of the default value of this field. Proto2 syntax only.
     *
     * @generated from protobuf field: string default_value = 11;
     */
    defaultValue: string;
}
/**
 * Basic field types.
 *
 * @generated from protobuf enum google.protobuf.Field.Kind
 */
export enum Field_Kind {
    /**
     * Field type unknown.
     *
     * @generated from protobuf enum value: TYPE_UNKNOWN = 0;
     */
    TYPE_UNKNOWN = 0,
    /**
     * Field type double.
     *
     * @generated from protobuf enum value: TYPE_DOUBLE = 1;
     */
    TYPE_DOUBLE = 1,
    /**
     * Field type float.
     *
     * @generated from protobuf enum value: TYPE_FLOAT = 2;
     */
    TYPE_FLOAT = 2,
    /**
     * Field type int64.
     *
     * @generated from protobuf enum value: TYPE_INT64 = 3;
     */
    TYPE_INT64 = 3,
    /**
     * Field type uint64.
     *
     * @generated from protobuf enum value: TYPE_UINT64 = 4;
     */
    TYPE_UINT64 = 4,
    /**
     * Field type int32.
     *
     * @generated from protobuf enum value: TYPE_INT32 = 5;
     */
    TYPE_INT32 = 5,
    /**
     * Field type fixed64.
     *
     * @generated from protobuf enum value: TYPE_FIXED64 = 6;
     */
    TYPE_FIXED64 = 6,
    /**
     * Field type fixed32.
     *
     * @generated from protobuf enum value: TYPE_FIXED32 = 7;
     */
    TYPE_FIXED32 = 7,
    /**
     * Field type bool.
     *
     * @generated from protobuf enum value: TYPE_BOOL = 8;
     */
    TYPE_BOOL = 8,
    /**
     * Field type string.
     *
     * @generated from protobuf enum value: TYPE_STRING = 9;
     */
    TYPE_STRING = 9,
    /**
     * Field type group. Proto2 syntax only, and deprecated.
     *
     * @generated from protobuf enum value: TYPE_GROUP = 10;
     */
    TYPE_GROUP = 10,
    /**
     * Field type message.
     *
     * @generated from protobuf enum value: TYPE_MESSAGE = 11;
     */
    TYPE_MESSAGE = 11,
    /**
     * Field type bytes.
     *
     * @generated from protobuf enum value: TYPE_BYTES = 12;
     */
    TYPE_BYTES = 12,
    /**
     * Field type uint32.
     *
     * @generated from protobuf enum value: TYPE_UINT32 = 13;
     */
    TYPE_UINT32 = 13,
    /**
     * Field type enum.
     *
     * @generated from protobuf enum value: TYPE_ENUM = 14;
     */
    TYPE_ENUM = 14,
    /**
     * Field type sfixed32.
     *
     * @generated from protobuf enum value: TYPE_SFIXED32 = 15;
     */
    TYPE_SFIXED32 = 15,
    /**
     * Field type sfixed64.
     *
     * @generated from protobuf enum value: TYPE_SFIXED64 = 16;
     */
    TYPE_SFIXED64 = 16,
    /**
     * Field type sint32.
     *
     * @generated from protobuf enum value: TYPE_SINT32 = 17;
     */
    TYPE_SINT32 = 17,
    /**
     * Field type sint64.
     *
     * @generated from protobuf enum value: TYPE_SINT64 = 18;
     */
    TYPE_SINT64 = 18
}
/**
 * Whether a field is optional, required, or repeated.
 *
 * @generated from protobuf enum google.protobuf.Field.Cardinality
 */
export enum Field_Cardinality {
    /**
     * For fields with unknown cardinality.
     *
     * @generated from protobuf enum value: CARDINALITY_UNKNOWN = 0;
     */
    UNKNOWN = 0,
    /**
     * For optional fields.
     *
     * @generated from protobuf enum value: CARDINALITY_OPTIONAL = 1;
     */
    OPTIONAL = 1,
    /**
     * For required fields. Proto2 syntax only.
     *
     * @generated from protobuf enum value: CARDINALITY_REQUIRED = 2;
     */
    REQUIRED = 2,
    /**
     * For repeated fields.
     *
     * @generated from protobuf enum value: CARDINALITY_REPEATED = 3;
     */
    REPEATED = 3
}
/**
 * Enum type definition.
 *
 * @generated from protobuf message google.protobuf.Enum
 */
export interface Enum {
    /**
     * Enum type name.
     *
     * @generated from protobuf field: string name = 1;
     */
    name: string;
    /**
     * Enum value definitions.
     *
     * @generated from protobuf field: repeated google.protobuf.EnumValue enumvalue = 2;
     */
    enumvalue: EnumValue[];
    /**
     * Protocol buffer options.
     *
     * @generated from protobuf field: repeated google.protobuf.Option options = 3;
     */
    options: Option[];
    /**
     * The source context.
     *
     * @generated from protobuf field: google.protobuf.SourceContext source_context = 4;
     */
    sourceContext?: SourceContext;
    /**
     * The source syntax.
     *
     * @generated from protobuf field: google.protobuf.Syntax syntax = 5;
     */
    syntax: Syntax;
    /**
     * The source edition string, only valid when syntax is SYNTAX_EDITIONS.
     *
     * @generated from protobuf field: string edition = 6;
     */
    edition: string;
}
/**
 * Enum value definition.
 *
 * @generated from protobuf message google.protobuf.EnumValue
 */
export interface EnumValue {
    /**
     * Enum value name.
     *
     * @generated from protobuf field: string name = 1;
     */
    name: string;
    /**
     * Enum value number.
     *
     * @generated from protobuf field: int32 number = 2;
     */
    number: number;
    /**
     * Protocol buffer options.
     *
     * @generated from protobuf field: repeated google.protobuf.Option options = 3;
     */
    options: Option[];
}
/**
 * A protocol buffer option, which can be attached to a message, field,
 * enumeration, etc.
 *
 * @generated from protobuf message google.protobuf.Option
 */
export interface Option {
    /**
     * The option's name. For protobuf built-in options (options defined in
     * descriptor.proto), this is the short name. For example, `"map_entry"`.
     * For custom options, it should be the fully-qualified name. For example,
     * `"google.api.http"`.
     *
     * @generated from protobuf field: string name = 1;
     */
    name: string;
    /**
     * The option's value packed in an Any message. If the value is a primitive,
     * the corresponding wrapper type defined in google/protobuf/wrappers.proto
     * should be used. If the value is an enum, it should be stored as an int32
     * value using the google.protobuf.Int32Value type.
     *
     * @generated from protobuf field: google.protobuf.Any value = 2;
     */
    value?: Any;
}
/**
 * The syntax in which a protocol buffer element is defined.
 *
 * @generated from protobuf enum google.protobuf.Syntax
 */
export enum Syntax {
    /**
     * Syntax `proto2`.
     *
     * @generated from protobuf enum value: SYNTAX_PROTO2 = 0;
     */
    PROTO2 = 0,
    /**
     * Syntax `proto3`.
     *
     * @generated from protobuf enum value: SYNTAX_PROTO3 = 1;
     */
    PROTO3 = 1,
    /**
     * Syntax `editions`.
     *
     * @generated from protobuf enum value: SYNTAX_EDITIONS = 2;
     */
    EDITIONS = 2
}
// @generated message type with reflection information, may provide speed optimized methods
class Type$Type extends MessageType<Type> {
    constructor() {
        super("google.protobuf.Type", [
            { no: 1, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "fields", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Field },
            { no: 3, name: "oneofs", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "options", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Option },
            { no: 5, name: "source_context", kind: "message", T: () => SourceContext },
            { no: 6, name: "syntax", kind: "enum", T: () => ["google.protobuf.Syntax", Syntax, "SYNTAX_"] },
            { no: 7, name: "edition", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message google.protobuf.Type
 */
export const Type = new Type$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Field$Type extends MessageType<Field> {
    constructor() {
        super("google.protobuf.Field", [
            { no: 1, name: "kind", kind: "enum", T: () => ["google.protobuf.Field.Kind", Field_Kind] },
            { no: 2, name: "cardinality", kind: "enum", T: () => ["google.protobuf.Field.Cardinality", Field_Cardinality, "CARDINALITY_"] },
            { no: 3, name: "number", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 4, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "type_url", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "oneof_index", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 8, name: "packed", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 9, name: "options", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Option },
            { no: 10, name: "json_name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 11, name: "default_value", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message google.protobuf.Field
 */
export const Field = new Field$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Enum$Type extends MessageType<Enum> {
    constructor() {
        super("google.protobuf.Enum", [
            { no: 1, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "enumvalue", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => EnumValue },
            { no: 3, name: "options", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Option },
            { no: 4, name: "source_context", kind: "message", T: () => SourceContext },
            { no: 5, name: "syntax", kind: "enum", T: () => ["google.protobuf.Syntax", Syntax, "SYNTAX_"] },
            { no: 6, name: "edition", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message google.protobuf.Enum
 */
export const Enum = new Enum$Type();
// @generated message type with reflection information, may provide speed optimized methods
class EnumValue$Type extends MessageType<EnumValue> {
    constructor() {
        super("google.protobuf.EnumValue", [
            { no: 1, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "number", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 3, name: "options", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Option }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message google.protobuf.EnumValue
 */
export const EnumValue = new EnumValue$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Option$Type extends MessageType<Option> {
    constructor() {
        super("google.protobuf.Option", [
            { no: 1, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "value", kind: "message", T: () => Any }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message google.protobuf.Option
 */
export const Option = new Option$Type();
