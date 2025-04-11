set -o pipefail

go install github.com/twitchtv/twirp/clientcompat@v7.0.0
npx "${HOME}/go/bin/clientcompat" -client clientcompat/client.ts
