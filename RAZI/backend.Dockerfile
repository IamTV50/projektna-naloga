FROM node:18.16.0

WORKDIR /app/backend

COPY /backend .

RUN npm config set registry https://registry.npm.taobao.org/
RUN npm install

CMD ["npm", "start"]