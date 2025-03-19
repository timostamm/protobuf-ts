// @generated by protobuf-ts 2.9.6 with parameter force_optimize_speed,long_type_string
// @generated from protobuf file "google/protobuf/unittest_retention.proto" (package "protobuf_unittest", syntax proto2)
// tslint:disable
//
// Protocol Buffers - Google's data interchange format
// Copyright 2008 Google Inc.  All rights reserved.
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd
//
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { Service } from "./unittest_retention";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { TopLevelMessage } from "./unittest_retention";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service protobuf_unittest.Service
 */
export interface IServiceClient {
    /**
     * @generated from protobuf rpc: DoStuff(protobuf_unittest.TopLevelMessage) returns (protobuf_unittest.TopLevelMessage);
     */
    doStuff(input: TopLevelMessage, options?: RpcOptions): UnaryCall<TopLevelMessage, TopLevelMessage>;
}
/**
 * @generated from protobuf service protobuf_unittest.Service
 */
export class ServiceClient implements IServiceClient, ServiceInfo {
    typeName = Service.typeName;
    methods = Service.methods;
    options = Service.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: DoStuff(protobuf_unittest.TopLevelMessage) returns (protobuf_unittest.TopLevelMessage);
     */
    doStuff(input: TopLevelMessage, options?: RpcOptions): UnaryCall<TopLevelMessage, TopLevelMessage> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<TopLevelMessage, TopLevelMessage>("unary", this._transport, method, opt, input);
    }
}
