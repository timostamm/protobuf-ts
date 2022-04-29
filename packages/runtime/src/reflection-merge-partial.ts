import type {MessageInfo} from "./reflection-info";
import type {PartialMessage} from "./message-type-contract";
import type {UnknownMessage, UnknownOneofGroup} from "./unknown-types";


/**
 * Copy partial data into the target message.
 *
 * Replaces fields in the target with the fields from the
 * (partial) source.
 *
 * Omitted fields are not replaced.
 * Copies all values.
 * A default value in the source will replace a value in the target.
 *
 * Message fields are recursively merged (by calling `mergePartial()`
 * of the responsible message handler). Map and repeated fields
 * are simply overwritten, not appended or merged.
 */
export function reflectionMergePartial<T extends object>(info: MessageInfo, target: T, source: PartialMessage<T>) {

    let
        fieldValue: UnknownMessage[string], // the field value we are working with
        input = source as Partial<UnknownMessage>,
        output: UnknownMessage | UnknownOneofGroup; // where we want our field value to go

    for (let field of info.fields) {
        let name = field.localName;

        if (field.oneof) {
            const group = input[field.oneof] as UnknownOneofGroup | undefined; // this is the oneof`s group in the source
            if (group == undefined) { // the user is free to omit
                continue; // we skip this field, and all other members too
            }
            fieldValue = group[name]; // our value comes from the the oneof group of the source
            output = (target as UnknownMessage)[field.oneof] as UnknownOneofGroup; // and our output is the oneof group of the target
            output.oneofKind = group.oneofKind; // always update discriminator
            if (fieldValue == undefined) {
                delete output[name]; // remove any existing value
                continue; // skip further work on field
            }
        } else {
            fieldValue = input[name]; // we are using the source directly
            output = target as UnknownMessage; // we want our field value to go directly into the target
            if (fieldValue == undefined) {
                continue; // skip further work on field, existing value is used as is
            }
        }

        // now we just work with `fieldValue` and `output` to merge the value
        switch (field.kind) {
            case "scalar":
            case "enum":
                if (field.repeat)
                    output[name] = (fieldValue as any[]).concat(); // elements are not reference types
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
