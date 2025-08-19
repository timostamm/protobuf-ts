import {DescEnum, DescField, DescMessage, ScalarType} from "@bufbuild/protobuf";
import {getDeclarationString} from "@bufbuild/protoplugin";
import {qualifiedName} from "@bufbuild/protobuf/reflect";
import {FieldDescriptorProto_Type, FileOptions_OptimizeMode} from "@bufbuild/protobuf/wkt";
import {File, Schema} from "../schema";
import {
    createExportStatement,
    createImportSymbol,
    createJsDocBlock,
    createLiteralArray,
    createLiteralString,
    ImportSymbol
} from "@bufbuild/protoplugin-print";
import * as rt from "@protobuf-ts/runtime";
import {EnumInfo, LongType, PartialFieldInfo, reflectionScalarDefault, RepeatType} from "@protobuf-ts/runtime";
import {Printable} from "../printable";
import {importEnum} from "./enum";
import {createLocalTypeName} from "../local-type-name";
import {importMessageInterface} from "./message-interface";
import {Interpreter} from "../interpreter";
import {wireTypeFromScalar} from "../wire-type-scalar";
import {makeDeprecatedTag} from "../comments";
import {literalValue} from "../literal-value";
import {printGoogleTypeMethods} from "./message-type-google-types";
import {printWellKnownTypeMethods} from "./message-type-well-known-types";

export function importMessageType(desc: DescMessage): ImportSymbol {
    return createImportSymbol(
        createLocalTypeName(desc),
        "./" + desc.file.name + ".js",
        false,
    );
}

export function printMessageType(schema: Schema, file: File, desc: DescMessage): void {
    file.println("// @generated message type with reflection information, may provide speed optimized methods");
    const MessageType = createImportSymbol(
        "MessageType",
        "@protobuf-ts/runtime",
        false,
    );
    const messageInterface = importMessageInterface(desc);
    const messageOptions = schema.interpreter.getMessageType(desc).options;
    const className = messageInterface.name + "$Type";
    let superArgs: Printable[] = [
        createLiteralString(desc.typeName),
        fieldInfos(schema, desc, "        "),
    ];
    if (Object.keys(messageOptions).length) {
        superArgs.push(literalValue(messageOptions));
    }
    superArgs = superArgs.map((p, i) => i ? [", ", p] : p);
    file.println("class ", className, " extends ", MessageType, "<", messageInterface, "> {");
    file.println("    constructor() {");
    file.println("        super(", superArgs, ");");
    file.println("    }");
    printGoogleTypeMethods(schema, file, desc);
    printWellKnownTypeMethods(schema, file, desc);
    if (schema.options.getOptimizeMode(desc.file) === FileOptions_OptimizeMode.SPEED) {
        printCreateMethod(schema, file, desc);
        printInternalBinaryReadMethod(schema, file, desc);
        printInternalBinaryWriteMethod(schema, file, desc);
    }
    file.println("}");
    file.println(createJsDocBlock(`${makeDeprecatedTag(desc)}@generated MessageType for protobuf ${desc.toString()}`));
    file.println(createExportStatement("const", messageInterface.name), " = new ", className, "();");
}

// internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MessageFieldMessage_TestMessage): MessageFieldMessage_TestMessage {
function printInternalBinaryReadMethod(schema: Schema, file: File, desc: DescMessage): void {
    function readerCall(schema: Schema, field: DescField): Printable {
        if (field.message !== undefined) {
            const fi = schema.interpreter.getFieldInfo(field);
            const args: Printable[] = ["reader, ", "reader.uint32(), options"];
            if (field.fieldKind === "message") {
                // only for singular message fields, pass the existing message
                if (fi.oneof) {
                    args.push(", message.", fi.oneof, ".oneofKind === ", createLiteralString(fi.localName), " ? message.", fi.oneof, ".", fi.localName, " : undefined");
                } else {
                    args.push(", message.", fi.localName);
                }
            }
            return [importMessageType(field.message), ".internalBinaryRead(", args, ")"];
        }
        if (field.scalar !== undefined) {
            return readerCallScalar(field.scalar, schema.interpreter.getFieldLongType(field) ?? LongType.STRING);
        }
        // enum
        return ["reader.int32()"];
    }
    function readerCallScalar(scalar: ScalarType, longType: LongType): Printable {
        const read = ["reader.", ScalarType[scalar].toLowerCase(), "()"];
        if (Interpreter.isLongValueType(scalar)) {
            switch (longType) {
                case LongType.STRING:
                    read.push(".toString()");
                    break;
                case LongType.BIGINT:
                    read.push(".toBigInt()");
                    break;
                case LongType.NUMBER:
                    read.push(".toNumber()");
                    break;
            }
        }
        return read;
    }
    const IBinaryReader = createImportSymbol("IBinaryReader", "@protobuf-ts/runtime", true);
    const BinaryReadOptions = createImportSymbol("BinaryReadOptions", "@protobuf-ts/runtime", true);
    const UnknownFieldHandler = createImportSymbol("UnknownFieldHandler", "@protobuf-ts/runtime", false);
    const WireType = createImportSymbol("WireType", "@protobuf-ts/runtime", false);
    const messageInterface = importMessageInterface(desc);
    file.println("    internalBinaryRead(reader: ", IBinaryReader, ", ", "length: number, options: ", BinaryReadOptions, ", target?: ", messageInterface, "): ", messageInterface, " {");
    file.println("        let message = target ?? this.create(), end = reader.pos + length;");
    file.println("        while (reader.pos < end) {");
    file.println("            let [fieldNo, wireType] = reader.tag();");
    file.println("            switch (fieldNo) {");
    for (const field of desc.fields) {
        if (field.proto.type === FieldDescriptorProto_Type.GROUP) {
            continue;
        }
        const fi = schema.interpreter.getFieldInfo(field);
        const decl = getDeclarationString(field);
        const comment = "/* " + (decl.endsWith("]") ? decl : decl.replace(/ = \d+/, "")) + " */";
        file.println("                case ", comment, " ", field.number, ":");
        switch (field.fieldKind) {
            case "scalar":
            case "enum":
            case "message": {
                const read = readerCall(schema, field);
                if (fi.oneof) {
                    file.println("                    message.", fi.oneof, " = {");
                    file.println("                        oneofKind: ", createLiteralString(fi.localName), ",");
                    file.println("                        ", fi.localName, ": ", read);
                    file.println("                    };");
                } else {
                    file.println("                    message.", fi.localName, " = ", read, ";");
                }
                break;
            }
            case "list": {
                const read = readerCall(schema, field);
                const canPack = field.listKind === "enum" || (field.listKind === "scalar" && ![ScalarType.STRING, ScalarType.BYTES].includes(field.scalar));
                if (canPack) {
                    file.println("                    if (wireType === ", WireType, ".LengthDelimited)");
                    file.println("                        for (let e = reader.int32() + reader.pos; reader.pos < e;)");
                    file.println("                            message.", fi.localName, ".push(", read, ");");
                    file.println("                    else");
                    file.println("                        message.", fi.localName, ".push(", read, ");");
                } else {
                    file.println("                    message.", fi.localName, ".push(", read, ");");
                }
                break;
            }
            case "map": {
                file.println("                    this.binaryReadMap", field.number, "(message.", fi.localName, ", reader, options);");
                break;
            }
        }
        file.println("                    break;");
    }
    file.println("                default:");
    file.println("                    let u = options.readUnknownField;");
    file.println('                    if (u === "throw")');
    file.println('                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);');
    file.println("                    let d = reader.skip(wireType);");
    file.println("                    if (u !== false)");
    file.println("                        (u === true ? ", UnknownFieldHandler, ".onRead : u)(this.typeName, message, fieldNo, wireType, d);");
    file.println("            }");
    file.println("        }");
    file.println("        return message;");
    file.println("    }");
    for (const field of desc.fields) {
        if (field.fieldKind !== "map") {
            continue;
        }
        const fieldTypeRef = [messageInterface, "[", createLiteralString(field.localName), "]"];
        file.println("    private binaryReadMap", field.number, "(map: ", fieldTypeRef, ", reader: ", IBinaryReader, ", options: ", BinaryReadOptions, "): void {");
        file.println("        let len = reader.uint32(), end = reader.pos + len, key: keyof ", fieldTypeRef, " | undefined, val: ", fieldTypeRef, "[any] | undefined;");
        file.println("        while (reader.pos < end) {");
        file.println("            let [fieldNo, wireType] = reader.tag();");
        file.println("            switch (fieldNo) {");
        file.println("                case 1:");
        const mapKeyToString = field.mapKey === ScalarType.BOOL;
        file.println("                    key = ", readerCallScalar(field.mapKey, LongType.STRING), mapKeyToString ? ".toString()" : "", ";");
        file.println("                    break;");
        file.println("                case 2:");
        file.println("                    val = ", readerCall(schema, field), ";");
        file.println("                    break;");
        file.println('                default: throw new globalThis.Error("unknown map entry field for ', qualifiedName(field), '");');
        file.println("            }");
        file.println("        }");
        let defaultKey: Printable = reflectionScalarDefault(field.mapKey);
        if (typeof defaultKey !== "number") {
            defaultKey = defaultKey.toString();
        }
        defaultKey = literalValue(defaultKey);
        let defaultValue: Printable;
        switch (field.mapKind) {
            case "scalar":
                defaultValue = literalValue(reflectionScalarDefault(field.scalar, schema.options.normalLongType));
                break;
            case "message":
                defaultValue = [importMessageType(field.message), ".create()"];
                break;
            case "enum":
                defaultValue = 0;
                break;
        }
        file.println("        map[key ?? ", defaultKey, "] = val ?? ", defaultValue, ";");
        file.println("    }");
    }
}

