// @generated by protobuf-ts 2.11.1 with parameter force_optimize_code_size
// @generated from protobuf file "conformance/conformance.proto" (package "conformance", syntax proto3)
// tslint:disable
//
// Protocol Buffers - Google's data interchange format
// Copyright 2008 Google Inc.  All rights reserved.
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd
//
import { MessageType } from "@protobuf-ts/runtime";
/**
 * Meant to encapsulate all types of tests: successes, skips, failures, etc.
 * Therefore, this may or may not have a failure message. Failure messages
 * may be truncated for our failure lists.
 *
 * @generated from protobuf message conformance.TestStatus
 */
export interface TestStatus {
    /**
     * @generated from protobuf field: string name = 1
     */
    name: string;
    /**
     * @generated from protobuf field: string failure_message = 2
     */
    failureMessage: string;
    /**
     * What an actual test name matched to in a failure list. Can be wildcarded or
     * an exact match without wildcards.
     *
     * @generated from protobuf field: string matched_name = 3
     */
    matchedName: string;
}
/**
 * The conformance runner will request a list of failures as the first request.
 * This will be known by message_type == "conformance.FailureSet", a conformance
 * test should return a serialized FailureSet in protobuf_payload.
 *
 * @generated from protobuf message conformance.FailureSet
 */
export interface FailureSet {
    /**
     * @generated from protobuf field: repeated conformance.TestStatus test = 2
     */
    test: TestStatus[];
}
/**
 * Represents a single test case's input.  The testee should:
 *
 *   1. parse this proto (which should always succeed)
 *   2. parse the protobuf or JSON payload in "payload" (which may fail)
 *   3. if the parse succeeded, serialize the message in the requested format.
 *
 * @generated from protobuf message conformance.ConformanceRequest
 */
export interface ConformanceRequest {
    /**
     * The payload (whether protobuf of JSON) is always for a
     * protobuf_test_messages.proto3.TestAllTypes proto (as defined in
     * src/google/protobuf/proto3_test_messages.proto).
     *
     * @generated from protobuf oneof: payload
     */
    payload: {
        oneofKind: "protobufPayload";
        /**
         * @generated from protobuf field: bytes protobuf_payload = 1
         */
        protobufPayload: Uint8Array;
    } | {
        oneofKind: "jsonPayload";
        /**
         * @generated from protobuf field: string json_payload = 2
         */
        jsonPayload: string;
    } | {
        oneofKind: "jspbPayload";
        /**
         * Only used inside Google.  Opensource testees just skip it.
         *
         * @generated from protobuf field: string jspb_payload = 7
         */
        jspbPayload: string;
    } | {
        oneofKind: "textPayload";
        /**
         * @generated from protobuf field: string text_payload = 8
         */
        textPayload: string;
    } | {
        oneofKind: undefined;
    };
    /**
     * Which format should the testee serialize its message to?
     *
     * @generated from protobuf field: conformance.WireFormat requested_output_format = 3
     */
    requestedOutputFormat: WireFormat;
    /**
     * The full name for the test message to use; for the moment, either:
     * protobuf_test_messages.proto3.TestAllTypesProto3 or
     * protobuf_test_messages.proto2.TestAllTypesProto2 or
     * protobuf_test_messages.editions.proto2.TestAllTypesProto2 or
     * protobuf_test_messages.editions.proto3.TestAllTypesProto3 or
     * protobuf_test_messages.editions.TestAllTypesEdition2023.
     *
     * @generated from protobuf field: string message_type = 4
     */
    messageType: string;
    /**
     * Each test is given a specific test category. Some category may need
     * specific support in testee programs. Refer to the definition of
     * TestCategory for more information.
     *
     * @generated from protobuf field: conformance.TestCategory test_category = 5
     */
    testCategory: TestCategory;
    /**
     * Specify details for how to encode jspb.
     *
     * @generated from protobuf field: conformance.JspbEncodingConfig jspb_encoding_options = 6
     */
    jspbEncodingOptions?: JspbEncodingConfig;
    /**
     * This can be used in json and text format. If true, testee should print
     * unknown fields instead of ignore. This feature is optional.
     *
     * @generated from protobuf field: bool print_unknown_fields = 9
     */
    printUnknownFields: boolean;
}
/**
 * Represents a single test case's output.
 *
 * @generated from protobuf message conformance.ConformanceResponse
 */
