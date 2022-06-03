import {
    DescriptorProto,
    FieldDescriptorProto_Type,
    ITypeNameLookup,
    TypescriptFile,
    TypeScriptImports,
    typescriptMethodFromText
} from "@protobuf-ts/plugin-framework";
import * as ts from "typescript";
import {LongType} from "@protobuf-ts/runtime";
import {CustomMethodGenerator} from "../code-gen/message-type-generator";
import { FieldInfoGenerator } from "../code-gen/field-info-generator";


export class WellKnownTypes implements CustomMethodGenerator {


    static readonly protoFilenames = [
        "google/protobuf/any.proto",
        "google/protobuf/api.proto",
        "google/protobuf/descriptor.proto",
        "google/protobuf/duration.proto",
        "google/protobuf/empty.proto",
        "google/protobuf/field_mask.proto",
        "google/protobuf/source_context.proto",
        "google/protobuf/struct.proto",
        "google/protobuf/timestamp.proto",
        "google/protobuf/type.proto",
        "google/protobuf/wrappers.proto",
        "google/protobuf/compiler/plugin.proto",
        "google/protobuf/any.proto",
    ];


    constructor(
        private readonly typeNameLookup: ITypeNameLookup,
        private readonly imports: TypeScriptImports,
        private readonly options: { normalLongType: LongType; runtimeImportPath: string, useProtoFieldName: boolean },
    ) {
    }


    /**
     * Create custom methods for the handlers of well known types.
     *
     * Well known types have a custom JSON representation and we
     * also add some convenience methods, for example to convert a
     * `google.protobuf.Timestamp` to a javascript Date.
     */
    make(source: TypescriptFile, descriptor: DescriptorProto): ts.MethodDeclaration[] {
        const
            typeName = this.typeNameLookup.makeTypeName(descriptor),
            fn = this[typeName as keyof this] as unknown as (source: TypescriptFile, descriptor: DescriptorProto) => void | string | string[];
        if (fn) {
            let r = fn.apply(this, [source, descriptor]);
            if (typeof r == "string") {
                return [typescriptMethodFromText(r)];
            }
            if (Array.isArray(r)) {
                return r.map(txt => typescriptMethodFromText(txt));
            }
        }
        return [];
    }


    ['google.protobuf.Empty'](/*source: TypescriptFile, descriptor: DescriptorProto*/) {
        // that´s ok, Empty already has the required JSON representation by default
    }

