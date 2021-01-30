import {ChannelCredentials} from "@grpc/grpc-js";
import {FailRequest} from "./service-example";
import {ExampleServiceClient, IExampleServiceClient} from "./todo-generate.service-example.grpc-client";


const client = new ExampleServiceClient(
    "localhost:5000",
    ChannelCredentials.createInsecure(),
    {},
    {}
);


async function main() {

    await callUnary(client);

    // await callServerStream(client);
    //
    // await callClientStream(client);
    //
    // await callBidi(client);

}


async function callUnary(client: IExampleServiceClient) {

    console.log(`### calling method "unary"...`)

    const call = client.unary({
        question: 'whats up?',
        pleaseDelayResponseMs: 50,
        pleaseFail: FailRequest.FAIL_REQUEST_NONE,
        disableSendingExampleResponseHeaders: false,
    }, (err, value) => {
        if (err) {
            console.log("got err: ", err)
        }
        if (value) {
            console.log("got response message: ", value)
        }
    });

    call.on('metadata', arg1 => {
        console.log("got response headers: ", arg1)
    });

    call.on('status', arg1 => {
        console.log("got status: ", arg1)
    });

    return new Promise(resolve => {
        call.on('status', () => resolve());
    });
}


main().catch(e => console.error(e)).finally(() => process.exit());

