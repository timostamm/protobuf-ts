.PHONY: generate webpack tsc

PROTO_PATH = ../../../test-fixtures
PROTOS	:= ${PROTO_PATH}/google/protobuf/descriptor.proto
OPTIONS := "import_style=commonjs,binary"

generate: $(PROTOS)
	@rm -rf .plugin-out
	@mkdir .plugin-out
	@echo > .plugin-out/parameters.txt "$(OPTIONS)"
	@protoc \
		--js_out .plugin-out \
		--js_opt "${OPTIONS}" \
		--ts_out .plugin-out \
		--plugin ../../node_modules/ts-protoc-gen/bin/protoc-gen-ts \
		--proto_path $(PROTO_PATH) \
		--experimental_allow_proto3_optional \
		$^

tsc: generate
	@rm -rf .tsc-out
	@mkdir .tsc-out
	@cp -r .plugin-out .tsc-out/
	@npx tsc --rootDir ./ --baseUrl ./ --strict --module ES2015 --target ES2015 --moduleResolution node \
		index.ts --outDir .tsc-out

webpack: tsc
	@rm -rf .webpack-out
	@mkdir .webpack-out
	@npx webpack --mode=production \
		--display-used-exports=true \
		--display-provided-exports=true \
		--display-optimization-bailout=true \
		--display-entrypoints=false \
		--display-chunks=false \
		--display-modules=true --display-max-modules 999 \
		--display-reasons=false \
		--config ../../webpack.config.js \
		--output .webpack-out/index.js \
		.tsc-out/index.js \
		> .webpack-out/webpack.log;
