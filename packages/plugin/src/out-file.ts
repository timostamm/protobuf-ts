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
import * as rpc from "@protobuf-ts/runtime-rpc";
import {Interpreter} from "./interpreter";
import {CommentGenerator} from "./code-gen/comment-generator";
import {ServiceClientGeneratorBase} from "./code-gen/service-client-generator-base";
import {MessageInterfaceGenerator} from "./code-gen/message-interface-generator";
import {MessageTypeGenerator} from "./code-gen/message-type-generator";
import {EnumGenerator} from "./code-gen/enum-generator";
import {InternalOptions} from "./our-options";
import {ServiceTypeGenerator} from "./code-gen/service-type-generator";
import {ServiceClientGeneratorCall} from "./code-gen/service-client-generator-call";
import {ServiceClientGeneratorPromise} from "./code-gen/service-client-generator-promise";
import {ServiceClientGeneratorRxjs} from "./code-gen/service-client-generator-rxjs";
import {assert} from "@protobuf-ts/runtime";
import {ServiceServerGeneratorGrpc} from "./code-gen/service-server-generator-grpc";


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


    private readonly serviceTypeGenerator: ServiceTypeGenerator;
    private readonly serviceClientGenerators: ServiceClientGeneratorBase[];
    private readonly serviceServerGeneratorGrpc: ServiceServerGeneratorGrpc;
    private readonly messageInterfaceGenerator: MessageInterfaceGenerator;
    private readonly messageTypeGenerator: MessageTypeGenerator;
    private readonly enumGenerator: EnumGenerator;


    constructor(
        name: string,
        public readonly fileDescriptor: FileDescriptorProto,
        private readonly registry: DescriptorRegistry,
        symbolTable: SymbolTable,
        private readonly interpreter: Interpreter,
        private readonly options: InternalOptions,
    ) {
        super(name);
        let imports = new TypescriptImportManager(this, symbolTable, this);
        let commentGenerator = new CommentGenerator(this.registry);
        this.serviceTypeGenerator = new ServiceTypeGenerator(this.registry, imports, this.interpreter, commentGenerator, this.options);
        this.serviceClientGenerators = [
            new ServiceClientGeneratorCall(this.registry, imports, this.interpreter, this.options),
            new ServiceClientGeneratorPromise(this.registry, imports, this.interpreter, this.options),
            new ServiceClientGeneratorRxjs(this.registry, imports, this.interpreter, this.options),
        ];
        this.serviceServerGeneratorGrpc = new ServiceServerGeneratorGrpc(this.registry, imports, this.interpreter, this.options);
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


    generateServiceType(descriptor: ServiceDescriptorProto): void {
        this.serviceTypeGenerator.generateServiceType(descriptor, this);
    }


    generateServiceClientInterface(descriptor: ServiceDescriptorProto, style: rpc.ClientStyle): void {
        const gen = this.serviceClientGenerators.find(g => g.style === style);
        assert(gen);
        gen.generateInterface(descriptor, this);
    }


    generateServiceClientImplementation(descriptor: ServiceDescriptorProto, style: rpc.ClientStyle): void {
        const gen = this.serviceClientGenerators.find(g => g.style === style);
        assert(gen);
        gen.generateImplementationClass(descriptor, this);
    }


    generateServerGrpcInterface(descriptor: ServiceDescriptorProto): void {
        this.serviceServerGeneratorGrpc.generateInterface(descriptor, this);
    }


    generateServerGrpcDefinition(descriptor: ServiceDescriptorProto): void {
        this.serviceServerGeneratorGrpc.generateDefinition(descriptor, this);
    }


}
