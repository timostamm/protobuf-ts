.PHONY: default clean test-runner test-spec test-spec-bigint generate-size generate-speed generate-speed-bigint generate-size-bigint

PROTO_PATH = ../test-fixtures
PROTOS	:= $(shell find ${PROTO_PATH} -name '*.proto')
SPECS := $(shell find spec -name '*.spec.ts')


default:
	make clean generate-speed 	     test-spec
	make clean generate-size  	     test-spec
	make clean generate-speed-bigint test-spec-bigint
	make clean generate-size-bigint  test-spec-bigint


clean:
	@find ts-out \( -name '*.ts' -or -name '*.js' \) -delete
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
