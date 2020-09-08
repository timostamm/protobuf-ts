.PHONY: default lerna-make npm-install lerna-bootstrap


# build from scratch
default: npm-install lerna-bootstrap lerna-make

# installs lerna
npm-install:
	npm i

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

# release a new version. must run lerna-make first.
lerna-publish:
	./node_modules/.bin/lerna publish --force-publish --loglevel debug
