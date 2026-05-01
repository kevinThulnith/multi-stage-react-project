#!/bin/sh
set -e

echo "Injecting API key into bundle..."

# Find all JS files and replace the placeholder with the real key
find /usr/share/nginx/html/assets -name "*.js" | while read file; do
  sed -i "s|__GEMINI_API_KEY_PLACEHOLDER__|${GEMINI_API_KEY}|g" "$file"
done

echo "Starting nginx..."
exec nginx -g "daemon off;"
