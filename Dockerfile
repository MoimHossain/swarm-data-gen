FROM node:8.2.1-alpine

WORKDIR /app
ADD ./server.js /app
ADD ./package.json /app
ADD ./services /app/services/

RUN npm install -q

EXPOSE 9012
CMD ["npm","start"]