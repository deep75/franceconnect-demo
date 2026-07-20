FROM node:20-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . ./

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app /app
EXPOSE 3001
CMD ["npm", "start"]
