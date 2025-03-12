// @generated by protobuf-ts 2.9.5 with parameter force_optimize_code_size
// @generated from protobuf file "google/protobuf/api.proto" (package "google.protobuf", syntax proto3)
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
import { MessageType } from "@protobuf-ts/runtime";
import { Syntax } from "./type";
import { SourceContext } from "./source_context";
import { Option } from "./type";
/**
 * Api is a light-weight descriptor for an API Interface.
 *
 * Interfaces are also described as "protocol buffer services" in some contexts,
 * such as by the "service" keyword in a .proto file, but they are different
 * from API Services, which represent a concrete implementation of an interface
 * as opposed to simply a description of methods and bindings. They are also
 * sometimes simply referred to as "APIs" in other contexts, such as the name of
 * this message itself. See https://cloud.google.com/apis/design/glossary for
 * detailed terminology.
 *
 * @generated from protobuf message google.protobuf.Api
 */
export interface Api {
    /**
     * The fully qualified name of this interface, including package name
     * followed by the interface's simple name.
     *
     * @generated from protobuf field: string name = 1;
     */
    name: string;
    /**
     * The methods of this interface, in unspecified order.
     *
     * @generated from protobuf field: repeated google.protobuf.Method methods = 2;
     */
    methods: Method[];
    /**
     * Any metadata attached to the interface.
     *
     * @generated from protobuf field: repeated google.protobuf.Option options = 3;
     */
    options: Option[];
    /**
     * A version string for this interface. If specified, must have the form
     * `major-version.minor-version`, as in `1.10`. If the minor version is
     * omitted, it defaults to zero. If the entire version field is empty, the
     * major version is derived from the package name, as outlined below. If the
     * field is not empty, the version in the package name will be verified to be
     * consistent with what is provided here.
     *
     * The versioning schema uses [semantic
     * versioning](http://semver.org) where the major version number
     * indicates a breaking change and the minor version an additive,
     * non-breaking change. Both version numbers are signals to users
     * what to expect from different versions, and should be carefully
     * chosen based on the product plan.
     *
     * The major version is also reflected in the package name of the
     * interface, which must end in `v<major-version>`, as in
     * `google.feature.v1`. For major versions 0 and 1, the suffix can
     * be omitted. Zero major versions must only be used for
     * experimental, non-GA interfaces.
     *
     *
     * @generated from protobuf field: string version = 4;
     */
    version: string;
    /**
     * Source context for the protocol buffer service represented by this
     * message.
     *
     * @generated from protobuf field: google.protobuf.SourceContext source_context = 5;
     */
    sourceContext?: SourceContext;
    /**
     * Included interfaces. See [Mixin][].
     *
     * @generated from protobuf field: repeated google.protobuf.Mixin mixins = 6;
     */
    mixins: Mixin[];
    /**
     * The source syntax of the service.
     *
     * @generated from protobuf field: google.protobuf.Syntax syntax = 7;
     */
    syntax: Syntax;
}
/**
 * Method represents a method of an API interface.
 *
 * @generated from protobuf message google.protobuf.Method
 */
