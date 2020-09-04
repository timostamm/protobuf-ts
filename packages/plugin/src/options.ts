import {FileOptions_OptimizeMode} from "@protobuf-ts/plugin-framework";
import {LongType} from "@protobuf-ts/runtime";


/**
 * Internal settings for the file generation.
 */
export interface InternalOptions {
    readonly pluginCredit?: string;
    readonly optimizeFor: FileOptions_OptimizeMode;
    readonly normalLongType: LongType,
    readonly emitAngularAnnotations: boolean;
    // create a "synthetic" enum value with this string as name if no 0 value is present
    readonly synthesizeEnumZeroValue: string | false;
    readonly oneofKindDiscriminator: string;
    readonly angularCoreImportPath: string;
    readonly runtimeAngularImportPath: string;
    readonly runtimeRpcImportPath: string;
    readonly runtimeImportPath: string;
}

export function makeInternalOptions(options?: Partial<InternalOptions>): InternalOptions {
    let o = options as any, i = defaultOptions as any;
    if (!o) return i;
    for (let k of Object.keys(defaultOptions)) {
        if (o[k] === undefined) {
            o[k] = i[k];
        }
    }
    return o as InternalOptions;
}

const defaultOptions: InternalOptions = {
    optimizeFor: FileOptions_OptimizeMode.SPEED,
    normalLongType: LongType.BIGINT,
    emitAngularAnnotations: false,
    synthesizeEnumZeroValue: 'UNSPECIFIED$',
    oneofKindDiscriminator: 'oneofKind',
    runtimeAngularImportPath: '@protobuf-ts/runtime-angular',
    runtimeRpcImportPath: '@protobuf-ts/runtime-rpc',
    angularCoreImportPath: '@angular/core',
    runtimeImportPath: '@protobuf-ts/runtime',
} as const;

