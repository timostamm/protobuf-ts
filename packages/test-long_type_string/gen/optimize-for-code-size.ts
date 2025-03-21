// @generated by protobuf-ts 2.9.6 with parameter long_type_string
// @generated from protobuf file "optimize-for-code-size.proto" (package "spec", syntax proto3)
// tslint:disable
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message spec.OptimizeForCodeSizeMessage
 */
export interface OptimizeForCodeSizeMessage {
    /**
     * @generated from protobuf field: double double_field = 1;
     */
    doubleField: number;
    /**
     * @generated from protobuf field: float float_field = 2;
     */
    floatField: number;
}
// @generated message type with reflection information, may provide speed optimized methods
class OptimizeForCodeSizeMessage$Type extends MessageType<OptimizeForCodeSizeMessage> {
    constructor() {
        super("spec.OptimizeForCodeSizeMessage", [
            { no: 1, name: "double_field", kind: "scalar", T: 1 /*ScalarType.DOUBLE*/ },
            { no: 2, name: "float_field", kind: "scalar", T: 2 /*ScalarType.FLOAT*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message spec.OptimizeForCodeSizeMessage
 */
export const OptimizeForCodeSizeMessage = new OptimizeForCodeSizeMessage$Type();
