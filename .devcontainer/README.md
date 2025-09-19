# Smart Home Dev Container Setup

This project uses a VS Code Dev Container for consistent development environment across all platforms.

## 🐳 What's Included

- **Java 21** (OpenJDK)
- **Gradle** with wrapper
- **VS Code Java Extensions Pack**
- **Spotless** code formatting
- **JUnit 5** testing framework
- **Git** and **GitHub CLI**

## 🚀 Quick Start

### Option 1: VS Code Dev Containers Extension (Recommended)

1. Install the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
2. Open this project in VS Code
3. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
4. Type "Dev Containers: Reopen in Container"
5. Wait for the container to build and start

### Option 2: Docker Compose

```bash
# Build and start the container
docker-compose -f .devcontainer/docker-compose.yml up -d

# Attach to the container
docker-compose -f .devcontainer/docker-compose.yml exec devcontainer bash
```

## 🔧 Available Commands

Once inside the container:

```bash
# Navigate to the project
cd SmartHome

# Build the project
./gradlew build

# Run tests
./gradlew test

# Run the application
./gradlew run

# Format code with Spotless
./gradlew spotlessApply

# Check code formatting
./gradlew spotlessCheck
```

## 📦 Gradle Tasks

- `./gradlew build` - Complete build including tests
- `./gradlew compileJava` - Compile main source code only
- `./gradlew test` - Run all tests
- `./gradlew run` - Run the Smart Home application
- `./gradlew spotlessApply` - Auto-format all code
- `./gradlew jacocoTestReport` - Generate test coverage report

## 🔄 Ports

- **8080**: Smart Home application (when running web features)
- **3000**: Development server (if needed)

## 📁 Project Structure

```
cs-25-2-team4/
├── .devcontainer/           # Dev container configuration
├── SmartHome/              # Main Gradle project
│   ├── SmartHomeApp/       # Application source code
│   │   ├── src/main/java/  # Main Java source
│   │   └── src/test/java/  # Test source
│   ├── build.gradle.kts    # Gradle build script
│   └── gradlew             # Gradle wrapper
└── README.md
```

## 🛠️ Troubleshooting

### Container won't build
- Ensure Docker is running
- Check Docker has enough memory allocated (4GB+ recommended)

### Java/Gradle issues
- The container comes pre-configured with Java 21 and Gradle
- All dependencies are automatically downloaded on first build

### VS Code extensions not working
- Reopen the project in the dev container
- Extensions are automatically installed when container starts