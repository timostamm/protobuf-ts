// @generated by protobuf-ts 2.9.6
// @generated from protobuf file "google/protobuf/compiler/plugin.proto" (package "google.protobuf.compiler", syntax proto2)
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
// protoc (aka the Protocol Compiler) can be extended via plugins.  A plugin is
// just a program that reads a CodeGeneratorRequest from stdin and writes a
// CodeGeneratorResponse to stdout.
//
// Plugins written using C++ can use google/protobuf/compiler/plugin.h instead
// of dealing with the raw protocol defined here.
//
// A plugin executable needs only to be placed somewhere in the path.  The
// plugin should be named "protoc-gen-$NAME", and will then be used when the
// flag "--${NAME}_out" is passed to protoc.
//
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { GeneratedCodeInfo } from "../descriptor";
import { FileDescriptorProto } from "../descriptor";
/**
 * The version number of protocol compiler.
 *
 * @generated from protobuf message google.protobuf.compiler.Version
 */
export interface Version {
    /**
     * @generated from protobuf field: optional int32 major = 1;
     */
    major?: number;
    /**
     * @generated from protobuf field: optional int32 minor = 2;
     */
    minor?: number;
    /**
     * @generated from protobuf field: optional int32 patch = 3;
     */
    patch?: number;
    /**
     * A suffix for alpha, beta or rc release, e.g., "alpha-1", "rc2". It should
     * be empty for mainline stable releases.
     *
     * @generated from protobuf field: optional string suffix = 4;
     */
    suffix?: string;
}
/**
 * An encoded CodeGeneratorRequest is written to the plugin's stdin.
 *
 * @generated from protobuf message google.protobuf.compiler.CodeGeneratorRequest
 */
export interface CodeGeneratorRequest {
    /**
     * The .proto files that were explicitly listed on the command-line.  The
     * code generator should generate code only for these files.  Each file's
     * descriptor will be included in proto_file, below.
     *
     * @generated from protobuf field: repeated string file_to_generate = 1;
     */
    fileToGenerate: string[];
    /**
     * The generator parameter passed on the command-line.
     *
     * @generated from protobuf field: optional string parameter = 2;
     */
    parameter?: string;
    /**
     * FileDescriptorProtos for all files in files_to_generate and everything
     * they import.  The files will appear in topological order, so each file
     * appears before any file that imports it.
     *
     * Note: the files listed in files_to_generate will include runtime-retention
     * options only, but all other files will include source-retention options.
     * The source_file_descriptors field below is available in case you need
     * source-retention options for files_to_generate.
     *
     * protoc guarantees that all proto_files will be written after
     * the fields above, even though this is not technically guaranteed by the
     * protobuf wire format.  This theoretically could allow a plugin to stream
     * in the FileDescriptorProtos and handle them one by one rather than read
     * the entire set into memory at once.  However, as of this writing, this
     * is not similarly optimized on protoc's end -- it will store all fields in
     * memory at once before sending them to the plugin.
     *
     * Type names of fields and extensions in the FileDescriptorProto are always
     * fully qualified.
     *
     * @generated from protobuf field: repeated google.protobuf.FileDescriptorProto proto_file = 15;
     */
    protoFile: FileDescriptorProto[];
    /**
     * File descriptors with all options, including source-retention options.
     * These descriptors are only provided for the files listed in
     * files_to_generate.
     *
     * @generated from protobuf field: repeated google.protobuf.FileDescriptorProto source_file_descriptors = 17;
     */
    sourceFileDescriptors: FileDescriptorProto[];
    /**
     * The version number of protocol compiler.
     *
     * @generated from protobuf field: optional google.protobuf.compiler.Version compiler_version = 3;
     */
    compilerVersion?: Version;
}
/**
 * The plugin writes an encoded CodeGeneratorResponse to stdout.
 *
 * @generated from protobuf message google.protobuf.compiler.CodeGeneratorResponse
 */
