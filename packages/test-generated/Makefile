.PHONY: default clean test

PROTO_PATH = ../proto
PROTOS	:= $(shell find ${PROTO_PATH} -name '*.proto')
SPECS := $(shell find . -name '*.spec.ts')


default:
	make clean
	make generate
	make test

clean:
	rm -rf */gen/*
	@echo "'${@}' done"

test:
	@./node_modules/.bin/ts-node \
		--project tsconfig.json \
		--require tsconfig-paths/register \
		./node_modules/.bin/jasmine --helper="jasmine-reporter.ts" \
		$(SPECS)
	@echo "'${@}' done"

generate:
	make gen-spec
	make gen-default
	make gen-force_optimize_code_size
	make gen-force_optimize_code_size,long_type_string
	make gen-force_optimize_speed
	make gen-force_optimize_speed,long_type_string

gen-spec:
	node scripts/sync-specs.js

gen-default: $(PROTOS)
	@npx protoc \
		--ts_out default/gen \
		--proto_path $(PROTO_PATH) --proto_path ../plugin/ --experimental_allow_proto3_optional $^

gen-force_optimize_code_size: $(PROTOS)
	@npx protoc \
		--ts_out force_optimize_code_size/gen \
		--ts_opt force_optimize_code_size \
		--proto_path $(PROTO_PATH) --proto_path ../plugin/ --experimental_allow_proto3_optional $^

gen-force_optimize_code_size,long_type_string: $(PROTOS)
	@npx protoc \
		--ts_out force_optimize_code_size,long_type_string/gen \
		--ts_opt force_optimize_code_size \
		--ts_opt long_type_string \
		--proto_path $(PROTO_PATH) --proto_path ../plugin/ --experimental_allow_proto3_optional $^

gen-force_optimize_speed: $(PROTOS)
	@npx protoc \
		--ts_out force_optimize_speed/gen \
		--ts_opt force_optimize_speed \
		--ts_opt long_type_string \
		--proto_path $(PROTO_PATH) --proto_path ../plugin/ --experimental_allow_proto3_optional $^

gen-force_optimize_speed,long_type_string: $(PROTOS)
	@npx protoc \
		--ts_out force_optimize_speed,long_type_string/gen \
		--ts_opt force_optimize_code_size \
		--ts_opt long_type_string \
		--proto_path $(PROTO_PATH) --proto_path ../plugin/ --experimental_allow_proto3_optional $^
