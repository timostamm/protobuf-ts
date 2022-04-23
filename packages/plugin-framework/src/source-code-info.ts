import {
    DescriptorProto,
    EnumDescriptorProto,
    EnumValueDescriptorProto,
    FieldDescriptorProto,
    FileDescriptorProto,
    MethodDescriptorProto,
    OneofDescriptorProto,
    ServiceDescriptorProto,
    SourceCodeInfo_Location
} from "./google/protobuf/descriptor";
import {AnyDescriptorProto} from "./descriptor-info";
import {DescriptorParentFn} from "./descriptor-tree";
import {assert} from "@protobuf-ts/runtime";


export interface ISourceCodeInfoLookup {


    /**
     * Return the comments for the given descriptor.
     *
     * If no comments found, empty (not undefined) object
     * is returned.
     *
     * Trailing newlines are removed.
     */
    sourceCodeComments(descriptor: AnyDescriptorProto): SourceCodeComment;

    /**
     * Return the comments for the specified element
     * of the file descriptor.
     */
    sourceCodeComments(file: FileDescriptorProto, field: FileDescriptorProtoFields): SourceCodeComment;


    /**
     * Return cursor position of the given element in the source
     * code as line number and column, both starting at 1.
     */
    sourceCodeCursor(descriptor: AnyDescriptorProto): SourceCodeCursor;

}


export class SourceCodeInfoLookup implements ISourceCodeInfoLookup {

    private readonly _parentResolver: DescriptorParentFn;

    constructor(parentResolver: DescriptorParentFn) {
        this._parentResolver = parentResolver;
    }

    sourceCodeCursor(descriptor: AnyDescriptorProto): SourceCodeCursor {
        const path = makeSourceCodePath(x => this._parentResolver(x), descriptor);
        assert(path !== undefined, `Cannot create source code path`);
        const all = this._findFile(descriptor).sourceCodeInfo?.location ?? [];
        const hit = filterSourceCodeLocations(all, path);
        return sourceCodeLocationToCursor(hit)
    }


    sourceCodeComments(file: FileDescriptorProto, field: FileDescriptorProtoFields): SourceCodeComment;
    sourceCodeComments(descriptor: AnyDescriptorProto): SourceCodeComment;
    sourceCodeComments(descriptorOrFile: FileDescriptorProto | AnyDescriptorProto, fileDescriptorFieldNumber?: FileDescriptorProtoFields): SourceCodeComment {
        const path = makeSourceCodePath(x => this._parentResolver(x), descriptorOrFile);
        assert(path !== undefined, `Cannot create source code path`);
        if (fileDescriptorFieldNumber !== undefined) {
            path.push(fileDescriptorFieldNumber)
        }
        const all = this._findFile(descriptorOrFile).sourceCodeInfo?.location ?? [];
        const hit = filterSourceCodeLocations(all, path);
        return sourceCodeLocationToComment(hit);
    }


    private _findFile(d: AnyDescriptorProto): FileDescriptorProto {
        let c: AnyDescriptorProto | undefined = d;
        while (c) {
            if (FileDescriptorProto.is(c)) {
                return c;
            }
            c = this._parentResolver(c);
        }
        assert(false);
    }

}


/**
 * Return cursor position of the given source code location
 * as line number and column, both starting at 1.
 *
 * If more than one location is given, only the first one
 * is evaluated, the others are discarded.
 */
export function sourceCodeLocationToCursor(locations: readonly SourceCodeInfo_Location[]): SourceCodeCursor {
    if (locations.length === 0) {
        return emptyCursor;
    }
    const span = locations[0].span;
    if (span === undefined || span.length < 3 || span.length > 4) {
        return emptyCursor;
    }
    return [
        span[0] + 1,
        span[1] + 1
    ];
}


/**
 * Represents line number and column within a source file,
 * both starting at 1.
 */
export type SourceCodeCursor = readonly [number, number] | typeof emptyCursor;

const emptyCursor = [undefined, undefined] as const;


/**
 * Return the comments for the given source code location.
 *
 * If more than one location is given, only the first one
 * is evaluated, the others are discarded.
 *
 * If no comments found, empty (not undefined) object
 * is returned.
 *
 * Trailing newlines are removed.
 */
export function sourceCodeLocationToComment(locations: readonly SourceCodeInfo_Location[]): SourceCodeComment {
    if (locations.length === 0) {
        return emptyComment;
    }

    const
        location = locations[0],
        leadingDetached = location.leadingDetachedComments.map(stripTrailingNewline),
        leadingComments = location.leadingComments,
        leading = leadingComments === ''
            ? undefined
            : (
                leadingComments === undefined
                    ? undefined
                    : stripTrailingNewline(leadingComments)
            ),
        trailingComments = location.trailingComments,
        trailing = trailingComments === ''
            ? undefined
            : (
                trailingComments === undefined
                    ? undefined
                    : stripTrailingNewline(trailingComments)
            );

    return (leadingDetached.length === 0 && leading === undefined && trailing === undefined)
        ? emptyComment
        : {leadingDetached, leading, trailing};
}

function stripTrailingNewline(block: string): string {
    return block.endsWith('\n')
        ? block.slice(0, -1)
        : block;
}

/**
 * Comments for a specific source code location.
 */