export interface Method {
    /**
     * The simple name of this method.
     *
     * @generated from protobuf field: string name = 1;
     */
    name: string;
    /**
     * A URL of the input message type.
     *
     * @generated from protobuf field: string request_type_url = 2;
     */
    requestTypeUrl: string;
    /**
     * If true, the request is streamed.
     *
     * @generated from protobuf field: bool request_streaming = 3;
     */
    requestStreaming: boolean;
    /**
     * The URL of the output message type.
     *
     * @generated from protobuf field: string response_type_url = 4;
     */
    responseTypeUrl: string;
    /**
     * If true, the response is streamed.
     *
     * @generated from protobuf field: bool response_streaming = 5;
     */
    responseStreaming: boolean;
    /**
     * Any metadata attached to the method.
     *
     * @generated from protobuf field: repeated google.protobuf.Option options = 6;
     */
    options: Option[];
    /**
     * The source syntax of this method.
     *
     * @generated from protobuf field: google.protobuf.Syntax syntax = 7;
     */
    syntax: Syntax;
}
/**
 * Declares an API Interface to be included in this interface. The including
 * interface must redeclare all the methods from the included interface, but
 * documentation and options are inherited as follows:
 *
 * - If after comment and whitespace stripping, the documentation
 *   string of the redeclared method is empty, it will be inherited
 *   from the original method.
 *
 * - Each annotation belonging to the service config (http,
 *   visibility) which is not set in the redeclared method will be
 *   inherited.
 *
 * - If an http annotation is inherited, the path pattern will be
 *   modified as follows. Any version prefix will be replaced by the
 *   version of the including interface plus the [root][] path if
 *   specified.
 *
 * Example of a simple mixin:
 *
 *     package google.acl.v1;
 *     service AccessControl {
 *       // Get the underlying ACL object.
 *       rpc GetAcl(GetAclRequest) returns (Acl) {
 *         option (google.api.http).get = "/v1/{resource=**}:getAcl";
 *       }
 *     }
 *
 *     package google.storage.v2;
 *     service Storage {
 *       rpc GetAcl(GetAclRequest) returns (Acl);
 *
 *       // Get a data record.
 *       rpc GetData(GetDataRequest) returns (Data) {
 *         option (google.api.http).get = "/v2/{resource=**}";
 *       }
 *     }
 *
 * Example of a mixin configuration:
 *
 *     apis:
 *     - name: google.storage.v2.Storage
 *       mixins:
 *       - name: google.acl.v1.AccessControl
 *
 * The mixin construct implies that all methods in `AccessControl` are
 * also declared with same name and request/response types in
 * `Storage`. A documentation generator or annotation processor will
 * see the effective `Storage.GetAcl` method after inheriting
 * documentation and annotations as follows:
 *
 *     service Storage {
 *       // Get the underlying ACL object.
 *       rpc GetAcl(GetAclRequest) returns (Acl) {
 *         option (google.api.http).get = "/v2/{resource=**}:getAcl";
 *       }
 *       ...
 *     }
 *
 * Note how the version in the path pattern changed from `v1` to `v2`.
 *
 * If the `root` field in the mixin is specified, it should be a
 * relative path under which inherited HTTP paths are placed. Example:
 *
 *     apis:
 *     - name: google.storage.v2.Storage
 *       mixins:
 *       - name: google.acl.v1.AccessControl
 *         root: acls
 *
 * This implies the following inherited HTTP annotation:
 *
 *     service Storage {
 *       // Get the underlying ACL object.
 *       rpc GetAcl(GetAclRequest) returns (Acl) {
 *         option (google.api.http).get = "/v2/acls/{resource=**}:getAcl";
 *       }
 *       ...
 *     }
 *
 * @generated from protobuf message google.protobuf.Mixin
 */
export interface Mixin {
    /**
     * The fully qualified name of the interface which is included.
     *
     * @generated from protobuf field: string name = 1;
     */
    name: string;
    /**
     * If non-empty specifies a path under which inherited HTTP paths
     * are rooted.
     *
     * @generated from protobuf field: string root = 2;
     */
    root: string;
}
// @generated message type with reflection information, may provide speed optimized methods
class Api$Type extends MessageType<Api> {
    constructor() {
        super("google.protobuf.Api", [
            { no: 1, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "methods", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Method },
            { no: 3, name: "options", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Option },
            { no: 4, name: "version", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "source_context", kind: "message", T: () => SourceContext },
            { no: 6, name: "mixins", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Mixin },
            { no: 7, name: "syntax", kind: "enum", T: () => ["google.protobuf.Syntax", Syntax, "SYNTAX_"] }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message google.protobuf.Api
 */
export const Api = new Api$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Method$Type extends MessageType<Method> {
    constructor() {
        super("google.protobuf.Method", [
            { no: 1, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "request_type_url", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "request_streaming", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 4, name: "response_type_url", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "response_streaming", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 6, name: "options", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Option },
            { no: 7, name: "syntax", kind: "enum", T: () => ["google.protobuf.Syntax", Syntax, "SYNTAX_"] }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message google.protobuf.Method
 */
export const Method = new Method$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Mixin$Type extends MessageType<Mixin> {
    constructor() {
        super("google.protobuf.Mixin", [
            { no: 1, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "root", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message google.protobuf.Mixin
 */
export const Mixin = new Mixin$Type();
