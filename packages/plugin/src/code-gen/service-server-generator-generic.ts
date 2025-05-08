import * as rpc from "@protobuf-ts/runtime-rpc";
import {TypescriptFile} from "../framework/typescript-file";
import * as ts from "typescript";
import {assert} from "@protobuf-ts/runtime";
import {CommentGenerator} from "./comment-generator";
import {createLocalTypeName} from "./local-type-name";
import {Interpreter} from "../interpreter";
import {DescService} from "@bufbuild/protobuf";
import {TypeScriptImports} from "../framework/typescript-imports";
import {SymbolTable} from "../framework/symbol-table";


export class ServiceServerGeneratorGeneric {


    private readonly symbolKindInterface = 'generic-server-interface';


    constructor(
        private readonly symbols: SymbolTable,
        private readonly imports: TypeScriptImports,
        private readonly comments: CommentGenerator,
        private readonly interpreter: Interpreter,
        private readonly options: { runtimeRpcImportPath: string; },
    ) {
    }


    registerSymbols(source: TypescriptFile, descService: DescService): void {
        const basename = createLocalTypeName(descService);
        const interfaceName = `I${basename}`;
        this.symbols.register(interfaceName, descService, source, this.symbolKindInterface);
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
        const
            I = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.typeByName(
                source,
                methodInfo.I.typeName
            )), undefined),
            O = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.typeByName(
                source,
                methodInfo.O.typeName
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
            I = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.typeByName(
                source,
                methodInfo.I.typeName
            )), undefined),
            O = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.typeByName(
                source,
                methodInfo.O.typeName
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
            I = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.typeByName(
                source,
                methodInfo.I.typeName
            )), undefined),
            O = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.typeByName(
                source,
                methodInfo.O.typeName
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
            I = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.typeByName(
                source,
                methodInfo.I.typeName
            )), undefined),
            O = ts.createTypeReferenceNode(ts.createIdentifier(this.imports.typeByName(
                source,
                methodInfo.O.typeName
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
