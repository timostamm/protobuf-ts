#!/usr/bin/env bash

if [ -f "bin/conformance_test_runner" ]; then
  exit 0;
fi

GOOGLE_PROTOBUF_VERSION=22.3
UNAME_OS=$(uname -s)
if [[ "$UNAME_OS" == "Darwin" ]]; then
  PLATFORM=osx-x86_64
elif [[ "$UNAME_OS" == "Linux" ]]; then
  PLATFORM=linux-x86_64
else
  >&2 echo "unsupported platform ${UNAME_OS}"
  exit 1;
fi
ARCHIVE=conformance_test_runner-${GOOGLE_PROTOBUF_VERSION}-${PLATFORM}.zip
curl -O -L https://github.com/bufbuild/protobuf-conformance/releases/download/v${GOOGLE_PROTOBUF_VERSION}/${ARCHIVE}
unzip ${ARCHIVE}
rm ${ARCHIVE}
