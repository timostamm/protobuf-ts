import {GeneratorBase} from "./generator-base";
import * as rpc from "@chippercash/protobuf-runtime-rpc";
import {
    DescriptorRegistry,
    ServiceDescriptorProto,
    SymbolTable,
    TypescriptFile,
    TypeScriptImports
} from "@chippercash/protobuf-plugin-framework";
import {Interpreter} from "../interpreter";
import * as ts from "typescript";
import {assert} from "@chippercash/protobuf-runtime";
import {CommentGenerator} from "./comment-generator";
import {createLocalTypeName} from "./local-type-name";


export class ServiceServerGeneratorGeneric extends GeneratorBase {


    private readonly symbolKindInterface = 'generic-server-interface';


    constructor(symbols: SymbolTable, registry: DescriptorRegistry, imports: TypeScriptImports, comments: CommentGenerator, interpreter: Interpreter,
                private readonly options: {
                    runtimeRpcImportPath: string;
                }) {
        super(symbols, registry, imports, comments, interpreter);
    }


    registerSymbols(source: TypescriptFile, descriptor: ServiceDescriptorProto): void {
        const basename = createLocalTypeName(descriptor, this.registry);
        const interfaceName = `I${basename}`;
        this.symbols.register(interfaceName, descriptor, source, this.symbolKindInterface);
    }


