// @generated by protobuf-ts 2.9.5 with parameter force_optimize_code_size,long_type_string
// @generated from protobuf file "google/protobuf/unittest_import_public.proto" (package "protobuf_unittest_import", syntax proto2)
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
// Author: liujisi@google.com (Pherl Liu)
//
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message protobuf_unittest_import.PublicImportMessage
 */
export interface PublicImportMessage {
    /**
     * @generated from protobuf field: optional int32 e = 1;
     */
    e?: number;
}
// @generated message type with reflection information, may provide speed optimized methods
class PublicImportMessage$Type extends MessageType<PublicImportMessage> {
    constructor() {
        super("protobuf_unittest_import.PublicImportMessage", [
            { no: 1, name: "e", kind: "scalar", opt: true, T: 5 /*ScalarType.INT32*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message protobuf_unittest_import.PublicImportMessage
 */
export const PublicImportMessage = new PublicImportMessage$Type();
