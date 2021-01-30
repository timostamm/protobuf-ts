import {ChannelCredentials} from "@grpc/grpc-js";
import {GrpcTransport} from "@protobuf-ts/grpc-transport";
import {ChatServiceClient} from "./protos/service-chat.client";
import AbortController from "abort-controller";


// TODO #56 fix UnhandledPromiseRejectionWarning when cancelling client call


main().catch(e => console.error(e)).finally(() => process.exit());


async function main() {

    const client = new ChatServiceClient(new GrpcTransport({
        host: "localhost:5000",
        channelCredentials: ChannelCredentials.createInsecure(),
    }));

    const abortController = new AbortController();

    const call = client.join({
        username: 'xxx'
    }, {
        abort: abortController.signal
    });

    await call.headers;

    // this rejects all call promises.
    // but we are not catching them, so we get an UnhandledPromiseRejectionWarning
    abortController.abort();

    // UnhandledPromiseRejectionWarning: RpcError: 1 CANCELLED: Cancelled on client
    // DeprecationWarning: Unhandled promise rejections are deprecated. In the future,
    // promise rejections that are not handled will terminate the Node.js process with
    // a non-zero exit code.

    // this catches all promise rejections, but it looks messy
    // call.then(null, reason => {
    //     console.log('caught call reject')
    // });


    await delay(1400);

    console.log('done.');
}


function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
