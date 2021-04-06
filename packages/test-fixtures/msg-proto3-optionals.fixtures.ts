import type {Fixture} from "./index";
import {MessageType} from "@protobuf-ts/runtime";

const f: Fixture[] = [];
export default f;

f.push({
    typeName: 'spec.Proto3OptionalsMessage',
    fields: [
        {no: 1, name: "string_field", opt: true, kind: "scalar", T: 9 /*string*/},
        {no: 2, name: "bytes_field", opt: true, kind: "scalar", T: 12 /*bytes*/},
        {
            no: 3,
            name: "enum_field",
            opt: true,
            kind: "enum",
            T: () => ["spec.Proto3OptionalsMessage.TestEnum", Proto3OptionalsMessage_TestEnum]
        },
        {no: 4, name: "message_field", kind: "message", T: () => Proto3OptionalsMessage_TestMessage}
    ],
    messages: {
        'default': {
        },
        'empty': {
            stringField: "",
            bytesField: new Uint8Array(0),
            enumField: 0,
            messageField: {field: ""},
        },
    },
    json: {
        'default': {},
        'empty': {
            stringField: "",
            bytesField: "",
            enumField: 'ANY',
            messageField: {},
        },
    },
    jsonReads: {
        'string_field': {
            'null reads to "" like regular oneof': {input: null, expect: ""},
            'undefined reads to undefined like regular oneof': {input: undefined, expect: undefined},
        },
        'enum_field': {
            'null reads to 0 like regular oneof': {input: null, expect: 0},
            'undefined reads to undefined like regular oneof': {input: undefined, expect: undefined},
        },
    },
    jsonWrites: {
        'string_field': {
            'undefined writes to undefined like regular oneof': {input: undefined, expect: undefined},
        },
        'enum_field': {
            'undefined writes to undefined like regular oneof': {input: undefined, expect: undefined},
        },
    },
});


const Proto3OptionalsMessage_TestMessage = new MessageType<any>("spec.Proto3OptionalsMessage.TestMessage", [
    {no: 1, name: "field", kind: "scalar", T: 9 /*string*/}
]);

enum Proto3OptionalsMessage_TestEnum {
    ANY = 0,
    YES = 1,
    NO = 2,
}

