import {ExampleRequest, ExampleResponse, ExampleService} from "./service-example";
import * as grpc from "@grpc/grpc-js";
import {BinaryReadOptions, BinaryWriteOptions} from "../runtime";


// TODO generate the client below for plugin parameter "client_grpc1"

// TODO accept a callback for server streams? see what other generated clients accept

// TODO reserved property names:
// public close()
// public getChannel()
// public waitForReady()
// private checkOptionalUnaryResponseArguments()
// public makeUnaryRequest()
// public makeClientStreamRequest()
// public makeServerStreamRequest()
// public makeBidiStreamRequest()



interface UnaryCallback<ResponseType> {
    (err: grpc.ServiceError | null, value?: ResponseType): void;
}


/**
 * @generated from protobuf service spec.ExampleService
 */
export class ExampleServiceClient extends grpc.Client {


    private readonly _binaryOptions: Partial<BinaryReadOptions & BinaryWriteOptions>;


    constructor(
        address: string,
        credentials: grpc.ChannelCredentials,
        options: grpc.ClientOptions = {},
        binaryOptions: Partial<BinaryReadOptions & BinaryWriteOptions> = {}
    ) {
        super(address, credentials, options);
        this._binaryOptions = binaryOptions;
    }


    /**
     * @generated from protobuf rpc: Unary(spec.ExampleRequest) returns (spec.ExampleResponse);
     */
    unary(input: ExampleRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: UnaryCallback<ExampleResponse>): grpc.ClientUnaryCall;
    unary(input: ExampleRequest, metadata: grpc.Metadata, callback: UnaryCallback<ExampleResponse>): grpc.ClientUnaryCall;
    unary(input: ExampleRequest, options: grpc.CallOptions, callback: UnaryCallback<ExampleResponse>): grpc.ClientUnaryCall;
    unary(input: ExampleRequest, callback: UnaryCallback<ExampleResponse>): grpc.ClientUnaryCall;
    unary(input: ExampleRequest, metadata: grpc.Metadata | grpc.CallOptions | UnaryCallback<ExampleResponse>, options?: grpc.CallOptions | UnaryCallback<ExampleResponse>, callback?: UnaryCallback<ExampleResponse>): grpc.ClientUnaryCall {
        const method = ExampleService.methods[0];
        return this.makeUnaryRequest<ExampleRequest, ExampleResponse>(
            `/${ExampleService.typeName}/${method.name}`,
            (value: ExampleRequest): Buffer => Buffer.from(method.I.toBinary(value, this._binaryOptions)),
            (value: Buffer): ExampleResponse => method.O.fromBinary(value, this._binaryOptions),
            input,
            metadata as any,
            options as any,
            callback as any
        );
    }


    /**
     * @generated from protobuf rpc: ServerStream(spec.ExampleRequest) returns (stream spec.ExampleResponse);
     */
    serverStream(input: ExampleRequest, metadata?: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<ExampleResponse>;
    serverStream(input: ExampleRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<ExampleResponse>;
    serverStream(input: ExampleRequest, metadata?: grpc.Metadata | grpc.CallOptions, options?: grpc.CallOptions): grpc.ClientReadableStream<ExampleResponse> {
        const method = ExampleService.methods[1];
        return this.makeServerStreamRequest<ExampleRequest, ExampleResponse>(
            `/${ExampleService.typeName}/${method.name}`,
            (value: ExampleRequest): Buffer => Buffer.from(method.I.toBinary(value, this._binaryOptions)),
            (value: Buffer): ExampleResponse => method.O.fromBinary(value, this._binaryOptions),
            input,
            metadata as any,
            options
        );
    }


    /**
     * @generated from protobuf rpc: ClientStream(stream spec.ExampleRequest) returns (spec.ExampleResponse);
     */
    clientStream(metadata: grpc.Metadata, options: grpc.CallOptions, callback: UnaryCallback<ExampleResponse>): grpc.ClientWritableStream<ExampleRequest>;
    clientStream(metadata: grpc.Metadata, callback: UnaryCallback<ExampleResponse>): grpc.ClientWritableStream<ExampleRequest>;
    clientStream(options: grpc.CallOptions, callback: UnaryCallback<ExampleResponse>): grpc.ClientWritableStream<ExampleRequest>;
    clientStream(callback: UnaryCallback<ExampleResponse>): grpc.ClientWritableStream<ExampleRequest>;
    clientStream(metadata: grpc.Metadata | grpc.CallOptions | UnaryCallback<ExampleResponse>, options?: grpc.CallOptions | UnaryCallback<ExampleResponse>, callback?: UnaryCallback<ExampleResponse>): grpc.ClientWritableStream<ExampleRequest> {
        const method = ExampleService.methods[2];
        return this.makeClientStreamRequest<ExampleRequest, ExampleResponse>(
            `/${ExampleService.typeName}/${method.name}`,
            (value: ExampleRequest): Buffer => Buffer.from(method.I.toBinary(value, this._binaryOptions)),
            (value: Buffer): ExampleResponse => method.O.fromBinary(value, this._binaryOptions),
            metadata as any,
            options as any,
            callback as any
        );
    }


    /**
     * @generated from protobuf rpc: Bidi(stream spec.ExampleRequest) returns (stream spec.ExampleResponse);
     */
    bidi(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<ExampleRequest, ExampleResponse>;
    bidi(options?: grpc.CallOptions): grpc.ClientDuplexStream<ExampleRequest, ExampleResponse>;
    bidi(metadata?: grpc.Metadata | grpc.CallOptions, options?: grpc.CallOptions): grpc.ClientDuplexStream<ExampleRequest, ExampleResponse> {
        const method = ExampleService.methods[3];
        return this.makeBidiStreamRequest<ExampleRequest, ExampleResponse>(
            `/${ExampleService.typeName}/${method.name}`,
            (value: ExampleRequest): Buffer => Buffer.from(method.I.toBinary(value, this._binaryOptions)),
            (value: Buffer): ExampleResponse => method.O.fromBinary(value, this._binaryOptions),
            metadata as any,
            options
        );
    }


}
