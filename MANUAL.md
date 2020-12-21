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
  - [google.type.Color](#googletypecolor)
  - [google.type.DateTime and google.type.Date](#googletypedatetime-and-googletypedate)
- [Reflection](#reflection)
  - [Field information](#field-information)
  - [Custom options](#custom-options)
  - [Excluding custom options](#excluding-custom-options)
- [Binary format](#binary-format)
  - [Conformance](#conformance)
  - [Unknown field handling](#unknown-field-handling)
- [Code size vs speed](#code-size-vs-speed)
- [Running in the Web Browser](#running-in-the-web-browser)
- [Running in Node.js](#running-in-nodejs)
- [RPC support](#rpc-support)
  - [RPC client styles](#rpc-client-styles)
  - [RPC options](#rpc-options)
  - [RPC method types](#rpc-method-types)
  - [gRPC web transport](#grpc-web-transport)
  - [Twirp transport](#twirp-transport)
  - [gRPC transport](#grpc-transport)
  - [gRPC server](#grpc-server)
- [Angular support](#angular-support)




## What are protocol buffers

Protocol buffers are a definition language for simple data structures 
that can be efficiently serialized. 

Using the protocol buffer compiler (`protoc`) you can "compile" a 
`.proto` file to many languages. 

To learn more about the protocol buffer language, please check the 
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
The protocol buffer compiler `protoc` is automatically installed ([explanation](./packages/protoc/README.md)). 

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


Available plugin parameters:

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
  not the files they import. Set this option to generate code for dependencies  
  too.

- "client_none"  
  Do not generate rpc clients.  
  Only applies to services that do *not* use the option `ts.client`.  
  If you do not want rpc clients at all, use `force_client_none`.

- "client_call"  
  Use *Call return types for rpc clients.  
  Only applies to services that do *not* use the option `ts.client`.  
  Since CALL is the default, this option has no effect.

- "client_promise"  
  Use Promise return types for rpc clients.  
  Only applies to services that do *not* use the option `ts.client`.  

- "client_rx"  
  Use Observable return types from the `rxjs` package for rpc clients.  
  Only applies to services that do *not* use the option `ts.client`.

- "force_client_none"  
  Do not generate rpc clients, ignore options in proto files.

- "enable_angular_annotations"  
  If set, the generated rpc client will have an angular @Injectable()  
  annotation and the `RpcTransport` constructor argument is annotated with a  
  @Inject annotation. For this feature, you will need the npm package  
  '@protobuf-ts/runtime-angular'.

- "server_none"  
  Do not generate rpc servers.  
  This is the default behaviour, but only applies to services that do   
  *not* use the option `ts.server`.  
  If you do not want servers at all, use `force_server_none`.

- "server_grpc"  
  Generate a server interface and definition for use with @grpc/grpc-js.  
  Only applies to services that do *not* use the option `ts.server`.

- "force_server_none"  
  Do not generate rpc servers, ignore options in proto files.

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
// @generated by protobuf-ts 1.0.0-alpha.30 with parameters optimize_code_size,generate_dependencies
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
  plugin parameters used to generate this file, as well as the source file 
  name, package name and syntax.

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

The `IMessageType` provides the following methods:

- `create(): T`
  
  Create a new message with default values.
  
  For example, a protobuf `string name = 1;` has the default value `""`.

- `create(value: PartialMessage<T>): T`
  
  Create a new message from partial data. 
  Where a field is omitted, the default value is used.  
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
with the properties `typeName` and `fields`.  


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
 ```

The prefix "FOO_" is dropped in TypeScript:

 ```typescript
enum Foo {
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
if (message.oneofKind === "value") {
 message.value // the union has been narrowed down
}
```

> **Note:** you have to turn on the `strictNullChecks` option in your 
> `tsconfig.json` for this feature


## BigInt support

Protocol buffers have signed and unsigned 64 bit integral types. `protobuf-ts` 
gives you the following options to represent those `.proto` types in TypeScript:

1. `bigint`  
   Enabled by default. Lets you use the standard JavaScript operators.  
 
2. `string`  
   Enabled by setting the option `[jstype = JS_STRING]` on a field , or 
   by setting the [plugin parameter](#the-protoc-plugin) "long_type_string".  

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
if he intentionally left the field out. Both look the same.

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
is sufficient to write protoc plugins. When a proto2 messages passes through 
`protobuf-ts`, no data is lost, but there are several limitations in the 
generated code:

1. Extensions 
   
   Extensions (see [language guide](https://developers.google.com/protocol-buffers/docs/proto#extensions))
   are basically ignored. No code will be generated.
  
   Extension fields can be read like unknown fields. See [unknown field handling](#unknown-field-handling). 

2. Default field values are unsupported  

   A field with the `optional` label and a default option will have the type 
   `myField?: bool` and default value `undefined`.
   
   If the field has the `required` label, the type will be `myField: bool` 
   with the default value `false`. 

3. Enums without a 0 value
   
   `protobuf-ts` will add the `UNSPECIFIED$ = 0` enum value if no 
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

> **Note:** `Timestamp` is also supported by the `PbDatePipe` provided by 
> `@protobuf-ts/runtime-angular`. 



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

> **Note:** `DateTime` is also supported by the `PbDatePipe` provided by 
> `@protobuf-ts/runtime-angular`. 



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


#### Custom options

`protobuf-ts` support custom field and method options and will add them to 
the reflection information. 

For example, consider the following service definition in .proto:

```proto
// import the proto that extends google.protobuf.MethodOptions
import "google/api/annotations.proto";

service AnnotatedService {
    rpc Get (Request) returns (Reply) {
        // now we can use the new options on the method
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

In TypeScript generated code, those options look very similar:

```typescript
/**
 * @generated from protobuf service spec.AnnotatedService
 */
export class AnnotatedServiceClient implements IAnnotatedServiceClient {
    readonly typeName = "spec.AnnotatedService";
    readonly methods: MethodInfo[] = [{
        service: this,
        name: "Get",
        localName: "get",
        I: AnnoGetRequest,
        O: AnnoGetResponse,
        options: {
            // here are the options, in JSON format
            "google.api.http": {
                additionalBindings: [{
                    get: "xxx"
                }, {
                    get: "yyy"
                }],
                get: "/v1/{name=messages/*}"
            }
        }
    }];
    // ...
```

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
and `protobuf-ts` provides them in the canonical JSON format. This means that 
you can parse message option fields using the appropriate message type:


```typescript
let client: AnnotatedServiceClient = ...

let opt = client.methods[0].options;

if (opt && "google.api.http" in opt) {
    let rule = HttpRule.fromJson(opt["google.api.http"]);
    if (rule) {
        // now we have successfully read a 
        // google.api.HttpRule from the option
        let selector: string = rule.selector;
        let bindings: HttpRule[] = rule.additionalBindings;
    }
}
``` 

To save you some typing, there is a convenience method available:

```typescript
import {readMethodOptions} from "@protobuf-ts/runtime-rpc";

let rule = readMethodOptions(client, "get", "google.api.http", HttpRule);
if (rule) {
    let selector: string = rule.selector;
    let bindings: HttpRule[] = rule.additionalBindings;
}
``` 

Field options work the same way. In .proto, you create an extension for 
`google.protobuf.FieldOptions`, and in TypeScript, you can read 
`IMessageType.fields[].options`. If it is a message field, use 
`readFieldOptions()` from `@protobuf-ts/runtime`. 


#### Excluding custom options

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

- `ignoreUnknownFields `boolean`
  
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
Alternatively, the default behaviour can be changed with [plugin parameters](#the-protoc-plugin).

`protobuf-ts` compiles to rather small code sizes, even with 
`optimize_for = SPEED`. The following table shows a comparison between 
several code generators: 

| generator               | version         | optimize for      | webpack output size |
|-------------------------|----------------:|-------------------|--------------------:|
| pbf | 3.2.1 |  | 22,132 b |
| protobuf-ts | 2.0.0-alpha.3 | size | 42,734 b |
| protobuf-ts | 2.0.0-alpha.3 | speed | 73,236 b |
| ts-proto | 1.26.0 |  | 111,762 b |
| protobufjs | 6.10.2 |  | 139,360 b |
| google-protobuf | 3.12.2 |  | 396,934 b |



The file sizes are calculated by compiling `google/protobuf/descriptor.proto`, 
then packing with webpack in production mode. The source code of the size 
benchmark is located in `packages/benchmarks`. 




## Running in the Web Browser

`protobuf-ts` works in the browser. The runtime and generated code is compatible 
with all major browsers after Internet Explorer. 

Some older browsers do not provide all types required by `protobuf-ts`, but they 
can be polyfilled quite easily: 

- `TextEncoder` [polyfill](https://github.com/samthor/fast-text-encoding)
- `Symbol.asyncIterator` [polyfill](https://stackoverflow.com/questions/43694281 )
- `globalThis` - [polyfill](https://mathiasbynens.be/notes/globalthis#robust-polyfill)

The Angular example app `packages/example-angular-app` is using these polyfills 
and works with Edge 44. 

For the Web Browser, it is recommended to use the `CODE_SIZE` optimization for 
all messages by setting plugin parameter `--ts_opt optimize_code_size`. Then set the 
file option `optimize_for = SPEED` for files where you can measure a noticeable 
performance increase. See [code size vs speed](#code-size-vs-speed) for a output 
size comparison.



## Running in Node.js

`protobuf-ts` is tested with Node.js version 14.5.0. 

Older versions certainly work, but may not support all features or require polyfills. 
For example, if you target lower than ES2020 to run in an older node version, you 
cannot use bigint.  

If you are using the `grpcweb-transport` or `twirp-transport`, you probably 
have to polyfill the fetch API. See the README files of the transport packages 
for more information.  




## RPC support

`protobuf-ts` can generate clients for your rpc services. It supports Promises
and rxjs Observables for async operations. 

The generated clients are not hard-wired to a specific format. They 
delegate to a transport layer that can implement gRPC, gRPC-web, twirp or 
any custom protocol. `protobuf-ts` provides transports for [gRPC web](#grpc-web-transport) and 
[Twirp](#twirp-transport).

Let's start with a real world example. For the following service definition:
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
[RPC method types](#rpc-method-types) available in protocol buffers. If you 
want to use rxjs Observables or plain Promises, you can change the 
[client style](#rpc-client-styles) for the service. 


`protobuf-ts` also generates an implementation for this interface, the class 
`HaberdasherClient`. It takes a `RpcTransport` argument. The actual work of 
transferring messages is delegated to the `RpcTransport`.


`@protobuf-ts` comes with several RPC transports: 
- `TwirpFetchTransport` from `@protobuf-ts/twirp-transport` - see [Twirp transport](#twirp-transport)
- `GrpcWebFetchTransport` from `@protobuf-ts/grpcweb-transport` - see [gRPC web transport](#grpc-web-transport)
- `GrpcTransport` from `@protobuf-ts/grpc-transport` - see [gRPC transport](#grpc-transport)

If you set the `enable_angular_annotations` option, `protobuf-ts` adds 
annotations to the client that enable Angular dependency injection. 
See [Angular support](#angular-support) to learn more.

To learn about `RpcOptions` and the `RpcTransport` implementations, please 
continue reading.


#### RPC client styles

If you do not want to use the built-in call types, and prefer to use plain 
promises or rxjs Observable, you can change the behaviour with global plugin 
options or a service option in your .proto file: 

```proto
import "protobuf-ts.proto";

service Haberdasher {
  option (ts.client) = RX_CLIENT;
  rpc MakeHat(Size) returns (Hat);
}
```

This will generate the following method:

```typescript
export interface IHaberdasherClient {
    makeHat(input: Size, options?: RpcOptions): Observable<Hat>;
}
```

Setting `option (ts.client) = PROMISE_CLIENT` generates:

```typescript
export interface IHaberdasherClient {
    makeHat(input: Size, options?: RpcOptions): Promise<Hat>;
}
```

If you want to generate multiple client styles, simply set the option multiple times:

```proto
import "protobuf-ts.proto";

service Haberdasher {
  option (ts.client) = RX_CLIENT;
  option (ts.client) = PROMISE_CLIENT;
  rpc MakeHat(Size) returns (Hat);
}
```

This generates both client styles, with the names `HaberdasherRxClient` and `HaberdasherPromiseClient`.



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

- `deadline: Date | number`
  
  Deadline for the call. Can be a specific date or a
  timeout in milliseconds.

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

- `cancel(): void`   
  Cancel this call.



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
is awaitable, and will reject if an error status is received. Instead of awaiting `call.response`, you can simple await the 
call:

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

- response: `RpcOutputStream<O>`   
  Response messages from the server. 
  This is an AsyncIterable that can be iterated with `await for .. of`.


So a simple way to read all response messages of a server streaming call would be:

```typescript
let call = service.myMethod(foo);
for await (let message of call.response) {
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
for await (let message of call.response) {
    console.log("got a message", message)
}
let {status, trailers} = await call;

// or, if you only want to make sure you don't miss an error status:
await call;
```

If you cannot use async iterables in your environment, you can alternatively attach callbacks 
to the `RpcOutputStream`. See the source code of `RpcOutputStream` for further documentation.



### gRPC web transport

While gRPC requires HTTP 2 support on your server and client, gRPC web is a subset 
that works with HTTP 1. 

A gRPC service can be made available as gRPC web using the [envoy proxy](https://www.envoyproxy.io/), 
or the nuget package `Grpc.AspNetCore.Web`, if you are using Grpc.AspNetCode. 

gRPC works with unary and server streaming methods. Client streaming and duplex 
streaming is not supported. 

To use the gRPC web transport, install the package `@protobuf-ts/grpcweb-transport`.

> **Note:** This transport requires the fetch API (`globalThis.fetch` and 
`globalThis.Headers`).
> For Node.js, use the polyfill [node-fetch](https://github.com/node-fetch/node-fetch).  

> **Note:** To cancel calls, you need an [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
> For Node.js, use the polyfill [abort-controller](https://github.com/mysticatea/abort-controller).


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
    baseUrl: "localhost:3000"
});

let client = new HaberdasheryClient(transport);

let {response} = await client.makeHat({ inches: 11 });
console.log("got a small hat! " + response)

let streamingCall = client.makeRowOfHats({ inches: 23 });
for await (let hat of streamingCall.response) {
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

`protobuf-ts` includes an example gRPC web server in `packages/example-dotnet-grpcweb-server` 
and exemplary client usage in `packages/example-angular-app`. 

To learn more about the inner workings of the transport, make sure 
to read the introduction to [RPC support](#rpc-support). To learn about the features 
provided by the `UnaryCall` and `ServerStreamingCall`, see [RPC method types](#rpc-method-types).



### Twirp transport

[Twirp](https://github.com/twitchtv/twirp) is a simple RPC framework with protobuf 
service definitions. 

Twirp supports only unary method types and no response trailers, but on the other 
hand it is very easy to implement on the server side and still benefits a lot from 
the very reliable protocol buffer serialization mechanism.    

To use the Twirp transport, install the package `@protobuf-ts/twirp-transport`.

> **Note:** This transport requires the fetch API and the AbortController API.  
> `globalThis.fetch`, `globalThis.Headers` and `globalThis.AbortController` are expected.    
> For Node.js, use the polyfills [node-fetch](https://github.com/node-fetch/node-fetch) and [abort-controller](https://github.com/mysticatea/abort-controller).

> **Note:** If you use Angular, consider using the Twirp transport based on 
> Angular's HttpClient. See [Angular support](#angular-support).



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


To learn more about the inner workings of the transport, make sure 
to read the introduction to [RPC support](#rpc-support). To learn about the features 
provided by the `UnaryCall`, see [RPC method types](#rpc-method-types).



### gRPC transport

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
for await (let hat of streamingCall.response) {
    console.log("got another hat! " + hat)
}
```


For more information, have a look at the example client in [packages/example-node-grpc-client](https://github.com/timostamm/protobuf-ts/tree/master/packages/example-node-grpc-client).


### gRPC server

'protobuf-ts' can generate code for gRPC servers that run in Node.JS. 

> **Note:** The generated code requires the package @grpc/grpc-js. Install it with:
> ```shell script
> # with npm:
> npm install @grpc/grpc-js
> 
> # with yarn:
> yarn add @grpc/grpc-js
> ```

To generate a gRPC server, set the plugin parameter `server_grpc` or 
set the service option `(ts_server) = GRPC`. Example:

```proto
// example-service.proto
syntax = "proto3";
package spec;

import "protobuf-ts.proto";

service ExampleService {
  option (ts.server) = GRPC_SERVER;
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




## Angular support

`protobuf-ts` has built-in support for [Angular](https://angular.io/), including: 

- a Twirp transport that uses the Angular `HttpClient`
- a date pipe that supports `google.protobuf.Timestamp` and `google.type.DateTime`
- annotations for dependency injection

To enable Angular support, 
1. set the `enable_angular_annotations` [plugin parameter](#the-protoc-plugin)
2. install all related packages with `npm i @protobuf-ts/runtime @protobuf-ts/runtime-rpc @protobuf-ts/runtime-angular @protobuf-ts/twirp-transport`


Update your `app.module.ts` with the following:

```typescript
// app.module.ts

@NgModule({
  imports: [
    // ...

    // Registers the `PbDatePipe`.
    // This pipe overrides the standard "date" pipe and adds support
    // for `google.protobuf.Timestamp` and `google.type.DateTime`.
    PbDatePipeModule,

    // Registers the `TwirpTransport` with the given options
    // and sets up dependency injection.
    TwirpModule.forRoot({
      // don't forget the "twirp" prefix if your server requires it
      baseUrl: "http://localhost:8080/twirp/",
    })

  ],
  providers: [

    // Make a service available for dependency injection.
    // Now you can use it as a constructor argument of your component.
    HaberdasherClient,
    
    // ...
  ],
  // ...
})
export class AppModule {
}
```

If you want to use a different RPC transport, you can wire it up using the
`RPC_TRANSPORT` injection token. The following example uses the `GrpcWebFetchTransport`
from @protobuf-ts/grpcweb-transport:

```typescript
// app.module.ts

@NgModule({
  // ...
  providers: [

    // Make this service available for injection in all components:
    MyServerStreamingServiceClient,

    // Configure gRPC web as transport for all services. 
    {provide: RPC_TRANSPORT, useValue: new GrpcWebFetchTransport({
        baseUrl: "http://localhost:4200"
    })},
  ],
  // ...
})
export class AppModule {
}
```

For more information, have a look at the example angular app in [packages/example-angular-app](./packages/example-angular-app). 
It shows how the pipe is used, how Twirp is setup and can be run against an 
example gRPC-web or Twirp server (also included in the examples). 
