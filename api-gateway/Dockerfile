FROM node:8.9.4

LABEL version="0.1"
LABEL description="api-gateway docker image for findit"
LABEL maintainer="Max Mayr <max.mayr@gmail.com>"

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json .
RUN cd /usr/src/app && npm install

COPY . /usr/src/app

EXPOSE 8080
CMD [ "npm", "start" ]