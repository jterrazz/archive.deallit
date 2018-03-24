FROM node:9-alpine

MAINTAINER Jean-Baptiste Terrazzoni

WORKDIR /home/app

ENV PACKAGES="\
  g++ \
  make \
  python2 \
"

RUN apk add --no-cache $PACKAGES

RUN npm install -g npm-check mocha nodemon

CMD npm install && npm run dev
