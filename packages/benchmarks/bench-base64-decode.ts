import {performance} from "perf_hooks";
import * as protobufJs from "@protobufjs/base64";
import {base64decode} from "@protobuf-ts/runtime";


function bench(name: string, fn: () => void, durationSeconds = 5) {
    let startTs = performance.now();
    let endTs = startTs + durationSeconds * 1000;
    let samples = 0;
    while (performance.now() < endTs) {
        fn();
        samples++;
    }
    let durationMs = performance.now() - startTs;
    let opsPerSecond = 1000 / (durationMs / samples);
    let numFmt = (n: number) => new Intl.NumberFormat("en-US").format(n);
    console.log(`${name}: ${numFmt(opsPerSecond)} ops/s`);
}


// ---

interface Fixture {
    size: number;
    bytes: Uint8Array;
    base64: string;
}

function makeFix(size: number): Fixture {
    let byteStr = '';
    let bytes = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
        let byte = Math.round(Math.random() * 255);
        bytes[i] = byte;
        byteStr += String.fromCharCode(byte);
    }
    return {size, bytes, base64: protobufJs.encode(bytes, 0, bytes.length)};
}

let fixtures = [
    makeFix(100),
    makeFix(1000),
    makeFix(1000 * 10),
    makeFix(1000 * 100),
    makeFix(1000 * 500),
    makeFix(1000 * 1000),
];

// ---


function protobufJsBase64Decode(base64: string): Uint8Array {
    let bytes = new Uint8Array(protobufJs.length(base64));
    protobufJs.decode(base64, bytes, 0);
    return bytes;
}


for (let fix of fixtures) {

    console.log(`=== ${fix.size} bytes ===`);
    bench(`@protobufjs/base64 / decode()`, () => protobufJsBase64Decode(fix.base64));
    bench(`@protobuf-ts/runtime / base64decode()`, () => base64decode(fix.base64));

}