    ['google.protobuf.Any'](source: TypescriptFile, descriptor: DescriptorProto) {
        const
            Any = this.imports.type(source, descriptor),
            IMessageType = this.imports.name(source,'IMessageType', this.options.runtimeImportPath, true),
            BinaryReadOptions = this.imports.name(source,'BinaryReadOptions', this.options.runtimeImportPath, true),
            JsonWriteOptions = this.imports.name(source,'JsonWriteOptions', this.options.runtimeImportPath, true),
            JsonReadOptions = this.imports.name(source,'JsonReadOptions', this.options.runtimeImportPath, true),
            jsonWriteOptions = this.imports.name(source,'jsonWriteOptions', this.options.runtimeImportPath),
            JsonValue = this.imports.name(source,'JsonValue', this.options.runtimeImportPath, true),
            typeofJsonValue = this.imports.name(source,'typeofJsonValue', this.options.runtimeImportPath),
            isJsonObject = this.imports.name(source,'isJsonObject', this.options.runtimeImportPath),
            typeUrlField = FieldInfoGenerator.createTypescriptLocalName('type_url', this.options);

        return [
            `
			/**
			 * Pack the message into a new \`Any\`.
			 *
			 * Uses 'type.googleapis.com/full.type.name' as the type URL.
			 */
			function pack<T extends object>(message: T, type: ${IMessageType}<T>): ${Any} {
				return {
                    ${typeUrlField}: this.typeNameToUrl(type.typeName),
					value: type.toBinary(message),
				};
			}
            `, `
            /**
			 * Unpack the message from the \`Any\`.
			 */
			function unpack<T extends object>(any: ${Any}, type: ${IMessageType}<T>, options?: Partial<${BinaryReadOptions}>): T {
				if (!this.contains(any, type))
					throw new Error("Cannot unpack google.protobuf.Any with ${typeUrlField} '" + any.${typeUrlField} + "' as " + type.typeName + ".");
                return type.fromBinary(any.value, options);
			}
            `, `
            /**
             * Does the given \`Any\` contain a packed message of the given type?
			 */
			function contains(any: ${Any}, type: ${IMessageType}<any> | string): boolean {
                if (!any.${typeUrlField}.length)
                    return false;
                let wants = typeof type == "string" ? type : type.typeName;
                let has = this.typeUrlToName(any.${typeUrlField});
                return wants === has;
			}
            `, `
			/**
			 * Convert the message to canonical JSON value.
			 *
			 * You have to provide the \`typeRegistry\` option so that the
			 * packed message can be converted to JSON.
			 *
			 * The \`typeRegistry\` option is also required to read
			 * \`google.protobuf.Any\` from JSON format.
			 */
			function internalJsonWrite(any: ${Any}, options: ${JsonWriteOptions}): ${JsonValue} {
                if (any.${typeUrlField} === "")
                    return {};
                let typeName = this.typeUrlToName(any.${typeUrlField});
				let opt = ${jsonWriteOptions}(options);
				let type = opt.typeRegistry?.find(t => t.typeName === typeName);
				if (!type)
					throw new globalThis.Error("Unable to convert google.protobuf.Any with typeUrl '" + any.${typeUrlField} + "' to JSON. The specified type " + typeName + " is not available in the type registry.");
				let value = type.fromBinary(any.value, {readUnknownField: false});
				let json = type.internalJsonWrite(value, opt);
                if (typeName.startsWith("google.protobuf.") || !${isJsonObject}(json))
					json = {value: json};
				json['@type'] = any.${typeUrlField};
				return json;
			}
            `, `
            function internalJsonRead(json: ${JsonValue}, options: ${JsonReadOptions}, target?: ${Any}): ${Any} {
				if (!${isJsonObject}(json))
					throw new globalThis.Error("Unable to parse google.protobuf.Any from JSON " + ${typeofJsonValue}(json) + ".");
				if (typeof json['@type'] != "string" || json['@type'] == '')
					return this.create();
                let typeName = this.typeUrlToName(json["@type"]);
				let type = options?.typeRegistry?.find(t => t.typeName == typeName);
				if (!type)
					throw new globalThis.Error("Unable to parse google.protobuf.Any from JSON. The specified type " + typeName + " is not available in the type registry.");
				let value;
				if (typeName.startsWith('google.protobuf.') && json.hasOwnProperty('value'))
					value = type.fromJson(json['value'], options);
				else {
					let copy = Object.assign({}, json);
					delete copy['@type'];
					value = type.fromJson(copy, options);
				}
				if (target === undefined)
					target = this.create();
				target.${typeUrlField} = json['@type'];
				target.value = type.toBinary(value);
				return target;
			}
           `, `
            function typeNameToUrl(name: string): string {
                if (!name.length)
                    throw new Error('invalid type name: ' + name);
                return "type.googleapis.com/" + name;
            }
            `, `
            function typeUrlToName(url: string): string {
                if (!url.length)
                    throw new Error('invalid type url: ' + url);
                let slash = url.lastIndexOf("/");
                let name = slash > 0 ? url.substring(slash + 1) : url;
                if (!name.length)
                    throw new Error('invalid type url: ' + url);
                return name;
            }
            `
        ];
    }

