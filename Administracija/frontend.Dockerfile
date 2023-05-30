#version of busybox
FROM alpine

RUN apk update \
    && apk upgrade \
    && apk add nodejs npm 

WORKDIR /app/frontend

COPY ../RAZI/frontend .

CMD npm install && npm start