// internalBinaryWrite(message: ScalarValuesMessage, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
function printInternalBinaryWriteMethod(schema: Schema, file: File, desc: DescMessage): void {
    const IBinaryWriter = createImportSymbol("IBinaryWriter", "@protobuf-ts/runtime", true);
    const BinaryWriteOptions = createImportSymbol("BinaryWriteOptions", "@protobuf-ts/runtime", true);
    const UnknownFieldHandler = createImportSymbol("UnknownFieldHandler", "@protobuf-ts/runtime", false);
    const WireType = createImportSymbol("WireType", "@protobuf-ts/runtime", false);
    const messageInterface = importMessageInterface(desc);
    file.println("    internalBinaryWrite(message: ", messageInterface, ", ", "writer: ", IBinaryWriter, ", options: ", BinaryWriteOptions, "): ", IBinaryWriter, " {");
    function isSetExpression(field: DescField): Printable {
        const fi = schema.interpreter.getFieldInfo(field);
        switch (field.fieldKind) {
            case "scalar":
            case "enum":
            case "message":
                if (fi.oneof) {
                    return ["message.", fi.oneof, ".oneofKind === ", createLiteralString(fi.localName)];
                }
                if (fi.kind === "message") {
                    return ["message.", fi.localName];
                }
                if (fi.opt) {
                    return ["message.", fi.localName, " !== undefined"];
                }
                if (field.scalar === ScalarType.BYTES) {
                    return ["message.", fi.localName, ".length"];
                }
                const defaultMessage = schema.interpreter.getMessageType(desc).create();
                return ["message.", fi.localName, " !== ", literalValue(defaultMessage[fi.localName])];
            case "list": {
                return ["message.", fi.localName, ".length"];
            }
            case "map":
                return ["globalThis.Object.keys(message.", fi.localName, ").length"];
        }
    }
    function writerCall(field: DescField, opt?: {fieldPropAccess?: Printable, noTag?: boolean}): Printable {
        const fi = schema.interpreter.getFieldInfo(field);
        const fieldPropAccess = opt?.fieldPropAccess ?? ["message.", fi.oneof ? ([fi.oneof, ".", fi.localName]) : fi.localName];
        if (field.enum || field.scalar !== undefined) {
            const scalar = field.scalar ?? ScalarType.INT32;
            if (opt?.noTag) {
                return ["writer.", ScalarType[scalar].toLowerCase(), "(", fieldPropAccess, ")"];
            }
            const wireType = wireTypeFromScalar(scalar);
            return ["writer.tag(", field.number, ", ", WireType, ".", rt.WireType[wireType], ").", ScalarType[scalar].toLowerCase(), "(", fieldPropAccess, ")"];
        }
        const messageType = importMessageType(field.message);
        const args = [
            fieldPropAccess, ", ",
            opt?.noTag ? "writer, " : ["writer.tag(", field.number, ", ", WireType, ".LengthDelimited).fork(), "],
            "options",
        ];
        return [messageType, ".internalBinaryWrite(", args, ")", opt?.noTag ? "" : ".join()"];
    }
    for (const field of desc.fields.sort((a, b) => a.number - b.number)) {
        if (field.proto.type === FieldDescriptorProto_Type.GROUP) {
            continue;
        }
        const fi = schema.interpreter.getFieldInfo(field);
        file.println("        /* ", getDeclarationString(field), "; */");
        switch (field.fieldKind) {
            case "scalar":
            case "enum":
            case "message":
                file.println("        if (", isSetExpression(field), ")");
                file.println("            ", writerCall(field), ";");
                break;
            case "list": {
                if (fi.repeat === rt.RepeatType.PACKED) {
                    const fieldPropAccess = ["message.", fi.localName, "[i]"];
                    file.println("        if (", isSetExpression(field), ") {");
                    file.println("            writer.tag(", field.number, ", ", WireType, ".LengthDelimited).fork();");
                    file.println("            for (let i = 0; i < message.", fi.localName, ".length; i++)");
                    file.println("                ", writerCall(field, {fieldPropAccess, noTag: true}), ";");
                    file.println("            writer.join();");
                    file.println("        }");
                    break;
                } else {
                    file.println("        for (let i = 0; i < message.", fi.localName, ".length; i++)");
                    const fieldPropAccess = ["message.", fi.localName, "[i]"];
                    file.println("            ", writerCall(field, {fieldPropAccess}), ";");
                    break;
                }
            }
            case "map":
                let keyAccess: Printable;
                let fieldPropAccess: Printable;
                switch (field.mapKey) {
                    case ScalarType.BOOL:
                        keyAccess = ["k === ", createLiteralString("true")];
                        fieldPropAccess = ["message.", fi.localName, "[k]"];
                        break;
                    case ScalarType.INT32:
                    case ScalarType.UINT32:
                    case ScalarType.SINT32:
                    case ScalarType.FIXED32:
                    case ScalarType.SFIXED32:
                        keyAccess = "parseInt(k)";
                        fieldPropAccess = ["message.", fi.localName, "[", keyAccess, "]"];
                        break;
                    default:
                        keyAccess = "k";
                        fieldPropAccess = ["message.", fi.localName, "[", keyAccess, "]"];
                }
                const writeMessageStart = ["writer.tag(", field.number, ", ", WireType, ".LengthDelimited).fork()"];
                const wireTypeKey = wireTypeFromScalar(field.mapKey);
                const writeKey = [".tag(1, ", WireType, ".", rt.WireType[wireTypeKey], ").", ScalarType[field.mapKey].toLowerCase(), "(", keyAccess, ")"];
                switch (field.mapKind) {
                    case "scalar":
                    case "enum":
                        file.println("        for (let k of globalThis.Object.keys(message.", fi.localName, "))");
                        const scalar = field.scalar ?? ScalarType.INT32;
                        const wireTypeValue = wireTypeFromScalar(scalar);
                        const write = [
                            writeMessageStart, writeKey,
                            ".tag(2, ", WireType, ".", rt.WireType[wireTypeValue], ").", ScalarType[scalar].toLowerCase(), "(", fieldPropAccess, ")",
                            ".join()"
                        ];
                        file.println("            ", write, ";");
                        break;
                    case "message":
                        file.println("        for (let k of globalThis.Object.keys(message.", fi.localName, ")) {");
                        file.println("            ", writeMessageStart, writeKey, ";");
                        file.println("            writer.tag(2, ", WireType, ".LengthDelimited).fork();");
                        file.println("            ", writerCall(field, {fieldPropAccess, noTag: true}), ";");
                        file.println("            writer.join().join();");
                        file.println("        }");
                        break;
                }
                break;
        }
    }
    file.println("        let u = options.writeUnknownFields;");
    file.println("        if (u !== false)");
    file.println("            (u == true ? ", UnknownFieldHandler, ".onWrite : u)(this.typeName, message, writer);");
    file.println("        return writer;");
    file.println("    }");
}

