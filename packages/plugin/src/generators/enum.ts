import {DescEnum} from "@bufbuild/protobuf";
import {File, Schema} from "../schema";
import {listEnumValues} from "@protobuf-ts/runtime";
import {createExportStatement, createImportSymbol, createJsDocBlock, ImportSymbol} from "@bufbuild/protoplugin-print";
import {createLocalTypeName} from "../local-type-name";
import {leadingDoc} from "../comments";

export function importEnum(desc: DescEnum): ImportSymbol {
    return createImportSymbol(
        createLocalTypeName(desc),
        "./" + desc.file.name + ".js",
    );
}

export function printEnum(schema: Schema, file: File, desc: DescEnum): void {
    const enumObject = schema.interpreter.getEnumInfo(desc)[1];
    file.println(leadingDoc(desc, {
        includeTrailingComments: true,
    }));
    file.println(createExportStatement("enum", importEnum(desc).name), " {");
    const enumObjectVals = listEnumValues(enumObject);
    for (const [index, enumObjectVal] of enumObjectVals.entries()) {
        const descEnumValue = desc.values.find(v => v.localName === enumObjectVal.name)
            ?? desc.values.find(v => v.name === enumObjectVal.name)
            ?? desc.values.find(v => v.number === enumObjectVal.number);
        if (descEnumValue) {
            file.println(leadingDoc(descEnumValue, {
                indentation: "    ",
                includeTrailingComments: true,
            }));
        } else {
            file.println(createJsDocBlock("@generated synthetic value - protobuf-ts requires all enums to have a 0 value", "    "));
        }
        const trailingComma = index < enumObjectVals.length -1 ? "," : "";
        file.println("    ", enumObjectVal.name, " = ", enumObjectVal.number, trailingComma);
    }
    file.println("}");
}

