# Dockerfile
FROM node:8

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app

# Yarn
RUN yarn

RUN npm run build:client

RUN npm run build:server

EXPOSE 9000

# defined in package.json
CMD [ "node", "dest/server/index.js"]
