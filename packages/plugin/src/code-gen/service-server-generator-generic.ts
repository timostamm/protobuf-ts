import * as rpc from "@protobuf-ts/runtime-rpc";
import {
    DescriptorRegistry,
    TypescriptFile,
} from "@protobuf-ts/plugin-framework";
import * as ts from "typescript";
import {assert} from "@protobuf-ts/runtime";
import {CommentGenerator} from "./comment-generator";
import {createLocalTypeName} from "./local-type-name";
import {Interpreter} from "../interpreter";
import {DescService, FileRegistry} from "@bufbuild/protobuf";
import {TypeScriptImports} from "../es-typescript-imports";
import {SymbolTable} from "../es-symbol-table";


export class ServiceServerGeneratorGeneric {


    private readonly symbolKindInterface = 'generic-server-interface';


    constructor(
        private readonly symbols: SymbolTable,
        private readonly registry: FileRegistry,
        private readonly legacyRegistry: DescriptorRegistry,
        private readonly imports: TypeScriptImports,
        private readonly comments: CommentGenerator,
        private readonly interpreter: Interpreter,
        private readonly options: { runtimeRpcImportPath: string; },
    ) {
    }


    registerSymbols(source: TypescriptFile, descService: DescService): void {
        const basename = createLocalTypeName(descService);
        const interfaceName = `I${basename}`;
        const legacyDescriptor = this.legacyRegistry.resolveTypeName(descService.typeName);
        this.symbols.register(interfaceName, legacyDescriptor, source, this.symbolKindInterface);
    }


    generateInterface(source: TypescriptFile, descService: DescService) {
        const
            interpreterType = this.interpreter.getServiceType(descService),
            IGenericServer = this.imports.type(source, descService, this.symbolKindInterface),
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
                const descMethod = descService.methods.find(descMethod => descMethod.name === mi.name);
                assert(descMethod);
                this.comments.addCommentsForDescriptor(signature, descMethod, 'appendToLeadingBlock');
                return signature;
            })
        );

        // add to our file
        this.comments.addCommentsForDescriptor(statement, descService, 'appendToLeadingBlock');
        source.addStatement(statement);
        return statement;
    }


    private createUnary(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodSignature {
        const descMessageI = this.registry.getMessage(methodInfo.I.typeName);
        assert(descMessageI);
        const descMessageO = this.registry.getMessage(methodInfo.O.typeName);
        assert(descMessageO);

        const
            I = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.type(
                source,
                descMessageI
            )), undefined),
            O = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.type(
                source,
                descMessageO
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
        const descMessageI = this.registry.getMessage(methodInfo.I.typeName);
        assert(descMessageI);
        const descMessageO = this.registry.getMessage(methodInfo.O.typeName);
        assert(descMessageO);

        const
            I = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.type(
                source,
                descMessageI
            )), undefined),
            O = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.type(
                source,
                descMessageO
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
        const descMessageI = this.registry.getMessage(methodInfo.I.typeName);
        assert(descMessageI);
        const descMessageO = this.registry.getMessage(methodInfo.O.typeName);
        assert(descMessageO);
        const
            I = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.type(
                source,
                descMessageI
            )), undefined),
            O = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.type(
                source,
                descMessageO
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
        const descMessageI = this.registry.getMessage(methodInfo.I.typeName);
        assert(descMessageI);
        const descMessageO = this.registry.getMessage(methodInfo.O.typeName);
        assert(descMessageO);
        const
            I = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.type(
                source,
                descMessageI
            )), undefined),
            O = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.type(
                source,
                descMessageO
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
