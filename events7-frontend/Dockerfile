FROM node:18 as BUILD

RUN apt-get -y update && apt-get -y install build-essential

WORKDIR /app
COPY . .
RUN npm i
RUN npm run build

FROM nginx:stable-alpine as DEPLOY

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d/

COPY --from=BUILD /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]