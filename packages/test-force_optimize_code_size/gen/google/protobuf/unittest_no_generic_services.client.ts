// @generated by protobuf-ts 2.9.6 with parameter force_optimize_code_size
// @generated from protobuf file "google/protobuf/unittest_no_generic_services.proto" (package "protobuf_unittest.no_generic_services_test", syntax proto2)
// tslint:disable
//
// Protocol Buffers - Google's data interchange format
// Copyright 2008 Google Inc.  All rights reserved.
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd
//
//
// Author: kenton@google.com (Kenton Varda)
//
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { TestService } from "./unittest_no_generic_services";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { TestMessage } from "./unittest_no_generic_services";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service protobuf_unittest.no_generic_services_test.TestService
 */
export interface ITestServiceClient {
    /**
     * @generated from protobuf rpc: Foo(protobuf_unittest.no_generic_services_test.TestMessage) returns (protobuf_unittest.no_generic_services_test.TestMessage);
     */
    foo(input: TestMessage, options?: RpcOptions): UnaryCall<TestMessage, TestMessage>;
}
/**
 * @generated from protobuf service protobuf_unittest.no_generic_services_test.TestService
 */
export class TestServiceClient implements ITestServiceClient, ServiceInfo {
    typeName = TestService.typeName;
    methods = TestService.methods;
    options = TestService.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: Foo(protobuf_unittest.no_generic_services_test.TestMessage) returns (protobuf_unittest.no_generic_services_test.TestMessage);
     */
    foo(input: TestMessage, options?: RpcOptions): UnaryCall<TestMessage, TestMessage> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<TestMessage, TestMessage>("unary", this._transport, method, opt, input);
    }
}
