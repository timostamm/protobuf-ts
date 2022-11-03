import { getFixtureCodeGeneratorRequest } from "./support/helpers";
import { ProtobuftsPlugin } from "../src/protobufts-plugin";
import * as ts from "typescript";
import { setupCompiler } from "@chippercash/protobuf-plugin-framework";
import { OutFile } from "../src/out-file";


describe('protobuftsPlugin', function () {
  let plugin = new ProtobuftsPlugin('test');
  let request = getFixtureCodeGeneratorRequest({
    parameter: 'long_type_string',
    fileToGenerate: [
      /*'msg-scalar.proto',
      'msg-oneofs.proto',
      'msg-annotated.proto',
      'msg-enum.proto',
      'msg-longs.proto',
      'msg-proto2-optionals.proto',
      'msg-maps.proto',
      'msg-proto3-optionals.proto',*/
      'service-example.proto',
      'msg-message.proto',
      'qeta.proto',
      // 'google/protobuf/descriptor.proto'
    ],
    includeFiles: [
      /*'msg-annotated.proto',
      'msg-enum.proto',
      'msg-longs.proto',
      'msg-scalar.proto',
      'msg-proto2-optionals.proto',
      'msg-proto3-optionals.proto',
      'msg-oneofs.proto',
      'msg-maps.proto',*/
      'service-example.proto',
      'msg-message.proto',
      'qeta.proto',
      // 'google/protobuf/descriptor.proto',
      // 'google/protobuf/unittest_enormous_descriptor.proto',
      // 'google/protobuf/unittest_proto3_lite.proto',
      // 'google/protobuf/unittest_import.proto',
      // 'google/protobuf/unittest_import_public.proto',
      // 'google/protobuf/wrappers.proto',
      // 'google/protobuf/any.proto',
      // 'google/protobuf/wrappers.proto',
      // 'google/protobuf/struct.proto',
      // 'google/protobuf/timestamp.proto',
      // 'google/protobuf/duration.proto',
      //     'service-twirp-example.proto',
      //     'service-example.proto',
      // 'google/protobuf/unittest_lazy_dependencies_enum.proto',
      //  'service-simple.proto',
      //  'service-style-all.proto',
      // 'google/rpc/status.proto',
    ]
  });
  let generatedFiles = plugin.generate(request);

  for (let f of generatedFiles) {
    const content = f.getContent();
    if (content.length > 0) {
      console.log('-------------------------' + f.getFilename() + '-------------------------');
      const lines = content.split('\n')
      // console.log(lines)
      for (let idx = 0; idx < lines.length; idx++) {
        console.log(idx + ' ');
        console.log(lines[idx])
      }
      // console.log(content);
      console.log();
      console.log();
    }
  }


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

        // activated for issue #94
        // svelte requires this option
        importsNotUsedAsValues: ts.ImportsNotUsedAsValues.Error,

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
          "@chippercash/protobuf-runtime": [
            '../runtime/src/index'
          ],
          "@chippercash/protobuf-runtime-rpc": [
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
        const file = generatedFiles.find(f => f instanceof OutFile && f.fileDescriptor === fileDescriptor);
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
