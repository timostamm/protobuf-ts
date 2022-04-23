import msgOneofs from './msg-oneofs.fixtures'
import msgScalar from './msg-scalar.fixtures'
import msgEnum from './msg-enum.fixtures'
import msgJsonNames from './msg-json-names.fixtures'
import msgProto2Optionals from './msg-proto2-optionals.fixtures'
import msgProto3Optionals from './msg-proto3-optionals.fixtures'
import msgMessage from './msg-message.fixtures'
import msgLongs from './msg-longs.fixtures'
import deprecationExplicit from './deprecation-explicit.fixture'
import deprecationImplicit from './deprecation-implicit.fixture'
import {FieldInfo, MessageInfo, normalizeFieldInfo, PartialFieldInfo} from "@protobuf-ts/runtime";

/**
 * A fixture for a message type.
 */
export interface Fixture {
    /**
     * type name of the message
     */
    typeName: string;

    /**
     * Is this message deprecated?
     *
     * If so, is it explicitly deprecated by the user
     * or implicitly deprecated, for example because
     * the parent file is deprecated.
     *
     * Omitting this property means the type is *not*
     * deprecated.
     */
    deprecated?: 'explicit' | 'implicit';

    /**
     * Are there any fields explicitly marked deprecated?
     */
    deprecatedFields?: string[];

    /**
     * Field info for the message. Must be valid.
     */
    fields: PartialFieldInfo[];

    /**
     * Generic messages conforming to the field info above.
     * Must be valid.
     */
    messages?: {
        /**
         * Special case: Must contain valid default data
         * conforming to the field info above.
         *
         * If "json.default" is present, it must be
         * equivalent to this message.
         */
        default: UnknownMessage;

        /**
         * Any other case. But must still be valid.
         *
         * If a corresponding key exists in "json", it must
         * be the representation of this message.
         */
        [key: string]: UnknownMessage;
    };

    /**
     * Can be any data. The only rule is that it has to
     * break the contract of the message in some way.
     */
    invalidMessages?: {
        [key: string]: unknown;
    },

    /**
     * Example JSON representations.
     * Must be valid.
     */
    json?: {
        /**
         * Special case: If present, must contain
         * valid default data.
         *
         * If "message.default" is present, it must be
         * equivalent to this representation.
         */
        default: JsonObject;

        /**
         * Any other case. But must still be valid.
         *
         * If a corresponding key exists in "messages", this
         * JSON must be a valid representation of it.
         */
        [key: string]: JsonObject;
    };

    /**
     * Expectations for reading specific JSON fields.
     */
    jsonReads?: {
        [fieldName: string]: {
            [key: string]: {
                input: JsonValue | undefined;
                expect: unknown;
            };
        };
    },

    /**
     * Expectations for reading specific JSON fields.
     */
    jsonReadErrors?: {
        [fieldName: string]: {
            [key: string]: {
                input: JsonValue;
                expect: RegExp;
            };
        };
    },

    /**
     * Expectations for writing specific JSON fields.
     */
    jsonWrites?: {
        [fieldName: string]: {
            [key: string]: {
                input: unknown;
                expect: JsonValue | undefined;
                options?: object;
            };
        };
    },

}


interface JsonReadFixture {
    fieldName: string;
    key: string;
    input: JsonValue | undefined;
    expect: unknown;
}

interface JsonReadErrorFixture {
    fieldName: string;
    key: string;
    input: JsonValue;
    expect: RegExp;
}

interface JsonWriteFixture {
    fieldName: string;
    key: string;
    input: unknown;
    expect: JsonValue | undefined;
    options?: object;
}

/**
 * Generic protobuf message data.
 */
interface UnknownMessage {
    [k: string]: any;
}

/**
 * Represents any possible JSON value.
 */
type JsonValue = number | string | boolean | null | JsonObject | JsonValue[];

/**
 * Represents a JSON object.
 */
type JsonObject = { [k: string]: JsonValue };


class FixtureRegistry {

    private readonly list: Fixture[] = [];
    private readonly map = new Map<string, Fixture>();
    private readonly jsonStringCache = new Map<JsonValue, string>();


    register(fixture: Fixture | Fixture[]): void {
        let source = Array.isArray(fixture) ? fixture : [fixture];
        for (let item of source) {
            this.validateFixture(item);
            if (this.map.has(item.typeName)) {
                throw new Error(`There already is a fixture for "${item.typeName}" registered.`);
            }
            this.map.set(item.typeName, item);
            this.list.push(item);
        }
    }


