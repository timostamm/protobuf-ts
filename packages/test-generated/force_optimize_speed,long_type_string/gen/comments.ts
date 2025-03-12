// @generated by protobuf-ts 2.9.5 with parameter force_optimize_code_size,long_type_string
// @generated from protobuf file "comments.proto" (package "spec", syntax proto3)
// tslint:disable
//
// @formatter:off
//
//
// Comment after syntax.
//
import { MessageType } from "@protobuf-ts/runtime";
// Comment after package.

// Comment between package and message.

/**
 * Comment before message.
 *
 * @generated from protobuf message spec.MessageWithComments
 */
export interface MessageWithComments {
    // 
    // Comment after start of message,
    // with funny indentation,
    // and empty lines on start and end.
    // 

    /**
     * Comment before field with 5 lines:
     * line 2, next is empty
     *
     * line 4, next is empty
     *
     *
     * @generated from protobuf field: string foo = 1;
     */
    foo: string; // Comment next to field.
    /**
     * @generated from protobuf oneof: result
     */
    result: {
        oneofKind: "value";
        /**
         * @generated from protobuf field: int32 value = 2;
         */
        value: number;
    } | {
        oneofKind: "error";
        /**
         * @generated from protobuf field: string error = 3;
         */
        error: string;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: string this_field_has_an_empty_comment = 4;
     */
    thisFieldHasAnEmptyComment: string;
    /**
     * @deprecated
     * @generated from protobuf field: string this_field_is_deprecated = 5 [deprecated = true, json_name = "sdf"];
     */
    thisFieldIsDeprecated: string;
}
/**
 * Comment within empty message.
 *
 * @generated from protobuf message spec.EmptyMessageWithComment
 */
export interface EmptyMessageWithComment {
}
/**
 * see https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/descriptor.proto
 *
 * @generated from protobuf message spec.GoogleCommentExample
 */
export interface GoogleCommentExample {
    /**
     * @generated from protobuf field: int32 foo = 1;
     */
    foo: number; // Comment attached to foo.
    /**
     * Comment attached to bar.
     *
     * @generated from protobuf field: int32 bar = 2;
     */
    bar: number;
    /**
     * @generated from protobuf field: string baz = 3;
     */
    baz: string; // Comment attached to baz.
    // Another line attached to baz.
    /**
     * Comment attached to qux.
     *
     * Another line attached to qux.
     *
     * @generated from protobuf field: double qux = 4;
     */
    qux: number;
    // Detached comment for corge. This is not leading or trailing comments
    // to qux or corge because there are blank lines separating it from
    // both.

    // Detached comment for corge paragraph 2.

    /**
     * @generated from protobuf field: string corge = 5;
     */
    corge: string; // Block comment attached
    // to corge.  Leading asterisks
    // will be removed. 
    /**
     * Block comment attached to
     * grault.
     *
     * @generated from protobuf field: int32 grault = 6;
     */
    grault: number;
}
// Comment between message and enum.

/**
 * Leading comment for enum.
 *
 * Comment between start of enum and first value.
 *
 * @generated from protobuf enum spec.EnumWithComments
 */
export enum EnumWithComments {
    /**
     * Comment before enum value.
     *
     * Comment next to enum value.
     *
     * @generated from protobuf enum value: VALUE = 0;
     */
    VALUE = 0
}
/**
 * Leading comment for deprecated enum
 *
 * @deprecated
 * @generated from protobuf enum spec.DeprecatedEnumWithComment
 */
export enum DeprecatedEnumWithComment {
    /**
     * @generated from protobuf enum value: DEPRECATED_ENUM_WITH_COMMENT_A = 0;
     */
    DEPRECATED_ENUM_WITH_COMMENT_A = 0,
    /**
     * @generated from protobuf enum value: DEPRECATED_ENUM_WITH_COMMENT_B = 1;
     */
    DEPRECATED_ENUM_WITH_COMMENT_B = 1
}
/**
 * @deprecated
 * @generated from protobuf enum spec.DeprecatedEnumNoComment
 */
export enum DeprecatedEnumNoComment {
    /**
     * @generated from protobuf enum value: DEPRECATED_ENUM_NO_COMMENT_A = 0;
     */
    DEPRECATED_ENUM_NO_COMMENT_A = 0,
    /**
     * @generated from protobuf enum value: DEPRECATED_ENUM_NO_COMMENT_B = 1;
     */
    DEPRECATED_ENUM_NO_COMMENT_B = 1
}
// @generated message type with reflection information, may provide speed optimized methods
class MessageWithComments$Type extends MessageType<MessageWithComments> {
    constructor() {
        super("spec.MessageWithComments", [
            { no: 1, name: "foo", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "value", kind: "scalar", oneof: "result", T: 5 /*ScalarType.INT32*/ },
            { no: 3, name: "error", kind: "scalar", oneof: "result", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "this_field_has_an_empty_comment", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "this_field_is_deprecated", kind: "scalar", jsonName: "sdf", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message spec.MessageWithComments
 */
export const MessageWithComments = new MessageWithComments$Type();
// @generated message type with reflection information, may provide speed optimized methods
class EmptyMessageWithComment$Type extends MessageType<EmptyMessageWithComment> {
    constructor() {
        super("spec.EmptyMessageWithComment", []);
    }
}
/**
 * @generated MessageType for protobuf message spec.EmptyMessageWithComment
 */
export const EmptyMessageWithComment = new EmptyMessageWithComment$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GoogleCommentExample$Type extends MessageType<GoogleCommentExample> {
    constructor() {
        super("spec.GoogleCommentExample", [
            { no: 1, name: "foo", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "bar", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 3, name: "baz", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "qux", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 5, name: "corge", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "grault", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message spec.GoogleCommentExample
 */
export const GoogleCommentExample = new GoogleCommentExample$Type();
