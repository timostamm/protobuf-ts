.PHONY: default perf code-size generate

PROTO_PATH = ../test-fixtures
PROTOS	:= ${PROTO_PATH}/google/protobuf/descriptor.proto


default: code-size


perf: ${PROTO_PATH}/all.descriptorset generate
	./node_modules/.bin/ts-node --project tsconfig.json perf.ts
	@echo "'${@}' done"


code-size: generate
	@npx ts-node code-size.ts


generate: $(PROTOS)
	@npx pbf $(PROTOS) > testees/pbf-out/descriptor.js
	@protoc \
		--ts_proto_out ./testees/ts-proto-out/ \
		--ts_proto_opt forceLong=long \
		--plugin ./node_modules/ts-proto/protoc-gen-ts_proto \
		--proto_path $(PROTO_PATH) \
		--experimental_allow_proto3_optional \
		$^
	@protoc \
		--ts_out ./testees/speed-out/ \
		--ts_opt force_optimize_speed,long_type_string \
		--plugin ./node_modules/.bin/protoc-gen-ts \
		--proto_path $(PROTO_PATH) \
		--experimental_allow_proto3_optional \
		$^
	@protoc \
		--ts_out ./testees/size-out/ \
		--ts_opt force_optimize_code_size,long_type_string \
		--plugin ./node_modules/.bin/protoc-gen-ts \
		--proto_path $(PROTO_PATH) \
		--experimental_allow_proto3_optional \
		$^
	@protoc \
		--ts_out ./testees/speed-bigint-out/ \
		--ts_opt force_optimize_speed \
		--plugin ./node_modules/.bin/protoc-gen-ts \
		--proto_path $(PROTO_PATH) \
		--experimental_allow_proto3_optional \
		$^
	@protoc \
		--ts_out ./testees/size-bigint-out/ \
		--ts_opt force_optimize_code_size \
		--plugin ./node_modules/.bin/protoc-gen-ts \
		--proto_path=$(PROTO_PATH) \
		--experimental_allow_proto3_optional \
		$^
	@echo "'${@}' done"


${PROTO_PATH}/all.descriptorset: $(PROTOS)
	@protoc \
		--descriptor_set_out=${@} \
		--proto_path=${PROTO_PATH} \
		--include_source_info \
		--include_imports \
		--experimental_allow_proto3_optional \
		$^
	@echo "'${@}' done"
