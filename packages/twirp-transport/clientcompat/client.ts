import {ReadStream} from "tty";
import {ClientCompatMessage, ClientCompatMessage_CompatServiceMethod, Empty, Req, Resp} from "./clientcompat";
import {TwirpFetchTransport, TwirpOptions} from "../";
import {FinishedUnaryCall, RpcError} from "@protobuf-ts/runtime-rpc";
import {default as fetch, Headers} from "node-fetch";
import {CompatServiceClient} from "./clientcompat.client";

// fetch polyfill via https://github.com/node-fetch/node-fetch
globalThis.fetch = fetch;
globalThis.Headers = Headers;

let options: TwirpOptions = {
    baseUrl: "coming soon",
};

/**
 * Testing compatibility of our Twirp transport with the protocol by using
 * the "clientcompat" tooling.
 *
 * https://github.com/twitchtv/twirp/tree/master/clientcompat#clientcompat
 */
export async function client() {

    // "The client binary must accept, over stdin, a protobuf-encoded ClientCompatMessage."
    let message = ClientCompatMessage.fromBinary(await readBytes(process.stdin));

    // "This message contains a service_address, which is the address of a reference-
    // implementation CompatService to talk to."
    options.baseUrl = `${message.serviceAddress}/twirp`;
    let client = new CompatServiceClient(new TwirpFetchTransport(options));

    // "an embedded, proto-encoded request which the client should send."
    let request = Req.fromBinary(message.request);

    try {
        // "a method, which specifies which RPC of the CompatService should be called"
        let call: FinishedUnaryCall<Req, Resp> | FinishedUnaryCall<Empty, Empty> =
            message.method === ClientCompatMessage_CompatServiceMethod.METHOD
                ? (await client.method(request))
                : (await client.noopMethod(request));

        // "If the server doesn't send an error, the client should encode the response
        // message it received as protobuf and write it to stdout."
        let bytes = call.method.O.toBinary(call.response);
        process.stdout.write(bytes);

    } catch (e) {
        // "If the server sends an error, then the client should parse the error and
        // write the error code string ("internal", "unauthenticated", etc) to stderr."
        if (e instanceof RpcError) {
            process.stderr.write(e.code);
        } else {
            process.stderr.write(`caught unexpected error: ${e}`);
        }
    }

}


function readBytes(stream: ReadStream): Promise<Uint8Array> {
    return new Promise<Uint8Array>(resolve => {
        const chunks: Uint8Array[] = [];
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('end', () => {
            resolve(Buffer.concat(chunks));
        });
    });
}
