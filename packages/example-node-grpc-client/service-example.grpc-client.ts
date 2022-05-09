// @generated by protobuf-ts 2.0.0-alpha.18 with parameters client_grpc1,generate_dependencies,optimize_code_size
// @generated from protobuf file "service-example.proto" (package "spec", syntax proto3)
// tslint:disable
import { ExampleService } from "./service-example";
import type { BinaryWriteOptions } from "@chippercash/protobuf-runtime";
import type { BinaryReadOptions } from "@chippercash/protobuf-runtime";
import type { ExampleResponse } from "./service-example";
import type { ExampleRequest } from "./service-example";
import * as grpc from "@grpc/grpc-js";
/**
 * @generated from protobuf service spec.ExampleService
 */
export interface IExampleServiceClient {
    /**
     * @generated from protobuf rpc: Unary(spec.ExampleRequest) returns (spec.ExampleResponse);
     */
    unary(input: ExampleRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (err: grpc.ServiceError | null, value?: ExampleResponse) => void): grpc.ClientUnaryCall;
    unary(input: ExampleRequest, metadata: grpc.Metadata, callback: (err: grpc.ServiceError | null, value?: ExampleResponse) => void): grpc.ClientUnaryCall;
    unary(input: ExampleRequest, options: grpc.CallOptions, callback: (err: grpc.ServiceError | null, value?: ExampleResponse) => void): grpc.ClientUnaryCall;
    unary(input: ExampleRequest, callback: (err: grpc.ServiceError | null, value?: ExampleResponse) => void): grpc.ClientUnaryCall;
    /**
     * @generated from protobuf rpc: ServerStream(spec.ExampleRequest) returns (stream spec.ExampleResponse);
     */
    serverStream(input: ExampleRequest, metadata?: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<ExampleResponse>;
    serverStream(input: ExampleRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<ExampleResponse>;
    /**
     * @generated from protobuf rpc: ClientStream(stream spec.ExampleRequest) returns (spec.ExampleResponse);
     */
    clientStream(metadata: grpc.Metadata, options: grpc.CallOptions, callback: (err: grpc.ServiceError | null, value?: ExampleResponse) => void): grpc.ClientWritableStream<ExampleRequest>;
    clientStream(metadata: grpc.Metadata, callback: (err: grpc.ServiceError | null, value?: ExampleResponse) => void): grpc.ClientWritableStream<ExampleRequest>;
    clientStream(options: grpc.CallOptions, callback: (err: grpc.ServiceError | null, value?: ExampleResponse) => void): grpc.ClientWritableStream<ExampleRequest>;
    clientStream(callback: (err: grpc.ServiceError | null, value?: ExampleResponse) => void): grpc.ClientWritableStream<ExampleRequest>;
    /**
     * @generated from protobuf rpc: Bidi(stream spec.ExampleRequest) returns (stream spec.ExampleResponse);
     */
    bidi(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<ExampleRequest, ExampleResponse>;
    bidi(options?: grpc.CallOptions): grpc.ClientDuplexStream<ExampleRequest, ExampleResponse>;
}
/**
 * @generated from protobuf service spec.ExampleService
 */
export class ExampleServiceClient extends grpc.Client implements IExampleServiceClient {
    private readonly _binaryOptions: Partial<BinaryReadOptions & BinaryWriteOptions>;
    constructor(address: string, credentials: grpc.ChannelCredentials, options: grpc.ClientOptions = {}, binaryOptions: Partial<BinaryReadOptions & BinaryWriteOptions> = {}) {
        super(address, credentials, options);
        this._binaryOptions = binaryOptions;
    }
    /**
     * @generated from protobuf rpc: Unary(spec.ExampleRequest) returns (spec.ExampleResponse);
     */
    unary(input: ExampleRequest, metadata: grpc.Metadata | grpc.CallOptions | ((err: grpc.ServiceError | null, value?: ExampleResponse) => void), options?: grpc.CallOptions | ((err: grpc.ServiceError | null, value?: ExampleResponse) => void), callback?: ((err: grpc.ServiceError | null, value?: ExampleResponse) => void)): grpc.ClientUnaryCall {
        const method = ExampleService.methods[0];
        return this.makeUnaryRequest<ExampleRequest, ExampleResponse>(`/${ExampleService.typeName}/${method.name}`, (value: ExampleRequest): Buffer => Buffer.from(method.I.toBinary(value, this._binaryOptions)), (value: Buffer): ExampleResponse => method.O.fromBinary(value, this._binaryOptions), input, (metadata as any), (options as any), (callback as any));
    }
    /**
     * @generated from protobuf rpc: ServerStream(spec.ExampleRequest) returns (stream spec.ExampleResponse);
     */
    serverStream(input: ExampleRequest, metadata?: grpc.Metadata | grpc.CallOptions, options?: grpc.CallOptions): grpc.ClientReadableStream<ExampleResponse> {
        const method = ExampleService.methods[1];
        return this.makeServerStreamRequest<ExampleRequest, ExampleResponse>(`/${ExampleService.typeName}/${method.name}`, (value: ExampleRequest): Buffer => Buffer.from(method.I.toBinary(value, this._binaryOptions)), (value: Buffer): ExampleResponse => method.O.fromBinary(value, this._binaryOptions), input, (metadata as any), options);
    }
    /**
     * @generated from protobuf rpc: ClientStream(stream spec.ExampleRequest) returns (spec.ExampleResponse);
     */
    clientStream(metadata: grpc.Metadata | grpc.CallOptions | ((err: grpc.ServiceError | null, value?: ExampleResponse) => void), options?: grpc.CallOptions | ((err: grpc.ServiceError | null, value?: ExampleResponse) => void), callback?: ((err: grpc.ServiceError | null, value?: ExampleResponse) => void)): grpc.ClientWritableStream<ExampleRequest> {
        const method = ExampleService.methods[2];
        return this.makeClientStreamRequest<ExampleRequest, ExampleResponse>(`/${ExampleService.typeName}/${method.name}`, (value: ExampleRequest): Buffer => Buffer.from(method.I.toBinary(value, this._binaryOptions)), (value: Buffer): ExampleResponse => method.O.fromBinary(value, this._binaryOptions), (metadata as any), (options as any), (callback as any));
    }
    /**
     * @generated from protobuf rpc: Bidi(stream spec.ExampleRequest) returns (stream spec.ExampleResponse);
     */
    bidi(metadata?: grpc.Metadata | grpc.CallOptions, options?: grpc.CallOptions): grpc.ClientDuplexStream<ExampleRequest, ExampleResponse> {
        const method = ExampleService.methods[3];
        return this.makeBidiStreamRequest<ExampleRequest, ExampleResponse>(`/${ExampleService.typeName}/${method.name}`, (value: ExampleRequest): Buffer => Buffer.from(method.I.toBinary(value, this._binaryOptions)), (value: Buffer): ExampleResponse => method.O.fromBinary(value, this._binaryOptions), (metadata as any), options);
    }
}
