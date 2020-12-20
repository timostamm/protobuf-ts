.PHONY: default generate run-client


default: generate run-client

generate:
	npx protoc -I . --ts_out . --ts_opt generate_dependencies,optimize_code_size service-example.proto

run-client:
	npx ts-node client.ts
