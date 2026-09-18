export type CorMedidor = 'verde' | 'ambar' | 'laranja' | 'vermelho' | 'cinza'

export const SEGMENTOS_PADRAO = 12

export function corDoMedidor(disponivel: number, total: number, ativo = true): CorMedidor {
  if (!ativo) return 'cinza'
  if (total <= 0 || disponivel <= 0) return 'vermelho'
  const proporcao = disponivel / total
  if (proporcao >= 0.5) return 'verde'
  if (proporcao >= 0.2) return 'ambar'
  return 'laranja'
}

export function segmentosAcesos(
  disponivel: number,
  total: number,
  segmentos = SEGMENTOS_PADRAO
): number {
  if (total <= 0 || disponivel <= 0) return 0
  const proporcao = Math.min(1, disponivel / total)
  return Math.min(segmentos, Math.ceil(proporcao * segmentos))
}
