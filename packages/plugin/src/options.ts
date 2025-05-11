import * as rt from "@protobuf-ts/runtime";
import * as ts from "typescript";
import {DescFile, DescService, getOption} from "@bufbuild/protobuf";
import {FileOptions_OptimizeMode} from "@bufbuild/protobuf/wkt";
import {createOptionParser} from "./framework/create-option-parser";
import {client, server, ServerStyle, ClientStyle} from "./gen/protobuf-ts_pb";


/**
 * Parse Protobuf-TS plugin options from raw options.
 */
const parseParameter = createOptionParser({
    // long type
    long_type_string: {
        kind: "flag",
        description: "Sets jstype = JS_STRING for message fields with 64 bit integral values. \n" +
            "The default behaviour is to use native `bigint`. \n" +
            "Only applies to fields that do *not* use the option `jstype`.",
        excludes: ["long_type_number", "long_type_bigint"],
    },
    long_type_number: {
        kind: "flag",
        description: "Sets jstype = JS_NUMBER for message fields with 64 bit integral values. \n" +
            "The default behaviour is to use native `bigint`. \n" +
            "Only applies to fields that do *not* use the option `jstype`.",
        excludes: ["long_type_string", "long_type_bigint"],
    },
    long_type_bigint: {
        kind: "flag",
        description: "Sets jstype = JS_NORMAL for message fields with 64 bit integral values. \n" +
            "This is the default behavior. \n" +
            "Only applies to fields that do *not* use the option `jstype`.",
        excludes: ["long_type_string", "long_type_number"],
    },

    // misc
    generate_dependencies: {
        kind: "flag",
        description: "By default, only the PROTO_FILES passed as input to protoc are generated, \n" +
            "not the files they import (with the exception of well-known types, which are \n" +
            "always generated when imported). \n"+
            "Set this option to generate code for dependencies too.",
    },
    force_exclude_all_options: {
        kind: "flag",
        description: "By default, custom options are included in the metadata and can be blacklisted \n" +
            "with our option (ts.exclude_options). Set this option if you are certain you \n" +
            "do not want to include any options at all.",
    },
    keep_enum_prefix: {
        kind: "flag",
        description: "By default, if all enum values share a prefix that corresponds with the enum's \n" +
            "name, the prefix is dropped from the value names. Set this option to disable \n" +
            "this behavior.",
    },
    use_proto_field_name: {
        kind: "flag",
        description: "By default interface fields use lowerCamelCase names by transforming proto field\n" +
            "names to follow common style convention for TypeScript. Set this option to preserve\n" +
            "original proto field names in generated interfaces.",
    },
    ts_nocheck: {
        kind: "flag",
        description: "Generate a @ts-nocheck annotation at the top of each file. This will become the \n" +
            "default behaviour in the next major release.",
        excludes: ['disable_ts_nocheck'],
    },
    disable_ts_nocheck: {
        kind: "flag",
        description: "Do not generate a @ts-nocheck annotation at the top of each file. Since this is \n" +
            "the default behaviour, this option has no effect.",
        excludes: ['ts_nocheck'],
    },
    eslint_disable: {
        kind: "flag",
        description: "Generate a eslint-disable comment at the top of each file. This will become the \n" +
            "default behaviour in the next major release.",
        excludes: ['no_eslint_disable'],
    },
    no_eslint_disable: {
        kind: "flag",
        description: "Do not generate a eslint-disable comment at the top of each file. Since this is \n" +
            "the default behaviour, this option has no effect.",
        excludes: ['eslint_disable'],
    },
    add_pb_suffix: {
        kind: "flag",
        description: "Adds the suffix `_pb` to the names of all generated files. This will become the \n" +
            "default behaviour in the next major release.",
    },

    // output types
    output_typescript: {
        kind: "flag",
        description: "Output TypeScript files. This is the default behavior.",
        excludes: ["output_javascript", "output_javascript_es2015", "output_javascript_es2016", "output_javascript_es2017", "output_javascript_es2018", "output_javascript_es2019", "output_javascript_es2020"]
    },
    output_javascript: {
        kind: "flag",
        description: "Output JavaScript for the currently recommended target ES2020. The target may \n" +
            "change with a major release of protobuf-ts. \n" +
            "Along with JavaScript files, this always outputs TypeScript declaration files.",
        excludes: ["output_typescript", "output_javascript_es2015", "output_javascript_es2016", "output_javascript_es2017", "output_javascript_es2018", "output_javascript_es2019", "output_javascript_es2020"]
    },
    output_javascript_es2015: {
        kind: "flag",
        description: "Output JavaScript for the ES2015 target.",
        excludes: ["output_typescript", "output_javascript_es2016", "output_javascript_es2017", "output_javascript_es2018", "output_javascript_es2019", "output_javascript_es2020"]
    },
    output_javascript_es2016: {
        kind: "flag",
        description: "Output JavaScript for the ES2016 target.",
        excludes: ["output_typescript", "output_javascript_es2015", "output_javascript_es2017", "output_javascript_es2018", "output_javascript_es2019", "output_javascript_es2020"]
    },
    output_javascript_es2017: {
        kind: "flag",
        description: "Output JavaScript for the ES2017 target.",
        excludes: ["output_typescript", "output_javascript_es2015", "output_javascript_es2016", "output_javascript_es2018", "output_javascript_es2019", "output_javascript_es2020"]
    },
    output_javascript_es2018: {
        kind: "flag",
        description: "Output JavaScript for the ES2018 target.",
        excludes: ["output_typescript", "output_javascript_es2015", "output_javascript_es2016", "output_javascript_es2017", "output_javascript_es2019", "output_javascript_es2020"]
    },
    output_javascript_es2019: {
        kind: "flag",
        description: "Output JavaScript for the ES2019 target.",
        excludes: ["output_typescript", "output_javascript_es2015", "output_javascript_es2016", "output_javascript_es2017", "output_javascript_es2018", "output_javascript_es2020"]
    },
    output_javascript_es2020: {
        kind: "flag",
        description: "Output JavaScript for the ES2020 target.",
        excludes: ["output_typescript", "output_javascript_es2015", "output_javascript_es2016", "output_javascript_es2017", "output_javascript_es2018", "output_javascript_es2019"]
    },
    output_legacy_commonjs: {
        kind: "flag",
        description: "Use CommonJS instead of the default ECMAScript module system.",
        excludes: ["output_typescript"]
    },

    // client
    client_none: {
        kind: "flag",
        description: "Do not generate rpc clients. \n" +
            "Only applies to services that do *not* use the option `ts.client`. \n" +
            "If you do not want rpc clients at all, use `force_client_none`.",
        excludes: ['client_generic', 'client_grpc1'],
    },
    client_generic: {
        kind: "flag",
        description: "Only applies to services that do *not* use the option `ts.client`. \n" +
            "Since GENERIC_CLIENT is the default, this option has no effect.",
        excludes: ['client_none', 'client_grpc1', 'force_client_none', 'force_disable_services'],
    },
    client_grpc1: {
        kind: "flag",
        description: "Generate a client using @grpc/grpc-js (major version 1). \n" +
            "Only applies to services that do *not* use the option `ts.client`." ,
        excludes: ['client_none', 'client_generic', 'force_client_none', 'force_disable_services'],
    },
    force_client_none: {
        kind: "flag",
        description: "Do not generate rpc clients, ignore options in proto files.",
        excludes: ['client_none', 'client_generic', 'client_grpc1'],
    },

    // server
    server_none: {
        kind: "flag",
        description: "Do not generate rpc servers. \n" +
            "This is the default behaviour, but only applies to services that do \n" +
            "*not* use the option `ts.server`. \n" +
            "If you do not want servers at all, use `force_server_none`.",
        excludes: ['server_grpc1'],
    },
    server_generic: {
        kind: "flag",
        description: "Generate a generic server interface. Adapters are used to serve the service, \n" +
            "for example @protobuf-ts/grpc-backend for gRPC. \n" +
            "Note that this is an experimental feature and may change with a minor release. \n" +
            "Only applies to services that do *not* use the option `ts.server`.",
        excludes: ['server_none', 'force_server_none', 'force_disable_services'],
    },
    server_grpc1: {
        kind: "flag",
        description: "Generate a server interface and definition for use with @grpc/grpc-js \n" +
            "(major version 1). \n" +
            "Only applies to services that do *not* use the option `ts.server`.",
        excludes: ['server_none', 'force_server_none', 'force_disable_services'],
    },
    force_server_none: {
        kind: "flag",
        description: "Do not generate rpc servers, ignore options in proto files.",
    },

    force_disable_services: {
        kind: "flag",
        description: "Do not generate anything for service definitions, and ignore options in proto \n" +
            "files. This is the same as setting both options `force_server_none` and \n" +
            "`force_client_none`, but also stops generating service metadata.",
        excludes: ['client_generic', 'client_grpc1', 'server_generic', 'server_grpc1']
    },

    // optimization
    optimize_speed: {
        kind: "flag",
        description: "Sets optimize_for = SPEED for proto files that have no file option \n" +
            "'option optimize_for'. Since SPEED is the default, this option has no effect.",
        excludes: ['force_optimize_speed'],
    },
    optimize_code_size: {
        kind: "flag",
        description: "Sets optimize_for = CODE_SIZE for proto files that have no file option \n" +
            "'option optimize_for'.",
        excludes: ['force_optimize_speed'],
    },
    force_optimize_code_size: {
        kind: "flag",
        description: "Forces optimize_for = CODE_SIZE for all proto files, ignore file options.",
        excludes: ['optimize_code_size', 'force_optimize_speed']
    },
    force_optimize_speed: {
        kind: "flag",
        description: "Forces optimize_for = SPEED for all proto files, ignore file options.",
        excludes: ['optimize_code_size', 'force_optimize_code_size']
    },
});


