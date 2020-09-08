Contributing
============


### Reporting Bugs

Please [open an issue](https://github.com/timostamm/protobuf-ts/issues/new) and explain the 
problem.


### Do you have a question?

Just [open an issue](https://github.com/timostamm/protobuf-ts/issues/new).


### Building this project 

Building and testing this project requires `node` (14.5.0), `npm`, `protoc` (3.12.3), 
`make`, `bazel`, `git`, `go`.  

- `go` is required for the Twirp transport client compatibility test suite
- `protoc` is required for test fixtures
- `git` and `bazel` are required to checkout and compile the protobuf conformance test 
  suite

The entire project can be built by running `make`, but if you do not have all required
tooling installed, you can still build all of the TypeScript packages. 


Not all packages are public, or even JavaScript projects. There are also examples, 
benchmarks and fixtures in the `packages/` directory. They can be built with their 
respective Makefiles.
