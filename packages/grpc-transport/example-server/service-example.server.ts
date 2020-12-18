import {ExampleRequest, ExampleResponse} from "./service-example";
import {MethodInfo, RpcError, RpcInputStream, RpcMetadata, RpcOutputStream, RpcStatus} from "@protobuf-ts/runtime-rpc";


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


const imp: IExampleService = {


    async unary(request: ExampleRequest, context: ServerCallContext): Promise<ExampleResponse | [ExampleResponse, RpcMetadata]> {
        return ExampleResponse.create();
    },


    async serverStream(request: ExampleRequest, response: RpcInputStream<ExampleResponse>, context: ServerCallContext): Promise<RpcMetadata | void> {

        context.responseTrailers["foo"] = "bar";
        context.status = {
            code : "x",
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
