import {GrpcWebFetchTransport} from "@protobuf-ts/grpcweb-transport";
import {ElizaServiceClient, IElizaServiceClient} from "./eliza.client";


const transport = new GrpcWebFetchTransport({
    baseUrl: "https://demo.connectrpc.com",
    // The demo service does not support the gRPC-Web Text format
    format: "binary",
});


const client = new ElizaServiceClient(transport);

async function main() {

    await callUnary(client);

    await callServerStream(client);

}


async function callUnary(client: IElizaServiceClient) {

    const call = client.say({
        sentence: "hi",
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


async function callServerStream(client: IElizaServiceClient) {

    const call = client.introduce({
        name: 'Donald',
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


main().catch(e => console.error(e));

