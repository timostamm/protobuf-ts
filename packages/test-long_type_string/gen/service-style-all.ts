// @generated by protobuf-ts 2.11.1 with parameter long_type_string
// @generated from protobuf file "service-style-all.proto" (package "spec", syntax proto3)
// tslint:disable
import { Int32Value } from "./google/protobuf/wrappers";
import { StringValue } from "./google/protobuf/wrappers";
import { ServiceType } from "@protobuf-ts/runtime-rpc";
/**
 * @generated ServiceType for protobuf service spec.AllStyleService
 */
export const AllStyleService = new ServiceType("spec.AllStyleService", [
    { name: "Unary", options: {}, I: StringValue, O: Int32Value },
    { name: "ServerStream", serverStreaming: true, options: {}, I: StringValue, O: Int32Value },
    { name: "ClientStream", clientStreaming: true, options: {}, I: StringValue, O: Int32Value },
    { name: "Bidi", serverStreaming: true, clientStreaming: true, options: {}, I: StringValue, O: Int32Value }
]);
