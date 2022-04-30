import type { Fixture } from "./index";

const f: Fixture[] = [];
export default f;

f.push({
  typeName: "spec.EnumFieldMessage",
  fields: [
    { no: 1, name: "enum_field", kind: "enum", T: () => [".spec.SimpleEnum", SimpleEnum] },
    {
      no: 2,
      name: "repeated_enum_field",
      repeat: 1,
      kind: "enum",
      T: () => [".spec.SimpleEnum", SimpleEnum]
    },
    /*{ no: 3, name: "alias_enum_field", kind: "enum", T: () => [".spec.AliasEnum", AliasEnum] },*/
    { no: 4, name: "prefix_enum_field", kind: "enum", T: () => [".spec.PrefixEnum", PrefixEnum, "PREFIX_ENUM_"] },
  ],
  messages: {
    "default": {
      enumField: "ANY",
      repeatedEnumField: [],
      // aliasEnumField: 0,
      prefixEnumField: "ANY",
    },
    /*"example": {
      enumField: 1,
      repeatedEnumField: [0, 1, 2],
      aliasEnumField: 1,
      prefixEnumField: 2,
    },*/
    "example": {
      enumField: "YES",
      repeatedEnumField: ["ANY", "YES", "NO"],
      // aliasEnumField: "B",
      prefixEnumField: "NO",
    },
  },
  json: {
    "default": {},
    "nulls equalling defaults": {
      enumField: null,
      repeatedEnumField: null,
      // aliasEnumField: null,
      prefixEnumField: null,
    },
    "example": {
      enumField: "YES",
      repeatedEnumField: ["ANY", "YES", "NO"],
      // aliasEnumField: "C",
      prefixEnumField: "PREFIX_ENUM_NO",
    },
  },
  jsonReads: {
    "enum_field": {
      "1 reads as YES": { input: 1, expect: "YES" },
      "\"YES\" reads as YES": { input: "YES", expect: "YES" },
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
      "enumAsInteger:true int input": { input: 1, expect: 1, options: { enumAsInteger: true } },
      "enumAsInteger:true string": { input: "YES", expect: 1, options: { enumAsInteger: true } },
      "emitDefaultValues:true": { input: 0, expect: "ANY", options: { emitDefaultValues: true } },
      "emitDefaultValues:false": { input: 0, expect: undefined, options: { emitDefaultValues: false } },
    },
  },

});


enum SimpleEnum {
  ANY = "ANY",
  YES = "YES",
  NO = "NO",
}

/*enum AliasEnum {
  A = 0,
  B = 1,
  C = 1,
}*/

enum PrefixEnum {
  ANY = "ANY",
  YES = "YES",
  NO = "NO",
}
