// @generated by protobuf-ts 2.9.6 with parameter force_optimize_code_size
// @generated from protobuf file "exclude-options.proto" (package "spec", syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { ServiceWithExcludedOptions } from "./exclude-options";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { Empty } from "./google/protobuf/empty";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service spec.ServiceWithExcludedOptions
 */
export interface IServiceWithExcludedOptionsClient {
    /**
     * @generated from protobuf rpc: Test(google.protobuf.Empty) returns (google.protobuf.Empty);
     */
    test(input: Empty, options?: RpcOptions): UnaryCall<Empty, Empty>;
}
/**
 * @generated from protobuf service spec.ServiceWithExcludedOptions
 */
export class ServiceWithExcludedOptionsClient implements IServiceWithExcludedOptionsClient, ServiceInfo {
    typeName = ServiceWithExcludedOptions.typeName;
    methods = ServiceWithExcludedOptions.methods;
    options = ServiceWithExcludedOptions.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: Test(google.protobuf.Empty) returns (google.protobuf.Empty);
     */
    test(input: Empty, options?: RpcOptions): UnaryCall<Empty, Empty> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<Empty, Empty>("unary", this._transport, method, opt, input);
    }
}
