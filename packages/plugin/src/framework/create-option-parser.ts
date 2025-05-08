
/**
 * Plugin options derived from an options spec.
 */
export type Options<S extends OptionSpecs> = {
    [K in keyof S]: boolean;
};

type OptionSpecs = Record<string, OptionSpec>;

type OptionSpec = {
    kind: "flag";
    /**
     * A description for this option.
     */
    description: string;
    /**
     * If this option is set, setting any of the following other options is an error.
     */
    excludes?: readonly string[];
    /**
     * If this option is set, the following other options must be set as well.
     */
    requires?: readonly string[];
};

/**
 * Function to parse raw options into typed options.
 * May throw an error.
 */
export type OptionsParseFn<S extends OptionSpecs> = (input: string | {key: string, value: string}[]) => Options<S>;


/**
 * Create a function for parsing options from an options spec.
 */
export function createOptionParser<S extends OptionSpecs>(optionSpecs: S): OptionsParseFn<S> {
    validateSpecs(optionSpecs);
    return function parseOptions(input: string | {key: string, value: string}[]): Options<S> {
        const options = defaultOptions(optionSpecs);
        const rawOptions = typeof input == "string" ? splitParameter(input) : input;
        const seen = new Set<keyof S>();
        for (const rawOption of rawOptions ) {
            if (!Object.prototype.hasOwnProperty.call(optionSpecs, rawOption.key)) {
                throwOptionError(optionSpecs, `Option "${rawOption.key}" not recognized.`);
            }
            const key = rawOption.key as keyof S;
            const spec = optionSpecs[key];
            switch (spec.kind) {
                case "flag":
                    if (seen.has(key)) {
                        throwOptionError(optionSpecs, `Option "${rawOption.key}" cannot be given more than once.`);
                    }
                    seen.add(key);
                    if (rawOption.value.length > 0) {
                        throwOptionError(optionSpecs, `Option "${key}" does not take a value.`);
                    }
                    options[key] = true;
                    break;
            }
        }
        validateOptions(options, optionSpecs);
        return options;
    }
}

/**
 * Split a raw parameter string (e.g. "foo,bar=baz,qux=123") into an
 * array of key/values.
 */
function splitParameter(
    parameter: string,
): { key: string; value: string }[] {
    if (parameter.length == 0) {
        return [];
    }
    return parameter.split(",").map((raw) => {
        const i = raw.indexOf("=");
        return {
            key: i === -1 ? raw : raw.substring(0, i),
            value: i === -1 ? "" : raw.substring(i + 1),
        };
    });
}

function defaultOptions<S extends OptionSpecs>(optionSpecs: S): Options<S> {
    const o: Record<string, boolean> = {};
    for (const [key, spec] of Object.entries(optionSpecs)) {
        switch (spec.kind) {
            case "flag":
                o[key] = false;
                break;
        }
    }
    return o as Options<S>;
}

function validateOptions<S extends OptionSpecs>(options: Options<S>, optionSpecs: S) {
    for (const [key, spec] of Object.entries(optionSpecs) as Iterable<[keyof S, OptionSpec]>) {
        switch (spec.kind) {
            case "flag":
                const value: boolean = options[key];
                if (value) {
                    const requiredKeys = (spec.requires ?? []) as (keyof S)[];
                    const excludedKeys = (spec.excludes ?? []) as (keyof S)[];
                    const missingKeys = requiredKeys.filter(key => !options[key]);
                    if (missingKeys.length > 0) {
                        throwOptionError(optionSpecs, `Option "${key}" requires option "${missingKeys.join('", "')}" to be set.`);
                    }
                    const deniedKeys = excludedKeys.filter(key => options[key]);
                    if (deniedKeys.length > 0) {
                        throwOptionError(optionSpecs, `If option "${key}" is set, option "${deniedKeys.join('", "')}" cannot be set.`);
                    }
                }
                break;
        }
    }
}

function validateSpecs(spec: OptionSpecs) {
    const known = Object.keys(spec);
    for (const [key, {excludes, requires}] of Object.entries(spec)) {
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

function throwOptionError(optionSpecs: OptionSpecs, error: string) {
    let text = '';
    text += error + '\n';
    text += `\n`;
    text += `Available options:\n`;
    text += `\n`;
    for (let [key, val] of Object.entries(optionSpecs)) {
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
