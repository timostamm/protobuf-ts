protobuf-ts manual
==================


## Table of Contents

- [What are protocol buffers](#what-are-protocol-buffers)
- [What is protobuf-ts](#what-is-protobuf-ts)
- [The protoc plugin](#the-protoc-plugin)
- [Generated code](#generated-code)
- [IMessageType](#imessagetype)
  - [Message type guards](#message-type-guards)
- [Enum representation](#enum-representation)
- [Oneof representation](#oneof-representation)
- [BigInt support](#bigint-support)
- [proto3 optionals](#proto3-optionals)
- [proto2 support](#proto2-support)
- [Well-known-types](#well-known-types)
  - [google.protobuf.Any](#googleprotobufany)
  - [google.protobuf.Timestamp](#googleprotobuftimestamp)
  - [google.protobuf.Struct](#googleprotobufstruct)
  - [google.type.Color](#googletypecolor)
  - [google.type.DateTime and google.type.Date](#googletypedatetime-and-googletypedate)
- [Reflection](#reflection)
  - [Field information](#field-information)
- [Custom options](#custom-options)
  - [Creating your own custom options](#creating-your-own-custom-options)
  - [Excluding options from generated code](#excluding-options-from-generated-code)
- [Binary format](#binary-format)
  - [Conformance](#conformance)
  - [UTF-8 decoding](#utf-8-decoding)
  - [Unknown field handling](#unknown-field-handling)
- [JSON format](#json-format)
- [Code size vs speed](#code-size-vs-speed)
- [Running in the Web Browser](#running-in-the-web-browser)
- [Running in Node.js](#running-in-nodejs)
- [Outputting JavaScript](#outputting-javascript)
- [RPC support](#rpc-support)
- [Generic RPC clients](#generic-rpc-clients)
  - [RPC options](#rpc-options)
  - [RPC method types](#rpc-method-types)
  - [RPC transports](#rpc-transports)
- [gRPC web transport](#grpc-web-transport)
- [Twirp transport](#twirp-transport)
- [gRPC transport](#grpc-transport)
- [Native gRPC server](#native-grpc-server)
- [Native gRPC client](#native-grpc-client)
- [Generic RPC servers](#generic-rpc-servers)




## What are protocol buffers

Protocol buffers is an [interface definition language](https://en.wikipedia.org/wiki/Interface_description_language)
and binary serialization format.  
Data structures defined in `.proto` files are platform-independent and can
be used in many languages.  
To learn more about the capabilities, please check the
official [language guide](https://developers.google.com/protocol-buffers/docs/overview).


## What is protobuf-ts

`protobuf-ts` consists of a protoc plugin to generate TypeScript from `.proto` definition 
files, and several runtime libraries used by the generated code to keep the code size small. 

The generated code has no dependencies besides the runtime (@protobuf-ts/runtime) and 
strictly conforms to the protobuf spec. 

The available packages are listed [here](./packages/) - but you probably want to 
start with the plugin `@protobuf-ts/plugin`. 


## The protoc plugin

Installation:
```shell script
# with npm:
npm install @protobuf-ts/plugin

# with yarn:
yarn add @protobuf-ts/plugin
```

This will install the plugin as a dependency in your package.

You'll also need a Protobuf compiler, such as `protoc`:

```shell script
npm install protoc
```

Usage:
```shell script
npx protoc \
  --ts_out src/generated/ \
  --ts_opt long_type_string \
  --proto_path protos \
  protos/my.proto 
```


> **Note:** The generated code requires a runtime package. Install it with:
> ```shell script
> # with npm:
> npm install @protobuf-ts/runtime
> 
> # with yarn:
> yarn add @protobuf-ts/runtime
> ```


> **Note:** By default, the plugin only generates code for the .proto 
> files you pass as arguments to protoc. If you want to generate code 
> for imported files as well, use the plugin option "generate_dependencies".
> 
> ```shell script
> --ts_opt generate_dependencies
> ```


Available plugin options:

- "long_type_string"  
  Sets jstype = JS_STRING for message fields with 64 bit integral values.
  The default behaviour is to use native `bigint`.
  Only applies to fields that do *not* use the option `jstype`.

- "long_type_number"  
  Sets jstype = JS_NUMBER for message fields with 64 bit integral values.
  The default behaviour is to use native `bigint`.
  Only applies to fields that do *not* use the option `jstype`.

- "long_type_bigint"  
  Sets jstype = JS_NORMAL for message fields with 64 bit integral values.
  This is the default behavior.
  Only applies to fields that do *not* use the option `jstype`.

- "generate_dependencies"  
  By default, only the PROTO_FILES passed as input to protoc are generated,
  not the files they import (with the exception of well-known types which are 
  always generated when imported).
  Set this option to generate code for dependencies too.

- "force_exclude_all_options"  
  By default, custom options are included in the metadata and can be blacklisted
  with our option (ts.exclude_options). Set this option if you are certain you
  do not want to include any options at all.

- "keep_enum_prefix"  
  By default, if all enum values share a prefix that corresponds with the enum's
  name, the prefix is dropped from the value names. Set this option to disable
  this behavior.

- "use_proto_field_name"
  By default interface fields use lowerCamelCase names by transforming proto field
  names to follow common style convention for TypeScript. Set this option to preserve
  original proto field names in generated interfaces.

- "ts_nocheck"  
  Generate a @ts-nocheck annotation at the top of each file. This will become the
  default behaviour in the next major release.

- "disable_ts_nocheck"  
  Do not generate a @ts-nocheck annotation at the top of each file. Since this is
  the default behaviour, this option has no effect.

- "eslint_disable"
  Generate a eslint-disable comment at the top of each file. This will become the
  default behaviour in the next major release.

- "no_eslint_disable"
  Do not generate a eslint-disable comment at the top of each file. Since this is
  the default behaviour, this option has no effect.

- "add_pb_suffix"  
  Adds the suffix `_pb` to the names of all generated files. This will become the
  default behaviour in the next major release.

- "output_typescript"  
  Output TypeScript files. This is the default behavior.

- "output_javascript"  
  Output JavaScript for the currently recommended target ES2020. The target may
  change with a major release of protobuf-ts.
  Along with JavaScript files, this always outputs TypeScript declaration files.

- "output_javascript_es2015"  
  Output JavaScript for the ES2015 target.

- "output_javascript_es2016"  
  Output JavaScript for the ES2016 target.

- "output_javascript_es2017"  
  Output JavaScript for the ES2017 target.

- "output_javascript_es2018"  
  Output JavaScript for the ES2018 target.

- "output_javascript_es2019"  
  Output JavaScript for the ES2019 target.

- "output_javascript_es2020"  
  Output JavaScript for the ES2020 target.

- "output_legacy_commonjs"  
  Use CommonJS instead of the default ECMAScript module system.

- "client_none"  
  Do not generate rpc clients.
  Only applies to services that do *not* use the option `ts.client`.
  If you do not want rpc clients at all, use `force_client_none`.

- "client_generic"  
  Only applies to services that do *not* use the option `ts.client`.
  Since GENERIC_CLIENT is the default, this option has no effect.

- "client_grpc1"  
  Generate a client using @grpc/grpc-js (major version 1).
  Only applies to services that do *not* use the option `ts.client`.

- "force_client_none"  
  Do not generate rpc clients, ignore options in proto files.

- "server_none"  
  Do not generate rpc servers.
  This is the default behaviour, but only applies to services that do
  *not* use the option `ts.server`.
  If you do not want servers at all, use `force_server_none`.

- "server_generic"  
  Generate a generic server interface. Adapters are used to serve the service,
  for example @protobuf-ts/grpc-backend for gRPC.
  Note that this is an experimental feature and may change with a minor release.
  Only applies to services that do *not* use the option `ts.server`.

- "server_grpc1"  
  Generate a server interface and definition for use with @grpc/grpc-js
  (major version 1).
  Only applies to services that do *not* use the option `ts.server`.

- "force_server_none"  
  Do not generate rpc servers, ignore options in proto files.

- "force_disable_services"  
  Do not generate anything for service definitions, and ignore options in proto
  files. This is the same as setting both options `force_server_none` and
  `force_client_none`, but also stops generating service metadata.

- "optimize_speed"  
  Sets optimize_for = SPEED for proto files that have no file option
  'option optimize_for'. Since SPEED is the default, this option has no effect.

- "optimize_code_size"  
  Sets optimize_for = CODE_SIZE for proto files that have no file option
  'option optimize_for'.

- "force_optimize_code_size"  
  Forces optimize_for = CODE_SIZE for all proto files, ignore file options.

- "force_optimize_speed"  
  Forces optimize_for = SPEED for all proto files, ignore file options.



## Generated code

For the following `msg-readme.proto`:
```proto
syntax = "proto3";

option optimize_for = CODE_SIZE;

// A very simple protobuf message.
message Person {
    string name = 1;
    uint64 id = 2;
    int32 years = 3 [json_name = "baz"];
    // maybe a jpeg?
    optional bytes data = 5;
}
```

`protobuf-ts` generates the following `msg-readme.ts`:

```typescript
// @generated by protobuf-ts 1.0.0-alpha.30 with parameter optimize_code_size,generate_dependencies
// @generated from protobuf file "msg-readme.proto" (syntax proto3)
// tslint:disable
import { LongType } from "@protobuf-ts/runtime";
import { ScalarType } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * A very simple protobuf message.
 *
 * @generated from protobuf message Person
 */
export interface Person {
    /**
     * @generated from protobuf field: string name = 1;
     */
    name: string;
    /**
     * @generated from protobuf field: uint64 id = 2;
     */
    id: bigint;
    /**
     * @generated from protobuf field: int32 years = 3 [json_name = "baz"];
     */
    years: number;
    /**
     * maybe a jpeg?
     *
     * @generated from protobuf field: optional bytes data = 5;
     */
    data?: Uint8Array;
}
/**
 * Type for protobuf message Person
 */
class Person$Type extends MessageType<Person> {
    constructor() {
        super("Person", [
            { no: 1, name: "name", kind: "scalar", T: ScalarType.STRING },
            { no: 2, name: "id", kind: "scalar", T: ScalarType.UINT64, L: LongType.BIGINT },
            { no: 3, name: "years", kind: "scalar", jsonName: "baz", T: ScalarType.INT32 },
            { no: 5, name: "data", kind: "scalar", opt: true, T: ScalarType.BYTES }
        ]);
    }
}
export const Person = new Person$Type();
```

> **TypeScript compatibility**  
> The generated code requires TypeScript version 3.8.3 or above.  
> The code is intended to be used with the strict compiler options turned on (`"strict": true`).  
> `"strictNullChecks": true` is required for some features to work.


Some things to note:

- Protobuf messages are generated as TypeScript interfaces. This means that 
  any object can be a `Person`, as long as it implements the `Person` 
  interface. The following code creates a valid message: 
  ```typescript
  let pete: Person = {
    name: "Peter",
    id: 18446744073709551615n,
    years: 30, 
  };
  ```

- A `const Person` is exported. This object implements the `IMessageType` 
  interface, which is your API to work with messages. Read more about 
  `IMessageType` [below](#imessagetype).

- Every output file has a header that includes the plugin version number and 
  plugin parameter (options joined by comma) used to generate this file, as 
  well as the source file name, package name and syntax.

- Every protobuf message, field, and most other elements have a `@generated` 
  annotation with information about the source.  

- Comments from the `.proto` are copied to the `.ts` file.

- The field `optional data` has a question mark in TypeScript. This is the 
  language feature [proto3 optionals](#proto3-optionals).

- The `uint64` field is represented as JavaScript `bigint`. 
  You can control whether 64 bit types should be represented as `bigint`, 
  `string` or `number`. This is the [BigInt support](#bigint-support) of 
  `protobuf-ts`. 

- The generated code compiles with TypeScript compiler target ES2015 or later. 
  But if you use `bigint`, you need ES2020.  

- The file option `optimize_for = CODE_SIZE` was set. `protobuf-ts` 
  understands this option and uses reflection for all operations, reducing  
  the code size.   
  If you set `optimize_for = SPEED`, `protobuf-ts` generates some additional 
  methods to speed up serialization.   
  Learn more about [code size vs speed](#code-size-vs-speed).

- If you mark a protobuf field or other element deprecated with the option 
  `[deprecated = true]`, the corresponding TypeScript element is marked 
  with a `@deprecated` annotation. 

- If you declare a protobuf `enum`, a TypeScript enum is generated. 
  Learn more about the [enum representation](#enum-representation). 

- If you declare a protobuf `oneof`, a special property is generated 
  that ensures that only one member field is set. Learn more about the 
  [oneof representation](#oneof-representation).

- If you declare a protobuf `service`, a service client is generated. 
  Learn more about [RPC support](#rpc-support). 

- If you use a message from the `google.protobuf` namespace, a special 
  `IMessageType` is generated, which implements the custom JSON format 
  and may provide some convenience methods. For some messages from the 
  `google.type` namespace, convenience methods are available as well.   
  Learn more about [Well-known-types](#well-known-types). 



## IMessageType

The `IMessageType` interface provides the following methods:

- `create(): T`
  
  Create a new message with default values.
  
  For example, a protobuf `string name = 1;` has the default value `""`.


- `create(value: PartialMessage<T>): T`
  
  Create a new message from partial data.  
  Where a field is omitted, the default value is used.  
    
  Unknown fields are discarded.  
    
  `PartialMessage<T>` is similar to `Partial<T>`,
  but it is recursive, and it keeps `oneof` groups
  intact.
  

- `fromBinary(data: Uint8Array, options?: Partial<BinaryReadOptions>): T`
  
  Create a new message from binary format.   
  Learn more about the [binary format](#binary-format) and options.


- `toBinary(message: T, options?: Partial<BinaryWriteOptions>): Uint8Array`
  
  Write the message to binary format.


- `fromJson(json: JsonValue, options?: Partial<JsonReadOptions>): T`
  
  Read a new message from a JSON value.  
  Learn more about the [JSON format](#json-format) and options.
  
  
- `fromJsonString(json: string, options?: Partial<JsonReadOptions>): T`
  
  Read a new message from a JSON string.  
  This is equivalent to `T.fromJson(JSON.parse(json))`.


- `toJson(message: T, options?: Partial<JsonWriteOptions>): JsonValue`
  
  Write the message to canonical JSON value.


- `toJsonString(message: T, options?: Partial<JsonWriteStringOptions>): string`
  
  Convert the message to canonical JSON string.  
  This is equivalent to `JSON.stringify(T.toJson(t))`


- `clone(message: T): T`
  
  Clone the message.  
  Unknown fields are discarded.


- `mergePartial(target: T, source: PartialMessage<T>): void`
  
  Copy partial data into the target message.
  
  If a singular scalar or enum field is present in the source, it
  replaces the field in the target.
  
  If a singular message field is present in the source, it is merged
  with the target field by calling mergePartial() of the responsible
  message type.
  
  If a repeated field is present in the source, its values replace
  all values in the target array, removing extraneous values.
  Repeated message fields are copied, not merged.
  
  If a map field is present in the source, entries are added to the
  target map, replacing entries with the same key. Entries that only
  exist in the target remain. Entries with message values are copied,
  not merged.
  
  Note that this function differs from protobuf merge semantics,
  which appends repeated fields.


- `equals(a: T, b: T): boolean`
  
  Determines whether two message of the same type have the same field values.
  Checks for deep equality, traversing repeated fields, oneof groups, maps
  and messages recursively.
  Accepts `undefined` for convenience, but will return false if one or both 
  arguments are undefined.


- `is(arg: any, depth?: number): arg is T`
  
  Is the given value assignable to our message type 
  and contains no excess properties?  
  Learn more about the [Message type guards](#message-type-guards).


- `isAssignable(arg: any, depth?: number): arg is T`
  
  Is the given value assignable to our message type, 
  regardless of excess properties?  
  Learn more about the [Message type guards](#message-type-guards).


The `IMessageType` also provides [reflection information](#reflection) 
with the properties `typeName`, `fields` and `options`.  


#### Message type guards

The `IMessageType` provides two type guards for every message:

- `is(arg: any, depth?: number): arg is T`
  
  Is the given value assignable to our message type 
  and contains no excess properties?
  
- `isAssignable(arg: any, depth?: number): arg is T`
  
  Is the given value assignable to our message type, 
  regardless of excess properties?  


Both methods are [Type Guards](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards), 
and let the compiler know about the type. Example:

```ts
let message: unknown;
if (MyMessage.is(message)) {
    message.hello // the type of `message` is not `unknown` anymore
} 
```


> **Note:** `is()` checks for [excess properties](https://www.typescriptlang.org/docs/handbook/interfaces.html#excess-property-checks).
> `isAssignable()` ignores them.


> **Note:** `is()` is different from `instanceof`. 
> If two message have the same fields, `is()` returns true for both.




## Enum representation

`protobuf-ts` uses TypeScript enums to represent protobuf enums. 

From the following `.proto`:

```proto
enum MyEnum {
    ANY = 0;
    YES = 1;
    NO = 2;
}
```

`protobuf-ts` generates:

```typescript
enum MyEnum {
    /**
     * @generated from protobuf enum value: ANY = 0;
     */
    ANY = 0,
    /**
     * @generated from protobuf enum value: YES = 1;
     */
    YES = 1,
    /**
     * @generated from protobuf enum value: NO = 2;
     */
    NO = 2
}
```

If all enum values share a prefix that corresponds with the enum's name, 
the prefix is dropped from all enum value names. For example, for the 
following `.proto`

 ```proto
enum Foo {
    FOO_BAR = 0;
    FOO_BAZ = 1;
}
enum MooFoo {
    MOO_FOO_BAR = 0;
    MOO_FOO_BAZ = 1;
}
 ```

The prefix "FOO_" and "MOO_FOO" are dropped in TypeScript (unless `keep_enum_prefix` option is provided to the plugin):

 ```typescript
enum Foo {
    BAR = 0,
    BAZ = 1
}
enum MooFoo {
    BAR = 0,
    BAZ = 1
}
 ```




A quick reminder about TypeScript enums:

- It is possible to lookup the name for an enum value:
  ```typescript
  let val: MyEnum = MyEnum.YES;
  let name = MyEnum[val]; // => "YES"
  ``` 
 
- and to lookup an enum value by name:
  ```typescript
  let val: MyEnum = MyEnum["YES"];
  ``` 

TypeScript enums also support aliases (as does protobuf with the `allow_alias` 
option), so they are a good fit to represent protobuf enums, despite their 
idiosyncrasies. 


`protobuf-ts` provides the following functions to work with TypeScript enum objects:

- `listEnumNames(enumObj: any): string[]`
  
  Lists the names of a Typescript enum.  
  `["ANY", "YES", "NO"]` for the enum above.

  
- `listEnumNumbers(enumObj: any): number[]`
  
  Lists the numbers of a Typescript enum.  
  `[0, 1, 2]` for the enum above.
  
  
- `listEnumValues(enumObj: any): Array<{name: string, number: number}>`
  
  Lists all values of a Typescript enum, as an array of objects with a "name"
  property and a "number" property.
  
  `[{name: "ANY", number: 0}, {name: "YES", number: 1}, {name: "NO", number: 2}]` for the enum above.
  
  > **Note:** it is possible that a number appears more than once if you 
  > use enum aliases. 
  



## Oneof representation

`protobuf-ts` uses an algebraic data type for oneof groups. The following 
`.proto`:

```proto
message OneofExample {
 // Only one of (or none of) the fields can be set
 oneof result { 
   int32 value = 1;
   string error = 2;
 }
}
```
Compiles the `oneof` group to a union type that ensures that only one member 
field is set:
```ts   
interface OneofExample {
 result: { oneofKind: "value"; value: number; } 
       | { oneofKind: "error"; error: string; } 
       | { oneofKind: undefined; };
}

let message: OneofExample;
if (message.result.oneofKind === "value") {
 message.result.value // the union has been narrowed down
}
```

> **Note:** This feature requires the TypeScript compiler option `strictNullChecks` 
> to be true. The option is enabled by default if you set the option `strict` to 
> true, which is recommended. See the [documentation](https://www.typescriptlang.org/tsconfig#strictNullChecks) for details.


## BigInt support

Protocol buffers have signed and unsigned 64 bit integral types. `protobuf-ts` 
gives you the following options to represent those `.proto` types in TypeScript:

1. `bigint`  
   Enabled by default. Lets you use the standard JavaScript operators.  
 
2. `string`  
   Enabled by setting the option `[jstype = JS_STRING]` on a field , or 
   by setting the [plugin option](#the-protoc-plugin) "long_type_string".  

3. `number`  
   Enabled by setting the field option `[jstype = JS_NUMBER]`.   


> **Note:** Use the `string` representation if you target browsers.  
> BigInt is still not fully supported in Safari as of November 2020. 
> Safari 14 adds BigInt support, but its DataView implementation is missing 
> the necessary BigInt methods.

> **Note:** Using `number` is not recommended.  
> JavaScript numbers do not cover the range of all possible 64 bit integral 
> values. 

> **Note:** `bigint` requires target ES2020 in your tsconfig.json and you 
> need Node.js 14.5.0 or higher. 



#### Changing the long representation

For example, the following .proto:

```proto
message LongTypes {
    int64 normal = 1;
    int64 string = 2 [jstype = JS_STRING];
    int64 number = 3 [jstype = JS_NUMBER];
}
```

Generates the following TypeScript: 

```typescript
interface LongTypes {
    normal: bigint; // `bigint` is the "normal" representation
    string: string;
    number: number;
}
```

If you set the plugin option "long_type_string", the following TypeScript is generated:

```typescript
interface LongTypes {
    normal: string; // changed from `bigint` to `string` by --ts_opt long_type_string
    string: string; 
    number: number; // not affected by --ts_opt long_type_string
}
```


#### Arithmetics

For arithmetic across browsers, you need a third party library like the 
excellent [long.js](https://github.com/dcodeIO/Long.js/) or [JSBI](https://github.com/GoogleChromeLabs/jsbi). 

You should use the `string` representation, for example with the plugin 
option "long_type_string". You can then read the string values, make your 
operations and set a string value back on the field: 

```typescript
const myMessage = LongTypes.create({
    string: "9223372036854770000"
});

// using long.js:
let a = Long.fromString(myMessage.string)
let b = a.add(123);
myMessage.string = b.toString();

// using JSBI:
let c = JSBI.BigInt(myMessage.value)
let d = c.add(123);
myMessage.string = d.toString();
```
 



## proto3 optionals

In proto3, scalar fields always have a value, even if you did 
not set one. If you read an `int32` field, you cannot determine 
whether the creator of the message intended to write `0`, or 
if they intentionally left the field out. Both look the same.

The proto3-optionals feature adds a convenient support for 
optional fields by bringing back the `optional` label: 

```proto
syntax = "proto3";
message Proto3Optionals {
  optional int32 sensor_value = 1;
}
```
`protobuf-ts` compiles the field to a simple question-marked property: 
```typescript
interface Proto3Optionals {
  sensorValue?: number;
}
```

> **Note:** this feature was added in `protoc` release [v3.12.0](https://github.com/protocolbuffers/protobuf/releases/tag/v3.12.0).
> You may have to pass the `--experimental_allow_proto3_optional` flag to `protoc`. 



## proto2 support

`protobuf-ts` has partial support for the older proto2 syntax. The support 
is just sufficient to write protoc plugins. 

Note the following restrictions:

1. Extensions (see [language guide](https://developers.google.com/protocol-buffers/docs/proto#extensions))
   are ignored. No code will be generated.
  
   Extension fields can be read like unknown fields. See [unknown field handling](#unknown-field-handling). 

2. Groups (see [language guide](https://developers.google.com/protocol-buffers/docs/proto#groups))
   are ignored by the plugin.  
   No code will be generated. Group fields are treated as unknown fields, 
   see [unknown field handling](#unknown-field-handling).

2. Default field values are not supported  
   A field with the `optional` label and a default option will have the type 
   `myField?: bool` and default value `undefined`.
   
3. `required` label is not supported  
   If a field has the `required` label, the type will be `myField: bool`
   with the default value `false`.

3. Enums without a `0` value  
   The plugin will add the `UNSPECIFIED$ = 0` enum value if no 
   value for 0 is defined. 
  





## Well-known-types

The messages in the `google.protobuf` namespace come with a custom JSON 
mapping. See the "JSON Mapping" section in the official [Language Guide](https://developers.google.com/protocol-buffers/docs/proto3#json). 

`protobuf-ts` implements the custom JSON mapping. It also provides 
convenience methods for some well-known-types and as some types in 
the `google.type` package: 

#### google.protobuf.Any

The `Any` type can contain any message by serializing it into a `bytes` field 
and writing the type name into the `typeUrl` field.  

This means that `protobuf-ts` needs to be able to lookup types by name when 
reading or writing a `Any` message in JSON format. Therefore, `JsonReadOptions` 
and `JsonWriteOptions` both have a `typeRegistry` property that is used to 
lookup types by name. The type registry is just an array of `IMessageType<any>`:

```typescript
Any.toJson(any, {
    typeRegistry: [
       MyMessage, 
       MyOtherMessage
    ]   
})
```

`Any` provides the following custom methods: 

- `pack(message: T, type: IMessageType<T>): Any` 
  
  Pack the message into a new `Any`. 
  
  Uses 'type.googleapis.com/full.type.name' as the type URL.

- `unpack(any: Any, type: IMessageType<T>): T`
  
  Unpack the message from the `Any`.

- `contains(any: Any, type: IMessageType | string): boolean`
  
  Does the given `Any` contain a packed message of the given type?


#### google.protobuf.Timestamp

`Timestamp` provides the following custom methods: 

- `now(): Timestamp`  
  
  Creates a new `Timestamp` for the current time.

- `toDate(message: Timestamp): Date` 
   
  Converts a `Timestamp` to a JavaScript Date.

- `fromDate(date: Date): Timestamp` 
  
  Converts a JavaScript Date to a `Timestamp`.



#### google.protobuf.Struct

`Struct` is a well-known type that can represent all values JSON can represent, 
and maps to simple JSON when serializing to or from JSON.

The definition for `Struct` is a bit complex in order to cover all cases, and 
consequently, constructing instances of this message can be a bit cumbersome.
However, you can simply use `fromJson` and `toJson` to convert between the 
simple JSON representation, and the message representation for convenience:

```ts
let struct = Struct.fromJson({
  "foo": "you can put any JSON here",
  "bar": 123,
});
```


#### google.type.Color

- `toHex(message: Color): string` 
  
  Returns hexadecimal notation of the color: #RRGGBB\[AA]
 
  R (red), G (green), B (blue), and A (alpha) are hexadecimal characters
  (0–9, A–F). A is optional. For example, #ff0000 is equivalent to #ff0000ff.
 
  See https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#RGB_colors

- `fromHex(hex: string): Color`
  
  Parses a hexadecimal color notation.
  
  Recognizes the following forms:
  - three-digit  (#RGB)
  - six-digit (#RRGGBB)
  - four-digit  (#RGBA)
  - eight-digit (#RRGGBBAA)



#### google.type.DateTime and google.type.Date

Both types provide methods to convert to and from JavaScript Dates, similar
to `google.protobuf.Timestamp`.




## Reflection

Reflection is a first-class feature of `protobuf-ts` and should be considered 
a powerful tool for working with messages. 

For example, it is possible to serialize a message to binary format using only 
the reflection information. Other use cases for reflection can be input form 
generation, message comparison algorithms, or transformation into another format 
you may need. 

A message provides reflection information via its `IMessageType`:
```typescript
/**
 * The protobuf type name of the message, including package and
 * parent types if present.
 *
 * Examples:
 * 'MyNamespaceLessMessage'
 * 'my_package.MyMessage'
 * 'my_package.ParentMessage.ChildMessage'
 */
readonly typeName: string;

/**
 * Simple information for each message field, in the order
 * of declaration in the source .proto.
 */
readonly fields: readonly FieldInfo[];

/**
 * Contains custom message options from the .proto source in JSON format.
 */
readonly options: { [extensionName: string]: JsonValue };
``` 


#### Field information

The `FieldInfo` type distinguishes between the following kinds:

- "scalar": string, bool, float, int32, etc.
  See https://developers.google.com/protocol-buffers/docs/proto3#scalar

- "enum": field was declared with an enum type.

- "message": field was declared with a message type.

- "map": field was declared with map<K,V>.


Every field, regardless of it's kind, always has the following properties:

- "no": The field number of the .proto field.
- "name": The original name of the .proto field.
- "localName": The name of the field as used in generated code.
- "jsonName": The name for JSON serialization / deserialization.
- "options": Custom field options from the .proto source in JSON format.


Other properties:

- Fields of kind "scalar", "enum" and "message" can have a "repeat" type.
- Fields of kind "scalar" and "enum" can have a "repeat" type.
- Fields of kind "scalar", "enum" and "message" can be member of a "oneof".

A field can be only have one of the above properties set.

Options for "scalar" fields:

- 64 bit integral types can provide "L" - the JavaScript representation
  type. 


To learn more about reflection, have a look at the types declared in 
`runtime/src/reflection-info.ts` and the source code of the reflection-based 
operations. 

> **Note:** RPC also comes with reflection information. See 
> `runtime-rpc/src/reflection-info.ts`. 


## Custom options

`protobuf-ts` supports custom options for messages, fields, services 
and methods and will add them to the reflection information. 

For example, consider the following service definition in 
[service-annotated.proto](./packages/proto/service-annotated.proto):

```proto
// import the proto that extends google.protobuf.MethodOptions
import "google/api/annotations.proto";

service AnnotatedService {
    rpc Get (Request) returns (Reply) {
        // add an option on the method
        option (google.api.http) = {
            get: "/v1/{name=messages/*}"
            additional_bindings {
                get: "xxx"
            }
            additional_bindings {
                get: "yyy"
            }
        };
    };
}
```

In TypeScript, the service options are available in the "options" 
property as JSON:

```typescript
import {AnnotatedService} from "./service-annotated";
console.log(AnnotatedService.options);
```

```json
{
  "google.api.http": {
    "additionalBindings": [{
      "get": "xxx"
    }, {
      "get": "yyy"
    }],
    "get": "/v1/{name=messages/*}"
  }
}
```

Because the option "google.api.http" is actually a message 
(see [annotations.proto](./packages/proto/google/api/annotations.proto)), 
you can parse the message with this convenience method: 


```typescript
import {AnnotatedService} from "./service-annotated";
import {HttpRule} from "./google/api/annotations";
import {readMethodOption} from "@protobuf-ts/runtime-rpc";

let rule = readMethodOption(AnnotatedService, "get", "google.api.http", HttpRule);
if (rule) {
    let selector: string = rule.selector;
    let bindings: HttpRule[] = rule.additionalBindings;
}
```

If you omit the last parameter to the function, you get the JSON value. 
This is a convenient way to get scalar option values.

```typescript
import {AnnotatedService} from "./service-annotated";
import {readMethodOption} from "@protobuf-ts/runtime-rpc";
import {JsonValue} from "@protobuf-ts/runtime";

let rule: JsonValue | undefined = readMethodOption(AnnotatedService, "get", "google.api.http");
```



| Options for | stored in                             | access with                                         |
|-------------|---------------------------------------|-----------------------------------------------------|
| Messages    | `AnnotatedMessage.options`            | `readMessageOption()` from @protobuf-ts/runtime     |
| Fields      | `AnnotatedMessage.field[0].options`   | `readFieldOption()` from @protobuf-ts/runtime       |
| Services    | `AnnotatedService.options`            | `readServiceOption()` from @protobuf-ts/runtime-rpc |
| Methods     | `AnnotatedService.methods[0].options` | `readMethodOption()` from @protobuf-ts/runtime-rpc  |



#### Creating your own custom options

It is very easy to create custom options. This is the source code for the 
"google.api.http" option:

```proto
// google/api/annotations.proto:

import "google/api/http.proto";
import "google/protobuf/descriptor.proto";

extend google.protobuf.MethodOptions {
  // See `HttpRule`.
  HttpRule http = 72295728;
}
```

As you can see, the option is a standard protobuf field. It can be a message 
field like in the example above, or it can be a scalar, enum or repeated field. 

In .proto, you set options in [text format](https://stackoverflow.com/questions/18873924/what-does-the-protobuf-text-format-look-like/18877167), 
and `protobuf-ts` provides them in the canonical JSON format. 


#### Excluding options from generated code

If you need custom options for some protobuf implementation, but do not 
want to have them included in the TypeScript generated code, use the file 
option `ts.exclude_options`:

```proto
option (ts.exclude_options) = "google.*";
option (ts.exclude_options) = "*.private.*";
```

The example above will exclude field, service and method options that 
match the given wildcard.



## Binary format

`protobuf-ts` supports the binary format with the `IMessageType` methods 
`fromBinary()` and `toBinary()`.  

Example: 

```typescript
let message: MyMessage = {foo: 123};
let bytes: Uint8Array = MyMessage.toBinary(message);
let message2: MyMessage = MyMessage.fromBinary(bytes);
```

The `fromBinary` method takes an optional second argument of type 
`BinaryReadOptions`:

- `readUnknownField: boolean | 'throw' | UnknownFieldReader`
  
    Shall unknown fields be read, ignored or raise an error?  
    `true`: stores the unknown field on a symbol property of the
    message. This is the default behaviour.  
    `false`: ignores the unknown field.  
    `"throw"`: throws an error.  
    `UnknownFieldReader`: Your own behaviour for unknown fields.  
   See [Unknown field handling](#unknown-field-handling) for details.

- `readerFactory: () => IBinaryReader`
  
  Allows to use a custom implementation to parse binary data.


The `toBinary` method takes an optional second argument of type 
`BinaryWriteOptions`:

- `writeUnknownFields: boolean | UnknownFieldWriter`
   
   Shall unknown fields be written back on wire?  
   `true`: unknown fields stored in a symbol property of the message
   are written back. This is the default behaviour.  
   `false`: unknown fields are not written.  
   `UnknownFieldWriter`: Your own behaviour for unknown fields.  
   See [Unknown field handling](#unknown-field-handling) for details.


- `writerFactory: () => IBinaryWriter`
  
  Allows to use a custom implementation to encode binary data.


#### UTF-8 decoding

JavaScript uses UTF-16 for strings, but protobuf uses UTF-8. In order 
to serialize to and from binary data, protobuf-ts converts between the 
encodings with the [TextEncoder / TextDecoder API](https://developer.mozilla.org/en-US/docs/Web/API/Encoding_API). 

Note that the protobuf [language guide](https://developers.google.com/protocol-buffers/docs/proto3#scalar) states:

> A string must always contain UTF-8 encoded or 7-bit ASCII text [...]

If an invalid UTF-8 string is encoded in the binary format, protobuf-ts
will raise an error on decoding through the TextDecoder option `fatal`.
If you do not want that behaviour, use the `readerFactory` option to 
pass your own TextDecoder instance.

As of January 2022, performance of TextDecoder on Node.js falls behind
Node.js' `Buffer`. In order to use `Buffer` to decode UTF-8, use the 
`readerFactory` option:

```ts
const nodeBinaryReadOptions = {
    readerFactory: (bytes: Uint8Array) => new BinaryReader(bytes, {
        decode(input?: Uint8Array): string {
            return input ? (input as Buffer).toString("utf8") : "";
        }
    })
};
MyMessage.fromBinary(bytes, nodeBinaryReadOptions);
```



#### Conformance

`protobuf-ts` strictly conforms to the protobuf spec. It passes all 
required and recommended conformance tests of the [protobuf repository](https://github.com/protocolbuffers/protobuf/blob/3.12.x/conformance/README.md).

The conformance testee is available in `packages/test-generated`. It 
is run several times to test reflection ops and generated code (see 
[code size vs speed](#code-size-vs-speed)) as well as bigint and 
string-based 64 bit integer support (see [Bigint support](#bigint-support)).



#### Unknown field handling

Unknown fields occur when a message has been created with a newer version 
of a proto file, or when proto2 extensions are used (see [proto2 support](#proto2-support)). 

When `protobuf-ts` encounters unknown fields, they are stored in the message 
object and written back when the message is serialized again.

The unknown fields are stored in a symbol property. This property is not 
enumerable, but is picked up by the spread operator, for example. To discard 
unknown fields, you can use `IMessageType.clone(message)`. 

The default behaviour can be changed to ignore unknown fields, throw if 
unknown fields are found, or you can implement your own behaviour, for 
example to log unknown fields. See the `BinaryReadOptions` and 
`BinaryWriteOptions` for details. 

The default behaviour is implemented by the `UnknownFieldHandler`, which 
also exposes some methods to access the hidden fields: 

- `list(message: any, fieldNo?: number): UnknownField[]`  
  List unknown fields stored for the message.  
  > **Note:** There may be multiples fields with the same number.
  
- `last(message: any, fieldNo: number): UnknownField | undefined`  
  Returns the last unknown field by field number.


Let´s say that you receive a message in a new version, where the field 
`int32 added = 22` has been added. The field was set to the value `7777`.  

This is how you find the field value: 

```typescript
let message: OldVersionMessage = OldVersionMessage.fromBinary(newVersionData);

let uf = UnknownFieldHandler.last(message, 22);
if (uf) {
    uf.no; // 22
    uf.wireType; // WireType.Varint

    // use the binary reader to decode the raw data:
    let reader = new BinaryReader(uf.data);
    let addedNumber = reader.int32(); // 7777
}
```



## JSON format

`protobuf-ts` supports the [canonical proto3 JSON format](https://developers.google.com/protocol-buffers/docs/proto3#json)
with all [recommended options](https://developers.google.com/protocol-buffers/docs/proto3#json_options).

To read a message from JSON format, use `IMessageType<T>.fromJson()` or `fromJsonString()`.

Example: 

```typescript
let json = {foo: 123};
let jsonString = '{"foo": 123}';
MyMessage.fromJson(json);
MyMessage.fromJsonString(jsonString);
```

Both methods take an optional second argument "options" of type `JsonReadOptions`:

- `ignoreUnknownFields: boolean`
  
  Ignore unknown fields: Proto3 JSON parser should reject unknown fields
  by default. This option ignores unknown fields in parsing.

- `typeRegistry: IMessageType<any>[]`
  
  This option is required to read [`google.protobuf.Any`](#googleprotobufany) from JSON format.


To write a message in JSON format, use `IMessageType<T>.toJson()` or `toJsonString()`. 

Example: 

```typescript
let msg: MyMessage = {foo: 123n};
let jsonString: string = MyMessage.toJsonString(msg);
let json = MyMessage.toJson(msg);
jsonString = JSON.stringify(json;
```

Both methods take an optional second argument options of type `JsonWriteOptions`:

- emitDefaultValues: `boolean`
  
  Emit fields with default values: Fields with default values are omitted
  by default in proto3 JSON output. This option overrides this behavior
  and outputs fields with their default values.
  
- enumAsInteger: `boolean`
  
  Emit enum values as integers instead of strings: The name of an enum
  value is used by default in JSON output. An option may be provided to
  use the numeric value of the enum value instead.

  
- useProtoFieldName: `boolean`
  
  Use proto field name instead of lowerCamelCase name: By default proto3
  JSON printer should convert the field name to lowerCamelCase and use
  that as the JSON name. An implementation may provide an option to use
  proto field name as the JSON name instead. Proto3 JSON parsers are
  required to accept both the converted lowerCamelCase name and the proto
  field name.
  
- typeRegistry: `IMessageType<any>[]`
  
  This option is required to write [`google.protobuf.Any`](#googleprotobufany)
  to JSON format.

  


## Code size vs speed

`protobuf-ts` can optimize for speed or for code size. 

To optimize for code size, binary format serialization and other operations 
are implemented with reflection. 

To optimize for speed, custom code for each message is generated, with a small 
gain in performance for the cost of some code size.  

The default behaviour is to optimize for speed. The default behaviour can 
be changed by adding the following line below the `syntax` statement: 

```proto
option optimize_for = CODE_SIZE;
``` 
Alternatively, the default behaviour can be changed with [plugin options](#the-protoc-plugin).

`protobuf-ts` compiles to rather small code sizes, even with `optimize_for = SPEED`, 
while retaining all features. The following table shows a comparison between 
several code generators: 

| generator               |                 version | parameter               |     webpack output size |
|-------------------------|------------------------:|-------------------------|------------------------:|
| pbf | 3.2.1 |  | 22,132 b |
| protobuf-ts | 2.0.0-alpha.27 | force_optimize_code_size,long_type_string | 43,082 b |
| ts-proto | 1.81.3 | outputJsonMethods=false,forceLong=string | 67,066 b |
| protobuf-ts | 2.0.0-alpha.27 | force_optimize_speed,long_type_string | 71,552 b |
| ts-proto | 1.81.3 | forceLong=string | 93,698 b |
| protobufjs | 6.11.2 |  | 139,360 b |
| google-protobuf | 3.17.3 | import_style=commonjs,binary | 397,348 b |

The file sizes are calculated by compiling `google/protobuf/descriptor.proto`, 
then packing with webpack in production mode. The source code of the size 
benchmark is located in `packages/benchmarks`. 

Note that ts-proto doesn't support JSON with `outputJsonMethods=false`. pbf has a very limited feature set.


## Running in the Web Browser

`protobuf-ts` works in the browser. The runtime and generated code is compatible 
with all major browsers after Internet Explorer. 

Some older browsers do not provide all types required by `protobuf-ts`, but they 
can be polyfilled quite easily: 

- `TextEncoder` [polyfill](https://github.com/samthor/fast-text-encoding)
- `Symbol.asyncIterator` [polyfill](https://stackoverflow.com/questions/43694281 )
- `globalThis` - [polyfill](https://mathiasbynens.be/notes/globalthis#robust-polyfill)

For the Web Browser, it is recommended to use the `CODE_SIZE` optimization for 
all messages by setting plugin option `--ts_opt optimize_code_size`. Then set the 
file option `optimize_for = SPEED` for files where you can measure a noticeable 
performance increase. See [code size vs speed](#code-size-vs-speed) for a output 
size comparison.



## Running in Node.js

`protobuf-ts` is tested with Node.js version 20.19.4. 

Older versions certainly work, but may not support all features or require polyfills. 
For example, if you target lower than ES2020 to run in an older node version, you 
cannot use bigint.  

If you are using the `grpcweb-transport` or `twirp-transport`, you probably 
have to polyfill the fetch API. See the README files of the transport packages 
for more information.  



## Outputting JavaScript

By default, `protobuf-ts` outputs TypeScript files, but can alternatively output
JavaScript for different runtimes. This might save you an additional build
step, for example if you want to publish the generated code as a npm package.

To output JavaScript, simply set the
[plugin option](#the-protoc-plugin) `output_javascript`, which will output
JavaScript for the recommended target. The recommended target will change with
`protobuf-ts` releases. If you want to stick to a specific target, use
`output_javascript_es2015` for example.

By default, the ECMAScript module system is used. If you are stuck with an
older project that still requires CommonJS, set the plugin option
`output_legacy_commonjs`.


## RPC support

`protobuf-ts` provides several options for RPC clients and servers. By default, 
it generates [generic clients](#generic-rpc-clients) which delegate the method 
calls to a [transport](#rpc-transports) that implements a specific protocol. 

`protobuf-ts` comes with several RPC transport implementations:
- `TwirpFetchTransport` from `@protobuf-ts/twirp-transport` - see [Twirp transport](#twirp-transport)
- `GrpcWebFetchTransport` from `@protobuf-ts/grpcweb-transport` - see [gRPC web transport](#grpc-web-transport)
- `GrpcTransport` from `@protobuf-ts/grpc-transport` - see [gRPC transport](#grpc-transport)

`protobuf-ts` can also generate native [clients for gRPC](#native-grpc-client) and
[servers for gRPC](#native-grpc-server) for the package `@grpc/grpc-js`.

The 3rd party [Twirp TS plugin](https://github.com/hopin-team/twirp-ts) provides 
server side support for the Twirp protocol.

As an experimental feature, `protobuf-ts` provides a contract for 
[generic servers](#generic-rpc-servers) with an adapter for gRPC.  


## Generic RPC clients

For the following service definition:
```proto
service Haberdasher {
  rpc MakeHat(Size) returns (Hat);
}
```

`protobuf-ts` generates a client that can be used like this:

```typescript
// setup a transport and create a client instance
let transport = new TwirpFetchTransport({
    baseUrl: "http://localhost:4200"
});
let client = new HaberdasherClient(transport);

// make a hat
let call = await client.makeHat({ inches: 23 });

// our shiny new hat:
let response: Hat = call.response; 
```

First, `protobuf-ts` generates the following interface:
```typescript
export interface IHaberdasherClient {
    makeHat(request: Size, options?: RpcOptions): UnaryCall<Size, Hat>;
}
```

As you can see, a method with a "lowerCamelCase" name is generated. It takes 
two arguments:
1. "request" - this is the input type of your RPC. The message to send 
   to the server.
2. "options" - [RpcOptions](#rpc-options) for this call. Options can include 
   authentication information, for example.

The methods returns a `UnaryCall`. An "unary" call takes exactly one input 
messsage and returns exactly one output message. It is one of the four 
[RPC method types](#rpc-method-types) available in protocol buffers. 


`protobuf-ts` also generates an implementation for `IHaberdasherClient`, the 
class `HaberdasherClient`. It takes a `RpcTransport` and a `RpcOptions` 
argument. 

To learn about `RpcOptions` and the `RpcTransport` implementations, please 
continue reading.


#### RPC options

Every RPC method call takes an optional "options" argument that can be used 
to add authentication information to the request, for example. 

Every `RpcTransport` should also take an argument of the same type `RpcOptions` 
for default options. 

The options:

- `meta: RpcMetadata`
  
  Meta data for the call.
  
  RPC meta data are simple key-value pairs that usually translate
  directly to HTTP request headers.
  
  If a key ends with `-bin`, it should contain binary data in base64
  encoding, allowing you to send serialized messages.

- `timeout: Date | number`  
  Timeout for the call in milliseconds.  
  If a Date object is given, it is used as a deadline.

- `interceptors: RpcInterceptor[]`
  
  Interceptors can be used to manipulate request and response data.
  The most common use case is adding an "Authorization" header.

- `jsonOptions: Partial<JsonReadOptions & JsonWriteOptions>`
  
  Options for the [JSON wire format](#json-format).  
  To send or receive [`google.protobuf.Any`](#googleprotobufany) in JSON format, you must
  provide `jsonOptions.typeRegistry` so that the runtime can discriminate
  the packed type.

- `binaryOptions: Partial<BinaryReadOptions & BinaryWriteOptions>`
  
  Options for the [binary wire format](#binary-format).

- `abort: AbortSignal`
  
   A signal to cancel a call. Can be created with an [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).  
   The npm package `abort-controller` provides a polyfill for Node.js.


> **Note:** A `RpcTransport` implementation may provide 
> additional options.  


Adding an "Authorization" header using an interceptor: 

```typescript
let options: RpcOptions = {
  interceptors: [
    {
      // adds auth header to unary requests
      interceptUnary(next, method, input, options: RpcOptions): UnaryCall {
        if (!options.meta) {
          options.meta = {};
        }
        options.meta['Authorization'] = 'your bearer token';
        return next(method, input, options);
      }
    }
  ],
};
```

To learn more about interceptors, see the `RpcInterceptor` interface provided by 
`@protobuf-ts/runtime-rpc`.


#### RPC method types

Protocol buffers allow four distinct RPC method types: 

1. unary - exactly one input message, exactly one output message
2. server streaming - exactly one input message, an arbitrary amount of output messages
3. client streaming - an arbitrary amount of input messages, exactly one output message
4. duplex streaming - an arbitrary amount of input and output messages

In `.proto`, the four types look like this:

```proto
service ExampleService {
    rpc Unary (Req) returns (Res);
    rpc ServerStream (Req) returns (stream Res);
    rpc ClientStream (stream Req) returns (Res);
    rpc DuplexStream (stream Req) returns (stream Res);
}
```

`@protobuf-ts/runtime-rpc` provides implementations for each of the four method types, 
but since neither Twirp nor gRPC web support client streaming or duplex streaming calls, 
those types are untested. All four method types share the following properties: 

- `method: MethodInfo`   
  Reflection information about this call.

- `requestHeaders: Readonly<RpcMetadata>`   
  Request headers being sent with the request. Request headers are 
  provided in the `meta` property of the `RpcOptions` passed to a call.

- `headers: Promise<RpcMetadata>`   
  The response headers that the server sent. This promise will reject with a `RpcError` 
  when the server sends an error status code.

- `status: Promise<RpcStatus>`   
  The response status the server replied with.
  This promise will resolve when the server has finished the request
  successfully.
  If the server replies with an error status, this promise will
  reject with a `RpcError` that contains the status code and meta data.

- `trailers Promise<RpcMetadata>`   
  The trailers the server attached to the response.
  This promise will resolve when the server has finished the request
  successfully.
  If the server replies with an error status, this promise will
  reject with a `RpcError` that contains the status code and meta data.



A unary call simply does not use the `stream` keyword in `.proto`. The method 
signature generated by `protobuf-ts` is as follows: 

```typescript
methodName(request: I, options? RpcOptions): UnaryCall<I, O>
```

Where `I` is the defined input message and `O` the defined output 
message.

The `UnaryCall` provides the following additional properties: 

- `request: Readonly<I>`   
  The request message being sent.

- `response: Promise<O>`   
  The message the server replied with. If the server does not send a message, this promise will reject with a 
  `RpcError`.

So a simple way to get the response message of a unary call would be:

```typescript
let call = service.myMethod(foo);
let response = await call.response;
```

But there is a caveat: gRPC and gRPC web use response trailers to indicate 
server status. This means that it is possible that the server responds 
with a message and *then* sends an error status. If you do not check the 
`status`, you may be missing an error.

Response trailers are a very useful feature, but for simple unary calls, 
awaiting two promises is cumbersome. For this reason, the `UnaryCall` itself 
is awaitable, and will reject if an error status is received. Instead of awaiting 
`call.response`, you can simply await the call:

```typescript
let {response} = await service.myMethod(foo);
```


A server streaming call uses the `stream` keyword for the output statement in `.proto`. 
The method signature generated by `protobuf-ts` is as follows:  

```typescript
methodName(request: I, options? RpcOptions): ServerStreamingCall<I, O>
```

The `ServerStreamingCall` provides the following additional properties: 

- request: `Readonly<I>`   
  The request message being sent.

- responses: `RpcOutputStream<O>`   
  Response messages from the server. 
  This is an AsyncIterable that can be iterated with `await for .. of`.


So a simple way to read all response messages of a server streaming call would be:

```typescript
let call = service.myMethod(foo);
for await (let message of call.responses) {
    console.log("got a message", message)
}
let status = await call.status;
let trailers = await call.trailers;
```

Note that the same caveat regarding the response status applies to server streaming 
calls as well. If you do not await `status`, you will not notice the error status!

The `ServerStreamingCall` is also awaitable. You cannot obtain the response messages this 
way (the server could theoretically send millions of messages), but you can shorten separate 
awaits for `status` and `trailers` to a single expression: 

```typescript
let call = service.myMethod(foo);
for await (let message of call.responses) {
    console.log("got a message", message)
}
let {status, trailers} = await call;

// or, if you only want to make sure you don't miss an error status:
await call;
```

If you cannot use async iterables in your environment, you can alternatively attach callbacks 
to the `RpcOutputStream`. See the source code of `RpcOutputStream` for further documentation.


#### RPC transports

A `RpcTransport` executes Remote Procedure Calls defined by a protobuf
service.

This interface is the contract between a generated service client and
some wire protocol like grpc, grpc-web, Twirp or other.

The transport receives reflection information about the service and
method being called.



## gRPC web transport

While gRPC requires HTTP 2 support on your server and client, gRPC web is a subset 
that works with HTTP 1. gRPC works with unary and server streaming methods. 
Client streaming and duplex streaming is not supported.

Any gRPC service can be made available via gRPC web using the 
[envoy proxy](https://www.envoyproxy.io/). If you use the .NET Core gRPC 
implementation `Grpc.AspNetCode`, you may want to usethe nuget package 
`Grpc.AspNetCore.Web` to add gRPC web support. 

To use the gRPC web transport, install the package `@protobuf-ts/grpcweb-transport`.

> **Note:** This transport requires the fetch API (`globalThis.fetch` and 
`globalThis.Headers`).
> For Node.js, use the polyfill [node-fetch](https://github.com/node-fetch/node-fetch).  

> **Note:** To cancel calls, you need an [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
> For Node.js, use the polyfill [abort-controller](https://github.com/mysticatea/abort-controller).

> **Note:** For React native, you have to use the react-native-polyfill-globals,
> see [#67](https://github.com/timostamm/protobuf-ts/issues/67#issuecomment-764522714).

> **Note:** For requests across domains, your server must expose the headers 
> "grpc-encoding", "grpc-message" and "grpc-status" and allow the headers 
> "x-grpc-web" and "grpc-timeout" to function correctly. Any custom headers 
> you want to use must be exposed / allowed as well. 
> See [Access-Control-Expose-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers) 
> and [Access-Control-Allow-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers).


Example `.proto`:
```proto
syntax = "proto3";

service Haberdashery {
    rpc MakeHat (Size) returns (Hat);
    rpc MakeRowOfHats (Size) returns (stream Hat);
}
message Hat {
    int32 size = 1;
    string color = 2;
    string name = 3;
}
message Size {
    int32 inches = 1;
}
```

Example usage:

```typescript
let transport = new GrpcWebFetchTransport({
    baseUrl: "http://localhost:3000"
});

let client = new HaberdasheryClient(transport);

let {response} = await client.makeHat({ inches: 11 });
console.log("got a small hat! " + response)

let streamingCall = client.makeRowOfHats({ inches: 23 });
for await (let hat of streamingCall.responses) {
    console.log("got another hat! " + hat)
}
```

The `GrpcWebFetchTransport` takes an options object of type `GrpcWebOptions` 
as a single constructor argument. It extends the standard `RpcOptions` 
(see [RPC options](#rpc-options)) with the following options:

- format: `"text" | "binary"`
  
  Send binary or text format? Defaults to text.

- baseUrl: `string`
  
  Base URI for all HTTP requests.
  Requests will be made to <baseUrl>/<package>.<service>/method
  
  Example: `baseUrl: "https://example.com/my-api"`

  This will make a `POST /my-api/my_package.MyService/Foo` to `example.com` via HTTPS.

- fetchInit:   
  Extra options to pass through to the fetch when doing a request.  
  Example: `fetchInit: { credentials: 'include' }`  
  This will make requests include cookies for cross-origin calls.


`protobuf-ts` includes an example gRPC web server in `packages/example-dotnet-grpcweb-server`.

To learn more about the inner workings of the transport, make sure 
to read the introduction to [RPC support](#rpc-support). To learn about the features 
provided by the `UnaryCall` and `ServerStreamingCall`, see [RPC method types](#rpc-method-types).



## Twirp transport

[Twirp](https://github.com/twitchtv/twirp) is a simple RPC framework with protobuf 
service definitions. 

Twirp supports only unary method types and no response trailers, but on the other 
hand it is very easy to implement on the server side and still benefits a lot from 
the very reliable protocol buffer serialization mechanism.    

To use the Twirp transport, install the package `@protobuf-ts/twirp-transport`.

> **Note:** This transport requires the fetch API and the AbortController API.  
> `globalThis.fetch`, `globalThis.Headers` and `globalThis.AbortController` are expected.    
> For Node.js, use the polyfills [node-fetch](https://github.com/node-fetch/node-fetch) and [abort-controller](https://github.com/mysticatea/abort-controller).

> **Note:** For requests across domains, your server must allow request
> headers you intend to send and expose response headers you intend to read.
> See [Access-Control-Expose-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers) 
> and [Access-Control-Allow-Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers).


Example `.proto`:
```proto
syntax = "proto3";

service Haberdasher {
    rpc MakeHat (Size) returns (Hat);
}
message Hat {
    int32 size = 1;
    string color = 2;
    string name = 3;
}
message Size {
    int32 inches = 1;
}
```

Example usage:

```typescript
let transport = new TwirpFetchTransport({
    baseUrl: "localhost:3000"
});

let client = new HaberdasherClient(transport);

let {response} = await client.makeHat({ inches: 11 });
console.log("got a small hat! " + response)
```

The `TwirpFetchTransport` takes an options object of type `TwirpOptions` 
as a single constructor argument. It extends the standard `RpcOptions` 
(see [RPC options](#rpc-options)) with the following options:

- baseUrl: `string`
  
  Base URI for all HTTP requests.
  Requests will be made to <baseUrl>/<package>.<service>/method
  
  If you need the "twirp" path prefix, you must add it yourself.
  
  Example: `baseUrl: "https://example.com/twirp"`

  This will make a `POST /twirp/my_package.MyService/Foo` to `example.com` via HTTPS.

- useProtoMethodName: `boolean`
  
  For Twirp, method names are CamelCased just as they would be in Go.
  To use the original method name as defined in the .proto, set this
  option to `true`.

- sendJson: `boolean`
  
  Send JSON? Defaults to false, which means binary format is sent.

- fetchInit:   
  Extra options to pass through to the fetch when doing a request.  
  Example: `fetchInit: { credentials: 'include' }`  
  This will make requests include cookies for cross-origin calls.


To learn more about the inner workings of the transport, make sure 
to read the introduction to [RPC support](#rpc-support). To learn about the features 
provided by the `UnaryCall`, see [RPC method types](#rpc-method-types).



## gRPC transport

The gRPC transport supports all [method types](#rpc-method-types). It uses the 
package `@grpc/grpc-js` to make gRPC requests and can only be used in Node.js.

To use the gRPC transport, install the package `@protobuf-ts/grpc-transport`.

Example usage:

```typescript
const transport = new GrpcTransport({
    host: "localhost:5000",
    channelCredentials: ChannelCredentials.createInsecure(),
});

let client = new HaberdasheryClient(transport);

let {response} = await client.makeHat({ inches: 11 });
console.log("got a small hat! " + response)

let streamingCall = client.makeRowOfHats({ inches: 23 });
for await (let hat of streamingCall.responses) {
    console.log("got another hat! " + hat)
}
```

For more information, have a look at the example client in [packages/example-node-grpc-transport-client](https://github.com/timostamm/protobuf-ts/tree/master/packages/example-node-grpc-transport-client).



## Native gRPC server

'protobuf-ts' can generate code for gRPC servers that run in Node.JS. 

> **Note:** The generated code requires the package @grpc/grpc-js. Install it with:
> ```shell script
> # with npm:
> npm install @grpc/grpc-js
> 
> # with yarn:
> yarn add @grpc/grpc-js
> ```

To generate a gRPC server, set the plugin option `server_grpc1` or 
set the service option `(ts_server) = GRPC`. Example:

```proto
// example-service.proto
syntax = "proto3";
package spec;

import "protobuf-ts.proto";

service ExampleService {
  option (ts.server) = GRPC1_SERVER;
  rpc method (RequestMessage) returns (ResponseMessage);
}
```

This will generate the following TypeScript:

```typescript
// example-service.grpc-server.ts
import * as grpc from "@grpc/grpc-js";

// implement this interface
export interface IExampleService extends grpc.UntypedServiceImplementation {
  unary: grpc.handleUnaryCall<RequestMessage, ResponseMessage>;
}

// a service definition 
export const exampleServiceDefinition: grpc.ServiceDefinition<IExampleService> = {
    // ...
}
```

After implementing your service using the generated interface, you can 
start a server with `@grpc/grpc-js`: 

```typescript
const exampleService: IExampleService = {
  // implement your service here
};

const server = new grpc.Server();
server.addService(exampleServiceDefinition, exampleService);
server.bindAsync(
  '0.0.0.0:5000',
  grpc.ServerCredentials.createInsecure(),
  (err: Error | null, port: number) => {
    if (err) {
      console.error(`Server error: ${err.message}`);
    } else {
      console.log(`Server bound on port: ${port}`);
      server.start();
    }
  }
);
```

For a working example, have a look at  [packages/example-node-grpc-server](https://github.com/timostamm/protobuf-ts/tree/master/packages/example-node-grpc-server).



## Native gRPC client

'protobuf-ts' can generate code for gRPC clients that run in Node.JS.

> **Note:** The generated code requires the package @grpc/grpc-js. Install it with:
> ```shell script
> # with npm:
> npm install @grpc/grpc-js
> 
> # with yarn:
> yarn add @grpc/grpc-js
> ```

To generate a gRPC client, set the plugin option `client_grpc1` or
set the service option `(ts_client) = GRPC1_CLIENT`.

For usage, see [/packages/example-node-grpc-client/](./packages/example-node-grpc-client/).


## Generic RPC servers

With the plugin option `server_generic`, `protobuf-ts` generates generic interfaces
for services for the server side.

Note that this feature is experimental and may change with minor releases.

For usage, see [/packages/example-node-grpc-backend-server/](./packages/example-node-grpc-backend-server/).