export interface CodeGeneratorResponse {
    /**
     * Error message.  If non-empty, code generation failed.  The plugin process
     * should exit with status code zero even if it reports an error in this way.
     *
     * This should be used to indicate errors in .proto files which prevent the
     * code generator from generating correct code.  Errors which indicate a
     * problem in protoc itself -- such as the input CodeGeneratorRequest being
     * unparseable -- should be reported by writing a message to stderr and
     * exiting with a non-zero status code.
     *
     * @generated from protobuf field: optional string error = 1;
     */
    error?: string;
    /**
     * A bitmask of supported features that the code generator supports.
     * This is a bitwise "or" of values from the Feature enum.
     *
     * @generated from protobuf field: optional uint64 supported_features = 2;
     */
    supportedFeatures?: bigint;
    /**
     * The minimum edition this plugin supports.  This will be treated as an
     * Edition enum, but we want to allow unknown values.  It should be specified
     * according the edition enum value, *not* the edition number.  Only takes
     * effect for plugins that have FEATURE_SUPPORTS_EDITIONS set.
     *
     * @generated from protobuf field: optional int32 minimum_edition = 3;
     */
    minimumEdition?: number;
    /**
     * The maximum edition this plugin supports.  This will be treated as an
     * Edition enum, but we want to allow unknown values.  It should be specified
     * according the edition enum value, *not* the edition number.  Only takes
     * effect for plugins that have FEATURE_SUPPORTS_EDITIONS set.
     *
     * @generated from protobuf field: optional int32 maximum_edition = 4;
     */
    maximumEdition?: number;
    /**
     * @generated from protobuf field: repeated google.protobuf.compiler.CodeGeneratorResponse.File file = 15;
     */
    file: CodeGeneratorResponse_File[];
}
/**
 * Represents a single generated file.
 *
 * @generated from protobuf message google.protobuf.compiler.CodeGeneratorResponse.File
 */
export interface CodeGeneratorResponse_File {
    /**
     * The file name, relative to the output directory.  The name must not
     * contain "." or ".." components and must be relative, not be absolute (so,
     * the file cannot lie outside the output directory).  "/" must be used as
     * the path separator, not "\".
     *
     * If the name is omitted, the content will be appended to the previous
     * file.  This allows the generator to break large files into small chunks,
     * and allows the generated text to be streamed back to protoc so that large
     * files need not reside completely in memory at one time.  Note that as of
     * this writing protoc does not optimize for this -- it will read the entire
     * CodeGeneratorResponse before writing files to disk.
     *
     * @generated from protobuf field: optional string name = 1;
     */
    name?: string;
    /**
     * If non-empty, indicates that the named file should already exist, and the
     * content here is to be inserted into that file at a defined insertion
     * point.  This feature allows a code generator to extend the output
     * produced by another code generator.  The original generator may provide
     * insertion points by placing special annotations in the file that look
     * like:
     *   @@protoc_insertion_point(NAME)
     * The annotation can have arbitrary text before and after it on the line,
     * which allows it to be placed in a comment.  NAME should be replaced with
     * an identifier naming the point -- this is what other generators will use
     * as the insertion_point.  Code inserted at this point will be placed
     * immediately above the line containing the insertion point (thus multiple
     * insertions to the same point will come out in the order they were added).
     * The double-@ is intended to make it unlikely that the generated code
     * could contain things that look like insertion points by accident.
     *
     * For example, the C++ code generator places the following line in the
     * .pb.h files that it generates:
     *   // @@protoc_insertion_point(namespace_scope)
     * This line appears within the scope of the file's package namespace, but
     * outside of any particular class.  Another plugin can then specify the
     * insertion_point "namespace_scope" to generate additional classes or
     * other declarations that should be placed in this scope.
     *
     * Note that if the line containing the insertion point begins with
     * whitespace, the same whitespace will be added to every line of the
     * inserted text.  This is useful for languages like Python, where
     * indentation matters.  In these languages, the insertion point comment
     * should be indented the same amount as any inserted code will need to be
     * in order to work correctly in that context.
     *
     * The code generator that generates the initial file and the one which
     * inserts into it must both run as part of a single invocation of protoc.
     * Code generators are executed in the order in which they appear on the
     * command line.
     *
     * If |insertion_point| is present, |name| must also be present.
     *
     * @generated from protobuf field: optional string insertion_point = 2;
     */
    insertionPoint?: string;
    /**
     * The file contents.
     *
     * @generated from protobuf field: optional string content = 15;
     */
    content?: string;
    /**
     * Information describing the file content being inserted. If an insertion
     * point is used, this information will be appropriately offset and inserted
     * into the code generation metadata for the generated files.
     *
     * @generated from protobuf field: optional google.protobuf.GeneratedCodeInfo generated_code_info = 16;
     */
    generatedCodeInfo?: GeneratedCodeInfo;
}
/**
 * Sync with code_generator.h.
 *
 * @generated from protobuf enum google.protobuf.compiler.CodeGeneratorResponse.Feature
 */
