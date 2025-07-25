FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

ENV GEMINI_API_KEY=your_gemini_api_key_here

EXPOSE 5173

CMD ["npm", "run", "dev"]