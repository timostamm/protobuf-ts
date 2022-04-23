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