    ['google.protobuf.Timestamp'](source: TypescriptFile, descriptor: DescriptorProto): string[] {
        const
            Timestamp = this.imports.type(source,descriptor),
            PbLong = this.imports.name(source,'PbLong', this.options.runtimeImportPath),
            JsonWriteOptions = this.imports.name(source,'JsonWriteOptions', this.options.runtimeImportPath, true),
            JsonReadOptions = this.imports.name(source,'JsonReadOptions', this.options.runtimeImportPath, true),
            JsonValue = this.imports.name(source,'JsonValue', this.options.runtimeImportPath, true),
            typeofJsonValue = this.imports.name(source,'typeofJsonValue', this.options.runtimeImportPath);
        let longConvertMethod = 'toBigInt';
        if (this.options.normalLongType === LongType.NUMBER)
            longConvertMethod = 'toNumber';
        else if (this.options.normalLongType === LongType.STRING)
            longConvertMethod = 'toString';
        return [
            `
            /**
             * Creates a new \`Timestamp\` for the current time.
             */ 
            function now(): ${Timestamp} {
                const msg = this.create();
                const ms = Date.now();
                msg.seconds = ${PbLong}.from(Math.floor(ms / 1000)).${longConvertMethod}();
                msg.nanos = (ms % 1000) * 1000000;
                return msg;
            }
            `, `
            /**
             * Converts a \`Timestamp\` to a JavaScript Date.
             */ 
            function toDate(message: ${Timestamp}): Date {
                return new Date(${PbLong}.from(message.seconds).toNumber() * 1000 + Math.ceil(message.nanos / 1000000));
            }
            `, `
            /**
             * Converts a JavaScript Date to a \`Timestamp\`.
             */ 
            function fromDate(date: Date): ${Timestamp} {
                const msg = this.create();
                const ms = date.getTime();
                msg.seconds = PbLong.from(Math.floor(ms / 1000)).${longConvertMethod}();
                msg.nanos = (ms % 1000) * 1000000;
                return msg;
            }
            `, `
            /**
             * In JSON format, the \`Timestamp\` type is encoded as a string 
             * in the RFC 3339 format.
             */
            function internalJsonWrite(message: ${Timestamp}, options: ${JsonWriteOptions}): ${JsonValue} {
                let ms = PbLong.from(message.seconds).toNumber() * 1000;
                if (ms < Date.parse("0001-01-01T00:00:00Z") || ms > Date.parse("9999-12-31T23:59:59Z"))
                    throw new Error("Unable to encode Timestamp to JSON. Must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive.");
                if (message.nanos < 0)
                    throw new Error("Unable to encode invalid Timestamp to JSON. Nanos must not be negative.");
                let z = "Z";
                if (message.nanos > 0) {
                    let nanosStr = (message.nanos + 1000000000).toString().substring(1);
                    if (nanosStr.substring(3) === "000000")
                        z = "." + nanosStr.substring(0, 3) + "Z";
                    else if (nanosStr.substring(6) === "000")
                        z = "." + nanosStr.substring(0, 6) + "Z";
                    else
                        z = "." + nanosStr + "Z";
                }
                return new Date(ms).toISOString().replace(".000Z", z)
            }
            `, `
            /**
             * In JSON format, the \`Timestamp\` type is encoded as a string 
             * in the RFC 3339 format.
             */
            function internalJsonRead(json: ${JsonValue}, options: ${JsonReadOptions}, target?: ${Timestamp}): ${Timestamp} {
                if (typeof json !== "string")
                    throw new Error("Unable to parse Timestamp from JSON " + ${typeofJsonValue}(json) + ".");
                // RFC 3339 with "Z" (UTC) or offset like "+08:00" and optional fractions
                // match[7] optional fractions, 3 to 9 digits
                // match[8] offset like "-08:00", if undefined date is UTC
                let matches = json.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(?:Z|\\.([0-9]{3,9})Z|([+-][0-9][0-9]:[0-9][0-9]))$/);
                if (!matches)
                    throw new Error("Unable to parse Timestamp from JSON. Invalid format.");
                let ms = Date.parse(matches[1] + "-" + matches[2] + "-" + matches[3] + "T" + matches[4] + ":" + matches[5] + ":" + matches[6] + (matches[8] ? matches[8] : "Z"));
                if (Number.isNaN(ms))
                    throw new Error("Unable to parse Timestamp from JSON. Invalid value.");
                if (ms < Date.parse("0001-01-01T00:00:00Z") || ms > Date.parse("9999-12-31T23:59:59Z"))
                    throw new globalThis.Error("Unable to parse Timestamp from JSON. Must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive.");
                if (!target)
                    target = this.create();
                target.seconds = PbLong.from(ms / 1000).${longConvertMethod}();
                target.nanos = 0;
                if (matches[7])
                    target.nanos = (parseInt("1" + matches[7] + "0".repeat(9 - matches[7].length)) - 1000000000);
                return target;
            }
            `,
        ];
    }

