@protobuf-ts/plugin
===================

The protocol buffer compiler plugin to generate TypeScript code. 


Installation:
```shell script
npm i -D @protobuf-ts/plugin
```

This will install the plugin as a development dependency.  
The protocol buffer compiler `protoc` is automatically installed ([explanation](./packages/protoc/README.md)). 

Basic usage:
```shell script
npx protoc \ 
  --ts_out src/generated/ \
  --ts_opt long_type_string \
  --proto_path protos \
  protos/my.proto 
```

Plugin parameters are documented in the [MANUAL](https://github.com/timostamm/protobuf-ts/blob/master/MANUAL.md#the-protoc-plugin).  
For a quick overview of [protobuf-ts](https://github.com/timostamm/protobuf-ts), check the repository [README](https://github.com/timostamm/protobuf-ts/blob/master/README.md).
