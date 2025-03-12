.PHONY: default lerna-make npm-install lerna-bootstrap


# build from scratch
default: npm-install lerna-bootstrap lerna-make

# installs lerna
npm-install:
	npm ci

# link packages and install their dependencies
lerna-bootstrap:
	./node_modules/.bin/lerna bootstrap

# clear the node_modules folder of each package
lerna-clean:
	./node_modules/.bin/lerna clean --yes

# run `make` for every package (with a few exceptions)
lerna-make:
	./node_modules/.bin/lerna exec --stream \
	--ignore @protobuf-ts/example-* \
	--ignore @protobuf-ts/protoc \
	-- make

# update versions in all package.json files
lerna-patch:
	npx lerna version patch --no-changelog --no-git-tag-version --no-push --yes

# update versions in all package.json files
lerna-minor:
	npx lerna version minor --no-changelog --no-git-tag-version --no-push --yes

publish:
	make
	cd packages/runtime; npm publish
	cd packages/runtime-rpc; npm publish
	cd packages/plugin; npm publish
	cd packages/plugin-framework; npm publish
	cd packages/protoc; npm publish
	cd packages/twirp-transport; npm publish
	cd packages/grpcweb-transport; npm publish
	cd packages/grpc-transport; npm publish
	cd packages/grpc-backend; npm publish
