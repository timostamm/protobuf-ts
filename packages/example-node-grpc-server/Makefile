.PHONY: default generate run-server


default: generate run-server

generate:
	npx protoc -I . --ts_out . --ts_opt server_grpc,client_none,generate_dependencies,optimize_code_size service-example.proto

run-server:
	npx ts-node server.ts
