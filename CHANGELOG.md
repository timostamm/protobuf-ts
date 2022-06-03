### unreleased changes

none


### v2.6.0

New Features:

- Add ability to pass grpc-js MetadataOptions to GrpcOptions in @protobuf-ts/grpc-transport #261  
  Thanks to @kskalski for the contribution!

- export createDefinition from @protobuf-ts/grpc-backend #307  
  Thanks to @eyalpost for the contribution!

- Treat null values the same as undefined when generating protobuf messages #299  
  Thanks to @markh123 for the contribution!

- Use Promise as return type for call.then() #308


### v2.5.0

New Features:

- Added disable_service_types option for disabling service metadata generation, see #268  
  Thanks to @ColinLaws for the contribution!

- Change dependency behavior for well-known types.  
  If you have been using the option `generate_dependencies`, you can probably remove it now!  
  See #258 for details.

Bug fixes:

- Fix line breaks in header comments, see #289  
  Thanks to @RyotaSugawara for the fix!
- Avoid cyclic import in binary format contract, see #271
- Use type import in grpc server, see #264

Project maintenance:

- Support go 1.18 in build #263


### v2.4.0

New Features:

- Add option `eslint_disable`, which generates a comment /* eslint-disable */ at the
  top of each file, see #256

Bug fixes:

- Make sure to add non-default longtype to map field info, see #260


### v2.3.0

New Features:

- Add option for preserving original proto field names in generated interfaces. #250  
  Thanks to @kskalksi for the contribution.


### v2.2.4

New Features:

- Relax angular version constraints in runtime-angular, see #246


### v2.2.3

Bug fixes:

- Improved compatibility of grpcweb-transport with TypeScript >= 4.1.5 and skipLibCheck=false,
  see #248


### v2.2.2

New Features:

- For generic servers, support custom contexts, see #201.  
  Thanks to @be9 for the contribution.


### v2.2.1

Bug fixes:

- server_generic option stopped working, see #202.  
  Thanks to @sessfeld for the contribution.


### v2.2.0

New features:

- Add the plugin option `ts_nocheck` to support most strict compiler options in userspace, see #152.
- The new plugin option `add_pb_suffix` adds the suffix `_pb` to all file names, see #186.
- Add service/method name to RpcError, see #197  
  Thanks to @jcready for the contribution.
- Support JavaScript output via plugin option `output_javascript`, see #200.


Bug fixes:

