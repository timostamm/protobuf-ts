import {Channel, ChannelCredentials, ChannelOptions, Client, ClientOptions, Metadata} from "@grpc/grpc-js";
import {AllMethodsRequest, AllMethodsResponse, AllMethodsService} from "./service-all-methods";
import {MethodInfo} from "@protobuf-ts/runtime-rpc";
import {CallOptions} from "@grpc/grpc-js/";
import {UnaryCallback} from "@grpc/grpc-js/build/src/client";
import {GrpcOptions} from "../src/grpc-options";


const grpcOptions: GrpcOptions = {
    host: "localhost:5000",
    channelCredentials: ChannelCredentials.createInsecure(),
};



const method: MethodInfo<AllMethodsRequest, AllMethodsResponse> = AllMethodsService.methods.find(m => m.name === 'Unary')!;
const input = AllMethodsRequest.create({
    question: "what's up?"
});

const clientOpts: ClientOptions = {};
const callOpts: CallOptions = {};
const callMeta = new Metadata();
const callback: UnaryCallback<AllMethodsResponse> = (err, value) => {
    console.log("err:", err);
    console.log("val:", value);
}

const client = new Client(grpcOptions.host, grpcOptions.channelCredentials, clientOpts);

const call = client.makeUnaryRequest(
    `/${method.service.typeName}/${method.name}`,
    (value: AllMethodsRequest): Buffer => {
        const writeOpts = {};
        const bytes = method.I.toBinary(value, writeOpts);
        return Buffer.from(bytes);
    },
    (value: Buffer): AllMethodsResponse => {
        const readOpts = {};
        return method.O.fromBinary(value, readOpts);
    },
    input,
    callMeta,
    callOpts,
    callback
);

// call.cancel();


// client.close();
// client.getChannel().getConnectivityState(true)
// client.getChannel().close()

