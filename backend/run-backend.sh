#!/bin/bash
cd "$(dirname "$0")"
if [ ! -d "node_modules/express" ]; then
  npm install
fi
node src/server.js