export type SourceCodeComment = {
    readonly leadingDetached: readonly string[];
    readonly leading: string | undefined;
    readonly trailing: string | undefined;
};

const emptyComment = {
    leadingDetached: [],
    leading: undefined,
    trailing: undefined,
}


/**
 * Find the source code locations that match the given path.
 */
export function filterSourceCodeLocations(locations: readonly SourceCodeInfo_Location[], path: readonly number[]): SourceCodeInfo_Location[] {
    return locations.filter(l => {
        const p = l.path;
        if (p.length !== path.length) {
            return false;
        }
        for (let i = 0; i < p.length; i++) {
            if (p[i] !== path[i]) {
                return false
            }
        }
        return true;
    });
}


/**
 * Create the path to the source code location where the
 * given element was declared.
 *
 * Returns `undefined` if we don't know how to make the path.
 *
 * For example, the path [4, 0, 2, 3] points to the 4th field
 * of the first message of a .proto file:
 *
 * file
 *  .messageType // FileDescriptorProto.message_type = 3;
 *  [0] // first message
 *  .field // FileDescriptorProto.field = 2;
 *  [3] // 4th field
 *
 * See https://github.com/protocolbuffers/protobuf/blob/f1ce8663ac88df54cf212d29ce5123b69203b135/src/google/protobuf/descriptor.proto#L799
 */
export function makeSourceCodePath(parentProvider: DescriptorParentFn, descriptor: AnyDescriptorProto): number[] | undefined {
    const path: number[] = [];
    let parent = parentProvider(descriptor);
    let component;
    while (parent) {
        component = makeSourceCodePathComponent(parent, descriptor);
        if (component === undefined) {
            return undefined;
        }
        path.unshift(...component);
        descriptor = parent;
        parent = parentProvider(parent);
    }
    return path;
}


/**
 * Make a path from the parent to the immediate child.
 *
 * Returns `undefined` if we don't know how to make the path.
 */
export function makeSourceCodePathComponent(parent: AnyDescriptorProto, child: AnyDescriptorProto): readonly [number, number] | undefined {
    if (FileDescriptorProto.is(parent) && DescriptorProto.is(child)) {
        return [
            FileDescriptorProtoFields.message_type,
            parent.messageType.indexOf(child)
        ];
    }
    if (FileDescriptorProto.is(parent) && EnumDescriptorProto.is(child)) {
        return [
            FileDescriptorProtoFields.enum_type,
            parent.enumType.indexOf(child)
        ];
    }
    if (FileDescriptorProto.is(parent) && ServiceDescriptorProto.is(child)) {
        return [
            FileDescriptorProtoFields.service,
            parent.service.indexOf(child)
        ];
    }
    if (DescriptorProto.is(parent) && EnumDescriptorProto.is(child)) {
        return [
            DescriptorProtoFields.enum_type,
            parent.enumType.indexOf(child)
        ];
    }
    if (DescriptorProto.is(parent) && DescriptorProto.is(child)) {
        return [
            DescriptorProtoFields.nested_type,
            parent.nestedType.indexOf(child)
        ];
    }
    if (DescriptorProto.is(parent) && FieldDescriptorProto.is(child)) {
        return [
            DescriptorProtoFields.field,
            parent.field.indexOf(child)
        ];
    }
    if (DescriptorProto.is(parent) && OneofDescriptorProto.is(child)) {
        return [
            DescriptorProtoFields.oneof_decl,
            parent.oneofDecl.indexOf(child)
        ];
    }
    if (EnumDescriptorProto.is(parent) && EnumValueDescriptorProto.is(child)) {
        return [
            EnumDescriptorProtoFields.value,
            parent.value.indexOf(child)
        ];
    }
    if (ServiceDescriptorProto.is(parent) && MethodDescriptorProto.is(child)) {
        return [
            ServiceDescriptorProtoFields.method,
            parent.method.indexOf(child)
        ];
    }
    return undefined;
}


export enum FileDescriptorProtoFields {
    syntax = 12, // optional string syntax = 12;
    package = 2, // optional string package = 2;
    message_type = 4, // repeated DescriptorProto message_type = 4;
    enum_type = 5, // repeated EnumDescriptorProto enum_type = 5;
    service = 6, // repeated ServiceDescriptorProto service = 6;
}

enum DescriptorProtoFields {
    field = 2, // repeated FieldDescriptorProto field = 2;
    nested_type = 3, // repeated DescriptorProto nested_type = 3;
    enum_type = 4, // repeated EnumDescriptorProto enum_type = 4;
    options = 7, // optional MessageOptions options = 7;
    oneof_decl = 8, // repeated OneofDescriptorProto oneof_decl = 8;
}

// enum FieldDescriptorProtoFields {
// name = 1, // optional string name = 1;
// number = 3, // optional int32 number = 3;
// label = 4, // optional Label label = 4;
// type = 5, // optional Type type = 5;
// }

enum EnumDescriptorProtoFields {
    // name = 1, // optional string name = 1;
    value = 2, // repeated EnumValueDescriptorProto value = 2;
    // options = 3, // optional EnumOptions options = 3;
}

enum ServiceDescriptorProtoFields {
    // name = 1, // optional string name = 1;
    method = 2, // repeated MethodDescriptorProto method = 2;
    // options = 3, // optional ServiceOptions options = 3;
}
