// @generated by protobuf-ts 2.9.6 with parameter force_optimize_code_size
// @generated from protobuf file "service-annotated.proto" (package "spec", syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { AnnotatedService } from "./service-annotated";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { AnnoGetResponse } from "./service-annotated";
import type { AnnoGetRequest } from "./service-annotated";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service spec.AnnotatedService
 */
export interface IAnnotatedServiceClient {
    /**
     * @generated from protobuf rpc: Get(spec.AnnoGetRequest) returns (spec.AnnoGetResponse);
     */
    get(input: AnnoGetRequest, options?: RpcOptions): UnaryCall<AnnoGetRequest, AnnoGetResponse>;
}
/**
 * @generated from protobuf service spec.AnnotatedService
 */
export class AnnotatedServiceClient implements IAnnotatedServiceClient, ServiceInfo {
    typeName = AnnotatedService.typeName;
    methods = AnnotatedService.methods;
    options = AnnotatedService.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: Get(spec.AnnoGetRequest) returns (spec.AnnoGetResponse);
     */
    get(input: AnnoGetRequest, options?: RpcOptions): UnaryCall<AnnoGetRequest, AnnoGetResponse> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<AnnoGetRequest, AnnoGetResponse>("unary", this._transport, method, opt, input);
    }
}
