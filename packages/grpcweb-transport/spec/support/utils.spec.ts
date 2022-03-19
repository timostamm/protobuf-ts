import { GrpcStatusCode, GrpcWebFrame, createGrpcWebRequestBody, readGrpcWebResponseBody } from "../../src";
import {StreamReaderNextResult} from "../../src/grpc-web-format";

import { Deferred } from "@protobuf-ts/runtime-rpc";

// Polyfills for node
if (!globalThis.fetch) {
    globalThis.fetch = require("node-fetch");
}
if (!globalThis.Headers) {
    globalThis.Headers = require("node-fetch").Headers;
}
if (!globalThis.Response) {
    globalThis.Response = require("node-fetch").Response;
}
if (!globalThis.Request) {
    globalThis.Request = require("node-fetch").Request;
}
if (!globalThis.DOMException) {
    // @ts-ignore
    globalThis.DOMException = class DOMException extends Error {
        name = 'DOMException';

        constructor(message?: string, name?: string) {
            super(message);
            // see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#example
            Object.setPrototypeOf(this, new.target.prototype);
            if (name) 
                this.name = name;
        }
    }
}

function identity<T>(v: T): T { return v }

export function microTaskDelay<T>(p: Promise<T>): Promise<T> {
    return p.then(identity).then(identity);
}

export function frame(type: GrpcWebFrame, bytes: Uint8Array): Uint8Array {
    const output = createGrpcWebRequestBody(bytes, 'binary');
    output[0] = type;
    return output;
}

export function getTrailerFrame(status: GrpcStatusCode, message?: string): Uint8Array {
    const ascii = message ? `grpc-status:${status}\r\ngrpc-message:${message}` : `grpc-status:${status}`;
    return frame(GrpcWebFrame.TRAILER, asciiToBin(ascii));
}

export const asciiToCharCodes = (ascii: string): number[] => ascii.split('').map(c => c.charCodeAt(0));
export const asciiToBin = (ascii: string): Uint8Array => new Uint8Array(asciiToCharCodes(ascii));

export function makeStream() {
    let nextValue = new Deferred<StreamReaderNextResult<Uint8Array>>(true);
    const streamReader = {
        next: () => nextValue.promise.then((value) => {
            nextValue = new Deferred<StreamReaderNextResult<Uint8Array>>(true);
            return value;
        })
    };
    return {
        body: { [Symbol.asyncIterator]: () => streamReader },
        async next(val: ReadonlyArray<number> | Uint8Array, done: boolean = false) {
            const last = nextValue.promise;
            const value = val instanceof Uint8Array ? val : new Uint8Array(val);
            nextValue.resolve({ done, value });
            return microTaskDelay(last);
        }
    };
}

export function makeWhatWgStream() {
    let nextValue = new Deferred<StreamReaderNextResult<Uint8Array>>(true);
    const streamReader = {
        read: () => nextValue.promise.then((value) => {
            nextValue = new Deferred<StreamReaderNextResult<Uint8Array>>(true);
            return value;
        })
    };
    return {
        body: { getReader: () => streamReader } as ReadableStream<Uint8Array>,
        async next(val: ReadonlyArray<number> | Uint8Array, done: boolean = false) {
            const last = nextValue.promise;
            const value = val instanceof Uint8Array ? val : new Uint8Array(val);
            nextValue.resolve({ done, value });
            return microTaskDelay(last);
        }
    };
}

export function getFrameRef({
    useWhatWgStream = false,
    format = 'application/grpc-web+proto',
}: {
    useWhatWgStream?: boolean,
    format?: string | null | undefined,
} = {}) {
    const { body, next } = useWhatWgStream ? makeWhatWgStream() : makeStream();
    const frames: [GrpcWebFrame, Uint8Array][] = [];
    const overall = readGrpcWebResponseBody(body, format, (type, data) => {
        frames.push([ type, data ])
    });
    return {
        frames,
        next,
        overall
    };
}

export function assertFrame(actual: [GrpcWebFrame, Uint8Array], expected: [GrpcWebFrame, ReadonlyArray<number>]): void {
    expect(actual).toEqual([expected[0], new Uint8Array(expected[1])]);
}

export function assertFrames(actual: ReadonlyArray<[GrpcWebFrame, Uint8Array]>, expected: ReadonlyArray<[GrpcWebFrame, ReadonlyArray<number>]>): void {
    expect(actual.length).toEqual(expected.length);
    for (let i = 0; i < expected.length; i++) {
        assertFrame(actual[i], expected[i]);
    }
}

export function getResponse(opts: ResponseInit & { body?: BodyInit | null }): Response {
    const status = opts.status ?? 200;
    const ok = status >= 200 && status < 300;
    return {
        ok,
        status,
        statusText: 'success',
        headers: new globalThis.Headers({
            'some': 'header',
            'content-type': 'application/grpc-web+proto',
        }),
        ...opts,
    } as unknown as Response
}
