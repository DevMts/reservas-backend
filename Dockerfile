FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copia o restante do código
COPY . .

# Gera o Prisma Client
RUN npx prisma generate

EXPOSE 3333

CMD ["pnpm", "dev"]