// create(value?: PartialMessage<MessageFieldMessage>): MessageFieldMessage {
function printCreateMethod(schema: Schema, file: File, desc: DescMessage): void {
    const PartialMessage = createImportSymbol("PartialMessage", "@protobuf-ts/runtime", true);
    const reflectionMergePartial = createImportSymbol("reflectionMergePartial", "@protobuf-ts/runtime", false);
    const messageInterface = importMessageInterface(desc);
    file.println("    create(value?: ", PartialMessage, "<", messageInterface, ">): ", messageInterface, " {");
    file.println("        const message = globalThis.Object.create((this.messagePrototype!));");
    const messageType = schema.interpreter.getMessageType(desc);
    const defaultMessage = messageType.create();
    for (const [key, value] of Object.entries(defaultMessage)) {
        file.println("        message.", key, " = ", literalValue(value), ";");
    }
    file.println("        if (value !== undefined)");
    file.println("            ", reflectionMergePartial, "<", messageInterface, ">(this, message, value);");
    file.println("        return message;");
    file.println("    }")
}

function fieldInfos(schema: Schema, desc: DescMessage, indentation: string): Printable {
    if (desc.fields.length === 0) {
        return "[]";
    }
    const infos: Printable[][] = [];
    for (const field of desc.fields) {
        if (field.proto.type === FieldDescriptorProto_Type.GROUP) {
            continue;
        }
        infos.push(["    ", fieldInfo(field, schema.interpreter.getFieldInfoPartial(field))]);
    }
    return ["[\n", infos.map((p, index, arr) => [indentation, p, (index < arr.length - 1) ? ",\n" : "\n"]), indentation, "]"];
}

