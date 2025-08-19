import {AnyDesc, DescFile} from "@bufbuild/protobuf";
import {getComments, getDeclarationString} from "@bufbuild/protoplugin";
import {createJsDocBlock} from "@bufbuild/protoplugin-print";
import {Printable} from "./printable";

export function trailingDoc(
    desc: Exclude<AnyDesc, DescFile>,
    opt?: {
        indentation?: string,
    },
): Printable {
    const comments = getComments(desc);
    const ret: Printable[] = [];
    if (!comments.trailing) {
        return ret;
    }
    const i = opt?.indentation ?? "";
    let comment = comments.trailing
    comment = comment.endsWith("\n")
        ? comment.slice(0, -1)
        : comment;
    const lines = comment
        .split("\n")
        .map((line, index) => `${index > 0 ? i : " "}//${line}`)
    ret.push(lines.join("\n"));
    return ret;
}

export function leadingDoc(
    desc: Exclude<AnyDesc, DescFile>,
    opt?: {
        indentation?: string,
        includeTrailingComments?: boolean;
    },
): Printable {
    const includeTrailingComments = opt?.includeTrailingComments ?? false;
    const comments = getComments(desc);
    const ret: Printable[] = [];

    for (let comment of comments.leadingDetached) {
        comment = comment.endsWith("\n")
            ? comment.slice(0, -1)
            : comment;
        comment = comment.split('\n')
            .map(l => l.startsWith(" ") ? l : ` ${l}`)
            .map(l => `${opt?.indentation ?? ""}//${l}`)
            .join("\n");
        ret.push(comment, "\n\n");
    }

    // start with leading block
    let block = "";
    if (comments.leading !== undefined) {
        block += comments.leading.endsWith("\n")
            ? comments.leading.slice(0, -1)
            : comments.leading;
    }

    // add trailing comments to the leading block
    if (comments.trailing && includeTrailingComments) {
        if (block.length > 0) {
            block += '\n\n';
        }
        block += comments.trailing.endsWith("\n")
            ? comments.trailing.slice(0, -1)
            : comments.trailing;
    }

    // if there were any leading comments, we need some space
    if (block.length > 0) {
        block += '\n\n'
    }

    // add deprecated information to the leading block
    block += makeDeprecatedTag(desc);

    // add source info to the leading block
    block += makeGeneratedTag(desc);

    block = block
        .split("\n")
        .map((line) => (line.startsWith(" ") ? line.substring(1) : line))
        .join("\n");

    ret.push(createJsDocBlock(block, opt?.indentation));

    return ret;
}

/**
 * Creates string like "@generated from protobuf field: string foo = 1;"
 */
function makeGeneratedTag(desc: AnyDesc) {
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
export function makeDeprecatedTag(desc: AnyDesc) {
    if (isDeprecated(desc)) {
        return '@deprecated\n';
    }
    return '';
}


function isDeprecated(desc: AnyDesc) {
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