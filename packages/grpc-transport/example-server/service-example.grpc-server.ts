import * as grpc from "@grpc/grpc-js";
import {ExampleRequest, ExampleResponse, ExampleService} from "./service-example";


// TODO #52 this should be generated

/*
 * plugin options:
 * --ts_opt server_grpc
 * --ts_opt force_server_none
 *
 * service options:
 *   option (ts.server) = GRPC
 */


/**
 * @generated interface for gRPC servers with @grpc/grpc-js
 * @generated from protobuf service spec.ExampleService
 */
export interface IExampleService extends grpc.UntypedServiceImplementation {
    unary: grpc.handleUnaryCall<ExampleRequest, ExampleResponse>;
    serverStream: grpc.handleServerStreamingCall<ExampleRequest, ExampleResponse>;
    clientStream: grpc.handleClientStreamingCall<ExampleRequest, ExampleResponse>;
    bidi: grpc.handleBidiStreamingCall<ExampleRequest, ExampleResponse>;
}

/**
 * @generated ServiceDefinition for gRPC servers with @grpc/grpc-js
 * @generated from protobuf service spec.ExampleService
 */
export const exampleServiceDefinition: grpc.ServiceDefinition<IExampleService> = {
    unary: {
        path: `/${ExampleService.typeName}/${ExampleService.methods[0].name}`,
        originalName: ExampleService.methods[0].name,
        requestStream: ExampleService.methods[0].clientStreaming,
        responseStream: ExampleService.methods[0].serverStreaming,
        responseDeserialize: bytes => ExampleService.methods[0].O.fromBinary(bytes),
        requestDeserialize: bytes => ExampleService.methods[0].I.fromBinary(bytes),
        responseSerialize: value => Buffer.from(ExampleService.methods[0].O.toBinary(value)),
        requestSerialize: value => Buffer.from(ExampleService.methods[0].I.toBinary(value)),
    },
    serverStream: {
        path: `/${ExampleService.typeName}/${ExampleService.methods[1].name}`,
        originalName: ExampleService.methods[1].name,
        requestStream: ExampleService.methods[1].clientStreaming,
        responseStream: ExampleService.methods[1].serverStreaming,
        responseDeserialize: bytes => ExampleService.methods[1].O.fromBinary(bytes),
        requestDeserialize: bytes => ExampleService.methods[1].I.fromBinary(bytes),
        responseSerialize: value => Buffer.from(ExampleService.methods[1].O.toBinary(value)),
        requestSerialize: value => Buffer.from(ExampleService.methods[1].I.toBinary(value)),
    },
    clientStream: {
        path: `/${ExampleService.typeName}/${ExampleService.methods[2].name}`,
        originalName: ExampleService.methods[2].name,
        requestStream: ExampleService.methods[2].clientStreaming,
        responseStream: ExampleService.methods[2].serverStreaming,
        responseDeserialize: bytes => ExampleService.methods[2].O.fromBinary(bytes),
        requestDeserialize: bytes => ExampleService.methods[2].I.fromBinary(bytes),
        responseSerialize: value => Buffer.from(ExampleService.methods[2].O.toBinary(value)),
        requestSerialize: value => Buffer.from(ExampleService.methods[2].I.toBinary(value)),
    },
    bidi: {
        path: `/${ExampleService.typeName}/${ExampleService.methods[3].name}`,
        originalName: ExampleService.methods[3].name,
        requestStream: ExampleService.methods[3].clientStreaming,
        responseStream: ExampleService.methods[3].serverStreaming,
        responseDeserialize: bytes => ExampleService.methods[3].O.fromBinary(bytes),
        requestDeserialize: bytes => ExampleService.methods[3].I.fromBinary(bytes),
        responseSerialize: value => Buffer.from(ExampleService.methods[3].O.toBinary(value)),
        requestSerialize: value => Buffer.from(ExampleService.methods[3].I.toBinary(value)),
    },
};
