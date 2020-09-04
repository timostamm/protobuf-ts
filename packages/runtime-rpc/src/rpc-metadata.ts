/**
 * RPC metadata are very similar to HTTP headers, but they can be also be
 * provided at the end of response (they are called "trailers" in this case).
 *
 * Keys are case-insensitive and you will usually get lower-case keys from
 * APIs.
 *
 * If a key ends with `-bin`, it contains binary data in base64 encoding.
 *
 * You can encode protobuf messages as binary metadata values, including
 * `google.protobuf.Any`.
 */
export interface RpcMetadata {
    [key: string]: string | string[];
}
