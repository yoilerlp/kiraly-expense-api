FROM --platform=amd64 node:18-alpine

WORKDIR /app

RUN apk add --no-cache bash curl

# Copia el package.json y yarn.lock para instalar dependencias
COPY package.json yarn.lock .env ./

# Instalar solo dependencias de producción
COPY ./dist ./

RUN yarn install --production --frozen-lockfile && yarn cache clean --force


CMD ["yarn","serve:prod"]