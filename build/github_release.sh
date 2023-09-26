#!/usr/bin/env bash

set -e

DIR="$(dirname "$0")"
source "${DIR}/include.sh"

# This script will create a release on GitHub with build artifacts attached
# To run this script manually, you can use the following command:
# TRAVIS_TAG=your_release_version GITHUB_KEY=your_github_key ./build/github_release.sh
# Before running this script, you will need to run "npm run build" 

if [[ -n "${TRAVIS_TAG}" && ${TRAVIS_TAG} =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]
then
    echo "Creating release on GitHub for tag ${TRAVIS_TAG}"
    zip_file=$TRAVIS_TAG.zip

    # Zip the dist folder
    zip -r -qq $zip_file dist

    # Create a release on GitHub
    release=$(curl -s -d "{\"tag_name\": \"$TRAVIS_TAG\"}" -H "Authorization: token ${GITHUB_KEY}" -X POST "https://api.github.com/repos/SPANDigital/presidium-js/releases")

    if [[ $(echo $release | jq -r '.message') = "Not Found" ]]
    then
        echo "Error creating release on GitHub"
        exit 1
    fi

    # Get the upload url from the release
    upload_url=$(echo $release | jq -r '.upload_url')
    
    # Remove the {?name,label} from the upload_url
    upload_url="${upload_url//\{?name,label\}/}"

    if [[ -z "$upload_url" ]]
    then
        echo "Error getting upload url from GitHub"
        exit 1
    fi

    # Upload the zip file to the release
    curl -s -H "Authorization: token ${GITHUB_KEY}" -H "Content-Type: application/zip" --data-binary @$zip_file "$upload_url?name=$zip_file"

    rm $zip_file
fi
