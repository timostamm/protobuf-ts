.PHONY: default build clean test clientcompat
SPECS := $(shell find spec -name '*.spec.ts')


default: clean build test clientcompat

build:
	@npm run build

clean:
	@npm run clean

# TODO
test: test-node test-browser

test-node: $(SPECS)
	@echo "'${@}' ..."
	@./node_modules/.bin/ts-node \
		--project tsconfig.test.json \
		./node_modules/.bin/jasmine --helper="spec/support/reporter.ts" \
		$^

test-browser:
	@echo "'${@}' ..."
	@./node_modules/.bin/karma start karma.conf.js


# TODO
clientcompat: clientcompat7

clientcompat7: build
	npx protoc \
		--ts_out=clientcompat \
		--plugin=../plugin/bin/protoc-gen-ts \
		--proto_path=clientcompat/ \
		clientcompat/clientcompat.proto
	./node_modules/.bin/tsc --target ES2015 --module commonjs clientcompat/clientcompat.ts clientcompat/client.ts
	go install github.com/twitchtv/twirp/clientcompat@v7.0.0
	${HOME}/go/bin/clientcompat -client clientcompat/client-runner.js

clientcompat8: build
	npx protoc \
		--ts_out=clientcompat \
		--plugin=../plugin/bin/protoc-gen-ts \
		--proto_path=clientcompat/ \
		clientcompat/clientcompat.proto
	./node_modules/.bin/tsc --target ES2015 --module commonjs clientcompat/clientcompat.ts clientcompat/client.ts
	go install github.com/twitchtv/twirp/clientcompat@v8.0.0
	${HOME}/go/bin/clientcompat -client clientcompat/client-runner.js
