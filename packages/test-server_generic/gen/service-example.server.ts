// @generated by protobuf-ts 2.11.1 with parameter server_generic,optimize_code_size
// @generated from protobuf file "service-example.proto" (package "spec", syntax proto3)
// tslint:disable
import { RpcOutputStream } from "@protobuf-ts/runtime-rpc";
import { RpcInputStream } from "@protobuf-ts/runtime-rpc";
import { ExampleResponse } from "./service-example";
import { ExampleRequest } from "./service-example";
import { ServerCallContext } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service spec.ExampleService
 */
export interface IExampleService<T = ServerCallContext> {
    /**
     * An example unary call.
     *
     * @generated from protobuf rpc: Unary
     */
    unary(request: ExampleRequest, context: T): Promise<ExampleResponse>;
    /**
     * An example server-streaming call.
     *
     * @generated from protobuf rpc: ServerStream
     */
    serverStream(request: ExampleRequest, responses: RpcInputStream<ExampleResponse>, context: T): Promise<void>;
    /**
     * An example client-streaming call.
     *
     * @generated from protobuf rpc: ClientStream
     */
    clientStream(requests: RpcOutputStream<ExampleRequest>, context: T): Promise<ExampleResponse>;
    /**
     * An example bidi-streaming call.
     *
     * @generated from protobuf rpc: Bidi
     */
    bidi(requests: RpcOutputStream<ExampleRequest>, responses: RpcInputStream<ExampleResponse>, context: T): Promise<void>;
}
