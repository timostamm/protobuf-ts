import {getFixtureCodeGeneratorRequest} from "./support/helpers";
import {ProtobuftsPlugin} from "../src/protobufts-plugin";
import * as ts from "typescript";
import {setupCompiler} from "@protobuf-ts/plugin-framework";


describe('protobuftsPlugin', function () {
    let plugin = new ProtobuftsPlugin('test');
    let request = getFixtureCodeGeneratorRequest({
        parameter: 'long_type_string',
        // includeFiles: [
        //
        //     // 'google/protobuf/unittest_proto3_lite.proto',
        //     // 'google/protobuf/unittest_import.proto',
        //     // 'google/protobuf/unittest_import_public.proto',
        //
        //     // 'google/protobuf/wrappers.proto',
        //
        //     'msg-scalar.proto',
        //     'msg-proto3-optionals.proto',
        //     // 'google/protobuf/any.proto',
        //     // 'google/protobuf/wrappers.proto',
        //     // 'google/protobuf/struct.proto',
        //     // 'google/protobuf/timestamp.proto',
        //     // 'google/protobuf/duration.proto',
        //     //     'service-twirp-example.proto',
        //     //     'service-all-methods.proto',
        //     // 'msg-oneofs.proto',
        //     // 'msg-maps.proto',
        //     // 'google/protobuf/unittest_lazy_dependencies_enum.proto',
        //     //  'service-simple.proto',
        //     //  'service-all-methods.proto',
        //     // 'msg-proto3-optionals.proto',
        //     // 'google/rpc/status.proto',
        // ]
    });
    let generatedFiles = plugin.generate(request);

    // for (let f of generatedFiles) {
    //     console.log('-------------------------' + f.getFilename() + '-------------------------');
    //     console.log(f.getContent());
    //     console.log();
    //     console.log();
    // }


    describe('generates valid typescript for every fixture .proto', function () {

        if (generatedFiles.length === 0) {
            it('Fixture .protos available', function () {
                pending('No fixture .proto available!');
            });
            return;
        }

        // generate code for all available .proto
        const
            compilerOptions: ts.CompilerOptions = {
                strict: true,
                skipLibCheck: false,
                forceConsistentCasingInFileNames: true,
                baseUrl: './',
                moduleResolution: ts.ModuleResolutionKind.NodeJs,
                lib: [
                    "dom",
                    "ES2015",
                    "ES2017.Object",
                    "ES2016.Array.include",
                    "ES2020.bigint", // for bigint in generated code
                    "ES2018.AsyncIterable" // for runtime-rpc
                ],
                module: ts.ModuleKind.CommonJS,
                // ES2020 is required for bigint support
                target: ts.ScriptTarget.ES2020,
                paths: {
                    "@protobuf-ts/runtime": [
                        '../runtime/src/index'
                    ],
                    "@protobuf-ts/runtime-rpc": [
                        '../runtime-rpc/src/index'
                    ],
                }
            },
            [program, host] = setupCompiler(compilerOptions, generatedFiles, [
                ...generatedFiles.map(f => f.getFilename())
            ]);

        // compile
        const preEmit = ts.getPreEmitDiagnostics(program), result = program.emit(),
            diagnostics = [...preEmit, ...result.diagnostics];

        // check each .proto for ts compilation errors
        for (let fileDescriptor of request.protoFile) {
            it(`${fileDescriptor.name}`, function () {
                const file = generatedFiles.find(f => f.fileDescriptor === fileDescriptor);
                expect(file).toBeDefined('Missing associated typescript file!');
                const problems = diagnostics.filter(d => d.file?.fileName === file?.getFilename());
                if (problems.length > 0) fail(ts.formatDiagnostics(problems, host));
            });
        }

        // check for errors not associated with a generated file
        it(`no global typescript errors`, function () {
            let genNames = generatedFiles.map(f => f.getFilename());
            let globals = diagnostics.filter(d => !genNames.includes(d.file?.fileName ?? ''))
            if (globals.length > 0) fail(ts.formatDiagnostics(globals, host));
        })

    });


});

