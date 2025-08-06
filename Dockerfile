FROM node:22-alpine3.21 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --prefer-offline

COPY . .

RUN npm run build

FROM node:22-alpine3.21

COPY --from=builder /app/dist ./dist
COPY package*.json ./

RUN npm ci --production --prefer-offline

EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]