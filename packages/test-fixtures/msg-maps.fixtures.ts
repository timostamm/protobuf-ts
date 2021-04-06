import type {Fixture} from "./index";
import {MessageType} from "@protobuf-ts/runtime";

const f: Fixture[] = [];
export default f;

f.push({
    typeName: "spec.ScalarMapsMessage",
    fields: [
        {no: 1, name: "str_str_field", kind: "map", K: 9 /*string*/, V: {kind: "scalar", T: 9 /*string*/}},
        {no: 2, name: "str_int32_field", kind: "map", K: 9 /*string*/, V: {kind: "scalar", T: 5 /*int32*/}},
        {no: 3, name: "str_int64_field", kind: "map", K: 9 /*string*/, V: {kind: "scalar", T: 3 /*int64*/}},
        {no: 4, name: "str_bool_field", kind: "map", K: 9 /*string*/, V: {kind: "scalar", T: 8 /*bool*/}},
        {no: 5, name: "str_bytes_field", kind: "map", K: 9 /*string*/, V: {kind: "scalar", T: 12 /*bytes*/}},
        {no: 6, name: "int32_str_field", kind: "map", K: 5 /*int32*/, V: {kind: "scalar", T: 9 /*string*/}},
        {no: 7, name: "int64_str_field", kind: "map", K: 3 /*int64*/, V: {kind: "scalar", T: 9 /*string*/}},
        {no: 8, name: "bool_str_field", kind: "map", K: 8 /*bool*/, V: {kind: "scalar", T: 9 /*string*/}},
    ],
    messages: {
        "default": {
            strStrField: {},
            strInt32Field: {},
            strInt64Field: {},
            strBoolField: {},
            strBytesField: {},
            int32StrField: {},
            int64StrField: {},
            boolStrField: {},
        },
        "example": {
            strStrField: {"a": "str", "b": "xx"},
            strInt32Field: {"a": 123, "b": 455},
            strInt64Field: {"a": "123"},
            strBoolField: {"a": true, "b": false},
            strBytesField: {"a": new Uint8Array([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100])},
            int32StrField: {123: "hello"},
            int64StrField: {"9223372036854775807": "hello"},
            boolStrField: {"true": "yes", "false": "no"},
        },
        "empty-values": {
            strStrField: {"a": ""},
            strInt32Field: {"a": 0},
            strInt64Field: {"a": "0"},
            strBoolField: {"a": false},
            strBytesField: {"a": new Uint8Array(0)},
            int32StrField: {123: ""},
            int64StrField: {"9223372036854775807": ""},
            boolStrField: {"true": "", "false": ""},
        },
        "empty-keys": {
            strStrField: {"": "str"},
            strInt32Field: {"": 123},
            strInt64Field: {"": "123"},
            strBoolField: {"": true},
            strBytesField: {"": new Uint8Array([104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100])},
            int32StrField: {0: "str"},
            int64StrField: {"0": "str"},
            boolStrField: {"false": ""},
        },
    },
    json: {
        "default": {},
        "nulls equalling defaults": {
            strStrField: null,
            strInt32Field: null,
            strInt64Field: null,
            strBoolField: null,
            strBytesField: null,
            int32StrField: null,
            int64StrField: null,
            boolStrField: null,
        },
        "example": {
            strStrField: {"a": "str", "b": "xx"},
            strInt32Field: {"a": 123, "b": 455},
            strInt64Field: {"a": "123"},
            strBoolField: {"a": true, "b": false},
            strBytesField: {"a": "aGVsbG8gd29ybGQ="},
            int32StrField: {"123": "hello"},
            int64StrField: {"9223372036854775807": "hello"},
            boolStrField: {"true": "yes", "false": "no"},
        },
        "empty-values": {
            strStrField: {"a": ""},
            strInt32Field: {"a": 0},
            strInt64Field: {"a": "0"},
            strBoolField: {"a": false},
            strBytesField: {"a": ""},
            int32StrField: {"123": ""},
            int64StrField: {"9223372036854775807": ""},
            boolStrField: {"true": "", "false": ""},
        },
        "empty-keys": {
            strStrField: {"": "str"},
            strInt32Field: {"": 123},
            strInt64Field: {"": "123"},
            strBoolField: {"": true},
            strBytesField: {"": "aGVsbG8gd29ybGQ="},
            int32StrField: {"0": "str"},
            int64StrField: {"0": "str"},
            boolStrField: {"false": ""},
        },
    },
    jsonReads: {
    },
    jsonReadErrors: {
        "int32_str_field": {
            "key is not a number": {
                input: {"not-a-number": "hello"},
                expect: /.+/
            },
        },
        "str_str_field": {
            "null entry is scalar default value": {
                input: {"a": null},
                expect: /Cannot parse JSON null for .+ map value/
            },
        }
    },
});

