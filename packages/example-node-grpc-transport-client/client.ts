import {ChannelCredentials} from "@grpc/grpc-js";
import {ExampleRequest, FailRequest} from "./service-example";
import {GrpcTransport} from "@protobuf-ts/grpc-transport";
import {ExampleServiceClient, IExampleServiceClient} from "./service-example.client";


const transport = new GrpcTransport({
    host: "localhost:5000",
    channelCredentials: ChannelCredentials.createInsecure(),
});

const client = new ExampleServiceClient(transport);

async function main() {

    await callUnary(client);

    await callServerStream(client);

    await callClientStream(client);

    await callBidi(client);

}


async function callUnary(client: IExampleServiceClient) {

    const call = client.unary({
        question: 'whats up?',
        pleaseDelayResponseMs: 50,
        pleaseFail: FailRequest.FAIL_REQUEST_NONE,
        disableSendingExampleResponseHeaders: false,
    });

    console.log(`### calling method "${call.method.name}"...`)

    const headers = await call.headers;
    console.log("got response headers: ", headers)

    const response = await call.response;
    console.log("got response message: ", response)

    const status = await call.status;
    console.log("got status: ", status)

    const trailers = await call.trailers;
    console.log("got trailers: ", trailers)

    console.log();
}


async function callServerStream(client: IExampleServiceClient) {

    const call = client.serverStream({
        question: 'whats up?',
        pleaseDelayResponseMs: 50,
        pleaseFail: FailRequest.FAIL_REQUEST_NONE,
        disableSendingExampleResponseHeaders: false,
    });

    console.log(`### calling method "${call.method.name}"...`)

    const headers = await call.headers;
    console.log("got response headers: ", headers)

    for await (let response of call.responses) {
        console.log("got response message: ", response)
    }

    const status = await call.status;
    console.log("got status: ", status)

    const trailers = await call.trailers;
    console.log("got trailers: ", trailers)

    console.log();
}


async function callClientStream(client: IExampleServiceClient) {

    const call = client.clientStream({});

    console.log(`### calling method "${call.method.name}"...`)

    console.log("sending message...");
    await call.requests.send({
        question: 'whats up? #1',
        pleaseDelayResponseMs: 50,
        pleaseFail: FailRequest.FAIL_REQUEST_NONE,
        disableSendingExampleResponseHeaders: false,
    });

    console.log("sending message...");
    await call.requests.send({
        question: 'whats up? #2',
        pleaseDelayResponseMs: 50,
        pleaseFail: FailRequest.FAIL_REQUEST_NONE,
        disableSendingExampleResponseHeaders: false,
    });

    console.log("sending message...");
    await call.requests.send({
        question: 'whats up? #3',
        pleaseDelayResponseMs: 50,
        pleaseFail: FailRequest.FAIL_REQUEST_NONE,
        disableSendingExampleResponseHeaders: false,
    });

    console.log("done sending");
    await call.requests.complete();

    const headers = await call.headers;
    console.log("got response headers: ", headers)

    const response = await call.response;
    console.log("got response message: ", response)

    const status = await call.status;
    console.log("got status: ", status)

    const trailers = await call.trailers;
    console.log("got trailers: ", trailers)

    console.log();
}


async function callBidi(client: IExampleServiceClient) {

    const call = client.bidi({});

    console.log(`### calling method "${call.method.name}"...`)

    const headers = await call.headers;
    console.log("got response headers: ", headers)

    call.responses.onMessage(message => {
        console.log("got answer: ", message.answer)
    });

    console.log("sending question...");
    await call.requests.send(ExampleRequest.create({
        question: 'whats up?'
    }));

    console.log("sending another question, then complete...");
    await call.requests.send(ExampleRequest.create({
        question: 'how are you?'
    }));
    await call.requests.complete();

    const status = await call.status;
    console.log("got status: ", status)

    const trailers = await call.trailers;
    console.log("got trailers: ", trailers)

    console.log();
}


main().catch(e => console.error(e)).finally(() => process.exit());