export interface ConformanceResponse {
    /**
     * @generated from protobuf oneof: result
     */
    result: {
        oneofKind: "parseError";
        /**
         * This string should be set to indicate parsing failed.  The string can
         * provide more information about the parse error if it is available.
         *
         * Setting this string does not necessarily mean the testee failed the
         * test.  Some of the test cases are intentionally invalid input.
         *
         * @generated from protobuf field: string parse_error = 1
         */
        parseError: string;
    } | {
        oneofKind: "serializeError";
        /**
         * If the input was successfully parsed but errors occurred when
         * serializing it to the requested output format, set the error message in
         * this field.
         *
         * @generated from protobuf field: string serialize_error = 6
         */
        serializeError: string;
    } | {
        oneofKind: "timeoutError";
        /**
         * This should be set if the test program timed out.  The string should
         * provide more information about what the child process was doing when it
         * was killed.
         *
         * @generated from protobuf field: string timeout_error = 9
         */
        timeoutError: string;
    } | {
        oneofKind: "runtimeError";
        /**
         * This should be set if some other error occurred.  This will always
         * indicate that the test failed.  The string can provide more information
         * about the failure.
         *
         * @generated from protobuf field: string runtime_error = 2
         */
        runtimeError: string;
    } | {
        oneofKind: "protobufPayload";
        /**
         * If the input was successfully parsed and the requested output was
         * protobuf, serialize it to protobuf and set it in this field.
         *
         * @generated from protobuf field: bytes protobuf_payload = 3
         */
        protobufPayload: Uint8Array;
    } | {
        oneofKind: "jsonPayload";
        /**
         * If the input was successfully parsed and the requested output was JSON,
         * serialize to JSON and set it in this field.
         *
         * @generated from protobuf field: string json_payload = 4
         */
        jsonPayload: string;
    } | {
        oneofKind: "skipped";
        /**
         * For when the testee skipped the test, likely because a certain feature
         * wasn't supported, like JSON input/output.
         *
         * @generated from protobuf field: string skipped = 5
         */
        skipped: string;
    } | {
        oneofKind: "jspbPayload";
        /**
         * If the input was successfully parsed and the requested output was JSPB,
         * serialize to JSPB and set it in this field. JSPB is only used inside
         * Google. Opensource testees can just skip it.
         *
         * @generated from protobuf field: string jspb_payload = 7
         */
        jspbPayload: string;
    } | {
        oneofKind: "textPayload";
        /**
         * If the input was successfully parsed and the requested output was
         * TEXT_FORMAT, serialize to TEXT_FORMAT and set it in this field.
         *
         * @generated from protobuf field: string text_payload = 8
         */
        textPayload: string;
    } | {
        oneofKind: undefined;
    };
}
/**
 * Encoding options for jspb format.
 *
 * @generated from protobuf message conformance.JspbEncodingConfig
 */
export interface JspbEncodingConfig {
    /**
     * Encode the value field of Any as jspb array if true, otherwise binary.
     *
     * @generated from protobuf field: bool use_jspb_array_any_format = 1
     */
    useJspbArrayAnyFormat: boolean;
}
// This defines the conformance testing protocol.  This protocol exists between
// the conformance test suite itself and the code being tested.  For each test,
// the suite will send a ConformanceRequest message and expect a
// ConformanceResponse message.
// 
// You can either run the tests in two different ways:
// 
//   1. in-process (using the interface in conformance_test.h).
// 
//   2. as a sub-process communicating over a pipe.  Information about how to
//      do this is in conformance_test_runner.cc.
// 
// Pros/cons of the two approaches:
// 
//   - running as a sub-process is much simpler for languages other than C/C++.
// 
//   - running as a sub-process may be more tricky in unusual environments like
//     iOS apps, where fork/stdin/stdout are not available.

/**
 * @generated from protobuf enum conformance.WireFormat
 */
export enum WireFormat {
    /**
     * @generated from protobuf enum value: UNSPECIFIED = 0;
     */
    UNSPECIFIED = 0,
    /**
     * @generated from protobuf enum value: PROTOBUF = 1;
     */
    PROTOBUF = 1,
    /**
     * @generated from protobuf enum value: JSON = 2;
     */
    JSON = 2,
    /**
     * Only used inside Google. Opensource testees just skip it.
     *
     * @generated from protobuf enum value: JSPB = 3;
     */
    JSPB = 3,
    /**
     * @generated from protobuf enum value: TEXT_FORMAT = 4;
     */
    TEXT_FORMAT = 4
}
/**
 * @generated from protobuf enum conformance.TestCategory
 */
