
# TODO

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
