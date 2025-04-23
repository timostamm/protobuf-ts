import * as rt from "@protobuf-ts/runtime";
import {assert} from "@protobuf-ts/runtime";
import * as rpc from "@protobuf-ts/runtime-rpc";
import {FieldInfoGenerator} from "./code-gen/field-info-generator";
import {OurFileOptions, OurServiceOptions} from "./our-options";
import {
    DescEnum,
    DescExtension,
    DescField,
    DescFile,
    DescMessage,
    DescMethod,
    DescOneof,
    DescService,
    FileRegistry,
    getOption, isFieldSet
} from "@bufbuild/protobuf";
import {
    Edition,
    FieldDescriptorProto_Label,
    FieldDescriptorProto_Type,
    FieldOptions_JSType,
    FieldOptionsSchema,
    FileOptionsSchema,
    MessageOptionsSchema,
    MethodOptions_IdempotencyLevel,
    MethodOptionsSchema,
    ServiceOptionsSchema
} from "@bufbuild/protobuf/wkt";
import {client, exclude_options, server} from "./gen/protobuf-ts_pb";


type JsonOptionsMap = {
    [extensionName: string]: rt.JsonValue
}


/**
 * The protobuf-ts plugin generates code for message types from descriptor
 * protos. This class also creates message types from descriptor protos, but
 * but instead of generating code, it creates the type in-memory.
 *
 * This means that it is possible, for example, to read a message from binary
 * data without any generated code.
 *
 * The protobuf-ts plugin uses the interpreter to read custom options at
 * compile time and convert them to JSON.
 *
 * Since the interpreter creates fully functional message types including
 * reflection information, the protobuf-ts plugin uses the interpreter as
 * single source of truth for generating message interfaces and reflection
 * information.
 */
export class ESInterpreter {


    private readonly serviceTypes = new Map<string, rpc.ServiceType>();
    private readonly messageTypes = new Map<string, rt.IMessageType<rt.UnknownMessage>>();
    private readonly enumInfos = new Map<string, rt.EnumInfo>();


    constructor(
        private readonly registry: FileRegistry,
        private readonly options: {
            normalLongType: rt.LongType,
            oneofKindDiscriminator: string,
            synthesizeEnumZeroValue: string | false,
            forceExcludeAllOptions: boolean,
            keepEnumPrefix: boolean,
            useProtoFieldName: boolean,
        },
    ) {
    }


