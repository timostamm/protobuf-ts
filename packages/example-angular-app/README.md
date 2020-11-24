@protobuf-ts/example-angular-app
================================

This is an example project for using `protobuf-ts` with Angular.  
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.7.

It shows the usage of:
 - unary and server streaming service calls
 - the gRPC-web transport provided by `@protobuf-ts/grpcweb-transport`
 - the Twirp transport provided by `@protobuf-ts/twirp-transport`
 - the `DatePipe` provided by `@protobuf-ts/runtime-angular`
 - the `RPC_TRANSPORT` injection token provided by `@protobuf-ts/runtime-angular`

To get started, run `make generate` to generate some typescript code from .proto files.  
Then start the development server by running `ng serve` and navigate to `http://localhost:4200/`.  
To test the gRPC-web services, run the server `example-dotnet-grpcweb-server`.

If the page stays empty and you get `Uncaught TypeError: Cannot read property 'id' of undefined`
in your browser console, run `ng serve` again. This issue is caused by the lerna linked 
packages and ivy compilation.  
