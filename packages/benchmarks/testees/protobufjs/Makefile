.PHONY: generate webpack

PROTO_PATH = ../../../test-fixtures
PROTOS	:= ${PROTO_PATH}/google/protobuf/descriptor.proto
OPTIONS := ""

generate: $(PROTOS)
	@rm -rf .plugin-out
	@mkdir .plugin-out
	@echo > .plugin-out/parameters.txt "$(OPTIONS)"
	@npx pbjs -t static-module -w commonjs -o .plugin-out/descriptor.js $(PROTOS)
	@npx pbts -o .plugin-out/descriptor.d.ts .plugin-out/descriptor.js

webpack: generate
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
		index.js \
		> .webpack-out/webpack.log;
