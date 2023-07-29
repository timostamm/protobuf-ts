import {getCodeGeneratorRequest} from "./support/helpers";
import {ProtobuftsPlugin} from "../src/protobufts-plugin";
import {GeneratedFile} from "@protobuf-ts/plugin-framework";

const stringSnippets = [
    // Message
    '@generated from protobuf field: fixed64 fixed64_field_min_str = 11 [jstype = JS_STRING]',
    'fixed64FieldMinStr: string;',
    // MessageType
    '{ no: 11, name: "fixed64_field_min_str", kind: "scalar", T: 6 /*ScalarType.FIXED64*/ },',
    // BinaryReader
    'case /* fixed64 fixed64_field_min_str = 11 [jstype = JS_STRING];*/ 11:',
    'message.fixed64FieldMinStr = reader.fixed64().toString();',
    // BinaryWriter
    '/* fixed64 fixed64_field_min_str = 11 [jstype = JS_STRING]; */',
    'if (message.fixed64FieldMinStr !== "0")',
];

const bigintSnippets = [
    // Message
    '@generated from protobuf field: fixed64 fixed64_field_min = 1 [jstype = JS_NORMAL];',
    'fixed64FieldMin: bigint;',
    // MessageType
    '{ no: 1, name: "fixed64_field_min", kind: "scalar", T: 6 /*ScalarType.FIXED64*/, L: 0 /*LongType.BIGINT*/ },',
    // BinaryReader
    'case /* fixed64 fixed64_field_min = 1 [jstype = JS_NORMAL];*/ 1:',
    'message.fixed64FieldMin = reader.fixed64().toBigInt();',
    // BinaryWriter
    '/* fixed64 fixed64_field_min = 1 [jstype = JS_NORMAL]; */',
    'if (message.fixed64FieldMin !== 0n)',
]

const numberSnippets = [
    // Message
    '@generated from protobuf field: fixed64 fixed64_field_min_num = 21 [jstype = JS_NUMBER];',
    'fixed64FieldMinNum: number;',
    // MessageType
    '{ no: 21, name: "fixed64_field_min_num", kind: "scalar", T: 6 /*ScalarType.FIXED64*/, L: 2 /*LongType.NUMBER*/ },',
    // BinaryReader
    'case /* fixed64 fixed64_field_min_num = 21 [jstype = JS_NUMBER];*/ 21:',
    'message.fixed64FieldMinNum = reader.fixed64().toNumber();',
    // BinaryWriter
    '/* fixed64 fixed64_field_min_num = 21 [jstype = JS_NUMBER]; */',
    'if (message.fixed64FieldMinNum !== 0)',
]

describe('Generated code for long type', function () {
    describe('Default to string', () => {
        let file: string;

        beforeAll(() => {
            file = generateTypescript('long_type_string').getContent();
        });

        it('should set the default type to string', () => {
            expectContainAll(file, [
                // Message
                '@generated from protobuf field: sfixed64 sfixed64_field_min = 5;',
                'sfixed64FieldMin: string;',
                // MessageType
                'case /* sfixed64 sfixed64_field_min */ 5:',
                '{ no: 5, name: "sfixed64_field_min", kind: "scalar", T: 16 /*ScalarType.SFIXED64*/ },',
                // BinaryReader
                'message.sfixed64FieldMin = reader.sfixed64().toString();',
                // BinaryWriter
                '/* sfixed64 sfixed64_field_min = 5; */',
                'if (message.sfixed64FieldMin !== "0")',
            ]);
        });

        it('should support explicit types', () => {
            expectContainAll(file, stringSnippets);
            expectContainAll(file, bigintSnippets);
            expectContainAll(file, numberSnippets);
        });
    });

    describe('Default to bigint', () => {
        let file: string;

        beforeAll(() => {
            file = generateTypescript('long_type_bigint').getContent();
        });

        it('should set the default type to bigint', () => {
            expectContainAll(file, [
                // Message
                '@generated from protobuf field: sfixed64 sfixed64_field_min = 5;',
                'sfixed64FieldMin: bigint;',
                // MessageType
                'case /* sfixed64 sfixed64_field_min */ 5:',
                '{ no: 5, name: "sfixed64_field_min", kind: "scalar", T: 16 /*ScalarType.SFIXED64*/, L: 0 /*LongType.BIGINT*/ },',
                // BinaryReader
                'message.sfixed64FieldMin = reader.sfixed64().toBigInt();',
                // BinaryWriter
                '/* sfixed64 sfixed64_field_min = 5; */',
                'if (message.sfixed64FieldMin !== 0n)',
            ]);
        });

        it('should support explicit types', () => {
            expectContainAll(file, stringSnippets);
            expectContainAll(file, bigintSnippets);
            expectContainAll(file, numberSnippets);
        });
    });

    describe('Default to number', () => {
        let file: string;

        beforeAll(() => {
            file = generateTypescript('long_type_number').getContent();
        });

        it('should set the default type to number', () => {
            expectContainAll(file, [
                // Message
                '@generated from protobuf field: sfixed64 sfixed64_field_min = 5;',
                'sfixed64FieldMin: number;',
                // MessageType
                'case /* sfixed64 sfixed64_field_min */ 5:',
                '{ no: 5, name: "sfixed64_field_min", kind: "scalar", T: 16 /*ScalarType.SFIXED64*/, L: 2 /*LongType.NUMBER*/ },',
                // BinaryReader
                'message.sfixed64FieldMin = reader.sfixed64().toNumber();',
                // BinaryWriter
                '/* sfixed64 sfixed64_field_min = 5; */',
                'if (message.sfixed64FieldMin !== 0)',
            ]);
        });

        it('should support explicit types', () => {
            expectContainAll(file, stringSnippets);
            expectContainAll(file, bigintSnippets);
            expectContainAll(file, numberSnippets);
        });
    });
});

// Generate typescript code for msg-longs.proto.
// The `parameter` is forwarded to the request.
function generateTypescript(parameter: string): GeneratedFile {
    let plugin = new ProtobuftsPlugin('test');
    let request = getCodeGeneratorRequest({
        parameter,
        includeFiles: [ 'msg-longs.proto' ]
    });
    const outFile = plugin.generate(request).find(f => f.getFilename() === 'msg-longs.ts');
    expect(outFile).toBeDefined();
    return outFile!;
}

function expectContainAll(content: string, snippets: string[]) {
    snippets.forEach(snippet => {
        expect(content).toContain(snippet, `"${snippet}" not found`);
    });
}