    ['google.protobuf.Duration'](source: TypescriptFile, descriptor: DescriptorProto): string[] {
        const
            Duration = this.imports.type(source,descriptor),
            PbLong = this.imports.name(source,'PbLong', this.options.runtimeImportPath),
            JsonWriteOptions = this.imports.name(source,'JsonWriteOptions', this.options.runtimeImportPath, true),
            JsonReadOptions = this.imports.name(source,'JsonReadOptions', this.options.runtimeImportPath, true),
            JsonValue = this.imports.name(source,'JsonValue', this.options.runtimeImportPath, true),
            typeofJsonValue = this.imports.name(source,'typeofJsonValue', this.options.runtimeImportPath);
        let longConvertMethod = 'toBigInt';
        if (this.options.normalLongType === LongType.NUMBER)
            longConvertMethod = 'toNumber';
        else if (this.options.normalLongType === LongType.STRING)
            longConvertMethod = 'toString';
        return [
            `
            /**
             * Encode \`Duration\` to JSON string like "3.000001s". 
             */
            function internalJsonWrite(message: ${Duration}, options: ${JsonWriteOptions}): ${JsonValue} {
                let s = ${PbLong}.from(message.seconds).toNumber();
                if (s > 315576000000 || s < -315576000000)
                    throw new Error("Duration value out of range.");
                let text = message.seconds.toString();
                if (message.nanos !== 0) {
                    let nanosStr = Math.abs(message.nanos).toString();
                    nanosStr = "0".repeat(9 - nanosStr.length) + nanosStr;
                    if (nanosStr.substring(3) === "000000")
                        nanosStr = nanosStr.substring(0, 3);
                    else if (nanosStr.substring(6) === "000")
                        nanosStr = nanosStr.substring(0, 6);
                    text += "." + nanosStr;
                }
                return text + "s";
            }
            `, `
            /**
             * Decode \`Duration\` from JSON string like "3.000001s"
             */
            function internalJsonRead(json: ${JsonValue}, options: ${JsonReadOptions}, target?: ${Duration}): ${Duration} {
                if (typeof json !== "string")
                    throw new Error("Unable to parse Duration from JSON " + ${typeofJsonValue}(json) + ". Expected string.");
                let match = json.match(/^(-?[0-9]+)(?:\\.([0-9]+))?s/);
                if (match === null)
                    throw new Error("Unable to parse Duration from JSON string. Invalid format.");
                if (!target)
                    target = this.create();
                let longSeconds = ${PbLong}.from(match[1]);
                if (longSeconds.toNumber() > 315576000000 || longSeconds.toNumber() < -315576000000)
                    throw new Error("Unable to parse Duration from JSON string. Value out of range.");
                target.seconds = longSeconds.${longConvertMethod}();
                if (typeof match[2] == "string") {
                    let nanosStr = match[2] + "0".repeat(9 - match[2].length);
                    target.nanos = parseInt(nanosStr);
                    if (longSeconds.isNegative()) {
                        target.nanos = -target.nanos;
                    }
                }
                return target;
            }
            `,
        ];

    }

    ['google.protobuf.FieldMask'](source: TypescriptFile, descriptor: DescriptorProto) {
        const
            FieldMask = this.imports.type(source,descriptor),
            JsonWriteOptions = this.imports.name(source,'JsonWriteOptions', this.options.runtimeImportPath, true),
            JsonReadOptions = this.imports.name(source,'JsonReadOptions', this.options.runtimeImportPath, true),
            lowerCamelCase = this.imports.name(source,'lowerCamelCase', this.options.runtimeImportPath),
            JsonValue = this.imports.name(source,'JsonValue', this.options.runtimeImportPath, true),
            typeofJsonValue = this.imports.name(source,'typeofJsonValue', this.options.runtimeImportPath);
        return [
            `
            /**
             * Encode \`${descriptor.name}\` to JSON object. 
             */
            function internalJsonWrite(message: ${FieldMask}, options: ${JsonWriteOptions}): ${JsonValue} {
                return message.paths.map(p => {
                    if (p.match(/_[0-9]?_/g) || p.match(/[A-Z]/g))
                        throw new Error("Unable to encode FieldMask to JSON. lowerCamelCase of path name \\""+p+"\\" is irreversible.");
                    return ${lowerCamelCase}(p);
                }).join(",");
            }
            `, `
            /**
             * Decode \`${descriptor.name}\` from JSON object.
             */
            function internalJsonRead(json: ${JsonValue}, options: ${JsonReadOptions}, target?: ${FieldMask}): ${FieldMask} {
                if (typeof json !== "string")
                    throw new Error("Unable to parse FieldMask from JSON " + ${typeofJsonValue}(json) + ". Expected string.");
                if (!target)
                    target = this.create();
                if (json === "")
                    return target;
                let camelToSnake = (str: string) => {
                    if (str.includes('_'))
                        throw new Error("Unable to parse FieldMask from JSON. Path names must be lowerCamelCase.");
                    let sc = str.replace(/[A-Z]/g, letter => "_" + letter.toLowerCase());
                    return (sc[0] === "_") ? sc.substring(1) : sc;
                };
                target.paths = json.split(",").map(camelToSnake);
                return target;
            }
            `,
        ];
    }

    ['google.protobuf.Struct'](source: TypescriptFile, descriptor: DescriptorProto): string[] {
        const
            Struct = this.imports.type(source,descriptor),
            JsonObject = this.imports.name(source,'JsonObject', this.options.runtimeImportPath, true),
            JsonWriteOptions = this.imports.name(source,'JsonWriteOptions', this.options.runtimeImportPath, true),
            JsonReadOptions = this.imports.name(source,'JsonReadOptions', this.options.runtimeImportPath, true),
            JsonValue = this.imports.name(source,'JsonValue', this.options.runtimeImportPath, true),
            typeofJsonValue = this.imports.name(source,'typeofJsonValue', this.options.runtimeImportPath),
            isJsonObject = this.imports.name(source,'isJsonObject', this.options.runtimeImportPath);
        return [
            `
            /**
             * Encode \`${descriptor.name}\` to JSON object. 
             */
            function internalJsonWrite(message: ${Struct}, options: ${JsonWriteOptions}): ${JsonValue} {
                let json: ${JsonObject} = {};
                for (let [k, v] of Object.entries(message.fields)) {
                    json[k] = Value.toJson(v);
                }
                return json;
            }
            `, `
            /**
             * Decode \`${descriptor.name}\` from JSON object.
             */
            function internalJsonRead(json: ${JsonValue}, options: ${JsonReadOptions}, target?: ${Struct}): ${Struct} {
                if (!${isJsonObject}(json))
                    throw new globalThis.Error("Unable to parse message " + this.typeName + " from JSON " + ${typeofJsonValue}(json) + ".");
                if (!target) 
                    target = this.create();
                for (let [k, v] of globalThis.Object.entries(json)) {
                    target.fields[k] = Value.fromJson(v);
                }
                return target;
            }
            `,
        ];
    }