f.push({
    typeName: "spec.MessageMapMessage",
    fields: [
        // @formatter:off
            { no: 1, name: "str_msg_field", kind: "map", K: 9 /*string*/, V: { kind: "message", T: () => MessageMapMessage_MyItem } },
            { no: 2, name: "int32_msg_field", kind: "map", K: 5 /*int32*/, V: { kind: "message", T: () => MessageMapMessage_MyItem } },
            { no: 3, name: "int64_msg_field", kind: "map", K: 3 /*int64*/, V: { kind: "message", T: () => MessageMapMessage_MyItem } }
            // @formatter:on
    ],
    messages: {
        "default": {
            strMsgField: {},
            int32MsgField: {},
            int64MsgField: {},
        },
        "example": {
            strMsgField: {
                a: {text: "foo"}
            },
            int32MsgField: {
                32: {text: "bar"}
            },
            int64MsgField: {
                64: {text: "zeh"}
            },
        },
    },
    json: {
        "default": {},
        "nulls equalling defaults": {
            strMsgField: null,
            int32MsgField: null,
            int64MsgField: null,
        },
        "example": {
            strMsgField: {
                "a": {"text": "foo"}
            },
            int32MsgField: {
                "32": {"text": "bar"}
            },
            int64MsgField: {
                "64": {"text": "zeh"}
            },
        },
    },
    jsonReadErrors: {
        "str_msg_field": {
            "null message entry is empty": {
                input: {"a": null},
                expect: /Cannot parse JSON null for .+ map value/
            },
        }
    },
    jsonWrites: {
        "str_msg_field": {
            "emitDefaultValues:true": {input: {}, expect: {}, options: {emitDefaultValues: true}}
        }
    }
});

f.push({
    typeName: "spec.EnumMapMessage",
    fields: [
        // @formatter:off
            { no: 1, name: "str_enu_field", kind: "map", K: 9 /*string*/, V: { kind: "enum", T: () => ["spec.EnumMapMessage.MyEnum", EnumMapMessage_MyEnum] } },
            { no: 2, name: "int32_enu_field", kind: "map", K: 5 /*int32*/, V: { kind: "enum", T: () => ["spec.EnumMapMessage.MyEnum", EnumMapMessage_MyEnum] } },
            { no: 3, name: "int64_enu_field", kind: "map", K: 3 /*int64*/, V: { kind: "enum", T: () => ["spec.EnumMapMessage.MyEnum", EnumMapMessage_MyEnum] } }
            // @formatter:on
    ],
    messages: {
        "default": {
            strEnuField: {},
            int32EnuField: {},
            int64EnuField: {},
        },
        "example": {
            strEnuField: {"a": 0, "b": 1, "c": 2},
            int32EnuField: {1: 0, 2: 1, 0: 2},
            int64EnuField: {"-1": 0, "2": 1, "0": 2},
        },
    },
    json: {
        "default": {},
        "nulls equalling defaults": {
            strEnuField: null,
            int32EnuField: null,
            int64EnuField: null,
        },
    },

});


enum EnumMapMessage_MyEnum {
    ANY = 0,
    YES = 1,
    NO = 2,
}

const MessageMapMessage_MyItem = new MessageType<any>("spec.MessageMapMessage.MyItem", [
    {no: 1, name: "text", kind: "scalar", T: 9 /*string*/}
]);