    private validateFixture(fixture: Fixture): void {
        const checks = {
            "typeName ok": fixture.typeName.trim().length > 0,

            "field names unique": fixture.fields
                .every((value, index, array) =>
                    array.findIndex(f => f.name === value.name) === index
                ),
            "deprecated fields exist": fixture.deprecatedFields
                ? fixture.deprecatedFields.every(fn => fixture.fields.some(fi => fi.name === fn))
                : true,

            "jsonRead field names exist": fixture.jsonReads
                ? Object.keys(fixture.jsonReads).every(fn => fixture.fields.some(fi => fi.name === fn))
                : true,

            "jsonReadError field names exist": fixture.jsonReadErrors
                ? Object.keys(fixture.jsonReadErrors).every(fn => fixture.fields.some(fi => fi.name === fn))
                : true,

            "jsonWrite field names exist": fixture.jsonWrites
                ? Object.keys(fixture.jsonWrites).every(fn => fixture.fields.some(fi => fi.name === fn))
                : true,
        };
        for (let [k, v] of Object.entries(checks)) {
            if (!v) throw new Error(`Fixture "${fixture.typeName}" violated "${k}"`);
        }
    }


    usingTypeNames(fn: (typeName: string) => void) {
        for (let f of this.list) {
            fn(f.typeName);
        }
    }


    usingDeprecation(fn: (typeName: string, explicitlyDeprecated: boolean, implicitlyDeprecated: boolean, deprecatedFieldNames: string[]) => void): void {
        for (let f of this.list) {
            let d = this.getDeprecation(f.typeName);
            fn(f.typeName, d.explicitlyDeprecated, d.implicitlyDeprecated, d.deprecatedFieldNames);
        }
    }


    /**
     * If a fixture has a message and a json under the same key,
     * return them as pairs.
     */
    usingPairs(fn: (typeName: string, key: string, msg: UnknownMessage, json: JsonObject) => void): void {
        for (let f of this.list) {
            for (let p of this.listPairs(f.typeName)) {
                fn(f.typeName, p[0], p[1], p[2]);
            }
        }
    }


    usingMessages(fn: (typeName: string, key: string, msg: UnknownMessage) => void): void {
        for (let f of this.list) {
            for (let [k, g] of this.listMessages(f.typeName)) {
                fn(f.typeName, k, g);
            }
        }
    }


    usingInvalidMessages(fn: (typeName: string, key: string, msg: unknown) => void): void {
        for (let f of this.list) {
            for (let [k, g] of this.listInvalidMessages(f.typeName)) {
                fn(f.typeName, k, g);
            }
        }
    }


    usingJson(fn: (typeName: string, key: string, json: JsonObject) => void): void {
        for (let f of this.list) {
            for (let [k, j] of this.listJson(f.typeName)) {
                fn(f.typeName, k, j);
            }
        }
    }

    usingJsonReads(fn: (typeName: string, field: FieldInfo, key: string, input: JsonObject, exp: UnknownMessage, defaults: UnknownMessage) => void): void {
        for (let fix of this.list) {
            for (let jsonFix of this.listJsonReads(fix.typeName)) {

                let field = this.makeMessageField(fix, jsonFix.fieldName);
                if (!field) throw new Error(`Fixture ${fix.typeName} "jsonReads.${jsonFix.key}.fieldName" refers to field "${jsonFix.fieldName}" which does not exist.`);

                let defaults = this.makeSingleFieldDefaults(fix, jsonFix.fieldName);
                if (!defaults) throw new Error(`Fixture ${fix.typeName} "jsonReads.${jsonFix.key}" requires the fixture have a "messages.default".`);

                let input: JsonObject = {};
                if (jsonFix.input !== undefined) input[field.jsonName] = jsonFix.input;
                let expect: UnknownMessage = {[field.localName]: jsonFix.expect};
                fn(fix.typeName, field, jsonFix.key, input, expect, defaults);
            }
        }
    }


