import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}

// Enum types for type safety (SQLite stores these as strings)
export enum StatusItem {
  Ativo = 'ativo',
  Manutencao = 'manutencao',
  SaindoCatalogo = 'saindo_catalogo',
}

export enum StatusEvento {
  Orcamento = 'orcamento',
  Confirmado = 'confirmado',
  Concluido = 'concluido',
  Cancelado = 'cancelado',
}

export enum TipoEvento {
  Casamento = 'casamento',
  QuinzeAnos = 'quinze_anos',
  Aniversario = 'aniversario',
  Show = 'show',
  Outro = 'outro',
}
