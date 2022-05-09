import {
    DescriptorProto,
    EnumDescriptorProto,
    EnumOptions,
    EnumValueDescriptorProto,
    EnumValueOptions,
    FieldDescriptorProto,
    FieldOptions,
    FileDescriptorProto,
    FileOptions,
    MessageOptions,
    MethodDescriptorProto,
    MethodOptions,
    OneofDescriptorProto,
    OneofOptions,
    ServiceDescriptorProto,
    ServiceOptions
} from "./google/protobuf/descriptor";
import {AnyDescriptorProto, AnyOptions, AnyTypeDescriptorProto, isAnyTypeDescriptorProto} from "./descriptor-info";
import {assert, assertNever} from "@chippercash/protobuf-runtime";


/**
 * Return the logical parent of the given descriptor.
 *
 * If there is no parent, return `undefined`. This should
 * only be the case for `FileDescriptorProto`.
 */
export type DescriptorParentFn = (descriptor: AnyDescriptorProto) => AnyDescriptorProto | undefined;


/**
 * Can lookup the ancestry of a descriptor.
 */
export interface IDescriptorTree {


    /**
     * Lists known files.
     */
    allFiles(): readonly FileDescriptorProto[];


    /**
     * Return the immediate parent of the given descriptor.
     *
     * Returns `undefined` for a file descriptor.
     *
     * Returns the parent descriptor for an option.
     */
    parentOf(descriptor: FieldDescriptorProto): DescriptorProto;

    parentOf(descriptor: AnyDescriptorProto): AnyDescriptorProto | undefined;

    parentOf(options: FileOptions): FileDescriptorProto;

    parentOf(options: MessageOptions): DescriptorProto;

    parentOf(options: FieldOptions): FileDescriptorProto;

    parentOf(options: OneofOptions): OneofDescriptorProto;

    parentOf(options: EnumOptions): FieldDescriptorProto;

    parentOf(options: EnumValueOptions): EnumValueDescriptorProto;

    parentOf(options: ServiceOptions): ServiceDescriptorProto;

    parentOf(options: MethodOptions): MethodDescriptorProto;


    /**
     * Return the file where the descriptor was declared.
     *
     * If a file descriptor is passed, returns the
     * file descriptor itself.
     */
    fileOf(descriptor: AnyDescriptorProto): FileDescriptorProto;

    /**
     * Returns all ancestors of the given descriptor, up to
     * the file descriptor where the descriptor was declared.
     */
    ancestorsOf(descriptor: AnyDescriptorProto): AnyDescriptorProto[];

    /**
     * Visit all known descriptors and all their descendants.
     */
    visit(visitor: (descriptor: AnyDescriptorProto) => void): void;

    /**
     * Visit all descendants of the given descriptor.
     */
    visit(startingFrom: AnyDescriptorProto, visitor: (descriptor: AnyDescriptorProto) => void): void;

    /**
     * Visit all known type descriptors and their
     * descendant types.
     */
    visitTypes(visitor: (descriptor: AnyTypeDescriptorProto) => void): void;

    /**
     * Visit the type children of the descriptor
     * and their descendant types.
     */
    visitTypes(startingFrom: AnyDescriptorProto, visitor: (descriptor: AnyTypeDescriptorProto) => void): void;

}


export class DescriptorTree implements IDescriptorTree {

    private readonly _files: ReadonlyArray<FileDescriptorProto>;
    private readonly _descriptors: ReadonlyMap<AnyDescriptorProto, Entry>;
    private readonly _options: ReadonlyMap<AnyOptions, AnyDescriptorProto>;


    /**
     * Create the tree from a list of root files.
     */
    static from(...files: FileDescriptorProto[]): DescriptorTree {
        const descriptors: Array<[AnyDescriptorProto, Entry]> = [];
        const options: Array<[AnyOptions, AnyDescriptorProto]> = [];
        for (const file of files) {
            visitDescriptorTree(file, (descriptor, ancestors) => {
                descriptors.push([descriptor, {ancestors, file, parent: ancestors[ancestors.length - 1]}]);
                if (descriptor.options) {
                    options.push([descriptor.options, descriptor]);
                }
            });
        }
        return new DescriptorTree(descriptors, options);
    }


    private constructor(descriptors: ReadonlyArray<[AnyDescriptorProto, Entry]>, options: ReadonlyArray<[AnyOptions, AnyDescriptorProto]>) {
        const descriptorMap = new Map<AnyDescriptorProto, Entry>();
        const optionMap = new Map<AnyOptions, AnyDescriptorProto>();
        const files = [];
        for (const [descriptor, info] of descriptors) {

            // infos
            assert(!descriptorMap.has(descriptor));
            descriptorMap.set(descriptor, info);

            // files
            if (FileDescriptorProto.is(descriptor)) {
                files.push(descriptor);
            }
        }
        for (const [option, descriptor] of options) {
            optionMap.set(option, descriptor);
        }
        this._files = files;
        this._descriptors = descriptorMap;
        this._options = optionMap;
    }


    ancestorsOf(descriptor: AnyDescriptorProto): AnyDescriptorProto[] {
        const v = this._descriptors.get(descriptor);
        assert(v !== undefined);
        return v.ancestors.concat();
    }

    fileOf(descriptor: AnyDescriptorProto): FileDescriptorProto {
        const v = this._descriptors.get(descriptor);
        assert(v !== undefined);
        return v.file;
    }

