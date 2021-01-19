.PHONY: default generate run-server


default: generate run-server


generate:
	npx protoc -I protos --ts_out protos --ts_opt server_generic,client_call,optimize_code_size protos/service-chat.proto
	# TODO just here for UnhandledPromiseRejectionWarning
	npx protoc -I protos --ts_out protos --ts_opt server_grpc1,optimize_code_size protos/service-chat.proto


run-server:
	npx ts-node server.ts


run-envoy:
	envoy --config-path envoy.yaml


run-client:
	npx ts-node client.ts



build-browser-client:
	@find browser-client -name '*.js' -delete;
	node_modules/.bin/tsc --target ES2015 --module CommonJS --strict --outDir browser-client/.tsc-out browser-client/index.ts
	node_modules/.bin/webpack --mode=development  --stats errors-only  --output-path ./browser-client/.webpack-out/  --output-filename index.js ./browser-client/.tsc-out/browser-client/index.js
	#node_modules/.bin/webpack --mode=production  --stats errors-only  --output-path ./browser-client/.webpack-out/  --output-filename index.js ./browser-client/.tsc-out/browser-client/index.js


serve-browser-client: build-browser-client
	node_modules/.bin/ts-node serve-browser-client.ts


fix-build:
	# the packages grpc-backend, grpc-transport and this package all use @grpc/grpc-js,
	# and all of them are installed separately, which breaks the code.
	# lerna does not link them without hoisting.
	# because we don't know what else hoisting will break, we use the following workaround
	# and link manually.
	rm -rf ../grpc-backend/node_modules/@grpc/grpc-js
	rm -rf ../grpc-transport/node_modules/@grpc/grpc-js
	ln -s -f ../../../example-chat-system/node_modules/@grpc/grpc-js ../grpc-backend/node_modules/@grpc/grpc-js
	ln -s -f ../../../example-chat-system/node_modules/@grpc/grpc-js ../grpc-transport/node_modules/@grpc/grpc-js
