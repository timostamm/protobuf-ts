import {File, Schema} from "../schema";
import {DescService} from "@bufbuild/protobuf";
import {createExportStatement, createImportSymbol, ImportSymbol} from "@bufbuild/protoplugin-print";
import {createLocalTypeName} from "../local-type-name";
import {leadingDoc} from "../comments";
import {importMessageInterface} from "./message-interface";
import {importServiceType} from "./service-type";


export function importClientGrpc1Interface(desc: DescService): ImportSymbol {
    const basename = createLocalTypeName(desc);
    const interfaceName = `I${basename}Client`;
    return createImportSymbol(
        interfaceName,
        "./" + desc.file.name + ".grpc-client.js",
        false,
    );
}

export function importClientGrpc1(desc: DescService): ImportSymbol {
    const basename = createLocalTypeName(desc);
    const interfaceName = `${basename}Client`;
    return createImportSymbol(
        interfaceName,
        "./" + desc.file.name + ".grpc-client.js",
        false,
    );
}

export function printClientGrpc1Interface(schema: Schema, file: File, desc: DescService): void {
    const Metadata = createImportSymbol("Metadata", "@grpc/grpc-js", true);
    const CallOptions = createImportSymbol("CallOptions", "@grpc/grpc-js", true);
    const ServiceError = createImportSymbol("ServiceError", "@grpc/grpc-js", true);
    const ClientUnaryCall = createImportSymbol("ClientUnaryCall", "@grpc/grpc-js", true);
    const ClientReadableStream = createImportSymbol("ClientReadableStream", "@grpc/grpc-js", true);
    const ClientWritableStream = createImportSymbol("ClientWritableStream", "@grpc/grpc-js", true);
    const ClientDuplexStream = createImportSymbol("ClientDuplexStream", "@grpc/grpc-js", true);
    file.println(leadingDoc(desc, {
        includeTrailingComments: true,
    }));
    file.println(createExportStatement("interface", importClientGrpc1Interface(desc).name), " {");
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
                file.println("    ", localName, "(input: ", I, ", metadata: ", Metadata, ", options: ", CallOptions, ", callback: (err: ", ServiceError, " | null, value?: ", O, ") => void): ", ClientUnaryCall, ";");
                file.println("    ", localName, "(input: ", I, ", metadata: ", Metadata, ", callback: (err: ", ServiceError, " | null, value?: ", O, ") => void): ", ClientUnaryCall, ";");
                file.println("    ", localName, "(input: ", I, ", options: ", CallOptions, ", callback: (err: ", ServiceError, " | null, value?: ", O, ") => void): ", ClientUnaryCall, ";");
                file.println("    ", localName, "(input: ", I, ", callback: (err: ", ServiceError, " | null, value?: ", O, ") => void): ", ClientUnaryCall, ";");
                break;
            case "server_streaming":
                file.println("    ", localName, "(input: ", I, ", metadata?: ", Metadata, ", options?: ", CallOptions, "): ", ClientReadableStream, "<", O, ">;");
                file.println("    ", localName, "(input: ", I, ", options?: ", CallOptions, "): ", ClientReadableStream, "<", O, ">;");
                break;
            case "client_streaming":
                file.println("    ", localName, "(metadata: ", Metadata, ", options: ", CallOptions, ", callback: (err: ", ServiceError, " | null, value?: ", O, ") => void): ", ClientWritableStream, "<", I, ">;");
                file.println("    ", localName, "(metadata: ", Metadata, ", callback: (err: ", ServiceError, " | null, value?: ", O, ") => void): ", ClientWritableStream, "<", I, ">;");
                file.println("    ", localName, "(options: ", CallOptions, ", callback: (err: ", ServiceError, " | null, value?: ", O, ") => void): ", ClientWritableStream, "<", I, ">;");
                file.println("    ", localName, "(callback: (err: ", ServiceError, " | null, value?: ", O, ") => void): ", ClientWritableStream, "<", I, ">;");
                break;
            case "bidi_streaming":
                file.println("    ", localName, "(metadata: ", Metadata, ", options?: ", CallOptions, "): ", ClientDuplexStream, "<", I, ", ", O, ">;");
                file.println("    ", localName, "(options?: ", CallOptions, "): ", ClientDuplexStream, "<", I, ", ", O, ">;");
                break;
        }
    }
    file.println("}");
}

