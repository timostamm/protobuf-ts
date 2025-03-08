.PHONY: default build clean test
SPECS := $(shell find spec -name '*.spec.ts')


default: clean build test

build:
	@npm run build

clean:
	@npm run clean

test: test-node test-browser

test-node: $(SPECS)
	@echo "'${@}' ..."
	@./node_modules/.bin/ts-node \
		--project tsconfig.test.json \
		--require tsconfig-paths/register \
		./node_modules/.bin/jasmine --helper="spec/support/reporter.ts" \
		$^

test-browser:
	@echo "'${@}' ..."
	@./node_modules/.bin/karma start karma.conf.js

watch-test-node:
	fswatch -o src | xargs -n1 -I{} make test-node
