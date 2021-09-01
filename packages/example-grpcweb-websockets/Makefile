.PHONY: improbable-proxy improbable-client

OS_ARCH=osx-x86_64
IMPROBABLE_PROXY_VERSION=v0.14.1
SERVICE_URL=http://localhost:5081


improbable-proxy: grpcwebproxy
	./grpcwebproxy --backend_addr=localhost:5000 \
		--run_tls_server=false \
		--server_http_debug_port 5080 \
		--use_websockets \
		--allow_all_origins

improbable-client:
	protoc \
		--plugin="protoc-gen-ts=./improbable-client/node_modules/.bin/protoc-gen-ts" \
		--js_out="import_style=commonjs,binary:./improbable-client/gen/" \
		--ts_out="service=grpc-web:./improbable-client/gen/" \
		-I  ../test-fixtures/ \
		../test-fixtures/service-example.proto
	cd improbable-client && npm i && export SERVICE_URL="$(SERVICE_URL)" && npx webpack serve

grpcwebproxy:
	mkdir .tmp
	curl --location --output .tmp/grpcwebproxy.zip "https://github.com/improbable-eng/grpc-web/releases/download/${IMPROBABLE_PROXY_VERSION}/grpcwebproxy-${IMPROBABLE_PROXY_VERSION}-${OS_ARCH}".zip
	unzip .tmp/grpcwebproxy.zip "dist/grpcwebproxy-${IMPROBABLE_PROXY_VERSION}-${OS_ARCH}" -d .tmp
	mv ".tmp/dist/grpcwebproxy-${IMPROBABLE_PROXY_VERSION}-${OS_ARCH}" ./grpcwebproxy
	rm -rf .tmp