    usingJsonReadErrors(fn: (typeName: string, field: FieldInfo, key: string, input: JsonObject, expect: RegExp, defaults: UnknownMessage) => void): void {
        for (let fix of this.list) {
            for (let jsonFix of this.listJsonReadErrors(fix.typeName)) {

                let field = this.makeMessageField(fix, jsonFix.fieldName);
                if (!field) throw new Error(`Fixture ${fix.typeName} "jsonReadErrors.${jsonFix.key}.fieldName" refers to field "${jsonFix.fieldName}" which does not exist.`);

                let defaults = this.makeSingleFieldDefaults(fix, jsonFix.fieldName);
                if (!defaults) throw new Error(`Fixture ${fix.typeName} "jsonReadErrors.${jsonFix.key}" requires the fixture have a "messages.default".`);

                let input: JsonObject = {[field.jsonName]: jsonFix.input};
                fn(fix.typeName, field, jsonFix.key, input, jsonFix.expect, defaults);
            }
        }
    }


    usingJsonWrites(fn: (typeName: string, field: FieldInfo, key: string, input: UnknownMessage, expect: JsonObject, opt: any) => void): void {
        for (let fix of this.list) {
            for (let jsonFix of this.listJsonWrites(fix.typeName)) {

                let field = this.makeMessageField(fix, jsonFix.fieldName);
                if (!field) throw new Error(`Fixture ${fix.typeName} "jsonReadErrors.${jsonFix.key}.fieldName" refers to field "${jsonFix.fieldName}" which does not exist.`);

                let input: UnknownMessage = {[field.localName]: jsonFix.input};
                let expect: JsonObject = {};
                if (jsonFix.expect !== undefined) expect[field.jsonName] = jsonFix.expect;
                fn(fix.typeName, field, jsonFix.key, input, expect, jsonFix.options ?? {});
            }
        }
    }


    hasFixture(typeName: string): boolean {
        return this.map.has(typeName);
    }


    getFieldsRaw(type: string): PartialFieldInfo[] {
        let fix = this.getFix(type);
        return this.cloneGeneric(fix.fields);
    }


    getFieldsNormalized(type: string): FieldInfo[] {
        let fix = this.getFix(type);
        return this.cloneGeneric(fix.fields).map(f => normalizeFieldInfo(f));
    }


    getDeprecation(type: string) {
        let fix = this.getFix(type);
        return {
            explicitlyDeprecated: fix.deprecated === "explicit",
            implicitlyDeprecated: fix.deprecated === "implicit",
            deprecatedFieldNames: fix.deprecatedFields ? fix.deprecatedFields.concat() : []
        };
    }


    /**
     * Return message info with normalized fields for given fixture.
     */
    makeMessageInfo(type: string): MessageInfo {
        let fix = this.getFix(type);
        return {
            typeName: fix.typeName,
            fields: this.getFieldsNormalized(type),
            options: {}
        }
    }

    getMessage(type: string, key: string): UnknownMessage {
        let fix = this.getFix(type);
        if (!fix.messages) throw new Error(`Fixture for "${type}" has no messages.`);
        let data = fix.messages[key];
        if (!data) throw new Error(`Fixture for "${type}" has no messages with key "${key}".`);
        return this.cloneGeneric(data);
    }

    getInvalidMessage(type: string, key: string): unknown {
        let fix = this.getFix(type);
        if (!fix.invalidMessages) throw new Error(`Fixture for "${type}" has no invalidMessages.`);
        let data = fix.invalidMessages[key];
        if (!data) throw new Error(`Fixture for "${type}" has no invalidMessages with key "${key}".`);
        return this.cloneGeneric(data);
    }


    listMessages(type: string): [string, UnknownMessage][] {
        let fix = this.getFix(type);
        if (!fix.messages) return [];
        return Object.keys(fix.messages).map(key => [key, this.getMessage(type, key)]);
    }

    listInvalidMessages(type: string): [string, unknown][] {
        let fix = this.getFix(type);
        if (!fix.invalidMessages) return [];
        return Object.keys(fix.invalidMessages).map(key => [key, this.getInvalidMessage(type, key)]);
    }


    getJson(type: string, key: string): JsonObject {
        let fix = this.getFix(type);
        if (!fix.json) throw new Error(`Fixture for "${type}" has no json data.`);
        let data = fix.json[key];
        if (!data) throw new Error(`Fixture for "${type}" has no json data with key "${key}".`);
        return this.cloneJson(data);
    }


    listJson(type: string): [string, JsonObject][] {
        let fix = this.getFix(type);
        if (!fix.json) return [];
        return Object.keys(fix.json).map(key => [key, this.getJson(type, key)]);
    }


