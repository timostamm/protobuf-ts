// @generated by protobuf-ts 2.9.5 with parameter force_optimize_code_size
// @generated from protobuf file "wkt-any.proto" (package "spec", syntax proto3)
// tslint:disable
import { MessageType } from "@protobuf-ts/runtime";
import { Any } from "./google/protobuf/any";
/**
 * @generated from protobuf message spec.AnyMessage
 */
export interface AnyMessage {
    /**
     * https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/any.proto
     *
     * @generated from protobuf field: google.protobuf.Any any_field = 1;
     */
    anyField?: Any;
}
// @generated message type with reflection information, may provide speed optimized methods
class AnyMessage$Type extends MessageType<AnyMessage> {
    constructor() {
        super("spec.AnyMessage", [
            { no: 1, name: "any_field", kind: "message", T: () => Any }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message spec.AnyMessage
 */
export const AnyMessage = new AnyMessage$Type();
