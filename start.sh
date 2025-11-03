#!/bin/sh

# Explicitly set environment variables for Node.js
export NODE_ENV=production
export PORT=3000
export HOST=127.0.0.1

cd /app

# Start Node.js server first
echo "Starting Node.js SSR server on port 3000..."
node --import tsx server.ts &
NODE_PID=$!

# Give Node.js a moment to start
sleep 2

# Check if process is running (Alpine-compatible method)
if kill -0 $NODE_PID 2>/dev/null; then
  echo "Node.js server started successfully on port 3000"
else
  echo "Failed to start Node.js server"
  exit 1
fi

# Start nginx in foreground
echo "Starting Nginx on port 5173..."
nginx -g "daemon off;"