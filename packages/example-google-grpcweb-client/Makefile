.PHONY: default generate build


default: generate build


generate:
	protoc \
  		--js_out=import_style=commonjs:src \
  		--grpc-web_out=import_style=commonjs,mode=grpcwebtext:src \
  		--proto_path ./protos/ \
  		./protos/*.proto


build:
	 npx webpack --mode=development --output client.js src/client.js

