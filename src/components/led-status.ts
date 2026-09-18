export type TomLed = 'verde' | 'ambar' | 'vermelho' | 'cinza'

export type StatusEvento = 'orcamento' | 'confirmado' | 'concluido' | 'cancelado'

export const LED_STATUS: Record<StatusEvento, { tom: TomLed; rotulo: string }> = {
  orcamento: { tom: 'ambar', rotulo: 'Orçamento' },
  confirmado: { tom: 'verde', rotulo: 'Confirmado' },
  concluido: { tom: 'cinza', rotulo: 'Concluído' },
  cancelado: { tom: 'vermelho', rotulo: 'Cancelado' },
}

export const COR: Record<TomLed, string> = {
  verde: 'bg-verde shadow-[0_0_6px_var(--cor-verde)]',
  ambar: 'bg-ambar shadow-[0_0_6px_var(--cor-ambar)]',
  vermelho: 'bg-vermelho shadow-[0_0_6px_var(--cor-vermelho)]',
  cinza: 'bg-cinza-400',
}

export const TEXTO: Record<TomLed, string> = {
  verde: 'text-verde',
  ambar: 'text-ambar',
  vermelho: 'text-vermelho',
  cinza: 'text-cinza-700',
}
