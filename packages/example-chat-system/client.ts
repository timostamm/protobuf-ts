import {ChannelCredentials} from "@grpc/grpc-js";
import {GrpcTransport} from "@protobuf-ts/grpc-transport";
import {ChatServiceClient} from "./service-chat.client";


main().catch(e => console.error(e)).finally(() => process.exit());


async function main() {

    const client = new ChatServiceClient(new GrpcTransport({
        host: "localhost:5000",
        channelCredentials: ChannelCredentials.createInsecure(),
    }));

    const call = client.join({username: randomUsername()});
    console.log(`joining chat as ${call.request.username}.`);

    // the response headers contain the token we need to post messages
    const headers = await call.headers;

    // print all chat events
    call.response.onMessage(message => {
        switch (message.event.oneofKind) {
            case "joined":
                console.log(`> * ${message.event.joined}`);
                break;
            case "left":
                console.log(`> * ${message.event.left}`);
                break;
            case "message":
                console.log(`> ${message.username}: ${message.event.message}`);
                break;
        }
    });

    // send messages every few seconds
    for (let count = 1; count <= 50; count++) {
        await delay(2000);
        await client.post({
            message: `hello #${count}`
        }, {
            meta: {'x-token': headers['x-token']}
        })
    }

    console.log('leaving chat.');
}


function randomUsername(): string {
    const names = ['max', 'pete', 'charles', 'donald', 'mayfair', 'alex', 'bob'];
    return names[Math.floor(Math.random() * names.length)];
}


function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
