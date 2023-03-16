FROM node:19 AS build-env
RUN npm config --global set update-notifier false
RUN mkdir -p app/ 

COPY . /app
WORKDIR /app

RUN npm ci
RUN npm run build
RUN npm ci --omit=dev
RUN rm -rf ./src

RUN mv ./dist/** ./

FROM gcr.io/distroless/nodejs:18
COPY --from=build-env /app /app
WORKDIR /app
CMD ["main.js"]
