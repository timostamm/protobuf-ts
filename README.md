protobuf-ts
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

It can also send the data over the network to a remote server, where it 
can be read by other protobuf implementations.


### Features

- implements the [canonical proto3 JSON format](MANUAL.md#json-format)
- implements the [binary format](MANUAL.md#binary-format)
- provides [gRPC web clients](MANUAL.md#grpc-web-transport)
- provides [Twirp clients](MANUAL.md#twirp-transport)
- supports [Angular](MANUAL.md#angular-support) dependency injection and pipes
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


To get started, install the plugin with `npm i -D @protobuf-ts/plugin` 
and read the [MANUAL](MANUAL.md) to learn more.




### Copyright

- The [algorithm to decode UTF8](./packages/runtime/src/protobufjs-utf8.ts) is Copyright 2016 by Daniel Wirtz, licensed under BSD-3-Clause.
- The [algorithm to encode and decode varint](./packages/runtime/src/goog-varint.ts) is Copyright 2008 Google Inc., licensed under BSD-3-Clause.
- The files [plugin.ts](./packages/plugin-framework/src/google/protobuf/compiler/plugin.ts) and [descriptor.ts](./packages/plugin-framework/src/google/protobuf/descriptor.ts) are Copyright 2008 Google Inc., licensed under BSD-3-Clause
- The [gRPC status codes](./packages/grpcweb-transport/src/goog-grpc-status-code.ts) are Copyright 2016 gRPC authors, licensed under Apache-2.0.
- The [Twirp error codes](./packages/twirp-transport/src/twitch-twirp-error-code.ts) are Copyright 2018 Twitch Interactive, Inc., licensed under Apache-2.0.
- The proto files in [test-fixtures/google](./packages/test-fixtures/google) and [test-fixtures/conformance](./packages/test-fixtures/conformance) are Copyright Google Inc. / Google LLC, licensed under Apache-2.0 / BSD-3-Clause.
- All other files are licensed under Apache-2.0, see [LICENSE](./LICENSE). 




### Building this project 

This is a monorepo. It uses [lerna](https://github.com/lerna/lerna) to 
manage versions and dependencies.  

Building this project requires `node`, `npm`, `protoc` (3.12.3 or later), 
`make`, `bazel`, `git`.

The entire project can be built by running `make`. This will execute: 
- `npm i` - installs `lerna` locally
- `lerna bootstrap` - installs the dependencies of all packages, linking local packages
- `lerna exec make` - runs `make` for all packages 

See `Makefile` for details.

The `packages/` directory contains all components of `protobuf-ts`. Some are public 
npm packages, some are private and only required for development. Some components do not 
use JavaScript at all, for example `example-dotnet-grpcweb-server`.  


