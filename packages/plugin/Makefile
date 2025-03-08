.PHONY: default build clean test
PROTO_PATH = ../proto
PROTOS	:= $(shell find ${PROTO_PATH} -name '*.proto')
SPECS := $(shell find spec -name '*.spec.ts')


default: clean build test

build:
	@npm run build
	@echo "'${@}' done"

clean:
	@npm run clean
	@echo "'${@}' done"

test: all.descriptorset
	@./node_modules/.bin/ts-node \
		--project tsconfig.test.json \
		--require tsconfig-paths/register \
		./node_modules/.bin/jasmine --helper="spec/support/reporter.ts" \
		$(SPECS)

all.descriptorset: $(PROTOS)
	@npx protoc \
		--descriptor_set_out ${@} \
		--proto_path ${PROTO_PATH} \
		--proto_path . \
		--include_source_info \
		--include_imports \
		--experimental_allow_proto3_optional \
		$^
	@echo "'${@}' done"

all.codegenreq: $(PROTOS)
	@npx protoc \
		--dump_out=. \
		--plugin=./bin/protoc-gen-dump \
		--dump_opt "${@}" \
		--proto_path ${PROTO_PATH} \
		--proto_path . \
		--experimental_allow_proto3_optional \
		$^
	@echo "'${@}' done"


