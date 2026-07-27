#!/bin/bash
if [ ! -d "node_modules/express" ]; then
  npm install express mongoose cors dotenv
fi
node src/server.js
