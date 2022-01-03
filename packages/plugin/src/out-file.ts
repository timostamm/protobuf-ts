import {
    DescriptorRegistry,
    FileDescriptorProto,
    FileDescriptorProtoFields,
    GeneratedFile,
    TypescriptFile,
} from "@protobuf-ts/plugin-framework";
import {InternalOptions} from "./our-options";


/**
 * A protobuf-ts output file.
 */
export class OutFile extends TypescriptFile implements GeneratedFile {


    constructor(
        name: string,
        public readonly fileDescriptor: FileDescriptorProto,
        private readonly registry: DescriptorRegistry,
        private readonly options: InternalOptions,
    ) {
        super(name);
    }


    getContent(): string {
        if (this.isEmpty()) {
            return "";
        }
        let props = [];
        if (this.fileDescriptor.package) {
            props.push('package "' + this.fileDescriptor.package + '"');
        }
        props.push('syntax ' + (this.fileDescriptor.syntax ?? 'proto2'));
        const header = [
            `// @generated ${this.options.pluginCredit}`,
            `// @generated from protobuf file "${this.fileDescriptor.name}" (${props.join(', ')})`,
            `// tslint:disable`
        ];
        if (this.options.tsNoCheck) {
            header.push(`// @ts-nocheck`);
        }
        if (this.registry.isExplicitlyDeclaredDeprecated(this.fileDescriptor)) {
            header.push('// @deprecated');
        }
        [
            ...this.registry.sourceCodeComments(this.fileDescriptor, FileDescriptorProtoFields.syntax).leadingDetached,
            ...this.registry.sourceCodeComments(this.fileDescriptor, FileDescriptorProtoFields.package).leadingDetached
        ].every(block => header.push('//', ...block.split('\n').map(l => '//' + l), '//'));
        let head = header.join('\n');
        if (head.length > 0 && !head.endsWith('\n')) {
            head += '\n';
        }
        return head + super.getContent();
    }


}
