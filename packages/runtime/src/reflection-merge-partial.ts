import type {MessageInfo} from "./reflection-info";
import type {PartialMessage} from "./message-type-contract";
import type {UnknownMessage, UnknownOneofGroup} from "./unknown-types";


/**
 * Copy partial data into the target message.
 *
 * If a singular scalar or enum field is present in the source, it
 * replaces the field in the target.
 *
 * If a singular message field is present in the source, it is merged
 * with the target field by calling mergePartial() of the responsible
 * message type.
 *
 * If a repeated field is present in the source, its values replace
 * all values in the target array, removing extraneous values.
 * Repeated message fields are copied, not merged.
 *
 * If a map field is present in the source, entries are added to the
 * target map, replacing entries with the same key. Entries that only
 * exist in the target remain. Entries with message values are copied,
 * not merged.
 *
 * Note that this function differs from protobuf merge semantics,
 * which appends repeated fields.
 */

export function reflectionMergePartial<T extends object>(info: MessageInfo, target: T, source: PartialMessage<T>) {

    let
        fieldValue: UnknownMessage[string], // the field value we are working with
        input = source as Partial<UnknownMessage>,
        output: UnknownMessage | UnknownOneofGroup; // where we want our field value to go

    for (let field of info.fields) {
        /** This can actually be any `string`, but we cast it to the literal `"value"` so we can index into oneof groups */
        let name = field.localName as "value";

        if (field.oneof) {
            const group = input[field.oneof] as UnknownOneofGroup | undefined; // this is the oneof`s group in the source
            if (group?.kind == undefined) { // the user is free to omit
                continue; // we skip this field, and all other members too
            }
            fieldValue = group.value; // our value comes from the the oneof group of the source
            output = (target as UnknownMessage)[field.oneof] as UnknownOneofGroup; // and our output is the oneof group of the target
            output.kind = group.kind; // always update discriminator
            if (fieldValue == undefined) {
                delete output.value; // remove any existing value
                continue; // skip further work on field
            }
        } else {
            fieldValue = input[name]; // we are using the source directly
            output = target as UnknownMessage; // we want our field value to go directly into the target
            if (fieldValue == undefined) {
                continue; // skip further work on field, existing value is used as is
            }
        }

        if (field.repeat)
            (output[name] as any[]).length = (fieldValue as any[]).length; // resize target array to match source array

        // now we just work with `fieldValue` and `output` to merge the value
        switch (field.kind) {
            case "scalar":
            case "enum":
                if (field.repeat)
                    for (let i = 0; i < (fieldValue as any[]).length; i++)
                        (output[name] as any[])[i] = (fieldValue as any[])[i]; // not a reference type
                else
                    output[name] = fieldValue; // not a reference type
                break;

            case "message":
                let T = field.T();
                if (field.repeat)
                    for (let i = 0; i < (fieldValue as any[]).length; i++)
                        (output[name] as any[])[i] = T.create((fieldValue as any[])[i]);
                else if (output[name] === undefined)
                    output[name] = T.create(fieldValue as PartialMessage<any>); // nothing to merge with
                else
                    T.mergePartial(output[name], fieldValue as PartialMessage<any>);
                break;

            case "map":
                // Map and repeated fields are simply overwritten, not appended or merged
                switch (field.V.kind) {
                    case "scalar":
                    case "enum":
                        Object.assign(output[name], fieldValue); // elements are not reference types
                        break;
                    case "message":
                        let T = field.V.T();
                        for (let k of Object.keys(fieldValue as any))
                            (output[name] as any)[k] = T.create((fieldValue as any)[k]);
                        break;
                }
                break;

        }
    }
}
