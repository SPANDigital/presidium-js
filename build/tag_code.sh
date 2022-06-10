#!/usr/bin/env bash

set -e

DIR="$(dirname "$0")"
source "${DIR}/include.sh"

# Setup the repository
git config --global user.email "build@travis-ci.com"
git config --global user.name "Travis CI"
git checkout "${TRAVIS_BRANCH}"

if [[ "${TRAVIS_BRANCH}" = "develop" ]]
then
    TAG=$(docker run --rm -v "$(pwd):/repo" gittools/gitversion:5.5.0-linux-debian.9-x64-netcoreapp3.1 /repo -output json -showvariable FullSemVer)
elif [[ "${TRAVIS_BRANCH}" = "master" ]]
then
    TAG=$(docker run --rm -v "$(pwd):/repo" gittools/gitversion:5.5.0-linux-debian.9-x64-netcoreapp3.1 /repo -output json -showvariable MajorMinorPatch)
fi

export TAG
# Tag this version
TAG=${TAG//+/-}
git tag "v${TAG}"
git push -q "https://${GITHUB_KEY}@github.com/${TRAVIS_REPO_SLUG}" --tags
f_success_log "Code taged with version v${TAG}"

if [[ "${TRAVIS_BRANCH}" = "master" ]]
then
  # Remove all old rfv tags
  git fetch
  git push -q "https://${GITHUB_KEY}@github.com/${TRAVIS_REPO_SLUG}" --delete $(git tag -l "*-rfv.*")
  git tag -d $(git tag -l "*-rfv.*")
fi
