FROM node:12.18.4-alpine as mineral-exploration-api

WORKDIR /app

COPY ./package.json package.json
COPY ./yarn.lock yarn.lock


RUN yarn install

COPY . .

RUN yarn build

ENTRYPOINT ["yarn"]
CMD ["start"]