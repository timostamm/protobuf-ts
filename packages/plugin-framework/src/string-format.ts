import {
    DescriptorProto,
    EnumDescriptorProto,
    EnumValueDescriptorProto,
    FieldDescriptorProto,
    FieldDescriptorProto_Type,
    FieldOptions_JSType,
    FileDescriptorProto,
    MethodDescriptorProto,
    OneofDescriptorProto,
    ServiceDescriptorProto
} from "./google/protobuf/descriptor";
import {AnyDescriptorProto, IDescriptorInfo, isAnyTypeDescriptorProto, ScalarValueType} from "./descriptor-info";
import {IDescriptorTree} from "./descriptor-tree";
import {ISourceCodeInfoLookup} from "./source-code-info";
import {ITypeNameLookup} from "./type-names";
import {assert, assertNever} from "@protobuf-ts/runtime";


export interface IStringFormat {

    /**
     * Returns type ('message', 'field', etc.) and descriptor name.
     *
     * Examples:
     *   message Bar
     *   field value = 2
     *   rpc Fetch()
     */
    formatName(descriptor: AnyDescriptorProto): string;


    /**
     * Returns qualified name, consisting of:
     * - keyword like "message", "enum", etc. followed by " "
     * - package name followed by "."
     * - parent type descriptor names separated by "."
     * - descriptor name
     *
     * Examples:
     *   message .foo.Bar
     *   field .foo.Bar.value = 2
     *   rpc .foo.Service.Fetch()
     *
     * If `includeFileInfo` is set, the name of the file containing
     * the descriptor is added, including line number.
     */
    formatQualifiedName(descriptor: AnyDescriptorProto, includeFileInfo?: boolean): string;


    /**
     * Returns field declaration, similar to how it appeared
     * in the .proto file.
     *
     * Examples:
     *   repeated string foo = 1 [deprecated = true];
     *   .foo.Bar bar = 2 [json_name = "baz"];
     *   map<string, .foo.Bar> map = 3;
     *   uint64 foo = 4 [jstype = JS_NUMBER];
     */
    formatFieldDeclaration(descriptor: FieldDescriptorProto): string;


    /**
     * Returns declaration of enum value, similar to how it
     * appeared in the .proto file.
     *
     * Examples:
     *   STATE_UNKNOWN = 0;
     *   STATE_READY = 1 [deprecated = true];
     */
    formatEnumValueDeclaration(descriptor: EnumValueDescriptorProto): string;


    /**
     * Returns declaration of an rpc method, similar to how
     * it appeared in the .proto file, but does not show any options.
     *
     * Examples:
     *   rpc Fetch(FetchRequest) returns (stream FetchResponse);
     */
    formatRpcDeclaration(descriptor: MethodDescriptorProto): string;

}


export class StringFormat implements IStringFormat {

    private readonly nameLookup: ITypeNameLookup;
    private readonly treeLookup: IDescriptorTree;
    private readonly sourceCodeLookup: ISourceCodeInfoLookup;
    private readonly descriptorInfo: IDescriptorInfo;

    constructor(lookup: ITypeNameLookup & IDescriptorTree & ISourceCodeInfoLookup & IDescriptorInfo);
    constructor(nameLookup: ITypeNameLookup, treeLookup: IDescriptorTree, sourceCodeLookup: ISourceCodeInfoLookup, descriptorInfo: IDescriptorInfo);
    constructor(a: any, b?: any, c?: any, d?: any) {
        if (b === undefined) {
            this.nameLookup = a;
            this.treeLookup = a;
            this.sourceCodeLookup = a;
            this.descriptorInfo = a;
        } else {
            this.nameLookup = a;
            this.treeLookup = b;
            this.sourceCodeLookup = c;
            this.descriptorInfo = d;
        }
    }


    /**
     * Returns name of a scalar value type like it would
     * appear in a .proto.
     *
     * For example, `FieldDescriptorProto_Type.UINT32` -> `"uint32"`.
     */
    static formatScalarType(type: ScalarValueType): string {
        let name = FieldDescriptorProto_Type[type];
        assert(name !== undefined, "unexpected ScalarValueType " + type);
        return name.toLowerCase();
    }


