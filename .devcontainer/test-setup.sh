#!/bin/bash
set -e

echo "🐳 Testing Dev Container Setup..."

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "✅ Docker is running"

# Test building the dev container
echo "🔨 Building dev container..."
cd /Users/dadjocy/Desktop/cs-25-2-team4
docker build -f .devcontainer/Dockerfile -t smarthome-devcontainer .

echo "🧪 Testing container..."
# Run a quick test inside the container
docker run --rm -v "$(pwd):/workspace" smarthome-devcontainer bash -c "
    cd /workspace/SmartHome && 
    chmod +x gradlew && 
    ./gradlew clean compileJava --no-daemon
"

echo "🎉 Dev container setup successful!"
echo ""
echo "To use the dev container:"
echo "1. Open VS Code"
echo "2. Install the 'Dev Containers' extension"
echo "3. Open this project folder"
echo "4. Press Ctrl+Shift+P and select 'Dev Containers: Reopen in Container'"