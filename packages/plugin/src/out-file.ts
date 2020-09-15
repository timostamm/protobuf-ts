import {
    DescriptorProto,
    DescriptorRegistry,
    EnumDescriptorProto,
    FileDescriptorProto,
    FileDescriptorProtoFields,
    GeneratedFile,
    ServiceDescriptorProto,
    SymbolTable,
    TypescriptFile,
    TypescriptImportManager,
} from "@protobuf-ts/plugin-framework";
import * as ts from "typescript";
import {Interpreter} from "./interpreter";
import {CommentGenerator} from "./code-gen/comment-generator";
import {ServiceClientGenerator} from "./code-gen/service-client-generator";
import {MessageInterfaceGenerator} from "./code-gen/message-interface-generator";
import {MessageTypeGenerator} from "./code-gen/message-type-generator";
import {EnumGenerator} from "./code-gen/enum-generator";
import {InternalOptions} from "./our-options";


/**
 * Generates a single .ts file for a .proto file.
 *
 * The generated code depends on the runtime.
 *
 * Renders messages as an interface and enums as
 * a union type.
 *
 * Sets up a runtime object for all messages to
 * expose read / write and other functionality.
 */
export class OutFile extends TypescriptFile implements GeneratedFile {


    private readonly serviceClientGenerator: ServiceClientGenerator;
    private readonly messageInterfaceGenerator: MessageInterfaceGenerator;
    private readonly messageTypeGenerator: MessageTypeGenerator;
    private readonly enumGenerator: EnumGenerator;


    constructor(
        public readonly fileDescriptor: FileDescriptorProto,
        private readonly registry: DescriptorRegistry,
        symbolTable: SymbolTable,
        private readonly interpreter: Interpreter,
        private readonly options: InternalOptions,
    ) {
        super(fileDescriptor.name!.replace('.proto', '.ts'));
        let imports = new TypescriptImportManager(this, symbolTable, this);
        let commentGenerator = new CommentGenerator(this.registry);
        this.serviceClientGenerator = new ServiceClientGenerator(this.registry, imports, this.interpreter, this.options);
        this.messageInterfaceGenerator = new MessageInterfaceGenerator(this.registry, imports, this.interpreter, commentGenerator, options);
        this.messageTypeGenerator = new MessageTypeGenerator(this.registry, imports, this.interpreter, commentGenerator, options)
        this.enumGenerator = new EnumGenerator(this.registry, imports, this.interpreter, commentGenerator);
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
        let header = [
            `// @generated ${this.options.pluginCredit}`,
            `// @generated from protobuf file "${this.fileDescriptor.name}" (${props.join(', ')})`,
            `// tslint:disable`
        ];
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


    generateMessageInterface(descriptor: DescriptorProto): ts.InterfaceDeclaration {
        return this.messageInterfaceGenerator.generateMessageInterface(descriptor, this);
    }


    generateMessageType(descriptor: DescriptorProto): void {
        this.messageTypeGenerator.generateMessageType(descriptor, this);
    }


    generateEnum(descriptor: EnumDescriptorProto): ts.EnumDeclaration {
        return this.enumGenerator.generateEnum(descriptor, this);
    }


    generateServiceClientInterface(descriptor: ServiceDescriptorProto): void {
        this.serviceClientGenerator.generateInterface(descriptor, this);
    }


    generateServiceClientImplementation(descriptor: ServiceDescriptorProto): void {
        this.serviceClientGenerator.generateImplementationClass(descriptor, this);
    }

}