    /**
     * Returns a map of custom options for the provided descriptor.
     * The map is an object indexed by the extension field name.
     * The value of the extension field is provided in JSON format.
     *
     * This works by:
     * - searching for option extensions for the given descriptor proto
     *   in the registry.
     * - for example, providing a google.protobuf.FieldDescriptorProto
     *   searches for all extensions on google.protobuf.FieldOption.
     * - extensions are just fields, so we build a synthetic message
     *   type with all the (extension) fields.
     * - the field names are created by DescriptorRegistry.getExtensionName(),
     *   which produces for example "spec.option_name", where "spec" is
     *   the package and "option_name" is the field name.
     * - then we concatenate all unknown field data of the option and
     *   read the data with our synthetic message type
     * - the read message is then simply converted to JSON
     *
     * The optional "optionBlacklist" will exclude matching options.
     * The blacklist can contain exact extension names, or use the wildcard
     * character `*` to match a namespace or even all options.
     *
     * Note that options on options (google.protobuf.*Options) are not
     * supported.
     */
    readOptions(descriptor: DescField | DescMethod | DescFile | DescService | DescMessage, excludeOptions: readonly string[]): JsonOptionsMap | undefined {

        // the option to force exclude all options takes precedence
        if (this.options.forceExcludeAllOptions) {
            return undefined;
        }

        // if options message not present, there cannot be any extension options
        // if no unknown fields present, can exit early
        let unknownFields = descriptor.proto.options?.$unknown;
        if (unknownFields === undefined || unknownFields.length === 0) {
            return undefined;
        }

        let optionsSchema: DescMessage;
        switch (descriptor.kind) {
            case "field":
                optionsSchema = FieldOptionsSchema;
                break;
            case "rpc":
                optionsSchema = MethodOptionsSchema;
                break;
            case "file":
                optionsSchema = FileOptionsSchema;
                break;
            case "service":
                optionsSchema = ServiceOptionsSchema;
                break;
            case "message":
                optionsSchema = MessageOptionsSchema;
                break;
        }

        // create a synthetic type that has all extension fields for field options
        const typeName = `$synthetic.${optionsSchema.typeName}`;
        let type = this.messageTypes.get(typeName);
        if (!type) {
            const extensions: DescExtension[] = [];
            for (const desc of this.registry) {
                if (desc.kind == "extension" && desc.extendee.typeName === optionsSchema.typeName) {
                    extensions.push(desc);
                }
            }
            type = new rt.MessageType(
                typeName,
                this.buildFieldInfos(extensions),
                {}
            );
            this.messageTypes.set(typeName, type);
        }

        // concat all unknown field data
        const unknownWriter = new rt.BinaryWriter();
        for (let {no, wireType, data} of unknownFields) {
            unknownWriter.tag(no, wireType).raw(data);
        }
        const unknownBytes = unknownWriter.finish();

        // read data, to json
        const json = type.toJson(type.fromBinary(unknownBytes, {readUnknownField: false}));
        assert(rt.isJsonObject(json));

        // apply blacklist
        if (excludeOptions) {
            // we distinguish between literal blacklist (no wildcard)
            let literals = excludeOptions.filter(str => !str.includes("*"));
            // and wildcard, which we turn into RE
            let wildcards = excludeOptions.filter(str => str.includes("*"))
                .map(str => str.replace(/[.+\-?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*'));
            // then we delete the blacklisted options
            for (let key of Object.keys(json)) {
                for (let str of literals)
                    if (key === str)
                        delete json[key];
                for (let re of wildcards)
                    if (key.match(re))
                        delete json[key];
            }
        }

        // were *all* options blacklisted?
        if (!Object.keys(json).length) {
            return undefined;
        }

        return json;
    }


    /**
     * Read the custom file options declared in protobuf-ts.proto
     */
    readOurFileOptions(file: DescFile): OurFileOptions {
        return {
            ["ts.exclude_options"]: getOption(file, exclude_options),
        };
    }


    /**
     * Read the custom service options declared in protobuf-ts.proto
     */
    readOurServiceOptions(service: DescService): OurServiceOptions {
        return {
            ["ts.client"]: getOption(service, client),
            ["ts.server"]: getOption(service, server),
        };
    }


    /**
     * Get a runtime type for the given message type name or message descriptor.
     * Creates the type if not created previously.
     *
     * Honors our file option "ts.exclude_options".
     */
    getMessageType(descriptorOrTypeName: string | DescMessage): rt.IMessageType<rt.UnknownMessage> {
        let descriptor = typeof descriptorOrTypeName === "string"
            ? this.registry.getMessage(descriptorOrTypeName)
            : descriptorOrTypeName;
        assert(descriptor);
        let type = this.messageTypes.get(descriptor.typeName);
        if (!type) {

            // Create and store the message type
            const optionsPlaceholder: JsonOptionsMap = {};
            type = new rt.MessageType(
                descriptor.typeName,
                this.buildFieldInfos(descriptor.fields),
                optionsPlaceholder
            );
            this.messageTypes.set(descriptor.typeName, type);

            const ourFileOptions = this.readOurFileOptions(descriptor.file);

            // add message options *after* storing, so that the option can refer to itself
            const messageOptions = this.readOptions(descriptor, ourFileOptions["ts.exclude_options"]);
            if (messageOptions) {
                for (let key of Object.keys(messageOptions)) {
                    optionsPlaceholder[key] = messageOptions[key];
                }
            }

            // same for field options
            for (let i = 0; i < type.fields.length; i++) {
                const fd = descriptor.fields[i];
                const fi = type.fields[i];
                fi.options = this.readOptions(fd, ourFileOptions["ts.exclude_options"]);
            }

        }
        return type;
    }


    /**
     * Get a runtime type for the given service type name or service descriptor.
     * Creates the type if not created previously.
     *
     * Honors our file option "ts.exclude_options".
     */
    getServiceType(descriptorOrTypeName: string | DescService): rpc.ServiceType {
        let descriptor = typeof descriptorOrTypeName === "string"
            ? this.registry.getService(descriptorOrTypeName)
            : descriptorOrTypeName;
        assert(descriptor);
        let type = this.serviceTypes.get(descriptor.typeName);
        if (!type) {
            const ourFileOptions = this.readOurFileOptions(descriptor.file);
            type = this.buildServiceType(descriptor.typeName, descriptor.methods, ourFileOptions["ts.exclude_options"].concat("ts.client"));
            this.serviceTypes.set(descriptor.typeName, type);
        }
        return type;
    }


    /**
     * Get runtime information for an enum.
     * Creates the info if not created previously.
     */
    getEnumInfo(descriptorOrTypeName: string | DescEnum): rt.EnumInfo {
        const descriptor = typeof descriptorOrTypeName == "string" ? this.registry.getEnum(descriptorOrTypeName) : descriptorOrTypeName;
        assert(descriptor);
        let enumInfo = this.enumInfos.get(descriptor.typeName) ?? this.buildEnumInfo(descriptor);
        this.enumInfos.set(descriptor.typeName, enumInfo);
        return enumInfo;
    }


    private static createTypescriptNameForMethod(descriptor: DescMethod): string {
        let escapeCharacter = '$';
        let reservedClassProperties = [
            // js built in
            "__proto__", "toString", "name", "constructor",
            // generic clients
            "methods", "typeName", "options", "_transport",
            // @grpc/grpc-js clients
            "close", "getChannel", "waitForReady", "makeUnaryRequest", "makeClientStreamRequest", "makeServerStreamRequest", "makeBidiStreamRequest"
        ];
        let name = descriptor.name;
        assert(name !== undefined);
        name = rt.lowerCamelCase(name);
        if (reservedClassProperties.includes(name)) {
            name = name + escapeCharacter;
        }
        return name;
    }


    private buildServiceType(typeName: string, methods: DescMethod[], excludeOptions: readonly string[]): rpc.ServiceType {
        let desc = this.registry.getService(typeName);
        assert(desc);
        return new rpc.ServiceType(
            typeName,
            methods.map(m => this.buildMethodInfo(m, excludeOptions)),
            this.readOptions(desc, excludeOptions)
        );
    }


    private buildMethodInfo(methodDescriptor: DescMethod, excludeOptions: readonly string[]): rpc.PartialMethodInfo {
        let info: { [k: string]: any } = {};

        // name: The name of the method as declared in .proto
        info.name = methodDescriptor.name;

        // localName: The name of the method in the runtime.
        let localName = ESInterpreter.createTypescriptNameForMethod(methodDescriptor);
        if (localName !== rt.lowerCamelCase(methodDescriptor.name)) {
            info.localName = localName;
        }

        // idempotency: The idempotency level as specified in .proto.
        switch (methodDescriptor.idempotency) {
            case MethodOptions_IdempotencyLevel.IDEMPOTENCY_UNKNOWN:
                break;
            case MethodOptions_IdempotencyLevel.IDEMPOTENT:
                info.idempotency = "IDEMPOTENT";
                break;
            case MethodOptions_IdempotencyLevel.NO_SIDE_EFFECTS:
                info.idempotency = "NO_SIDE_EFFECTS";
                break;
        }

        // serverStreaming: Was the rpc declared with server streaming?
        if (methodDescriptor.proto.serverStreaming) {
            info.serverStreaming = true;
        }

        // clientStreaming: Was the rpc declared with client streaming?
        if (methodDescriptor.proto.clientStreaming) {
            info.clientStreaming = true;
        }

        // I: The generated type handler for the input message.
        info.I = this.getMessageType(methodDescriptor.input);

        // O: The generated type handler for the output message.
        info.O = this.getMessageType(methodDescriptor.output);

        // options: Contains custom method options from the .proto source in JSON format.
        info.options = this.readOptions(methodDescriptor, excludeOptions);

        return info as rpc.PartialMethodInfo;
    }


    /**
     * Create a name for a field or a oneof.
     * - use lowerCamelCase unless useProtoFieldName option is enabled
     * - escape reserved object property names by
     *   adding '$' at the end
     * - don't have to escape reserved keywords
     */
    private createTypescriptNameForField(descriptor: DescField | DescExtension | DescOneof, escapeCharacter = '$'): string {
        const reservedObjectProperties = '__proto__,toString'.split(',');
        let name = descriptor.name;
        assert(name !== undefined);
        name = FieldInfoGenerator.createTypescriptLocalName(name, this.options);
        if (reservedObjectProperties.includes(name)) {
            name = name + escapeCharacter;
        }
        if (this.options.oneofKindDiscriminator.split(',').includes(name)) {
            name = name + escapeCharacter;
        }
        return name;
    }


    // skips GROUP field type
    private buildFieldInfos(fieldDescriptors: readonly (DescField | DescExtension)[]): rt.PartialFieldInfo[] {
        const result: rt.PartialFieldInfo[] = [];
        for (const fd of fieldDescriptors) {
            if (fd.proto.type == FieldDescriptorProto_Type.GROUP) {
                // We ignore groups.
                // Note that groups are deprecated and not supported in proto3.
                continue;
            }
            const fi = this.buildFieldInfo(fd);
            if (fi) {
                result.push(fi);
            }
        }
        return result;
    }


    // throws on unexpected field types, notably GROUP
    private buildFieldInfo(fieldDescriptor: DescField | DescExtension): undefined | rt.PartialFieldInfo {
        let info: { [k: string]: any } = {};


        // no: The field number of the .proto field.
        info.no = fieldDescriptor.number;


        // name: The original name of the .proto field.
        info.name = fieldDescriptor.name;


        // kind: discriminator
        info.kind = undefined;


        // localName: The name of the field in the runtime.
        let localName = this.createTypescriptNameForField(fieldDescriptor);
        if (localName !== rt.lowerCamelCase(fieldDescriptor.name)) {
            info.localName = localName;
        }


        // jsonName: The name of the field in JSON.
        if (fieldDescriptor.proto.jsonName !== rt.lowerCamelCase(fieldDescriptor.name)) {
            info.jsonName = fieldDescriptor.proto.jsonName;
        }


        // oneof: The name of the `oneof` group, if this field belongs to one.
        if (fieldDescriptor.oneof) {
            info.oneof = this.createTypescriptNameForField(fieldDescriptor.oneof);
        }


        // repeat: Is the field repeated?
        if (fieldDescriptor.fieldKind == "list") {
            info.repeat = fieldDescriptor.packed ? rt.RepeatType.PACKED : rt.RepeatType.UNPACKED;
        }


        // opt: Is the field optional?
        if ((fieldDescriptor.fieldKind == "scalar" || fieldDescriptor.fieldKind == "enum") && !fieldDescriptor.oneof) {
            const proto3Optional = fieldDescriptor.proto.proto3Optional;
            const proto2Optional = fieldDescriptor.parent?.file.edition === Edition.EDITION_PROTO2 && fieldDescriptor.proto.label === FieldDescriptorProto_Label.OPTIONAL;
            if (proto2Optional || proto3Optional) {
                info.opt = true;
            }
        }

        if (fieldDescriptor.fieldKind == "scalar" || (fieldDescriptor.fieldKind == "list" && fieldDescriptor.listKind == "scalar")) {
            // kind:
            info.kind = "scalar";

            // T: Scalar field type.
            info.T = fieldDescriptor.scalar as number as rt.ScalarType;

            // L?: JavaScript long type
            let L = this.getL(fieldDescriptor);
            if (L !== undefined) {
                info.L = L;
            }


        } else if (fieldDescriptor.fieldKind == "enum" || (fieldDescriptor.fieldKind == "list" && fieldDescriptor.listKind == "enum")) {

            // kind:
            info.kind = "enum";

            // T: Return enum field type info.
            info.T = () => this.getEnumInfo(
                fieldDescriptor.enum,
            );


        } else if (fieldDescriptor.fieldKind == "message" || (fieldDescriptor.fieldKind == "list" && fieldDescriptor.listKind == "message")) {

            // kind:
            info.kind = "message";

            // T: Return message field type handler.
            info.T = () => this.getMessageType(
                fieldDescriptor.message,
            );


        } else if (fieldDescriptor.fieldKind == "map") {

            // kind:
            info.kind = "map";

            // K: Map field key type.
            info.K = fieldDescriptor.mapKey as number as rt.ScalarType;

            // V: Map field value type.
            info.V = {} as { [k: string]: any };

            switch (fieldDescriptor.mapKind) {
                case "scalar":
                    info.V = {
                        kind: "scalar",
                        T: fieldDescriptor.scalar as number as rt.ScalarType
                    }
                    let L = this.getL(fieldDescriptor);
                    if (L !== undefined) {
                        info.V.L = L;
                    }
                    break;
                case "message":
                    info.V = {
                        kind: "message",
                        T: () => this.getMessageType(fieldDescriptor.message),
                    }
                    break;
                case "enum":
                    info.V = {
                        kind: "enum",
                        T: () => this.getEnumInfo(fieldDescriptor.enum),
                    }
                    break;
            }
        }


        // extension fields are treated differently
        if (fieldDescriptor.kind == "extension") {
            // always optional (unless repeated...)
            info.opt = info.repeat === undefined || info.repeat === rt.RepeatType.NO;

            info.name = fieldDescriptor.typeName;
            info.localName = fieldDescriptor.typeName;
            info.jsonName = fieldDescriptor.typeName;
            info.oneof = undefined;

        }

        return info as rt.PartialFieldInfo;
    }


    protected buildEnumInfo(descriptor: DescEnum): rt.EnumInfo {
        let sharedPrefix = this.options.keepEnumPrefix
            ? undefined
            : this.findEnumSharedPrefix(descriptor);
        const hasZero = descriptor.values.some(v => v.number === 0);
        const builder = new RuntimeEnumBuilder();
        if (!hasZero && typeof this.options.synthesizeEnumZeroValue == 'string') {
            builder.add(this.options.synthesizeEnumZeroValue, 0);
        }
        for (let enumValueDescriptor of descriptor.values) {
            let name = enumValueDescriptor.name;
            if (sharedPrefix) {
                name = name.substring(sharedPrefix.length);
            }
            builder.add(name, enumValueDescriptor.number);
        }
        let enumInfo: rt.EnumInfo = [
            descriptor.typeName,
            builder.build(),
        ];
        if (sharedPrefix) {
            enumInfo = [enumInfo[0], enumInfo[1], sharedPrefix];
        }
        return enumInfo;
    }

    private findEnumSharedPrefix(enumDescriptor: DescEnum, enumLocalName?: string): string | undefined {
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
        let names = enumDescriptor.values.map(enumValue => `${enumValue.name}`);
        let allNamesSharePrefix = names.every(name => name.startsWith(enumPrefix));

        // are the names with stripped prefix still valid?
        // (start with uppercase letter, at least 2 chars long)
        let strippedNames = names.map(name => name.substring(enumPrefix.length));
        let strippedNamesAreValid = strippedNames.every(name => name.length > 0 && /^[A-Z].+/.test(name));

        return (allNamesSharePrefix && strippedNamesAreValid) ? enumPrefix : undefined;
    }


    protected getL(descField: DescField | DescExtension): rt.LongType | undefined {
        if (!this.isLong(descField)) {
            return undefined;
        }
        const jsTypeOption = (descField.proto.options !== undefined && isFieldSet(descField.proto.options, FieldOptionsSchema.field.jstype))
            ? descField.proto.options.jstype
            : undefined;
        if (jsTypeOption !== undefined) {
            switch (jsTypeOption) {
                case FieldOptions_JSType.JS_STRING:
                    // omitting L equals to STRING
                    return undefined;
                case FieldOptions_JSType.JS_NORMAL:
                    return rt.LongType.BIGINT;
                case FieldOptions_JSType.JS_NUMBER:
                    return rt.LongType.NUMBER;
            }
        }
        // at this point, there either was no js_type option or it was JS_NORMAL,
        // so we use our normal long type
        if (this.options.normalLongType === rt.LongType.STRING) {
            // since STRING is default, we do not set it
            return undefined;
        }
        return this.options.normalLongType;
    }

    private isLong(descField: DescField | DescExtension): boolean {
        if (descField.scalar === undefined) {
            return false;
        }
        return ESInterpreter.isLongValueType(descField.scalar);
    }

    /**
     * Is this a 64 bit integral or fixed type?
     */
    static isLongValueType(type: rt.ScalarType): boolean {
        switch (type) {
            case rt.ScalarType.INT64:
            case rt.ScalarType.UINT64:
            case rt.ScalarType.FIXED64:
            case rt.ScalarType.SFIXED64:
            case rt.ScalarType.SINT64:
                return true;
            default:
                return false;
        }
    }


}


/**
 * Builds a typescript enum lookup object,
 * compatible with enums generated by @protobuf-ts/plugin.
 */
export class RuntimeEnumBuilder {

    private readonly values: rt.EnumObjectValue[] = [];

    add(name: string, number: number) {
        this.values.push({name, number});
    }

    isValid(): boolean {
        try {
            this.build();
        } catch (e) {
            return false;
        }
        return true;
    }

    build(): rt.EnumInfo[1] {
        if (this.values.map(v => v.name).some((name, i, a) => a.indexOf(name) !== i)) {
            throw new Error("duplicate names");
        }
        let object: rt.EnumInfo[1] = {};
        for (let v of this.values) {
            object[v.number] = v.name;
            object[v.name] = v.number;
        }
        if (rt.isEnumObject(object)) {
            return object;
        }
        throw new Error("not a typescript enum object");
    }

}

