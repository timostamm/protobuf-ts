.PHONY: default clean test-runner test-conformance test-conformance-bigint test-spec test-spec-bigint generate-size generate-speed generate-speed-bigint generate-size-bigint

PROTO_PATH = ../test-fixtures
PROTOS	:= $(shell find ${PROTO_PATH} -name '*.proto')
SPECS := $(shell find spec -name '*.spec.ts')
TEST_RUNNER = $(shell command -v conformance-test-runner 2> /dev/null)


default:
	make clean generate-speed 	     test-spec		  test-conformance
	make clean generate-size  	     test-spec		  test-conformance
	make clean generate-speed-bigint test-spec-bigint test-conformance-bigint
	make clean generate-size-bigint  test-spec-bigint test-conformance-bigint


clean:
	@find ts-out \( -name '*.ts' -or -name '*.js' \) -delete
	@echo "'${@}' done"

test-runner:
ifeq ("${TEST_RUNNER}", "")
	make protobuf
	$(eval TEST_RUNNER=protobuf/bazel-bin/conformance_test_runner)
endif

protobuf:
	git clone git@github.com:protocolbuffers/protobuf.git protobuf \
	&& cd protobuf \
	&& git checkout -q c9d2bd2fc781fe67ebf306807b9b6edb4a0d2764 \
	&& bazel build test_messages_proto3_proto conformance_proto conformance_test conformance_test_runner

test-conformance: test-runner
	@npx tsc --target ES2015 --module CommonJS --strict conformance_ts.ts
	@chmod +x conformance_ts.js
	@$(TEST_RUNNER) --enforce_recommended conformance_ts.js
	@echo "'${@}' done"

test-conformance-bigint: test-runner
	@npx tsc --target ES2020 --module CommonJS --strict conformance_ts.ts
	@chmod +x conformance_ts.js
	@$(TEST_RUNNER) --enforce_recommended conformance_ts.js
	@echo "'${@}' done"

test-spec:
	@./node_modules/.bin/ts-node \
		--project tsconfig.json \
		--require tsconfig-paths/register \
		./node_modules/.bin/jasmine --helper="spec/support/reporter.ts" \
		$(SPECS)
	@echo "'${@}' done"

test-spec-bigint:
	@./node_modules/.bin/ts-node \
		--project tsconfig.bigint.json \
		--require tsconfig-paths/register \
		./node_modules/.bin/jasmine --helper="spec/support/reporter.ts" \
		$(SPECS)
	@echo "'${@}' done"


generate-speed: $(PROTOS)
	@npx protoc \
		--ts_out ./ts-out/ \
		--ts_opt force_optimize_speed \
		--ts_opt long_type_string \
		--proto_path $(PROTO_PATH) \
		--proto_path ../plugin/ \
		--experimental_allow_proto3_optional \
		$^
	@echo "'${@}' done"


generate-size: $(PROTOS)
	@npx protoc \
		--ts_out ./ts-out/ \
		--ts_opt force_optimize_code_size \
		--ts_opt long_type_string \
		--proto_path $(PROTO_PATH) \
		--proto_path ../plugin/ \
		--experimental_allow_proto3_optional \
		$^
	@echo "'${@}' done"


generate-size-bigint: $(PROTOS)
	@npx protoc \
		--ts_out ./ts-out/ \
		--ts_opt force_optimize_code_size \
		--proto_path $(PROTO_PATH) \
		--proto_path ../plugin/ \
		--experimental_allow_proto3_optional \
		$^
	@echo "'${@}' done"


generate-speed-bigint: $(PROTOS)
	@npx protoc \
		--ts_out ./ts-out/ \
		--ts_opt force_optimize_speed \
		--proto_path $(PROTO_PATH) \
		--proto_path ../plugin/ \
		--experimental_allow_proto3_optional \
		$^
	@echo "'${@}' done"


${PROTO_PATH}/all.descriptorset: $(PROTOS)
	@npx protoc \
		--descriptor_set_out ${@} \
		--proto_path $(PROTO_PATH) \
		--proto_path ../plugin/ \
		--include_source_info \
		--include_imports \
		--experimental_allow_proto3_optional \
		$^
	@echo "'${@}' done"
