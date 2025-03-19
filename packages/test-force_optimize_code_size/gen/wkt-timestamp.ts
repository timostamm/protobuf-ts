// @generated by protobuf-ts 2.9.6 with parameter force_optimize_code_size
// @generated from protobuf file "wkt-timestamp.proto" (package "spec", syntax proto3)
// tslint:disable
import { MessageType } from "@protobuf-ts/runtime";
import { Timestamp } from "./google/protobuf/timestamp";
/**
 * @generated from protobuf message spec.TimestampMessage
 */
export interface TimestampMessage {
    /**
     * https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/timestamp.proto
     *
     * @generated from protobuf field: google.protobuf.Timestamp timestamp_field = 1;
     */
    timestampField?: Timestamp;
}
// @generated message type with reflection information, may provide speed optimized methods
class TimestampMessage$Type extends MessageType<TimestampMessage> {
    constructor() {
        super("spec.TimestampMessage", [
            { no: 1, name: "timestamp_field", kind: "message", T: () => Timestamp }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message spec.TimestampMessage
 */
export const TimestampMessage = new TimestampMessage$Type();
