#!/bin/sh
set -e

# Check if node_modules exists and has required packages, if not install dependencies
if [ ! -d "node_modules" ] || [ ! -d "node_modules/@tamagui" ] || [ ! -d "node_modules/papaparse" ] || [ ! -d "node_modules/react-refresh" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Create symlink for react-refresh to fix Create React App webpack issue in Docker
# This is a workaround for Create React App's webpack restriction
if [ -d "node_modules/react-refresh" ] && [ ! -e "src/node_modules" ]; then
  echo "Creating symlink for react-refresh workaround..."
  mkdir -p src/node_modules
  ln -sf ../../node_modules/react-refresh src/node_modules/react-refresh
fi

# Execute the main command
exec "$@"

