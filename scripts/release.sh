#!/bin/bash

# Get version from manifest.json
VERSION=$(cat public/manifest.json | grep '"version"' | cut -d'"' -f4)

# Build the extension
echo "Building extension..."
yarn build

# Create zip file with version number
echo "Creating zip file..."
cd dist
zip -r "../voxxyfy-v$VERSION.zip" .
cd ..

echo "Created voxxyfy-v$VERSION.zip"

# Optional: Create GitHub release (requires gh CLI)
if command -v gh &> /dev/null; then
    echo "Creating GitHub release..."
    gh release create "v$VERSION" \
        --title "Voxxyfy v$VERSION" \
        --notes "Release of Voxxyfy version $VERSION" \
        "voxxyfy-v$VERSION.zip"
else
    echo "GitHub CLI not found. Please install it to create releases automatically."
    echo "You can manually create a release on GitHub and upload voxxyfy-v$VERSION.zip"
fi 