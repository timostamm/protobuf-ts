@protobuf-ts/example-dotnet-grpc-server
=======================================

This is a simple gRPC server using dotnet core. 

This server can be used by one of the clients:
- example-node-grpc-client (@grpc/grpc-js)
- example-node-grpc-transport-client (grpc-transport)
- example-dotnet-grpc-client (dotnet)

To start the server, run:

```shell script
dotnet run
```

The server is listening on port 5000 and has a CORS policy to accept requests 
without restrictions.
