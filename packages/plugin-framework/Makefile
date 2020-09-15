.PHONY: default build clean test
PROTO_PATH = ../test-fixtures
PROTOS	:= $(shell find ${PROTO_PATH} -name '*.proto')
SPECS := $(shell find spec -name '*.spec.ts')


default: clean build test

build:
	@./node_modules/.bin/tsc --project tsconfig.json --module es2015 --outDir build/es2015;
	@echo "es6 done"
	@./node_modules/.bin/tsc --project tsconfig.json --module commonjs --outDir build/commonjs \
		--declaration --declarationMap --declarationDir build/types;
	@echo "cjs done"

clean:
	@find build \( -name '*.js' -or -name '*.map' -or -name '*.ts' \) -delete;
	@find build -type d ! -path build -delete
	@find ../test-fixtures \( -name '*.codegenreq' -or -name '*.descriptorset' \) -delete;
	@echo "'${@}' done"

test: ${PROTO_PATH}/all.descriptorset
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

${PROTO_PATH}/all.descriptorset: $(PROTOS)
	@protoc \
		--descriptor_set_out=${@} \
		--proto_path=${PROTO_PATH} \
		--proto_path ../plugin/ \
		--include_source_info \
		--include_imports \
		--experimental_allow_proto3_optional \
		$^
	@echo "'${@}' done"

${PROTO_PATH}/all.codegenreq: $(PROTOS)
	@protoc \
		--dump_out=. \
		--plugin=./bin/protoc-gen-dump \
		--proto_path ../plugin/ \
		--dump_opt="${@}" \
		--proto_path=${PROTO_PATH} \
		--experimental_allow_proto3_optional \
		$^
	@echo "'${@}' done"


