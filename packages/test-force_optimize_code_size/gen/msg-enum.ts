// @generated by protobuf-ts 2.9.6 with parameter force_optimize_code_size
// @generated from protobuf file "msg-enum.proto" (package "spec", syntax proto3)
// tslint:disable
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message spec.EnumFieldMessage
 */
export interface EnumFieldMessage {
    /**
     * @generated from protobuf field: spec.SimpleEnum enum_field = 1;
     */
    enumField: SimpleEnum;
    /**
     * @generated from protobuf field: repeated spec.SimpleEnum repeated_enum_field = 2;
     */
    repeatedEnumField: SimpleEnum[];
    /**
     * @generated from protobuf field: spec.AliasEnum alias_enum_field = 3;
     */
    aliasEnumField: AliasEnum;
    /**
     * @generated from protobuf field: spec.PrefixEnum prefix_enum_field = 4;
     */
    prefixEnumField: PrefixEnum;
}
/**
 * @generated from protobuf enum spec.EnumFieldMessage.TestEnum
 */
export enum EnumFieldMessage_TestEnum {
    /**
     * @generated from protobuf enum value: ANY = 0;
     */
    ANY = 0,
    /**
     * @generated from protobuf enum value: YES = 1;
     */
    YES = 1,
    /**
     * @generated from protobuf enum value: NO = 2;
     */
    NO = 2
}
/**
 * @generated from protobuf enum spec.SimpleEnum
 */
export enum SimpleEnum {
    /**
     * this is the default value
     * and this comment has more
     * than one line
     *
     * @generated from protobuf enum value: ANY = 0;
     */
    ANY = 0,
    /**
     * value for positive outcome
     *
     * @generated from protobuf enum value: YES = 1;
     */
    YES = 1,
    /**
     * negative value
     *
     * @generated from protobuf enum value: NO = 2;
     */
    NO = 2
}
/**
 * Both B and C have the same numerical value.
 *
 * @generated from protobuf enum spec.AliasEnum
 */
export enum AliasEnum {
    /**
     * @generated from protobuf enum value: A = 0;
     */
    A = 0,
    /**
     * @generated from protobuf enum value: B = 1;
     */
    B = 1,
    /**
     * @generated from protobuf enum value: B = 1;
     */
    C = 1
}
/**
 * The generated enum values should drop the "PREFIX_"
 * part at the top if the target language allows
 * (basically every language except C++).
 *
 * @generated from protobuf enum spec.PrefixEnum
 */
export enum PrefixEnum {
    /**
     * @generated from protobuf enum value: PREFIX_ENUM_ANY = 0;
     */
    ANY = 0,
    /**
     * @generated from protobuf enum value: PREFIX_ENUM_YES = 1;
     */
    YES = 1,
    /**
     * @generated from protobuf enum value: PREFIX_ENUM_NO = 2;
     */
    NO = 2
}
// @generated message type with reflection information, may provide speed optimized methods
class EnumFieldMessage$Type extends MessageType<EnumFieldMessage> {
    constructor() {
        super("spec.EnumFieldMessage", [
            { no: 1, name: "enum_field", kind: "enum", T: () => ["spec.SimpleEnum", SimpleEnum] },
            { no: 2, name: "repeated_enum_field", kind: "enum", repeat: 1 /*RepeatType.PACKED*/, T: () => ["spec.SimpleEnum", SimpleEnum] },
            { no: 3, name: "alias_enum_field", kind: "enum", T: () => ["spec.AliasEnum", AliasEnum] },
            { no: 4, name: "prefix_enum_field", kind: "enum", T: () => ["spec.PrefixEnum", PrefixEnum, "PREFIX_ENUM_"] }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message spec.EnumFieldMessage
 */
export const EnumFieldMessage = new EnumFieldMessage$Type();
