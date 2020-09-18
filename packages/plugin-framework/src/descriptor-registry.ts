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
import {CodeGeneratorRequest} from "./google/protobuf/compiler/plugin";
import {
    AnyDescriptorProto,
    AnyOptions,
    AnyTypeDescriptorProto,
    DescriptorInfo,
    IDescriptorInfo,
    MapFieldKeyType,
    ScalarValueType
} from "./descriptor-info";
import {DescriptorTree, IDescriptorTree} from "./descriptor-tree";
import {
    FileDescriptorProtoFields,
    ISourceCodeInfoLookup,
    SourceCodeComment,
    SourceCodeCursor,
    SourceCodeInfoLookup
} from "./source-code-info";
import {IStringFormat, StringFormat} from "./string-format";
import {ITypeNameLookup, TypeNameLookup} from "./type-names";


export class DescriptorRegistry implements IDescriptorTree, ITypeNameLookup, ISourceCodeInfoLookup, IStringFormat, IDescriptorInfo {


    /**
     * Create new registry from a FileDescriptorProto.
     */
    static createFrom(file: FileDescriptorProto): DescriptorRegistry;

    /**
     * Create new registry from a CodeGeneratorRequest.
     */
    static createFrom(request: CodeGeneratorRequest): DescriptorRegistry;

    static createFrom(requestOrFile: CodeGeneratorRequest | FileDescriptorProto): DescriptorRegistry {
        const
            files = CodeGeneratorRequest.is(requestOrFile)
                ? requestOrFile.protoFile
                : [requestOrFile],
            tree = DescriptorTree.from(...files),
            nameLookup = TypeNameLookup.from(tree),
            sourceCodeLookup = new SourceCodeInfoLookup(d => tree.parentOf(d)),
            descriptorInfo = new DescriptorInfo(tree, nameLookup),
            stringFormat = new StringFormat(nameLookup, tree, sourceCodeLookup, descriptorInfo);
        return new DescriptorRegistry(
            tree,
            nameLookup,
            sourceCodeLookup,
            stringFormat,
            descriptorInfo
        );
    }


    constructor(
        private readonly tree: IDescriptorTree,
        private readonly typeNames: ITypeNameLookup,
        private readonly sourceCode: ISourceCodeInfoLookup,
        private readonly stringFormat: IStringFormat,
        private readonly descriptorInfo: IDescriptorInfo,
    ) {
    }

    // ITypeNameLookup

    normalizeTypeName(typeName: string): string {
        return this.typeNames.normalizeTypeName(typeName);
    }

    resolveTypeName(typeName: string): AnyTypeDescriptorProto {
        return this.typeNames.resolveTypeName(typeName);
    }

    peekTypeName(typeName: string): AnyTypeDescriptorProto | undefined {
        return this.typeNames.peekTypeName(typeName);
    }

    makeTypeName(descriptor: AnyTypeDescriptorProto): string {
        return this.typeNames.makeTypeName(descriptor);
    }

    // IDescriptorTree

    ancestorsOf(descriptor: AnyDescriptorProto): AnyDescriptorProto[] {
        return this.tree.ancestorsOf(descriptor);
    }

    fileOf(descriptor: AnyDescriptorProto): FileDescriptorProto {
        return this.tree.fileOf(descriptor);
    }

    allFiles(): readonly FileDescriptorProto[] {
        return this.tree.allFiles();
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
        return this.tree.parentOf(descriptorOrOptions as any);
    }

    visit(visitor: (descriptor: AnyTypeDescriptorProto) => void): void;
    visit(startingFrom: AnyDescriptorProto, visitor: (descriptor: AnyTypeDescriptorProto) => void): void;
    visit(a: any, b?: any) {
        this.tree.visit(a, b);
    }

    visitTypes(visitor: (descriptor: AnyTypeDescriptorProto) => void): void;
    visitTypes(startingFrom: AnyDescriptorProto, visitor: (descriptor: AnyTypeDescriptorProto) => void): void;
    visitTypes(a: any, b?: any): void {
        this.tree.visitTypes(a, b);
    }

    // ISourceCodeInfoLookup

    sourceCodeCursor(descriptor: AnyDescriptorProto): SourceCodeCursor {
        return this.sourceCode.sourceCodeCursor(descriptor);
    }


    sourceCodeComments(descriptor: AnyDescriptorProto): SourceCodeComment;
    sourceCodeComments(file: FileDescriptorProto, field: FileDescriptorProtoFields): SourceCodeComment;
    sourceCodeComments(descriptorOrFile: FileDescriptorProto | AnyDescriptorProto, fileDescriptorFieldNumber?: FileDescriptorProtoFields): SourceCodeComment {
        if (FileDescriptorProto.is(descriptorOrFile) && fileDescriptorFieldNumber !== undefined) {
            return this.sourceCode.sourceCodeComments(descriptorOrFile, fileDescriptorFieldNumber);
        }
        return this.sourceCode.sourceCodeComments(descriptorOrFile);
    }

