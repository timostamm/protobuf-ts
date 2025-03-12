// @generated by protobuf-ts 2.9.5 with parameter force_optimize_code_size,long_type_string
// @generated from protobuf file "msg-oneofs.proto" (package "spec", syntax proto3)
// tslint:disable
import { MessageType } from "@protobuf-ts/runtime";
/**
 * Oneof with 2 scalar members
 *
 * @generated from protobuf message spec.OneofScalarMemberMessage
 */
export interface OneofScalarMemberMessage {
    /**
     * @generated from protobuf oneof: result
     */
    result: {
        oneofKind: "value";
        /**
         * Contains the value if result available
         *
         * @generated from protobuf field: int32 value = 1;
         */
        value: number;
    } | {
        oneofKind: "error";
        /**
         * Contains error message if result not available
         *
         * @generated from protobuf field: string error = 2;
         */
        error: string;
    } | {
        oneofKind: undefined;
    };
}
/**
 * Oneof with 2 message members
 *
 * @generated from protobuf message spec.OneofMessageMemberMessage
 */
export interface OneofMessageMemberMessage {
    /**
     * @generated from protobuf oneof: objects
     */
    objects: {
        oneofKind: "a";
        /**
         * @generated from protobuf field: spec.OneofMessageMemberMessage.TestMessageA a = 1;
         */
        a: OneofMessageMemberMessage_TestMessageA;
    } | {
        oneofKind: "b";
        /**
         * @generated from protobuf field: spec.OneofMessageMemberMessage.TestMessageB b = 2;
         */
        b: OneofMessageMemberMessage_TestMessageB;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message spec.OneofMessageMemberMessage.TestMessageA
 */
export interface OneofMessageMemberMessage_TestMessageA {
    /**
     * @generated from protobuf field: string name = 1;
     */
    name: string;
}
/**
 * @generated from protobuf message spec.OneofMessageMemberMessage.TestMessageB
 */
export interface OneofMessageMemberMessage_TestMessageB {
    /**
     * @generated from protobuf field: string name = 1;
     */
    name: string;
}
// @generated message type with reflection information, may provide speed optimized methods
class OneofScalarMemberMessage$Type extends MessageType<OneofScalarMemberMessage> {
    constructor() {
        super("spec.OneofScalarMemberMessage", [
            { no: 1, name: "value", kind: "scalar", oneof: "result", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "error", kind: "scalar", oneof: "result", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message spec.OneofScalarMemberMessage
 */
export const OneofScalarMemberMessage = new OneofScalarMemberMessage$Type();
// @generated message type with reflection information, may provide speed optimized methods
class OneofMessageMemberMessage$Type extends MessageType<OneofMessageMemberMessage> {
    constructor() {
        super("spec.OneofMessageMemberMessage", [
            { no: 1, name: "a", kind: "message", oneof: "objects", T: () => OneofMessageMemberMessage_TestMessageA },
            { no: 2, name: "b", kind: "message", oneof: "objects", T: () => OneofMessageMemberMessage_TestMessageB }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message spec.OneofMessageMemberMessage
 */
export const OneofMessageMemberMessage = new OneofMessageMemberMessage$Type();
// @generated message type with reflection information, may provide speed optimized methods
class OneofMessageMemberMessage_TestMessageA$Type extends MessageType<OneofMessageMemberMessage_TestMessageA> {
    constructor() {
        super("spec.OneofMessageMemberMessage.TestMessageA", [
            { no: 1, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message spec.OneofMessageMemberMessage.TestMessageA
 */
export const OneofMessageMemberMessage_TestMessageA = new OneofMessageMemberMessage_TestMessageA$Type();
// @generated message type with reflection information, may provide speed optimized methods
class OneofMessageMemberMessage_TestMessageB$Type extends MessageType<OneofMessageMemberMessage_TestMessageB> {
    constructor() {
        super("spec.OneofMessageMemberMessage.TestMessageB", [
            { no: 1, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message spec.OneofMessageMemberMessage.TestMessageB
 */
export const OneofMessageMemberMessage_TestMessageB = new OneofMessageMemberMessage_TestMessageB$Type();
