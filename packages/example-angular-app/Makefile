
PROTO_PATH = ../test-fixtures
PROTOS	:= $(shell find ${PROTO_PATH} -name '*.proto')


generate: $(PROTOS)
	@npx protoc \
		--ts_out src/protoc-gen-ts-out/ \
		--ts_opt enable_angular_annotations \
		--ts_opt long_type_string \
		--proto_path $(PROTO_PATH) \
		--proto_path ../plugin/ \
		--experimental_allow_proto3_optional \
		$^
	@echo "'${@}' done"


ng-serve:
	./node_modules/.bin/ng serve

ng-test:
	./node_modules/.bin/ng test

ng-build-prod:
	./node_modules/.bin/ng  build --prod

