import {ChannelCredentials} from "@grpc/grpc-js";
import {GrpcTransport} from "@protobuf-ts/grpc-transport";
import {ChatServiceClient} from "./service-chat.client";


async function main() {

    const transport = new GrpcTransport({
        host: "localhost:5000",
        channelCredentials: ChannelCredentials.createInsecure(),
    });

    const client = new ChatServiceClient(transport);

    const call = client.join({
        username: Math.random() > 0.4 ? "max" : "pete"
    });

    const responseHeaders = await call.headers;
    console.log("responseHeaders:", responseHeaders)

    const token = responseHeaders['x-token'];

    console.log("token:", token)

    call.response.onMessage(message => {
        switch (message.event.oneofKind) {
            case "joined":
                console.log(message.event.joined);
                break;

            case "left":
                console.log(message.event.left);
                break;

            case "message":
                console.log(message.username + ': ' + message.event.message);
                break;
        }
    });

    await new Promise(resolve => setTimeout(resolve, 3 * 1000));

    await client.post({
        message: 'hello'
    }, {
        meta: {
            'x-token': token
        }
    })

    await new Promise(resolve => setTimeout(resolve, 3 * 1000));

    await client.post({
        message: 'hello'
    }, {
        meta: {
            'x-token': token
        }
    })

}


main().catch(e => console.error(e)).finally(() => process.exit());

