import {
    CodeGeneratorRequest,
    CodeGeneratorResponse,
    CodeGeneratorResponse_Feature,
    CodeGeneratorResponse_File
} from "./google/protobuf/compiler/plugin";
import {ReadStream} from "tty";
import {types} from "util";
import {GeneratedFile} from "./generated-file";
import {PbULong} from "@protobuf-ts/runtime";


export type ParameterSpec = {
    [key: string]: {
        description: string;
        excludes?: string[];
        requires?: string[];
    }
}

export type ResolvedParameters<T extends ParameterSpec> = {
    [P in keyof T]: boolean;
}


/**
 * Base class for a protobuf plugin.
 *
 * Implement the abstract `generate()` method to create a plugin.
 * The method takes a `CodeGeneratorRequest` and returns an
 * array of `GeneratedFile` or a promise thereof.
 *
 *
 * Usage:
 *
 *   #!/usr/bin/env node
 *   const {MyPlugin} = require( ... );
 *   new MyPlugin.run().catch(_ => {
 *     process.stderr.write('failed to run plugin');
 *     process.exit(1);
 *   });
 *
 * Reads a `CodeGeneratorRequest` created by `protoc` from stdin,
 * passes it to the plugin-function and writes a
 * `CodeGeneratorResponse` to stdout.
 *
 *
 * Parameters:
 *
 * Use the `parseParameters()` method the parse the parameters
 * of a `CodeGeneratorRequest` to a map of flags. Parameters are
 * validated and usage is generated on error.
 *
 *
 * Error handling:
 *
 * `generate()` may raise an error, reject it's promise or
 * return an `GeneratedFile` with an attached error.
 *
 * Throwing `new Error("hello")` will result in the output:
 *
 *   $ protoc --xx_out=/tmp -I protos protos/*
 *   --xx_out: Error: hello
 *       at /path/to/your-plugin.js:69
 *       ...
 *
 *
 */
export abstract class PluginBase<T extends GeneratedFile> {


    abstract generate(request: CodeGeneratorRequest): Promise<T[]> | T[];


    async run(): Promise<void> {

        try {

            let response: CodeGeneratorResponse,
                bytes = await this.readBytes(process.stdin),
                request = CodeGeneratorRequest.fromBinary(bytes);

            try {
                const files = await this.generate(request);
                response = this.createResponse(files);
            } catch (error) {
                response = CodeGeneratorResponse.create({
                    error: this.errorToString(error)
                });
            }

            process.stdout.write(CodeGeneratorResponse.toBinary(response));

        } catch (error) {
            process.stderr.write('Plugin failed to read CodeGeneratorRequest from stdin or write CodeGeneratorResponse to stdout.\n');
            process.stderr.write(this.errorToString(error));
            process.stderr.write('\n');
            process.exit(1);
        }
    }


    protected getSupportedFeatures(): CodeGeneratorResponse_Feature[] {
        return [];
    }


    protected parseParameters<T extends ParameterSpec>(spec: T, parameter: string | undefined): ResolvedParameters<T> {
        this.validateParameterSpec(spec);
        let given = parameter ? parameter.split(',') : [];
        let known = Object.keys(spec);
        let excess = given.filter(i => !known.includes(i));
        if (excess.length > 0) {
            this.throwParameterError(spec, `Parameter "${excess.join('", "')}" not recognized.`);
        }
        for (let [key, val] of Object.entries(spec)) {
            if (given.includes(key)) {
                let missing = val.requires?.filter(i => !given.includes(i)) ?? [];
                if (missing.length > 0) {
                    this.throwParameterError(spec, `Parameter "${key}" requires parameter "${missing.join('", "')}" to be set.`);
                }
                let excess = val.excludes?.filter(i => given.includes(i)) ?? [];
                if (excess.length > 0) {
                    this.throwParameterError(spec, `If parameter "${key}" is set, parameter "${excess.join('", "')}" cannot be set.`);
                }
            }
        }
        let resolved: { [k: string]: boolean } = {};
        for (let key of Object.keys(spec)) {
            resolved[key] = given.includes(key);
        }
        return resolved as ResolvedParameters<T>;
    }


    private throwParameterError(spec: ParameterSpec, error: string) {
        let text = '';
        text += error + '\n';
        text += `\n`;
        text += `Available parameters:\n`;
        text += `\n`;
        for (let [key, val] of Object.entries(spec)) {
            text += `- "${key}"\n`;
            for (let l of val.description.split('\n')) {
                text += `  ${l}\n`;
            }
            text += `\n`;
        }
        let err = new Error(text);
        err.name = `ParameterError`;
        throw err;
    }


    private validateParameterSpec(spec: ParameterSpec) {
        let known = Object.keys(spec);
        for (let [key, {excludes, requires}] of Object.entries(spec)) {
            let r = requires?.filter(i => !known.includes(i)) ?? [];
            if (r.length > 0) {
                throw new Error(`Invalid parameter spec for parameter "${key}". "requires" points to unknown parameters: ${r.join(', ')}`);
            }
            let e = excludes?.filter(i => !known.includes(i)) ?? [];
            if (e.length > 0) {
                throw new Error(`Invalid parameter spec for parameter "${key}". "excludes" points to unknown parameters: ${e.join(', ')}`);
            }
        }
    }


    protected readBytes(stream: ReadStream): Promise<Uint8Array> {
        return new Promise<Uint8Array>(resolve => {
            const chunks: Uint8Array[] = [];
            stream.on('data', chunk => chunks.push(chunk));
            stream.on('end', () => {
                resolve(Buffer.concat(chunks));
            });
        });
    }


    protected createResponse(files: GeneratedFile[]): CodeGeneratorResponse {
        // we have to respond with an xor of all of our supported features.
        // we should be working on a ulong here, but we cannot rely on bigint support.
        let feat = 0;
        for (let f of this.getSupportedFeatures()) {
            feat = feat ^ f;
        }
        return CodeGeneratorResponse.create({
            file: files
                .map(f => CodeGeneratorResponse_File.create({
                    name: f.getFilename(),
                    content: f.getContent()
                }))
                .filter(f => f.content && f.content.length > 0),
            supportedFeatures: PbULong.from(feat).toString()
        });
    }


    protected errorToString(error: any): string {
        if (error && typeof error.name == 'string' && error.name == 'ParameterError') {
            return error.name + '\n\n' + error.message;
        }
        if (types.isNativeError(error)) {
            return error.stack ?? error.toString();
        }
        let text;
        try {
            text = error.toString();
        } catch (e) {
            text = 'unknown error';
        }
        return text;
    }


}
