import * as rt from "@protobuf-ts/runtime";
import * as rpc from "@protobuf-ts/runtime-rpc";
import * as ts from "typescript";
import {
    TypescriptFile,
    typescriptLiteralFromValue
} from "@protobuf-ts/plugin-framework";
import {TypeScriptImports} from "../es-typescript-imports";


/**
 * Generates TypeScript code for runtime method information,
 * from method field information.
 */
export class MethodInfoGenerator {


    constructor(
        private readonly imports: TypeScriptImports,
    ) {
    }


    createMethodInfoLiterals(source: TypescriptFile, methodInfos: readonly rpc.PartialMethodInfo[]): ts.ArrayLiteralExpression {
        const mi = methodInfos
            .map(mi => MethodInfoGenerator.denormalizeMethodInfo(mi))
            .map(mi => this.createMethodInfoLiteral(source, mi));
        return ts.createArrayLiteral(mi, true);
    }


    createMethodInfoLiteral(source: TypescriptFile, methodInfo: rpc.PartialMethodInfo): ts.ObjectLiteralExpression {
        methodInfo = MethodInfoGenerator.denormalizeMethodInfo(methodInfo);
        const properties: ts.PropertyAssignment[] = [];

        // name: The name of the method as declared in .proto
        // localName: The name of the method in the runtime.
        // idempotency: The idempotency level as specified in .proto.
        // serverStreaming: Was the rpc declared with server streaming?
        // clientStreaming: Was the rpc declared with client streaming?
        // options: Contains custom method options from the .proto source in JSON format.
        for (let key of ["name", "localName", "idempotency", "serverStreaming", "clientStreaming", "options"] as const) {
            if (methodInfo[key] !== undefined) {
                properties.push(ts.createPropertyAssignment(
                    key, typescriptLiteralFromValue(methodInfo[key])
                ));
            }
        }

        // I: The generated type handler for the input message.
        properties.push(ts.createPropertyAssignment(
            ts.createIdentifier('I'),
            ts.createIdentifier(this.imports.typeByName(
                source,
                methodInfo.I.typeName,
            ))
        ));

        // O: The generated type handler for the output message.
        properties.push(ts.createPropertyAssignment(
            ts.createIdentifier('O'),
            ts.createIdentifier(this.imports.typeByName(
                source,
                methodInfo.O.typeName,
            ))
        ));

        return ts.createObjectLiteral(properties, false);
    }


    /**
     * Turn normalized method info returned by normalizeMethodInfo() back into
     * the minimized form.
     */
    private static denormalizeMethodInfo(info: rpc.PartialMethodInfo): rpc.PartialMethodInfo {
        let partial: any = {...info};
        delete partial.service;
        if (info.localName === rt.lowerCamelCase(info.name)) {
            delete partial.localName;
        }
        if (!info.serverStreaming) {
            delete partial.serverStreaming;
        }
        if (!info.clientStreaming) {
            delete partial.clientStreaming;
        }
        if (info.options && Object.keys(info.options).length) {
            delete partial.info;
        }
        if (info.idempotency === undefined) {
            delete partial.idempotency;
        }
        return partial;
    }


}
