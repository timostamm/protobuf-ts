import * as ts from "typescript";
import * as rt from "@protobuf-ts/runtime";
import {assert} from "@protobuf-ts/runtime";
import {
    TypescriptFile,
} from "@protobuf-ts/plugin-framework";
import {CommentGenerator} from "./comment-generator";
import {createLocalTypeName} from "./local-type-name";
import {Interpreter} from "../interpreter";
import {DescField, DescMessage, DescOneof} from "@bufbuild/protobuf";
import {TypeScriptImports} from "../typescript-imports";
import {SymbolTable} from "../symbol-table";


export class MessageInterfaceGenerator {


    constructor(
        private readonly symbols: SymbolTable,
        private readonly imports: TypeScriptImports,
        private readonly comments: CommentGenerator,
        private readonly interpreter: Interpreter,
        private readonly options: {
            oneofKindDiscriminator: string;
            normalLongType: rt.LongType;
        },
    ) {
    }


    registerSymbols(source: TypescriptFile, descMessage: DescMessage): void {
        this.symbols.register(createLocalTypeName(descMessage), descMessage, source);
    }


    /**
     * `message` as an interface.
     *
     * For the following .proto:
     *
     *   message MyMessage {
     *     string str_field = 1;
     *   }
     *
     * We generate the following interface:
     *
     *   interface MyMessage {
     *     strField: string;
     *   }
     *
     */
    generateMessageInterface(source: TypescriptFile, descMessage: DescMessage): ts.InterfaceDeclaration {
        const
            interpreterType = this.interpreter.getMessageType(descMessage.typeName),
            processedOneofs: string[] = [], // oneof groups already processed
            members: ts.TypeElement[] = []; // the interface members

        for (let fieldInfo of interpreterType.fields) {
            const descField = descMessage.fields.find(descField => descField.number === fieldInfo.no);
            assert(descField);
            if (fieldInfo.oneof && descField.oneof) {
                if (processedOneofs.includes(fieldInfo.oneof)) {
                    continue;
                }
                members.push(this.createOneofADTPropertySignature(source, descField.oneof));
                processedOneofs.push(fieldInfo.oneof);
            } else {
                // create regular properties
                members.push(this.createFieldPropertySignature(source, descField, fieldInfo));
            }
        }

        // export interface MyMessage { ...
        const statement = ts.createInterfaceDeclaration(
            undefined,
            [ts.createModifier(ts.SyntaxKind.ExportKeyword)],
            this.imports.type(source, descMessage),
            undefined,
            undefined,
            members
        );

        // add to our file
        source.addStatement(statement);
        this.comments.addCommentsForDescriptor(statement, descMessage, 'appendToLeadingBlock');
        return statement;
    }


    /**
     * Create property signature for a protobuf field. Example:
     *
     *    fieldName: number
     *
     */
    protected createFieldPropertySignature(source: TypescriptFile, descField: DescField, fieldInfo: rt.FieldInfo): ts.PropertySignature {
        let type: ts.TypeNode; // the property type, may be made optional or wrapped into array at the end

        switch (fieldInfo.kind) {
            case "scalar":
                type = this.createScalarTypeNode(fieldInfo.T, fieldInfo.L);
                break;

            case "enum":
                type = this.createEnumTypeNode(source, fieldInfo.T());
                break;

            case "message":
                type = this.createMessageTypeNode(source, fieldInfo.T());
                break;

            case "map":
                let keyType = fieldInfo.K === rt.ScalarType.BOOL
                    ? ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
                    : this.createScalarTypeNode(fieldInfo.K, rt.LongType.STRING);
                let valueType;
                switch (fieldInfo.V.kind) {
                    case "scalar":
                        valueType = this.createScalarTypeNode(fieldInfo.V.T, fieldInfo.V.L);
                        break;
                    case "enum":
                        valueType = this.createEnumTypeNode(source, fieldInfo.V.T());
                        break;
                    case "message":
                        valueType = this.createMessageTypeNode(source, fieldInfo.V.T());
                        break;
                }
                type = ts.createTypeLiteralNode([
                    ts.createIndexSignature(
                        undefined,
                        undefined,
                        [
                            ts.createParameter(
                                undefined,
                                undefined,
                                undefined,
                                ts.createIdentifier('key'),
                                undefined,
                                keyType,
                                undefined
                            )
                        ],
                        valueType
                    )
                ]);
                break;
            default:
                throw new Error("unkown kind " + descField.toString());
        }

        // if repeated, wrap type into array type
        if (fieldInfo.repeat) {
            type = ts.createArrayTypeNode(type);
        }

        // if optional, add question mark
        let questionToken = fieldInfo.opt ? ts.createToken(ts.SyntaxKind.QuestionToken) : undefined;

        // create property
        const property = ts.createPropertySignature(
            undefined,
            ts.createIdentifier(fieldInfo.localName),
            questionToken,
            type,
            undefined
        );
        this.comments.addCommentsForDescriptor(property, descField, 'trailingLines');
        return property;
    }

