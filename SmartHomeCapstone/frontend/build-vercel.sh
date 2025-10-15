#!/bin/bash
# Vercel build script to ensure react-scripts is available

echo "Setting up build environment..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Ensure npx is available
echo "Checking npx availability..."
which npx || echo "npx not found"

# Run the build
echo "Starting build..."
npx react-scripts build

echo "Build completed successfully!"
