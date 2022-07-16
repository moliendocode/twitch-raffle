FROM node:16-alpine
WORKDIR /usr
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16-alpine
ENV CHANNEL_NAME \ CLIENT_ID \ CLIENT_SECRET \ ACCESS_TOKEN \ BROADCASTER_ID \ REDIS_HOSTNAME \ REDIS_PORT \ REDIS_USERNAME \ REDIS_PASSWORD \ REFRESH_TOKEN
WORKDIR /usr
COPY package*.json ./
RUN npm install --only=production
COPY --from=0 /usr/dist .
RUN npm install pm2 --location=global
EXPOSE 80
CMD ["pm2-runtime", "main.js"]
