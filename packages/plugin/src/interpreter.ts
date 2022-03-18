import {
    DescriptorProto,
    DescriptorRegistry,
    EnumDescriptorProto,
    FieldDescriptorProto,
    FieldOptions_JSType,
    FileDescriptorProto,
    MethodDescriptorProto,
    MethodOptions_IdempotencyLevel,
    OneofDescriptorProto,
    ServiceDescriptorProto,
} from "@protobuf-ts/plugin-framework";
import * as rt from "@protobuf-ts/runtime";
import {assert} from "@protobuf-ts/runtime";
import * as rpc from "@protobuf-ts/runtime-rpc";
import { FieldInfoGenerator } from "./code-gen/field-info-generator";
import {OurFileOptions, OurServiceOptions, readOurFileOptions, readOurServiceOptions} from "./our-options";


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
export class Interpreter {


    private readonly serviceTypes = new Map<string, rpc.ServiceType>();
    private readonly messageTypes = new Map<string, rt.IMessageType<rt.UnknownMessage>>();
    private readonly enumInfos = new Map<string, rt.EnumInfo>();


    constructor(
        private readonly registry: DescriptorRegistry,
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
    readOptions(descriptor: FieldDescriptorProto | MethodDescriptorProto | FileDescriptorProto | ServiceDescriptorProto | DescriptorProto, excludeOptions: readonly string[]): JsonOptionsMap | undefined {

        // the option to force exclude all options takes precedence
        if (this.options.forceExcludeAllOptions) {
            return undefined;
        }

        // if options message not present, there cannot be any extension options
        if (!descriptor.options) {
            return undefined;
        }

        // if no unknown fields present, can exit early
        let unknownFields = rt.UnknownFieldHandler.list(descriptor.options);
        if (!unknownFields.length) {
            return undefined;
        }

        let optionsTypeName: string;
        if (FieldDescriptorProto.is(descriptor) && DescriptorProto.is(this.registry.parentOf(descriptor))) {
            optionsTypeName = 'google.protobuf.FieldOptions';
        } else if (MethodDescriptorProto.is(descriptor)) {
            optionsTypeName = 'google.protobuf.MethodOptions';
        } else if (this.registry.fileOf(descriptor) === descriptor) {
            optionsTypeName = 'google.protobuf.FileOptions';
        } else if (ServiceDescriptorProto.is(descriptor)) {
            optionsTypeName = 'google.protobuf.ServiceOptions';
        } else if (DescriptorProto.is(descriptor)) {
            optionsTypeName = 'google.protobuf.MessageOptions';
        } else {
            throw new Error("interpreter expected field or method descriptor");
        }

        // create a synthetic type that has all extension fields for field options
        const typeName = `$synthetic.${optionsTypeName}`;
        let type = this.messageTypes.get(typeName);
        if (!type) {
            type = new rt.MessageType(
                typeName,
                this.buildFieldInfos(this.registry.extensionsFor(optionsTypeName)),
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
    readOurFileOptions(file: FileDescriptorProto): OurFileOptions {
        return readOurFileOptions(file);
    }


    /**
     * Read the custom service options declared in protobuf-ts.proto
     */
    readOurServiceOptions(service: ServiceDescriptorProto): OurServiceOptions {
        return readOurServiceOptions(service);
    }


    /**
     * Get a runtime type for the given message type name or message descriptor.
     * Creates the type if not created previously.
     *
     * Honors our file option "ts.exclude_options".
     */
    getMessageType(descriptorOrTypeName: string | DescriptorProto): rt.IMessageType<rt.UnknownMessage> {
        let descriptor = typeof descriptorOrTypeName === "string"
            ? this.registry.resolveTypeName(descriptorOrTypeName)
            : descriptorOrTypeName;
        let typeName = this.registry.makeTypeName(descriptor);
        assert(DescriptorProto.is(descriptor));
        let type = this.messageTypes.get(typeName);
        if (!type) {

            // Create and store the message type
            const optionsPlaceholder: JsonOptionsMap = {};
            type = new rt.MessageType(
                typeName,
                this.buildFieldInfos(descriptor.field),
                optionsPlaceholder
            );
            this.messageTypes.set(typeName, type);

            const ourFileOptions = this.readOurFileOptions(this.registry.fileOf(descriptor));

            // add message options *after* storing, so that the option can refer to itself
            const messageOptions = this.readOptions(descriptor, ourFileOptions["ts.exclude_options"]);
            if (messageOptions) {
                for (let key of Object.keys(messageOptions)) {
                    optionsPlaceholder[key] = messageOptions[key];
                }
            }

            // same for field options
            for (let i = 0; i < type.fields.length; i++) {
                const fd = descriptor.field[i];
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
    getServiceType(descriptorOrTypeName: string | ServiceDescriptorProto): rpc.ServiceType {
        let descriptor = typeof descriptorOrTypeName === "string"
            ? this.registry.resolveTypeName(descriptorOrTypeName)
            : descriptorOrTypeName;
        let typeName = this.registry.makeTypeName(descriptor);
        assert(ServiceDescriptorProto.is(descriptor));
        let type = this.serviceTypes.get(typeName);
        if (!type) {
            const ourFileOptions = this.readOurFileOptions(this.registry.fileOf(descriptor));
            type = this.buildServiceType(typeName, descriptor.method, ourFileOptions["ts.exclude_options"].concat("ts.client"));
            this.serviceTypes.set(typeName, type);
        }
        return type;
    }


    /**
     * Get runtime information for an enum.
     * Creates the info if not created previously.
     */
    getEnumInfo(descriptorOrTypeName: string | EnumDescriptorProto): rt.EnumInfo {
        let descriptor = typeof descriptorOrTypeName === "string"
            ? this.registry.resolveTypeName(descriptorOrTypeName)
            : descriptorOrTypeName;
        let typeName = this.registry.makeTypeName(descriptor);
        assert(EnumDescriptorProto.is(descriptor));
        let enumInfo = this.enumInfos.get(typeName) ?? this.buildEnumInfo(descriptor);
        this.enumInfos.set(typeName, enumInfo);
        return enumInfo;
    }


    private static createTypescriptNameForMethod(descriptor: MethodDescriptorProto): string {
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


    private buildServiceType(typeName: string, methods: MethodDescriptorProto[], excludeOptions: readonly string[]): rpc.ServiceType {
        let desc = this.registry.resolveTypeName(typeName);
        assert(ServiceDescriptorProto.is(desc));
        return new rpc.ServiceType(
            typeName,
            methods.map(m => this.buildMethodInfo(m, excludeOptions)),
            this.readOptions(desc, excludeOptions)
        );
    }


    private buildMethodInfo(methodDescriptor: MethodDescriptorProto, excludeOptions: readonly string[]): rpc.PartialMethodInfo {
        assert(methodDescriptor.name);
        assert(methodDescriptor.inputType);
        assert(methodDescriptor.outputType);
        let info: { [k: string]: any } = {};

        // name: The name of the method as declared in .proto
        info.name = methodDescriptor.name;

        // localName: The name of the method in the runtime.
        let localName = Interpreter.createTypescriptNameForMethod(methodDescriptor);
        if (localName !== rt.lowerCamelCase(methodDescriptor.name)) {
            info.localName = localName;
        }

        // idempotency: The idempotency level as specified in .proto.
        if (methodDescriptor.options) {
            let idem = methodDescriptor.options.idempotencyLevel;
            if (idem !== undefined && idem !== MethodOptions_IdempotencyLevel.IDEMPOTENCY_UNKNOWN) {
                info.idempotency = MethodOptions_IdempotencyLevel[idem];
            }
        }

        // serverStreaming: Was the rpc declared with server streaming?
        if (methodDescriptor.serverStreaming) {
            info.serverStreaming = true;
        }

        // clientStreaming: Was the rpc declared with client streaming?
        if (methodDescriptor.clientStreaming) {
            info.clientStreaming = true;
        }

        // I: The generated type handler for the input message.
        info.I = this.getMessageType(methodDescriptor.inputType);

        // O: The generated type handler for the output message.
        info.O = this.getMessageType(methodDescriptor.outputType);

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
    private createTypescriptNameForField(descriptor: FieldDescriptorProto | OneofDescriptorProto, escapeCharacter = '$'): string {
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
    private buildFieldInfos(fieldDescriptors: readonly FieldDescriptorProto[]): rt.PartialFieldInfo[] {
        const result: rt.PartialFieldInfo[] = [];
        for (const fd of fieldDescriptors) {
            if (this.registry.isGroupField(fd)) {
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
    private buildFieldInfo(fieldDescriptor: FieldDescriptorProto): undefined | rt.PartialFieldInfo {
        assert(fieldDescriptor.number);
        assert(fieldDescriptor.name);
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
        const jsonName = this.registry.getFieldCustomJsonName(fieldDescriptor);
        if (jsonName !== undefined) {
            info.jsonName = jsonName;
        }


        // oneof: The name of the `oneof` group, if this field belongs to one.
        if (this.registry.isUserDeclaredOneof(fieldDescriptor)) {
            assert(fieldDescriptor.oneofIndex !== undefined);
            const parentDescriptor = this.registry.parentOf(fieldDescriptor);
            assert(DescriptorProto.is(parentDescriptor));
            const ooDecl = parentDescriptor.oneofDecl[fieldDescriptor.oneofIndex];
            info.oneof = this.createTypescriptNameForField(ooDecl);
        }


        // repeat: Is the field repeated?
        if (this.registry.isUserDeclaredRepeated(fieldDescriptor)) {
            let packed = this.registry.shouldBePackedRepeated(fieldDescriptor);
            info.repeat = packed ? rt.RepeatType.PACKED : rt.RepeatType.UNPACKED;
        }


        // opt: Is the field optional?
        if (this.registry.isScalarField(fieldDescriptor) || this.registry.isEnumField(fieldDescriptor)) {
            if (this.registry.isUserDeclaredOptional(fieldDescriptor)) {
                info.opt = true;
            }
        }


        // jsonName: The name for JSON serialization / deserialization.
        if (fieldDescriptor.jsonName) {
            info.jsonName = fieldDescriptor.jsonName;
        }


        if (this.registry.isScalarField(fieldDescriptor)) {

            // kind:
            info.kind = "scalar";

            // T: Scalar field type.
            info.T = this.registry.getScalarFieldType(fieldDescriptor) as number as rt.ScalarType;

            // L?: JavaScript long type
            let L = this.determineNonDefaultLongType(info.T, fieldDescriptor.options?.jstype);
            if (L !== undefined) {
                info.L = L;
            }


        } else if (this.registry.isEnumField(fieldDescriptor)) {

            // kind:
            info.kind = "enum";

            // T: Return enum field type info.
            info.T = () => this.getEnumInfo(
                this.registry.getEnumFieldEnum(fieldDescriptor)
            );


        } else if (this.registry.isMessageField(fieldDescriptor)) {

            // kind:
            info.kind = "message";

            // T: Return message field type handler.
            info.T = () => this.getMessageType(
                this.registry.getMessageFieldMessage(fieldDescriptor)
            );


        } else if (this.registry.isMapField(fieldDescriptor)) {

            // kind:
            info.kind = "map";

            // K: Map field key type.
            info.K = this.registry.getMapKeyType(fieldDescriptor) as number as rt.ScalarType;

            // V: Map field value type.
            info.V = {} as { [k: string]: any };

            let mapV = this.registry.getMapValueType(fieldDescriptor);
            if (typeof mapV === "number") {
                info.V = {
                    kind: "scalar",
                    T: mapV as number as rt.ScalarType
                }
                let L = this.determineNonDefaultLongType(info.V.T, fieldDescriptor.options?.jstype);
                if (L !== undefined) {
                    info.V.L = L;
                }
            } else if (DescriptorProto.is(mapV)) {
                const messageDescriptor = mapV;
                info.V = {
                    kind: "message",
                    T: () => this.getMessageType(messageDescriptor)
                }
            } else {
                const enumDescriptor = mapV;
                info.V = {
                    kind: "enum",
                    T: () => this.getEnumInfo(enumDescriptor)
                }
            }

        } else {
            throw new Error(`Unexpected field type for ${this.registry.formatQualifiedName(fieldDescriptor)}`);
        }


        // extension fields are treated differently
        if (this.registry.isExtension(fieldDescriptor)) {
            let extensionName = this.registry.getExtensionName(fieldDescriptor);

            // always optional (unless repeated...)
            info.opt = info.repeat === undefined || info.repeat === rt.RepeatType.NO;

            info.name = extensionName;
            info.localName = extensionName;
            info.jsonName = extensionName;
            info.oneof = undefined;

        }

        return info as rt.PartialFieldInfo;
    }


    protected buildEnumInfo(descriptor: EnumDescriptorProto): rt.EnumInfo {
        let sharedPrefix = this.options.keepEnumPrefix
            ? undefined
            : this.registry.findEnumSharedPrefix(descriptor, `${descriptor.name}`);
        let hasZero = descriptor.value.some(v => v.number === 0);
        let builder = new RuntimeEnumBuilder();
        if (!hasZero && typeof this.options.synthesizeEnumZeroValue == 'string') {
            builder.add(this.options.synthesizeEnumZeroValue, 0);
        }
        for (let enumValueDescriptor of descriptor.value) {
            let name = enumValueDescriptor.name;
            assert(name !== undefined);
            assert(enumValueDescriptor.number !== undefined);
            if (sharedPrefix) {
                name = name.substring(sharedPrefix.length);
            }
            builder.add(name, enumValueDescriptor.number);
        }
        let enumInfo: rt.EnumInfo = [
            this.registry.makeTypeName(descriptor),
            builder.build(),
        ];
        if (sharedPrefix) {
            enumInfo = [enumInfo[0], enumInfo[1], sharedPrefix];
        }
        return enumInfo;
    }


    protected determineNonDefaultLongType(scalarType: rt.ScalarType, jsTypeOption?: FieldOptions_JSType): rt.LongType | undefined {
        if (!Interpreter.isLongValueType(scalarType)) {
            return undefined;
        }
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

