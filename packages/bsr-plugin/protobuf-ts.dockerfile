FROM node:lts-bullseye-slim as build
ARG VERSION

WORKDIR /app
RUN npm install @protobuf-ts/plugin@${VERSION}

LABEL "build.buf.plugins.runtime_library_versions.0.name"="@protobuf-ts/runtime"
LABEL "build.buf.plugins.runtime_library_versions.0.version"="${VERSION}"
LABEL "build.buf.plugins.runtime_library_versions.1.name"="@protobuf-ts/runtime-rpc"
LABEL "build.buf.plugins.runtime_library_versions.1.version"="${VERSION}"

ENTRYPOINT [ "/app/node_modules/@protobuf-ts/plugin/bin/protoc-gen-ts" ]
