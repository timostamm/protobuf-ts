import * as grpc from '@grpc/grpc-js';
import {ChatEvent, JoinRequest, PostRequest, PostResponse} from "./protos/service-chat";
import {chatServiceDefinition, IChatService} from "./protos/service-chat.grpc-server";


// TODO fix UnhandledPromiseRejectionWarning - see client-alt.ts
// TODO fix net::ERR_INCOMPLETE_CHUNKED_ENCODING


const host = '0.0.0.0:5000';


const service: IChatService = {

    join(call: grpc.ServerWritableStream<JoinRequest, ChatEvent>) {


        // this is triggered when client-provided deadline is exceeded.
        // client receives a 504 gateway timeout.
        //
        // with our grpc-backend however, we get a net::ERR_INCOMPLETE_CHUNKED_ENCODING in the browser.
        // our grpc-backend does not handle timeout correctly. probably tries to write trailers where
        // it shouldn't.
        //
        // call.on('cancelled', args => {
        //     console.log("cancelled", args); // args is "deadline" if cancelled by deadline
        // });


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
