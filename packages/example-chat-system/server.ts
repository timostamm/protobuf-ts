import * as grpc from '@grpc/grpc-js';
import {RpcError, RpcInputStream, ServerCallContext} from "@protobuf-ts/runtime-rpc";
import {adaptService} from "@protobuf-ts/grpc-backend";
import {IChatService} from "./service-chat.server";
import {ChatEvent, ChatService as ChatServiceType, JoinRequest, PostRequest, PostResponse} from "./service-chat";


const host = '0.0.0.0:5000';


class ChatService implements IChatService {

    private readonly members: Array<{
        username: string;
        token: string;
        stream: RpcInputStream<ChatEvent>;
    }> = [];


    private broadcast(event: ChatEvent) {
        for (let member of this.members) {
            member.stream.send(event).catch();
        }
    }


    async join(request: JoinRequest, responses: RpcInputStream<ChatEvent>, context: ServerCallContext): Promise<void> {
        console.log("### join() called")

        console.log("username:", request.username)

        const token = Date.now().toString();
        console.log("sending token in response header:", token)
        context.sendResponseHeaders({'x-token': token});

        this.members.push({
            token,
            username: request.username,
            stream: responses
        });

        this.broadcast({
            username: request.username,
            event: {
                oneofKind: "joined",
                joined: `${request.username} joined the chat`
            }
        });

        // TODO should wait until client closes -> how?

        await new Promise(resolve => setTimeout(resolve, 30 * 1000));
        this.members.splice(this.members.findIndex(m => m.token === token), 1);
    }


    async post(request: PostRequest, context: ServerCallContext): Promise<PostResponse> {
        console.log("### post() called")

        const token = context.headers['x-token'];

        console.log("token:", token)

        const member = this.members.find(m => m.token === token)
        if (!member) {
            throw new RpcError('you must join first', grpc.status[grpc.status.PERMISSION_DENIED]);
        }
        await this.broadcast({
            username: member.username,
            event: {
                oneofKind: 'message',
                message: request.message
            }
        });
        return {};
    }

}


const server = new grpc.Server();
server.addService(...adaptService(ChatServiceType, new ChatService()));
server.bindAsync(
    host,
    grpc.ServerCredentials.createInsecure(),
    (err: Error | null, port: number) => {
        if (err) {
            console.error(`Server error: ${err.message}`);
        } else {
            console.log(`Server bound on port: ${port}`);
            server.start();
        }
    }
);