/**
 * Internal settings for the file generation.
 */
export interface Options {
    readonly generateDependencies: boolean;
    readonly pluginCredit?: string;
    readonly normalLongType: rt.LongType,
    readonly normalOptimizeMode: FileOptions_OptimizeMode,
    readonly forcedOptimizeMode: FileOptions_OptimizeMode | undefined,
    readonly normalServerStyle: ServerStyle,
    readonly forcedServerStyle: ServerStyle | undefined,
    readonly normalClientStyle: ClientStyle,
    readonly forcedClientStyle: ClientStyle | undefined,
    readonly synthesizeEnumZeroValue: string | false; // create a "synthetic" enum value with this string as name if no 0 value is present
    readonly oneofKindDiscriminator: string;
    readonly runtimeRpcImportPath: string;
    readonly runtimeImportPath: string;
    readonly forceExcludeAllOptions: boolean;
    readonly keepEnumPrefix: boolean;
    readonly useProtoFieldName: boolean;
    readonly tsNoCheck: boolean;
    readonly esLintDisable: boolean;
    readonly transpileTarget: ts.ScriptTarget | undefined,
    readonly transpileModule: ts.ModuleKind,
    readonly forceDisableServices: boolean;
    readonly addPbSuffix: boolean;
    getOptimizeMode(file: DescFile): FileOptions_OptimizeMode;
    getClientStyles(descriptor: DescService): ClientStyle[];
    getServerStyles(descriptor: DescService): ServerStyle[];
}

