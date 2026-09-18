# Imagem para deploy via Coolify. Build multi-stage: instala dependências,
# gera o cliente Prisma, builda o Next.js standalone, e no runtime roda
# migrate + seed antes de iniciar o servidor (entrypoint.sh).

FROM node:22-alpine AS deps
WORKDIR /app
# Prisma precisa da openssl real do sistema para o engine binário
# (sem isso ele cai no fallback "openssl-1.1.x" e pode falhar em runtime).
RUN apk add --no-cache openssl
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache openssl

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
# node_modules completo (não só o standalone/.next): a migration e o
# seed rodam via `prisma` + `tsx`, que o output standalone não inclui.
# --chown porque o Prisma grava o engine binário certo em @prisma/engines
# na primeira execução, e o container roda como usuário sem privilégio.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Volume persistente do Coolify aponta pra aqui — sobrevive a cada deploy.
VOLUME ["/app/prisma"]

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

ENTRYPOINT ["./entrypoint.sh"]
