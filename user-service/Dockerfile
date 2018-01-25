FROM node:8.9.4

LABEL version="0.2"
LABEL description="user-service docker image"
LABEL maintainer="Max Mayr <max.mayr@gmail.com>"

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json .
RUN cd /usr/src/app && npm install

COPY . /usr/src/app

EXPOSE 8081
CMD [ "npm", "start" ]