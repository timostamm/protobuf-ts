// @generated by protobuf-ts 2.9.5 with parameter force_optimize_code_size
// @generated from protobuf file "wkt-field-mask.proto" (package "spec", syntax proto3)
// tslint:disable
import { MessageType } from "@protobuf-ts/runtime";
import { FieldMask } from "./google/protobuf/field_mask";
/**
 * @generated from protobuf message spec.FieldMaskMessage
 */
export interface FieldMaskMessage {
    /**
     * https://github.com/protocolbuffers/protobuf/blob/master/src/google/protobuf/field_mask.proto
     *
     * @generated from protobuf field: google.protobuf.FieldMask field_mask_field = 1;
     */
    fieldMaskField?: FieldMask;
}
// @generated message type with reflection information, may provide speed optimized methods
class FieldMaskMessage$Type extends MessageType<FieldMaskMessage> {
    constructor() {
        super("spec.FieldMaskMessage", [
            { no: 1, name: "field_mask_field", kind: "message", T: () => FieldMask }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message spec.FieldMaskMessage
 */
export const FieldMaskMessage = new FieldMaskMessage$Type();
