import {MergeOptions} from "./merge-options";
import {mergeFromFieldValue} from './reflection-merge-partial';
import type {IMessageType, PartialMessage} from "./message-type-contract";
import type {MessageInfo} from "./reflection-info";
import type {UnknownMessage, UnknownOneofGroup} from "./unknown-types";

export interface FieldMaskLike {
    paths: string[];
}

type ReadonlyPaths = ReadonlyArray<string>;

interface ReadonlyFieldMaskLike {
    readonly paths: ReadonlyPaths;
}

type FieldMaskOrPaths = ReadonlyFieldMaskLike | ReadonlyPaths | string;

type FieldMaskTreeNode = Map<string, FieldMaskTreeNode>;

function isPaths(mask: ReadonlyFieldMaskLike | ReadonlyPaths): mask is ReadonlyPaths {
    return Array.isArray(mask);
}

function getPaths(mask: FieldMaskOrPaths): string[] {
    const paths = typeof mask === 'string'
        ? mask.split(',')
        : isPaths(mask)
        ? mask
        : mask.paths;
    return paths.filter(Boolean);
}

/** Returns FieldMask from a: string, string array, or FieldMask */
export function fieldMaskFrom<T extends FieldMaskLike = FieldMaskLike>(mask: FieldMaskOrPaths, target?: T): T;
export function fieldMaskFrom(mask: FieldMaskOrPaths, target: FieldMaskLike = {paths: []}): FieldMaskLike {
    target.paths.length = 0;
    target.paths.push(...getPaths(mask));
    return target;
}

export function fieldMaskFromFieldNumbers<T extends FieldMaskLike = FieldMaskLike>(messageType: MessageInfo, fiNumbers: ReadonlyArray<number>, target?: T): T;
export function fieldMaskFromFieldNumbers(messageType: MessageInfo, fiNumbers: ReadonlyArray<number>, target: FieldMaskLike = {paths: []}): FieldMaskLike {
    target.paths.length = 0;
    const {fields, typeName} = messageType;
    for (const no of fiNumbers) {
        const field = fields.find((fi) => fi.no === no)
        if (!field)
            throw new TypeError(`Cannot find field number ${no} in message type ${typeName}.`);
        target.paths.push(field.name);
    }
    return target;
}

/** Checks whether the FieldMask is valid for MessageInfo */
export function fieldMaskIsValid(messageType: MessageInfo, mask: FieldMaskOrPaths): boolean {
    for (const path of getPaths(mask))
        if (!isValidPath(messageType, path))
            return false;
    return true;
}

/** Gets all direct fields of MessageInfo to FieldMask. */
export function fieldMaskFromMessageType<T extends FieldMaskLike = FieldMaskLike>({fields}: MessageInfo, target?: T): T;
export function fieldMaskFromMessageType({fields}: MessageInfo, target: FieldMaskLike = {paths: []}): FieldMaskLike {
    target.paths.length = 0;
    for (const field of fields)
        target.paths.push(field.name);
    return target;
}

/**
 * Converts a FieldMask to the canonical form.
 * 
 * Removes paths that are covered by another path. For example,
 * "foo.bar" is covered by "foo" and will be removed if "foo"
 * is also in the FieldMask. Then sorts all paths in alphabetical order.
 */
export function fieldMaskCanonicalForm<T extends FieldMaskLike = FieldMaskLike>(mask: FieldMaskLike, target?: T): T {
    return new FieldMaskTree(mask).toFieldMask(target);
}

/** Merges mask1 and mask2 into a target FieldMask */
export function fieldMaskUnion<T extends FieldMaskLike = FieldMaskLike>(mask1: FieldMaskOrPaths, mask2: FieldMaskOrPaths, target?: T): T {
    return new FieldMaskTree(mask1).mergeFromFieldMask(mask2).toFieldMask(target);
}

/** Intersects mask1 and mask2 into a target FieldMask */
export function fieldMaskIntersect<T extends FieldMaskLike = FieldMaskLike>(mask1: FieldMaskOrPaths, mask2: FieldMaskOrPaths, target?: T): T {
    const tree = new FieldMaskTree(mask1);
    const intersection = new FieldMaskTree();
    for (const path of getPaths(mask2))
        tree.intersectPath(path, intersection);
    return intersection.toFieldMask(target);
}