export function parseOptions(
    parameter: string,
    pluginCredit?: string,
): Options {
    const params = parseParameter(parameter);
    type Writeable<T> = { -readonly [P in keyof T]: T[P] };
    const o: Writeable<Options> = {
        generateDependencies: false,
        normalLongType: rt.LongType.BIGINT,
        normalOptimizeMode: FileOptions_OptimizeMode.SPEED,
        forcedOptimizeMode: undefined,
        normalClientStyle: ClientStyle.GENERIC_CLIENT,
        forcedClientStyle: undefined,
        normalServerStyle: ServerStyle.NO_SERVER,
        forcedServerStyle: undefined,
        synthesizeEnumZeroValue: 'UNSPECIFIED$',
        oneofKindDiscriminator: 'oneofKind',
        runtimeRpcImportPath: '@protobuf-ts/runtime-rpc',
        runtimeImportPath: '@protobuf-ts/runtime',
        forceExcludeAllOptions: false,
        keepEnumPrefix: false,
        useProtoFieldName: false,
        tsNoCheck: false,
        esLintDisable: false,
        transpileTarget: undefined,
        transpileModule: ts.ModuleKind.ES2015,
        forceDisableServices: false,
        addPbSuffix: false,
        getOptimizeMode(file: DescFile): FileOptions_OptimizeMode {
            if (this.forcedOptimizeMode !== undefined) {
                return this.forcedOptimizeMode;
            }
            if (file.proto.options?.optimizeFor !== undefined) {
                return file.proto.options.optimizeFor;
            }
            return this.normalOptimizeMode;
        },
        getClientStyles(descriptor: DescService): ClientStyle[] {
            const opt = getOption(descriptor, client);

            // always check service options valid
            if (opt.includes(ClientStyle.NO_CLIENT) && opt.some(s => s !== ClientStyle.NO_CLIENT)) {
                // TODO
                //let err = new Error(`You provided invalid options for ${this.stringFormat.formatQualifiedName(descriptor, true)}. If you set (ts.client) = NO_CLIENT, you cannot set additional client styles.`);
                let err = new Error(`You provided invalid options for ${descriptor.typeName}. If you set (ts.client) = NO_CLIENT, you cannot set additional client styles.`);
                err.name = `PluginMessageError`;
                throw err;
            }

            if (this.forcedClientStyle !== undefined) {
                return [this.forcedClientStyle];
            }

            // look for service options
            if (opt.length) {
                return opt
                    .filter(s => s !== ClientStyle.NO_CLIENT)
                    .filter((value, index, array) => array.indexOf(value) === index);
            }

            // fall back to normal style set by option
            return [this.normalClientStyle];
        },
        getServerStyles(descriptor: DescService): ServerStyle[] {
            const opt = getOption(descriptor, server);

            // always check service options valid
            if (opt.includes(ServerStyle.NO_SERVER) && opt.some(s => s !== ServerStyle.NO_SERVER)) {
                // TODO
                //let err = new Error(`You provided invalid options for ${this.stringFormat.formatQualifiedName(descriptor, true)}. If you set (ts.server) = NO_SERVER, you cannot set additional server styles.`);
                let err = new Error(`You provided invalid options for ${descriptor.typeName}. If you set (ts.server) = NO_SERVER, you cannot set additional server styles.`);
                err.name = `PluginMessageError`;
                throw err;
            }

            if (this.forcedServerStyle !== undefined) {
                return [this.forcedServerStyle];
            }

            // look for service options
            if (opt.length) {
                return opt
                    .filter(s => s !== ServerStyle.NO_SERVER)
                    .filter((value, index, array) => array.indexOf(value) === index);
            }

            // fall back to normal style set by option
            return [this.normalServerStyle];
        }
    };
    if (pluginCredit) {
        o.pluginCredit = pluginCredit;
    }
    if (params.generate_dependencies) {
        o.generateDependencies = true;
    }
    if (params.force_exclude_all_options) {
        o.forceExcludeAllOptions = true;
    }
    if (params.keep_enum_prefix) {
        o.keepEnumPrefix = true;
    }
    if (params.use_proto_field_name) {
        o.useProtoFieldName = true;
    }
    if (params.ts_nocheck) {
        o.tsNoCheck = true;
    }
    if (params.eslint_disable) {
        o.esLintDisable = true;
    }
    if (params.long_type_string) {
        o.normalLongType = rt.LongType.STRING;
    }
    if (params.long_type_number) {
        o.normalLongType = rt.LongType.NUMBER;
    }
    if (params.optimize_code_size) {
        o.normalOptimizeMode = FileOptions_OptimizeMode.CODE_SIZE;
    }
    if (params.force_optimize_speed) {
        o.forcedOptimizeMode = FileOptions_OptimizeMode.SPEED;
    }
    if (params.force_optimize_code_size) {
        o.forcedOptimizeMode = FileOptions_OptimizeMode.CODE_SIZE;
    }
    if (params.client_none) {
        o.normalClientStyle = ClientStyle.NO_CLIENT;
    }
    if (params.client_grpc1) {
        o.normalClientStyle = ClientStyle.GRPC1_CLIENT;
    }
    if (params.force_client_none) {
        o.forcedClientStyle = ClientStyle.NO_CLIENT;
    }
    if (params.server_generic) {
        o.normalServerStyle = ServerStyle.GENERIC_SERVER;
    }
    if (params.server_grpc1) {
        o.normalServerStyle = ServerStyle.GRPC1_SERVER;
    }
    if (params.force_server_none) {
        o.forcedServerStyle = ServerStyle.NO_SERVER;
    }
    if (params.add_pb_suffix) {
        o.addPbSuffix = true;
    }
    if (params.force_disable_services) {
      o.forceDisableServices = true;
    }
    if (params.output_javascript) {
        o.transpileTarget = ts.ScriptTarget.ES2020;
    }
    if (params.output_javascript_es2015) {
        o.transpileTarget = ts.ScriptTarget.ES2015;
    }
    if (params.output_javascript_es2016) {
        o.transpileTarget = ts.ScriptTarget.ES2016;
    }
    if (params.output_javascript_es2017) {
        o.transpileTarget = ts.ScriptTarget.ES2017;
    }
    if (params.output_javascript_es2018) {
        o.transpileTarget = ts.ScriptTarget.ES2018;
    }
    if (params.output_javascript_es2019) {
        o.transpileTarget = ts.ScriptTarget.ES2019;
    }
    if (params.output_javascript_es2020) {
        o.transpileTarget = ts.ScriptTarget.ES2020;
    }
    if (params.output_legacy_commonjs) {
        o.transpileModule = ts.ModuleKind.CommonJS;
    }
    return o;
}

