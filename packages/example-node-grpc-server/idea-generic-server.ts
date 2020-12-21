import {ExampleRequest, ExampleResponse, ExampleService} from "./service-example";
import {MethodInfo, RpcError, RpcInputStream, RpcMetadata, RpcOutputStream, RpcStatus} from "@protobuf-ts/runtime-rpc";
import * as grpc from "@grpc/grpc-js";
import {ServiceInfo} from "../runtime-rpc";


/*
 *
 * idea: similar to service clients, generate interfaces that are agnostic to the transport.
 *
 * the user implements the interface below.
 *
 * an "adapter" is used to plug the implementation into a server, grpc, grpc-web or twirp.
 * adapters could be provided with packages.
 *
 *
 * plugin options:
 * --ts_opt server_generic
 *
 * service options:
 *   option (ts.server) = GENERIC
 *
 */


// TODO generate this interface if (ts.server) = GENERIC or --ts_opt server_generic
interface IExampleService {

    unary(request: ExampleRequest, context: ServerCallContext):
        Promise<ExampleResponse | [ExampleResponse, RpcMetadata]>;

    serverStream(request: ExampleRequest, responseStream: RpcInputStream<ExampleResponse>, context: ServerCallContext):
        Promise<RpcMetadata | void>;

    clientStream(requestStream: RpcOutputStream, context: ServerCallContext):
        Promise<ExampleResponse | [ExampleResponse, RpcMetadata]>;

    bidi(requestStream: RpcOutputStream, responseStream: RpcInputStream<ExampleResponse>, context: ServerCallContext):
        Promise<RpcMetadata | void>;

}


// TODO provide in runtime-rpc
interface ServerCallContext {

    /**
     * Reflection information about this call.
     */
    readonly method: MethodInfo;

    /**
     * Request headers being sent with the request.
     *
     * Request headers are provided in the `meta` property of the
     * `RpcOptions` passed to a call.
     */
    readonly requestHeaders: Readonly<RpcMetadata>;

    readonly deadline: Date;

    responseTrailers: RpcMetadata;

    status: RpcStatus;

    sendResponseHeaders(data: RpcMetadata): void;
}


// user implements:
const imp: IExampleService = {


    async unary(request: ExampleRequest, context: ServerCallContext): Promise<ExampleResponse | [ExampleResponse, RpcMetadata]> {
        return ExampleResponse.create();
    },


    async serverStream(request: ExampleRequest, response: RpcInputStream<ExampleResponse>, context: ServerCallContext): Promise<RpcMetadata | void> {

        context.responseTrailers["foo"] = "bar";
        context.status = {
            code: "x",
            detail: ""
        };

        context.sendResponseHeaders({});
        context.requestHeaders["Authorization"];

        await response.send(ExampleResponse.create());
        await response.complete();
        return {};
    },


    async clientStream(requestStream: RpcOutputStream<ExampleRequest>, context: ServerCallContext): Promise<ExampleResponse | [ExampleResponse, RpcMetadata]> {
        for await (let request of requestStream) {
            request.question;
        }
        return [ExampleResponse.create(), {x: "y"}];
    },


    async bidi(requestStream: RpcOutputStream<ExampleRequest>, responseStream: RpcInputStream<ExampleResponse>, context: ServerCallContext): Promise<RpcMetadata | void> {

        for await (let request of requestStream) {
            request.question;
            await responseStream.send(ExampleResponse.create());
        }

        throw new RpcError("not implemented");
    },


};


// TODO provide in @protobuf-ts/grpc-backend
function createAdapter(serviceInfo: ServiceInfo, serviceImplementation: any): [grpc.ServiceDefinition, grpc.UntypedServiceImplementation] {

    // create a grpc.ServiceDefinition from our serviceInfo
    const grpcDefinition = createGrpcDefinition(serviceInfo);

    // TODO create a wrapper that translates from grpc requests to our service
    const grpcImplementation: grpc.UntypedServiceImplementation = null as unknown as grpc.UntypedServiceImplementation;

    return [grpcDefinition, grpcImplementation];
}


/**
 * Create a service definition for @grpc/grpc-js from service info.
 */
function createGrpcDefinition(serviceInfo: ServiceInfo): grpc.ServiceDefinition {
    const grpcMethods: { [k: string]: grpc.MethodDefinition<any, any> } = {};
    for (let mi of serviceInfo.methods) {
        grpcMethods[mi.localName] = {
            path: `/${serviceInfo.typeName}/${mi.name}`,
            originalName: mi.name,
            requestStream: mi.clientStreaming,
            responseStream: mi.serverStreaming,
            responseDeserialize: bytes => mi.O.fromBinary(bytes),
            requestDeserialize: bytes => mi.I.fromBinary(bytes),
            responseSerialize: value => Buffer.from(mi.O.toBinary(value)),
            requestSerialize: value => Buffer.from(mi.I.toBinary(value)),
        };
    }
    return grpcMethods;
}


// usage:
const server = new grpc.Server();
const [definition, implementation] = createAdapter(ExampleService, imp);
server.addService(definition, implementation);
