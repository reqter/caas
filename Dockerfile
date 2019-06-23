FROM node:alpine AS AdminPanel

WORKDIR /www
COPY ./build /www 



