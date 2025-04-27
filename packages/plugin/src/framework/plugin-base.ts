import type {
    CodeGeneratorRequest,
    CodeGeneratorResponse,
    CodeGeneratorResponse_File
} from "@bufbuild/protobuf/wkt";
import {
    CodeGeneratorRequestSchema,
    CodeGeneratorResponse_Feature,
    CodeGeneratorResponse_FileSchema,
    CodeGeneratorResponseSchema
} from "@bufbuild/protobuf/wkt";
import {create, fromBinary, protoInt64, toBinary} from "@bufbuild/protobuf";
import {ReadStream} from "tty";
import {types} from "util";
import {GeneratedFile} from "@protobuf-ts/plugin-framework";


type OptionsSpec = {
    [key: string]: {
        description: string;
        excludes?: string[];
        requires?: string[];
    }
}

type ResolvedOptions<T extends OptionsSpec> = {
    [P in keyof T]: boolean;
}

export abstract class PluginBaseProtobufES<T extends GeneratedFile = GeneratedFile> {


    abstract generate(request: CodeGeneratorRequest): Promise<T[]> | T[];


    async run(): Promise<void> {

        try {

            let response: CodeGeneratorResponse,
                bytes = await this.readBytes(process.stdin),
                request = fromBinary(CodeGeneratorRequestSchema, bytes) as CodeGeneratorRequest;

            try {
                const files = await this.generate(request);
                response = this.createResponse(files);
            } catch (error) {
                response = create(CodeGeneratorResponseSchema, {
                    error: this.errorToString(error)
                }) as CodeGeneratorResponse;
            }

            this.setBlockingStdout();

            process.stdout.write(toBinary(CodeGeneratorResponseSchema, response));

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


    protected parseOptions<T extends OptionsSpec>(spec: T, parameter: string | undefined): ResolvedOptions<T> {
        this.validateOptionsSpec(spec);
        let given = parameter ? parameter.split(',') : [];
        let known = Object.keys(spec);
        let excess = given.filter(i => !known.includes(i));
        if (excess.length > 0) {
            this.throwOptionError(spec, `Option "${excess.join('", "')}" not recognized.`);
        }
        for (let [key, val] of Object.entries(spec)) {
            if (given.includes(key)) {
                let missing = val.requires?.filter(i => !given.includes(i)) ?? [];
                if (missing.length > 0) {
                    this.throwOptionError(spec, `Option "${key}" requires option "${missing.join('", "')}" to be set.`);
                }
                let excess = val.excludes?.filter(i => given.includes(i)) ?? [];
                if (excess.length > 0) {
                    this.throwOptionError(spec, `If option "${key}" is set, option "${excess.join('", "')}" cannot be set.`);
                }
            }
        }
        let resolved: { [k: string]: boolean } = {};
        for (let key of Object.keys(spec)) {
            resolved[key] = given.includes(key);
        }
        return resolved as ResolvedOptions<T>;
    }


    private throwOptionError(spec: OptionsSpec, error: string) {
        let text = '';
        text += error + '\n';
        text += `\n`;
        text += `Available options:\n`;
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


    private validateOptionsSpec(spec: OptionsSpec) {
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
        const responseFiles = files
            .map(f => create(CodeGeneratorResponse_FileSchema, {
                name: f.getFilename(),
                content: f.getContent()
            }) as CodeGeneratorResponse_File)
            .filter(f => f.content && f.content.length > 0);
        return create(CodeGeneratorResponseSchema, {
            file: responseFiles,
            supportedFeatures: protoInt64.parse(feat),
        }) as CodeGeneratorResponse;
    }


    protected errorToString(error: any): string {
        if (error && typeof error.name == 'string' && error.name == 'ParameterError') {
            return error.name + '\n\n' + error.message;
        }
        if (error && typeof error.name == 'string' && error.name == 'PluginMessageError') {
            return error.message;
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

    private setBlockingStdout() {
        // Fixes https://github.com/timostamm/protobuf-ts/issues/134
        // Node is buffering chunks to stdout, meaning that for big generated
        // files the CodeGeneratorResponse will not reach protoc completely.
        // To fix this, we set stdout to block using the internal private
        // method setBlocking(true)

        const stdoutHandle = (process.stdout as any)._handle;

        if (stdoutHandle) {
            stdoutHandle.setBlocking(true);
        }
    }
}