- Use TextDecoder API for decoding UTF-8 from binary data, see #184.  
  We have been using protobuf.js' algorithm to decode UTF-8, but it has had [bugs](https://github.com/protobufjs/protobuf.js/pull/1486)
  in the past. For best possible compatibility, we have switched to the TextDecoder API.
  See [MANUAL](./MANUAL.md#utf-8-decoding) for details.


### v2.1.0

New features:

- Add keep_enum_prefix plugin option #187
- json: Small performance improvement when encoding to JSON, see #191

Note: In the past, protobuf-ts only had patch releases and major releases. Going forward, protobuf-ts will bump the minor version for
releases that add features.


### v2.0.7

New features:

- json: Ignore unknown enum values #170  
  Thanks to @whs for the contribution.

Bug fixes:

- Update parseTrailer function to support empty trailers & trailers with colon in content #168  
  Thanks to @wielski for the contribution.


### v2.0.6

Bug fixes:

- Naming collisions with message named Object #161  
  Thanks to @joeflatt for the report.


### v2.0.5

- Use Symbol.for() to define MESSAGE_TYPE, see #151  
  Thanks to @be9 for the contribution.


### v2.0.4

New features:

- Do not unnecessarily copy read data in BinaryReader, see #148  
  Note that it is now strictly necessary to respect the offset of the underlying buffer
  of byte fields.
- Add `force_exclude_all_options` plugin option, see #126  
  Thanks to @optiman for the suggestion.

Bug fixes:

- The new symbol property `MESSAGE_TYPE` broke user unit tests. The property was set to non-enumerable.  
  Thanks to @jcready for the feedback.


### v2.0.3

New features:

- All messages created with `create()` now have a symbol property `MESSAGE_TYPE`
  that provides access to the messages type. Use `containsMessageType(yourMessage)`
  to check if a message contains its type and access it with `yourMessage[MESSAGE_TYPE]`.

  Note that this is an experimental feature - it is here to stay, but implementation
  details may change without notice.

  Many thanks to @odashevskii-plaid for the contribution.


Bug fixes:

- Generated `create()` method for speed optimized code got left behind in #55  
  Thanks to @odashevskii-plaid for the find!

- Infinite recursion on compile step when using custom option on message used as custom option #141  
  Thanks to @doochik for bringing it up.



### v2.0.2

Bug fixes:

- Revert TypeScript `peerDependency` in @protobuf-ts/plugin to support yarn 2, see #144
- Change `UnknownMessage` from type to interface, see #143



### v2.0.1

New features:

- @protobuf-ts/plugin expresses TypeScript compatibility with
  a `peerDependency` `>=3.8.3`. Thanks to @ghaiklor-wix for the
  suggestion.



### v2.0.0

#### New features

- gRPC server support for @grpc/grpc-js (see #52)  
  Thanks to @badsyntax for inspiration

- gRPC client support for @grpc/grpc-js (see #57)

- Experimental generic server support (see #56)

- gRPC transport (see #45)

- Add oneof accessor / mutator functions, see #129

- More convenience method to read custom options, see #36

- runtime: Message options are now available in reflection
  information, see #35.

- runtime: BinaryReader.skip() supports WireType.StartGroup now.

- plugin: Groups (deprecated proto2 feature) are now completely
  ignored, but should still be treated properly as unknown fields.

- The Twirp and gRPC-web transports let you pass options to fetch() now.  
  See #95, #105.  
  Thanks to @jamesbirtles for the PR!

- Compatibility with Angular 11  
  No code changes, just relaxed peer dependency constraints.

- Compatibility with svelte (type imports), see #94  
  Thanks to @frederikhors for the detailed reports.

- protoc: prefer protoc from $PATH (see #60)

- File option to exclude custom options (see #7)

- Add long_type_number and long_type_bigint plugin options (see #13, thanks @vicb)


#### Bug fixes

- @protobuf-ts/grpc-transport & @grpc/grpc-js dependency, see #136.  
  Thanks to @hugebdu for the report.

- Fix protoc error message "Plugin output is unparseable" for certain
  plugin output sizes, see #134.  
  Thanks to @fenos for the investigation and fix!

- Fix memory leak in @protobuf-ts/grpc-transport, see #107  
  Thanks to @dddenis for the PR!

- twirp-transport is now a bit more compatible with polyfills for
  the fetch API that are incomplete.

- Fix protoc arch detection on Apple Silicon #108  
  Thanks to @lqs for the PR!

- Fixed grpcweb-transport to handle responses with HTTP error status
  and missing content-type header, see #102.  
  Thanks to @frederikhors for the bug report.

- fix wrong grpc status code INTERNAL for aborted server streaming method (see #86)

- Added workaround for unhandled promise rejection (see #86)

- Improve support for the `node-fetch` polyfill (see #81)

- The `generate_dependencies` parameter doesn't work (see #59)  
  Thanks to @jcready for the report and fix.

- grpc-transport does not pass along provided deadline option (see #77)

- grpcweb-transport: Recognize "application/grpc-web-text+proto".

- Fixed conversion of gRPC metadata to our metadata (grpc-transport, grpc-backend)

- Support grpc-web-text format with envoy (see #54)  
  Thanks to @DiogoMaMartins for the bug report.

- Fix windows import path #41

- Proto fields with `[jstype = JS_NUMBER]` were documented as `* @generated from protobuf field: [...] [jstype = JS_STRING];`. (See #27)

- Proto fields with `[jstype = JS_NORMAL]` were generated as `string` when the `long_type_string` plugin parameter was used. (See #27)


#### Breaking changes

- `RpcOptions` takes a `timeout` property now. `deadline` property
  has been removed. See #138 for details.

- The "response" property of ServerStreamingCall and BidiStreamingCall has been renamed "responses".

- The "request" property of ClientStreamingCall and BidiStreamingCall has been renamed "requests".

- plugin option "disable_service_client" was renamed to "force_client_none"

- clients are generated into separate files (see #55)

- The `cancel` method of RPC was removed, see #9  
  As a replacement, you can pass an `AbortSignal` in the call options instead.


#### Breaking changes in non-user-facing code

- runtime: The MessageInfo interface requires the new "options"
  property.

- plugin-framework: IDescriptorInfo.isMessageField() no longer
  returns true for GROUP field type.

- grpcweb-transport: The function `readGrpcWebResponseHeader()` no longer
  returns the format.

- grpcweb-transport: The function `readGrpcWebResponseBody()` no longer takes
  the format as an argument. Instead, it now takes the content-type response
  header value and determines the format on its own.

- The function `mergeExtendedRpcOptions` was renamed to `mergeRpcOptions`.

- RpcOutputStream callback `onNext` is now called with `complete = false` on error.

- the methods `stackUnaryInterceptors`, `stackServerStreamingInterceptors`,
  `stackClientStreamingInterceptors`, `stackDuplexStreamingInterceptors` are
  now deprecated. Use `stackIntercept` instead.



### v2.0.0-alpha.30

Breaking changes:

- `RpcOptions` takes a `timeout` property now. `deadline` property
  has been removed. See #138 for details.


### v2.0.0-alpha.29

Bug fixes:

- @protobuf-ts/grpc-transport & @grpc/grpc-js dependency, see #136.  
  Thanks to @hugebdu for the report.


### v2.0.0-alpha.28

Bug fixes:

- Fix protoc error message "Plugin output is unparseable" for certain
  plugin output sizes, see #134.  
  Thanks to @fenos for the investigation and fix!


New features:

- Add oneof accessor / mutator functions, see #129


Cleanup:

- Rename plugin parameters to "plugin options".  
  The code generator request only accepts a single parameter string,
  but this should be considered an implementation detail. `protoc`
  uses `--ts_opt`, so we should speak of options, not parameters.


### v2.0.0-alpha.27

Bug fixes:

- Fix memory leak in @protobuf-ts/grpc-transport, see #107  
  Thanks to @dddenis for the PR!


### v2.0.0-alpha.26

Bug fixes:

- twirp-transport is now a bit more compatible with polyfills for
  the fetch API that are incomplete.


### v2.0.0-alpha.25

Bug fixes:

- Fix protoc arch detection on Apple Silicon #108  
  Thanks to @lqs for the PR!


### v2.0.0-alpha.24

New feature:

- More convenience method to read custom options, see #36


### v2.0.0-alpha.23

New feature:

- runtime: Message options are now available in reflection
  information, see #35.
- plugin: Groups (deprecated proto2 feature) are now completely
  ignored, but should still be treated properly as unknown fields.
- runtime: BinaryReader.skip() supports WireType.StartGroup now.

Breaking changes:

- runtime: The MessageInfo interface requires the new "options"
  property.
- plugin-framework: IDescriptorInfo.isMessageField() no longer
  returns true for GROUP field type.

### v2.0.0-alpha.22

New features:

- The Twirp and gRPC-web transports let you pass options to fetch() now.  
  See #95, #105.  
  Thanks to @jamesbirtles for the PR!


### v2.0.0-alpha.21

New features:

- Compatibility with Angular 11  
  No code changes, just relaxed peer dependency constraints.


### v2.0.0-alpha.20

Bug Fixes:

- Fixed grpcweb-transport to handle responses with HTTP error status
  and missing content-type header, see #102.  
  Thanks to @frederikhors for the bug report.

Breaking changes:

- grpcweb-transport: The function `readGrpcWebResponseHeader()` no longer
  returns the format.

- grpcweb-transport: The function `readGrpcWebResponseBody()` no longer takes
  the format as an argument. Instead, it now takes the content-type response
  header value and determines the format on its own.



### v1.0.13

v2.0.0-alpha.18 was accidentally published in the "latest" channel.
This release is identical with v1.0.12, it just fixes the "latest"
NPM release.



### v2.0.0-alpha.19

New features:

- Compatibility with svelte (type imports), see #94  
  Thanks to @frederikhors for the detailed reports.


### v2.0.0-alpha.18

This release was accidentally published in the "latest" channel as
v2.0.0-alpha.18

Please disregard.



### v2.0.0-alpha.17

Breaking changes:

- The "response" property of ServerStreamingCall and BidiStreamingCall has been renamed "responses".

- The "request" property of ClientStreamingCall and BidiStreamingCall has been renamed "requests".



### v2.0.0-alpha.16

Breaking changes:

- "client styles" have been removed to keep the plugin simple.

- plugin parameter "client_call" has been renamed to "client_generic".

- service option `(ts.client) = CALL_CLIENT` has been renamed `(ts.client) = GENERIC_CLIENT`.



### v2.0.0-alpha.15

Bug Fixes:

- fix wrong grpc status code INTERNAL for aborted server streaming method (see #86)


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


