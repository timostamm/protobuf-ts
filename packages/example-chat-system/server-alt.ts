import * as grpc from '@grpc/grpc-js';
import {ChatEvent, JoinRequest, PostRequest, PostResponse} from "./service-chat";
import {chatServiceDefinition, IChatService} from "./service-chat.grpc-server";


// TODO UnhandledPromiseRejectionWarning - see client-alt.ts


const host = '0.0.0.0:5000';


const service: IChatService = {

    join(call: grpc.ServerWritableStream<JoinRequest, ChatEvent>) {
        let e: any = new Error();
        e.code = grpc.status.UNIMPLEMENTED;
        e.details = 'not implemented';
        call.destroy(e);
    },

    post(call: grpc.ServerUnaryCall<PostRequest, ChatEvent>, callback: grpc.sendUnaryData<PostResponse>) {
        callback({
            code: grpc.status.UNIMPLEMENTED,
            details: 'not implemented',
        });
    },

};


const server = new grpc.Server();
server.addService(chatServiceDefinition, service);
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
