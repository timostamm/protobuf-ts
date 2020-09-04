.PHONY: default test-speed test-size test-speed-bigint test-size-bigint generate-size generate-speed generate-speed-bigint generate-size-bigint

PROTO_PATH = ../test-fixtures
PROTOS	:= $(shell find ${PROTO_PATH} -name '*.proto')
SPECS := $(shell find spec -name '*.spec.ts')


default:
	make test-speed
	make test-size
	make test-speed-bigint
	make test-size-bigint


protobuf:
	git clone git@github.com:protocolbuffers/protobuf.git protobuf \
	&& cd protobuf \
	&& git checkout -q c9d2bd2fc781fe67ebf306807b9b6edb4a0d2764 \
	&& bazel build generated_protos build_files_updated_unittest test_messages_proto3_proto conformance_proto conformance_test conformance_test_runner
	@echo "'${@}' done"


test-speed: generate-speed protobuf
	@./node_modules/.bin/ts-node \
		--project tsconfig.json \
		--require tsconfig-paths/register \
		./node_modules/.bin/jasmine --helper="spec/support/reporter.ts" \
		$(SPECS)
	protobuf/bazel-bin/conformance_test_runner --enforce_recommended conformance_ts.ts
	@echo "'${@}' done"

test-size: generate-size protobuf
	@./node_modules/.bin/ts-node \
		--project tsconfig.json \
		--require tsconfig-paths/register \
		./node_modules/.bin/jasmine --helper="spec/support/reporter.ts" \
		$(SPECS)
	protobuf/bazel-bin/conformance_test_runner --enforce_recommended conformance_ts.ts
	@echo "'${@}' done"

test-speed-bigint: generate-speed-bigint protobuf
	@./node_modules/.bin/ts-node \
		--project tsconfig.bigint.json \
		--require tsconfig-paths/register \
		./node_modules/.bin/jasmine --helper="spec/support/reporter.ts" \
		$(SPECS)
	protobuf/bazel-bin/conformance_test_runner --enforce_recommended conformance_ts.ts
	@echo "'${@}' done"

test-size-bigint: generate-size-bigint protobuf
	@./node_modules/.bin/ts-node \
		--project tsconfig.bigint.json \
		--require tsconfig-paths/register \
		./node_modules/.bin/jasmine --helper="spec/support/reporter.ts" \
		$(SPECS)
	protobuf/bazel-bin/conformance_test_runner --enforce_recommended conformance_ts.ts
	@echo "'${@}' done"


generate-speed: $(PROTOS)
	@protoc \
		--plugin=../plugin/bin/protoc-gen-ts \
		--ts_out ./ts-out/ \
		--ts_opt force_optimize_speed \
		--ts_opt long_type_string \
		--ts_opt generate_dependencies \
		--proto_path=$(PROTO_PATH) \
		--experimental_allow_proto3_optional \
		$^


generate-size: $(PROTOS)
	@protoc \
		--plugin=../plugin/bin/protoc-gen-ts \
		--ts_out ./ts-out/ \
		--ts_opt force_optimize_code_size \
		--ts_opt long_type_string \
		--ts_opt generate_dependencies \
		--proto_path=$(PROTO_PATH) \
		--experimental_allow_proto3_optional \
		$^


generate-size-bigint: $(PROTOS)
	@protoc \
		--plugin=../plugin/bin/protoc-gen-ts \
		--ts_out ./ts-out/ \
		--ts_opt force_optimize_code_size \
		--ts_opt generate_dependencies \
		--proto_path=$(PROTO_PATH) \
		--experimental_allow_proto3_optional \
		$^


generate-speed-bigint: $(PROTOS)
	@protoc \
		--plugin=../plugin/bin/protoc-gen-ts \
		--ts_out ./ts-out/ \
		--ts_opt force_optimize_speed \
		--ts_opt generate_dependencies \
		--proto_path=$(PROTO_PATH) \
		--experimental_allow_proto3_optional \
		$^


${PROTO_PATH}/all.descriptorset: $(PROTOS)
	@protoc \
		--descriptor_set_out=${@} \
		--proto_path=${PROTO_PATH} \
		--include_source_info \
		--include_imports \
		--experimental_allow_proto3_optional \
		$^
