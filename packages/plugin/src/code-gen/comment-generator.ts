import * as ts from "typescript";
import {AnyDesc, DescComments} from "@bufbuild/protobuf";
import {getComments, getDeclarationString} from "@bufbuild/protoplugin";
import {addCommentBlocksAsLeadingDetachedLines, addCommentBlockAsJsDoc} from "../framework/typescript-comments";


export class CommentGenerator {


    constructor() {
    }

    /**
     * Adds comments from the .proto as a JSDoc block.
     *
     * Looks up comments for the given descriptor in
     * the source code info.
     *
     * Adds `@deprecated` tag if the element is
     * marked deprecated. Also adds @deprecated if
     * the descriptor is a type (enum, message) and
     * the entire .proto file is marked deprecated.
     *
     * Adds `@generated` tag with source code
     * information.
     *
     * Leading detached comments are added as line
     * comments in front of the JSDoc block.
     *
     * Trailing comments are a bit weird. For .proto
     * enums and messages, they sit between open
     * bracket and first member. A message seems to
     * only ever have a trailing comment if it is
     * empty. For a simple solution, trailing
     * comments on enums and messages should simply
     * be appended to the leading block so that the
     * information is not discarded.
     */
    addCommentsForDescriptor(node: ts.Node, descriptor: AnyDesc, trailingCommentsMode: 'appendToLeadingBlock' | 'trailingLines'): void {
        if (descriptor.kind == "file") {
            return;
        }
        const source = this.getComments(descriptor);

        // add leading detached comments as line comments
        addCommentBlocksAsLeadingDetachedLines(node, ...source.leadingDetached);

        // start with leading block
        let leading = this.getCommentBlock(descriptor, trailingCommentsMode === "appendToLeadingBlock");

        // add leading block as jsdoc comment block
        addCommentBlockAsJsDoc(node, leading);

        // add trailing comments as trailing line comments
        if (source.trailing && trailingCommentsMode === 'trailingLines') {
            let lines = source.trailing.split('\n').map(l => l[0] !== ' ' ? ` ${l}` : l);
            for (let line of lines) {
                ts.addSyntheticTrailingComment(node, ts.SyntaxKind.SingleLineCommentTrivia, line, true);
            }
        }
    }

    private getComments(desc: AnyDesc): Omit<DescComments, "sourcePath"> {
        if (desc.kind == "file") {
            return {
                leadingDetached: [],
            };
        }
        const comments = getComments(desc);
        return {
            leading: comments.leading !== undefined ? this.stripTrailingNewlines(comments.leading) : comments.leading,
            trailing: comments.trailing !== undefined ? this.stripTrailingNewlines(comments.trailing) : comments.trailing,
            leadingDetached: comments.leadingDetached.map(t => this.stripTrailingNewlines(t)),
        }
    }

    private stripTrailingNewlines(block: string): string {
        return block.endsWith('\n')
            ? block.slice(0, -1)
            : block;
    }

    /**
     * Returns a block of source comments (no leading detached!),
     * with @generated tags and @deprecated tag (if applicable).
     */
    getCommentBlock(descriptor: AnyDesc, appendTrailingComments = false): string {
        if (descriptor.kind == "file") {
            return "";
        }
        const source = this.getComments(descriptor);

        // start with leading block
        let commentBlock = source.leading ?? '';

        // add trailing comments to the leading block
        if (source.trailing && appendTrailingComments) {
            if (commentBlock.length > 0) {
                commentBlock += '\n\n';
            }
            commentBlock += source.trailing;
        }

        // if there were any leading comments, we need some space
        if (commentBlock.length > 0) {
            commentBlock += '\n\n'
        }

        // add deprecated information to the leading block
        if (CommentGenerator.isDeprecated(descriptor)) {
            commentBlock += '@deprecated\n';
        }

        // add source info to the leading block
        commentBlock += this.makeGeneratedTag(descriptor);

        return commentBlock;
    }

    /**
     * Creates string like "@generated from protobuf field: string foo = 1;"
     */
    makeGeneratedTag(desc: AnyDesc) {
        switch (desc.kind) {
            case "oneof":
                return `@generated from protobuf oneof: ${desc.name}`;
            case "enum_value":
                return `@generated from protobuf enum value: ${getDeclarationString(desc)};`;
            case "field":
                return `@generated from protobuf field: ${getDeclarationString(desc)}`;
            case "extension":
                return `@generated from protobuf extension: ${getDeclarationString(desc)}`;
            case "rpc":
                // TODO see StringFormat.formatRpcDeclaration
                return `@generated from protobuf rpc: ${desc.name}`;
            case "message":
            case "enum":
            case "service":
            case "file":
                return `@generated from protobuf ${desc.toString()}`;
        }
    }

    /**
     * Returns "@deprecated\n" if explicitly deprecated.
     * For top level types, also returns "@deprecated\n" if entire file is deprecated.
     * Otherwise, returns "".
     */
    makeDeprecatedTag(desc: AnyDesc) {
        if (CommentGenerator.isDeprecated(desc)) {
            return '@deprecated\n';
        }
        return '';
    }


    private static isDeprecated(desc: AnyDesc) {
        if (desc.kind == "file") {
            return false;
        }
        if (desc.deprecated) {
            return true;
        }
        switch (desc.kind) {
            case "enum":
            case "service":
            case "message":
            case "extension":
                return desc.file.deprecated;
            case "field":
            case "rpc":
            case "enum_value":
            case "oneof":
                return desc.parent.file.deprecated;
        }
    }

}
