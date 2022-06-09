#!/usr/bin/env bash

set -e

DIR="$(dirname "$0")"
source "${DIR}/include.sh"

if [[ -n "${TRAVIS_TAG}" && ${TRAVIS_TAG} =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]
then
    curl -v -d "{\"tag_name\": \"$TRAVIS_TAG\"}" -H "Authorization: token ${GITHUB_KEY}" -X POST "https://api.github.com/repos/${TRAVIS_REPO_SLUG}/releases"
fi
