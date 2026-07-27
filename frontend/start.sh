#!/bin/bash
if [ ! -d "node_modules/vite" ]; then
  npm install
fi
npx vite --port 5174
