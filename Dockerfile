FROM node:14.18.1
WORKDIR /app

COPY package.json /app
COPY package-lock.json /app
COPY tsconfig.json /app
RUN npm install --registry=https://registry.npm.taobao.org

COPY . /app

RUN npm install --save-dev sequelize-cli
RUN npm run tsc

EXPOSE 7001

CMD NODE_ENV=development npx sequelize db:migrate && npm run start