    /**
     * Returns pairs of "message" and "json" with matching keys.
     */
    listPairs(type: string): [string, UnknownMessage, JsonObject][] {
        let
            fix = this.getFix(type),
            om = fix.messages,
            oj = fix.json,
            pairs: [string, UnknownMessage, JsonObject][] = [];
        if (om && oj) {
            for (let key of Object.keys(om)) {
                if (!oj.hasOwnProperty(key)) continue;
                pairs.push([key, this.getMessage(fix.typeName, key), this.getJson(fix.typeName, key)]);
            }
        }
        return pairs;
    }


    listJsonReads(type: string): JsonReadFixture[] {
        let fix = this.getFix(type);
        if (!fix.jsonReads) return [];
        let r: JsonReadFixture[] = [];
        for (let [fieldName, specs] of Object.entries(fix.jsonReads)) {
            for (let [key, spec] of Object.entries(specs)) {
                r.push({
                    key,
                    fieldName,
                    input: spec.input === undefined ? undefined : this.cloneJson(spec.input),
                    expect: this.cloneGeneric(spec.expect)
                } as JsonReadFixture);
            }
        }
        return r;
    }


    listJsonReadErrors(type: string): JsonReadErrorFixture[] {
        let fix = this.getFix(type);
        if (!fix.jsonReadErrors) return [];
        let r: JsonReadErrorFixture[] = [];
        for (let [fieldName, specs] of Object.entries(fix.jsonReadErrors)) {
            for (let [key, spec] of Object.entries(specs)) {
                r.push({
                    key,
                    fieldName,
                    input: this.cloneJson(spec.input),
                    expect: spec.expect,
                } as JsonReadErrorFixture);
            }
        }
        return r;
    }


    listJsonWrites(type: string): JsonWriteFixture[] {
        let fix = this.getFix(type);
        if (!fix.jsonWrites) return [];
        let r: JsonWriteFixture[] = [];
        for (let [fieldName, specs] of Object.entries(fix.jsonWrites)) {
            for (let [key, spec] of Object.entries(specs)) {
                r.push({
                    key,
                    fieldName,
                    input: this.cloneGeneric(spec.input),
                    expect: spec.expect === undefined ? undefined : this.cloneJson(spec.expect),
                    options: this.cloneGeneric(spec.options),
                } as JsonWriteFixture);
            }
        }
        return r;
    }


    private makeMessageField(type: string | Fixture, fieldName: string): FieldInfo | undefined {
        let fix = this.getFix(type);
        let fieldPart = fix.fields.find(f => f.name === fieldName);
        return fieldPart ? normalizeFieldInfo(fieldPart) : undefined;
    }


    private makeSingleFieldDefaults(type: string | Fixture, fieldName: string): UnknownMessage | undefined {
        let fix = this.getFix(type);
        let defaults = this.cloneGeneric(fix.messages?.default);
        if (!defaults) return undefined;
        for (let f of this.getFieldsNormalized(fix.typeName).filter(f => f.name !== fieldName)) {
            delete defaults[f.localName];
        }
        return defaults;
    }


    private getFix(type: string | Fixture): Fixture {
        let n = typeof type == "string" ? type : type.typeName;
        let f = this.map.get(n);
        if (!f) throw new Error();
        return f;
    }


    private cloneJson<T extends JsonValue>(jsonVal: T): T {
        let jsonStr = this.jsonStringCache.get(jsonVal);
        if (!jsonStr) {
            jsonStr = JSON.stringify(jsonVal);
            this.jsonStringCache.set(jsonVal, jsonStr);
        }
        return JSON.parse(jsonStr) as T;
    }


    private cloneGeneric<T>(v: T): T {
        if (v instanceof Uint8Array) {
            return v.slice() as unknown as T;
        } else if (Array.isArray(v)) {
            return v.map(i => this.cloneGeneric(i)) as unknown as T;
        } else if (typeof v == "object" && v !== null) {
            let c: any = {};
            for (let k of Object.keys(v)) {
                c[k] = this.cloneGeneric((v as any)[k]);
            }
            return c;
        } else {
            return v;
        }
    }


}


export const fixtures = new FixtureRegistry();
fixtures.register(msgOneofs);
fixtures.register(msgScalar);
fixtures.register(msgEnum);
fixtures.register(msgJsonNames);
fixtures.register(msgProto2Optionals);
fixtures.register(msgProto3Optionals);
fixtures.register(msgMessage);
fixtures.register(msgLongs);
fixtures.register(deprecationExplicit);
fixtures.register(deprecationImplicit);


