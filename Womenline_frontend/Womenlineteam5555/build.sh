#!/bin/bash

# Womenline 2.0 Build Script for Render.com Deployment

echo "🚀 Starting Womenline 2.0 build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ -d "build" ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build directory created at: ./build"
    echo "🌐 Ready for deployment to Render.com"
else
    echo "❌ Build failed!"
    exit 1
fi

echo "🎉 Build process completed!" 