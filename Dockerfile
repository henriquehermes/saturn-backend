FROM node:lts

# RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

WORKDIR /usr/src/app

COPY package*.json ./

# USER node

RUN npm install

RUN npm ci --only=production

COPY . .

# COPY --chown=node:node . .

EXPOSE 3000