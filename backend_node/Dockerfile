FROM node:alpine3.22
WORKDIR /node_app
COPY . .

ARG PORT

RUN npm install
EXPOSE ${PORT}

CMD ["node" , "server.js"]