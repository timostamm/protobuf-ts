import {RpcOptions} from "@protobuf-ts/runtime-rpc";
import {CallOptions, ChannelCredentials, ClientOptions,Metadata,MetadataOptions} from "@grpc/grpc-js";

export interface GrpcOptions extends RpcOptions {

    /**
     * This option can be provided to the GrpcTransport constructor.
     * The "host" is passed to the created @grpc/grpc-js client as the
     * "address" argument.
     */
    host: string;

    /**
     * This option can be provided to the GrpcTransport constructor.
     * The `ChannelCredentials` are passed to the created @grpc/grpc-js
     * client as the "credentials" argument.
     */
    channelCredentials: ChannelCredentials;

    /**
     * This option can be provided to the GrpcTransport constructor.
     * The ClientOptions are passed to the created @grpc/grpc-js client
     * as the "options" argument.
     */
    clientOptions?: ClientOptions;

}

export interface GrpcCallOptions extends RpcOptions {

    /**
     * This option can be provided when calling a client method.
     * The CallOptions are passed to request factory method of the
     * @grpc/grpc-js client as the "options" argument.
     */
    callOptions?: CallOptions;

    /**
     * This option can be provided when calling a client method.
     * The MetadataOptions are used for creating Metadata object passed
     * to request factory method of the @grpc/grpc-js client as the
     * "metadata" argument.
     */
     metadataOptions?: MetadataOptions;
}
