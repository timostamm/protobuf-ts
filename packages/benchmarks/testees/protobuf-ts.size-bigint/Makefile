.PHONY: generate tsc webpack

PROTO_PATH = ../../../test-fixtures
PROTOS	:= ${PROTO_PATH}/google/protobuf/descriptor.proto
OPTIONS := "force_optimize_code_size,long_type_bigint"

generate: $(PROTOS)
	@rm -rf .plugin-out
	@mkdir .plugin-out
	@echo > .plugin-out/parameters.txt "$(OPTIONS)"
	@protoc \
		--ts_out .plugin-out \
		--ts_opt "${OPTIONS}" \
		--plugin ../../node_modules/@protobuf-ts/plugin/bin/protoc-gen-ts \
		--proto_path $(PROTO_PATH) \
		--experimental_allow_proto3_optional \
		$^

tsc: generate
	@rm -rf .tsc-out
	@mkdir .tsc-out
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
