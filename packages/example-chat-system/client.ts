import {ChannelCredentials} from "@grpc/grpc-js";
import {GrpcTransport} from "@protobuf-ts/grpc-transport";
import {ChatServiceClient, IChatServiceClient} from "./service-chat.client";
import {TerminalIO} from "./terminal-io";


// TODO #56 UnhandledPromiseRejectionWarning
// when server dies while client is running


main(
    new TerminalIO(),
    new ChatServiceClient(new GrpcTransport({
        host: "localhost:5000",
        channelCredentials: ChannelCredentials.createInsecure(),
    }))
).catch(e => console.error(e)).finally(() => process.exit());


async function main(term: TerminalIO, client: IChatServiceClient) {

    // ask for username and join the chat
    const call = client.join({
        username: await term.prompt('Enter your username: ')
    });

    // the response headers contain the token we need to post messages
    const headers = await call.headers;

    // print all chat events
    call.response.onMessage(message => {
        switch (message.event.oneofKind) {
            case "joined":
                term.print(`* ${message.event.joined}`);
                break;
            case "left":
                term.print(`* ${message.event.left}`);
                break;
            case "message":
                term.print(`${message.username}: ${message.event.message}`);
                break;
        }
    });

    while (!term.sigint) {

        // prompt the user for a message
        const text = await term.prompt();

        // then send it to the server
        await client.post({
            message: text
        }, {
            meta: {'x-token': headers['x-token']}
        })
    }
}
