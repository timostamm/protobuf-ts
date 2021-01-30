.PHONY: default npm-install generate run-client
PROTO_PATH = ../test-fixtures


default: npm-install generate run-client

npm-install:
	npm i

generate:
	npx protoc -I ${PROTO_PATH} --ts_out . --ts_opt optimize_code_size ${PROTO_PATH}/service-twirp-example.proto

run-client:
	npx ts-node client.ts
