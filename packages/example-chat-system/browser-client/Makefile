.PHONY: generate build serve


default: generate build serve


generate:
	npx protoc -I ../ --ts_out . --ts_opt client_call,optimize_code_size ../service-chat.proto

build:
	npx tsc --target ES2015 --module CommonJS --strict --outDir .tsc-out index.ts
	npx webpack --mode=development  --stats errors-only  --output-path public/  --output-filename index.js ./.tsc-out/browser-client/index.js

serve:
	npx ts-node www.ts

