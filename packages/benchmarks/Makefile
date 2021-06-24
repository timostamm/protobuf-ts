.PHONY: default perf code-size testees-generate testees-webpack

PROTO_PATH = ../test-fixtures
PROTOS	:= ${PROTO_PATH}/google/protobuf/descriptor.proto
TESTEES := $(shell find ./testees -type d -maxdepth 1 -mindepth 1)


default: code-size


perf: ${PROTO_PATH}/all.descriptorset testees-generate
	./node_modules/.bin/ts-node --project tsconfig.json perf.ts
	@echo "'${@}' done"


code-size: testees-webpack
	@npx ts-node code-size.ts

testees-generate: $(TESTEES)
	@for testee in $(TESTEES) ; do \
    	cd $$testee && make; \
    	cd ../..; \
	done

testees-webpack: $(TESTEES)
	@for testee in $(TESTEES) ; do \
    	cd $$testee && make webpack; \
    	cd ../..; \
	done

${PROTO_PATH}/all.descriptorset: $(PROTOS)
	@protoc \
		--descriptor_set_out=${@} \
		--proto_path=${PROTO_PATH} \
		--include_source_info \
		--include_imports \
		--experimental_allow_proto3_optional \
		$^
	@echo "'${@}' done"
