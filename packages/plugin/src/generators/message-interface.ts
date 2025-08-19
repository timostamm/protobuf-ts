import {DescField, DescMessage, ScalarType} from "@bufbuild/protobuf";
import {FieldDescriptorProto_Type} from "@bufbuild/protobuf/wkt";
import * as rt from "@protobuf-ts/runtime";
import {LongType} from "@protobuf-ts/runtime";
import {
    createExportStatement,
    createImportSymbol,
    createLiteralString,
    ImportSymbol
} from "@bufbuild/protoplugin-print";
import {createLocalTypeName} from "../local-type-name";
import {Printable} from "../printable";
import {leadingDoc, trailingDoc} from "../comments";
import {importEnum} from "./enum";
import {File, Schema} from "../schema";

export function importMessageInterface(desc: DescMessage): ImportSymbol {
    return createImportSymbol(
        createLocalTypeName(desc),
        "./" + desc.file.name + ".js",
        true,
    );
}

export function printMessageInterface(schema: Schema, file: File, desc: DescMessage): void {
    file.println(leadingDoc(desc, {
        includeTrailingComments: true,
    }));
    file.println(createExportStatement("interface", importMessageInterface(desc).name), " {");
    for (const member of desc.members) {
        switch (member.kind) {
            case "field":
                if (member.proto.type === FieldDescriptorProto_Type.GROUP) {
                    continue;
                }
                const fieldInfo = schema.interpreter.getFieldInfo(member);
                file.println(leadingDoc(member, {
                    indentation: "    ",
                    includeTrailingComments: false,
                }));
                const longType = schema.interpreter.getFieldLongType(member);
                file.println("    ", fieldInfo.localName, fieldInfo.opt ? "?: " : ": ", getFieldTsType(member, longType), ";", trailingDoc(member, {
                    indentation: "    ",
                }));
                break;
            case "oneof":
                file.println(leadingDoc(member, {
                    indentation: "    ",
                    includeTrailingComments: true,
                }));
                file.println("    ", member.localName, ": {");
                for (const field of member.fields) {
                    if (field.proto.type === FieldDescriptorProto_Type.GROUP) {
                        continue;
                    }
                    const fieldInfo = schema.interpreter.getFieldInfo(field);
                    file.println("        oneofKind: ", createLiteralString(fieldInfo.localName), ";");
                    file.println(leadingDoc(field, {
                        indentation: "        ",
                    }));
                    const longType = schema.interpreter.getFieldLongType(field);
                    file.println("        ", fieldInfo.localName, ": ", getFieldTsType(field, longType), ";");
                    file.println("    } | {");
                }
                file.println("        oneofKind: undefined;")
                file.println("    };");
                break;
        }
    }
    file.println("}");
}

function getFieldTsType(field: DescField, longType?: rt.LongType): Printable {
    switch (field.fieldKind) {
        case "enum":
            return importEnum(field.enum).toTypeOnly();
        case "message":
            return importMessageInterface(field.message);
        case "scalar":
            return getScalarTsType(field.scalar, longType)
        case "list":
            switch (field.listKind) {
                case "enum":
                    return [importEnum(field.enum).toTypeOnly(), "[]"];
                case "message":
                    return [importMessageInterface(field.message), "[]"];
                case "scalar":
                    return [getScalarTsType(field.scalar, longType), "[]"];
            }
        case "map":
            const keyType: Printable = field.mapKey === ScalarType.BOOL ? "string" : getScalarTsType(field.mapKey, LongType.STRING);
            let valueType: Printable;
            switch (field.mapKind) {
                case "enum":
                    valueType = importEnum(field.enum).toTypeOnly();
                    break;
                case "message":
                    valueType = importMessageInterface(field.message);
                    break;
                case "scalar":
                    valueType = getScalarTsType(field.scalar, longType);
                    break;
            }
            // TODO
            return ["{\n        [key: ", keyType, "]: ", valueType, ";\n    }"];
    }
}

function getScalarTsType(scalar: ScalarType, longType?: rt.LongType): Printable {
    switch (scalar) {
        case ScalarType.BOOL:
            return "boolean";
        case ScalarType.STRING:
            return "string";
        case ScalarType.BYTES:
            return "Uint8Array";
        case ScalarType.DOUBLE:
        case ScalarType.FLOAT:
        case ScalarType.INT32:
        case ScalarType.FIXED32:
        case ScalarType.UINT32:
        case ScalarType.SFIXED32:
        case ScalarType.SINT32:
            return "number";
        case ScalarType.SFIXED64:
        case ScalarType.INT64:
        case ScalarType.UINT64:
        case ScalarType.FIXED64:
        case ScalarType.SINT64:
            switch (longType ?? rt.LongType.STRING) {
                case rt.LongType.STRING:
                    return "string";
                case rt.LongType.NUMBER:
                    return "number";
                case rt.LongType.BIGINT:
                    return "bigint";
            }
    }
}
