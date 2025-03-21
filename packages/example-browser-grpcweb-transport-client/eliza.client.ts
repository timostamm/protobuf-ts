// @generated by protobuf-ts 2.9.6 with parameter optimize_code_size
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
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { ElizaService } from "./eliza";
import type { IntroduceResponse } from "./eliza";
import type { IntroduceRequest } from "./eliza";
import type { ServerStreamingCall } from "@protobuf-ts/runtime-rpc";
import type { ConverseResponse } from "./eliza";
import type { ConverseRequest } from "./eliza";
import type { DuplexStreamingCall } from "@protobuf-ts/runtime-rpc";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { SayResponse } from "./eliza";
import type { SayRequest } from "./eliza";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * ElizaService provides a way to talk to Eliza, a port of the DOCTOR script
 * for Joseph Weizenbaum's original ELIZA program. Created in the mid-1960s at
 * the MIT Artificial Intelligence Laboratory, ELIZA demonstrates the
 * superficiality of human-computer communication. DOCTOR simulates a
 * psychotherapist, and is commonly found as an Easter egg in emacs
 * distributions.
 *
 * @generated from protobuf service connectrpc.eliza.v1.ElizaService
 */
export interface IElizaServiceClient {
    /**
     * Say is a unary RPC. Eliza responds to the prompt with a single sentence.
     *
     * @generated from protobuf rpc: Say(connectrpc.eliza.v1.SayRequest) returns (connectrpc.eliza.v1.SayResponse);
     */
    say(input: SayRequest, options?: RpcOptions): UnaryCall<SayRequest, SayResponse>;
    /**
     * Converse is a bidirectional RPC. The caller may exchange multiple
     * back-and-forth messages with Eliza over a long-lived connection. Eliza
     * responds to each ConverseRequest with a ConverseResponse.
     *
     * @generated from protobuf rpc: Converse(stream connectrpc.eliza.v1.ConverseRequest) returns (stream connectrpc.eliza.v1.ConverseResponse);
     */
    converse(options?: RpcOptions): DuplexStreamingCall<ConverseRequest, ConverseResponse>;
    /**
     * Introduce is a server streaming RPC. Given the caller's name, Eliza
     * returns a stream of sentences to introduce itself.
     *
     * @generated from protobuf rpc: Introduce(connectrpc.eliza.v1.IntroduceRequest) returns (stream connectrpc.eliza.v1.IntroduceResponse);
     */
    introduce(input: IntroduceRequest, options?: RpcOptions): ServerStreamingCall<IntroduceRequest, IntroduceResponse>;
}
/**
 * ElizaService provides a way to talk to Eliza, a port of the DOCTOR script
 * for Joseph Weizenbaum's original ELIZA program. Created in the mid-1960s at
 * the MIT Artificial Intelligence Laboratory, ELIZA demonstrates the
 * superficiality of human-computer communication. DOCTOR simulates a
 * psychotherapist, and is commonly found as an Easter egg in emacs
 * distributions.
 *
 * @generated from protobuf service connectrpc.eliza.v1.ElizaService
 */
export class ElizaServiceClient implements IElizaServiceClient, ServiceInfo {
    typeName = ElizaService.typeName;
    methods = ElizaService.methods;
    options = ElizaService.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * Say is a unary RPC. Eliza responds to the prompt with a single sentence.
     *
     * @generated from protobuf rpc: Say(connectrpc.eliza.v1.SayRequest) returns (connectrpc.eliza.v1.SayResponse);
     */
    say(input: SayRequest, options?: RpcOptions): UnaryCall<SayRequest, SayResponse> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<SayRequest, SayResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * Converse is a bidirectional RPC. The caller may exchange multiple
     * back-and-forth messages with Eliza over a long-lived connection. Eliza
     * responds to each ConverseRequest with a ConverseResponse.
     *
     * @generated from protobuf rpc: Converse(stream connectrpc.eliza.v1.ConverseRequest) returns (stream connectrpc.eliza.v1.ConverseResponse);
     */
    converse(options?: RpcOptions): DuplexStreamingCall<ConverseRequest, ConverseResponse> {
        const method = this.methods[1], opt = this._transport.mergeOptions(options);
        return stackIntercept<ConverseRequest, ConverseResponse>("duplex", this._transport, method, opt);
    }
    /**
     * Introduce is a server streaming RPC. Given the caller's name, Eliza
     * returns a stream of sentences to introduce itself.
     *
     * @generated from protobuf rpc: Introduce(connectrpc.eliza.v1.IntroduceRequest) returns (stream connectrpc.eliza.v1.IntroduceResponse);
     */
    introduce(input: IntroduceRequest, options?: RpcOptions): ServerStreamingCall<IntroduceRequest, IntroduceResponse> {
        const method = this.methods[2], opt = this._transport.mergeOptions(options);
        return stackIntercept<IntroduceRequest, IntroduceResponse>("serverStreaming", this._transport, method, opt, input);
    }
}
