@protobuf-ts/runtime-angular
============================

Runtime library for using [protobuf-ts](https://github.com/timostamm/protobuf-ts/) with Angular.


Installation:
                                                                                         
```shell script
npm i @protobuf-ts/runtime @protobuf-ts/runtime-rpc @protobuf-ts/runtime-angular @protobuf-ts/twirp-transport
``` 

You probably want the protoc plugin as well: 
                                                                                         
```shell script
npm i -D @protobuf-ts/plugin
``` 


Usage:

- generate code
  ```shell script
  npx protoc --ts_opt enable_angular_annotations --ts_out src/ my-message.proto
  ```
- import the `PbDatePipeModule` to get the date pipe that works with 
  `google.protobuf.Timestamp` or `google.type.DateTime`
- import `TwirpModule.forRoot()` to get a Twirp transport that uses the Angular `HttpClient`


To learn more, please read the [MANUAL](https://github.com/timostamm/protobuf-ts/blob/master/MANUAL.md#angular-support) 
or check the repository [README](https://github.com/timostamm/protobuf-ts/README.md) for a quick overview.


#### Building this project

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) 
version 10.0.5.

To work with lerna, `package.json` has the `publishConfig.directory` set to `./dist/` 
and the [lifecycle script]( https://github.com/lerna/lerna/tree/master/commands/version#lifecycle-scripts) 
`scripts.version` bumps the versions of `peerDependencies` and updates `dist/package.jsons`. 

