import {MergeOptions} from "./merge-options";
import type {FieldInfo} from "./reflection-info";
import type {PartialMessage} from "./message-type-contract";
import type {UnknownMessage, UnknownOneofGroup} from "./unknown-types";

/**
 * Copy partial data into the target message.
 *
 * If a singular scalar or enum field is present in the source, it
 * replaces the field in the target.
 *
 * By default if a singular message field is present in the source,
 * it is merged with the target field by calling mergePartial() of
 * the responsible message type.
 *
 * By default if a repeated field is present in the source, its values
 * replace all values in the target array, removing extraneous values.
 * By default repeated message fields are copied, not merged.
 *
 * By default if a map field is present in the source, entries are added
 * to the target map, replacing entries with the same key. Entries that
 * only exist in the target remain. By default, entries with message
 * values are copied, not merged.
 *
 * Note that this function's defaults differs from protobuf merge
 * semantics, which appends repeated fields.
 */
export function reflectionMergePartial<T extends object>(info: {
    /** Simple information for each message field in `T` */
    readonly fields: readonly FieldInfo[]
}, target: T, source: PartialMessage<T>, maybeMergeOptions?: MergeOptions) {
    const mergeOptions = MergeOptions.withDefaults(maybeMergeOptions);
    for (let field of info.fields) {
        let name = field.localName;
        if (!field.oneof)
            mergeFromFieldValue(field, (source as UnknownMessage)[name], target as UnknownMessage, mergeOptions);
        else {
            let sourceGroup = (source as UnknownMessage)[field.oneof] as UnknownOneofGroup | undefined,
                targetGroup = (target as UnknownMessage)[field.oneof] as UnknownOneofGroup;
            if (sourceGroup?.oneofKind === name) {
                delete targetGroup[targetGroup.oneofKind!];
                targetGroup.oneofKind = name;
                mergeFromFieldValue(field, sourceGroup[name], targetGroup, mergeOptions);
            }
        }
    }
}

export function mergeFromFieldValue(
    field: FieldInfo,
    fieldValue: UnknownMessage[string],
    output: UnknownMessage,
    mergeOptions: MergeOptions.NonNullable,
): void {
    const name = field.localName;
    if (field.repeat) {
        if (!fieldValue)
            return;
        let outArr = output[name] as any[];
        if (mergeOptions.repeated === MergeOptions.Repeated.REPLACE)
            outArr.length = 0;
        let srcArr = fieldValue as any[],
            lo = outArr.length,
            hi = lo + srcArr.length;
        
        switch (field.kind) {
            case "scalar":
            case "enum":
                for (let i = lo; i < hi; i++)
                    outArr[i] = srcArr[i - lo]; // elements are not reference types
                return;
            case "message":
                let T = field.T();
                for (let i = lo; i < hi; i++)
                    if (mergeOptions.repeated === MergeOptions.Repeated.DEEP && outArr[i])
                        T.mergePartial(outArr[i], srcArr[i - lo], mergeOptions);
                    else
                        outArr[i] = T.create(srcArr[i - lo]);
                return;
        }
        return;
    }

    // Only deal with non-repeated values
    switch (field.kind) {
        case "scalar":
        case "enum":
            if (fieldValue != undefined)
                output[name] = fieldValue; // not a reference type
            return;
        case "message":
            if (!fieldValue) {
                if (mergeOptions.replaceMessages === MergeOptions.ReplaceMessages.ALWAYS)
                    delete output[name];
            } else if (mergeOptions.replaceMessages || !output[name])
                output[name] = field.T().create(fieldValue as PartialMessage<any>);
            else
                field.T().mergePartial(output[name], fieldValue as PartialMessage<any>, mergeOptions);
            return;
        case "map":
            if (!fieldValue)
                return;
            let outMap = (mergeOptions.map === MergeOptions.Map.REPLACE
                ? output[name] = {}
                : output[name]) as any;
            switch (field.V.kind) {
                case "scalar":
                case "enum":
                    Object.assign(outMap, fieldValue); // elements are not reference types
                    return;
                case "message":
                    let T = field.V.T();
                    for (let [k, v] of Object.entries(fieldValue as any))
                        if (mergeOptions.map === MergeOptions.Map.DEEP && outMap[k])
                            T.mergePartial(outMap[k], v as PartialMessage<any>, mergeOptions);
                        else
                            outMap[k] = T.create(v as UnknownMessage);
                    return;
            }
    }
}
