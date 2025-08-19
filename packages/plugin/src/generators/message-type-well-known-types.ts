import type {DescMessage} from "@bufbuild/protobuf";
import type {File, Schema} from "../schema";
import {importMessageInterface} from "./message-interface";
import {createImportSymbol, createJsDocBlock} from "@bufbuild/protoplugin-print";
import {LongType} from "@protobuf-ts/runtime";

export function printWellKnownTypeMethods(schema: Schema, file: File, desc: DescMessage): void {
    function getLocalFieldName(fieldProtoName: string): string {
        const field = desc.fields.find(field => field.name === fieldProtoName);
        if (!field) {
            throw new Error(`Unknown field ${fieldProtoName} on ${desc}`);
        }
        return schema.interpreter.getFieldInfo(field).localName;
    }
    const IMessageType = createImportSymbol("IMessageType", "@protobuf-ts/runtime", true);
    const BinaryReadOptions = createImportSymbol("BinaryReadOptions", "@protobuf-ts/runtime", true);
    const JsonWriteOptions = createImportSymbol("JsonWriteOptions", "@protobuf-ts/runtime", true);
    const jsonWriteOptions = createImportSymbol("jsonWriteOptions", "@protobuf-ts/runtime", false);
    const JsonReadOptions = createImportSymbol("JsonReadOptions", "@protobuf-ts/runtime", true);
    const JsonValue = createImportSymbol("JsonValue", "@protobuf-ts/runtime", true);
    const typeofJsonValue = createImportSymbol("typeofJsonValue", "@protobuf-ts/runtime", false);
    const isJsonObject = createImportSymbol("isJsonObject", "@protobuf-ts/runtime", false);
    const PbLong = createImportSymbol("PbLong", "@protobuf-ts/runtime", false);
    const ScalarType = createImportSymbol("ScalarType", "@protobuf-ts/runtime", false);
    const lowerCamelCase = createImportSymbol("lowerCamelCase", "@protobuf-ts/runtime", false);
    const JsonObject = createImportSymbol("JsonObject", "@protobuf-ts/runtime", true);
    const iLongType = createImportSymbol("LongType", "@protobuf-ts/runtime", false);
    let longConvertMethod = 'toBigInt';
    if (schema.options.normalLongType === LongType.NUMBER)
        longConvertMethod = 'toNumber';
    else if (schema.options.normalLongType === LongType.STRING)
        longConvertMethod = 'toString';
    let longTypeEnumValue = 'BIGINT';
    if (schema.options.normalLongType === LongType.NUMBER)
        longTypeEnumValue = 'NUMBER';
    else if (schema.options.normalLongType === LongType.STRING)
        longTypeEnumValue = 'STRING';
    switch (desc.typeName) {
        case "google.protobuf.Any":
            const Any = importMessageInterface(desc);
            const typeUrlField = getLocalFieldName('type_url');
            file.println(createJsDocBlock([
                "Pack the message into a new `Any`.",
                "",
                "Uses 'type.googleapis.com/full.type.name' as the type URL.",
            ].join("\n"), "    "));
            file.println("    pack<T extends object>(message: T, type: ", IMessageType, "<T>): ", Any, " {");
            file.println("        return {");
            file.println("            ", typeUrlField, ": this.typeNameToUrl(type.typeName),");
            file.println("            value: type.toBinary(message),");
            file.println("        };");
            file.println("    }");
            file.println(createJsDocBlock([
                "Unpack the message from the `Any`.",
            ].join("\n"), "    "));
            file.println("    unpack<T extends object>(any: ", Any, ", type: ", IMessageType, "<T>, options?: Partial<", BinaryReadOptions, ">): T {");
            file.println("        if (!this.contains(any, type))");
            file.println(`            throw new Error("Cannot unpack google.protobuf.Any with `, typeUrlField, ` '" + any.`, typeUrlField, ` + "' as " + type.typeName + ".");`);
            file.println("        return type.fromBinary(any.value, options);");
            file.println("    }");
            file.println(createJsDocBlock([
                "Does the given `Any` contain a packed message of the given type?",
            ].join("\n"), "    "));
            file.println("    contains(any: ", Any, ", type: ", IMessageType, "<any> | string): boolean {");
            file.println("        if (!any.", typeUrlField, ".length)");
            file.println("            return false;");
            file.println('        let wants = typeof type == "string" ? type : type.typeName;');
            file.println("        let has = this.typeUrlToName(any.", typeUrlField, ");");
            file.println("        return wants === has;");
            file.println("    }");
            file.println(createJsDocBlock([
                "Convert the message to canonical JSON value.",
                "",
                "You have to provide the `typeRegistry` option so that the",
                "packed message can be converted to JSON.",
                "",
                "The `typeRegistry` option is also required to read",
                "`google.protobuf.Any` from JSON format.",
            ].join("\n"), "    "));
            file.println("    internalJsonWrite(any: ", Any, ", options: ", JsonWriteOptions, "): ", JsonValue, " {");
            file.println('        if (any.', typeUrlField, ' === "")');
            file.println("            return {};");
            file.println("        let typeName = this.typeUrlToName(any.", typeUrlField ,");");
            file.println("        let opt = ", jsonWriteOptions, "(options);");
            file.println("        let type = opt.typeRegistry?.find(t => t.typeName === typeName);");
            file.println("        if (!type)");
            file.println('            throw new globalThis.Error("Unable to convert google.protobuf.Any with typeUrl " + any.', typeUrlField, ' + " to JSON. The specified type " + typeName + " is not available in the type registry.");');
            file.println("        let value = type.fromBinary(any.value, {readUnknownField: false});");
            file.println("        let json = type.internalJsonWrite(value, opt);");
            file.println('        if (typeName.startsWith("google.protobuf.") || !', isJsonObject, '(json))');
            file.println("            json = {value: json};");
            file.println("        json['@type'] = any.", typeUrlField, ";");
            file.println("        return json;");
            file.println("    }");
            file.println("    internalJsonRead(json: ", JsonValue, ", options: ", JsonReadOptions, ", target?: ", Any, "): ", Any, " {");
            file.println("        if (!", isJsonObject, "(json))");
            file.println('            throw new globalThis.Error("Unable to parse google.protobuf.Any from JSON " + ', typeofJsonValue, '(json) + ".");');
            file.println('        if (typeof json["@type"] != "string" || json["@type"] == "")');
            file.println("            return this.create();");
            file.println('        let typeName = this.typeUrlToName(json["@type"]);');
            file.println("        let type = options?.typeRegistry?.find(t => t.typeName == typeName);");
            file.println("        if (!type)");
            file.println('            throw new globalThis.Error("Unable to parse google.protobuf.Any from JSON. The specified type " + typeName + " is not available in the type registry.");');
            file.println("        let value;");
            file.println("        if (typeName.startsWith('google.protobuf.') && json.hasOwnProperty('value'))");
            file.println("            value = type.fromJson(json['value'], options);");
            file.println("        else {");
            file.println("            let copy = Object.assign({}, json);");
            file.println("            delete copy['@type'];");
            file.println("            value = type.fromJson(copy, options);");
            file.println("        }");
            file.println("        if (target === undefined)");
            file.println("            target = this.create();");
            file.println("        target.", typeUrlField, " = json['@type'];");
            file.println("        target.value = type.toBinary(value);");
            file.println("        return target;");
            file.println("    }");
            file.println("    typeNameToUrl(name: string): string {");
            file.println("        if (!name.length)");
            file.println("            throw new Error('invalid type name: ' + name);");
            file.println('        return "type.googleapis.com/" + name;');
            file.println("    }");
            file.println("    typeUrlToName(url: string): string {");
            file.println("        if (!url.length)");
            file.println("            throw new Error('invalid type url: ' + url);");
            file.println('        let slash = url.lastIndexOf("/");');
            file.println("        let name = slash > 0 ? url.substring(slash + 1) : url;");
            file.println("        if (!name.length)");
            file.println("            throw new Error('invalid type url: ' + url);");
            file.println("        return name;");
            file.println("    }");
            break;

        case "google.protobuf.Timestamp":
            const Timestamp = importMessageInterface(desc);
            file.println(createJsDocBlock([
                "Creates a new `Timestamp` for the current time.",
            ].join("\n"), "    "));
            file.println(`    now(): `, Timestamp, ` {`);
            file.println(`        const msg = this.create();`);
            file.println(`        const ms = Date.now();`);
            file.println(`        msg.seconds = `, PbLong, `.from(Math.floor(ms / 1000)).`, longConvertMethod, `();`);
            file.println(`        msg.nanos = (ms % 1000) * 1000000;`);
            file.println(`        return msg;`);
            file.println(`    }`);
            file.println(createJsDocBlock([
                "Converts a `Timestamp` to a JavaScript Date.",
            ].join("\n"), "    "));
            file.println(`    toDate(message: `, Timestamp, `): Date {`);
            file.println(`        return new Date(`, PbLong, `.from(message.seconds).toNumber() * 1000 + Math.ceil(message.nanos / 1000000));`);
            file.println(`    }`);
            file.println(createJsDocBlock([
                "Converts a JavaScript Date to a `Timestamp`.",
            ].join("\n"), "    "));
            file.println(`    fromDate(date: Date): `, Timestamp, ` {`);
            file.println(`        const msg = this.create();`);
            file.println(`        const ms = date.getTime();`);
            file.println(`        msg.seconds = PbLong.from(Math.floor(ms / 1000)).`, longConvertMethod, `();`);
            file.println(`        msg.nanos = ((ms % 1000) + (ms < 0 && ms % 1000 !== 0 ? 1000 : 0)) * 1000000;`);
            file.println(`        return msg;`);
            file.println(`    }`);
            file.println(createJsDocBlock([
                "In JSON format, the `Timestamp` type is encoded as a string",
                "in the RFC 3339 format.",
            ].join("\n"), "    "));
            file.println(`    internalJsonWrite(message: `, Timestamp, `, options: `, JsonWriteOptions, `): `, JsonValue, ` {`);
            file.println(`        let ms = PbLong.from(message.seconds).toNumber() * 1000;`);
            file.println(`        if (ms < Date.parse("0001-01-01T00:00:00Z") || ms > Date.parse("9999-12-31T23:59:59Z"))`);
            file.println(`            throw new Error("Unable to encode Timestamp to JSON. Must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive.");`);
            file.println(`        if (message.nanos < 0)`);
            file.println(`            throw new Error("Unable to encode invalid Timestamp to JSON. Nanos must not be negative.");`);
            file.println(`        let z = "Z";`);
            file.println(`        if (message.nanos > 0) {`);
            file.println(`            let nanosStr = (message.nanos + 1000000000).toString().substring(1);`);
            file.println(`            if (nanosStr.substring(3) === "000000")`);
            file.println(`                z = "." + nanosStr.substring(0, 3) + "Z";`);
            file.println(`            else if (nanosStr.substring(6) === "000")`);
            file.println(`                z = "." + nanosStr.substring(0, 6) + "Z";`);
            file.println(`            else`);
            file.println(`                z = "." + nanosStr + "Z";`);
            file.println(`        }`);
            file.println(`        return new Date(ms).toISOString().replace(".000Z", z);`);
            file.println(`    }`);
            file.println(createJsDocBlock([
                "In JSON format, the `Timestamp` type is encoded as a string",
                "in the RFC 3339 format.",
            ].join("\n"), "    "));
            file.println(`    internalJsonRead(json: `, JsonValue, `, options: `, JsonReadOptions, `, target?: `, Timestamp, `): `, Timestamp, ` {`);
            file.println(`        if (typeof json !== "string")`);
            file.println(`            throw new Error("Unable to parse Timestamp from JSON " + `, typeofJsonValue, `(json) + ".");`);
            file.println(`        // RFC 3339 with "Z" (UTC) or offset like "+08:00" and optional fractions`);
            file.println(`        // match[7] optional fractions, 3 to 9 digits`);
            file.println(`        // match[8] offset like "-08:00", if undefined date is UTC`);
            file.println(`        let matches = json.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(?:Z|\.([0-9]{3,9})Z|([+-][0-9][0-9]:[0-9][0-9]))$/);`);
            file.println(`        if (!matches)`);
            file.println(`            throw new Error("Unable to parse Timestamp from JSON. Invalid format.");`);
            file.println(`        let ms = Date.parse(matches[1] + "-" + matches[2] + "-" + matches[3] + "T" + matches[4] + ":" + matches[5] + ":" + matches[6] + (matches[8] ? matches[8] : "Z"));`);
            file.println(`        if (Number.isNaN(ms))`);
            file.println(`            throw new Error("Unable to parse Timestamp from JSON. Invalid value.");`);
            file.println(`        if (ms < Date.parse("0001-01-01T00:00:00Z") || ms > Date.parse("9999-12-31T23:59:59Z"))`);
            file.println(`            throw new globalThis.Error("Unable to parse Timestamp from JSON. Must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive.");`);
            file.println(`        if (!target)`);
            file.println(`            target = this.create();`);
            file.println(`        target.seconds = PbLong.from(ms / 1000).`, longConvertMethod, `();`);
            file.println(`        target.nanos = 0;`);
            file.println(`        if (matches[7])`);
            file.println(`            target.nanos = (parseInt("1" + matches[7] + "0".repeat(9 - matches[7].length)) - 1000000000);`);
            file.println(`        return target;`);
            file.println(`    }`);
            break;
        case "google.protobuf.Duration":
            const Duration = importMessageInterface(desc);
            file.println(createJsDocBlock([
                "Encode `Duration` to JSON string like \"3.000001s\".",
            ].join("\n"), "    "));
            file.println(`    internalJsonWrite(message: `, Duration, `, options: `, JsonWriteOptions, `): `, JsonValue, ` {`);
            file.println(`        let s = `, PbLong, `.from(message.seconds).toNumber();`);
            file.println(`        if (s > 315576000000 || s < -315576000000)`);
            file.println(`            throw new Error("Duration value out of range.");`);
            file.println(`        let text = message.seconds.toString();`);
            file.println(`        if (s === 0 && message.nanos < 0)`);
            file.println(`            text = "-" + text;`);
            file.println(`        if (message.nanos !== 0) {`);
            file.println(`            let nanosStr = Math.abs(message.nanos).toString();`);
            file.println(`            nanosStr = "0".repeat(9 - nanosStr.length) + nanosStr;`);
            file.println(`            if (nanosStr.substring(3) === "000000")`);
            file.println(`                nanosStr = nanosStr.substring(0, 3);`);
            file.println(`            else if (nanosStr.substring(6) === "000")`);
            file.println(`                nanosStr = nanosStr.substring(0, 6);`);
            file.println(`            text += "." + nanosStr;`);
            file.println(`        }`);
            file.println(`        return text + "s";`);
            file.println(`    }`);
            file.println(createJsDocBlock([
                "Decode `Duration` from JSON string like \"3.000001s\"",
            ].join("\n"), "    "));
            file.println(`    internalJsonRead(json: `, JsonValue, `, options: `, JsonReadOptions, `, target?: `, Duration, `): `, Duration, ` {`);
            file.println(`        if (typeof json !== "string")`);
            file.println(`            throw new Error("Unable to parse Duration from JSON " + `, typeofJsonValue, `(json) + ". Expected string.");`);
            file.println(`        let match = json.match(/^(-?)([0-9]+)(?:\\.([0-9]+))?s/);`);
            file.println(`        if (match === null)`);
            file.println(`            throw new Error("Unable to parse Duration from JSON string. Invalid format.");`);
            file.println(`        if (!target)`);
            file.println(`            target = this.create();`);
            file.println(`        let [, sign, secs, nanos] = match;`);
            file.println(`        let longSeconds = `, PbLong, `.from(sign + secs);`);
            file.println(`        if (longSeconds.toNumber() > 315576000000 || longSeconds.toNumber() < -315576000000)`);
            file.println(`            throw new Error("Unable to parse Duration from JSON string. Value out of range.");`);
            file.println(`        target.seconds = longSeconds.`, longConvertMethod, `();`);
            file.println(`        if (typeof nanos == "string") {`);
            file.println(`            let nanosStr = sign + nanos + "0".repeat(9 - nanos.length);`);
            file.println(`            target.nanos = parseInt(nanosStr);`);
            file.println(`        }`);
            file.println(`        return target;`);
            file.println(`    }`);
            break;
        case "google.protobuf.FieldMask":
            const FieldMask = importMessageInterface(desc);
            file.println(createJsDocBlock([
                "Encode `FieldMask` to JSON object.",
            ].join("\n"), "    "));
            file.println(`    internalJsonWrite(message: `, FieldMask, `, options: `, JsonWriteOptions, `): `, JsonValue, ` {`);
            file.println(`        const invalidFieldMaskJsonRegex = /[A-Z]|(_([.0-9_]|$))/g;`);
            file.println(`        return message.paths.map(p => {`);
            file.println(`            if (invalidFieldMaskJsonRegex.test(p))`);
            file.println(`                throw new Error("Unable to encode FieldMask to JSON. lowerCamelCase of path name '" + p + "' is irreversible.");`);
            file.println(`            return `, lowerCamelCase, `(p);`);
            file.println(`        }).join(",");`);
            file.println(`    }`);
            file.println(createJsDocBlock([
                "Decode `FieldMask` from JSON object.",
            ].join("\n"), "    "));
            file.println(`    internalJsonRead(json: `, JsonValue, `, options: `, JsonReadOptions, `, target?: `, FieldMask, `): `, FieldMask, ` {`);
            file.println(`        if (typeof json !== "string")`);
            file.println(`            throw new Error("Unable to parse FieldMask from JSON " + `, typeofJsonValue, `(json) + ". Expected string.");`);
            file.println(`        if (!target)`);
            file.println(`            target = this.create();`);
            file.println(`        if (json === "")`);
            file.println(`            return target;`);
            file.println(`        let camelToSnake = (str: string) => {`);
            file.println(`            if (str.includes('_'))`);
            file.println(`                throw new Error("Unable to parse FieldMask from JSON. Path names must be lowerCamelCase.");`);
            file.println(`            let sc = str.replace(/[A-Z]/g, letter => "_" + letter.toLowerCase());`);
            file.println(`            return sc;`);
            file.println(`        };`);
            file.println(`        target.paths = json.split(",").map(camelToSnake);`);
            file.println(`        return target;`);
            file.println(`    }`);
            break;
        case "google.protobuf.Struct":
            const Struct = importMessageInterface(desc);
            file.println(createJsDocBlock([
                "Encode `Struct` to JSON object. ",
            ].join("\n"), "    "));
            file.println(`    internalJsonWrite(message: `, Struct, `, options: `, JsonWriteOptions, `): `, JsonValue, ` {`);
            file.println(`        let json: `, JsonObject, ` = {};`);
            file.println(`        for (let [k, v] of Object.entries(message.fields)) {`);
            file.println(`            json[k] = Value.toJson(v);`);
            file.println(`        }`);
            file.println(`        return json;`);
            file.println(`    }`);
            file.println(createJsDocBlock([
                "Decode `Struct` from JSON object.",
            ].join("\n"), "    "));
            file.println(`    internalJsonRead(json: `, JsonValue, `, options: `, JsonReadOptions, `, target?: `, Struct, `): `, Struct, ` {`);
            file.println(`        if (!`, isJsonObject, `(json))`);
            file.println(`            throw new globalThis.Error("Unable to parse message " + this.typeName + " from JSON " + `, typeofJsonValue, `(json) + ".");`);
            file.println(`        if (!target)`);
            file.println(`            target = this.create();`);
            file.println(`        for (let [k, v] of globalThis.Object.entries(json)) {`);
            file.println(`            target.fields[k] = Value.fromJson(v);`);
            file.println(`        }`);
            file.println(`        return target;`);
            file.println(`    }`);
            break;
        case "google.protobuf.Value":
            const Value = importMessageInterface(desc);
            const nullValueField = getLocalFieldName('null_value');
            const boolValueField = getLocalFieldName('bool_value');
            const numberValueField = getLocalFieldName('number_value');
            const stringValueField = getLocalFieldName('string_value');
            const listValueField = getLocalFieldName('list_value');
            const structValueField = getLocalFieldName('struct_value');
            file.println(createJsDocBlock([
                "Encode `Value` to JSON value. "
            ].join("\n"), "    "));
            file.println(`    internalJsonWrite(message: `, Value, `, options: `, JsonWriteOptions, `): `, JsonValue, ` {`);
            file.println(`        if (message.kind.oneofKind === undefined) throw new globalThis.Error();`);
            file.println(`        switch (message.kind.oneofKind) {`);
            file.println(`            case undefined:`);
            file.println(`                throw new globalThis.Error();`);
            file.println(`            case "`, boolValueField, `":`);
            file.println(`                return message.kind.`, boolValueField, `;`);
            file.println(`            case "`, nullValueField, `":`);
            file.println(`                return null;`);
            file.println(`            case "`, numberValueField, `":`);
            file.println(`                let numberValue = message.kind.`, numberValueField, `;`);
            file.println(`                if (typeof numberValue == "number" && !Number.isFinite(numberValue)) throw new globalThis.Error();`);
            file.println(`                return numberValue;`);
            file.println(`            case "`, stringValueField, `":`);
            file.println(`                return message.kind.`, stringValueField, `;`);
            file.println(`            case "`, listValueField, `":`);
            file.println(`                let listValueField = this.fields.find(f => f.no === 6);`);
            file.println(`                if (listValueField?.kind !== 'message') throw new globalThis.Error();`);
            file.println(`                return listValueField.T().toJson(message.kind.`, listValueField, `);`);
            file.println(`            case "`, structValueField, `":`);
            file.println(`                let structValueField = this.fields.find(f => f.no === 5);`);
            file.println(`                if (structValueField?.kind !== 'message') throw new globalThis.Error();`);
            file.println(`                return structValueField.T().toJson(message.kind.`, structValueField, `);`);
            file.println(`        }`);
            file.println(`    }`);
            file.println(createJsDocBlock([
                "Decode `Value` from JSON value."
            ].join("\n"), "    "));
            file.println(`    internalJsonRead(json: `, JsonValue, `, options: `, JsonReadOptions, `, target?: `, Value, `): `, Value, ` {`);
            file.println(`        if (!target)`);
            file.println(`            target = this.create();`);
            file.println(`        switch (typeof json) {`);
            file.println(`            case "number":`);
            file.println(`                target.kind = { oneofKind: "`, numberValueField, `", `, numberValueField, `: json };`);
            file.println(`                break;`);
            file.println(`            case "string":`);
            file.println(`                target.kind = { oneofKind: "`, stringValueField, `", `, stringValueField, `: json };`);
            file.println(`                break;`);
            file.println(`            case "boolean":`);
            file.println(`                target.kind = { oneofKind: "`, boolValueField, `", `, boolValueField, `: json };`);
            file.println(`                break;`);
            file.println(`            case "object":`);
            file.println(`                if (json === null) {`);
            file.println(`                    target.kind = {oneofKind: "`, nullValueField, `", `, nullValueField, `: NullValue.NULL_VALUE};`);
            file.println(`                } else if (globalThis.Array.isArray(json)) {`);
            file.println(`                    target.kind = {oneofKind: "`, listValueField, `", `, listValueField, `: ListValue.fromJson(json)};`);
            file.println(`                } else {`);
            file.println(`                    target.kind = {oneofKind: "`, structValueField, `", `, structValueField, `: Struct.fromJson(json)};`);
            file.println(`                }`);
            file.println(`                break;`);
            file.println(`            default:`);
            file.println(`                throw new globalThis.Error('Unable to parse ' + this.typeName + ' from JSON ' + `, typeofJsonValue, `(json));`);
            file.println(`        }`);
            file.println(`        return target;`);
            file.println(`    }`);
            break;
        case "google.protobuf.ListValue":
            const ListValue = importMessageInterface(desc);
            file.println(createJsDocBlock([
                "Encode `ListValue` to JSON array."
            ].join("\n"), "    "));
            file.println(`    internalJsonWrite(message: `, ListValue, `, options: `, JsonWriteOptions, `): `, JsonValue, ` {`);
            file.println(`        return message.values.map(v => Value.toJson(v));`);
            file.println(`    }`);
            file.println(createJsDocBlock([
                "Decode `ListValue` from JSON array."
            ].join("\n"), "    "));
            file.println(`    internalJsonRead(json: `, JsonValue, `, options: `, JsonReadOptions, `, target?: `, ListValue, `): `, ListValue, ` {`);
            file.println(`        if (! globalThis.Array.isArray(json)) throw new globalThis.Error('Unable to parse ' + this.typeName + ' from JSON ' + `, typeofJsonValue, `(json));`);
            file.println(`        if (!target)`);
            file.println(`            target = this.create();`);
            file.println(`        let values = json.map(v => Value.fromJson(v));`);
            file.println(`        target.values.push(...values);`);
            file.println(`        return target;`);
            file.println(`    }`);
            break;
        case "google.protobuf.BoolValue":
            const BoolValue = importMessageInterface(desc);
            file.println(createJsDocBlock([
                "Encode `BoolValue` to JSON bool. "
            ].join("\n"), "    "));
            file.println(`    internalJsonWrite(message: `, BoolValue, `, options: `, JsonWriteOptions, `): `, JsonValue, ` {`);
            file.println(`        return message.value;`);
            file.println(`    }`);
            file.println(createJsDocBlock([
                "Decode `BoolValue` from JSON bool."
            ].join("\n"), "    "));
            file.println(`    internalJsonRead(json: `, JsonValue, `, options: `, JsonReadOptions, `, target?: `, BoolValue, `): `, BoolValue, ` {`);
            file.println(`        if (!target)`);
            file.println(`            target = this.create();`);
            file.println(`        target.value = this.refJsonReader.scalar(json, 8, undefined, "value") as boolean;`);
            file.println(`        return target;`);
            file.println(`    }`);
            break;
        case "google.protobuf.StringValue":
            const StringValue = importMessageInterface(desc);
            file.println(createJsDocBlock([
                "Encode `StringValue` to JSON string."
            ].join("\n"), "    "));
            file.println(`    internalJsonWrite(message: `, StringValue, `, options: `, JsonWriteOptions, `): `, JsonValue, ` {`);
            file.println(`        return message.value;`);
            file.println(`    }`);
            file.println(createJsDocBlock([
                "Decode `StringValue` from JSON string."
            ].join("\n"), "    "));
            file.println(`    internalJsonRead(json: `, JsonValue, `, options: `, JsonReadOptions, `, target?: `, StringValue, `): `, StringValue, ` {`);
            file.println(`        if (!target)`);
            file.println(`            target = this.create();`);
            file.println(`        target.value = this.refJsonReader.scalar(json, 9, undefined, "value") as string;`);
            file.println(`        return target;`);
            file.println(`    }`);
            break;
        case "google.protobuf.DoubleValue":
            const DoubleValue = importMessageInterface(desc);
            file.println(createJsDocBlock([
                "Encode `DoubleValue` to JSON number."
            ].join("\n"), "    "));
            file.println(`    internalJsonWrite(message: `, DoubleValue, `, options: `, JsonWriteOptions, `): `, JsonValue, ` {`);
            file.println(`        return this.refJsonWriter.scalar(2, message.value, "value", false, true);`);
            file.println(`    }`);
            file.println(createJsDocBlock([
                "Decode `DoubleValue` from JSON number."
            ].join("\n"), "    "));
            file.println(`    internalJsonRead(json: `, JsonValue, `, options: `, JsonReadOptions, `, target?: `, DoubleValue, `): `, DoubleValue, ` {`);
            file.println(`        if (!target)`);
            file.println(`            target = this.create();`);
            file.println(`        target.value = this.refJsonReader.scalar(json, 1, undefined, "value") as number;`);
            file.println(`        return target;`);
            file.println(`    }`);
            break;
        case "google.protobuf.FloatValue":
            const FloatValue = importMessageInterface(desc);
            file.println(createJsDocBlock([
                "Encode `FloatValue` to JSON number."
            ].join("\n"), "    "));
            file.println(`    internalJsonWrite(message: `, FloatValue, `, options: `, JsonWriteOptions, `): `, JsonValue, ` {`);
            file.println(`        return this.refJsonWriter.scalar(1, message.value, "value", false, true);`);
            file.println(`    }`);
            file.println(createJsDocBlock([
                "Decode `FloatValue` from JSON number."
            ].join("\n"), "    "));
            file.println(`    internalJsonRead(json: `, JsonValue, `, options: `, JsonReadOptions, `, target?: `, FloatValue, `): `, FloatValue, ` {`);
            file.println(`        if (!target)`);
            file.println(`            target = this.create();`);
            file.println(`        target.value = this.refJsonReader.scalar(json, 1, undefined, "value") as number;`);
            file.println(`        return target;`);
            file.println(`    }`);
            break;
        case "google.protobuf.Int32Value":
            const Int32Value = importMessageInterface(desc);
            file.println(createJsDocBlock([
                "Encode `Int32Value` to JSON string."
            ].join("\n"), "    "));
            file.println(`    internalJsonWrite(message: `, Int32Value, `, options: `, JsonWriteOptions, `): `, JsonValue, ` {`);
            file.println(`        return this.refJsonWriter.scalar(5, message.value, "value", false, true);`);
            file.println(`    }`);
            file.println(createJsDocBlock([
                "Decode `Int32Value` from JSON string."
            ].join("\n"), "    "));
            file.println(`    internalJsonRead(json: `, JsonValue, `, options: `, JsonReadOptions, `, target?: `, Int32Value, `): `, Int32Value, ` {`);
            file.println(`        if (!target)`);
            file.println(`            target = this.create();`);
            file.println(`        target.value = this.refJsonReader.scalar(json, 5, undefined, "value") as number;`);
            file.println(`        return target;`);
            file.println(`    }`);
            break;
        case "google.protobuf.UInt32Value":
            const UInt32Value = importMessageInterface(desc);
            file.println(createJsDocBlock([
                "Encode `UInt32Value` to JSON string."
            ].join("\n"), "    "));
            file.println(`    internalJsonWrite(message: `, UInt32Value, `, options: `, JsonWriteOptions, `): `, JsonValue, ` {`);
            file.println(`        return this.refJsonWriter.scalar(13, message.value, "value", false, true);`);
            file.println(`    }`);
            file.println(createJsDocBlock([
                "Decode `UInt32Value` from JSON string."
            ].join("\n"), "    "));
            file.println(`    internalJsonRead(json: `, JsonValue, `, options: `, JsonReadOptions, `, target?: `, UInt32Value, `): `, UInt32Value, ` {`);
            file.println(`        if (!target)`);
            file.println(`            target = this.create();`);
            file.println(`        target.value = this.refJsonReader.scalar(json, 13, undefined, "value") as number;`);
            file.println(`        return target;`);
            file.println(`    }`);
            break;
        case "google.protobuf.Int64Value":
            const Int64Value = importMessageInterface(desc);
            file.println(createJsDocBlock([
                "Encode `Int64Value` to JSON string."
            ].join("\n"), "    "));
            file.println(`    internalJsonWrite(message: `, Int64Value, `, options: `, JsonWriteOptions, `): `, JsonValue, ` {`);
            file.println(`        return this.refJsonWriter.scalar(`, ScalarType, `.INT64, message.value, "value", false, true);`);
            file.println(`    }`);
            file.println(createJsDocBlock([
                "Decode `Int64Value` from JSON string."
            ].join("\n"), "    "));
            file.println(`    internalJsonRead(json: `, JsonValue, `, options: `, JsonReadOptions, `, target?: `, Int64Value, `): `, Int64Value, ` {`);
            file.println(`        if (!target)`);
            file.println(`            target = this.create();`);
            file.println(`        target.value = this.refJsonReader.scalar(json, `, ScalarType, `.INT64, `, iLongType, `.`, longTypeEnumValue, `, "value") as any;`);
            file.println(`        return target;`);
            file.println(`    }`);
            break;
        case "google.protobuf.UInt64Value":
            const UInt64Value = importMessageInterface(desc);
            file.println(createJsDocBlock([
                "Encode `UInt64Value` to JSON string."
            ].join("\n"), "    "));
            file.println(`    internalJsonWrite(message: `, UInt64Value, `, options: `, JsonWriteOptions, `): `, JsonValue, ` {`);
            file.println(`        return this.refJsonWriter.scalar(`, ScalarType, `.UINT64, message.value, "value", false, true);`);
            file.println(`    }`);
            file.println(createJsDocBlock([
                "Decode `UInt64Value` from JSON string."
            ].join("\n"), "    "));
            file.println(`    internalJsonRead(json: `, JsonValue, `, options: `, JsonReadOptions, `, target?: `, UInt64Value, `): `, UInt64Value, ` {`);
            file.println(`        if (!target)`);
            file.println(`            target = this.create();`);
            file.println(`        target.value = this.refJsonReader.scalar(json, `, ScalarType, `.UINT64, `, iLongType, `.`, longTypeEnumValue, `, "value") as any;`);
            file.println(`        return target;`);
            file.println(`    }`);
            break;
        case "google.protobuf.BytesValue":
            const BytesValue = importMessageInterface(desc);
            file.println(createJsDocBlock([
                "Encode `BytesValue` to JSON string."
            ].join("\n"), "    "));
            file.println(`    internalJsonWrite(message: `, BytesValue, `, options: `, JsonWriteOptions, `): `, JsonValue, ` {`);
            file.println(`        return this.refJsonWriter.scalar(12, message.value, "value", false, true);`);
            file.println(`    }`);
            file.println(createJsDocBlock([
                "Decode `BytesValue` from JSON string."
            ].join("\n"), "    "));
            file.println(`    internalJsonRead(json: `, JsonValue, `, options: `, JsonReadOptions, `, target?: `, BytesValue, `): `, BytesValue, ` {`);
            file.println(`        if (!target)`);
            file.println(`            target = this.create();`);
            file.println(`        target.value = this.refJsonReader.scalar(json, 12, undefined, "value") as Uint8Array;`);
            file.println(`        return target;`);
            file.println(`    }`);
            break;



    }
}