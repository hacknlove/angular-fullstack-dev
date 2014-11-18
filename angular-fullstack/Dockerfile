FROM node:latest

EXPOSE 9001

ADD dist /dist

ADD node_modules /node_modules

env NODE_ENV production

WORKDIR /dist

cmd npm start
