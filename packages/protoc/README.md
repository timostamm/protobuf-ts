@protobuf-ts/protoc
===================

Installs the protocol buffer compiler "protoc" for you. 


Installation (not necessary if you use the [protobuf-ts plugin](https://github.com/timostamm/protobuf-ts/tree/master/packages/plugin)):

```shell script
# with npm:
npm install @protobuf-ts/protoc

# with yarn:
yarn add @protobuf-ts/protoc
```             

Now you can run protoc as usual, you just have to prefix your command with 
`npx` or `yarn`:

```shell script
# with npm:
npx protoc --version 

# with yarn:
yarn protoc --version 
``` 


This will automatically download the latest release of protoc for your 
platform from the github release page, then run the executable with your 
arguments.



#### How it works:

After you have installed `@protobuf-ts/protoc`, a script `protoc` is installed in 
your `node_modules/.bin` folder. When you run `npx protoc` or `yarn protoc`, the 
package manager finds this script and executes it. 

The script will download the latest protoc release for your platform and install 
it in your `./node_modules/@protobuf-ts/protoc/dist` directory. 

The script basically just launches the downloaded protoc, but it adds the 
following behaviour: 

1. add a `--proto_path` argument that points to the `include/` directory of the 
   downloaded release
2. add a `--plugin` argument for all plugins found in `node_modules/.bin/`
3. add a `--proto_path` argument for `node_modules/@protobuf-ts/plugin` 

The package has been tested on macos, linux and windows.


#### Installing a specific version

Add the following to your package json:

```
"config": {
   "protocVersion": "3.11.0"
}
``` 
