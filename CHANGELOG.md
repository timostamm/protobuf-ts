

### UPCOMING

New features:

- RPC client styles
- Option to exclude custom options

Breaking changes:

- the `cancel` method of RPC was removed  
  As a replacement, you can pass an `AbortSignal` in the call options instead.

- plugin option "disable_service_client" was renamed to "force_client_none"


Deprecations:

- the methods `stackUnaryInterceptors`, `stackServerStreamingInterceptors`, 
  `stackClientStreamingInterceptors`, `stackDuplexStreamingInterceptors` are 
  now deprecated. Use `stackIntercept` instead.



### v1.0.6 Bugfix for RangeError in google.protobuf.Timestamp.fromDate()

This patch fixes a bug in the method google.protobuf.Timestamp.fromDate(). 
See issue #22


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