    /**
     * Returns type ('message', 'field', etc.) and descriptor name.
     *
     * Examples:
     *   message Bar
     *   field value = 2
     *   rpc Fetch()
     */
    static formatName(descriptor: AnyDescriptorProto): string {
        if (FileDescriptorProto.is(descriptor)) {
            return `file ${descriptor.name}`;
        } else if (DescriptorProto.is(descriptor)) {
            return `message ${descriptor.name}`;
        } else if (FieldDescriptorProto.is(descriptor)) {
            if (descriptor.extendee !== undefined) {
                return `extension field ${descriptor.name} = ${descriptor.number}`;
            }
            return `field ${descriptor.name} = ${descriptor.number}`;
        } else if (EnumDescriptorProto.is(descriptor)) {
            return `enum ${descriptor.name}`;
        } else if (EnumValueDescriptorProto.is(descriptor)) {
            return `enum value ${descriptor.name} = ${descriptor.number}`;
        } else if (ServiceDescriptorProto.is(descriptor)) {
            return `service ${descriptor.name}`;
        } else if (MethodDescriptorProto.is(descriptor)) {
            return `rpc ${descriptor.name}()`;
        } else
            // noinspection SuspiciousTypeOfGuard
        if (OneofDescriptorProto.is(descriptor)) {
            return `oneof ${descriptor.name}`;
        }
        assertNever(descriptor);
        assert(false);
    }


    formatQualifiedName(descriptor: AnyDescriptorProto, includeFileInfo: boolean): string {
        if (FileDescriptorProto.is(descriptor)) {
            return `file ${descriptor.name}`;
        }

        const file = includeFileInfo ? ' in ' + getSourceWithLineNo(descriptor, this.treeLookup, this.sourceCodeLookup) : '';

        if (DescriptorProto.is(descriptor)) {
            return `message ${this.nameLookup.makeTypeName(descriptor)}${file}`;
        }
        if (EnumDescriptorProto.is(descriptor)) {
            return `enum ${this.nameLookup.makeTypeName(descriptor)}${file}`;
        }
        if (ServiceDescriptorProto.is(descriptor)) {
            return `service ${this.nameLookup.makeTypeName(descriptor)}${file}`;
        }

        let parent = this.treeLookup.parentOf(descriptor);

        if (FieldDescriptorProto.is(descriptor) && this.descriptorInfo.isExtension(descriptor)) {
            let extensionName = this.descriptorInfo.getExtensionName(descriptor);
            assert(descriptor.extendee);
            let extendeeTypeName = this.nameLookup.normalizeTypeName(descriptor.extendee);
            return `extension ${extendeeTypeName}.(${extensionName})${file}`;
        }

        assert(isAnyTypeDescriptorProto(parent));
        let parentTypeName = this.nameLookup.makeTypeName(parent);

        if (FieldDescriptorProto.is(descriptor)) {
            return `field ${parentTypeName}.${descriptor.name}${file}`;
        }

        if (EnumValueDescriptorProto.is(descriptor)) {
            return `enum value ${parentTypeName}.${descriptor.name}${file}`;
        }
        if (MethodDescriptorProto.is(descriptor)) {
            return `rpc ${parentTypeName}.${descriptor.name}()${file}`;
        }
        return `oneof ${parentTypeName}.${descriptor.name}${file}`;
    }

    formatName(descriptor: AnyDescriptorProto): string {
        return StringFormat.formatName(descriptor);
    }

