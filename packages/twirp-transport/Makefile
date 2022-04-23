.PHONY: default build clean test clientcompat
SPECS := $(shell find spec -name '*.spec.ts')


default: clean build test clientcompat

build:
	@./node_modules/.bin/tsc --project tsconfig.json --module es2015 --outDir build/es2015;
	@echo "es6 done"
	@./node_modules/.bin/tsc --project tsconfig.json --module commonjs --outDir build/commonjs \
		--declaration --declarationDir build/types;
	@echo "cjs done"

clean:
	@find build \( -name '*.js' -or -name '*.map' -or -name '*.ts' \) -delete;
	@find build -type d ! -path build -delete
	@rm -f clientcompat/client.js clientcompat/clientcompat.js clientcompat/clientcompat.client.js
	@echo "'${@}' done"

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


clientcompat: clientcompat7

clientcompat7: build
	protoc \
		--ts_out=clientcompat \
		--plugin=../plugin/bin/protoc-gen-ts \
		--proto_path=clientcompat/ \
		clientcompat/clientcompat.proto
	./node_modules/.bin/tsc --target ES2015 --module commonjs clientcompat/clientcompat.ts clientcompat/client.ts
	go install github.com/twitchtv/twirp/clientcompat@v7.0.0
	${HOME}/go/bin/clientcompat -client clientcompat/client-runner.js

clientcompat8: build
	protoc \
		--ts_out=clientcompat \
		--plugin=../plugin/bin/protoc-gen-ts \
		--proto_path=clientcompat/ \
		clientcompat/clientcompat.proto
	./node_modules/.bin/tsc --target ES2015 --module commonjs clientcompat/clientcompat.ts clientcompat/client.ts
	go install github.com/twitchtv/twirp/clientcompat@v8.0.0
	${HOME}/go/bin/clientcompat -client clientcompat/client-runner.js
