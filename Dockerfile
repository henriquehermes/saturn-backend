FROM node:alpine

# RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

WORKDIR /node-app

COPY package.json package-lock.json ./

# USER node

RUN npm install

COPY . .

# COPY --chown=node:node . .

EXPOSE 3000