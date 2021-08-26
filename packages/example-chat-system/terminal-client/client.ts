import {ChannelCredentials} from "@grpc/grpc-js";
import {GrpcTransport} from "@protobuf-ts/grpc-transport";
import {ChatServiceClient, IChatServiceClient} from "./service-chat.client";
import {TerminalIO} from "./terminal-io";


// TODO #56 fix UnhandledPromiseRejectionWarning when server dies while client is running
// TODO #56 fix net::ERR_INCOMPLETE_CHUNKED_ENCODING in browser when using a deadline in browser (this seems like a server issue)


main(
    new TerminalIO(),
    new ChatServiceClient(new GrpcTransport({
        host: "localhost:5000",
        channelCredentials: ChannelCredentials.createInsecure(),
    }))
).catch(e => {
    console.error(e)
    process.exit(1);
});


async function main(term: TerminalIO, client: IChatServiceClient) {

    // ask for username and join the chat
    const call = client.join({
        username: await term.prompt("Enter your username: ")
    });

    // the response headers contain the token we need to post messages
    const headers = await call.headers;

    // print all chat events
    call.responses.onMessage(message => {
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

    // prompt the use for messages until ^C or the call ends
    while (!term.closed) {
        let next = await Promise.race([call, term.prompt()]);

        if (typeof next == "string") {
            await client.post({
                message: next
            }, {
                meta: {'x-token': headers['x-token']}
            })
        } else {
            term.close();
            throw "server ended the chat";
        }
    }

}