    /**
     * `oneof` as an algebraic data type.
     *
     * For the following .proto:
     *
     *   oneof result {
     *     int32 value = 1;
     *     string error = 2;
     *   }
     *
     * We generate the following property signature:
     *
     *   result: { oneofKind: "value"; value: number; }
     *         | { oneofKind: "error"; error: string; }
     *         | { oneofKind: undefined; };
     */
    protected createOneofADTPropertySignature(source:TypescriptFile, descOneof: DescOneof): ts.PropertySignature {
        const
            oneofCases: ts.TypeLiteralNode[] = [],
            [parentMessageDesc, interpreterType, oneofLocalName] = this.oneofInfo(descOneof),
            memberFieldInfos = interpreterType.fields.filter(fi => fi.oneof === oneofLocalName);

        // create a type for each selection case
        for (let fieldInfo of memberFieldInfos) {

            // { oneofKind: 'fieldName' ... } part
            const kindProperty = ts.createPropertySignature(
                undefined,
                ts.createIdentifier(this.options.oneofKindDiscriminator),
                undefined,
                ts.createLiteralTypeNode(ts.createStringLiteral(fieldInfo.localName)),
                undefined
            );

            // { ..., fieldName: type } part
            let descField = parentMessageDesc.fields.find(fd => fd.number === fieldInfo.no);
            assert(descField !== undefined);
            let valueProperty = this.createFieldPropertySignature(source, descField, fieldInfo);

            // add this case
            oneofCases.push(
                ts.createTypeLiteralNode([kindProperty, valueProperty])
            );

        }

        // case for no selection: { oneofKind: undefined; }
        oneofCases.push(
            ts.createTypeLiteralNode([
                ts.createPropertySignature(
                    undefined,
                    ts.createIdentifier(this.options.oneofKindDiscriminator),
                    undefined,
                    ts.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword),
                    undefined
                )
            ])
        );

        // final property signature for the oneof group, with a union type for all oneof cases
        const property = ts.createPropertySignature(
            undefined,
            ts.createIdentifier(oneofLocalName),
            undefined,
            ts.createUnionTypeNode(oneofCases),
            undefined
        );

        // add comments
        this.comments.addCommentsForDescriptor(property, descOneof, 'appendToLeadingBlock');
        return property;
    }


    /**
     * Helper to find for a OneofDescriptorProto:
     * [0] the message descriptor
     * [1] a corresponding message type generated by the interpreter
     * [2] the runtime local name of the oneof
     */
    private oneofInfo(descOneof: DescOneof): [DescMessage, rt.IMessageType<rt.UnknownMessage>, string] {
        const parent: DescMessage = descOneof.parent;
        const interpreterType = this.interpreter.getMessageType(parent);
        const sampleField = descOneof.fields[0];
        const sampleFieldInfo = interpreterType.fields.find(fi => fi.no === sampleField.number);
        assert(sampleFieldInfo !== undefined);
        const oneofName = sampleFieldInfo.oneof;
        assert(oneofName !== undefined);
        return [parent, interpreterType, oneofName];
    }


    private createScalarTypeNode(scalarType: rt.ScalarType, longType?: rt.LongType): ts.TypeNode {
        switch (scalarType) {
            case rt.ScalarType.BOOL:
                return ts.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
            case rt.ScalarType.STRING:
                return ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
            case rt.ScalarType.BYTES:
                return ts.createTypeReferenceNode('Uint8Array', undefined);
            case rt.ScalarType.DOUBLE:
            case rt.ScalarType.FLOAT:
            case rt.ScalarType.INT32:
            case rt.ScalarType.FIXED32:
            case rt.ScalarType.UINT32:
            case rt.ScalarType.SFIXED32:
            case rt.ScalarType.SINT32:
                return ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
            case rt.ScalarType.SFIXED64:
            case rt.ScalarType.INT64:
            case rt.ScalarType.UINT64:
            case rt.ScalarType.FIXED64:
            case rt.ScalarType.SINT64:
                switch (longType ?? rt.LongType.STRING) {
                    case rt.LongType.STRING:
                        return ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
                    case rt.LongType.NUMBER:
                        return ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
                    case rt.LongType.BIGINT:
                        return ts.createKeywordTypeNode(ts.SyntaxKind.BigIntKeyword);
                }
        }
    }

    private createMessageTypeNode(source: TypescriptFile, type: rt.IMessageType<rt.UnknownMessage>): ts.TypeNode {
        return ts.createTypeReferenceNode(this.imports.typeByName(source, type.typeName), undefined);
    }


    private createEnumTypeNode(source: TypescriptFile, ei: rt.EnumInfo): ts.TypeNode {
        let [enumTypeName] = ei;
        return ts.createTypeReferenceNode(this.imports.typeByName(source, enumTypeName), undefined);
    }


}
