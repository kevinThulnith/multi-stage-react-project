#!/bin/sh
set -e

# ── Runtime API key injection ────────────────────────────────
# If GEMINI_API_KEY env var is set, replace the build-time placeholder
# in the client JS bundle with the real key.
#
# Usage: docker run -e GEMINI_API_KEY=your_real_key ...
#
if [ -n "$GEMINI_API_KEY" ]; then
  echo "Injecting API key into client bundle..."
  find /app/dist/client/assets -name "*.js" | while read file; do
    sed -i "s|__GEMINI_API_KEY_PLACEHOLDER__|${GEMINI_API_KEY}|g" "$file"
  done
  echo "API key injected successfully."
else
  echo "WARNING: GEMINI_API_KEY not set. API features may not work."
fi

# ── Start Node.js SSR server ─────────────────────────────────
cd /app

echo "Starting Node.js SSR server on port 3000..."
NODE_ENV=production HOST=127.0.0.1 PORT=3000 node server.cjs &
NODE_PID=$!

# Wait for Node.js to start
sleep 2

if kill -0 $NODE_PID 2>/dev/null; then
  echo "Node.js server started successfully on port 3000"
else
  echo "Failed to start Node.js server"
  exit 1
fi

# ── Start Nginx (foreground) ─────────────────────────────────
echo "Starting Nginx on port 5173..."
nginx -g "daemon off;"