    ['google.protobuf.Value'](source: TypescriptFile, descriptor: DescriptorProto): string[] {
        const
            Value = this.imports.type(source,descriptor),
            JsonWriteOptions = this.imports.name(source,'JsonWriteOptions', this.options.runtimeImportPath, true),
            JsonReadOptions = this.imports.name(source,'JsonReadOptions', this.options.runtimeImportPath, true),
            JsonValue = this.imports.name(source,'JsonValue', this.options.runtimeImportPath, true),
            typeofJsonValue = this.imports.name(source,'typeofJsonValue', this.options.runtimeImportPath),
            nullValueField = FieldInfoGenerator.createTypescriptLocalName('null_value', this.options),
            boolValueField = FieldInfoGenerator.createTypescriptLocalName('bool_value', this.options),
            numberValueField = FieldInfoGenerator.createTypescriptLocalName('number_value', this.options),
            stringValueField = FieldInfoGenerator.createTypescriptLocalName('string_value', this.options),
            listValueField = FieldInfoGenerator.createTypescriptLocalName('list_value', this.options),
            structValueField = FieldInfoGenerator.createTypescriptLocalName('struct_value', this.options);
        return [
            `
            /**
             * Encode \`${descriptor.name}\` to JSON value. 
             */
            function internalJsonWrite(message: ${Value}, options: ${JsonWriteOptions}): ${JsonValue} {
                if (message.kind.oneofKind === undefined) throw new globalThis.Error();
                switch (message.kind.oneofKind) {
                    case undefined:
                        throw new globalThis.Error();
                    case "${boolValueField}":
                        return message.kind.${boolValueField};
                    case "${nullValueField}":
                        return null;
                    case "${numberValueField}":
                        return message.kind.${numberValueField};
                    case "${stringValueField}":
                        return message.kind.${stringValueField};
                    case "${listValueField}":
                        let listValueField = this.fields.find(f => f.no === 6);
                        if (listValueField?.kind !== 'message') throw new globalThis.Error();
                        return listValueField.T().toJson(message.kind.${listValueField});
                    case "${structValueField}":
                        let structValueField = this.fields.find(f => f.no === 5);
                        if (structValueField?.kind !== 'message') throw new globalThis.Error();
                        return structValueField.T().toJson(message.kind.${structValueField});
                }
            }
            `, `
            /**
             * Decode \`${descriptor.name}\` from JSON value.
             */
            function internalJsonRead(json: ${JsonValue}, options: ${JsonReadOptions}, target?: ${Value}): ${Value} {
                if (!target) 
                    target = this.create();
                switch (typeof json) {
                    case "number":
                        target.kind = {oneofKind: "${numberValueField}", ${numberValueField}: json};
                        break;
                    case "string":
                        target.kind = {oneofKind: "${stringValueField}", ${stringValueField}: json};
                        break;
                    case "boolean":
                        target.kind = {oneofKind: "${boolValueField}", ${boolValueField}: json};
                        break;
                    case "object":
                        if (json === null) {
                            target.kind = {oneofKind: "${nullValueField}", ${nullValueField}: NullValue.NULL_VALUE};
                        } else if (globalThis.Array.isArray(json)) {
                            target.kind = {oneofKind: "${listValueField}", ${listValueField}: ListValue.fromJson(json)};
                        } else {
                            let val = Struct.fromJson(json);
                            target.kind = {oneofKind: "${structValueField}", ${structValueField}: Struct.fromJson(json)};
                        }
                        break;
                    default:
                        throw new globalThis.Error('Unable to parse ' + this.typeName + ' from JSON ' + ${typeofJsonValue}(json));
                }
                return target;
            }
            `,
        ];
    }

    ['google.protobuf.NullValue'](/*source: TypescriptFile, descriptor: DescriptorProto*/) {
        // that´s ok, NullValue is actually an enum, and special JSON representation is handled by the reflection json reader
    }

