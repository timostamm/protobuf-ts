import * as grpc from '@grpc/grpc-js';
import {ExampleRequest, ExampleResponse, FailRequest} from "./service-example";
import {exampleServiceDefinition, IExampleService} from "./service-example.grpc-server";
import {assert} from "@protobuf-ts/runtime";


const host = '0.0.0.0:5000';


const exampleService: IExampleService = {


    // how can you:
    // - send a OK status with custom details?
    // - send a message, then an error status?
    unary(call: grpc.ServerUnaryCall<ExampleRequest, ExampleResponse>, callback: grpc.sendUnaryData<ExampleResponse>): void {

        call.on('error', args => {
            console.log("example-node-grpc-server unary() got error:", args)
        })

        const responseHeaders = new grpc.Metadata();

        // by default, the server always writes some custom response headers
        if (!call.request.disableSendingExampleResponseHeaders) {
            responseHeaders.add('server-header', 'server header value');
            responseHeaders.add('server-header', 'server header value duplicate');
            responseHeaders.add('server-header-bin', Buffer.from('server header binary value'));
        }
        call.sendMetadata(responseHeaders);

        const trailers = new grpc.Metadata();

        // always add some response trailers
        trailers.add("server-trailer", "server trailer value");
        trailers.add("server-trailer", "server trailer value duplicate");
        trailers.add("server-trailer-bin", Buffer.from('server trailer binary value'));

        // wait for the requested amount of milliseconds
        setTimeout(function () {
            switch (call.request.pleaseFail) {
                case FailRequest.MESSAGE_THEN_ERROR_STATUS:
                    // does not work, client only receives error
                    callback(
                        {
                            code: grpc.status.RESOURCE_EXHAUSTED,
                            details: 'you requested an error',
                        },
                        {
                            answer: `You asked: ${call.request.question}`,
                            yourDeadline: call.getDeadline().toString(),
                            yourFailRequest: call.request.pleaseFail,
                            yourRequestHeaders: {}
                        },
                        trailers
                    );
                    break;

                case FailRequest.ERROR_STATUS_ONLY:
                    const errorMeta = new grpc.Metadata();
                    errorMeta.add('server-trailer', 'created by error response on server');
                    callback({
                        code: grpc.status.RESOURCE_EXHAUSTED,
                        details: 'you requested an error, no message',
                        metadata: errorMeta
                    });
                    break;

                case FailRequest.FAIL_REQUEST_NONE:
                    callback(
                        null,
                        {
                            answer: `You asked: ${call.request.question}`,
                            yourDeadline: call.getDeadline().toString(),
                            yourFailRequest: call.request.pleaseFail,
                            yourRequestHeaders: {}
                        },
                        trailers
                    );
                    break;

            }
        }, call.request.pleaseDelayResponseMs);
    },


    // how can you:
    // - send no messages, just an error status *with trailer metadata*
    serverStream(call: grpc.ServerWritableStream<ExampleRequest, ExampleResponse>): void {

        call.on('error', args => {
            console.log("example-node-grpc-server serverStream() got error:", args)
        })

        const responseHeaders = new grpc.Metadata();

        // by default, the server always writes some custom response headers
        if (!call.request.disableSendingExampleResponseHeaders) {
            responseHeaders.add('server-header', 'server header value');
            responseHeaders.add('server-header', 'server header value duplicate');
            responseHeaders.add('server-header-bin', Buffer.from('server header binary value'));
        }
        call.sendMetadata(responseHeaders);

        const trailers = new grpc.Metadata();

        // always add some response trailers
        trailers.add("server-trailer", "server trailer value");
        trailers.add("server-trailer", "server trailer value duplicate");
        trailers.add("server-trailer-bin", Buffer.from('server trailer binary value'));

        let sent = 0;

        function sendBunch(done: Function) {
            setTimeout(function () {

                call.write(ExampleResponse.create({
                    answer: `#${sent + 1}`
                }), function () {
                    sent++;
                    if (sent < 5) {
                        sendBunch(done);
                    } else {
                        done();
                    }
                });

            }, call.request.pleaseDelayResponseMs);
        }

        if (call.request.pleaseFail === FailRequest.ERROR_STATUS_ONLY) {

            let e: any = new Error("not implemented");

            // this is picked up
            e.code = grpc.status.UNIMPLEMENTED;

            // but this isn't
            e.metadata = new grpc.Metadata();
            e.metadata.add('info', 'test');

            call.destroy(e);

        } else {

            sendBunch(function () {

                if (call.request.pleaseFail === FailRequest.MESSAGE_THEN_ERROR_STATUS) {
                    let e: any = new Error("you requested an error");
                    e.code = grpc.status.RESOURCE_EXHAUSTED;
                    call.destroy(e);
                } else {

                    call.write({
                        answer: `You asked: ${call.request.question}, I sent ${sent} messages.`,
                        yourDeadline: call.getDeadline().toString(),
                        yourRequestHeaders: {},
                        yourFailRequest: call.request.pleaseFail
                    });

                    call.end(trailers);
                }

            });

        }

    },


    clientStream(call: grpc.ServerReadableStream<ExampleRequest, ExampleResponse>, callback: grpc.sendUnaryData<ExampleResponse>): void {

        call.on('error', args => {
            console.log("example-node-grpc-server clientStream() got error:", args)
        })
        // callback({
        //     code: grpc.status.UNIMPLEMENTED,
        // });

        const responseHeaders = new grpc.Metadata();

        // always write some response headers
        responseHeaders.add('server-header', 'server header value');
        responseHeaders.add('server-header', 'server header value duplicate');
        responseHeaders.add('server-header-bin', Buffer.from('server header binary value'));
        call.sendMetadata(responseHeaders);

        const trailers = new grpc.Metadata();

        // always add some response trailers
        trailers.add("server-trailer", "server trailer value");
        trailers.add("server-trailer", "server trailer value duplicate");
        trailers.add("server-trailer-bin", Buffer.from('server trailer binary value'));


        let questionCount = 0;

        call.on('data', args => {
            assert(ExampleRequest.is(args));
            questionCount++;
        });

        call.on('end', () => {

            callback(
                null,
                {
                    answer: `You asked ${questionCount} questions.`,
                    yourDeadline: call.getDeadline().toString(),
                    yourFailRequest: FailRequest.FAIL_REQUEST_NONE,
                    yourRequestHeaders: {}
                },
                trailers
            );

        });

    },


    bidi(call: grpc.ServerDuplexStream<ExampleRequest, ExampleResponse>): void {

        let sentWelcome = false;
        let questionsReceived = 0;
        let answersSent = 0;

        call.on('error', args => {
            console.log("example-node-grpc-server bidi() got error:", args)
        })

        call.write(ExampleResponse.create({
            answer: "welcome. ask a question."
        }), () => {
            sentWelcome = true;
        });

        call.on('data', args => {

            questionsReceived++;
            assert(ExampleRequest.is(args));

            if (sentWelcome) {
                call.write(ExampleResponse.create({
                    answer: "thanks for asking."
                }), () => {
                    answersSent++;
                });
            }
        });

        call.on('end', () => {

            call.write(ExampleResponse.create({
                answer: "you stopped asking, but I will send you one more message soon."
            }), () => {
                answersSent++;
            });

            setTimeout(function (){

                call.write(ExampleResponse.create({
                    answer: `ending this call now. you asked ${questionsReceived} questions.`
                }), () => {
                    const trailer = new grpc.Metadata();
                    trailer.add('trailer', 'yes');
                    call.end(trailer);
                });

            }, 250);

        });

    },

}


function getServer(): grpc.Server {
    const server = new grpc.Server();
    server.addService(exampleServiceDefinition, exampleService);
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
