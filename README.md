protobuf-ts [![<timostamm>](https://circleci.com/gh/timostamm/protobuf-ts.svg?style=svg)](https://app.circleci.com/pipelines/github/timostamm/protobuf-ts)
===========


Protobuf and RPC for Node.js and the Web Browser. 

For the following `.proto` file:
```proto
syntax = "proto3";

message Person {
    string name = 1;
    uint64 id = 2;
    int32 years = 3;
    optional bytes data = 5;
}
```

`protobuf-ts` generates code that can be used like this:

```typescript
let pete: Person = {
    name: "pete", 
    id: 123n, // it's a bigint
    years: 30
    // data: new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF]);
};

let bytes = Person.toBinary(pete);
pete = Person.fromBinary(bytes);

pete = Person.fromJsonString('{"name":"pete", "id":"123", "years": 30}')
```


### Quickstart

- grab the [msg-readme.proto](https://raw.githubusercontent.com/timostamm/protobuf-ts/master/packages/test-fixtures/msg-readme.proto) 
- `npm install @protobuf-ts/plugin`
- `npx protoc --ts_out . msg-readme.proto`
- add the `--experimental_allow_proto3_optional` flag if your protoc version asks for it


### Features

- implements the [canonical proto3 JSON format](MANUAL.md#json-format)
- implements the [binary format](MANUAL.md#binary-format) and respects [unknown fields](MANUAL.md#unknown-field-handling)
- provides [gRPC web clients](MANUAL.md#grpc-web-transport)
- provides [Twirp clients](MANUAL.md#twirp-transport)
- supports [Angular](MANUAL.md#angular-support) dependency injection and pipes
- automatically [installs protoc](./packages/protoc/README.md)
- can optimize for [speed or code size](MANUAL.md#code-size-vs-speed)  
- supports [proto3 optionals](MANUAL.md#proto3-optional)
- [supports bigint](MANUAL.md#bigint-support) for 64 bit integers
- every [message type](MANUAL.md#imessagetype) has methods to compare, clone, merge and type guard messages
- provides [reflection information](MANUAL.md#reflection-information), 
  including [custom options](MANUAL.md#custom-options)
- supports all [well-known-types](MANUAL.md#well-known-types) with custom JSON representation and helper methods
- uses standard [TypeScript enums](MANUAL.md#enum-representation)
- runs [in the Web Browser](MANUAL.md#running-in-the-web-browser) and in [Node.js](MANUAL.md#running-in-nodejs)
- uses an [algebraic data type for oneof](MANUAL.md#oneof-representation) groups


Read the [MANUAL](MANUAL.md) to learn more.




### Copyright

- The [algorithm to decode UTF8](./packages/runtime/src/protobufjs-utf8.ts) is Copyright 2016 by Daniel Wirtz, licensed under BSD-3-Clause.
- The [algorithm to encode and decode varint](./packages/runtime/src/goog-varint.ts) is Copyright 2008 Google Inc., licensed under BSD-3-Clause.
- The files [plugin.ts](./packages/plugin-framework/src/google/protobuf/compiler/plugin.ts) and [descriptor.ts](./packages/plugin-framework/src/google/protobuf/descriptor.ts) are Copyright 2008 Google Inc., licensed under BSD-3-Clause
- The [gRPC status codes](./packages/grpcweb-transport/src/goog-grpc-status-code.ts) are Copyright 2016 gRPC authors, licensed under Apache-2.0.
- The [Twirp error codes](./packages/twirp-transport/src/twitch-twirp-error-code.ts) are Copyright 2018 Twitch Interactive, Inc., licensed under Apache-2.0.
- The proto files in [test-fixtures/google](./packages/test-fixtures/google) and [test-fixtures/conformance](./packages/test-fixtures/conformance) are Copyright Google Inc. / Google LLC, licensed under Apache-2.0 / BSD-3-Clause.
- All other files are licensed under Apache-2.0, see [LICENSE](./LICENSE). 




### Building this project 

Building this project requires `node` (14.5.0), `npm`, `protoc` (3.12.3), 
`make`, `bazel`, `git`.  
The entire project can be built by running `make`.   
