.PHONY: default generate run-server


default: generate run-server

generate:
	npx protoc -I . --ts_out . --ts_opt server_generic,client_none,optimize_code_size service-example.proto

run-server:
	npx ts-node server.ts
