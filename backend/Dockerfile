FROM node:18-alpine

WORKDIR /ft_transcendence-nestjs

COPY ./package.json ./
COPY ./yarn.lock ./

RUN npm install yarn
RUN yarn install

COPY ./ ./

RUN yarn build

CMD ["yarn", "start"]
# CMD ["yarn", "start:dev"]