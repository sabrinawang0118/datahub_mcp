#!/bin/bash

# DataHub MCP Server Setup Script

echo "🚀 DataHub MCP Server Setup"
echo "============================"
echo ""

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your DataHub credentials."
    echo ""
    echo "Required environment variables:"
    echo "  - DATAHUB_GMS_URL: Your DataHub GMS endpoint"
    echo "  - DATAHUB_GMS_TOKEN: Your DataHub personal access token"
    echo ""
else
    echo "✅ .env file already exists"
    echo ""
fi

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Failed to build TypeScript"
    exit 1
fi

echo "✅ Build successful"
echo ""

# Final instructions
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your DataHub credentials"
echo "2. Run 'npm start' to start the server"
echo "3. Or run 'npm run dev' for development mode"
echo ""
echo "For deployment to Render, see DEPLOYMENT.md"
echo "For quick start guide, see QUICKSTART.md"
echo ""
