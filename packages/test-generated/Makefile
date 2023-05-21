.PHONY: default clean test-runner test-spec test-spec-bigint generate-size generate-speed generate-speed-bigint generate-size-bigint

PROTO_PATH = ../proto
PROTOS	:= $(shell find ${PROTO_PATH} -name '*.proto')
SPECS := $(shell find spec -name '*.spec.ts')


default:
	make clean generate
	make test-spec

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

generate: generate-speed generate-size generate-speed-bigint generate-size-bigint

generate-speed: $(PROTOS)
	@npx protoc \
		--ts_out ./ts-out/speed/ \
		--ts_opt force_optimize_speed \
		--ts_opt long_type_string \
		--proto_path $(PROTO_PATH) \
		--proto_path ../plugin/ \
		--experimental_allow_proto3_optional \
		$^
	@echo "'${@}' done"

generate-size: $(PROTOS)
	@npx protoc \
		--ts_out ./ts-out/size/ \
		--ts_opt force_optimize_code_size \
		--ts_opt long_type_string \
		--proto_path $(PROTO_PATH) \
		--proto_path ../plugin/ \
		--experimental_allow_proto3_optional \
		$^
	@echo "'${@}' done"

generate-size-bigint: $(PROTOS)
	@npx protoc \
		--ts_out ./ts-out/size-bigint/ \
		--ts_opt force_optimize_code_size \
		--proto_path $(PROTO_PATH) \
		--proto_path ../plugin/ \
		--experimental_allow_proto3_optional \
		$^
	@echo "'${@}' done"

generate-speed-bigint: $(PROTOS)
	@npx protoc \
		--ts_out ./ts-out/speed-bigint/ \
		--ts_opt force_optimize_speed \
		--proto_path $(PROTO_PATH) \
		--proto_path ../plugin/ \
		--experimental_allow_proto3_optional \
		$^
	@echo "'${@}' done"
