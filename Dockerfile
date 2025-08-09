# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit --no-fund

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Production Node stage - minimal
FROM node:22-alpine AS node

WORKDIR /app

# Only copy what's needed to run the SSR server
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/server.ts /app/server.ts
COPY --from=builder /app/index.html /app/index.html

# Install only the minimal packages needed for production
RUN npm install --production=true --no-fund --no-audit \
    cross-env tsx compression express sirv && \
    rm -rf /root/.npm /tmp/*

ENV NODE_ENV=production
ENV HOST=127.0.0.1  
ENV PORT=3000

# Final stage with Nginx
FROM nginx:1.25-alpine-slim AS production

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/* \
    && rm -rf /var/cache/apk/* \
    && rm -rf /var/log/nginx/* \
    && rm -rf /tmp/* \
    && rm -rf /etc/nginx/conf.d/default.conf

# Copy the Node.js runtime from the node stage
COPY --from=node /usr/local/bin/node /usr/local/bin/
COPY --from=node /usr/lib/libgcc_s.so.1 /usr/lib/
COPY --from=node /usr/lib/libstdc++.so.6 /usr/lib/

# Copy the application from the node stage
COPY --from=node /app /app

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 5173

HEALTHCHECK --interval=30s --timeout=3s CMD wget -q --spider http://localhost:5173/ || exit 1

CMD ["/start.sh"]