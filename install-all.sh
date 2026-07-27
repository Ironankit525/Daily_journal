#!/bin/bash
set -e

echo "📦 Installing backend dependencies..."
cd "$(dirname "$0")/backend"
npm install --no-workspaces

echo "📦 Installing frontend dependencies..."
cd "../frontend"
npm install --no-workspaces

echo "✓ All dependencies installed successfully!"
