FROM node:16-slim

RUN apt-get update
RUN apt-get install -y openssl && apt-get install -y --no-install-recommends curl

WORKDIR /app
COPY package*.json ./
RUN yarn install

COPY . .

RUN yarn prisma generate
RUN yarn build


EXPOSE 8080

CMD yarn start:prod