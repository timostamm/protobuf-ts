import {performance} from "perf_hooks";
import {readFileSync} from "fs";
import {FileDescriptorSet as tsProtoType} from "./testees/ts-proto.default/.plugin-out/google/protobuf/descriptor";
import {FileDescriptorSet as googleProtobufType} from "google-protobuf/google/protobuf/descriptor_pb";
import {FileDescriptorSet as sizeType} from "./testees/protobuf-ts.size/.plugin-out/google/protobuf/descriptor";
import {FileDescriptorSet as speedType} from "./testees/protobuf-ts.speed/.plugin-out/google/protobuf/descriptor";
import {
    FileDescriptorSet as sizeBigintType
} from "./testees/protobuf-ts.size-bigint/.plugin-out/google/protobuf/descriptor";
import {
    FileDescriptorSet as speedBigintType
} from "./testees/protobuf-ts.speed-bigint/.plugin-out/google/protobuf/descriptor";
import * as protobufjsNamespace from "./testees/protobufjs/.plugin-out/descriptor"
import {BinaryReader} from "@protobuf-ts/runtime";

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
    console.log(`${name}: ${formatNumber(opsPerSecond)} ops/s`);
}

const bytes = readFileSync('./all.descriptorset');
const protobufjsType = protobufjsNamespace.google.protobuf.FileDescriptorSet;
const numberFormat = new Intl.NumberFormat('en-US');
const formatNumber = (n: number) => {
    const [whole = '0', fraction = '0'] = numberFormat.format(n).split('.');
    return [
        whole.padStart(7, ' '),
        fraction.padEnd(3, ' '),
    ].join('.');
}

let googleProtobufMessage = googleProtobufType.deserializeBinary(bytes);
let tsProtoMessage = tsProtoType.decode(bytes);
let tsProtoJson = tsProtoType.toJSON(tsProtoMessage);
let tsProtoJsonString = JSON.stringify(tsProtoType.toJSON(tsProtoMessage));
let sizeMessage = sizeType.fromBinary(bytes);
let sizeJson = sizeType.toJson(sizeMessage);
let sizeBigintMessage = sizeBigintType.fromBinary(bytes);
let speedMessage = speedType.fromBinary(bytes);
let speedJson = speedType.toJson(speedMessage);
let speedBigintMessage = speedBigintType.fromBinary(bytes);
let protobufjsMessage = protobufjsType.decode(new Uint8Array(bytes));
let protobufjsJson = protobufjsType.toObject(protobufjsMessage);
const nodeBinaryReadOptions = {
    readerFactory: (bytes: Uint8Array) => new BinaryReader(bytes, {
        decode(input?: Uint8Array): string {
            return input ? (input as Buffer).toString("utf8") : "";
        }
    })
};

console.log('### read binary');
bench('google-protobuf                           ', () => googleProtobufType.deserializeBinary(bytes));
bench('ts-proto                                  ', () => tsProtoType.decode(bytes));
bench('protobuf-ts (speed)                       ', () => speedType.fromBinary(bytes));
bench('protobuf-ts (speed, bigint)               ', () => speedBigintType.fromBinary(bytes));
bench('protobuf-ts (size)                        ', () => sizeType.fromBinary(bytes));
bench('protobuf-ts (size, bigint)                ', () => sizeBigintType.fromBinary(bytes));
bench('protobuf-ts (speed, node/Buffer)          ', () => speedType.fromBinary(bytes, nodeBinaryReadOptions));
bench('protobuf-ts (speed, bigint, node/Buffer)  ', () => speedBigintType.fromBinary(bytes, nodeBinaryReadOptions));
bench('protobuf-ts (size, node/Buffer)           ', () => sizeType.fromBinary(bytes, nodeBinaryReadOptions));
bench('protobuf-ts (size, bigint, node/Buffer)   ', () => sizeBigintType.fromBinary(bytes, nodeBinaryReadOptions));
bench('protobufjs                                ', () => protobufjsType.decode(new Uint8Array(bytes)));

console.log('### write binary');
bench('google-protobuf                           ', () => googleProtobufMessage.serializeBinary());
bench('ts-proto                                  ', () => tsProtoType.encode(tsProtoMessage));
bench('protobuf-ts (speed)                       ', () => speedType.toBinary(speedMessage));
bench('protobuf-ts (speed, bigint)               ', () => speedBigintType.toBinary(speedBigintMessage));
bench('protobuf-ts (size)                        ', () => sizeType.toBinary(sizeMessage));
bench('protobuf-ts (size, bigint)                ', () => sizeBigintType.toBinary(sizeBigintMessage));
bench('protobufjs                                ', () => protobufjsType.encode(protobufjsMessage).finish());

console.log('### from partial');
bench('ts-proto                                  ', () => tsProtoType.fromPartial(tsProtoMessage));
bench('protobuf-ts (speed)                       ', () => speedType.create(sizeMessage));
bench('protobuf-ts (size)                        ', () => sizeType.create(speedMessage));

console.log('### read json string');
bench('ts-proto                                  ', () => tsProtoType.fromJSON(JSON.parse(tsProtoJsonString)));
bench('protobuf-ts (speed)                       ', () => speedType.fromJsonString(tsProtoJsonString));
bench('protobuf-ts (size)                        ', () => sizeType.fromJsonString(tsProtoJsonString));
bench('protobufjs                                ', () => protobufjsType.fromObject(JSON.parse(tsProtoJsonString)));

console.log('### write json string');
bench('ts-proto                                  ', () => JSON.stringify(tsProtoType.toJSON(tsProtoMessage)));
bench('protobuf-ts (speed)                       ', () => speedType.toJsonString(speedMessage));
bench('protobuf-ts (size)                        ', () => sizeType.toJsonString(sizeMessage));
bench('protobufjs                                ', () => JSON.stringify(protobufjsType.toObject(protobufjsMessage)));

console.log('### read json object');
bench('ts-proto                                  ', () => tsProtoType.fromJSON(tsProtoJson));
bench('protobuf-ts (speed)                       ', () => speedType.fromJson(speedJson));
bench('protobuf-ts (size)                        ', () => sizeType.fromJson(sizeJson));
bench('protobufjs                                ', () => protobufjsType.fromObject(protobufjsJson));

console.log('### write json object');
bench('ts-proto                                  ', () => tsProtoType.toJSON(tsProtoMessage));
bench('protobuf-ts (speed)                       ', () => speedType.toJson(speedMessage));
bench('protobuf-ts (size)                        ', () => sizeType.toJson(sizeMessage));
bench('protobufjs                                ', () => protobufjsType.toObject(protobufjsMessage));
