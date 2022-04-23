import * as rt from "@protobuf-ts/runtime";
import * as ts from "typescript";
import {
    DescriptorRegistry,
    TypescriptFile,
    TypeScriptImports,
    typescriptLiteralFromValue
} from "@protobuf-ts/plugin-framework";


/**
 * Generates TypeScript code for runtime field information,
 * from runtime field information.
 */
export class FieldInfoGenerator {


    constructor(
        private readonly registry: DescriptorRegistry,
        private readonly imports: TypeScriptImports,
        private readonly options: {},
    ) {
    }


    createFieldInfoLiterals(source: TypescriptFile, fieldInfos: readonly rt.PartialFieldInfo[]): ts.ArrayLiteralExpression {
        fieldInfos = fieldInfos.map(fi => FieldInfoGenerator.denormalizeFieldInfo(fi));
        return ts.createArrayLiteral(fieldInfos.map(fi => this.createFieldInfoLiteral(source, fi)), true);
    }


    createFieldInfoLiteral(source: TypescriptFile, fieldInfo: rt.PartialFieldInfo): ts.ObjectLiteralExpression {
        fieldInfo = FieldInfoGenerator.denormalizeFieldInfo(fieldInfo);
        let properties: ts.PropertyAssignment[] = [];

        // no: The field number of the .proto field.
        // name: The original name of the .proto field.
        // kind: discriminator
        // localName: The name of the field in the runtime.
        // jsonName: The name of the field in JSON.
        // oneof: The name of the `oneof` group, if this field belongs to one.
        for (let key of ["no", "name", "kind", "localName", "jsonName", "oneof"] as const) {
            if (fieldInfo[key] !== undefined) {
                properties.push(ts.createPropertyAssignment(
                    key, typescriptLiteralFromValue(fieldInfo[key])
                ));
            }
        }

        // repeat: Is the field repeated?
        if (fieldInfo.repeat !== undefined) {
            properties.push(ts.createPropertyAssignment(
                "repeat",
                this.createRepeatType(fieldInfo.repeat)
            ));
        }

        // opt: Is the field optional?
        if (fieldInfo.opt !== undefined) {
            properties.push(ts.createPropertyAssignment(
                "opt", typescriptLiteralFromValue(fieldInfo.opt)
            ));
        }

        switch (fieldInfo.kind) {
            case "scalar":

                // T: Scalar field type.
                properties.push(ts.createPropertyAssignment("T", this.createScalarType(fieldInfo.T)));

                // L?: JavaScript long type
                if (fieldInfo.L !== undefined) {
                    properties.push(ts.createPropertyAssignment("L", this.createLongType(fieldInfo.L)));
                }
                break;

            case "enum":
                // T: Return enum field type info.
                properties.push(ts.createPropertyAssignment(ts.createIdentifier('T'), this.createEnumT(source, fieldInfo.T())));
                break;

            case "message":
                // T: Return message field type handler.
                properties.push(ts.createPropertyAssignment(ts.createIdentifier('T'), this.createMessageT(source, fieldInfo.T())));
                break;


            case "map":
                // K: Map field key type.
                properties.push(ts.createPropertyAssignment("K", this.createScalarType(fieldInfo.K)));

                // V: Map field value type.
                properties.push(ts.createPropertyAssignment("V", this.createMapV(source, fieldInfo.V)));
                break;
        }

        // options:
        if (fieldInfo.options) {
            properties.push(ts.createPropertyAssignment(
                ts.createIdentifier('options'),
                typescriptLiteralFromValue(fieldInfo.options)
            ));
        }

        return ts.createObjectLiteral(properties, false);
    }


    /**
     * Creates the interface field / oneof name based on original proto field name and naming options.
     */
    static createTypescriptLocalName(name: string, options: { useProtoFieldName: boolean }): string {
        return options.useProtoFieldName ? name : rt.lowerCamelCase(name);
    }


