FROM node:18-alpine as nodeWorker

WORKDIR /server-app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 8005

CMD [ "npm", "run", "start" ]
