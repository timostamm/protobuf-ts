import {
    DescriptorProto,
    EnumDescriptorProto,
    EnumOptions,
    EnumValueDescriptorProto,
    EnumValueOptions,
    FieldDescriptorProto,
    FieldDescriptorProto_Label,
    FieldDescriptorProto_Type,
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
import {ITypeNameLookup} from "./type-names";
import {IDescriptorTree} from "./descriptor-tree";
import {assert, lowerCamelCase} from "@protobuf-ts/runtime";
import {StringFormat} from "./string-format";


/**
 * Union of all known descriptor proto.
 */
export type AnyDescriptorProto =
    | FileDescriptorProto
    | DescriptorProto
    | FieldDescriptorProto
    | OneofDescriptorProto
    | EnumDescriptorProto
    | EnumValueDescriptorProto
    | ServiceDescriptorProto
    | MethodDescriptorProto;


/**
 * Messages, enums and services are the only first-class
 * types in the protobuf world.
 *
 * We assume that it should be possible to lookup these
 * types by name.
 */
export type AnyTypeDescriptorProto =
    | DescriptorProto
    | EnumDescriptorProto
    | ServiceDescriptorProto;


/**
 * Union of all known descriptor options.
 */
export type AnyOptions =
    | FileOptions
    | MessageOptions
    | FieldOptions
    | EnumOptions
    | OneofOptions
    | EnumValueOptions
    | ServiceOptions
    | MethodOptions


/**
 * Is this a first-class type?
 */
export function isAnyTypeDescriptorProto(arg: any): arg is AnyTypeDescriptorProto {
    return DescriptorProto.is(arg) || EnumDescriptorProto.is(arg) || ServiceDescriptorProto.is(arg);
}

/**
 * All scalar values types (which includes bytes)
 * https://developers.google.com/protocol-buffers/docs/proto3#scalar_value_types
 */
export type ScalarValueType = Exclude<FieldDescriptorProto_Type,
    | typeof FieldDescriptorProto_Type.UNSPECIFIED$
    | typeof FieldDescriptorProto_Type.MESSAGE
    | typeof FieldDescriptorProto_Type.ENUM
    | typeof FieldDescriptorProto_Type.GROUP>;


/**
 * Map field key type.
 *
 * The key_type can be any integral or string type
 * (so, any scalar type except for floating point
 * types and bytes)
 */
export type MapFieldKeyType = Exclude<FieldDescriptorProto_Type,
    | typeof FieldDescriptorProto_Type.FLOAT
    | typeof FieldDescriptorProto_Type.DOUBLE
    | typeof FieldDescriptorProto_Type.BYTES
    | typeof FieldDescriptorProto_Type.UNSPECIFIED$
    | typeof FieldDescriptorProto_Type.MESSAGE
    | typeof FieldDescriptorProto_Type.ENUM
    | typeof FieldDescriptorProto_Type.GROUP>;


/**
 * Map field value type.
 *
 * Can be any scalar type, enum, or message.
 */
export type MapFieldValueType =
    | DescriptorProto
    | EnumDescriptorProto
    | ScalarValueType;


export interface IDescriptorInfo {


    /**
     * Is this an extension field?
     */
    isExtension(descriptor: FieldDescriptorProto): boolean;


    /**
     * Finds all extension fields extending the given message descriptor.
     */
    extensionsFor(descriptorOrTypeName: DescriptorProto | string): FieldDescriptorProto[];


    /**
     * Get the name of an extension field, including the namespace
     * where it was defined.
     *
     * For example, an extension field defined in the package "foo":
     *
     * ```proto
     * extend google.protobuf.FieldOptions {
     *      bool opt = 1001;
     * }
     * ```
     *
     * Will have the extension name "foo.opt".
     *
     */
    getExtensionName(fieldDescriptor: FieldDescriptorProto): string;


    /**
     * Return the user-specified JSON name.
     * Returns `undefined` if no name was specified or name
     * equals lowerCamelCaseName.
     */
    getFieldCustomJsonName(fieldDescriptor: FieldDescriptorProto): string | undefined;


    /**
     * Is this a enum field?
     */
    isEnumField(fieldDescriptor: FieldDescriptorProto): boolean;

    /**
     * Get the enum descriptor for a enum field.
     */
    getEnumFieldEnum(fieldDescriptor: FieldDescriptorProto): EnumDescriptorProto;

    /**
     * Is this a message field?
     *
     * Returns false if this is a map field, even though map fields have type MESSAGE.
     * Returns true if this is a group field (type GROUP).
     */
    isMessageField(fieldDescriptor: FieldDescriptorProto): boolean;

    /**
     * Get the message descriptor for a message field.
     */
    getMessageFieldMessage(fieldDescriptor: FieldDescriptorProto): DescriptorProto;

    /**
     * Is this a scalar field?
     */
    isScalarField(fieldDescriptor: FieldDescriptorProto): boolean;

    /**
     * Get the scalar type of a scalar field.
     */
    getScalarFieldType(fieldDescriptor: FieldDescriptorProto): ScalarValueType;

    /**
     * Is this a map field?
     */
    isMapField(fieldDescriptor: FieldDescriptorProto): boolean;

    /**
     * Get the key type of a map field.
     */
    getMapKeyType(fieldDescriptor: FieldDescriptorProto): MapFieldKeyType;

    /**
     * Get the value type (can be enum or message) of a map field.
     */
    getMapValueType(fieldDescriptor: FieldDescriptorProto): DescriptorProto | EnumDescriptorProto | ScalarValueType;


    /**
     * Determines whether the user declared the field
     * with `optional`.
     *
     * For proto2, the field descriptor's `label` is
     * `LABEL_OPTIONAL`.
     *
     * For proto3, the field descriptor's `proto3_optional`
     * is `true` and the field will be the sole member
     * of a "synthetic" oneof.
     */
    isUserDeclaredOptional(fieldDescriptor: FieldDescriptorProto): boolean;


    /**
     * Is this field declared as a oneof member by the user?
     *
     * When a field is declared `optional` in proto3, a
     * "synthetic" oneof is generated by the compiler.
     */
    isUserDeclaredOneof(fieldDescriptor: FieldDescriptorProto): boolean;


    /**
     * Determines whether the user declared the field
     * with `repeated`.
     *
     * A map<K,V> for example cannot be repeated, but
     * is internally represented as a repeated
     * entry-message. This function recognizes this
     * and returns false.
     */
    isUserDeclaredRepeated(fieldDescriptor: FieldDescriptorProto): boolean;


    /**
     * Should this (repeated) field be encoded packed?
     *
     * Returns true if the user set [packed = true] or if syntax is proto3
     * (and user did not explicitly disable default behaviour of proto3).
     *
     * Returns false if:
     * - the field is not declared with `repeated`.
     * - the user set [packed = false].
     * - syntax is proto2 and there is no [packed = true].
     *
     * Throws if the field is `repeated` and type is `bytes` or `string`.
     * This should have been a parse failure by protoc.
     */
    shouldBePackedRepeated(fieldDescriptor: FieldDescriptorProto): boolean;


    /**
     * Is this element marked deprecated by the user?
     */
    isExplicitlyDeclaredDeprecated(descriptor: AnyDescriptorProto): boolean;


    /**
     * Is the element intentionally created by the user
     * or synthesized by the protobuf compiler?
     *
     * For example, the compiler generates an entry
     * message for each map.
     */
    isSyntheticElement(descriptor: AnyDescriptorProto): boolean;


    /**
     * Determine whether all enum value names start with the snake_case
     * version of the enums name (enumLocalName or descriptor.name).
     * If so, return the shared prefix. Otherwise, return undefined.
     *
     * For example, the following enum...
     *
     * ```proto
     * enum MyEnum {
     *     MY_ENUM_FOO = 0;
     *     MY_ENUM_BAR = 1;
     * }
     * ```
     *
     * ... has the shared prefix "MY_ENUM_".
     */
    findEnumSharedPrefix(enumDescriptor: EnumDescriptorProto, enumLocalName?: string): string | undefined;

}


export class DescriptorInfo implements IDescriptorInfo {

    constructor(private readonly tree: IDescriptorTree, private readonly nameLookup: ITypeNameLookup) {
    }


    private allExtensions: FieldDescriptorProto[] | undefined;

    private getAllExtensions(): FieldDescriptorProto[] {
        if (!this.allExtensions) {
            this.allExtensions = [];
            for (let file of this.tree.allFiles()) {
                this.allExtensions.push(...file.extension);
                for (let msg of file.messageType) {
                    this.allExtensions.push(...msg.extension);
                }
            }
        }
        return this.allExtensions;
    }


    isExtension(fieldDescriptor: FieldDescriptorProto): boolean {
        let parent = this.tree.parentOf(fieldDescriptor);
        return parent.extension.includes(fieldDescriptor);
    }


    extensionsFor(descriptorOrTypeName: DescriptorProto | string): FieldDescriptorProto[] {
        let extendeeTypeName: string;
        if (typeof descriptorOrTypeName === "string") {
            extendeeTypeName = this.nameLookup.makeTypeName(
                this.nameLookup.resolveTypeName(descriptorOrTypeName)
            );
        } else {
            extendeeTypeName = this.nameLookup.makeTypeName(descriptorOrTypeName);
        }
        return this.getAllExtensions().filter(ext => this.nameLookup.normalizeTypeName(ext.extendee!) === extendeeTypeName);
    }


    getExtensionName(fieldDescriptor: FieldDescriptorProto): string {
        assert(this.isExtension(fieldDescriptor), `${StringFormat.formatName(fieldDescriptor)} is not an extension. use isExtension() before getExtensionName()`)
        assert(fieldDescriptor.name);
        let extensionName: string;
        let parent = this.tree.parentOf(fieldDescriptor);
        if (FileDescriptorProto.is(parent)) {
            extensionName = parent.package
                ? `${parent.package}.${fieldDescriptor.name}`
                : `${fieldDescriptor.name}`;
        } else {
            extensionName = `${this.nameLookup.makeTypeName(parent)}.${fieldDescriptor.name}`
        }
        return extensionName;
    }


    getFieldCustomJsonName(fieldDescriptor: FieldDescriptorProto): string | undefined {
        const name = lowerCamelCase(fieldDescriptor.name!);
        const jsonName = fieldDescriptor.jsonName;
        if (jsonName !== undefined && jsonName !== '' && jsonName !== name) {
            return jsonName;
        }
        return undefined;
    }


    isEnumField(fieldDescriptor: FieldDescriptorProto): boolean {
        return fieldDescriptor.type === FieldDescriptorProto_Type.ENUM;
    }

    getEnumFieldEnum(fieldDescriptor: FieldDescriptorProto): EnumDescriptorProto {
        if (fieldDescriptor.type !== FieldDescriptorProto_Type.ENUM) {
            throw new Error(`${StringFormat.formatName(fieldDescriptor)} is not a enum field. use isEnumField() before getEnumFieldEnum().`);
        }
        assert(fieldDescriptor.typeName !== undefined, `Missing enum type name for ${StringFormat.formatName(fieldDescriptor)}`);
        let enumType = this.nameLookup.peekTypeName(fieldDescriptor.typeName);
        assert(enumType !== undefined, `Missing enum type ${fieldDescriptor.typeName} for ${StringFormat.formatName(fieldDescriptor)}`);
        assert(EnumDescriptorProto.is(enumType), `Invalid enum type for ${StringFormat.formatName(fieldDescriptor)}`);
        return enumType;
    }

    isMessageField(fieldDescriptor: FieldDescriptorProto): boolean {
        let group = fieldDescriptor.type === FieldDescriptorProto_Type.GROUP;
        let msg = fieldDescriptor.type === FieldDescriptorProto_Type.MESSAGE;
        if (fieldDescriptor.typeName !== undefined && (group || msg)) {
            return !this.isMapField(fieldDescriptor);
        }
        return false;
    }

    getMessageFieldMessage(fieldDescriptor: FieldDescriptorProto): DescriptorProto {
        if (!this.isMessageField(fieldDescriptor)) {
            throw new Error(`${StringFormat.formatName(fieldDescriptor)} is not a message field. use isMessageField() before getMessageFieldMessage().`);
        }
        assert(fieldDescriptor.typeName !== undefined, `Missing message type name for ${StringFormat.formatName(fieldDescriptor)}`);
        let messageType = this.nameLookup.peekTypeName(fieldDescriptor.typeName);
        assert(messageType !== undefined, `Missing message type ${fieldDescriptor.typeName} for ${StringFormat.formatName(fieldDescriptor)}`);
        assert(DescriptorProto.is(messageType), `Invalid message type for ${StringFormat.formatName(fieldDescriptor)}`);
        return messageType;
    }

    isScalarField(fieldDescriptor: FieldDescriptorProto): boolean {
        switch (fieldDescriptor.type) {
            case FieldDescriptorProto_Type.ENUM:
            case FieldDescriptorProto_Type.MESSAGE:
            case FieldDescriptorProto_Type.GROUP:
            case FieldDescriptorProto_Type.UNSPECIFIED$:
                return false;
        }
        return true;
    }

    getScalarFieldType(fieldDescriptor: FieldDescriptorProto): ScalarValueType {
        if (!this.isScalarField(fieldDescriptor)) {
            throw new Error(`${StringFormat.formatName(fieldDescriptor)} is not a scalar field. use isScalarField() before getScalarFieldType().`);
        }
        assert(fieldDescriptor.type !== undefined);
        assert(fieldDescriptor.type !== FieldDescriptorProto_Type.ENUM);
        assert(fieldDescriptor.type !== FieldDescriptorProto_Type.MESSAGE);
        assert(fieldDescriptor.type !== FieldDescriptorProto_Type.GROUP);
        assert(fieldDescriptor.type !== FieldDescriptorProto_Type.UNSPECIFIED$);
        return fieldDescriptor.type;
    }

    isMapField(fieldDescriptor: FieldDescriptorProto): boolean {
        return this.getMapEntryMessage(fieldDescriptor) !== undefined;
    }

    getMapKeyType(fieldDescriptor: FieldDescriptorProto): MapFieldKeyType {
        let entry = this.getMapEntryMessage(fieldDescriptor);
        if (!entry) {
            throw new Error(`${StringFormat.formatName(fieldDescriptor)} is not a map field. use isMapField() before getMapKeyType().`);
        }
        let keyField = entry.field.find(fd => fd.number === 1);
        assert(keyField !== undefined, `Missing map entry key field 1 for ${StringFormat.formatName(fieldDescriptor)}`);
        assert(keyField.type !== undefined, `Unexpected map key type ${keyField?.type} for ${StringFormat.formatName(fieldDescriptor)}`);
        assert(keyField.type !== FieldDescriptorProto_Type.UNSPECIFIED$, `Unexpected map key type ${keyField?.type} for ${StringFormat.formatName(fieldDescriptor)}`);
        assert(keyField.type !== FieldDescriptorProto_Type.GROUP, `Unexpected map key type ${keyField?.type} for ${StringFormat.formatName(fieldDescriptor)}`);
        assert(keyField.type !== FieldDescriptorProto_Type.MESSAGE, `Unexpected map key type ${keyField?.type} for ${StringFormat.formatName(fieldDescriptor)}`);
        assert(keyField.type !== FieldDescriptorProto_Type.ENUM, `Unexpected map key type ${keyField?.type} for ${StringFormat.formatName(fieldDescriptor)}`);
        assert(keyField.type !== FieldDescriptorProto_Type.FLOAT, `Unexpected map key type ${keyField?.type} for ${StringFormat.formatName(fieldDescriptor)}`);
        assert(keyField.type !== FieldDescriptorProto_Type.DOUBLE, `Unexpected map key type ${keyField?.type} for ${StringFormat.formatName(fieldDescriptor)}`);
        assert(keyField.type !== FieldDescriptorProto_Type.BYTES, `Unexpected map key type ${keyField?.type} for ${StringFormat.formatName(fieldDescriptor)}`);
        return keyField.type;
    }


    getMapValueType(fieldDescriptor: FieldDescriptorProto): MapFieldValueType {
        let entry = this.getMapEntryMessage(fieldDescriptor);
        if (!entry) {
            throw new Error(`${StringFormat.formatName(fieldDescriptor)} is not a map field. use isMapField() before getMapValueType().`);
        }
        let valueField = entry.field.find(fd => fd.number === 2);
        assert(valueField !== undefined, `Missing map entry value field 2 for ${StringFormat.formatName(fieldDescriptor)}`);
        if (this.isScalarField(valueField)) {
            return this.getScalarFieldType(valueField);
        }
        if (this.isEnumField(valueField)) {
            return this.getEnumFieldEnum(valueField);
        }
        return this.getMessageFieldMessage(valueField);
    }

    private getMapEntryMessage(fieldDescriptor: FieldDescriptorProto): DescriptorProto | undefined {
        if (fieldDescriptor.type !== FieldDescriptorProto_Type.MESSAGE) {
            return undefined;
        }
        if (fieldDescriptor.typeName === undefined || fieldDescriptor.typeName === "") {
            return undefined;
        }
        let typeDescriptor = this.nameLookup.resolveTypeName(fieldDescriptor.typeName);
        if (!DescriptorProto.is(typeDescriptor)) {
            return undefined;
        }
        if (typeDescriptor.options?.mapEntry !== true) {
            return undefined;
        }
        return typeDescriptor;
    }


    isExplicitlyDeclaredDeprecated(descriptor: AnyDescriptorProto): boolean {
        if (DescriptorProto.is(descriptor)) {
            return descriptor.options?.deprecated ?? false;
        }
        if (FieldDescriptorProto.is(descriptor)) {
            return descriptor.options?.deprecated ?? false;
        }
        if (EnumDescriptorProto.is(descriptor)) {
            return descriptor.options?.deprecated ?? false;
        }
        if (EnumValueDescriptorProto.is(descriptor)) {
            return descriptor.options?.deprecated ?? false;
        }
        if (ServiceDescriptorProto.is(descriptor)) {
            return descriptor.options?.deprecated ?? false;
        }
        if (MethodDescriptorProto.is(descriptor)) {
            return descriptor.options?.deprecated ?? false;
        }
        if (OneofDescriptorProto.is(descriptor)) {
            return false;
        }
        return false;
    }

    isSyntheticElement(descriptor: AnyDescriptorProto): boolean {
        if (DescriptorProto.is(descriptor)) {
            if (descriptor.options?.mapEntry) {
                return true;
            }
            if (descriptor.name && descriptor.name.startsWith("$synthetic.")) {
                return true;
            }
        }
        return false;
    }

    isUserDeclaredOneof(fieldDescriptor: FieldDescriptorProto): boolean {
        if (fieldDescriptor.oneofIndex === undefined) {
            return false;
        }
        return fieldDescriptor.proto3Optional !== true;
    }

    isUserDeclaredOptional(fieldDescriptor: FieldDescriptorProto): boolean {
        if (this.isUserDeclaredOneof(fieldDescriptor)) {
            return false;
        }
        if (fieldDescriptor.proto3Optional === true) {
            return true;
        }
        if (fieldDescriptor.proto3Optional === false) {
            return false;
        }
        const file = this.tree.fileOf(fieldDescriptor);
        if (file.syntax === 'proto3') {
            return false;
        }
        assert(file.syntax === undefined || file.syntax === 'proto2', `unsupported syntax "${file.syntax}"`);
        return fieldDescriptor.label === FieldDescriptorProto_Label.OPTIONAL;
    }

    isUserDeclaredRepeated(fieldDescriptor: FieldDescriptorProto): boolean {
        if (fieldDescriptor.label !== FieldDescriptorProto_Label.REPEATED) {
            return false;
        }
        const name = fieldDescriptor.typeName;
        if (name === undefined || name === "") {
            return true;
        }
        const typeDescriptor = this.nameLookup.resolveTypeName(name);
        if (DescriptorProto.is(typeDescriptor)) {
            return !typeDescriptor.options?.mapEntry;
        }
        return true;
    }


    shouldBePackedRepeated(fieldDescriptor: FieldDescriptorProto): boolean {
        let file = this.tree.fileOf(fieldDescriptor);
        let standard, declared = fieldDescriptor.options?.packed;
        if (file.syntax === 'proto3') {
            standard = true;
        } else {
            assert(file.syntax === undefined || file.syntax === 'proto2', `unsupported syntax "${file.syntax}"`);
            standard = false;
        }
        if (fieldDescriptor.type === FieldDescriptorProto_Type.BYTES || fieldDescriptor.type === FieldDescriptorProto_Type.STRING) {
            assert(!declared, `repeated bytes | string cannot be packed. protoc should have caught this. probably unsupported protoc version.`);
            standard = false;
        }
        return declared ?? standard;
    }


    findEnumSharedPrefix(enumDescriptor: EnumDescriptorProto, enumLocalName?: string): string | undefined {
        if (enumLocalName === undefined) {
            enumLocalName = `${enumDescriptor.name}`;
        }

        // create possible prefix from local enum name
        // for example, "MyEnum" => "MY_ENUM_"
        let enumPrefix = enumLocalName;
        enumPrefix = enumPrefix.replace(/[A-Z]/g, letter => "_" + letter.toLowerCase());
        enumPrefix = (enumPrefix[0] === "_") ? enumPrefix.substring(1) : enumPrefix;
        enumPrefix = enumPrefix.toUpperCase();
        enumPrefix += '_';

        // do all members share the prefix?
        let names = enumDescriptor.value.map(enumValue => `${enumValue.name}`);
        let allNamesSharePrefix = names.every(name => name.startsWith(enumPrefix));

        // are the names with stripped prefix still valid?
        // (start with uppercase letter, at least 2 chars long)
        let strippedNames = names.map(name => name.substring(enumPrefix.length));
        let strippedNamesAreValid = strippedNames.every(name => name.length > 0 && /^[A-Z].+/.test(name));

        return (allNamesSharePrefix && strippedNamesAreValid) ? enumPrefix : undefined;
    }

}

