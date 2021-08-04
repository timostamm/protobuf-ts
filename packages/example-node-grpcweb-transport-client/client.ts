import {FailRequest} from "./service-example";
import {ExampleServiceClient, IExampleServiceClient} from "./service-example.client";
import {GrpcWebFetchTransport} from "@protobuf-ts/grpcweb-transport";
import {default as fetch, Headers} from "node-fetch";


// fetch polyfill via https://github.com/node-fetch/node-fetch
globalThis.fetch = fetch as any;
globalThis.Headers = Headers as any;


const transport = new GrpcWebFetchTransport({
    baseUrl: "http://localhost:5080"
});

const client = new ExampleServiceClient(transport);

async function main() {

    await callUnary(client);

    await callServerStream(client);

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



main().catch(e => console.error(e)).finally(() => process.exit());

