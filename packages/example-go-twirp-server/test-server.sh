#!/usr/bin/env sh

curl \
  --request POST \
  --header "Content-Type: application/json" \
  --data '{"inches":23}' \
  http://localhost:8080/twirp/spec.haberdasher.Haberdasher/MakeHat
