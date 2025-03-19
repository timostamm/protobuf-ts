// @generated by protobuf-ts 2.9.6 with parameter force_optimize_code_size
// @generated from protobuf file "google/protobuf/unittest_proto3_bad_macros.proto" (package "protobuf_unittest", syntax proto3)
// tslint:disable
//
// Protocol Buffers - Google's data interchange format
// Copyright 2023 Google Inc.  All rights reserved.
//
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file or at
// https://developers.google.com/open-source/licenses/bsd
//
// `google/protobuf/port_def.inc` #undef's a number of inconvenient macros
// defined in system headers under varying circumstances. The code generated
// from this file will not compile if those `#undef` calls are accidentally
// removed.

/**
 * This generates `GID_MAX`, which is a macro in some circumstances.
 *
 * @generated from protobuf enum protobuf_unittest.GID
 */
export enum GID {
    /**
     * @generated from protobuf enum value: GID_UNUSED = 0;
     */
    GID_UNUSED = 0
}
/**
 * This generates `UID_MAX`, which is a mcro in some circumstances.
 *
 * @generated from protobuf enum protobuf_unittest.UID
 */
export enum UID {
    /**
     * @generated from protobuf enum value: UID_UNUSED = 0;
     */
    UID_UNUSED = 0
}
/**
 * Just a container for bad macro names. Some of these do not follow the normal
 * naming conventions, this is intentional, we just want to trigger a build
 * failure if the macro is left defined.
 *
 * @generated from protobuf enum protobuf_unittest.BadNames
 */
export enum BadNames {
    /**
     * autoheader defines this in some circumstances.
     *
     * @generated from protobuf enum value: PACKAGE = 0;
     */
    PACKAGE = 0,
    /**
     * The comment says "a few common headers define this".
     *
     * @generated from protobuf enum value: PACKED = 1;
     */
    PACKED = 1,
    /**
     * Defined in many Linux system headers.
     *
     * @generated from protobuf enum value: linux = 2;
     */
    linux = 2,
    /**
     * This is often a macro in `<math.h>`.
     *
     * @generated from protobuf enum value: DOMAIN = 3;
     */
    DOMAIN = 3,
    /**
     * These are defined in both Windows and macOS headers.
     *
     * @generated from protobuf enum value: TRUE = 4;
     */
    TRUE = 4,
    /**
     * @generated from protobuf enum value: FALSE = 5;
     */
    FALSE = 5,
    /**
     * Sometimes defined in Windows system headers.
     *
     * @generated from protobuf enum value: CREATE_NEW = 6;
     */
    CREATE_NEW = 6,
    /**
     * @generated from protobuf enum value: DELETE = 7;
     */
    DELETE = 7,
    /**
     * @generated from protobuf enum value: DOUBLE_CLICK = 8;
     */
    DOUBLE_CLICK = 8,
    /**
     * @generated from protobuf enum value: ERROR = 9;
     */
    ERROR = 9,
    /**
     * @generated from protobuf enum value: ERROR_BUSY = 10;
     */
    ERROR_BUSY = 10,
    /**
     * @generated from protobuf enum value: ERROR_INSTALL_FAILED = 11;
     */
    ERROR_INSTALL_FAILED = 11,
    /**
     * @generated from protobuf enum value: ERROR_NOT_FOUND = 12;
     */
    ERROR_NOT_FOUND = 12,
    /**
     * @generated from protobuf enum value: GetClassName = 13;
     */
    GetClassName = 13,
    /**
     * @generated from protobuf enum value: GetCurrentTime = 14;
     */
    GetCurrentTime = 14,
    /**
     * @generated from protobuf enum value: GetMessage = 15;
     */
    GetMessage = 15,
    /**
     * @generated from protobuf enum value: GetObject = 16;
     */
    GetObject = 16,
    /**
     * @generated from protobuf enum value: IGNORE = 17;
     */
    IGNORE = 17,
    /**
     * @generated from protobuf enum value: IN = 18;
     */
    IN = 18,
    /**
     * @generated from protobuf enum value: INPUT_KEYBOARD = 19;
     */
    INPUT_KEYBOARD = 19,
    /**
     * @generated from protobuf enum value: NO_ERROR = 20;
     */
    NO_ERROR = 20,
    /**
     * @generated from protobuf enum value: OUT = 21;
     */
    OUT = 21,
    /**
     * @generated from protobuf enum value: OPTIONAL = 22;
     */
    OPTIONAL = 22,
    /**
     * @generated from protobuf enum value: NEAR = 23;
     */
    NEAR = 23,
    /**
     * @generated from protobuf enum value: NO_DATA = 24;
     */
    NO_DATA = 24,
    /**
     * @generated from protobuf enum value: REASON_UNKNOWN = 25;
     */
    REASON_UNKNOWN = 25,
    /**
     * @generated from protobuf enum value: SERVICE_DISABLED = 26;
     */
    SERVICE_DISABLED = 26,
    /**
     * @generated from protobuf enum value: SEVERITY_ERROR = 27;
     */
    SEVERITY_ERROR = 27,
    /**
     * @generated from protobuf enum value: STATUS_PENDING = 28;
     */
    STATUS_PENDING = 28,
    /**
     * @generated from protobuf enum value: STRICT = 29;
     */
    STRICT = 29,
    /**
     * Sometimed defined in macOS system headers.
     *
     * @generated from protobuf enum value: TYPE_BOOL = 30;
     */
    TYPE_BOOL = 30,
    /**
     * Defined in macOS, Windows, and Linux headers.
     *
     * @generated from protobuf enum value: DEBUG = 31;
     */
    DEBUG = 31
}
