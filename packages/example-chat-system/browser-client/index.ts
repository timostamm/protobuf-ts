import {GrpcWebFetchTransport} from "@protobuf-ts/grpcweb-transport";
import {ChatServiceClient} from "../protos/service-chat.client";
import {JoinPanel} from "./gui/join-panel";
import {ChatPanel} from "./gui/chat-panel";
import {RpcMetadata} from "@protobuf-ts/runtime-rpc";


const
    transport = new GrpcWebFetchTransport({baseUrl: 'http://localhost:5080', format: "binary"}),
    client = new ChatServiceClient(transport),
    joinPanel = new JoinPanel('joinPanel'),
    chatPanel = new ChatPanel('chatPanel');


joinPanel.show();

joinPanel.onStart(async (username) => {

    joinPanel.setBusy();

    await new Promise(resolve => setTimeout(resolve, 3000))

    const abortController = new AbortController();

    const call = client.join({username}, {
        abort: abortController.signal
    });

    let headers: RpcMetadata;

    try {

        headers = await call.headers;
        if (typeof headers['x-token'] !== 'string') {
            joinPanel.setError('server did not send token');
            return
        }

    } catch (e) {
        joinPanel.setError(e.message);
        return;
    }

    joinPanel.hide();
    chatPanel.show();

    chatPanel.onLeaveBtn(() => {
        abortController.abort();
    });

    chatPanel.onPost(async (text) => {
        try {

            await client.post({
                message: text
            }, {
                meta: {'x-token': headers['x-token']}
            })

        } catch (e) {
            console.error('post err', e)
        }
    });


    // print all chat events
    call.response.onMessage(message => {
        switch (message.event.oneofKind) {
            case "joined":
                chatPanel.addOther(message.event.joined);
                break;
            case "left":
                chatPanel.addOther(message.event.left);
                break;
            case "message":
                chatPanel.addMessage(message.username, message.event.message);
                console.log(`${message.username}: ${message.event.message}`);
                break;
        }
    });


    try {

        await call;

    } catch (e) {
        chatPanel.hide();
        joinPanel.show();
        if (!abortController.signal.aborted) {
            joinPanel.setError(e);
        }
    }

});

