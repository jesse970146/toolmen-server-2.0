# stage 1: BUILD staage, based on Node.js, to build and compile the frontend
FROM node:20-alpine AS build

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV PATH=/usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json

# RUN npm install --silent
# RUN npm install react-scripts -g --silent
RUN yarn install
COPY . /usr/src/app
RUN npm run build

# stage 2: production enviroment, based on nginx
FROM nginx:1.27.0-alpine

COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]