export enum CodeGeneratorResponse_Feature {
    /**
     * @generated from protobuf enum value: FEATURE_NONE = 0;
     */
    NONE = 0,
    /**
     * @generated from protobuf enum value: FEATURE_PROTO3_OPTIONAL = 1;
     */
    PROTO3_OPTIONAL = 1,
    /**
     * @generated from protobuf enum value: FEATURE_SUPPORTS_EDITIONS = 2;
     */
    SUPPORTS_EDITIONS = 2
}
// @generated message type with reflection information, may provide speed optimized methods
class Version$Type extends MessageType<Version> {
    constructor() {
        super("google.protobuf.compiler.Version", [
            { no: 1, name: "major", kind: "scalar", opt: true, T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "minor", kind: "scalar", opt: true, T: 5 /*ScalarType.INT32*/ },
            { no: 3, name: "patch", kind: "scalar", opt: true, T: 5 /*ScalarType.INT32*/ },
            { no: 4, name: "suffix", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<Version>): Version {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<Version>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Version): Version {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* optional int32 major */ 1:
                    message.major = reader.int32();
                    break;
                case /* optional int32 minor */ 2:
                    message.minor = reader.int32();
                    break;
                case /* optional int32 patch */ 3:
                    message.patch = reader.int32();
                    break;
                case /* optional string suffix */ 4:
                    message.suffix = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: Version, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* optional int32 major = 1; */
        if (message.major !== undefined)
            writer.tag(1, WireType.Varint).int32(message.major);
        /* optional int32 minor = 2; */
        if (message.minor !== undefined)
            writer.tag(2, WireType.Varint).int32(message.minor);
        /* optional int32 patch = 3; */
        if (message.patch !== undefined)
            writer.tag(3, WireType.Varint).int32(message.patch);
        /* optional string suffix = 4; */
        if (message.suffix !== undefined)
            writer.tag(4, WireType.LengthDelimited).string(message.suffix);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message google.protobuf.compiler.Version
 */
export const Version = new Version$Type();
// @generated message type with reflection information, may provide speed optimized methods
class CodeGeneratorRequest$Type extends MessageType<CodeGeneratorRequest> {
    constructor() {
        super("google.protobuf.compiler.CodeGeneratorRequest", [
            { no: 1, name: "file_to_generate", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "parameter", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 15, name: "proto_file", kind: "message", repeat: 2 /*RepeatType.UNPACKED*/, T: () => FileDescriptorProto },
            { no: 17, name: "source_file_descriptors", kind: "message", repeat: 2 /*RepeatType.UNPACKED*/, T: () => FileDescriptorProto },
            { no: 3, name: "compiler_version", kind: "message", T: () => Version }
        ]);
    }
    create(value?: PartialMessage<CodeGeneratorRequest>): CodeGeneratorRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.fileToGenerate = [];
        message.protoFile = [];
        message.sourceFileDescriptors = [];
        if (value !== undefined)
            reflectionMergePartial<CodeGeneratorRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: CodeGeneratorRequest): CodeGeneratorRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated string file_to_generate */ 1:
                    message.fileToGenerate.push(reader.string());
                    break;
                case /* optional string parameter */ 2:
                    message.parameter = reader.string();
                    break;
                case /* repeated google.protobuf.FileDescriptorProto proto_file */ 15:
                    message.protoFile.push(FileDescriptorProto.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* repeated google.protobuf.FileDescriptorProto source_file_descriptors */ 17:
                    message.sourceFileDescriptors.push(FileDescriptorProto.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* optional google.protobuf.compiler.Version compiler_version */ 3:
                    message.compilerVersion = Version.internalBinaryRead(reader, reader.uint32(), options, message.compilerVersion);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: CodeGeneratorRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* repeated string file_to_generate = 1; */
        for (let i = 0; i < message.fileToGenerate.length; i++)
            writer.tag(1, WireType.LengthDelimited).string(message.fileToGenerate[i]);
        /* optional string parameter = 2; */
        if (message.parameter !== undefined)
            writer.tag(2, WireType.LengthDelimited).string(message.parameter);
        /* repeated google.protobuf.FileDescriptorProto proto_file = 15; */
        for (let i = 0; i < message.protoFile.length; i++)
            FileDescriptorProto.internalBinaryWrite(message.protoFile[i], writer.tag(15, WireType.LengthDelimited).fork(), options).join();
        /* repeated google.protobuf.FileDescriptorProto source_file_descriptors = 17; */
        for (let i = 0; i < message.sourceFileDescriptors.length; i++)
            FileDescriptorProto.internalBinaryWrite(message.sourceFileDescriptors[i], writer.tag(17, WireType.LengthDelimited).fork(), options).join();
        /* optional google.protobuf.compiler.Version compiler_version = 3; */
        if (message.compilerVersion)
            Version.internalBinaryWrite(message.compilerVersion, writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message google.protobuf.compiler.CodeGeneratorRequest
 */
export const CodeGeneratorRequest = new CodeGeneratorRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class CodeGeneratorResponse$Type extends MessageType<CodeGeneratorResponse> {
    constructor() {
        super("google.protobuf.compiler.CodeGeneratorResponse", [
            { no: 1, name: "error", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "supported_features", kind: "scalar", opt: true, T: 4 /*ScalarType.UINT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 3, name: "minimum_edition", kind: "scalar", opt: true, T: 5 /*ScalarType.INT32*/ },
            { no: 4, name: "maximum_edition", kind: "scalar", opt: true, T: 5 /*ScalarType.INT32*/ },
            { no: 15, name: "file", kind: "message", repeat: 2 /*RepeatType.UNPACKED*/, T: () => CodeGeneratorResponse_File }
        ]);
    }
    create(value?: PartialMessage<CodeGeneratorResponse>): CodeGeneratorResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.file = [];
        if (value !== undefined)
            reflectionMergePartial<CodeGeneratorResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: CodeGeneratorResponse): CodeGeneratorResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* optional string error */ 1:
                    message.error = reader.string();
                    break;
                case /* optional uint64 supported_features */ 2:
                    message.supportedFeatures = reader.uint64().toBigInt();
                    break;
                case /* optional int32 minimum_edition */ 3:
                    message.minimumEdition = reader.int32();
                    break;
                case /* optional int32 maximum_edition */ 4:
                    message.maximumEdition = reader.int32();
                    break;
                case /* repeated google.protobuf.compiler.CodeGeneratorResponse.File file */ 15:
                    message.file.push(CodeGeneratorResponse_File.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: CodeGeneratorResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* optional string error = 1; */
        if (message.error !== undefined)
            writer.tag(1, WireType.LengthDelimited).string(message.error);
        /* optional uint64 supported_features = 2; */
        if (message.supportedFeatures !== undefined)
            writer.tag(2, WireType.Varint).uint64(message.supportedFeatures);
        /* optional int32 minimum_edition = 3; */
        if (message.minimumEdition !== undefined)
            writer.tag(3, WireType.Varint).int32(message.minimumEdition);
        /* optional int32 maximum_edition = 4; */
        if (message.maximumEdition !== undefined)
            writer.tag(4, WireType.Varint).int32(message.maximumEdition);
        /* repeated google.protobuf.compiler.CodeGeneratorResponse.File file = 15; */
        for (let i = 0; i < message.file.length; i++)
            CodeGeneratorResponse_File.internalBinaryWrite(message.file[i], writer.tag(15, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message google.protobuf.compiler.CodeGeneratorResponse
 */
export const CodeGeneratorResponse = new CodeGeneratorResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class CodeGeneratorResponse_File$Type extends MessageType<CodeGeneratorResponse_File> {
    constructor() {
        super("google.protobuf.compiler.CodeGeneratorResponse.File", [
            { no: 1, name: "name", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "insertion_point", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 15, name: "content", kind: "scalar", opt: true, T: 9 /*ScalarType.STRING*/ },
            { no: 16, name: "generated_code_info", kind: "message", T: () => GeneratedCodeInfo }
        ]);
    }
    create(value?: PartialMessage<CodeGeneratorResponse_File>): CodeGeneratorResponse_File {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<CodeGeneratorResponse_File>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: CodeGeneratorResponse_File): CodeGeneratorResponse_File {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* optional string name */ 1:
                    message.name = reader.string();
                    break;
                case /* optional string insertion_point */ 2:
                    message.insertionPoint = reader.string();
                    break;
                case /* optional string content */ 15:
                    message.content = reader.string();
                    break;
                case /* optional google.protobuf.GeneratedCodeInfo generated_code_info */ 16:
                    message.generatedCodeInfo = GeneratedCodeInfo.internalBinaryRead(reader, reader.uint32(), options, message.generatedCodeInfo);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: CodeGeneratorResponse_File, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* optional string name = 1; */
        if (message.name !== undefined)
            writer.tag(1, WireType.LengthDelimited).string(message.name);
        /* optional string insertion_point = 2; */
        if (message.insertionPoint !== undefined)
            writer.tag(2, WireType.LengthDelimited).string(message.insertionPoint);
        /* optional string content = 15; */
        if (message.content !== undefined)
            writer.tag(15, WireType.LengthDelimited).string(message.content);
        /* optional google.protobuf.GeneratedCodeInfo generated_code_info = 16; */
        if (message.generatedCodeInfo)
            GeneratedCodeInfo.internalBinaryWrite(message.generatedCodeInfo, writer.tag(16, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message google.protobuf.compiler.CodeGeneratorResponse.File
 */
export const CodeGeneratorResponse_File = new CodeGeneratorResponse_File$Type();