    ['google.protobuf.ListValue'](source: TypescriptFile, descriptor: DescriptorProto): string[] {
        const
            ListValue = this.imports.type(source,descriptor),
            JsonWriteOptions = this.imports.name(source,'JsonWriteOptions', this.options.runtimeImportPath, true),
            JsonReadOptions = this.imports.name(source,'JsonReadOptions', this.options.runtimeImportPath, true),
            JsonValue = this.imports.name(source,'JsonValue', this.options.runtimeImportPath, true),
            typeofJsonValue = this.imports.name(source,'typeofJsonValue', this.options.runtimeImportPath);
        return [
            `
            /**
             * Encode \`${descriptor.name}\` to JSON array. 
             */
            function internalJsonWrite(message: ${ListValue}, options: ${JsonWriteOptions}): ${JsonValue} {
                return message.values.map(v => Value.toJson(v));
            }
            `, `
            /**
             * Decode \`${descriptor.name}\` from JSON array.
             */
            function internalJsonRead(json: ${JsonValue}, options: ${JsonReadOptions}, target?: ${ListValue}): ${ListValue} {
                if (! globalThis.Array.isArray(json)) throw new globalThis.Error('Unable to parse ' + this.typeName + ' from JSON ' + ${typeofJsonValue}(json));
                if (!target) 
                    target = this.create();
                let values = json.map(v => Value.fromJson(v));
                target.values.push(...values);
                return target;
            }
            `,
        ];
    }

    ['google.protobuf.BoolValue'](source: TypescriptFile, descriptor: DescriptorProto): string[] {
        const
            BoolValue = this.imports.type(source,descriptor),
            JsonWriteOptions = this.imports.name(source,'JsonWriteOptions', this.options.runtimeImportPath, true),
            JsonReadOptions = this.imports.name(source,'JsonReadOptions', this.options.runtimeImportPath, true),
            JsonValue = this.imports.name(source,'JsonValue', this.options.runtimeImportPath, true);
        return [
            `
            /**
             * Encode \`${descriptor.name}\` to JSON bool. 
             */
            function internalJsonWrite(message: ${BoolValue}, options: ${JsonWriteOptions}): ${JsonValue} {
                return message.value;
            }
            `, `
            /**
             * Decode \`${descriptor.name}\` from JSON bool.
             */
            function internalJsonRead(json: ${JsonValue}, options: ${JsonReadOptions}, target?: ${BoolValue}): ${BoolValue} {
                if (!target) 
                    target = this.create();
                target.value = this.refJsonReader.scalar(json, ${FieldDescriptorProto_Type.BOOL}, undefined, "value") as boolean;
                return target;
            }
            `,
        ];

    }

    ['google.protobuf.StringValue'](source: TypescriptFile, descriptor: DescriptorProto): string[] {
        const
            StringValue = this.imports.type(source,descriptor),
            JsonWriteOptions = this.imports.name(source,'JsonWriteOptions', this.options.runtimeImportPath, true),
            JsonReadOptions = this.imports.name(source,'JsonReadOptions', this.options.runtimeImportPath, true),
            JsonValue = this.imports.name(source,'JsonValue', this.options.runtimeImportPath, true);
        return [
            `
            /**
             * Encode \`${descriptor.name}\` to JSON string. 
             */
            function internalJsonWrite(message: ${StringValue}, options: ${JsonWriteOptions}): ${JsonValue} {
                return message.value;
            }
            `, `
            /**
             * Decode \`${descriptor.name}\` from JSON string.
             */
            function internalJsonRead(json: ${JsonValue}, options: ${JsonReadOptions}, target?: ${StringValue}): ${StringValue} {
                if (!target) 
                    target = this.create();
                target.value = this.refJsonReader.scalar(json, ${FieldDescriptorProto_Type.STRING}, undefined, "value") as string;
                return target;
            }
            `,
        ];

    }

    ['google.protobuf.DoubleValue'](source: TypescriptFile, descriptor: DescriptorProto): string[] {
        const
            DoubleValue = this.imports.type(source,descriptor),
            JsonWriteOptions = this.imports.name(source,'JsonWriteOptions', this.options.runtimeImportPath, true),
            JsonReadOptions = this.imports.name(source,'JsonReadOptions', this.options.runtimeImportPath, true),
            JsonValue = this.imports.name(source,'JsonValue', this.options.runtimeImportPath, true);
        return [
            `
            /**
             * Encode \`${descriptor.name}\` to JSON number. 
             */
            function internalJsonWrite(message: ${DoubleValue}, options: ${JsonWriteOptions}): ${JsonValue} {
                return this.refJsonWriter.scalar(${FieldDescriptorProto_Type.FLOAT}, message.value, "value", false, true);
            }
            `, `
            /**
             * Decode \`${descriptor.name}\` from JSON number.
             */
            function internalJsonRead(json: ${JsonValue}, options: ${JsonReadOptions}, target?: ${DoubleValue}): ${DoubleValue} {
                if (!target) 
                    target = this.create();
                target.value = this.refJsonReader.scalar(json, ${FieldDescriptorProto_Type.DOUBLE}, undefined, "value") as number;
                return target;
            }
            `,
        ];
    }

