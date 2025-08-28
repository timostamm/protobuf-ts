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

        const statement = ts.factory.createInterfaceDeclaration(
            [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
            ts.factory.createIdentifier(IGenericServer),
            [
              ts.factory.createTypeParameterDeclaration(
                undefined,
                "T",
                ts.factory.createTypeReferenceNode(
                  ts.factory.createIdentifier(ServerCallContext),
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
            I = ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(this.imports.typeByName(
                source,
                methodInfo.I.typeName
            )), undefined),
            O = ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(this.imports.typeByName(
                source,
                methodInfo.O.typeName
            )), undefined);
        return ts.factory.createMethodSignature(
            undefined,
            ts.factory.createIdentifier(methodInfo.localName),
            undefined,
            undefined,
            [
                ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    ts.factory.createIdentifier("request"),
                    undefined,
                    I,
                    undefined
                ),
                ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    ts.factory.createIdentifier("context"),
                    undefined,
                    ts.factory.createTypeReferenceNode(
                        ts.factory.createIdentifier("T"),
                        undefined
                    ),
                    undefined
                )
            ],
            ts.factory.createTypeReferenceNode(
                ts.factory.createIdentifier("Promise"),
                [O]
            ),
        );
    }


    private createServerStreaming(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodSignature {
        const
            I = ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(this.imports.typeByName(
                source,
                methodInfo.I.typeName
            )), undefined),
            O = ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(this.imports.typeByName(
                source,
                methodInfo.O.typeName
            )), undefined),
            RpcInputStream = this.imports.name(source, 'RpcInputStream', this.options.runtimeRpcImportPath);
        return ts.factory.createMethodSignature(
            undefined,
            ts.factory.createIdentifier(methodInfo.localName),
            undefined,
            undefined,
            [
                ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    ts.factory.createIdentifier("request"),
                    undefined,
                    I,
                    undefined
                ),
                ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    ts.factory.createIdentifier("responses"),
                    undefined,
                    ts.factory.createTypeReferenceNode(
                        ts.factory.createIdentifier(RpcInputStream),
                        [O]
                    ),
                    undefined
                ),
                ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    ts.factory.createIdentifier("context"),
                    undefined,
                    ts.factory.createTypeReferenceNode(
                        ts.factory.createIdentifier("T"),
                        undefined
                    ),
                    undefined
                )
            ],
            ts.factory.createTypeReferenceNode(
                ts.factory.createIdentifier("Promise"),
                [ts.factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword)]
            ),
        );
    }



    private createClientStreaming(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodSignature {
        const
            I = ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(this.imports.typeByName(
                source,
                methodInfo.I.typeName
            )), undefined),
            O = ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(this.imports.typeByName(
                source,
                methodInfo.O.typeName
            )), undefined),
            RpcOutputStream = this.imports.name(source, 'RpcOutputStream', this.options.runtimeRpcImportPath);
        return ts.factory.createMethodSignature(
            undefined,
            ts.factory.createIdentifier(methodInfo.localName),
            undefined,
            undefined,
            [
                ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    ts.factory.createIdentifier("requests"),
                    undefined,
                    ts.factory.createTypeReferenceNode(
                        ts.factory.createIdentifier(RpcOutputStream),
                        [I]
                    ),
                    undefined
                ),
                ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    ts.factory.createIdentifier("context"),
                    undefined,
                    ts.factory.createTypeReferenceNode(
                        ts.factory.createIdentifier("T"),
                        undefined
                    ),
                    undefined
                )
            ],
            ts.factory.createTypeReferenceNode(
                ts.factory.createIdentifier("Promise"),
                [O]
            ),
        );
    }


    private createBidi(source: TypescriptFile, methodInfo: rpc.MethodInfo): ts.MethodSignature {
        const
            I = ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(this.imports.typeByName(
                source,
                methodInfo.I.typeName
            )), undefined),
            O = ts.factory.createTypeReferenceNode(ts.factory.createIdentifier(this.imports.typeByName(
                source,
                methodInfo.O.typeName
            )), undefined),
            RpcOutputStream = this.imports.name(source, 'RpcOutputStream', this.options.runtimeRpcImportPath),
            RpcInputStream = this.imports.name(source, 'RpcInputStream', this.options.runtimeRpcImportPath);
        return ts.factory.createMethodSignature(
            undefined,
            ts.factory.createIdentifier(methodInfo.localName),
            undefined,
            undefined,
            [
                ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    ts.factory.createIdentifier("requests"),
                    undefined,
                    ts.factory.createTypeReferenceNode(
                        ts.factory.createIdentifier(RpcOutputStream),
                        [I]
                    ),
                    undefined
                ),
                ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    ts.factory.createIdentifier("responses"),
                    undefined,
                    ts.factory.createTypeReferenceNode(
                        ts.factory.createIdentifier(RpcInputStream),
                        [O]
                    ),
                    undefined
                ),
                ts.factory.createParameterDeclaration(
                    undefined,
                    undefined,
                    ts.factory.createIdentifier("context"),
                    undefined,
                    ts.factory.createTypeReferenceNode(
                        ts.factory.createIdentifier("T"),
                        undefined
                    ),
                    undefined
                )
            ],
            ts.factory.createTypeReferenceNode(
                ts.factory.createIdentifier("Promise"),
                [ts.factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword)]
            ),
        );
    }


}
