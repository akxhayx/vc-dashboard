#!/bin/bash

# Venture Intelligence Platform - Quick Start Script
# This script sets up and runs the VC dashboard

set -e

echo "🚀 Venture Intelligence Platform Setup"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js version is $NODE_VERSION. Version 18+ is recommended."
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the vc-dashboard directory."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "✅ Dependencies ready"
echo ""

# Ask user what they want to do
echo "What would you like to do?"
echo "1) Start development server (recommended for testing)"
echo "2) Build for production"
echo "3) Build and preview production version"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🎯 Starting development server..."
        echo "   Dashboard will open at: http://localhost:3000"
        echo "   Press Ctrl+C to stop the server"
        echo ""
        npm run dev
        ;;
    2)
        echo ""
        echo "🏗️  Building for production..."
        npm run build
        echo ""
        echo "✅ Production build complete!"
        echo "   Built files are in the 'dist' directory"
        echo "   Deploy these files to your web server"
        echo ""
        ;;
    3)
        echo ""
        echo "🏗️  Building for production..."
        npm run build
        echo ""
        echo "✅ Build complete! Starting preview server..."
        echo "   Dashboard will open at: http://localhost:4173"
        echo "   Press Ctrl+C to stop the server"
        echo ""
        npm run preview
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac
