#!/usr/bin/env bash

REMOTE=buf.build
OWNER=timostamm
VERSION=2.6.0
GENERATION=1
TAG=plugins."${REMOTE}/${OWNER}/protobuf-ts:v${VERSION}-${GENERATION}"

BUF_API_TOKEN=$(awk "/machine ${REMOTE}/ { found_machine=1 } /password/ && found_machine { print \$2 ; exit }" < "$HOME"/.netrc)
if [ -z "${BUF_API_TOKEN}" ]; then
    >&2 echo "${REMOTE} must be configured in \$HOME/.netrc"
fi

echo "${BUF_API_TOKEN}" | docker login plugins."${REMOTE}" -u irrelevant --password-stdin
docker build --file ./protobuf-ts.dockerfile --build-arg=VERSION="${VERSION}" --tag "${TAG}" .
docker push "${TAG}"
