import {performance} from "perf_hooks";
import * as protobufJsUtf8 from "@protobufjs/utf8";

function bench(name: string, fn: () => void, durationSeconds = 2) {
    let startTs = performance.now();
    let endTs = startTs + durationSeconds * 1000;
    let samples = 0;
    while (performance.now() < endTs) {
        fn();
        samples++;
    }
    let durationMs = performance.now() - startTs;
    let opsPerSecond = 1000 / (durationMs / samples);
    console.log(`${name}: ${Math.round(opsPerSecond * 100) / 100} ops/s`);
}

// ---

let textEncoder = new TextEncoder();
let textDecoder = new TextDecoder();

function nativeEncode(text: string): Uint8Array {
    return textEncoder.encode(text);
}

function nativeDecode(bytes: Uint8Array): string {
    return textDecoder.decode(bytes, {stream: false})
}

// ---

function protobufJsEncode(text: string): Uint8Array {
    let l = protobufJsUtf8.length(text);
    let b = new Uint8Array(l);
    protobufJsUtf8.write(text, b, 0);
    return b;
}

function protobufJsDecode(bytes: Uint8Array): string {
    return protobufJsUtf8.read(bytes, 0, bytes.length);
}

// ---

type Fixture = {
    characters: number;
    text: string;
};
let fixtures: Fixture[] = [];
for (let i = 3; i <= 14; i++) {
    let j = Math.pow(2, i);
    fixtures.push({
        characters: j,
        text: "hello 🌍".repeat(j / 8),
    });
}

// ---

for (let fix of fixtures) {
    console.log(`### ${fix.characters} characters`);
    const bytes = nativeEncode(fix.text);
    bench('decode @protobufjs/utf8     ', () => protobufJsDecode(bytes));
    bench('decode native               ', () => nativeDecode(bytes));
}
for (let fix of fixtures) {
    console.log(`### ${fix.characters} characters`);
    bench('encode @protobufjs/utf8     ', () => protobufJsEncode(fix.text));
    bench('encode native               ', () => nativeEncode(fix.text));
}
