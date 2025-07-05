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

# Force rebuild to ensure image exists properly
echo "Building container image..."
podman build -t $CONTAINER_NAME -f Containerfile .

# Verify build succeeded
if [ $? -ne 0 ]; then
    echo "Build failed, exiting"
    exit 1
fi

echo "Starting container..."
podman run --rm -it --name $CONTAINER_NAME -p $PORT:$PORT -v ${PWD}:/site:Z $CONTAINER_NAME
