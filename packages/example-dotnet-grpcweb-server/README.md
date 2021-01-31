@protobuf-ts/example-dotnet-grpcweb-server
==========================================

This is a simple gRPC-web server using dotnet core. 

This server can be used by one of the clients:
- example-angular-app (grpcweb-transport)
- example-browser-grpcweb-transport-client (grpcweb-transport)
- example-node-grpcweb-transport-client (grpcweb-transport)


To start the server, run:

```shell script
dotnet run
```

The server is listening on port 5000 and has a CORS policy to accept requests 
without restrictions.

For a gRPC server (no web), see packages/example-dotnet-grpc-server. It shares 
the same code (except for minor changes in `appsettings.json` and `Startup.cs`).