function fieldInfo(desc: DescField, fi: PartialFieldInfo): Printable {
    function fieldInfoScalar(scalar: ScalarType): Printable {
        return [scalar, " /*ScalarType.", ScalarType[scalar], "*/"];
    }
    function fieldInfoLong(longType: LongType): Printable {
        return [longType, " /*LongType.", LongType[longType], "*/"];
    }
    function fieldInfoMessage(desc: DescMessage): Printable {
        return ["() => ", importMessageType(desc)];
    }
    function fieldInfoEnum(desc: DescEnum, info: EnumInfo): Printable {
        const arr = createLiteralArray<Printable>([
            createLiteralString(desc.typeName),
            importEnum(desc),
        ]);
        const prefix = info[2];
        if (prefix !== undefined) {
            arr.elements.push(createLiteralString(prefix));
        }
        return ["() => ", arr];
    }
    function fieldInfoMapV(mapV: (rt.PartialFieldInfo & { kind: "map" })["V"], desc: DescField & {fieldKind: "map"}): Printable {
        let T: Printable;
        let lProp: Printable = [];
        switch (mapV.kind) {
            case "message":
                if (!desc.message) {
                    throw new Error(`Descriptor ${desc.toString()} is not an message, but field info is`);
                }
                T = fieldInfoMessage(desc.message);
                break;
            case "enum":
                if (!desc.enum) {
                    throw new Error(`Descriptor ${desc.toString()} is not an enum, but field info is`);
                }
                T = fieldInfoEnum(desc.enum, mapV.T());
                break;
            case "scalar":
                T = fieldInfoScalar(mapV.T)
                if (mapV.L !== undefined)
                    lProp = [", L: ", fieldInfoLong(mapV.L)];
                break;
        }
        return ["{ kind: ", createLiteralString(mapV.kind), ", T: ", T, lProp, " }"];
    }

    const props: Printable[][] = [];
    // no: The field number of the .proto field.
    // name: The original name of the .proto field.
    // kind: discriminator
    // localName: The name of the field in the runtime.
    // jsonName: The name of the field in JSON.
    // oneof: The name of the `oneof` group, if this field belongs to one.
    for (let key of ["no", "name", "kind", "localName", "jsonName", "oneof"] as const) {
        let val: Printable | undefined = fi[key];
        if (typeof val === "string") {
            val = createLiteralString(val);
        }
        if (val !== undefined) {
            props.push([key, ": ", val]);
        }
    }

    // repeat: Is the field repeated?
    if (fi.repeat !== undefined) {
        props.push(["repeat: ", fi.repeat, " /*RepeatType.", RepeatType[fi.repeat], "*/"]);
    }

    // opt: Is the field optional?
    if (fi.opt !== undefined) {
        props.push(["opt: ", fi.opt]);
    }

    switch (fi.kind) {
        case "scalar":
            props.push(["T: ", fieldInfoScalar(fi.T)]);
            if (fi.L !== undefined) {
                props.push(["L: ", fieldInfoLong(fi.L)]);
            }
            break;
        case "enum":
            if (!desc.enum) {
                throw new Error(`Descriptor ${desc.toString()} is not an enum, but field info is`);
            }
            props.push(["T: ", fieldInfoEnum(desc.enum, fi.T())]);
            break;
        case "message":
            if (!desc.message) {
                throw new Error(`Descriptor ${desc.toString()} is not a message, but field info is`);
            }
            props.push(["T: ", fieldInfoMessage(desc.message)]);
            break;
        case "map":
            if (desc.fieldKind !== "map") {
                throw new Error(`Descriptor ${desc.toString()} is not a map, but field info is`);
            }
            props.push(["K: ", fieldInfoScalar(fi.K)]);
            props.push(["V: ", fieldInfoMapV(fi.V, desc)]);
            break;
    }
    if (fi.options) {
        props.push(["options: ", literalValue(fi.options)]);
    }
    return ["{ ", props.map((p, i) => i ? [", ", p] : p), " }"];
}

