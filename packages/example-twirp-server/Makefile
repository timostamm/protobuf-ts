.PHONY: server install generate
PROTO_PATH = ../test-fixtures


server:
	go run ./cmd/server/main.go


install:
	go get github.com/rs/cors
	go get github.com/twitchtv/twirp/protoc-gen-twirp
	go get github.com/golang/protobuf/protoc-gen-go


generate:
	protoc --proto_path=${PROTO_PATH} --twirp_out=rpc/haberdasher/ --go_out=rpc/haberdasher/ ${PROTO_PATH}/service-twirp-example.proto
