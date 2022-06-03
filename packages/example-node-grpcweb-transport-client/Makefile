.PHONY: default npm-install generate run-client


default: npm-install generate run-client

npm-install:
	npm i

generate:
	npx protoc -I . --ts_out . --ts_opt optimize_code_size service-example.proto

run-client:
	npx ts-node client.ts