export function printClientGrpc1(schema: Schema, file: File, desc: DescService): void {
    const BinaryReadOptions = createImportSymbol("BinaryReadOptions", "@protobuf-ts/runtime", true);
    const BinaryWriteOptions = createImportSymbol("BinaryWriteOptions", "@protobuf-ts/runtime", true);
    const Client = createImportSymbol("Client", "@grpc/grpc-js", false);
    const ChannelCredentials = createImportSymbol("ChannelCredentials", "@grpc/grpc-js", true);
    const ClientOptions = createImportSymbol("ClientOptions", "@grpc/grpc-js", true);
    const Metadata = createImportSymbol("Metadata", "@grpc/grpc-js", true);
    const CallOptions = createImportSymbol("CallOptions", "@grpc/grpc-js", true);
    const ServiceError = createImportSymbol("ServiceError", "@grpc/grpc-js", true);
    const ClientUnaryCall = createImportSymbol("ClientUnaryCall", "@grpc/grpc-js", true);
    const ClientReadableStream = createImportSymbol("ClientReadableStream", "@grpc/grpc-js", true);
    const ClientWritableStream = createImportSymbol("ClientWritableStream", "@grpc/grpc-js", true);
    const ClientDuplexStream = createImportSymbol("ClientDuplexStream", "@grpc/grpc-js", true);
    const serviceType = importServiceType(desc);
    file.println(leadingDoc(desc, {
        includeTrailingComments: true,
    }));
    file.println(createExportStatement("class", importClientGrpc1(desc).name), " extends ", Client, " {");
    file.println("    private readonly _binaryOptions: Partial<", BinaryReadOptions, " & ", BinaryWriteOptions, ">;");
    file.println("    constructor(address: string, credentials: ", ChannelCredentials, ", options: ", ClientOptions, " = {}, binaryOptions: Partial<", BinaryReadOptions, " & ", BinaryWriteOptions, "> = {}) {");
    file.println("        super(address, credentials, options);");
    file.println("        this._binaryOptions = binaryOptions;");
    file.println("    }");
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
                file.println("   ", localName, "(input: ", I, ", metadata: ", Metadata, " | ", CallOptions, " | ((err: ", ServiceError, " | null, value?: ", O, ") => void), options?: ", CallOptions, " | ((err: ", ServiceError, " | null, value?: ", O, ") => void), callback?: ((err: ", ServiceError, " | null, value?: ", O, ") => void)): ", ClientUnaryCall, " {");
                file.println("       const method = ", serviceType, ".methods[", desc.methods.indexOf(method), "];");
                file.println("       return this.makeUnaryRequest<", I, ", ", O, ">(`/${", serviceType, ".typeName}/${method.name}`, (value: ", I, "): Buffer => Buffer.from(method.I.toBinary(value, this._binaryOptions)), (value: Buffer): ", O, " => method.O.fromBinary(value, this._binaryOptions), input, (metadata as any), (options as any), (callback as any));");
                file.println("   }");
                break;
            case "server_streaming":
                file.println("   ", localName, "(input: ", I, ", metadata?: ", Metadata, " | ", CallOptions, ", options?: ", CallOptions, "): ", ClientReadableStream, "<", O, "> {");
                file.println("       const method = ", serviceType, ".methods[", desc.methods.indexOf(method), "];");
                file.println("       return this.makeServerStreamRequest<", I, ", ", O, ">(`/${", serviceType, ".typeName}/${method.name}`, (value: ", I, "): Buffer => Buffer.from(method.I.toBinary(value, this._binaryOptions)), (value: Buffer): ", O, " => method.O.fromBinary(value, this._binaryOptions), input, (metadata as any), options);");
                file.println("   }");
                break;
            case "client_streaming":
                file.println("   ", localName, "(metadata: ", Metadata, " | ", CallOptions, " | ((err: ", ServiceError, " | null, value?: ", O, ") => void), options?: ", CallOptions, " | ((err: ", ServiceError, " | null, value?: ", O, ") => void), callback?: ((err: ", ServiceError, " | null, value?: ", O, ") => void)): ", ClientWritableStream, "<", I, "> {");
                file.println("       const method = ", serviceType, ".methods[", desc.methods.indexOf(method), "];");
                file.println("       return this.makeClientStreamRequest<", I, ", ", O, ">(`/${", serviceType, ".typeName}/${method.name}`, (value: ", I, "): Buffer => Buffer.from(method.I.toBinary(value, this._binaryOptions)), (value: Buffer): ", O, " => method.O.fromBinary(value, this._binaryOptions), (metadata as any), (options as any), (callback as any));");
                file.println("   }");
                break;
            case "bidi_streaming":
                file.println("   ", localName, "(metadata?: ", Metadata, " | ", CallOptions, ", options?: ", CallOptions, "): ", ClientDuplexStream, "<", I, ", ", O, "> {");
                file.println("       const method = ", serviceType, ".methods[", desc.methods.indexOf(method), "];");
                file.println("       return this.makeBidiStreamRequest<", I, ", ", O, ">(`/${", serviceType, ".typeName}/${method.name}`, (value: ", I, "): Buffer => Buffer.from(method.I.toBinary(value, this._binaryOptions)), (value: Buffer): ", O, " => method.O.fromBinary(value, this._binaryOptions), (metadata as any), options);");
                file.println("   }");
                break;
        }
    }
    file.println("}");
}