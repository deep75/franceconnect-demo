FROM node:10-alpine as build

WORKDIR /app
COPY . ./
RUN npm install

FROM node:10-alpine

COPY --from=build /app /
EXPOSE 3001
CMD ["npm", "start"]
