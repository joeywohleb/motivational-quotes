#!/bin/sh
set -e

# Always check and install/update dependencies if package.json changed
# This ensures new packages are installed without needing to rebuild
if [ ! -d "node_modules" ]; then
  echo "node_modules not found, installing dependencies..."
  npm install
else
  echo "Checking for dependency updates..."
  npm install --prefer-offline --no-audit
fi

# Execute the main command
exec "$@"

