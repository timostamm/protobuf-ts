#!/usr/bin/env bash

npm run all
npx turbo run bootstrap

cd packages/runtime; npm publish; cd ../../;
cd packages/runtime-rpc; npm publish; cd ../../;
cd packages/plugin; npm publish; cd ../../;
cd packages/plugin-framework; npm publish; cd ../../;
cd packages/protoc; npm publish; cd ../../;
cd packages/twirp-transport; npm publish; cd ../../;
cd packages/grpcweb-transport; npm publish; cd ../../;
cd packages/grpc-transport; npm publish; cd ../../;
cd packages/grpc-backend; npm publish; cd ../../;