    generateInterface(source: TypescriptFile, descriptor: ServiceDescriptorProto) {
        const
            interpreterType = this.interpreter.getServiceType(descriptor),
            IGenericServer = this.imports.type(source, descriptor, this.symbolKindInterface),
            ServerCallContext = this.imports.name(source, "ServerCallContext", this.options.runtimeRpcImportPath)
        ;

        const statement = ts.createInterfaceDeclaration(
            undefined,
            [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
            ts.createIdentifier(IGenericServer),
            [
              ts.createTypeParameterDeclaration(
                "T",
                undefined,
                ts.createTypeReferenceNode(
                  ts.createIdentifier(ServerCallContext),
                  undefined
                ),
              )
            ],
            undefined,
            interpreterType.methods.map(mi => {
                const methodDescriptor = descriptor.method.find(md => md.name === mi.name);
                assert(methodDescriptor);
                let signature: ts.MethodSignature;
                if (mi.serverStreaming && mi.clientStreaming) {
                    signature = this.createBidi(source, mi);
                } else if (mi.serverStreaming) {
                    signature = this.createServerStreaming(source, mi);
                } else if (mi.clientStreaming) {
                    signature = this.createClientStreaming(source, mi);
                } else {
                    signature = this.createUnary(source, mi);
                }
                this.comments.addCommentsForDescriptor(signature, methodDescriptor, 'appendToLeadingBlock');
                return signature;
            })
        );

        // add to our file
        this.comments.addCommentsForDescriptor(statement, descriptor, 'appendToLeadingBlock');
        source.addStatement(statement);
        return statement;
    }


    private createUnary(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodSignature {
        const
            I = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.type(
                source,
                this.registry.resolveTypeName(methodInfo.I.typeName)
            )), undefined),
            O = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.type(
                source,
                this.registry.resolveTypeName(methodInfo.O.typeName)
            )), undefined);
        return ts.createMethodSignature(
            undefined,
            [
                ts.createParameter(
                    undefined,
                    undefined,
                    undefined,
                    ts.createIdentifier("request"),
                    undefined,
                    I,
                    undefined
                ),
                ts.createParameter(
                    undefined,
                    undefined,
                    undefined,
                    ts.createIdentifier("context"),
                    undefined,
                    ts.createTypeReferenceNode(
                        ts.createIdentifier("T"),
                        undefined
                    ),
                    undefined
                )
            ],
            ts.createTypeReferenceNode(
                ts.createIdentifier("Promise"),
                [O]
            ),
            ts.createIdentifier(methodInfo.localName),
            undefined
        );
    }


    private createServerStreaming(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodSignature {
        const
            I = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.type(
                source,
                this.registry.resolveTypeName(methodInfo.I.typeName)
            )), undefined),
            O = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.type(
                source,
                this.registry.resolveTypeName(methodInfo.O.typeName)
            )), undefined),
            RpcInputStream = this.imports.name(source, 'RpcInputStream', this.options.runtimeRpcImportPath);
        return ts.createMethodSignature(
            undefined,
            [
                ts.createParameter(
                    undefined,
                    undefined,
                    undefined,
                    ts.createIdentifier("request"),
                    undefined,
                    I,
                    undefined
                ),
                ts.createParameter(
                    undefined,
                    undefined,
                    undefined,
                    ts.createIdentifier("responses"),
                    undefined,
                    ts.createTypeReferenceNode(
                        ts.createIdentifier(RpcInputStream),
                        [O]
                    ),
                    undefined
                ),
                ts.createParameter(
                    undefined,
                    undefined,
                    undefined,
                    ts.createIdentifier("context"),
                    undefined,
                    ts.createTypeReferenceNode(
                        ts.createIdentifier("T"),
                        undefined
                    ),
                    undefined
                )
            ],
            ts.createTypeReferenceNode(
                ts.createIdentifier("Promise"),
                [ts.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword)]
            ),
            ts.createIdentifier(methodInfo.localName),
            undefined
        );
    }



    private createClientStreaming(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodSignature {
        const
            I = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.type(
                source,
                this.registry.resolveTypeName(methodInfo.I.typeName)
            )), undefined),
            O = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.type(
                source,
                this.registry.resolveTypeName(methodInfo.O.typeName)
            )), undefined),
            RpcOutputStream = this.imports.name(source, 'RpcOutputStream', this.options.runtimeRpcImportPath);
        return ts.createMethodSignature(
            undefined,
            [
                ts.createParameter(
                    undefined,
                    undefined,
                    undefined,
                    ts.createIdentifier("requests"),
                    undefined,
                    ts.createTypeReferenceNode(
                        ts.createIdentifier(RpcOutputStream),
                        [I]
                    ),
                    undefined
                ),
                ts.createParameter(
                    undefined,
                    undefined,
                    undefined,
                    ts.createIdentifier("context"),
                    undefined,
                    ts.createTypeReferenceNode(
                        ts.createIdentifier("T"),
                        undefined
                    ),
                    undefined
                )
            ],
            ts.createTypeReferenceNode(
                ts.createIdentifier("Promise"),
                [O]
            ),
            ts.createIdentifier(methodInfo.localName),
            undefined
        );
    }


    private createBidi(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodSignature {
        const
            I = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.type(
                source,
                this.registry.resolveTypeName(methodInfo.I.typeName)
            )), undefined),
            O = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.type(
                source,
                this.registry.resolveTypeName(methodInfo.O.typeName)
            )), undefined),
            RpcOutputStream = this.imports.name(source, 'RpcOutputStream', this.options.runtimeRpcImportPath),
            RpcInputStream = this.imports.name(source, 'RpcInputStream', this.options.runtimeRpcImportPath);
        return ts.createMethodSignature(
            undefined,
            [
                ts.createParameter(
                    undefined,
                    undefined,
                    undefined,
                    ts.createIdentifier("requests"),
                    undefined,
                    ts.createTypeReferenceNode(
                        ts.createIdentifier(RpcOutputStream),
                        [I]
                    ),
                    undefined
                ),
                ts.createParameter(
                    undefined,
                    undefined,
                    undefined,
                    ts.createIdentifier("responses"),
                    undefined,
                    ts.createTypeReferenceNode(
                        ts.createIdentifier(RpcInputStream),
                        [O]
                    ),
                    undefined
                ),
                ts.createParameter(
                    undefined,
                    undefined,
                    undefined,
                    ts.createIdentifier("context"),
                    undefined,
                    ts.createTypeReferenceNode(
                        ts.createIdentifier("T"),
                        undefined
                    ),
                    undefined
                )
            ],
            ts.createTypeReferenceNode(
                ts.createIdentifier("Promise"),
                [ts.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword)]
            ),
            ts.createIdentifier(methodInfo.localName),
            undefined
        );
    }


}
