Contributing
============


### Reporting Bugs

Please [open an issue](https://github.com/timostamm/protobuf-ts/issues/new) and explain the 
problem.


### Do you have a question?

Just [start a discussion](https://github.com/timostamm/protobuf-ts/discussions/new).


### Building this project 

Building and testing this project requires Node.js in the version specified in `.nvmrm`.
You'll also need `go` for the Twirp transport client compatibility test suite

The entire project can be built by running `npm run all`. We use turborepo. 
Run npm scripts with `npx turbo run ...`.

Not all packages are public, or even JavaScript projects. There are also examples, 
benchmarks and Protobuf files in the `packages/` directory. 



### Testing

##### Testing the runtime 

The runtime is tested without generating any code. For example, to test the 
`ReflectionJsonReader`, we simply pass reflection field information to the 
constructor of a `ReflectionJsonReader`, and can test whether it reads and 
writes JSON as expected.

This even works with the `MessageType`, which implements the public API of 
each protobuf message in TypeScript. We just don't have a TypeScript interface 
for the message in question. 

To test only the runtime, run:

```shell script
cd packages/runtime
npx turbo run test
```

##### Protos
 
`packages/proto` contains a large number of .proto files. These 
files are used to test code generation and functionality of the generated code. 

##### Testing the plugin

All protobuf plugins work with `CodeGeneratorRequest` and `CodeGeneratorResponse` 
messages (defined in `google/protobuf/compiler/plugin.proto`). 

A protocol buffer compiler parses .proto files and creates a `CodeGeneratorRequest`, 
then passes it to a plugin. Because invoking a compiler during testing is difficult, 
we generate a `FileDescriptorSet` ahead of time. The `FileDescriptorSet` contains all 
information necessary to create the `CodeGeneratorRequest`s we need for testing 
the plugin. 

`packages/plugin` is tested using the `FileDescriptorSet`. In `spec/helpers.ts`, 
the function `getCodeGeneratorRequest` can be used to create a `CodeGeneratorRequest` 
from the file descriptors.  

The plugin itself has only very basic test coverage. We generate TypeScript 
(in memory) for all .proto files in `packages/proto` and compile the 
generated code using the TypeScript Compiler API, checking for static errors. 


##### Testing generated code

The plugin generates speed optimized methods as well as custom method 
for well-known types. This code is not part of the runtime and can only 
be tested by testing the actual generated code.

For example, `packages/test-default` tests code generated with the default
plugin options. 
