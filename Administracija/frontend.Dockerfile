FROM node:18.16.0

WORKDIR /app/frontend

COPY ../RAZI/frontend .

CMD ["npm", "start"]