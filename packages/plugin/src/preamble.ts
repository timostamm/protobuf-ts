import {DescFile} from "@bufbuild/protobuf";
import {getPackageComments, getSyntaxComments} from "@bufbuild/protoplugin";

export function createPreamble(file: DescFile, opt?: {
    pluginCredit?: string;
    esLintDisable?: boolean;
    tsNoCheck?: boolean;
}): string {
    let props = [];
    if (file.proto.package.length > 0) {
        props.push('package "' + file.proto.package + '"');
    }
    props.push('syntax ' + (file.proto.syntax.length > 0 ? file.proto.syntax : 'proto2'));
    const header = []
    if (opt?.esLintDisable) {
        header.push(`/* eslint-disable */`);
    }
    header.push(...[
        `// @generated ${opt?.pluginCredit}`,
        `// @generated from protobuf file "${file.proto.name}" (${props.join(', ')})`,
        `// tslint:disable`
    ]);
    if (opt?.tsNoCheck) {
        header.push(`// @ts-nocheck`);
    }
    if (file.deprecated) {
        header.push('// @deprecated');
    }
    [
        ...getSyntaxComments(file).leadingDetached,
        ...getPackageComments(file).leadingDetached
    ].map(block => block.endsWith("\n") ? block.substring(0, block.length - 1) : block)
        .every(block => header.push('//', ...block.split('\n').map(l => '//' + l), '//'));
    let head = header.join('\n');
    if (head.length > 0 && !head.endsWith('\n')) {
        head += '\n';
    }
    return head;
}