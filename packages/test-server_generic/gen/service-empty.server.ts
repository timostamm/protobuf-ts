// @generated by protobuf-ts 2.11.1 with parameter server_generic,optimize_code_size
// @generated from protobuf file "service-empty.proto" (package "spec", syntax proto3)
// tslint:disable
import { Empty } from "./google/protobuf/empty";
import { ServerCallContext } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service spec.EmptyService
 */
export interface IEmptyService<T = ServerCallContext> {
    /**
     * @generated from protobuf rpc: Get
     */
    get(request: Empty, context: T): Promise<Empty>;
}
