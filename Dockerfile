FROM node:9

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 8081
EXPOSE 4242

CMD npm run dev