    ['google.protobuf.FloatValue'](source: TypescriptFile, descriptor: DescriptorProto): string[] {
        const
            FloatValue = this.imports.type(source,descriptor),
            JsonWriteOptions = this.imports.name(source,'JsonWriteOptions', this.options.runtimeImportPath, true),
            JsonReadOptions = this.imports.name(source,'JsonReadOptions', this.options.runtimeImportPath, true),
            JsonValue = this.imports.name(source,'JsonValue', this.options.runtimeImportPath, true);
        return [
            `
            /**
             * Encode \`${descriptor.name}\` to JSON number. 
             */
            function internalJsonWrite(message: ${FloatValue}, options: ${JsonWriteOptions}): ${JsonValue} {
                return this.refJsonWriter.scalar(${FieldDescriptorProto_Type.DOUBLE}, message.value, "value", false, true);
            }
            `, `
            /**
             * Decode \`${descriptor.name}\` from JSON number.
             */
            function internalJsonRead(json: ${JsonValue}, options: ${JsonReadOptions}, target?: ${FloatValue}): ${FloatValue} {
                if (!target) 
                    target = this.create();
                target.value = this.refJsonReader.scalar(json, ${FieldDescriptorProto_Type.DOUBLE}, undefined, "value") as number;
                return target;
            }
            `,
        ];
    }

    ['google.protobuf.Int32Value'](source: TypescriptFile, descriptor: DescriptorProto): string[] {
        const
            Int32Value = this.imports.type(source,descriptor),
            JsonWriteOptions = this.imports.name(source,'JsonWriteOptions', this.options.runtimeImportPath, true),
            JsonReadOptions = this.imports.name(source,'JsonReadOptions', this.options.runtimeImportPath, true),
            JsonValue = this.imports.name(source,'JsonValue', this.options.runtimeImportPath, true);
        return [
            `
            /**
             * Encode \`${descriptor.name}\` to JSON string. 
             */
            function internalJsonWrite(message: ${Int32Value}, options: ${JsonWriteOptions}): ${JsonValue} {
                return this.refJsonWriter.scalar(${FieldDescriptorProto_Type.INT32}, message.value, "value", false, true);
            }
            `, `
            /**
             * Decode \`${descriptor.name}\` from JSON string.
             */
            function internalJsonRead(json: ${JsonValue}, options: ${JsonReadOptions}, target?: ${Int32Value}): ${Int32Value} {
                if (!target) 
                    target = this.create();
                target.value = this.refJsonReader.scalar(json, ${FieldDescriptorProto_Type.INT32}, undefined, "value") as number;
                return target;
            }
            `,
        ];
    }

    ['google.protobuf.UInt32Value'](source: TypescriptFile, descriptor: DescriptorProto): string[] {
        const
            UInt32Value = this.imports.type(source,descriptor),
            JsonWriteOptions = this.imports.name(source,'JsonWriteOptions', this.options.runtimeImportPath, true),
            JsonReadOptions = this.imports.name(source,'JsonReadOptions', this.options.runtimeImportPath, true),
            JsonValue = this.imports.name(source,'JsonValue', this.options.runtimeImportPath, true);
        return [
            `
            /**
             * Encode \`${descriptor.name}\` to JSON string. 
             */
            function internalJsonWrite(message: ${UInt32Value}, options: ${JsonWriteOptions}): ${JsonValue} {
                return this.refJsonWriter.scalar(${FieldDescriptorProto_Type.UINT32}, message.value, "value", false, true);
            }
            `, `
            /**
             * Decode \`${descriptor.name}\` from JSON string.
             */
            function internalJsonRead(json: ${JsonValue}, options: ${JsonReadOptions}, target?: ${UInt32Value}): ${UInt32Value} {
                if (!target) 
                    target = this.create();
                target.value = this.refJsonReader.scalar(json, ${FieldDescriptorProto_Type.UINT32}, undefined, "value") as number;
                return target;
            }
            `,
        ];
    }

