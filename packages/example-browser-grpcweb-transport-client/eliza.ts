// @generated by protobuf-ts 2.9.4 with parameter optimize_code_size
// @generated from protobuf file "eliza.proto" (package "connectrpc.eliza.v1", syntax proto3)
// tslint:disable
//
// Copyright 2022-2023 The Connect Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
import { ServiceType } from "@protobuf-ts/runtime-rpc";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * SayRequest is a single-sentence request.
 *
 * @generated from protobuf message connectrpc.eliza.v1.SayRequest
 */
export interface SayRequest {
    /**
     * @generated from protobuf field: string sentence = 1;
     */
    sentence: string;
}
/**
 * SayResponse is a single-sentence response.
 *
 * @generated from protobuf message connectrpc.eliza.v1.SayResponse
 */
export interface SayResponse {
    /**
     * @generated from protobuf field: string sentence = 1;
     */
    sentence: string;
}
/**
 * ConverseRequest is a single sentence request sent as part of a
 * back-and-forth conversation.
 *
 * @generated from protobuf message connectrpc.eliza.v1.ConverseRequest
 */
export interface ConverseRequest {
    /**
     * @generated from protobuf field: string sentence = 1;
     */
    sentence: string;
}
/**
 * ConverseResponse is a single sentence response sent in answer to a
 * ConverseRequest.
 *
 * @generated from protobuf message connectrpc.eliza.v1.ConverseResponse
 */
export interface ConverseResponse {
    /**
     * @generated from protobuf field: string sentence = 1;
     */
    sentence: string;
}
/**
 * IntroduceRequest asks Eliza to introduce itself to the named user.
 *
 * @generated from protobuf message connectrpc.eliza.v1.IntroduceRequest
 */
export interface IntroduceRequest {
    /**
     * @generated from protobuf field: string name = 1;
     */
    name: string;
}
/**
 * IntroduceResponse is one sentence of Eliza's introductory monologue.
 *
 * @generated from protobuf message connectrpc.eliza.v1.IntroduceResponse
 */
export interface IntroduceResponse {
    /**
     * @generated from protobuf field: string sentence = 1;
     */
    sentence: string;
}
// @generated message type with reflection information, may provide speed optimized methods
class SayRequest$Type extends MessageType<SayRequest> {
    constructor() {
        super("connectrpc.eliza.v1.SayRequest", [
            { no: 1, name: "sentence", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message connectrpc.eliza.v1.SayRequest
 */
export const SayRequest = new SayRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class SayResponse$Type extends MessageType<SayResponse> {
    constructor() {
        super("connectrpc.eliza.v1.SayResponse", [
            { no: 1, name: "sentence", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message connectrpc.eliza.v1.SayResponse
 */
export const SayResponse = new SayResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ConverseRequest$Type extends MessageType<ConverseRequest> {
    constructor() {
        super("connectrpc.eliza.v1.ConverseRequest", [
            { no: 1, name: "sentence", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message connectrpc.eliza.v1.ConverseRequest
 */
export const ConverseRequest = new ConverseRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ConverseResponse$Type extends MessageType<ConverseResponse> {
    constructor() {
        super("connectrpc.eliza.v1.ConverseResponse", [
            { no: 1, name: "sentence", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message connectrpc.eliza.v1.ConverseResponse
 */
export const ConverseResponse = new ConverseResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class IntroduceRequest$Type extends MessageType<IntroduceRequest> {
    constructor() {
        super("connectrpc.eliza.v1.IntroduceRequest", [
            { no: 1, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message connectrpc.eliza.v1.IntroduceRequest
 */
export const IntroduceRequest = new IntroduceRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class IntroduceResponse$Type extends MessageType<IntroduceResponse> {
    constructor() {
        super("connectrpc.eliza.v1.IntroduceResponse", [
            { no: 1, name: "sentence", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message connectrpc.eliza.v1.IntroduceResponse
 */
export const IntroduceResponse = new IntroduceResponse$Type();
/**
 * @generated ServiceType for protobuf service connectrpc.eliza.v1.ElizaService
 */
export const ElizaService = new ServiceType("connectrpc.eliza.v1.ElizaService", [
    { name: "Say", idempotency: "NO_SIDE_EFFECTS", options: {}, I: SayRequest, O: SayResponse },
    { name: "Converse", serverStreaming: true, clientStreaming: true, options: {}, I: ConverseRequest, O: ConverseResponse },
    { name: "Introduce", serverStreaming: true, options: {}, I: IntroduceRequest, O: IntroduceResponse }
]);
