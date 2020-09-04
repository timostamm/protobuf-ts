import {RpcOptions} from "@protobuf-ts/runtime-rpc";

export interface TwirpOptions extends RpcOptions {

    /**
     * Base URI for all HTTP requests.
     *
     * Requests will be made to <baseUrl>/<package>.<service>/method
     *
     * If you need the "twirp" path prefix, you must add it yourself.
     *
     * Example: `baseUrl: "https://example.com/twirp"`
     *
     * This will make a `POST /twirp/my_package.MyService/Foo` to
     * `example.com` via HTTPS.
     */
    baseUrl: string;

    /**
     * For Twirp, method names are CamelCased just as they would be in Go.
     * To use the original method name as defined in the .proto, set this
     * option to `true`.
     */
    useProtoMethodName?: boolean;

    /**
     * Send JSON? Defaults to false, which means binary
     * format is sent.
     */
    sendJson?: boolean;


}
