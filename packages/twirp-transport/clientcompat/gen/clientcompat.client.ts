// @generated by protobuf-ts 2.9.6
// @generated from protobuf file "clientcompat.proto" (package "twirp.clientcompat", syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { CompatService } from "./clientcompat";
import type { Empty } from "./clientcompat";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { Resp } from "./clientcompat";
import type { Req } from "./clientcompat";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service twirp.clientcompat.CompatService
 */
export interface ICompatServiceClient {
    /**
     * @generated from protobuf rpc: Method(twirp.clientcompat.Req) returns (twirp.clientcompat.Resp);
     */
    method(input: Req, options?: RpcOptions): UnaryCall<Req, Resp>;
    /**
     * @generated from protobuf rpc: NoopMethod(twirp.clientcompat.Empty) returns (twirp.clientcompat.Empty);
     */
    noopMethod(input: Empty, options?: RpcOptions): UnaryCall<Empty, Empty>;
}
/**
 * @generated from protobuf service twirp.clientcompat.CompatService
 */
export class CompatServiceClient implements ICompatServiceClient, ServiceInfo {
    typeName = CompatService.typeName;
    methods = CompatService.methods;
    options = CompatService.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: Method(twirp.clientcompat.Req) returns (twirp.clientcompat.Resp);
     */
    method(input: Req, options?: RpcOptions): UnaryCall<Req, Resp> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<Req, Resp>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: NoopMethod(twirp.clientcompat.Empty) returns (twirp.clientcompat.Empty);
     */
    noopMethod(input: Empty, options?: RpcOptions): UnaryCall<Empty, Empty> {
        const method = this.methods[1], opt = this._transport.mergeOptions(options);
        return stackIntercept<Empty, Empty>("unary", this._transport, method, opt, input);
    }
}
