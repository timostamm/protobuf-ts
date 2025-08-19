import {DescMethod, DescService} from "@bufbuild/protobuf";
import {File, Schema} from "../schema";
import {createExportStatement, createImportSymbol, ImportSymbol} from "@bufbuild/protoplugin-print";
import {createLocalTypeName} from "../local-type-name";
import {leadingDoc} from "../comments";
import {importMessageInterface} from "./message-interface";
import {importServiceType} from "./service-type";
import {Printable} from "../printable";

export function importClientInterface(desc: DescService): ImportSymbol {
    const basename = createLocalTypeName(desc);
    const interfaceName = `I${basename}Client`;
    return createImportSymbol(
        interfaceName,
        "./" + desc.file.name + ".client.js",
        false,
    );
}

export function importClient(desc: DescService): ImportSymbol {
    const basename = createLocalTypeName(desc);
    const interfaceName = `${basename}Client`;
    return createImportSymbol(
        interfaceName,
        "./" + desc.file.name + ".client.js",
        false,
    );
}

export function printClientInterface(schema: Schema, file: File, desc: DescService): void {
    file.println(leadingDoc(desc, {
        includeTrailingComments: true,
    }));
    file.println(createExportStatement("interface", importClientInterface(desc).name), " {");
    for (const method of desc.methods) {
        file.println(leadingDoc(method, {
            indentation: "    ",
            includeTrailingComments: false,
        }));
        file.println("    ", methodSignature(schema, method), ";");
    }
    file.println("}");
}

export function printClientGeneric(schema: Schema, file: File, desc: DescService): void {
    const ServiceInfo = createImportSymbol("ServiceInfo", "@protobuf-ts/runtime-rpc", true);
    const stackIntercept = createImportSymbol("stackIntercept", "@protobuf-ts/runtime-rpc", false);
    const RpcTransport = createImportSymbol("RpcTransport", "@protobuf-ts/runtime-rpc", true);
    file.println(leadingDoc(desc, {
        includeTrailingComments: true,
    }));
    const serviceType = importServiceType(desc);
    file.println(createExportStatement("class", importClient(desc).name), " implements ", importClientInterface(desc), ", ", ServiceInfo, " {");
    file.println("    typeName = ", serviceType, ".typeName;");
    file.println("    methods = ", serviceType, ".methods;");
    file.println("    options = ", serviceType, ".options;");
    file.println("    constructor(private readonly _transport: ", RpcTransport, ") {");
    file.println("    }");
    for (const method of desc.methods) {
        file.println(leadingDoc(method, {
            indentation: "    ",
            includeTrailingComments: false,
        }));
        file.println("    ", methodSignature(schema, method), " {");
        const index = desc.methods.indexOf(method);
        file.println("        const method = this.methods[", index, "], opt = this._transport.mergeOptions(options);");
        const I = importMessageInterface(method.input);
        const O = importMessageInterface(method.output);
        switch (method.methodKind) {
            case "unary":
                file.println("        return ", stackIntercept, "<", I, ", ", O, ">(\"unary\", this._transport, method, opt, input);");
                break;
            case "server_streaming":
                file.println("        return ", stackIntercept, "<", I, ", ", O, ">(\"serverStreaming\", this._transport, method, opt, input);");
                break;
            case "client_streaming":
                file.println("        return ", stackIntercept, "<", I, ", ", O, ">(\"clientStreaming\", this._transport, method, opt);");
                break;
            case "bidi_streaming":
                file.println("        return ", stackIntercept, "<", I, ", ", O, ">(\"duplex\", this._transport, method, opt);");
                break;
        }
        file.println("    }");
    }
    file.println("}");
}

function methodSignature(schema: Schema, desc: DescMethod): Printable {
    const RpcOptions = createImportSymbol("RpcOptions", "@protobuf-ts/runtime-rpc", true);
    const UnaryCall = createImportSymbol("UnaryCall", "@protobuf-ts/runtime-rpc", true);
    const ServerStreamingCall = createImportSymbol("ServerStreamingCall", "@protobuf-ts/runtime-rpc", true);
    const ClientStreamingCall = createImportSymbol("ClientStreamingCall", "@protobuf-ts/runtime-rpc", true);
    const DuplexStreamingCall = createImportSymbol("DuplexStreamingCall", "@protobuf-ts/runtime-rpc", true);
    const name = schema.interpreter.getMethodInfo(desc).localName;
    const I = importMessageInterface(desc.input);
    const O = importMessageInterface(desc.output);
    switch (desc.methodKind) {
        case "unary":
            return [name, "(input: ", I, ", options?: ", RpcOptions, "): ", UnaryCall, "<", I, ", ", O, ">"];
        case "server_streaming":
            return [name, "(input: ", I, ", options?: ", RpcOptions, "): ", ServerStreamingCall, "<", I, ", ", O, ">"];
        case "client_streaming":
            return [name, "(options?: ", RpcOptions, "): ", ClientStreamingCall, "<", I, ", ", O, ">"];
        case "bidi_streaming":
            return [name, "(options?: ", RpcOptions, "): ", DuplexStreamingCall, "<", I, ", ", O, ">"];
    }
}

