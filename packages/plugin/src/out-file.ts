import {GeneratedFile, TypescriptFile} from "@protobuf-ts/plugin-framework";
import {InternalOptions} from "./our-options";
import {DescFile} from "@bufbuild/protobuf";
import {getPackageComments, getSyntaxComments} from "@bufbuild/protoplugin";


/**
 * A protobuf-ts output file.
 */
export class OutFile extends TypescriptFile implements GeneratedFile {


    private header: string | undefined;


    constructor(
        name: string,
        public readonly descFile: DescFile,
        private readonly options: InternalOptions,
    ) {
        super(name);
    }


    getContent(): string {
        if (this.isEmpty()) {
            return "";
        }
        return this.getHeader() + super.getContent();
    }


    getHeader(): string {
        if (this.isEmpty()) {
            return "";
        }
        if (!this.header) {
            this.header = this.makeHeader();
        }
        return this.header;
    }

    private makeHeader(): string {
        let props = [];
        if (this.descFile.proto.package.length > 0) {
            props.push('package "' + this.descFile.proto.package + '"');
        }
        props.push('syntax ' + (this.descFile.proto.syntax.length > 0 ? this.descFile.proto.syntax : 'proto2'));
        const header = []
        if (this.options.esLintDisable) {
            header.push(`/* eslint-disable */`);
        }
        header.push(...[
            `// @generated ${this.options.pluginCredit}`,
            `// @generated from protobuf file "${this.descFile.proto.name}" (${props.join(', ')})`,
            `// tslint:disable`
        ]);
        if (this.options.tsNoCheck) {
            header.push(`// @ts-nocheck`);
        }
        if (this.descFile.deprecated) {
            header.push('// @deprecated');
        }
        [
            ...getSyntaxComments(this.descFile).leadingDetached,
            ...getPackageComments(this.descFile).leadingDetached
        ].map(block => block.endsWith("\n") ? block.substring(0, block.length - 1) : block)
         .every(block => header.push('//', ...block.split('\n').map(l => '//' + l), '//'));
        let head = header.join('\n');
        if (head.length > 0 && !head.endsWith('\n')) {
            head += '\n';
        }
        return head;
    }


}
