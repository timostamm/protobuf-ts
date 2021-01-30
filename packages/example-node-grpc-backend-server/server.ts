import * as grpc from '@grpc/grpc-js';
import {ExampleRequest, ExampleResponse, ExampleService} from "./service-example";
import {IExampleService} from "./service-example.server";
import {RpcInputStream, RpcOutputStream, ServerCallContext} from "@protobuf-ts/runtime-rpc";
import {adaptService} from "@protobuf-ts/grpc-backend";


const host = '0.0.0.0:5000';


const exampleService: IExampleService = {


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


    async serverStream(request: ExampleRequest, responses: RpcInputStream<ExampleResponse>, context: ServerCallContext): Promise<void> {

        context.trailers["foo"] = "bar";
        context.status = {
            code: "OK",
            detail: "YEAH"
        };

        context.sendResponseHeaders({});
        context.headers["Authorization"];

        await responses.send(ExampleResponse.create({
            answer: "x1"
        }));
        await responses.send(ExampleResponse.create({
            answer: "x2"
        }));
        await responses.complete();

    },


    async clientStream(requests: RpcOutputStream<ExampleRequest>, context: ServerCallContext): Promise<ExampleResponse> {
        for await (let request of requests) {
            request.question;
        }
        context.trailers = {x: "y"};
        return ExampleResponse.create();
    },


    async bidi(requests: RpcOutputStream<ExampleRequest>, responses: RpcInputStream<ExampleResponse>, context: ServerCallContext): Promise<void> {

        // context.sendResponseHeaders({});

        let sentWelcome = false;
        let questionsReceived = 0;
        let answersSent = 0;

        await responses.send(ExampleResponse.create({
            answer: "welcome. ask a question."
        }));
        sentWelcome = true;

        for await (let request of requests) {
            questionsReceived++;
            await responses.send(ExampleResponse.create({
                answer: "thanks for asking."
            }));
            answersSent++;
        }

        await responses.send(ExampleResponse.create({
            answer: "you stopped asking, but I will send you one more message soon."
        }));
        answersSent++;

        await new Promise(resolve => setTimeout(resolve, 250));

        await responses.send(ExampleResponse.create({
            answer: `ending this call now. you asked ${questionsReceived} questions.`
        }));

        context.trailers = {
            trailer: 'yes'
        };

    },


};


function getServer(): grpc.Server {
    const server = new grpc.Server();
    server.addService(...adaptService(ExampleService, exampleService));
    return server;
}


if (require.main === module) {
    const server = getServer();
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
}
