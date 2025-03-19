#!/usr/bin/env ts-node

import {readSync, writeSync} from "fs";
import type {IMessageType} from "@protobuf-ts/runtime";
import {ConformanceRequest, ConformanceResponse, TestCategory, WireFormat} from "./gen/conformance/conformance";
import {TestAllTypesProto3} from "./gen/google/protobuf/test_messages_proto3";
import {TestAllTypesProto2} from "./gen/google/protobuf/test_messages_proto2";
import {Struct, Value} from "./gen/google/protobuf/struct";
import {FieldMask} from "./gen/google/protobuf/field_mask";
import {Timestamp} from "./gen/google/protobuf/timestamp";
import {Duration} from "./gen/google/protobuf/duration";
import {Int32Value} from "./gen/google/protobuf/wrappers";
import {Any} from "./gen/google/protobuf/any";

const typeRegistry = [
    Value,
    Struct,
    FieldMask,
    Timestamp,
    Duration,
    Int32Value,
    TestAllTypesProto3,
    TestAllTypesProto2,
    Any,
];

let testCount = 0;
try {
    while (doTestIo((request) => doTest(request, typeRegistry))) {
        testCount += 1
    }
} catch (e) {
    console.error("conformance.ts: exiting after " + testCount + " tests: " + e)
}

function doTest(request: ConformanceRequest, typeRegistry: readonly IMessageType<any>[]): ConformanceResponse {
    let testMessage: object;
    let response = ConformanceResponse.create();

    const testMessageType = typeRegistry.find(mt => request.messageType === mt.typeName);
    if (testMessageType === undefined) {
        return ConformanceResponse.create({
            result: {
                oneofKind: "runtimeError",
                runtimeError: `unknown request message type ${request.messageType}`
            }
        });
    }

    try {
        switch (request.payload.oneofKind) {
            case "protobufPayload":
                testMessage = testMessageType.fromBinary(request.payload.protobufPayload);
                break;

            case "jsonPayload":
                testMessage = testMessageType.fromJsonString(request.payload.jsonPayload, {
                    ignoreUnknownFields: request.testCategory === TestCategory.JSON_IGNORE_UNKNOWN_PARSING_TEST,
                    typeRegistry,
                });
                break;

            default:
                return ConformanceResponse.create({
                    result: {
                        oneofKind: "skipped",
                        skipped: `${request.payload.oneofKind} not supported.`,
                    }
                });

        }
    } catch (err) {
        return ConformanceResponse.create({
            result: {
                oneofKind: "parseError",
                parseError: err.toString() + "\n" + err.stack,
            }
        });
    }

    try {
        switch (request.requestedOutputFormat) {
            case WireFormat.PROTOBUF:
                response.result = {
                    oneofKind: "protobufPayload",
                    protobufPayload: testMessageType.toBinary(testMessage),
                };
                break;

            case WireFormat.JSON:
                response.result = {
                    oneofKind: "jsonPayload",
                    jsonPayload: testMessageType.toJsonString(testMessage, {
                        typeRegistry
                    })
                };
                break;

            case WireFormat.JSPB:
                response.result = {oneofKind: "skipped", skipped: "JSPB not supported."};
                return response;

            case WireFormat.TEXT_FORMAT:
                response.result = {oneofKind: "skipped", skipped: "Text format not supported."};
                return response;

            default:
                return ConformanceResponse.create({
                    result: {
                        oneofKind: "runtimeError",
                        runtimeError: `unknown requested output format ${request.requestedOutputFormat}`
                    }
                });
        }
    } catch (err) {
        return ConformanceResponse.create({
            result: {
                oneofKind: "serializeError",
                serializeError: err.toString() + "\n" + err.stack
            }
        });
    }
    return response;
}


// Utility function to read a buffer of N bytes.
function readBuffer(bytes: number): Buffer | 'EOF' {
    let buf = Buffer.alloc(bytes);
    let read = 0;
    try {
        read = readSync(0, buf, 0, bytes, null);
    } catch (e) {
        throw "Error reading from stdin." + e;
    }
    if (read !== bytes) {
        if (read === 0) {
            return 'EOF';
        }
        throw "premature EOF on stdin.";
    }
    return buf;
}

// Returns true if the test ran successfully, false on legitimate EOF.
// If EOF is encountered in an unexpected place, raises IOError.
function doTestIo(testFn: (request: ConformanceRequest) => ConformanceResponse): boolean {
    let lengthBuf = readBuffer(4);
    if (lengthBuf === "EOF") {
        return false;
    }
    let length = lengthBuf.readInt32LE(0);
    let serializedRequest = readBuffer(length);
    if (serializedRequest === "EOF") {
        throw "Failed to read request.";
    }
    let request = ConformanceRequest.fromBinary(serializedRequest);
    let response = testFn(request);
    let serializedResponse = ConformanceResponse.toBinary(response);
    lengthBuf = Buffer.alloc(4);
    lengthBuf.writeInt32LE(serializedResponse.length, 0);
    writeBuffer(lengthBuf);
    writeBuffer(Buffer.from(serializedResponse));
    return true;
}

function writeBuffer(buffer: Buffer): void {
    let totalWritten = 0;
    while (totalWritten < buffer.length) {
        totalWritten += writeSync(1, buffer, totalWritten, buffer.length - totalWritten);
    }
}
