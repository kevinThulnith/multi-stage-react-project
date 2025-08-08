# Build Stage
FROM node:22-alpine3.21 AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit --no-fund

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Production Stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only production dependencies from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# We need ts-node and typescript to run server.ts in production
# A more advanced setup might compile server.ts to JS, but this is simpler.
RUN npm i -D ts-node typescript cross-env

# Copy the built application assets from the builder stage
COPY --from=builder /app/dist ./dist

# Copy the server and the root html file
COPY --from=builder /app/server.ts .
COPY --from=builder /app/index.html .

EXPOSE 5173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]