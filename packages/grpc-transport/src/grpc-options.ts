import {RpcOptions} from "@protobuf-ts/runtime-rpc";
import {ChannelCredentials, ChannelOptions, ClientOptions} from "@grpc/grpc-js";


export interface GrpcOptions extends RpcOptions {

    host: string;

    channelCredentials: ChannelCredentials;

    channelOptions?: ChannelOptions;

    clientOptions?: ClientOptions;

}
