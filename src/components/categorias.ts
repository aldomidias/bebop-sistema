import type { NomeIcone } from './Icones'

// Nomes exatamente como estão em prisma/seed.ts (tabela Categoria).
export const CATEGORIAS_ORDEM = [
  'Caixas de Som',
  'Mesas de Som',
  'Microfones',
  'Iluminação',
  'Estrutura e Palco',
  'Instrumentos',
  'Cabos e Acessórios',
]

const ICONE: Record<string, NomeIcone> = {
  'Caixas de Som': 'caixa',
  'Mesas de Som': 'mesa',
  Microfones: 'microfone',
  Iluminação: 'luz',
  'Estrutura e Palco': 'estrutura',
  Instrumentos: 'instrumento',
  'Cabos e Acessórios': 'cabo',
}

const ROTULO_CURTO: Record<string, string> = {
  'Caixas de Som': 'Caixas',
  'Mesas de Som': 'Mesas',
  Microfones: 'Microfones',
  Iluminação: 'Luz',
  'Estrutura e Palco': 'Estrutura',
  Instrumentos: 'Instrumentos',
  'Cabos e Acessórios': 'Acessórios',
}

export function iconeDaCategoria(nome: string): NomeIcone {
  return ICONE[nome] ?? 'caixa'
}

export function rotuloCurtoDaCategoria(nome: string): string {
  return ROTULO_CURTO[nome] ?? nome
}
