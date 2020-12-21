import {ExampleRequest, ExampleResponse, ExampleService} from "./service-example";
import {RpcError, RpcInputStream, RpcOutputStream} from "@protobuf-ts/runtime-rpc";
import * as grpc from "@grpc/grpc-js";
import {ServerCallContext} from "./idea-runtime-rpc";
import {adaptService} from "./idea-grpc-adapter";


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

    unary(request: ExampleRequest, context: ServerCallContext): Promise<ExampleResponse>;

    serverStream(request: ExampleRequest, responseStream: RpcInputStream<ExampleResponse>, context: ServerCallContext): Promise<void>;

    clientStream(requestStream: RpcOutputStream, context: ServerCallContext): Promise<ExampleResponse>;

    bidi(requestStream: RpcOutputStream, responseStream: RpcInputStream<ExampleResponse>, context: ServerCallContext): Promise<void>;

}


// user implements:
const imp: IExampleService = {


    async unary(request: ExampleRequest, context: ServerCallContext): Promise<ExampleResponse> {

        context.sendResponseHeaders({
            'status': 'processing...'
        });

        context.trailers = {
            'status': '...done'
        };

        return ExampleResponse.create({
            answer: `You asked: ${request.question}`,
        });
    },


    async serverStream(request: ExampleRequest, response: RpcInputStream<ExampleResponse>, context: ServerCallContext): Promise<void> {

        context.trailers["foo"] = "bar";
        context.status = {
            code: "OK",
            detail: "YEAH"
        };

        context.sendResponseHeaders({});
        context.headers["Authorization"];

        await response.send(ExampleResponse.create({
            answer: "x1"
        }));
        await response.send(ExampleResponse.create({
            answer: "x2"
        }));
        await response.complete();

    },


    async clientStream(requestStream: RpcOutputStream<ExampleRequest>, context: ServerCallContext): Promise<ExampleResponse> {
        for await (let request of requestStream) {
            request.question;
        }
        context.trailers = {x: "y"};
        return ExampleResponse.create();
    },


    async bidi(requestStream: RpcOutputStream<ExampleRequest>, responseStream: RpcInputStream<ExampleResponse>, context: ServerCallContext): Promise<void> {

        for await (let request of requestStream) {
            request.question;
            await responseStream.send(ExampleResponse.create());
        }

        throw new RpcError("not implemented");
    },


};


const host = '0.0.0.0:5000';

// usage:
const server = new grpc.Server();
server.addService(...adaptService(ExampleService, imp));
server.bindAsync(
    host,
    grpc.ServerCredentials.createInsecure(),
    (err: Error | null, port: number) => {
        if (err) {
            console.error(`Server error: ${err.message}`);
        } else {
            console.log(`Server bound on port: ${port}`);
            server.start();
        }
    }
);
