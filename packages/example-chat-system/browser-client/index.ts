import {GrpcWebFetchTransport} from "@protobuf-ts/grpcweb-transport";
import {ChatServiceClient} from "./service-chat.client";
import {RpcMetadata} from "@protobuf-ts/runtime-rpc";
import {ChatPanel, JoinPanel} from "./panels";


const
    transport = new GrpcWebFetchTransport({baseUrl: 'http://localhost:5080', format: "binary"}),
    client = new ChatServiceClient(transport),
    joinPanel = new JoinPanel('joinPanel'),
    chatPanel = new ChatPanel('chatPanel');


// the user has entered his name and submitted the form
joinPanel.startCallback = async (username) => {

    // lock the join form
    joinPanel.setBusy();

    // join the server
    const abortController = new AbortController();
    const call = client.join({username}, {
        abort: abortController.signal,
        // deadline: Date.now() + 400
    });

    // wait for the response headers, they contain our "authentication" token
    let headers: RpcMetadata;
    try {
        headers = await call.headers;
        if (typeof headers['x-token'] !== 'string') {
            joinPanel.setError('server did not send token');
            return;
        }
    } catch (e) {
        joinPanel.setError(e.message);
        return;
    }

    // we have joined the chat
    joinPanel.hide();
    chatPanel.show();

    // print all chat events
    call.responses.onMessage(message => {
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

    // when the user clicks the "leave" button, we cancel the call
    chatPanel.leaveCallback = () => abortController.abort();

    // when the user enters a message, we post it to the server
    chatPanel.postCallback = async (text) => {
        try {
            await client.post({
                message: text
            }, {
                meta: {'x-token': headers['x-token']},
            })
        } catch (e) {
            console.error('post failed', e)
            chatPanel.addOther('post failed: ' + e);
        }
    };

    // wait for the call to end
    try {
        await call;
        chatPanel.hide();
        joinPanel.show();
        joinPanel.setError('server ended the chat');
    } catch (e) {
        chatPanel.hide();
        joinPanel.show();
        if (!abortController.signal.aborted) {
            joinPanel.setError(e);
        }
        console.error('join failed', e)
    }

};

