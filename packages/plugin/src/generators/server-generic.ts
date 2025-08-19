import {DescService} from "@bufbuild/protobuf";
import {File, Schema} from "../schema";
import {leadingDoc} from "../comments";
import {createExportStatement, createImportSymbol, ImportSymbol} from "@bufbuild/protoplugin-print";
import {createLocalTypeName} from "../local-type-name";
import {importMessageInterface} from "./message-interface";

export function importServerInterface(desc: DescService): ImportSymbol {
    const basename = createLocalTypeName(desc);
    const interfaceName = `I${basename}`;
    return createImportSymbol(
        interfaceName,
        "./" + desc.file.name + ".server.js",
        false,
    );
}

export function printServerInterface(schema: Schema, file: File, desc: DescService): void {
    const ServerCallContext = createImportSymbol("ServerCallContext", "@protobuf-ts/runtime-rpc", true);
    const RpcInputStream = createImportSymbol("RpcInputStream", "@protobuf-ts/runtime-rpc", true);
    const RpcOutputStream = createImportSymbol("RpcOutputStream", "@protobuf-ts/runtime-rpc", true);
    file.println(leadingDoc(desc, {
        includeTrailingComments: true,
    }));
    file.println(createExportStatement("interface", importServerInterface(desc).name), "<T = ", ServerCallContext, "> {");
    for (const method of desc.methods) {
        const localName = schema.interpreter.getMethodInfo(method).localName;
        const I = importMessageInterface(method.input);
        const O = importMessageInterface(method.output);
        file.println(leadingDoc(method, {
            indentation: "    ",
            includeTrailingComments: false,
        }));
        switch (method.methodKind) {
            case "unary":
                file.println("    ", localName, "(request: ", I, ", context: T): Promise<", O, ">;");
                break;
            case "server_streaming":
                file.println("    ", localName, "(request: ", I, ", responses: ", RpcInputStream, "<", O, ">", ", context: T): Promise<void>;");
                break;
            case "client_streaming":
                file.println("    ", localName, "(requests: ", RpcOutputStream, "<", I, ">, context: T): Promise<", O, ">;");
                break;
            case "bidi_streaming":
                file.println("    ", localName, "(requests: ", RpcOutputStream, "<", I, ">, responses: ", RpcInputStream, "<", O, ">", ", context: T): Promise<void>;");
                break;
        }
    }
    file.println("}");
}
