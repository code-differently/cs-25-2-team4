# Use the official Eclipse Temurin Java devcontainer as base
FROM eclipse-temurin:21-jdk

# Install essential tools
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    unzip \
    build-essential \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Create vscode user
RUN groupadd --gid 1000 vscode \
    && useradd --uid 1000 --gid vscode --shell /bin/bash --create-home vscode \
    && echo 'vscode ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Set up Java environment
ENV JAVA_HOME=/opt/java/openjdk
ENV PATH=$JAVA_HOME/bin:$PATH

# Create workspace directory with proper permissions
RUN mkdir -p /workspace && chown -R vscode:vscode /workspace

# Switch to vscode user
USER vscode
WORKDIR /workspace

# Verify Java installation
RUN java -version && javac -version