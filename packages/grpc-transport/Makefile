.PHONY: default build clean test example-client example-server
SPECS := $(shell find spec -name '*.spec.ts')


default: clean build test

build:
	@npm run build

clean:
	@npm run clean

test: $(SPECS)
	@echo "'${@}' ..."
	@./node_modules/.bin/ts-node \
		--project tsconfig.test.json \
		./node_modules/.bin/jasmine --helper="spec/support/reporter.ts" \
		$^
