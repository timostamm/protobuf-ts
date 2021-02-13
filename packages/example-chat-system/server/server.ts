import * as grpc from '@grpc/grpc-js';
import {RpcError, RpcInputStream, ServerCallContext} from "@protobuf-ts/runtime-rpc";
import {adaptService} from "@protobuf-ts/grpc-backend";
import {IChatService} from "./service-chat.server";
import {ChatEvent, ChatService as ChatServiceType, JoinRequest, PostRequest, PostResponse} from "./service-chat";


class ChatService implements IChatService {


    /**
     * The current members of this chat.
     */
    private readonly users: Array<{
        username: string;
        token: string;
        stream: RpcInputStream<ChatEvent>;
    }> = [];


    async join(request: JoinRequest, responses: RpcInputStream<ChatEvent>, context: ServerCallContext): Promise<void> {
        console.log(`join() called. ${this.users.length} users so far.`);

        this.addUser(request.username, responses, context);

        await this.broadcast({
            username: request.username,
            event: {
                oneofKind: "joined",
                joined: `${request.username} joined the chat`
            }
        });

        // keep this call open until the client closes it
        await new Promise(resolve => context.onCancel(resolve));

        await this.broadcast({
            username: request.username,
            event: {
                oneofKind: "left",
                left: `${request.username} left the chat`
            }
        });

        console.log(`join() ending. ${this.users.length} users remaining.`)
    }


    async post(request: PostRequest, context: ServerCallContext): Promise<PostResponse> {
        console.log(`post() called. will broadcast to ${this.users.length} users.`)

        const user = this.getUser(context.headers['x-token']);

        await this.broadcast({
            username: user.username,
            event: {
                oneofKind: 'message',
                message: request.message
            }
        });

        return {};
    }


    /**
     * Add a user, send him his token.
     */
    private addUser(username: string, stream: RpcInputStream<ChatEvent>, context: ServerCallContext): void {

        // we generate a token to identify the user
        const token = Date.now().toString();
        context.sendResponseHeaders({'x-token': token});

        // as soon as the user closes the call, we remove him from the chat
        context.onCancel(() => {
            const i = this.users.findIndex(m => m.token === token);
            if (i >= 0) {
                this.users.splice(i, 1);
            }
        });

        this.users.push({
            token,
            username: username,
            stream
        });
    }


    /**
     * Find user by token. Throw PERMISSION_DENIED if not found.
     */
    private getUser(token: unknown) {
        const user = this.users.find(m => m.token === token)
        if (!user) {
            throw new RpcError('you must join first', grpc.status[grpc.status.PERMISSION_DENIED]);
        }
        return user;
    }


    /**
     * Send a message to all users.
     */
    private broadcast(event: ChatEvent) {
        return Promise.all(
            this.users.map(u => u.stream.send(event))
        );
    }


}


const server = new grpc.Server();
server.addService(...adaptService(ChatServiceType, new ChatService()));
server.bindAsync(
    '0.0.0.0:5000',
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
