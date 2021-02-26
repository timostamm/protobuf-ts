### unreleased changes


none


### v2.0.0-alpha.14

Bug Fixes:

- Added workaround for unhandled promise rejection (see #86)


### v2.0.0-alpha.13

Breaking changes:

- grpcweb-transport deadline option is used as a timeout, but should be used as a timestamp (see #80)

Bug Fixes: 

- Improve support for the `node-fetch` polyfill (see #81)



### v2.0.0-alpha.12

Breaking changes:

- Use package version in GRPC_SERVER and RX_CLIENT (see #65)

Bug Fixes:

- The `generate_dependencies` parameter doesn't work (see #59)  
  Thanks to @jcready for the report and fix.

- grpc-transport does not pass along provided deadline option (see #77)

Security Fixes:

- Bump socket.io from 2.3.0 to 2.4.1 (see #68)  
  Package is only used for development.



### v2.0.0-alpha.11

Bug Fixes:

- grpcweb-transport: Recognize "application/grpc-web-text+proto".

New features:

- protoc: prefer protoc from $PATH (see #60)


### v2.0.0-alpha.10

New features:

- support client cancel in generic servers / grpc-backend (see #56)


Bug Fixes:

- Fixed conversion of gRPC metadata to our metadata (grpc-transport, grpc-backend)
- Fixed service binding to work with class instances (grpc-backend)
- Fixed isServiceError failure (grpc-transport, grpc-backend)


### v2.0.0-alpha.9

New features:

- Generic server support (see #56)


Breaking changes:

- clients are generated into separate files (see #55)
- option values for (ts.client) have changed (see #55)
- ClientStyle enum is no longer exported from @protobuf-ts/runtime-rpc (see #55)


### v2.0.0-alpha.8

New features:

- gRPC server support for @grpc/grpc-js (see #52)  
  Thanks to @badsyntax for inspiration


### v2.0.0-alpha.7

Bug Fixes:

- Support grpc-web-text format with envoy (see #54)  
  Thanks to @DiogoMaMartins for the bug report.


### v2.0.0-alpha.6

Bug Fixes:

- fix missing true values for clientStreaming and serverStreaming properties of generated service info


### v2.0.0-alpha.5

New features:

- server streaming and client streaming added to experimental gRPC transport (see #45)


### v1.0.12 

This patch removes source mappings and declaration mappings from 
the npm packages. See #40. 

Thanks to @johnsoncodehk and @tlstyer for the reports.


### v2.0.0-alpha.4

New features:

- Experimental gRPC transport (see #45)


Breaking changes:

- The function `mergeExtendedRpcOptions` was renamed to `mergeRpcOptions`.  


### v2.0.0-alpha.3

- Fix windows import path #41


### v1.0.11 Bugfix for windows import path

This patch fixes generated import path on windows platform.  
Thanks to @SyedAsimAliSE for bringing this issue up.


### v2.0.0-alpha.2

- Do not output source mappings and declaration mappings #40


### v2.0.0-alpha.0

New features:

- RPC client styles (see #10)
- Option to exclude custom options (see #7)
- Add long_type_number and long_type_bigint parameters (see #13, thanks @vicb)


Bug Fixes:

- Proto fields with `[jstype = JS_NUMBER]` were documented as `* @generated from protobuf field: [...] [jstype = JS_STRING];`. (See #27)
- Proto fields with `[jstype = JS_NORMAL]` were generated as `string` when the `long_type_string` plugin parameter was used. (See #27)


Breaking changes:

- The `cancel` method of RPC was removed, see #9  
  As a replacement, you can pass an `AbortSignal` in the call options instead.  
- plugin option "disable_service_client" was renamed to "force_client_none"
- RpcOutputStream callback `onNext` is now called with `complete = false` on error.


Deprecations:

- the methods `stackUnaryInterceptors`, `stackServerStreamingInterceptors`, 
  `stackClientStreamingInterceptors`, `stackDuplexStreamingInterceptors` are 
  now deprecated. Use `stackIntercept` instead.



### v1.0.10 Bugfix for jstype = JS_STRING field option for speed optimized code

This patch fixes a bug in the plugin: The field option jstype = JS_STRING 
would generate invalid code for optimized speed. 

The problem only surfaces if the plugin parameter long_type_string
is *not* set and code is optimized for speed (instead of for code size).
See PR #29


### v1.0.9 Bugfix for jstype = JS_STRING field option

This patch fixes a bug in the plugin: The field option jstype = JS_STRING 
would still generate an interface with a bigint property. The problem only 
surfaces if the plugin parameter long_type_string is *not* set.  
See PR #28


### v1.0.8 Bugfix for Safari 14 bigint detection

This patch fixes issue #24

Thanks to @pedelman and @pzeinlinger for the bug reports!


### v1.0.7 Bugfix for RangeError in google.protobuf.Timestamp.fromDate()

This patch fixes a bug in the method google.protobuf.Timestamp.fromDate(). 
See issue #22


### v1.0.6 Support protoc install on older node versions

This patch fixes issue #16.

Thanks to @Caffeinix for bringing the issue up.


### v1.0.5 Bugfix for name clash with global Error object

This patch fixes a bug in the speed-optimized generated code.
The generated code for a message named "Error" would not compile.

Thanks to @pedelman for the contribution!


### v1.0.4 Compatibility with react

Previous releases were using const enums. They are incompatible with the compiler option "isolatedModules" used by react.

This release:

- changes all const enum declarations to plain enum
- updates generated reflection information to numerical literal with a comment to keep code size small
- activates compiler option "isolatedModules" for the "test-generated" package to cover regressions

Thanks to @pedelman for bringing this issue up!



### v1.0.3 Bugfix for missing custom field options

This patch fixes issue #2


### v1.0.2 Automatic protoc installation

This release adds automatic installation of the protocol buffer compiler.

Installation is managed by the new package @protobuf-ts/protoc and is 
tested on macos, linux and windows.


### v1.0.1 Bugfix for MessageType.clone()

This patch fixes issue #1


### v1.0.0 First release

This is the first public release of protobuf-ts.


