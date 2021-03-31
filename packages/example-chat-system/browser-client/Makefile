.PHONY: generate build serve


default: generate build serve


generate:
	npx protoc -I ../ --ts_out . --ts_opt client_generic,optimize_code_size ../service-chat.proto

build:
	find .tsc-out -name '*.js' -delete;
	npx tsc --target ES2015 --module CommonJS --strict --outDir .tsc-out index.ts
	npx webpack --mode=development  --stats errors-only  --output-path public/  --output-filename index.js ./.tsc-out/index.js

serve:
	npx ts-node www.ts

