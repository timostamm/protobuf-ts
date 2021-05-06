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

    /**
     * Extra options to pass through to the fetch when doing a request.
     * 
     * Example: `fetchInit: { credentials: 'include' }`
     * 
     * This will make requests include cookies for cross-origin calls.
     */
	fetchInit?: Omit<RequestInit, 'body' | 'headers' | 'method' | 'signal'>;

}
