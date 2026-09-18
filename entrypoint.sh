#!/bin/sh
# Roda a cada start do container. Aplica migrations pendentes; semeia o
# catálogo/eventos de exemplo só se o banco ainda não existir (primeiro
# deploy) — em deploys seguintes o volume persistente já tem o dev.db
# com os dados reais, e não deve ser sobrescrito.
set -e

FIRST_RUN=0
if [ ! -f /app/prisma/dev.db ]; then
  FIRST_RUN=1
fi

echo "Aplicando migrations..."
npx prisma migrate deploy

if [ "$FIRST_RUN" = "1" ]; then
  echo "Banco novo — populando com o catálogo de exemplo..."
  npx prisma db seed
fi

echo "Iniciando servidor..."
exec node server.js
