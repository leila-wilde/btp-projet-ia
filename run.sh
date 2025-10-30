#!/bin/bash
# Installation and Launch Script for L'Archipel Libre Web Platform

echo "=========================================="
echo "L'Archipel Libre Web Platform"
echo "Installation & Launch Script"
echo "=========================================="
echo ""

# Check Node.js
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js $NODE_VERSION found"
echo ""

# Check npm
echo "Checking npm installation..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm $NPM_VERSION found"
echo ""

# Navigate to frontend
echo "Navigating to frontend directory..."
cd frontend || exit 1
echo "✅ In frontend directory"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies (this may take a few minutes)..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ npm install failed"
        exit 1
    fi
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi
echo ""

# Start the dev server
echo "Starting development server..."
echo "The application will open at http://localhost:4200/"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=========================================="
echo ""

npm start
