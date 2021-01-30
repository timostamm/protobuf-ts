// @generated by protobuf-ts 2.0.0-alpha.12 with parameters client_none,generate_dependencies,optimize_code_size
// @generated from protobuf file "service-example.proto" (package "spec", syntax proto3)
// tslint:disable
import { ServiceType } from "@protobuf-ts/runtime-rpc";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message spec.ExampleRequest
 */
export interface ExampleRequest {
    /**
     * any text
     *
     * @generated from protobuf field: string question = 1;
     */
    question: string;
    /**
     * the server should simulate an error in the requested way
     *
     * @generated from protobuf field: spec.FailRequest please_fail = 2;
     */
    pleaseFail: FailRequest;
    /**
     * the server should delay it's response for this amount of milliseconds
     *
     * @generated from protobuf field: int32 please_delay_response_ms = 3;
     */
    pleaseDelayResponseMs: number;
    /**
     * by default, the server always writes some custom response headers
     *
     * @generated from protobuf field: bool disable_sending_example_response_headers = 4;
     */
    disableSendingExampleResponseHeaders: boolean;
}
/**
 * @generated from protobuf message spec.ExampleResponse
 */
export interface ExampleResponse {
    /**
     * any text
     *
     * @generated from protobuf field: string answer = 1;
     */
    answer: string;
    /**
     * contains the request headers that the server received
     *
     * @generated from protobuf field: map<string, string> your_request_headers = 2;
     */
    yourRequestHeaders: {
        [key: string]: string;
    };
    /**
     * contains the deadline that the server received
     *
     * @generated from protobuf field: string your_deadline = 3;
     */
    yourDeadline: string;
    /**
     * the failure requested
     *
     * @generated from protobuf field: spec.FailRequest your_fail_request = 4;
     */
    yourFailRequest: FailRequest;
}
/**
 * @generated from protobuf enum spec.FailRequest
 */
export enum FailRequest {
    /**
     * don't fail
     *
     * @generated from protobuf enum value: FAIL_REQUEST_NONE = 0;
     */
    FAIL_REQUEST_NONE = 0,
    /**
     * send an error status trailer after sending a message
     *
     * @generated from protobuf enum value: MESSAGE_THEN_ERROR_STATUS = 1;
     */
    MESSAGE_THEN_ERROR_STATUS = 1,
    /**
     * send an error status, don't send any message
     *
     * @generated from protobuf enum value: ERROR_STATUS_ONLY = 2;
     */
    ERROR_STATUS_ONLY = 2
}
// @generated message type with reflection information, may provide speed optimized methods
class ExampleRequest$Type extends MessageType<ExampleRequest> {
    constructor() {
        super("spec.ExampleRequest", [
            { no: 1, name: "question", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "please_fail", kind: "enum", T: () => ["spec.FailRequest", FailRequest] },
            { no: 3, name: "please_delay_response_ms", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 4, name: "disable_sending_example_response_headers", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message spec.ExampleRequest
 */
export const ExampleRequest = new ExampleRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ExampleResponse$Type extends MessageType<ExampleResponse> {
    constructor() {
        super("spec.ExampleResponse", [
            { no: 1, name: "answer", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "your_request_headers", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } },
            { no: 3, name: "your_deadline", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "your_fail_request", kind: "enum", T: () => ["spec.FailRequest", FailRequest] }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message spec.ExampleResponse
 */
export const ExampleResponse = new ExampleResponse$Type();
/**
 * @generated ServiceType for protobuf service spec.ExampleService
 */
export const ExampleService = new ServiceType("spec.ExampleService", [
    { name: "Unary", options: {}, I: ExampleRequest, O: ExampleResponse },
    { name: "ServerStream", serverStreaming: true, options: {}, I: ExampleRequest, O: ExampleResponse },
    { name: "ClientStream", clientStreaming: true, options: {}, I: ExampleRequest, O: ExampleResponse },
    { name: "Bidi", serverStreaming: true, clientStreaming: true, options: {}, I: ExampleRequest, O: ExampleResponse }
]);
