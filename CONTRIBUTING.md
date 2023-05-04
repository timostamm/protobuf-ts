Contributing
============


### Reporting Bugs

Please [open an issue](https://github.com/timostamm/protobuf-ts/issues/new) and explain the 
problem.


### Do you have a question?

Just [start a discussion](https://github.com/timostamm/protobuf-ts/discussions/new).


### Building this project 

Building and testing this project requires `node`, `npm`, `protoc`, 
`make`, `git`, and `go`.  

- `go` is required for the Twirp transport client compatibility test suite
- `protoc` is required for compiling .proto files.

The entire project can be built by running `make`, but if you do not have all required
tooling installed, you can still build all of the TypeScript packages. 


Not all packages are public, or even JavaScript projects. There are also examples, 
benchmarks and Protobuf files in the `packages/` directory. They can be built with their 
respective Makefiles.



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
npm install
make 
```

The `make` compiles TypeScript to Javascript and runs all test cases 
(in `spec/`) in nodejs (using jasmine) and in a headless browser (using karma 
and jasmine). 


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

`packages/plugin` and `packages/plugin-framework` are both tested using the 
`FileDescriptorSet`. In `spec/helpers.ts`, the function `getCodeGeneratorRequest` 
can be used to create a `CodeGeneratorRequest` from the file descriptors.  

The plugin itself has only very basic test coverage. We generate TypeScript 
(in memory) for all .proto files in `packages/proto` and compile the 
generated code using the TypeScript Compiler API, checking for static errors. 

Adding a feature or fixing a bug in the plugin can be cumbersome. Instead of 
building the plugin and running it with protoc, you can let a test case spit 
out the generated code for you. `spec/protobufts-plugin.spec.ts` contains the 
necessary code to do this (commented out). If you enable the code, you can simply 
run `make test` after your change to see the generated code. There should probably 
be a separate script for this, but at the moment, we do not have one. Please 
remember not to commit unintentional changes to the spec file. 


##### Testing generated code

The plugin generates speed optimized methods as well as custom method 
for well-known types. This code is not part of the runtime and can only 
be tested by testing the actual generated code.

`packages/test-generated/` is responsible to test the generated code.  
See the README.md for details.

