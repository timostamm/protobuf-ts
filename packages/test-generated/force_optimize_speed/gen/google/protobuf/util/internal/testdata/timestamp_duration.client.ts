// @generated by protobuf-ts 2.9.5 with parameter force_optimize_speed,long_type_string
// @generated from protobuf file "google/protobuf/util/internal/testdata/timestamp_duration.proto" (package "proto_util_converter.testing", syntax proto3)
// tslint:disable
//
// Protocol Buffers - Google's data interchange format
// Copyright 2008 Google Inc.  All rights reserved.
// https://developers.google.com/protocol-buffers/
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//     * Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
// copyright notice, this list of conditions and the following disclaimer
// in the documentation and/or other materials provided with the
// distribution.
//     * Neither the name of Google Inc. nor the names of its
// contributors may be used to endorse or promote products derived from
// this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { TimestampDurationTestService } from "./timestamp_duration";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { TimestampDurationTestCases } from "./timestamp_duration";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service proto_util_converter.testing.TimestampDurationTestService
 */
export interface ITimestampDurationTestServiceClient {
    /**
     * @generated from protobuf rpc: Call(proto_util_converter.testing.TimestampDurationTestCases) returns (proto_util_converter.testing.TimestampDurationTestCases);
     */
    call(input: TimestampDurationTestCases, options?: RpcOptions): UnaryCall<TimestampDurationTestCases, TimestampDurationTestCases>;
}
/**
 * @generated from protobuf service proto_util_converter.testing.TimestampDurationTestService
 */
export class TimestampDurationTestServiceClient implements ITimestampDurationTestServiceClient, ServiceInfo {
    typeName = TimestampDurationTestService.typeName;
    methods = TimestampDurationTestService.methods;
    options = TimestampDurationTestService.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: Call(proto_util_converter.testing.TimestampDurationTestCases) returns (proto_util_converter.testing.TimestampDurationTestCases);
     */
    call(input: TimestampDurationTestCases, options?: RpcOptions): UnaryCall<TimestampDurationTestCases, TimestampDurationTestCases> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<TimestampDurationTestCases, TimestampDurationTestCases>("unary", this._transport, method, opt, input);
    }
}
