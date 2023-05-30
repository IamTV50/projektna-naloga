#version of busybox
FROM alpine

RUN apk update \
    && apk upgrade \
    && apk add python3 nodejs npm 

WORKDIR /app/backend

COPY ../RAZI/backend .

CMD npm install && npm start
