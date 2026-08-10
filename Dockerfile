FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --production=false
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=build /app/package*.json ./
RUN npm install --production=true
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.js ./server.js
EXPOSE 80
CMD ["node", "server.js"]
