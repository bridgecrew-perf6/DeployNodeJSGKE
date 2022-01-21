FROM amd64/node:erbium-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

RUN apk update && apk upgrade && apk add bash

COPY . .

EXPOSE 7000

USER node



CMD [ "node", "server.js" ]