export enum TestCategory {
    /**
     * @generated from protobuf enum value: UNSPECIFIED_TEST = 0;
     */
    UNSPECIFIED_TEST = 0,
    /**
     * Test binary wire format.
     *
     * @generated from protobuf enum value: BINARY_TEST = 1;
     */
    BINARY_TEST = 1,
    /**
     * Test json wire format.
     *
     * @generated from protobuf enum value: JSON_TEST = 2;
     */
    JSON_TEST = 2,
    /**
     * Similar to JSON_TEST. However, during parsing json, testee should ignore
     * unknown fields. This feature is optional. Each implementation can decide
     * whether to support it.  See
     * https://developers.google.com/protocol-buffers/docs/proto3#json_options
     * for more detail.
     *
     * @generated from protobuf enum value: JSON_IGNORE_UNKNOWN_PARSING_TEST = 3;
     */
    JSON_IGNORE_UNKNOWN_PARSING_TEST = 3,
    /**
     * Test jspb wire format. Only used inside Google. Opensource testees just
     * skip it.
     *
     * @generated from protobuf enum value: JSPB_TEST = 4;
     */
    JSPB_TEST = 4,
    /**
     * Test text format. For cpp, java and python, testees can already deal with
     * this type. Testees of other languages can simply skip it.
     *
     * @generated from protobuf enum value: TEXT_FORMAT_TEST = 5;
     */
    TEXT_FORMAT_TEST = 5
}
// @generated message type with reflection information, may provide speed optimized methods
class TestStatus$Type extends MessageType<TestStatus> {
    constructor() {
        super("conformance.TestStatus", [
            { no: 1, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "failure_message", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "matched_name", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message conformance.TestStatus
 */
export const TestStatus = new TestStatus$Type();
// @generated message type with reflection information, may provide speed optimized methods
class FailureSet$Type extends MessageType<FailureSet> {
    constructor() {
        super("conformance.FailureSet", [
            { no: 2, name: "test", kind: "message", repeat: 2 /*RepeatType.UNPACKED*/, T: () => TestStatus }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message conformance.FailureSet
 */
export const FailureSet = new FailureSet$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ConformanceRequest$Type extends MessageType<ConformanceRequest> {
    constructor() {
        super("conformance.ConformanceRequest", [
            { no: 1, name: "protobuf_payload", kind: "scalar", oneof: "payload", T: 12 /*ScalarType.BYTES*/ },
            { no: 2, name: "json_payload", kind: "scalar", oneof: "payload", T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "jspb_payload", kind: "scalar", oneof: "payload", T: 9 /*ScalarType.STRING*/ },
            { no: 8, name: "text_payload", kind: "scalar", oneof: "payload", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "requested_output_format", kind: "enum", T: () => ["conformance.WireFormat", WireFormat] },
            { no: 4, name: "message_type", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "test_category", kind: "enum", T: () => ["conformance.TestCategory", TestCategory] },
            { no: 6, name: "jspb_encoding_options", kind: "message", T: () => JspbEncodingConfig },
            { no: 9, name: "print_unknown_fields", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message conformance.ConformanceRequest
 */
export const ConformanceRequest = new ConformanceRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ConformanceResponse$Type extends MessageType<ConformanceResponse> {
    constructor() {
        super("conformance.ConformanceResponse", [
            { no: 1, name: "parse_error", kind: "scalar", oneof: "result", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "serialize_error", kind: "scalar", oneof: "result", T: 9 /*ScalarType.STRING*/ },
            { no: 9, name: "timeout_error", kind: "scalar", oneof: "result", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "runtime_error", kind: "scalar", oneof: "result", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "protobuf_payload", kind: "scalar", oneof: "result", T: 12 /*ScalarType.BYTES*/ },
            { no: 4, name: "json_payload", kind: "scalar", oneof: "result", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "skipped", kind: "scalar", oneof: "result", T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "jspb_payload", kind: "scalar", oneof: "result", T: 9 /*ScalarType.STRING*/ },
            { no: 8, name: "text_payload", kind: "scalar", oneof: "result", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message conformance.ConformanceResponse
 */
export const ConformanceResponse = new ConformanceResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class JspbEncodingConfig$Type extends MessageType<JspbEncodingConfig> {
    constructor() {
        super("conformance.JspbEncodingConfig", [
            { no: 1, name: "use_jspb_array_any_format", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message conformance.JspbEncodingConfig
 */
export const JspbEncodingConfig = new JspbEncodingConfig$Type();
