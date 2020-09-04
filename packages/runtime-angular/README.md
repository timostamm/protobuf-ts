@protobuf-ts/runtime-angular
============================

Runtime library for using [protobuf-ts](https://github.com/timostamm/protobuf-ts/README.md) with Angular.

If you generate code with the protobuf-ts plugin and the `enable_angular_annotations` 
option, or if you want to use the `PbDatePipe` to format `google.protobuf.Timestamp` 
or `google.type.DateTime` like a JavaScript Date, you need this package as a dependency:
                                                                                                      
```shell script
npm i @protobuf-ts/runtime-angular
``` 


The features provided by this package are documented in the [MANUAL](https://github.com/timostamm/protobuf-ts/MANUAL.md#angular-support).  
For a quick overview of `protobuf-ts`, check the repository [README](https://github.com/timostamm/protobuf-ts/README.md).


#### Building this project

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) 
version 10.0.5.

To work with lerna, `package.json` has the `publishConfig.directory` set to `./dist/` 
and the [lifecycle script]( https://github.com/lerna/lerna/tree/master/commands/version#lifecycle-scripts) 
`scripts.version` bumps the versions of `peerDependencies` and updates `dist/package.jsons`. 