    allFiles(): readonly FileDescriptorProto[] {
        return this._files;
    }

    parentOf(descriptor: FieldDescriptorProto): DescriptorProto;
    parentOf(descriptor: AnyDescriptorProto): AnyDescriptorProto | undefined;
    parentOf(options: FileOptions): FileDescriptorProto;
    parentOf(options: MessageOptions): DescriptorProto;
    parentOf(options: FieldOptions): FileDescriptorProto;
    parentOf(options: OneofOptions): OneofDescriptorProto;
    parentOf(options: EnumOptions): FieldDescriptorProto;
    parentOf(options: EnumValueOptions): EnumValueDescriptorProto;
    parentOf(options: ServiceOptions): ServiceDescriptorProto;
    parentOf(options: MethodOptions): MethodDescriptorProto;
    parentOf(descriptorOrOptions: AnyDescriptorProto | AnyOptions): AnyDescriptorProto | undefined {
        const optionParent = this._options.get(descriptorOrOptions as any);
        if (optionParent) {
            return optionParent;
        }
        const descriptorEntry = this._descriptors.get(descriptorOrOptions as any);
        if (descriptorEntry) {
            return descriptorEntry.parent;
        }
        assert(FileDescriptorProto.is(descriptorOrOptions));
        return undefined;
    }


    visit(visitor: (descriptor: AnyDescriptorProto) => void): void;
    visit(startingFrom: AnyDescriptorProto, visitor: (descriptor: AnyDescriptorProto) => void): void;
    visit(a: any, b?: any) {
        if (b === undefined) {
            for (const file of this._files) {
                visitDescriptorTree(file, a);
            }
        } else {
            const startingFrom = a as AnyDescriptorProto;
            visitDescriptorTree(startingFrom, descriptor => {
                if (descriptor === a) {
                    return; // visitDescriptorTree invokes on starting element. ignore.
                }
                b(descriptor)
            });
        }
    }


    visitTypes(visitor: (descriptor: AnyTypeDescriptorProto) => void): void;
    visitTypes(startingFrom: AnyDescriptorProto, visitor: (descriptor: AnyTypeDescriptorProto) => void): void;
    visitTypes(a: any, b?: any): void {
        if (b === undefined) {
            for (const file of this._files) {
                visitDescriptorTree(file, descriptor => {
                    if (isAnyTypeDescriptorProto(descriptor)) {
                        a(descriptor);
                    }
                });
            }
        } else {
            visitDescriptorTree(a, descriptor => {
                if (descriptor === a) {
                    return; // visitDescriptorTree invokes on starting element. ignore.
                }
                if (isAnyTypeDescriptorProto(descriptor)) {
                    b(descriptor);
                }
            });
        }
    }


}

type Entry = {
    readonly ancestors: readonly AnyDescriptorProto[],
    readonly parent: AnyDescriptorProto | undefined,
    readonly file: FileDescriptorProto,
};


type VisitorFn = (descriptor: AnyDescriptorProto, carry: readonly AnyDescriptorProto[]) => void;


/**
 * Visit all logical children of the given descriptor proto.
 *
 * The "visitor" function is called for each element,
 * including the input. It receives two arguments:
 * 1) the current descriptor proto
 * 2) the ancestors of the current descriptor proto (an array of descriptors)
 */
export function visitDescriptorTree(input: AnyDescriptorProto, visitor: VisitorFn): void {
    visitWithCarry(input, [], visitor);
}

function visitWithCarry(input: AnyDescriptorProto, carry: readonly AnyDescriptorProto[], visitor: VisitorFn): void {
    visitor(input, carry);
    carry = carry.concat(input);

    // noinspection SuspiciousTypeOfGuard

    if (EnumDescriptorProto.is(input)) {
        for (const val of input.value) {
            visitWithCarry(val, carry, visitor);
        }
    } else if (DescriptorProto.is(input)) {
        for (const oneof of input.oneofDecl) {
            visitWithCarry(oneof, carry, visitor);
        }
        for (const field of input.field) {
            visitWithCarry(field, carry, visitor);
        }
        for (const message of input.nestedType) {
            visitWithCarry(message, carry, visitor);
        }
        for (const enu of input.enumType) {
            visitWithCarry(enu, carry, visitor);
        }
        for (const extensionField of input.extension) {
            visitWithCarry(extensionField, carry, visitor);
        }
    } else if (FileDescriptorProto.is(input)) {
        for (const message of input.messageType) {
            visitWithCarry(message, carry, visitor);
        }
        for (const enu of input.enumType) {
            visitWithCarry(enu, carry, visitor);
        }
        for (const service of input.service) {
            visitWithCarry(service, carry, visitor);
        }
        for (const extensionField of input.extension) {
            visitWithCarry(extensionField, carry, visitor);
        }
    } else if (ServiceDescriptorProto.is(input)) {
        for (const method of input.method) {
            visitWithCarry(method, carry, visitor);
        }
    } else if (EnumValueDescriptorProto.is(input)) {
        //
    } else if (FieldDescriptorProto.is(input)) {
        //
    } else if (MethodDescriptorProto.is(input)) {
        //
    } else if (OneofDescriptorProto.is(input)) {
        //
    } else {
        assertNever(input);
    }
}
