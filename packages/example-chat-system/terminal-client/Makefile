.PHONY: generate build serve


default: generate run


generate:
	npx protoc -I ../ --ts_out . --ts_opt client_generic,optimize_code_size ../service-chat.proto

run:
	npx ts-node client.ts

