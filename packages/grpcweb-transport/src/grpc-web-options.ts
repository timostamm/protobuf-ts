import {RpcOptions} from "@protobuf-ts/runtime-rpc";


/**
 * RPC options for the grpc-web transport.
 */
export interface GrpcWebOptions extends RpcOptions {

    /**
     * Send binary or text format?
     * Defaults to text.
     */
    format?: "text" | "binary";

    /**
     * Base URI for all HTTP requests.
     *
     * Requests will be made to <baseUrl>/<package>.<service>/method
     *
     * Example: `baseUrl: "https://example.com/my-api"`
     *
     * This will make a `POST /my-api/my_package.MyService/Foo` to
     * `example.com` via HTTPS.
     */
    baseUrl: string;

}
