#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const conformance_1 = require("./ts-out/conformance/conformance");
const test_messages_proto3_1 = require("./ts-out/google/protobuf/test_messages_proto3");
const test_messages_proto2_1 = require("./ts-out/google/protobuf/test_messages_proto2");
const fs_1 = require("fs");
const struct_1 = require("./ts-out/google/protobuf/struct");
const field_mask_1 = require("./ts-out/google/protobuf/field_mask");
const timestamp_1 = require("./ts-out/google/protobuf/timestamp");
const duration_1 = require("./ts-out/google/protobuf/duration");
const wrappers_1 = require("./ts-out/google/protobuf/wrappers");
const any_1 = require("./ts-out/google/protobuf/any");
const typeRegistry = [
    struct_1.Value,
    struct_1.Struct,
    field_mask_1.FieldMask,
    timestamp_1.Timestamp,
    duration_1.Duration,
    wrappers_1.Int32Value,
    test_messages_proto3_1.TestAllTypesProto3,
    test_messages_proto2_1.TestAllTypesProto2,
    any_1.Any,
];
function doTest(request) {
    let testMessage;
    let testMessageType;
    let response = conformance_1.ConformanceResponse.create();
    switch (request.messageType) {
        case test_messages_proto3_1.TestAllTypesProto3.typeName:
            testMessageType = test_messages_proto3_1.TestAllTypesProto3;
            break;
        case test_messages_proto2_1.TestAllTypesProto2.typeName:
            testMessageType = test_messages_proto2_1.TestAllTypesProto2;
            break;
        default:
            return conformance_1.ConformanceResponse.create({
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
                    ignoreUnknownFields: request.testCategory === conformance_1.TestCategory.JSON_IGNORE_UNKNOWN_PARSING_TEST,
                    typeRegistry,
                });
                break;
            default:
                return conformance_1.ConformanceResponse.create({
                    result: {
                        oneofKind: "skipped",
                        skipped: `${request.payload.oneofKind} not supported.`,
                    }
                });
        }
    }
    catch (err) {
        return conformance_1.ConformanceResponse.create({
            result: {
                oneofKind: "parseError",
                parseError: err.toString() + "\n" + err.stack,
            }
        });
    }
    try {
        switch (request.requestedOutputFormat) {
            case conformance_1.WireFormat.PROTOBUF:
                response.result = {
                    oneofKind: "protobufPayload",
                    protobufPayload: testMessageType.toBinary(testMessage),
                };
                break;
            case conformance_1.WireFormat.JSON:
                response.result = {
                    oneofKind: "jsonPayload",
                    jsonPayload: testMessageType.toJsonString(testMessage, {
                        typeRegistry
                    })
                };
                break;
            case conformance_1.WireFormat.JSPB:
                response.result = { oneofKind: "skipped", skipped: "JSPB not supported." };
                return response;
            case conformance_1.WireFormat.TEXT_FORMAT:
                response.result = { oneofKind: "skipped", skipped: "Text format not supported." };
                return response;
            default:
                return conformance_1.ConformanceResponse.create({
                    result: {
                        oneofKind: "runtimeError",
                        runtimeError: `unknown requested output format ${request.requestedOutputFormat}`
                    }
                });
        }
    }
    catch (err) {
        return conformance_1.ConformanceResponse.create({
            result: {
                oneofKind: "serializeError",
                serializeError: err.toString() + "\n" + err.stack
            }
        });
    }
    return response;
}
// Utility function to read a buffer of N bytes.
function readBuffer(bytes) {
    let buf = Buffer.alloc(bytes);
    let read = 0;
    try {
        read = fs_1.readSync(0, buf, 0, bytes, null);
    }
    catch (e) {
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
function writeBuffer(buffer) {
    let totalWritten = 0;
    while (totalWritten < buffer.length) {
        totalWritten += fs_1.writeSync(1, buffer, totalWritten, buffer.length - totalWritten);
    }
}
// Returns true if the test ran successfully, false on legitimate EOF.
// If EOF is encountered in an unexpected place, raises IOError.
function doTestIo() {
    let lengthBuf = readBuffer(4);
    if (lengthBuf === "EOF") {
        return false;
    }
    let length = lengthBuf.readInt32LE(0);
    let serializedRequest = readBuffer(length);
    if (serializedRequest === "EOF") {
        throw "Failed to read request.";
    }
    let request = conformance_1.ConformanceRequest.fromBinary(serializedRequest);
    let response = doTest(request);
    let serializedResponse = conformance_1.ConformanceResponse.toBinary(response);
    lengthBuf = Buffer.alloc(4);
    lengthBuf.writeInt32LE(serializedResponse.length, 0);
    writeBuffer(lengthBuf);
    writeBuffer(Buffer.from(serializedResponse));
    return true;
}
let testCount = 0;
try {
    while (doTestIo()) {
        testCount += 1;
    }
}
catch (e) {
    console.error("conformance_ts: exiting after " + testCount + " tests: " + e);
}
