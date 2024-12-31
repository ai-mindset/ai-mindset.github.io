#!/usr/bin/env zsh

CONTAINER_NAME="jekyll-site"
PORT=4000

# Function to clean up processes and containers
cleanup() {
    echo "Cleaning up..."
    # Find and remove container with prejudice
    podman rm -f $(podman ps -q --filter name=$CONTAINER_NAME) 2>/dev/null
    # Kill any process using our port
    lsof -ti :$PORT | xargs kill -9 2>/dev/null
}

# Trap SIGINT and SIGTERM
trap cleanup SIGINT SIGTERM

# Clean up any existing instances
cleanup

# Remove old _site to start afresh
rm -rf _site/

# Check if container image exists
if ! podman image exists $CONTAINER_NAME; then
   echo "Building container image..."
   podman build -t $CONTAINER_NAME -f Containerfile .
fi

echo "Starting container..."
podman run --rm -it --name $CONTAINER_NAME -p $PORT:$PORT -v ${PWD}:/site:Z $CONTAINER_NAME
