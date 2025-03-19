// @generated by protobuf-ts 2.9.6 with parameter force_optimize_speed
// @generated from protobuf file "service-empty.proto" (package "spec", syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { EmptyService } from "./service-empty";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { Empty } from "./google/protobuf/empty";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service spec.EmptyService
 */
export interface IEmptyServiceClient {
    /**
     * @generated from protobuf rpc: Get(google.protobuf.Empty) returns (google.protobuf.Empty);
     */
    get(input: Empty, options?: RpcOptions): UnaryCall<Empty, Empty>;
}
/**
 * @generated from protobuf service spec.EmptyService
 */
export class EmptyServiceClient implements IEmptyServiceClient, ServiceInfo {
    typeName = EmptyService.typeName;
    methods = EmptyService.methods;
    options = EmptyService.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: Get(google.protobuf.Empty) returns (google.protobuf.Empty);
     */
    get(input: Empty, options?: RpcOptions): UnaryCall<Empty, Empty> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<Empty, Empty>("unary", this._transport, method, opt, input);
    }
}