/**
 * Merges fields specified in FieldMask from source to target.
 * Note that this merge behavior is different from protobuf-ts's
 * MessageType.mergePartial() or reflectionMergePartial().
 * By default it follows the canonical protobuf behavior of
 * appending repeated fields instead of replacing them.
 */
export function fieldMaskMergeMessage<
    T extends object = object,
    M extends MessageInfo = MessageInfo
>(
    mask: FieldMaskOrPaths,
    messageType: M extends IMessageType<object> ? M extends IMessageType<T> ? M : never : MessageInfo,
    target: T,
    source: PartialMessage<T>,
    mergeOptions?: MergeOptions
): T {
    new FieldMaskTree(mask).mergeMessage(messageType, target, source, mergeOptions);
    return target;
}

export const fieldMaskUtils = {
    /**
     * Converts a FieldMask to the canonical form.
     * 
     * Removes paths that are covered by another path. For example,
     * "foo.bar" is covered by "foo" and will be removed if "foo"
     * is also in the FieldMask. Then sorts all paths in alphabetical order.
     */
    canonicalForm: fieldMaskCanonicalForm,
    /** Returns FieldMask from a: string, string array, or FieldMask */
    from: fieldMaskFrom,
    fromFieldNumbers: fieldMaskFromFieldNumbers,
    /** Gets all direct fields of MessageInfo to FieldMask. */
    fromMessageType: fieldMaskFromMessageType,
    /** Intersects mask1 and mask2 into a target FieldMask */
    intersect: fieldMaskIntersect,
    /** Checks whether the FieldMask is valid for MessageInfo */
    isValid: fieldMaskIsValid,
    /**
     * Merges fields specified in FieldMask from source to target.
     * Note that this merge behavior is different from protobuf-ts's
     * MessageType.mergePartial() or reflectionMergePartial().
     * By default it follows the canonical protobuf behavior of
     * appending repeated fields instead of replacing them.
     */
    mergeMessage: fieldMaskMergeMessage,
    /** Merges mask1 and mask2 into a target FieldMask */
    union: fieldMaskUnion,
};

/**
 * Represents a FieldMask in a tree structure. Each leaf
 * node in this tree represent a field path in the FieldMask.
 * For example, given a FieldMask `"foo.bar,foo.baz,bar.baz"`,
 * the FieldMaskTree will be:
 * ```
 *   [root] -+- foo -+- bar
 *           |       |
 *           |       +- baz
 *           |
 *           +- bar --- baz
 * ```
 */
class FieldMaskTree {
    private root: FieldMaskTreeNode = new Map();

    constructor(fieldMask?: FieldMaskOrPaths) {
        if (fieldMask)
            this.mergeFromFieldMask(fieldMask);
    }

    /** Merges a FieldMask to the tree. */
    mergeFromFieldMask(fieldMask: FieldMaskOrPaths): this {
        for (const path of getPaths(fieldMask).sort())
            this.addPath(path);
        return this;
    }

    /**
     * Adds a field path into the tree.
     * 
     * If the field path to add is a sub-path of an existing field path
     * in the tree (i.e., a leaf node), it means the tree already matches
     * the given path so nothing will be added to the tree. If the path
     * matches an existing non-leaf node in the tree, that non-leaf node
     * will be turned into a leaf node with all its children removed because
     * the path matches all the node's children. Otherwise, a new path will
     * be added.
     */
    addPath(path: string): this {
        let node = this.root;
        for (const part of path.split('.')) {
            let nextNode = node.get(part);
            if (!nextNode)
                node.set(part, nextNode = new Map());
            else if (!nextNode.size)
                // Pre-existing empty node implies we already have this entire tree.
                return this;
            node = nextNode;
        }
        // Remove any sub-trees we might have had.
        node.clear();
        return this;
    }

    /** Converts the tree to a FieldMask. */
    toFieldMask<T extends FieldMaskLike = FieldMaskLike>(mask?: T): T;
    toFieldMask(mask: FieldMaskLike = {paths: []}): FieldMaskLike {
        mask.paths.length = 0;
        addFieldPaths(this.root, '', mask);
        return mask;
    }

