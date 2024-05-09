#!/usr/bin/env bash

# This script will generate a tag based on the branch history and the GitVersion.yml config in the root of this project.
#
# To run this script manually, you can use the following command:
# TRAVIS_BRANCH=your_branch GITHUB_KEY=your_github_key TRAVIS_REPO_SLUG=presidium-js-enterprise ./build/tag_code.sh


set -e

DIR="$(dirname "$0")"
source "${DIR}/include.sh"

# Setup the repository
git config --global user.email "build@travis-ci.com"
git config --global user.name "Travis CI"
git checkout "${TRAVIS_BRANCH}"

if [[ "${TRAVIS_BRANCH}" = "develop" || "${TRAVIS_BRANCH}" =~ ^feat[/-] ]]
then
    TAG=$(docker run --rm -v "$(pwd):/repo" gittools/gitversion:5.12.0-alpine.3.14-6.0 /repo -output json -showvariable FullSemVer)
elif [[ "${TRAVIS_BRANCH}" = "main" ]]
then
    TAG=$(docker run --rm -v "$(pwd):/repo" gittools/gitversion:5.12.0-alpine.3.14-6.0 /repo -output json -showvariable MajorMinorPatch)
fi

echo "Tag generated ${TAG}"

export TAG
# Tag this version
TAG=${TAG//+/-}
git tag "v${TAG}"
git push -q "https://${GITHUB_KEY}@github.com/${TRAVIS_REPO_SLUG}" --tags
f_success_log "Code taged with version v${TAG}"

if [[ "${TRAVIS_BRANCH}" = "main" ]]
then
  # Remove all old rfv tags
  git fetch
  git push -q "https://${GITHUB_KEY}@github.com/${TRAVIS_REPO_SLUG}" --delete $(git tag -l "*-rfv.*")
  git tag -d $(git tag -l "*-rfv.*")
fi
