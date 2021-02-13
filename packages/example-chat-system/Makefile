.PHONY: fix-build


fix-build:
	# the packages "grpc-backend", "grpc-transport" and this one all use @grpc/grpc-js.
	# they are installed separately (we dont use lerna hoisting) which causes problems.
	# this workaround links the packages in question.
	# the workaround is only necessary in this monorepo. not when using protobuf-ts normally.
	rm -rf ../grpc-backend/node_modules/@grpc/grpc-js
	rm -rf ../grpc-transport/node_modules/@grpc/grpc-js
	ln -s -f ../../../example-chat-system/node_modules/@grpc/grpc-js ../grpc-backend/node_modules/@grpc/grpc-js
	ln -s -f ../../../example-chat-system/node_modules/@grpc/grpc-js ../grpc-transport/node_modules/@grpc/grpc-js
