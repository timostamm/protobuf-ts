.PHONY: default generate run-server


default: generate run-server

generate:
	npx protoc -I . --ts_out . --ts_opt server_generic,client_call,optimize_code_size service-chat.proto

run-server:
	npx ts-node server.ts

run-client:
	npx ts-node client.ts

fix-build:
	# lerna links packages. now grpc-transport uses a different @grpc/grpc-js installation.
	# this fixes this problem.
	npm i
	cd ../grpc-transport && make build
	cp -r ../grpc-transport/build/* node_modules/@protobuf-ts/grpc-transport/build
	cd ../grpc-backend && make build
	cp -r ../grpc-backend/build/* node_modules/@protobuf-ts/grpc-backend/build
