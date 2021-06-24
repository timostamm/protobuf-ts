import {performance} from "perf_hooks";
import {readFileSync} from "fs";
import {FileDescriptorSet as tsProtoType} from "./testees/ts-proto.default/.plugin-out/google/protobuf/descriptor";
import {FileDescriptorSet as googleProtobufType} from "google-protobuf/google/protobuf/descriptor_pb";
import {FileDescriptorSet as sizeType} from "./testees/protobuf-ts.size/.plugin-out/google/protobuf/descriptor";
import {FileDescriptorSet as speedType} from "./testees/protobuf-ts.speed/.plugin-out/google/protobuf/descriptor";
import {FileDescriptorSet as sizeBigintType} from "./testees/protobuf-ts.size-bigint/.plugin-out/google/protobuf/descriptor";
import {FileDescriptorSet as speedBigintType} from "./testees/protobuf-ts.speed-bigint/.plugin-out/google/protobuf/descriptor";


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
    console.log(`${name}: ${Math.round(opsPerSecond * 100) / 100} ops/s`);
}


const bytes = readFileSync('../test-fixtures/all.descriptorset');

let googleProtobufMessage = googleProtobufType.deserializeBinary(bytes);
let tsProtoMessage = tsProtoType.decode(bytes);
let tsProtoJson = tsProtoType.toJSON(tsProtoMessage);
let tsProtoJsonString = JSON.stringify(tsProtoType.toJSON(tsProtoMessage));
let sizeMessage = sizeType.fromBinary(bytes);
let sizeJson = sizeType.toJson(sizeMessage);
let sizeBigintMessage = sizeBigintType.fromBinary(bytes);
let sizeBigintJson = sizeBigintType.toJson(sizeBigintMessage);
let speedMessage = speedType.fromBinary(bytes);
let speedJson = speedType.toJson(speedMessage);
let speedBigintMessage = speedBigintType.fromBinary(bytes);
let speedBigintJson = speedBigintType.toJson(speedBigintMessage);

console.log('### read binary');
bench('google-protobuf             ', () => googleProtobufType.deserializeBinary(bytes));
bench('ts-proto                    ', () => tsProtoType.decode(bytes));
bench('protobuf-ts (speed)         ', () => speedType.fromBinary(bytes));
bench('protobuf-ts (speed, bigint) ', () => speedBigintType.fromBinary(bytes));
bench('protobuf-ts (size)          ', () => sizeType.fromBinary(bytes));
bench('protobuf-ts (size, bigint)  ', () => sizeBigintType.fromBinary(bytes));

console.log('### write binary');
bench('google-protobuf             ', () => googleProtobufMessage.serializeBinary());
bench('ts-proto                    ', () => tsProtoType.encode(tsProtoMessage));
bench('protobuf-ts (speed)         ', () => speedType.toBinary(speedMessage));
bench('protobuf-ts (speed, bigint) ', () => speedBigintType.toBinary(speedBigintMessage));
bench('protobuf-ts (size)          ', () => sizeType.toBinary(sizeMessage));
bench('protobuf-ts (size, bigint)  ', () => sizeBigintType.toBinary(sizeBigintMessage));

console.log('### from partial');
bench('ts-proto                    ', () => tsProtoType.fromPartial(tsProtoMessage));
bench('protobuf-ts (speed)         ', () => speedType.create(sizeMessage));
bench('protobuf-ts (size)          ', () => sizeType.create(speedMessage));

console.log('### read json');
bench('ts-proto                    ', () => tsProtoType.fromJSON(tsProtoJson));
bench('protobuf-ts (speed)         ', () => speedType.fromJson(speedJson));
bench('protobuf-ts (size)          ', () => sizeType.fromJson(sizeJson));

console.log('### write json');
bench('ts-proto                    ', () => tsProtoType.toJSON(tsProtoMessage));
bench('protobuf-ts (speed)         ', () => speedType.toJson(sizeMessage));
bench('protobuf-ts (size)          ', () => sizeType.toJson(speedMessage));

console.log('### read json string');
bench('ts-proto                    ', () => tsProtoType.fromJSON(JSON.parse(tsProtoJsonString)));
bench('protobuf-ts (speed)         ', () => speedType.fromJsonString(tsProtoJsonString));
bench('protobuf-ts (size)          ', () => sizeType.fromJsonString(tsProtoJsonString));

console.log('### write json string');
bench('ts-proto                    ', () => JSON.stringify(tsProtoType.toJSON(tsProtoMessage)));
bench('protobuf-ts (speed)         ', () => speedType.toJsonString(sizeMessage));
bench('protobuf-ts (size)          ', () => sizeType.toJsonString(speedMessage));
