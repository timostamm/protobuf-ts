import {TwirpFetchTransport} from "@protobuf-ts/twirp-transport";
import {HaberdasherClient} from "./service-twirp-example.client";
import {default as fetch, Headers} from "node-fetch";

// fetch polyfill via https://github.com/node-fetch/node-fetch
globalThis.fetch = fetch as any;
globalThis.Headers = Headers as any;



const transport = new TwirpFetchTransport({
    baseUrl: "http://localhost:8080/twirp",
});

const client = new HaberdasherClient(transport);

async function main() {

    const call = client.makeHat({
        inches: 23
    });

    console.log(`### calling method "${call.method.name}"...`)

    const headers = await call.headers;
    console.log("got response headers: ", headers)

    const response = await call.response;
    console.log("got response message: ", response)

    const status = await call.status;
    console.log("got status: ", status)

    const trailers = await call.trailers;
    console.log("got trailers: ", trailers)

}


main().catch(e => console.error(e)).finally(() => process.exit());

