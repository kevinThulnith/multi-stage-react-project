#!/bin/sh
set -e

echo "Starting services..."

# Create required directories
mkdir -p /tmp/client_temp /tmp/proxy_temp_path /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp

# Start nginx in background
echo "Starting nginx..."
nginx -c /app/nginx.conf &

# Wait a moment for nginx to start
sleep 2

# Start Node.js app
echo "Starting Node.js SSR server on port 3000..."
exec env PORT=3000 HOST=127.0.0.1 npm run serve