    ['google.protobuf.Int64Value'](source: TypescriptFile, descriptor: DescriptorProto): string[] {
        const
            Int64Value = this.imports.type(source,descriptor),
            iLongType = this.imports.name(source,'LongType', this.options.runtimeImportPath),
            JsonWriteOptions = this.imports.name(source,'JsonWriteOptions', this.options.runtimeImportPath, true),
            JsonReadOptions = this.imports.name(source,'JsonReadOptions', this.options.runtimeImportPath, true),
            JsonValue = this.imports.name(source,'JsonValue', this.options.runtimeImportPath, true),
            ScalarType = this.imports.name(source,'ScalarType', this.options.runtimeImportPath);
        let longTypeEnumValue = 'BIGINT';
        if (this.options.normalLongType === LongType.NUMBER)
            longTypeEnumValue = 'NUMBER';
        else if (this.options.normalLongType === LongType.STRING)
            longTypeEnumValue = 'STRING';
        return [
            `
            /**
             * Encode \`${descriptor.name}\` to JSON string. 
             */
            function internalJsonWrite(message: ${Int64Value}, options: ${JsonWriteOptions}): ${JsonValue} {
                return this.refJsonWriter.scalar(${ScalarType}.INT64, message.value, "value", false, true);
            }
            `, `
            /**
             * Decode \`${descriptor.name}\` from JSON string.
             */
            function internalJsonRead(json: ${JsonValue}, options: ${JsonReadOptions}, target?: ${Int64Value}): ${Int64Value} {
                if (!target) 
                    target = this.create();
                target.value = this.refJsonReader.scalar(json, ${ScalarType}.INT64, ${iLongType}.${longTypeEnumValue}, "value") as any;
                return target;
            }
            `,
        ];
    }

    ['google.protobuf.UInt64Value'](source: TypescriptFile, descriptor: DescriptorProto): string[] {
        const
            UInt64Value = this.imports.type(source,descriptor),
            iLongType = this.imports.name(source,'LongType', this.options.runtimeImportPath),
            JsonWriteOptions = this.imports.name(source,'JsonWriteOptions', this.options.runtimeImportPath, true),
            JsonReadOptions = this.imports.name(source,'JsonReadOptions', this.options.runtimeImportPath, true),
            JsonValue = this.imports.name(source,'JsonValue', this.options.runtimeImportPath, true),
            ScalarType = this.imports.name(source,'ScalarType', this.options.runtimeImportPath);
        let longTypeEnumValue = 'BIGINT';
        if (this.options.normalLongType === LongType.NUMBER)
            longTypeEnumValue = 'NUMBER';
        else if (this.options.normalLongType === LongType.STRING)
            longTypeEnumValue = 'STRING';
        return [
            `
            /**
             * Encode \`${descriptor.name}\` to JSON string. 
             */
            function internalJsonWrite(message: ${UInt64Value}, options: ${JsonWriteOptions}): ${JsonValue} {
                return this.refJsonWriter.scalar(${ScalarType}.UINT64, message.value, "value", false, true);
            }
            `, `
            /**
             * Decode \`${descriptor.name}\` from JSON string.
             */
            function internalJsonRead(json: ${JsonValue}, options: ${JsonReadOptions}, target?: ${UInt64Value}): ${UInt64Value} {
                if (!target) 
                    target = this.create();
                target.value = this.refJsonReader.scalar(json, ${ScalarType}.UINT64, ${iLongType}.${longTypeEnumValue}, "value") as any;
                return target;
            }
            `,
        ];
    }

    ['google.protobuf.BytesValue'](source: TypescriptFile, descriptor: DescriptorProto): string[] {
        const
            BytesValue = this.imports.type(source,descriptor),
            JsonWriteOptions = this.imports.name(source,'JsonWriteOptions', this.options.runtimeImportPath, true),
            JsonReadOptions = this.imports.name(source,'JsonReadOptions', this.options.runtimeImportPath, true),
            JsonValue = this.imports.name(source,'JsonValue', this.options.runtimeImportPath, true);
        return [
            `
            /**
             * Encode \`${descriptor.name}\` to JSON string. 
             */
            function internalJsonWrite(message: ${BytesValue}, options: ${JsonWriteOptions}): ${JsonValue} {
                return this.refJsonWriter.scalar(${FieldDescriptorProto_Type.BYTES}, message.value, "value", false, true);
            }
            `, `
            /**
             * Decode \`${descriptor.name}\` from JSON string.
             */
            function internalJsonRead(json: ${JsonValue}, options: ${JsonReadOptions}, target?: ${BytesValue}): ${BytesValue} {
                if (!target) 
                    target = this.create();
                target.value = this.refJsonReader.scalar(json, ${FieldDescriptorProto_Type.BYTES}, undefined, "value") as Uint8Array;
                return target;
            }
            `,
        ];
    }


}


