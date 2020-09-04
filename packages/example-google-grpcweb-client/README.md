@protobuf-ts/example-google-grpcweb-client
==========================================

This is a simple grpc-web client using google's protoc js output 
and the official grpc-web protoc plugin.

It can be used together with the example grpc-web server in the 
directory "example-dotnet-grpcweb-server".

To run this project, build it first:

```shell script
make
```

This will 
- install some npm packages
- generate the javascript grpc web client (and messages)
- package the javascript `client.js` with webpack 

Just open `client.html` in your browser to run the client.  


Please note that you need `protoc` as well as `protoc-gen-grpc-web`.
Download the latter from https://github.com/grpc/grpc-web/releases.
