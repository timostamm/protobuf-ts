import {performance} from "perf_hooks";


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

function makeBytes(num: number): Uint8Array {
    let bytes = new Uint8Array(num);
    for (let i = 0; i < num; i++)
        bytes[i] = Math.floor(Math.random() * 255);
    return bytes;
}

let bytes100 = makeBytes(100);
let bytes1k = makeBytes(1000);
let bytes10k = makeBytes(1000 * 10);
let bytes100k = makeBytes(1000 * 100);
let bytes500k = makeBytes(1000 * 500);
let bytes1m = makeBytes(1000 * 1000);

// ---


const maxCallStackSize = 32 * 1000;

function a(bytes: Uint8Array): string {
    let b64 = '';
    let i = 0;
    for (; i < bytes.length; i += maxCallStackSize) {
        let chunk = bytes.slice(i, i + maxCallStackSize);
        b64 += String.fromCharCode.apply(String, chunk as any);
    }
    let remainder = bytes.slice(i, bytes.length);
    b64 += String.fromCharCode.apply(String, remainder as any);
    return b64;
}

function b(bytes: Uint8Array): string {
    let b64 = '';
    let s = 0, e = maxCallStackSize;
    for (; s < bytes.length; s = e, e += maxCallStackSize) {
        let chunk = bytes.slice(s, Math.min(e, bytes.length));
        b64 += String.fromCharCode.apply(String, chunk as any);
    }
    return b64;
}

function c(bytes: Uint8Array): string {
    let b64 = '';
    for (let i = 0; i < bytes.length; i++)
        b64 += String.fromCharCode(bytes[i]);
    return b64;
}

function d(bytes: Uint8Array): string {
    let b64 = '';
    if (bytes.length < 500000) {
        for (let i = 0; i < bytes.length; i++)
            b64 += String.fromCharCode(bytes[i]);
        return b64;
    }
    let s = 0, e = maxCallStackSize;
    for (; s < bytes.length; s = e, e += maxCallStackSize)
        b64 += String.fromCharCode.apply(String, bytes.slice(s, Math.min(e, bytes.length)) as any);
    return b64;
}

bench('a 100', () => a(bytes100));
bench('b 100', () => b(bytes100));
bench('c 100', () => c(bytes100));
bench('d 100', () => d(bytes100));

bench('a 1,000', () => a(bytes1k));
bench('b 1,000', () => b(bytes1k));
bench('c 1,000', () => c(bytes1k));
bench('d 1,000', () => d(bytes1k));

bench('a 10,000', () => a(bytes10k));
bench('b 10,000', () => b(bytes10k));
bench('c 10,000', () => c(bytes10k));
bench('d 10,000', () => d(bytes10k));

bench('a 100,000', () => a(bytes100k));
bench('b 100,000', () => b(bytes100k));
bench('c 100,000', () => c(bytes100k));
bench('d 100,000', () => d(bytes100k));

bench('a 500,000', () => a(bytes500k));
bench('b 500,000', () => b(bytes500k));
bench('c 500,000', () => c(bytes500k));
bench('d 500,000', () => d(bytes500k));

bench('a 1,000,000', () => a(bytes1m));
bench('b 1,000,000', () => b(bytes1m));
bench('c 1,000,000', () => c(bytes1m));
bench('d 1,000,000', () => d(bytes1m));


