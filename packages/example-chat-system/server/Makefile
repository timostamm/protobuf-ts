.PHONY: default generate run-server


default: generate run-server


generate:
	npx protoc -I .. --ts_out . --ts_opt server_generic,client_none ../service-chat.proto


run-server:
	npx ts-node server.ts


run-envoy:
	envoy --config-path envoy.yaml
