# ---- Stage 1: Build ----

# Get a Node.js base image
FROM node:22-alpine3.21 as builder

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm i

# Copy the rest of the application code
COPY . .

ENV GEMINI_API_KEY=your_gemini_api_key_here

# Build the application for production
# This runs "build:client" and "build:server"
RUN npm run build

# ---- Stage 2: Production ----

# Use a clean, small Node image for the final image
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only production dependencies from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# We need ts-node and typescript to run server.ts in production
# A more advanced setup might compile server.ts to JS, but this is simpler.
RUN npm install -D ts-node typescript cross-env

# Copy the built application assets from the builder stage
COPY --from=builder /app/dist ./dist

# Copy the server and the root html file
COPY --from=builder /app/server.ts .
COPY --from=builder /app/index.html .

ENV GEMINI_API_KEY=your_gemini_api_key_here

# Expose the port the app runs on
EXPOSE 5173

# Set the command to run the application in production mode
# This will execute: cross-env NODE_ENV=production node --loader ts-node/esm server.ts
CMD ["npm", "run", "serve"]