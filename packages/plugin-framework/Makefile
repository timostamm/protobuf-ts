.PHONY: default build clean test
PROTO_PATH = ../proto
PROTOS	:= $(shell find ${PROTO_PATH} -name '*.proto')
SPECS := $(shell find spec -name '*.spec.ts')


default: clean build test

build:
	@npm run build

clean:
	@npm run clean
	@echo "'${@}' done"

test:
	@echo "'${@}' ..."
	@./node_modules/.bin/ts-node \
		--project tsconfig.test.json \
		--require tsconfig-paths/register \
		./node_modules/.bin/jasmine --helper="spec/support/reporter.ts" \
		$(SPECS)

bootstrap:
	protoc \
		--ts_out=src \
		--plugin=../plugin/bin/protoc-gen-ts \
		--proto_path=src/ \
		--ts_opt=force_optimize_code_size \
		--ts_opt=long_type_string \
		--experimental_allow_proto3_optional \
		google/protobuf/descriptor.proto \
		google/protobuf/compiler/plugin.proto

all.codegenreq: $(PROTOS)
	@protoc \
		--dump_out=. \
		--plugin=./bin/protoc-gen-dump \
		--proto_path ../plugin/ \
		--dump_opt="${@}" \
		--proto_path=${PROTO_PATH} \
		--experimental_allow_proto3_optional \
		$^
	@echo "'${@}' done"


