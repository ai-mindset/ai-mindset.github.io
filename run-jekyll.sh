#!/usr/bin/env zsh

CONTAINER_NAME="jekyll-site"

# Remove old _site to start afresh
rm -rf _site/

# Check if container image exists
if ! podman image exists $CONTAINER_NAME; then
   echo "Building container image..."
   podman build -t $CONTAINER_NAME -f Containerfile .
fi

# Check if container is already running
if podman ps | grep -q $CONTAINER_NAME; then
   echo "Container already running. Stopping it..."
   podman stop $CONTAINER_NAME
fi

echo "Starting container..."
podman run --rm -p 4000:4000 -v ${PWD}:/site:Z $CONTAINER_NAME
