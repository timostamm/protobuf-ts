// @generated by protobuf-ts 2.9.5 with parameter force_optimize_code_size
// @generated from protobuf file "google/protobuf/unittest_mset_wire_format.proto" (package "proto2_wireformat_unittest", syntax proto2)
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
//
// Author: kenton@google.com (Kenton Varda)
//  Based on original Protocol Buffers design by
//  Sanjay Ghemawat, Jeff Dean, and others.
//
// This file contains messages for testing message_set_wire_format.
//
import { MessageType } from "@protobuf-ts/runtime";
/**
 * A message with message_set_wire_format.
 *
 * @generated from protobuf message proto2_wireformat_unittest.TestMessageSet
 */
export interface TestMessageSet {
}
/**
 * @generated from protobuf message proto2_wireformat_unittest.TestMessageSetWireFormatContainer
 */
export interface TestMessageSetWireFormatContainer {
    /**
     * @generated from protobuf field: optional proto2_wireformat_unittest.TestMessageSet message_set = 1;
     */
    messageSet?: TestMessageSet;
}
// @generated message type with reflection information, may provide speed optimized methods
class TestMessageSet$Type extends MessageType<TestMessageSet> {
    constructor() {
        super("proto2_wireformat_unittest.TestMessageSet", []);
    }
}
/**
 * @generated MessageType for protobuf message proto2_wireformat_unittest.TestMessageSet
 */
export const TestMessageSet = new TestMessageSet$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TestMessageSetWireFormatContainer$Type extends MessageType<TestMessageSetWireFormatContainer> {
    constructor() {
        super("proto2_wireformat_unittest.TestMessageSetWireFormatContainer", [
            { no: 1, name: "message_set", kind: "message", T: () => TestMessageSet }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message proto2_wireformat_unittest.TestMessageSetWireFormatContainer
 */
export const TestMessageSetWireFormatContainer = new TestMessageSetWireFormatContainer$Type();
