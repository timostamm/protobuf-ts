@protobuf-ts/example-grpcweb-websockets
=======================================

This is an example for gRPC-web over websockets, as implemented by 
improbable-eng's Proxy `grpcwebproxy` and Plugin `ts-protoc-gen`. 
It is using our [ExampleService](../test-fixtures/service-example.proto).

To run the improbable-eng example, you need 3 terminal sessions:

##### 1. Start a gRPC example server

Use the [example-dotnet-grpc-server](../example-dotnet-grpc-server).


##### 2. Start the improbable proxy
   
Run `make improbable-proxy`. This will start a proxy listening on
`localhost:5080` and expects a backend gRPC server to run on 
`localhost:5000`, all without TLS. 


##### 3. Start the web application

Run `make improbable-client`. This will generate improbable-eng client 
code and start a webpack dev server listening on `localhost:8080`. 
Launch http://localhost:8080 in your browser. The [script](./improbable-client/src/index.ts) 
will run all methods of the example service.

