import {Channel, ChannelCredentials, ChannelOptions, Client, ClientOptions, Metadata} from "@grpc/grpc-js";
import {AllMethodsRequest, AllMethodsResponse, AllMethodsService} from "./service-all-methods";
import {MethodInfo} from "@protobuf-ts/runtime-rpc";
import {CallOptions} from "@grpc/grpc-js/";
import {UnaryCallback} from "@grpc/grpc-js/build/src/client";


const target = "localhost:5000";
const creds = ChannelCredentials.createInsecure();
const channelOptions: ChannelOptions = {};
const channel = new Channel(
    target,
    creds,
    channelOptions
);

const clientOpts: ClientOptions = {};


const methodInfo: MethodInfo<AllMethodsRequest, AllMethodsResponse> = AllMethodsService.methods.find(m => m.name === 'Unary')!;

const callRequest = AllMethodsRequest.create({
    question: "what's up?"
});
const callOpts: CallOptions = {};
const callMeta = new Metadata();
const callback: UnaryCallback<AllMethodsResponse> = (err, value) => {
    console.log("err:", err);
    console.log("val:", value);
}

const client = new Client(target, creds, clientOpts);

client.makeUnaryRequest(
    `/${methodInfo.service.typeName}/${methodInfo.name}`,
    (value: AllMethodsRequest): Buffer => {
        const writeOpts = {};
        const bytes = methodInfo.I.toBinary(value, writeOpts);
        return Buffer.from(bytes);
    },
    (value: Buffer): AllMethodsResponse => {
        const readOpts = {};
        return methodInfo.O.fromBinary(value, readOpts);
    },
    callRequest,
    callMeta,
    callOpts,
    callback
);




