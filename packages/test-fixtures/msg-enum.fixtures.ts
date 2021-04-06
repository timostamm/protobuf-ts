import type {Fixture} from "./index";

const f: Fixture[] = [];
export default f;

f.push({
    typeName: "spec.EnumFieldMessage",
    fields: [
        {no: 1, name: "enum_field", kind: "enum", T: () => [".spec.SimpleEnum", SimpleEnum]},
        {
            no: 2,
            name: "repeated_enum_field",
            repeat: 1,
            kind: "enum",
            T: () => [".spec.SimpleEnum", SimpleEnum]
        },
        {no: 3, name: "alias_enum_field", kind: "enum", T: () => [".spec.AliasEnum", AliasEnum]},
        {no: 4, name: "prefix_enum_field", kind: "enum", T: () => [".spec.PrefixEnum", PrefixEnum, "PREFIX_ENUM_"]},
    ],
    messages: {
        "default": {
            enumField: 0,
            repeatedEnumField: [],
            aliasEnumField: 0,
            prefixEnumField: 0,
        },
        "example": {
            enumField: 1,
            repeatedEnumField: [0, 1, 2],
            aliasEnumField: 1,
            prefixEnumField: 2,
        },
    },
    json: {
        "default": {},
        "nulls equalling defaults": {
            enumField: null,
            repeatedEnumField: null,
            aliasEnumField: null,
            prefixEnumField: null,
        },
        "example": {
            enumField: "YES",
            repeatedEnumField: ["ANY", "YES", "NO"],
            aliasEnumField: "C",
            prefixEnumField: "PREFIX_ENUM_NO",
        },
    },
    jsonReads: {
        "enum_field": {
            "1 reads as 1": {input: 1, expect: 1},
            "\"YES\" reads as 1": {input: "YES", expect: 1},
        },
    },
    jsonReadErrors: {
        "repeated_enum_field": {
            "null fails to parse": {
                input: [null],
                expect: /Cannot parse JSON null for /
            }
        },
    },
    jsonWrites: {
        "enum_field": {
            "enumAsInteger:true": {input: 1, expect: 1, options: {enumAsInteger: true}},
            "emitDefaultValues:true": {input: 0, expect: "ANY", options: {emitDefaultValues: true}},
            "emitDefaultValues:false": {input: 0, expect: undefined, options: {emitDefaultValues: false}},
        },
    },

});


enum SimpleEnum {
    ANY = 0,
    YES = 1,
    NO = 2,
}

enum AliasEnum {
    A = 0,
    B = 1,
    C = 1,
}

enum PrefixEnum {
    ANY = 0,
    YES = 1,
    NO = 2,
}
