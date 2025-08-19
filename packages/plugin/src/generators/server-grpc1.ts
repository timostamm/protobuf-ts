import {DescService} from "@bufbuild/protobuf";
import {createExportStatement, createImportSymbol, createJsDocBlock, ImportSymbol} from "@bufbuild/protoplugin-print";
import {createLocalTypeName} from "../local-type-name";
import {File, Schema} from "../schema";
import {leadingDoc} from "../comments";
import {importMessageInterface} from "./message-interface";
import {literalValue} from "../literal-value";
import {importMessageType} from "./message-type";

export function importServerGrpc1Interface(desc: DescService): ImportSymbol {
    const basename = createLocalTypeName(desc);
    const interfaceName = `I${basename}`;
    return createImportSymbol(
        interfaceName,
        "./" + desc.file.name + ".grpc-server.js",
        false,
    );
}

export function importServerGrpc1Definition(desc: DescService): ImportSymbol {
    const basename = createLocalTypeName(desc);
    return createImportSymbol(
        `${basename[0].toLowerCase() + basename.slice(1)}Definition`,
        "./" + desc.file.name + ".grpc-server.js",
        false,
    );
}

export function printServerGrpc1Interface(schema: Schema, file: File, desc: DescService): void {
    const UntypedServiceImplementation = createImportSymbol("UntypedServiceImplementation", "@grpc/grpc-js", true);
    const handleUnaryCall = createImportSymbol("handleUnaryCall", "@grpc/grpc-js", true);
    const handleServerStreamingCall = createImportSymbol("handleServerStreamingCall", "@grpc/grpc-js", true);
    const handleClientStreamingCall = createImportSymbol("handleClientStreamingCall", "@grpc/grpc-js", true);
    const handleBidiStreamingCall = createImportSymbol("handleBidiStreamingCall", "@grpc/grpc-js", true);
    file.println(leadingDoc(desc, {
        includeTrailingComments: true,
    }));
    file.println(createExportStatement("interface", importServerGrpc1Interface(desc).name), " extends ", UntypedServiceImplementation, " {");
    for (const method of desc.methods) {
        file.println(leadingDoc(method, {
            indentation: "    ",
            includeTrailingComments: false,
        }));
        const localName = schema.interpreter.getMethodInfo(method).localName;
        const I = importMessageInterface(method.input);
        const O = importMessageInterface(method.output);
        switch (method.methodKind) {
            case "unary":
                file.println("    ", localName, ": ", handleUnaryCall, "<", I, ", ", O, ">;");
                break;
            case "server_streaming":
                file.println("    ", localName, ": ", handleServerStreamingCall, "<", I, ", ", O, ">;");
                break;
            case "client_streaming":
                file.println("    ", localName, ": ", handleClientStreamingCall, "<", I, ", ", O, ">;");
                break;
            case "bidi_streaming":
                file.println("    ", localName, ": ", handleBidiStreamingCall, "<", I, ", ", O, ">;");
                break;
        }
    }
    file.println("}");
}

export function printServerGrpc1Definition(schema: Schema, file: File, desc: DescService): void {
    const ServiceDefinition = createImportSymbol("ServiceDefinition", "@grpc/grpc-js", true);
    file.println(createJsDocBlock([
        `@grpc/grpc-js definition for the protobuf ${desc}.`,
        "",
        `Usage: Implement the interface IExampleService and add to a grpc server.`,
        "",
        "```typescript",
        "const server = new grpc.Server();",
        "const service: IExampleService = ...",
        "server.addService(exampleServiceDefinition, service);",
        "```",
    ].join("\n")));
    file.println(createExportStatement("const", importServerGrpc1Definition(desc).name), ": ", ServiceDefinition, "<", importServerGrpc1Interface(desc),"> = {");
    for (const method of desc.methods) {
        const name = schema.interpreter.getMethodInfo(method).localName;
        const I = importMessageType(method.input);
        const O = importMessageType(method.output);
        file.println("    ", name, ": {");
        file.println(`        path: "/${desc.typeName}/${method.name}",`);
        file.println("        originalName: ", literalValue(method.name), ",");
        file.println("        requestStream: ", literalValue(method.methodKind === "client_streaming" || method.methodKind === "bidi_streaming"), ",");
        file.println("        responseStream: ", literalValue(method.methodKind === "server_streaming" || method.methodKind === "bidi_streaming"), ",");
        file.println("        responseDeserialize: bytes => ", O, ".fromBinary(bytes),");
        file.println("        requestDeserialize: bytes => ", I, ".fromBinary(bytes),");
        file.println("        responseSerialize: value => Buffer.from(", O, ".toBinary(value)),");
        file.println("        requestSerialize: value => Buffer.from(", I, ".toBinary(value))");
        file.println("    }", desc.methods.indexOf(method) < desc.methods.length -1 ? "," : "");
    }
    file.println("};");
}