    // IStringFormat

    formatFieldDeclaration(descriptor: FieldDescriptorProto): string {
        return this.stringFormat.formatFieldDeclaration(descriptor);
    }

    formatQualifiedName(descriptor: AnyDescriptorProto, includeFileInfo = false): string {
        return this.stringFormat.formatQualifiedName(descriptor, includeFileInfo);
    }

    formatName(descriptor: AnyDescriptorProto): string {
        return this.stringFormat.formatName(descriptor);
    }

    formatEnumValueDeclaration(descriptor: EnumValueDescriptorProto): string {
        return this.stringFormat.formatEnumValueDeclaration(descriptor);
    }

    formatRpcDeclaration(descriptor: MethodDescriptorProto): string {
        return this.stringFormat.formatRpcDeclaration(descriptor);
    }


    // IDescriptorInfo

    isExtension(descriptor: FieldDescriptorProto): boolean {
        return this.descriptorInfo.isExtension(descriptor);
    }

    extensionsFor(descriptorOrTypeName: DescriptorProto | string): FieldDescriptorProto[] {
        return this.descriptorInfo.extensionsFor(descriptorOrTypeName);
    }

    getExtensionName(descriptor: FieldDescriptorProto): string {
        return this.descriptorInfo.getExtensionName(descriptor);
    }

    getFieldCustomJsonName(descriptor: FieldDescriptorProto): string | undefined {
        return this.descriptorInfo.getFieldCustomJsonName(descriptor);
    }

    isEnumField(fieldDescriptor: FieldDescriptorProto): boolean {
        return this.descriptorInfo.isEnumField(fieldDescriptor);
    }

    getEnumFieldEnum(fieldDescriptor: FieldDescriptorProto): EnumDescriptorProto {
        return this.descriptorInfo.getEnumFieldEnum(fieldDescriptor);
    }

    isMessageField(fieldDescriptor: FieldDescriptorProto): boolean {
        return this.descriptorInfo.isMessageField(fieldDescriptor);
    }

    getMessageFieldMessage(fieldDescriptor: FieldDescriptorProto): DescriptorProto {
        return this.descriptorInfo.getMessageFieldMessage(fieldDescriptor);
    }

    isScalarField(fieldDescriptor: FieldDescriptorProto): boolean {
        return this.descriptorInfo.isScalarField(fieldDescriptor);
    }

    getScalarFieldType(fieldDescriptor: FieldDescriptorProto): ScalarValueType {
        return this.descriptorInfo.getScalarFieldType(fieldDescriptor);
    }

    isMapField(fieldDescriptor: FieldDescriptorProto): boolean {
        return this.descriptorInfo.isMapField(fieldDescriptor);
    }

    getMapKeyType(fieldDescriptor: FieldDescriptorProto): MapFieldKeyType {
        return this.descriptorInfo.getMapKeyType(fieldDescriptor);
    }

    getMapValueType(fieldDescriptor: FieldDescriptorProto): DescriptorProto | EnumDescriptorProto | ScalarValueType {
        return this.descriptorInfo.getMapValueType(fieldDescriptor);
    }

    isExplicitlyDeclaredDeprecated(descriptor: AnyDescriptorProto): boolean {
        return this.descriptorInfo.isExplicitlyDeclaredDeprecated(descriptor);
    }

    isSyntheticElement(descriptor: AnyDescriptorProto): boolean {
        return this.descriptorInfo.isSyntheticElement(descriptor);
    }

    findEnumSharedPrefix(descriptor: EnumDescriptorProto, enumLocalName?: string): string | undefined {
        return this.descriptorInfo.findEnumSharedPrefix(descriptor, enumLocalName);
    }

    isUserDeclaredOneof(descriptor: FieldDescriptorProto): boolean {
        return this.descriptorInfo.isUserDeclaredOneof(descriptor);
    }

    isUserDeclaredOptional(descriptor: FieldDescriptorProto): boolean {
        return this.descriptorInfo.isUserDeclaredOptional(descriptor);
    }

    isUserDeclaredRepeated(descriptor: FieldDescriptorProto): boolean {
        return this.descriptorInfo.isUserDeclaredRepeated(descriptor);
    }

    shouldBePackedRepeated(descriptor: FieldDescriptorProto): boolean {
        return this.descriptorInfo.shouldBePackedRepeated(descriptor);
    }

    isFileUsed(file: FileDescriptorProto, inFiles: FileDescriptorProto[]): boolean {
        return this.descriptorInfo.isFileUsed(file, inFiles);
    }

    isTypeUsed(type: AnyTypeDescriptorProto, inFiles: FileDescriptorProto[]): boolean {
        return this.descriptorInfo.isTypeUsed(type, inFiles);
    }

}
