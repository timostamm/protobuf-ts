#!/usr/bin/env bash

npm run all

cd packages/runtime; npm publish
cd packages/runtime-rpc; npm publish
cd packages/plugin; npm publish
cd packages/plugin-framework; npm publish
cd packages/protoc; npm publish
cd packages/twirp-transport; npm publish
cd packages/grpcweb-transport; npm publish
cd packages/grpc-transport; npm publish
cd packages/grpc-backend; npm publish
