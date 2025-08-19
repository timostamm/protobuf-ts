import {DescService} from "@bufbuild/protobuf";
import {File, Schema} from "../schema";
import {
    createExportStatement,
    createImportSymbol,
    createJsDocBlock,
    createLiteralString,
    ImportSymbol
} from "@bufbuild/protoplugin-print";
import {Printable} from "../printable";
import {createLocalTypeName} from "../local-type-name";
import {makeDeprecatedTag} from "../comments";
import {importMessageType} from "./message-type";
import {literalValue} from "../literal-value";

export function importServiceType(desc: DescService): ImportSymbol {
    return createImportSymbol(
        createLocalTypeName(desc),
        "./" + desc.file.name + ".js",
        false,
    );
}

// export const ExampleService = new ServiceType("spec.ExampleService", [
export function printServiceType(schema: Schema, file: File, desc: DescService): void {
    const ServiceType = createImportSymbol(
        "ServiceType",
        "@protobuf-ts/runtime-rpc",
        false,
    );
    file.println(createJsDocBlock(`${makeDeprecatedTag(desc)}@generated ServiceType for protobuf ${desc.toString()}`));
    file.print(createExportStatement("const", importServiceType(desc).name), " = new ", ServiceType, "(", createLiteralString(desc.typeName), ", [");
    for (const [index, method] of desc.methods.entries()) {
        if (index === 0) {
            file.println();
        }
        const mi = schema.interpreter.getMethodInfoPartial(method);
        const props: Printable[][] = [
            ["name: ", createLiteralString(method.name)],
        ];
        if (mi.serverStreaming !== undefined) {
            props.push(["serverStreaming: ", literalValue(mi.serverStreaming)]);
        }
        if (mi.clientStreaming !== undefined) {
            props.push(["clientStreaming: ", literalValue(mi.clientStreaming)]);
        }
        if (mi.idempotency !== undefined) {
            props.push(["idempotency: ", createLiteralString(mi.idempotency)]);
        }
        props.push(["options: ", literalValue(mi.options)]);
        props.push(["I: ", importMessageType(method.input)]);
        props.push(["O: ", importMessageType(method.output)]);
        file.println("    { ", props.map((p, i) => i ? [", ", p] : p), " }", (index < desc.methods.length -1 ? "," : ""));
    }
    file.print("]");
    const serviceOptions = schema.interpreter.getServiceType(desc).options;
    if (Object.keys(serviceOptions).length) {
        file.print(", ", literalValue(serviceOptions));
    }
    file.println(");");
}
