FROM node:18.16.0

WORKDIR /app/frontend

COPY ../RAZI/frontend .

RUN npm install

# Build the frontend app (if necessary)
#RUN npm run build

# Start a web server to serve the frontend app
CMD ["npm", "start"]