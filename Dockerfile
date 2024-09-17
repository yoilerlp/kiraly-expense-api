# Etapa 1: Descargar dependencias
FROM --platform=linux/amd64 node:18-alpine as deps
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile


# Etapa 2: Construcción del proyecto
FROM --platform=linux/amd64 node:18-alpine as builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build


# Etapa 3: Instalación de producción y Doppler
FROM --platform=linux/amd64 node:18-alpine as runner
WORKDIR /app

# Copia el archivo de dependencias de la etapa de builder
COPY --from=builder /app/dist ./dist

# Instalar solo dependencias de producción
COPY package.json yarn.lock ./
RUN yarn install --prod

# Instalar Doppler CLI
RUN wget -q -t3 'https://packages.doppler.com/public/cli/rsa.8004D9FF50437357.key' -O /etc/apk/keys/cli@doppler-8004D9FF50437357.rsa.pub \
    && echo 'https://packages.doppler.com/public/cli/alpine/any-version/main' | tee -a /etc/apk/repositories \
    && apk add doppler

# Comando que se ejecuta cuando se levanta el contenedor
CMD ["sh", "-c", "doppler run --token ${DOPPLER_TOKEN} -- node dist/main"]
