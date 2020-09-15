@protobuf-ts/example-dotnet-grpcweb-server
==========================================

This is a simple gRPC server using dotnet core. It has built-in grpc
-web support.  

To start the server, run:

```shell script
dotnet run
```

The server is listening on port 5000 and has a CORS policy to accept requests 
without restrictions.

This server can be used together with `../packagesexample-angular-app/`. 


To make the server listen to gRPC (no web), you have to set 
`Kestrel.Protocols = "Http2"` in `appsettings.json`. Both protocols at the same 
time is only possible with SSL.