    /** Calculates the intersection part of a field path with this tree. */
    intersectPath(path: string, intersection: FieldMaskTree): this {
        let node = this.root;
        for (const part of path.split('.')) {
            let nextNode = node.get(part);
            if (!nextNode)
                return this;
            else if (!nextNode.size) {
                intersection.addPath(path);
                return this;
            }
            node = nextNode;
        }
        intersection.addLeafNodes(path, node);
        return this;
    }

    /** Adds leaf nodes begin with prefix to this tree. */
    addLeafNodes(prefix: string, node: FieldMaskTreeNode): this {
        if (!node.size)
            this.addPath(prefix);
        for (const [name, nextNode] of node)
            this.addLeafNodes(`${prefix}.${name}`, nextNode);
        return this;
    }

    /** Merge all fields specified by this tree from source to target. */
    mergeMessage<T extends object = object>(
        messageType: MessageInfo,
        target: T,
        source: PartialMessage<T>,
        mergeOptions: MergeOptions = {},
    ): this {
        mergeMessageIntoTree(
            this.root,
            messageType,
            target,
            source,
            // Use the canonical protobuf merge options
            // (append instead of replace for repeated)
            {repeated: MergeOptions.Repeated.APPEND, ...mergeOptions}
        )
        return this;
    }
}



/** Merge all fields specified by a sub-tree from source to target. */
function mergeMessageIntoTree<T extends object = object>(
    node: FieldMaskTreeNode,
    messageType: MessageInfo,
    target: T,
    source: PartialMessage<T>,
    maybeMergeOptions?: MergeOptions,
) {
    const
        {typeName, fields} = messageType,
        mergeOptions = MergeOptions.withDefaults(maybeMergeOptions);

    for (const [childName, child] of node) {
        const field = fields.find((fi) => fi.name === childName);
        if (!field)
            throw new TypeError(`Cannot find field ${childName} in message type ${typeName}.`);

        let name = field.localName,
            src: UnknownMessage | UnknownOneofGroup = source as UnknownMessage,
            out: UnknownMessage | UnknownOneofGroup = target as UnknownMessage;

        if (field.oneof) {
            let sourceGroup = (source as UnknownMessage)[field.oneof] as UnknownOneofGroup | undefined,
                targetGroup = (target as UnknownMessage)[field.oneof] as UnknownOneofGroup;
            if (sourceGroup?.oneofKind !== name)
                continue;
            delete targetGroup[targetGroup.oneofKind!];
            targetGroup.oneofKind = name;
            src = sourceGroup;
            out = targetGroup;
        }

        let fieldValue = src[name];
        
        if (child.size) {
            // Sub-paths are only allowed for singular message fields.
            if (field.repeat || field.kind !== 'message')
                throw new TypeError(`Field ${childName} in message ${typeName} ` +
                    `is not a singular message field and cannot have sub-fields.`);
            if (fieldValue != undefined) {
                const T = field.T();
                mergeMessageIntoTree(
                    child,
                    T,
                    (out[name] || (out[name] = T.create())) as UnknownMessage,
                    fieldValue as UnknownMessage,
                    mergeOptions
                );
            }
            continue;
        }

        mergeFromFieldValue(field, fieldValue, out, mergeOptions);
    }
}

/** Checks whether the path is valid for MessageInfo */
function isValidPath({fields}: MessageInfo, path: string): boolean {
    const parts = path.split('.');
    let last = parts.pop();
    for (const name of parts) {
        const field = fields.find((fi) => fi.name === name);
        if (!field || field.repeat || field.kind !== 'message')
            return false;
        fields = field.T().fields;
    }
    return fields.some((fi) => fi.name === last);
}

/** Adds the field paths descended from node to FieldMask. */
function addFieldPaths(node: FieldMaskTreeNode, prefix: string, mask: FieldMaskLike): void {
    if (!node.size && prefix)
        mask.paths.push(prefix);
    else
        for (const name of Array.from(node.keys()).sort())
            addFieldPaths(node.get(name)!, prefix ? `${prefix}.${name}` : name, mask);

}
