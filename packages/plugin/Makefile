.PHONY: default build clean test
PROTO_PATH = ../proto
PROTOS	:= $(shell find ${PROTO_PATH} -name '*.proto')
SPECS := $(shell find spec -name '*.spec.ts')


default: clean build test

build:
	@./node_modules/.bin/tsc --project tsconfig.build.json;
	@echo "'${@}' done"

clean:
	@find build \( -name '*.js' -or -name '*.map' -or -name '*.ts' \) -delete;
	@find build -type d ! -path build -delete
	@rm -f all.descriptorset
	@rm -f all.codegenreq
	@echo "'${@}' done"

test: all.descriptorset
	@./node_modules/.bin/ts-node \
		--project tsconfig.test.json \
		--require tsconfig-paths/register \
		./node_modules/.bin/jasmine --helper="spec/support/reporter.ts" \
		$(SPECS)

all.descriptorset: $(PROTOS)
	@protoc \
		--descriptor_set_out ${@} \
		--proto_path ${PROTO_PATH} \
		--proto_path . \
		--include_source_info \
		--include_imports \
		--experimental_allow_proto3_optional \
		$^
	@echo "'${@}' done"

all.codegenreq: $(PROTOS)
	@protoc \
		--dump_out=. \
		--plugin=./bin/protoc-gen-dump \
		--dump_opt "${@}" \
		--proto_path ${PROTO_PATH} \
		--proto_path . \
		--experimental_allow_proto3_optional \
		$^
	@echo "'${@}' done"


