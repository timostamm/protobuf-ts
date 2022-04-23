.PHONY: default generate build pack


default: generate build pack

generate:
	npx protoc -I . --ts_out . --ts_opt optimize_code_size service-example.proto

build:
	npx tsc --target ES2015 --module CommonJS --strict --outDir .tsc-out client.ts

pack:
	 npx webpack --mode=development --output .webpack-out/client.js .tsc-out/client.js
