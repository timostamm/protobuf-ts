.PHONY: default npm-install generate run-client


default: npm-install generate run-client

npm-install:
	npm i

generate:
	npx protoc -I . --ts_out . --ts_opt optimize_code_size service-example.proto

run-client:
	npx ts-node client.ts


fix-build:
	# the packages grpc-backend, grpc-transport and this package all use @grpc/grpc-js,
	# and all of them are installed separately, which breaks the code.
	# lerna does not link them without hoisting.
	# because we don't know what else hoisting will break, we use the following workaround
	# and link manually.
	rm -rf ../grpc-backend/node_modules/@grpc/grpc-js
	rm -rf ../grpc-transport/node_modules/@grpc/grpc-js
	ln -s -f ../../../example-node-grpc-transport-client/node_modules/@grpc/grpc-js ../grpc-backend/node_modules/@grpc/grpc-js
	ln -s -f ../../../example-node-grpc-transport-client/node_modules/@grpc/grpc-js ../grpc-transport/node_modules/@grpc/grpc-js

