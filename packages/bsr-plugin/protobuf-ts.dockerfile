FROM node:lts-bullseye-slim as build
ARG VERSION

WORKDIR /app
RUN npm install @chippercash/protobuf-plugin@${VERSION}

LABEL "build.buf.plugins.runtime_library_versions.0.name"="@chippercash/protobuf-runtime"
LABEL "build.buf.plugins.runtime_library_versions.0.version"="${VERSION}"
LABEL "build.buf.plugins.runtime_library_versions.1.name"="@chippercash/protobuf-runtime-rpc"
LABEL "build.buf.plugins.runtime_library_versions.1.version"="${VERSION}"

ENTRYPOINT [ "/app/node_modules/@chippercash/protobuf-plugin/bin/protoc-gen-ts" ]
