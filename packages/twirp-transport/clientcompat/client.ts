import {ReadStream} from "tty";
import {ClientCompatMessage, ClientCompatMessage_CompatServiceMethod, Empty, Req, Resp} from "./clientcompat";
import {TwirpFetchTransport} from "../";
import {RpcError} from "@chippercash/protobuf-runtime-rpc";
import {default as fetch, Headers} from "node-fetch";
import {CompatServiceClient, ICompatServiceClient} from "./clientcompat.client";
import * as fs from "fs";
import * as path from "path";


// fetch polyfill via https://github.com/node-fetch/node-fetch
globalThis.fetch = fetch;
globalThis.Headers = Headers;


/**
 * Testing compatibility of our Twirp transport with the protocol by using
 * the "clientcompat" tooling.
 *
 * https://github.com/twitchtv/twirp/tree/master/clientcompat#clientcompat
 */
export async function client() {

    // "The client binary must accept, over stdin, a protobuf-encoded ClientCompatMessage."
    let message = ClientCompatMessage.fromBinary(await readBytes(process.stdin));
    log('client start with message: ' + ClientCompatMessage.toJsonString(message, {emitDefaultValues: true}));

    let client = new CompatServiceClient(new TwirpFetchTransport({
        // "This message contains a service_address, which is the address of a reference-
        // implementation CompatService to talk to."
        baseUrl: `${message.serviceAddress}/twirp`
    }));

    // method: "a method, which specifies which RPC of the CompatService should be called"
    switch (message.method) {
        case ClientCompatMessage_CompatServiceMethod.METHOD:
            await doMethod(client, message.request);
            break;
        case ClientCompatMessage_CompatServiceMethod.NOOP:
            await doNoop(client, message.request);
            break;
        default:
            throw new Error('client does not support method');
    }

    log('client exit');
}


async function doNoop(client: ICompatServiceClient, req: Uint8Array) {
    // request: "an embedded, proto-encoded request which the client should send."
    log('request raw: ' + byteArrToStr(req));
    let request = Empty.fromBinary(req);
    log('request (Empty) as json: ' + Empty.toJsonString(request, {emitDefaultValues: true}));
    log('request (Empty) as protobuf: ' + byteArrToStr(Empty.toBinary(request)));

    try {

        log('calling CompatService.NoopMethod(Empty)');
        let {response} = await client.noopMethod(request);
        log('response (Empty) as json: ' + Empty.toJsonString(response, {emitDefaultValues: true}));
        log('response (Empty) as protobuf: ' + byteArrToStr(Empty.toBinary(response)));

        // "If the server doesn't send an error, the client should encode the response
        // message it received as protobuf and write it to stdout."
        process.stdout.write(Empty.toBinary(response));
        log('wrote response to stdout as protobuf')

    } catch (e) {
        // "If the server sends an error, then the client should parse the error and
        // write the error code string ("internal", "unauthenticated", etc) to stderr."
        if (e instanceof RpcError) {
            process.stderr.write(e.code);
            log('request failed, wrote code to stdout: ' + e.code);
        } else {
            throw e;
        }
    }
}

async function doMethod(client: ICompatServiceClient, req: Uint8Array) {
    // request: "an embedded, proto-encoded request which the client should send."
    log('request raw: ' + byteArrToStr(req));

    let request = Req.fromBinary(req);
    log('request (Req) as json: ' + Req.toJsonString(request, {emitDefaultValues: true}));
    log('request (Req) as protobuf: ' + byteArrToStr(Req.toBinary(request)));

    try {

        log('calling CompatService.Method(Req)');
        let {response} = await client.method(request);
        log('response (Resp) as json: ' + Resp.toJsonString(response, {emitDefaultValues: true}));
        log('response (Resp) as protobuf: ' + byteArrToStr(Resp.toBinary(response)));

        // "If the server doesn't send an error, the client should encode the response
        // message it received as protobuf and write it to stdout."
        process.stdout.write(Resp.toBinary(response));
        log('wrote response to stdout as protobuf.')

    } catch (e) {
        // "If the server sends an error, then the client should parse the error and
        // write the error code string ("internal", "unauthenticated", etc) to stderr."
        if (e instanceof RpcError) {
            process.stderr.write(e.code);
            log('request failed, wrote code to stdout: ' + e.code);
        } else {
            throw e;
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

function byteArrToStr(bytes: Uint8Array): string {
    let r: string[] = [];
    bytes.forEach(b => {
        let s = b.toString(16).toUpperCase();
        s = '0x' + "0".repeat(2 - s.length) + s;
        r.push(s);
    });
    return r.join(', ') + ` (${r.length} bytes)`;
}

function log(message: string): void {
    fs.appendFileSync(
        path.join(__dirname, '../clientcompat.log'),
        message + '\n'
    );
}
