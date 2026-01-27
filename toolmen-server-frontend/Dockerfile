# stage 1: BUILD staage, based on Node.js, to build and compile the frontend
FROM node:22-alpine AS build

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build

# stage 2: production enviroment, based on nginx
FROM nginx:1-alpine

COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]