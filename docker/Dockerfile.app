FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY src/api/app.js ./src/api/app.js


FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/src/api/app.js   ./src/api/app.js

EXPOSE 3000

CMD ["node", "src/api/app.js"]