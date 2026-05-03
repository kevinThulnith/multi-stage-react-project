# ── Build stage ──────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Define build arguments for environment variables
ARG VITE_GEMINI_API_KEY

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit --no-fund --silent

# Copy the rest of the application code
COPY . .

# Set environment variables from build args
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

# Build client + SSR server bundles
RUN npm run build

# Bundle the production server into a single self-contained JS file
# This eliminates the need for node_modules in the final image
RUN npx esbuild server.prod.ts \
      --bundle \
      --platform=node \
      --format=cjs \
      --external:./dist/server/entry-server.js \
      --outfile=server.cjs

# Strip the Node.js binary BEFORE copying to final stage
# (avoids a 127MB unstripped layer + 112MB strip layer in the final image)
RUN apk add --no-cache binutils \
    && strip /usr/local/bin/node \
    && apk del binutils

# ── Final stage: Nginx + stripped Node ───────────────────────
FROM nginx:1.25-alpine-slim AS production

# Remove default nginx static assets and config
RUN rm -rf /usr/share/nginx/html/* \
    && rm -rf /etc/nginx/conf.d/default.conf

# Copy the already-stripped Node.js binary (~70MB instead of 127MB)
COPY --from=builder /usr/local/bin/node /usr/local/bin/

# Copy required shared libraries for Node.js on Alpine
COPY --from=builder /usr/lib/libgcc_s.so.1 /usr/lib/
COPY --from=builder /usr/lib/libstdc++.so.6 /usr/lib/

# Copy ONLY the built artifacts — NO node_modules!
COPY --from=builder /app/server.cjs /app/server.cjs
COPY --from=builder /app/dist/client /app/dist/client
COPY --from=builder /app/dist/server/entry-server.js /app/dist/server/entry-server.js

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy and prepare start script
COPY start.sh /start.sh
RUN sed -i 's/\r$//' /start.sh && chmod +x /start.sh

EXPOSE 5173

CMD ["/start.sh"]
