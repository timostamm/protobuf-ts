import {performance} from "perf_hooks";
import * as protobufJs from "@protobufjs/base64";
import {base64encode} from "@protobuf-ts/runtime";


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


let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

// see https://github.com/google/closure-library/blob/master/closure/goog/crypt/base64.js#L156
function goog_encodeByteArray(input: Uint8Array): string {

    let output: string[] = [],
        byte1: number, haveByte2: boolean, byte2: number, haveByte3: boolean, byte3: number, outByte1: number,
        outByte2: number, outByte3: number, outByte4: number;

    for (let i = 0; i < input.length; i += 3) {
        byte1 = input[i];
        haveByte2 = i + 1 < input.length;
        byte2 = haveByte2 ? input[i + 1] : 0;
        haveByte3 = i + 2 < input.length;
        byte3 = haveByte3 ? input[i + 2] : 0;

        outByte1 = byte1 >> 2;
        outByte2 = ((byte1 & 0x03) << 4) | (byte2 >> 4);
        outByte3 = ((byte2 & 0x0F) << 2) | (byte3 >> 6);
        outByte4 = byte3 & 0x3F;

        if (!haveByte3) {
            outByte4 = 64;

            if (!haveByte2) {
                outByte3 = 64;
            }
        }

        output.push(
            alphabet[outByte1], alphabet[outByte2],
            alphabet[outByte3] || '', alphabet[outByte4] || '');
    }

    return output.join('');
}


if (base64encode(fixtures[0].bytes) !== protobufJs.encode(fixtures[0].bytes, 0, fixtures[0].bytes.length))
    throw "err";


for (let fix of fixtures) {

    console.log(`=== ${fix.size} bytes ===`);
    bench(`@protobuf-ts/runtime / base64encode()`, () => base64encode(fix.bytes));
    bench(`@protobufjs/base64 / encode()`, () => protobufJs.encode(fix.bytes, 0, fix.bytes.length));
    bench(`goog.crypt.base64.encodeByteArray()`, () => goog_encodeByteArray(fix.bytes));

}


