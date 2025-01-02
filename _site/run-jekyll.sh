#!/usr/bin/env zsh

CONTAINER_NAME="jekyll-site"
PORT=4000

cleanup() {
    echo "Cleaning up..."
    podman rm -f $(podman ps -q --filter name=$CONTAINER_NAME) 2>/dev/null
    lsof -ti :$PORT | xargs kill -9 2>/dev/null
}

trap cleanup SIGINT SIGTERM

cleanup

# Create required directories if they don't exist
mkdir -p _posts _site

# Check if container image exists
if ! podman image exists $CONTAINER_NAME; then
   echo "Building container image..."
   podman build -t $CONTAINER_NAME -f Containerfile .
fi

echo "Starting container..."
podman run --rm -it --name $CONTAINER_NAME -p $PORT:$PORT -v ${PWD}:/site:Z $CONTAINER_NAME