    /**
     * Turn normalized field info returned by normalizeFieldInfo() back into
     * the minimized form.
     */
    private static denormalizeFieldInfo(info: rt.PartialFieldInfo): rt.PartialFieldInfo {
        let partial: rt.PartialFieldInfo = {...info};
        if (info.jsonName === rt.lowerCamelCase(info.name)) {
            delete partial.jsonName;
        }
        if (info.localName === rt.lowerCamelCase(info.name)) {
            delete partial.localName;
        }
        if (info.repeat === rt.RepeatType.NO) {
            delete partial.repeat;
        }
        if (info.opt === false) {
            delete partial.opt;
        } else if (info.opt === true && info.kind == "message") {
            delete partial.opt;
        }
        return partial;
    }

    private createMessageT(source: TypescriptFile, type: rt.IMessageType<rt.UnknownMessage>): ts.ArrowFunction {
        let descriptor = this.registry.resolveTypeName(type.typeName);
        let generatedMessage = this.imports.type(source, descriptor);
        return ts.createArrowFunction(
            undefined, undefined, [], undefined,
            ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            ts.createIdentifier(generatedMessage)
        );
    }

    private createEnumT(source: TypescriptFile, ei: rt.EnumInfo): ts.ArrowFunction {
        let [pbTypeName, , sharedPrefix] = ei,
            descriptor = this.registry.resolveTypeName(pbTypeName),
            generatedEnum = this.imports.type(source, descriptor),
            enumInfoLiteral: ts.Expression[] = [
                ts.createStringLiteral(pbTypeName),
                ts.createIdentifier(generatedEnum),
            ];
        if (sharedPrefix) {
            enumInfoLiteral.push(ts.createStringLiteral(sharedPrefix));
        }
        return ts.createArrowFunction(
            undefined, undefined, [], undefined,
            ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
            ts.createArrayLiteral(enumInfoLiteral, false)
        );
    }


    private createRepeatType(type: rt.RepeatType): ts.Expression {
        const expr = ts.createNumericLiteral(type.toString());
        ts.addSyntheticTrailingComment(expr, ts.SyntaxKind.MultiLineCommentTrivia, `RepeatType.${rt.RepeatType[type]}`);
        return expr;
    }


    private createScalarType(type: rt.ScalarType): ts.Expression {
        const expr = ts.createNumericLiteral(type.toString());
        ts.addSyntheticTrailingComment(expr, ts.SyntaxKind.MultiLineCommentTrivia, `ScalarType.${rt.ScalarType[type]}`);
        return expr;
    }


    private createLongType(type: rt.LongType): ts.Expression {
        const expr = ts.createNumericLiteral(type.toString());
        ts.addSyntheticTrailingComment(expr, ts.SyntaxKind.MultiLineCommentTrivia, `LongType.${rt.LongType[type]}`);
        return expr;
    }


    // V: Map field value type.
    private createMapV(source: TypescriptFile, mapV: (rt.PartialFieldInfo & { kind: "map" })["V"]): ts.ObjectLiteralExpression {
        let T: ts.Expression;
        let L: ts.Expression | undefined = undefined;
        switch (mapV.kind) {
            case "message":
                T = this.createMessageT(source, mapV.T());
                break;
            case "enum":
                T = this.createEnumT(source, mapV.T());
                break;
            case "scalar":
                T = this.createScalarType(mapV.T);
                if (mapV.L !== undefined)
                    L = this.createLongType(mapV.L);
                break;
        }
        const properties: ts.ObjectLiteralElementLike[] = [
            ts.createPropertyAssignment(ts.createIdentifier('kind'), ts.createStringLiteral(mapV.kind)),
            ts.createPropertyAssignment(ts.createIdentifier('T'), T)
        ];
        if (L) {
            properties.push(
                ts.createPropertyAssignment(ts.createIdentifier('L'), L)
            );
        }
        return ts.createObjectLiteral(properties);
    }


}
