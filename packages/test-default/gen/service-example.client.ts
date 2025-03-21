// @generated by protobuf-ts 2.9.6
// @generated from protobuf file "service-example.proto" (package "spec", syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { ExampleService } from "./service-example";
import type { DuplexStreamingCall } from "@protobuf-ts/runtime-rpc";
import type { ClientStreamingCall } from "@protobuf-ts/runtime-rpc";
import type { ServerStreamingCall } from "@protobuf-ts/runtime-rpc";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { ExampleResponse } from "./service-example";
import type { ExampleRequest } from "./service-example";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service spec.ExampleService
 */
export interface IExampleServiceClient {
    /**
     * An example unary call.
     *
     * @generated from protobuf rpc: Unary(spec.ExampleRequest) returns (spec.ExampleResponse);
     */
    unary(input: ExampleRequest, options?: RpcOptions): UnaryCall<ExampleRequest, ExampleResponse>;
    /**
     * An example server-streaming call.
     *
     * @generated from protobuf rpc: ServerStream(spec.ExampleRequest) returns (stream spec.ExampleResponse);
     */
    serverStream(input: ExampleRequest, options?: RpcOptions): ServerStreamingCall<ExampleRequest, ExampleResponse>;
    /**
     * An example client-streaming call.
     *
     * @generated from protobuf rpc: ClientStream(stream spec.ExampleRequest) returns (spec.ExampleResponse);
     */
    clientStream(options?: RpcOptions): ClientStreamingCall<ExampleRequest, ExampleResponse>;
    /**
     * An example bidi-streaming call.
     *
     * @generated from protobuf rpc: Bidi(stream spec.ExampleRequest) returns (stream spec.ExampleResponse);
     */
    bidi(options?: RpcOptions): DuplexStreamingCall<ExampleRequest, ExampleResponse>;
}
/**
 * @generated from protobuf service spec.ExampleService
 */
export class ExampleServiceClient implements IExampleServiceClient, ServiceInfo {
    typeName = ExampleService.typeName;
    methods = ExampleService.methods;
    options = ExampleService.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * An example unary call.
     *
     * @generated from protobuf rpc: Unary(spec.ExampleRequest) returns (spec.ExampleResponse);
     */
    unary(input: ExampleRequest, options?: RpcOptions): UnaryCall<ExampleRequest, ExampleResponse> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<ExampleRequest, ExampleResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * An example server-streaming call.
     *
     * @generated from protobuf rpc: ServerStream(spec.ExampleRequest) returns (stream spec.ExampleResponse);
     */
    serverStream(input: ExampleRequest, options?: RpcOptions): ServerStreamingCall<ExampleRequest, ExampleResponse> {
        const method = this.methods[1], opt = this._transport.mergeOptions(options);
        return stackIntercept<ExampleRequest, ExampleResponse>("serverStreaming", this._transport, method, opt, input);
    }
    /**
     * An example client-streaming call.
     *
     * @generated from protobuf rpc: ClientStream(stream spec.ExampleRequest) returns (spec.ExampleResponse);
     */
    clientStream(options?: RpcOptions): ClientStreamingCall<ExampleRequest, ExampleResponse> {
        const method = this.methods[2], opt = this._transport.mergeOptions(options);
        return stackIntercept<ExampleRequest, ExampleResponse>("clientStreaming", this._transport, method, opt);
    }
    /**
     * An example bidi-streaming call.
     *
     * @generated from protobuf rpc: Bidi(stream spec.ExampleRequest) returns (stream spec.ExampleResponse);
     */
    bidi(options?: RpcOptions): DuplexStreamingCall<ExampleRequest, ExampleResponse> {
        const method = this.methods[3], opt = this._transport.mergeOptions(options);
        return stackIntercept<ExampleRequest, ExampleResponse>("duplex", this._transport, method, opt);
    }
}
