// @generated by protobuf-ts 2.9.6 with parameter force_optimize_speed
// @generated from protobuf file "service-empty.proto" (package "spec", syntax proto3)
// tslint:disable
import { Empty } from "./google/protobuf/empty";
import { ServiceType } from "@protobuf-ts/runtime-rpc";
/**
 * @generated ServiceType for protobuf service spec.EmptyService
 */
export const EmptyService = new ServiceType("spec.EmptyService", [
    { name: "Get", options: {}, I: Empty, O: Empty }
]);
