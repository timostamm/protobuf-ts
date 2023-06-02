import {getCodeGeneratorRequest} from "./support/helpers";
import {ProtobuftsPlugin} from "../src/protobufts-plugin";


describe('protobuftsPluginExternPath', function () {
    let plugin = new ProtobuftsPlugin('test');
    let request = getCodeGeneratorRequest({
        parameter: 'long_type_string,extern_path=io/foo:@io/foo',
        // fileToGenerate: [
        //     'msg-annotated.proto',
        // ],
        // includeFiles: [
        //     'msg-annotated.proto',
        //     'google/protobuf/descriptor.proto',
        //     // 'google/protobuf/unittest_enormous_descriptor.proto',
        //     // 'google/protobuf/unittest_proto3_lite.proto',
        //     // 'google/protobuf/unittest_import.proto',
        //     // 'google/protobuf/unittest_import_public.proto',
        //     // 'google/protobuf/wrappers.proto',
        //     // 'msg-scalar.proto',
        //     // 'msg-proto3-optionals.proto',
        //     // 'google/protobuf/any.proto',
        //     // 'google/protobuf/wrappers.proto',
        //     // 'google/protobuf/struct.proto',
        //     // 'google/protobuf/timestamp.proto',
        //     // 'google/protobuf/duration.proto',
        //     //     'service-twirp-example.proto',
        //     //     'service-example.proto',
        //     // 'msg-oneofs.proto',
        //     // 'msg-maps.proto',
        //     // 'google/protobuf/unittest_lazy_dependencies_enum.proto',
        //     //  'service-simple.proto',
        //     //  'service-example.proto',
        //     //  'service-style-all.proto',
        //     // 'msg-proto3-optionals.proto',
        //     // 'google/rpc/status.proto',
        // ]
    });
    let generatedFiles = plugin.generate(request);

    // for (let f of generatedFiles) {
    //     const content = f.getContent();
    //     if (content.length > 0 && f.getFilename().includes('')) {
    //         console.log('-------------------------' + f.getFilename() + '-------------------------');
    //         console.log(content);
    //         console.log();
    //         console.log();
    //     }
    // }


    describe('generates valid typescript for msg-extern-package.proto', function () {
        it('.proto available', function () {
            const externPackage = generatedFiles.find(f => f.getFilename() === 'msg-extern-package.ts');
            if (!externPackage) {
                fail('msg-extern-package.proto not generated');
            }
            if (!externPackage!.getContent().includes('import { Bar } from "@io/foo";')) {
                fail('msg-extern-package.proto does not import external message io.foo.Bar');
            }
        });
    });


});

