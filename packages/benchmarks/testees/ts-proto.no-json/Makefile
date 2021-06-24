.PHONY: generate tsc webpack

PROTO_PATH = ../../../test-fixtures
PROTOS	:= ${PROTO_PATH}/google/protobuf/descriptor.proto
OPTIONS := "outputJsonMethods=false,forceLong=string"

generate: $(PROTOS)
	@rm -rf .plugin-out
	@mkdir .plugin-out
	@echo > .plugin-out/parameters.txt "$(OPTIONS)"
	@protoc \
		--ts_proto_out .plugin-out \
		--ts_proto_opt "${OPTIONS}" \
		--plugin ../../node_modules/ts-proto/protoc-gen-ts_proto \
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