    formatFieldDeclaration(descriptor: FieldDescriptorProto): string {
        let text = '';

        // repeated ?
        if (this.descriptorInfo.isUserDeclaredRepeated(descriptor)) {
            text += 'repeated ';
        }

        // optional ?
        if (this.descriptorInfo.isUserDeclaredOptional(descriptor)) {
            text += 'optional ';
        }

        switch (descriptor.type) {
            case FieldDescriptorProto_Type.ENUM:
                text += this.nameLookup.makeTypeName(
                    this.descriptorInfo.getEnumFieldEnum(descriptor)
                );
                break;

            case FieldDescriptorProto_Type.MESSAGE:
                if (this.descriptorInfo.isMapField(descriptor)) {
                    let mapK = StringFormat.formatScalarType(
                        this.descriptorInfo.getMapKeyType(descriptor)
                    );
                    let mapVType = this.descriptorInfo.getMapValueType(descriptor);
                    let mapV = typeof mapVType === "number"
                        ? StringFormat.formatScalarType(mapVType)
                        : this.nameLookup.makeTypeName(mapVType);
                    text += `map<${mapK}, ${mapV}>`;
                } else {
                    text += this.nameLookup.makeTypeName(
                        this.descriptorInfo.getMessageFieldMessage(descriptor)
                    );
                }
                break;
            case FieldDescriptorProto_Type.DOUBLE:
            case FieldDescriptorProto_Type.FLOAT:
            case FieldDescriptorProto_Type.INT64:
            case FieldDescriptorProto_Type.UINT64:
            case FieldDescriptorProto_Type.INT32:
            case FieldDescriptorProto_Type.FIXED64:
            case FieldDescriptorProto_Type.FIXED32:
            case FieldDescriptorProto_Type.BOOL:
            case FieldDescriptorProto_Type.STRING:
            case FieldDescriptorProto_Type.BYTES:
            case FieldDescriptorProto_Type.UINT32:
            case FieldDescriptorProto_Type.SFIXED32:
            case FieldDescriptorProto_Type.SFIXED64:
            case FieldDescriptorProto_Type.SINT32:
            case FieldDescriptorProto_Type.SINT64:
                text += StringFormat.formatScalarType(descriptor.type);
                break;
            case FieldDescriptorProto_Type.GROUP:
                text += "group";
                break;
            case FieldDescriptorProto_Type.UNSPECIFIED$:
                text += "???";
                break;
        }

        // name
        text += ' ' + descriptor.name;

        // number
        text += ' = ' + descriptor.number;

        // options
        let options = [];
        if (this.descriptorInfo.isExplicitlyDeclaredDeprecated(descriptor)) {
            options.push('deprecated = true');
        }
        if (this.descriptorInfo.getFieldCustomJsonName(descriptor)) {
            options.push(`json_name = "${this.descriptorInfo.getFieldCustomJsonName(descriptor)}"`);
        }
        if (descriptor.options?.jstype == FieldOptions_JSType.JS_STRING) {
            options.push(`jstype = JS_STRING`);
        }
        if (descriptor.options?.jstype == FieldOptions_JSType.JS_NUMBER) {
            options.push(`jstype = JS_NUMBER`);
        }
        if (descriptor.options?.jstype == FieldOptions_JSType.JS_NORMAL) {
            options.push(`jstype = JS_NORMAL`);
        }        
        if (descriptor.options?.packed === true) {
            options.push(`packed = true`);
        }
        if (descriptor.options?.packed === false) {
            options.push(`packed = false`);
        }
        if (options.length) {
            text += ' [' + options.join(', ') + ']';
        }

        // semicolon
        text += ';';
        return text;
    }

    formatEnumValueDeclaration(descriptor: EnumValueDescriptorProto): string {
        let text = `${descriptor.name} = ${descriptor.number}`;
        if (this.descriptorInfo.isExplicitlyDeclaredDeprecated(descriptor)) {
            text += ' [deprecated = true]';
        }
        return text + ';';
    }

    formatRpcDeclaration(descriptor: MethodDescriptorProto): string {
        this.descriptorInfo.isExplicitlyDeclaredDeprecated(descriptor)
        let
            m = descriptor.name!,
            i = descriptor.inputType!,
            is = descriptor.clientStreaming ? 'stream ' : '',
            o = descriptor.outputType!,
            os = descriptor.serverStreaming ? 'stream ' : '';
        if (i.startsWith('.')) {
            i = i.substring(1);
        }
        if (o.startsWith('.')) {
            o = o.substring(1);
        }
        return `${m}(${is}${i}) returns (${os}${o});`;
    }


}


function getSourceWithLineNo(descriptor: AnyDescriptorProto, treeLookup: IDescriptorTree, sourceCodeLookup: ISourceCodeInfoLookup): string {
    let
        file = treeLookup.fileOf(descriptor),
        [l] = sourceCodeLookup.sourceCodeCursor(descriptor);
    return `${file.name}:${l}`;
}
