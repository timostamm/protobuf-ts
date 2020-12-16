.PHONY: default build clean test example-client
SPECS := $(shell find spec -name '*.spec.ts')


default: clean build test

build:
	@./node_modules/.bin/tsc --project tsconfig.json --module es2015 --outDir build/es2015;
	@echo "es6 done"
	@./node_modules/.bin/tsc --project tsconfig.json --module commonjs --outDir build/commonjs \
		--declaration --declarationDir build/types;
	@echo "cjs done"

clean:
	@find build \( -name '*.js' -or -name '*.map' -or -name '*.ts' \) -delete;
	@find build -type d ! -path build -delete
	@echo "'${@}' done"

test: $(SPECS)
	@echo "'${@}' ..."
	@./node_modules/.bin/ts-node \
		--project tsconfig.test.json \
		./node_modules/.bin/jasmine --helper="spec/support/reporter.ts" \
		$^

example-client:
	npx protoc -I example-client --ts_out example-client/ --ts_opt generate_dependencies,force_client_none example-client/service-all-methods.proto
	npx ts-node example-client/index.ts
