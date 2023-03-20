bsr-plugin
==========

protobuf-ts is available as a remote plugin hosted on the Buf Schema Registry:  
https://buf.build/timostamm/plugins/protobuf-ts


Which lets you compile your proto files with the [Buf CLI](https://docs.buf.build/installation):

```yaml
# buf.gen.yaml
version: v1
plugins:
  - remote: buf.build/timostamm/plugins/protobuf-ts:v2.2.2-1
    out: gen/
    opt:
      - long_type_string
```

```sh
buf generate
```

bsr-template
============

protobuf-ts is also available as a remote template:
https://buf.build/timostamm/templates/protobuf-ts

This template lets you `npm install` BSR modules: 

First, we need to tell `npm` to request modules starting with `@buf` 
from the BSR npm registry at https://npm.buf.build:

```shell
# you only need to do this once
npm config set @buf:registry https://npm.buf.build
```

Now we install the module [buf.build/timostamm/module-x](https://buf.build/timostamm/module-x/docs)
via NPM:

```shell
# let's create a test project
mkdir test
cd test
npm init -y

# and install the package
npm install @buf/timostamm_protobuf-ts_timostamm_module-x
```

The package name contains the template name and the module name.
To learn more, see the [docs](https://docs.buf.build/bsr/remote-generation/js#package-names).

If you take a look at the `node_modules` directory, you can see that
not only `module-x` got installed, but also its dependency `module-y`,
its transitive dependency `module-z`, and the runtime libraries 
`@protobuf-ts/runtime` and `@protobuf-ts/runtime-rpc`.

Let's test it by adding a file `index.ts`:

```typescript
import {X} from "@buf/timostamm_protobuf-ts_timostamm_module-x/x/v1/x_pb";

let json = {
  y: {
    z: {}
  }
};

let x = X.fromJson(json);
console.log("We just created an instance of the message x.v1.X:", x)
```

```shell
$ npx -y esbuild index.ts --bundle | node
We just created an instance of the message x.v1.X: { y: { z: {} } }
```

