@protobuf-ts/test-conformance
=============================

Runs binary and JSON format conformance, using googles 
[conformance test runner](https://github.com/protocolbuffers/protobuf/tree/main/conformance).

`@protobuf-ts/plugin-framework`, `@protobuf-ts/plugin` and `@protobuf-ts/runtime` 
must be built to run the tests. `make` executes all tests. See `Makefile` 
for details. 

The proto files in [proto/](./proto) are Copyright Google Inc. / Google 
LLC, licensed under Apache-2.0 / BSD-3-Clause.
