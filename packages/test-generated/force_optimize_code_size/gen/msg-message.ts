// @generated by protobuf-ts 2.9.5 with parameter force_optimize_code_size
// @generated from protobuf file "msg-message.proto" (package "spec", syntax proto3)
// tslint:disable
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message spec.MessageFieldMessage
 */
export interface MessageFieldMessage {
    /**
     * @generated from protobuf field: spec.MessageFieldMessage.TestMessage message_field = 1;
     */
    messageField?: MessageFieldMessage_TestMessage;
    /**
     * @generated from protobuf field: repeated spec.MessageFieldMessage.TestMessage repeated_message_field = 2;
     */
    repeatedMessageField: MessageFieldMessage_TestMessage[];
}
/**
 * @generated from protobuf message spec.MessageFieldMessage.TestMessage
 */
export interface MessageFieldMessage_TestMessage {
    /**
     * @generated from protobuf field: string name = 1;
     */
    name: string;
}
// @generated message type with reflection information, may provide speed optimized methods
class MessageFieldMessage$Type extends MessageType<MessageFieldMessage> {
    constructor() {
        super("spec.MessageFieldMessage", [
            { no: 1, name: "message_field", kind: "message", T: () => MessageFieldMessage_TestMessage },
            { no: 2, name: "repeated_message_field", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => MessageFieldMessage_TestMessage }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message spec.MessageFieldMessage
 */
export const MessageFieldMessage = new MessageFieldMessage$Type();
// @generated message type with reflection information, may provide speed optimized methods
class MessageFieldMessage_TestMessage$Type extends MessageType<MessageFieldMessage_TestMessage> {
    constructor() {
        super("spec.MessageFieldMessage.TestMessage", [
            { no: 1, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message spec.MessageFieldMessage.TestMessage
 */
export const MessageFieldMessage_TestMessage = new MessageFieldMessage_TestMessage$Type();
