export type ItemOrcamento = {
  quantidade: number
  precoAplicado: number
}

const MILISSEGUNDOS_POR_DIA = 1000 * 60 * 60 * 24

export function contarDiarias(inicio: Date, fim: Date): number {
  const diferenca = fim.getTime() - inicio.getTime()
  const dias = Math.floor(diferenca / MILISSEGUNDOS_POR_DIA) + 1
  return Math.max(1, dias)
}

export function calcularTotal(itens: ItemOrcamento[], diarias: number): number {
  const soma = itens.reduce(
    (total, item) => total + item.quantidade * item.precoAplicado,
    0
  )
  return soma * diarias
}

export function calcularTotalFinal(
  itens: ItemOrcamento[],
  diarias: number,
  valorAjustado: number | null
): number {
  if (valorAjustado !== null && valorAjustado !== undefined && valorAjustado >= 0) {
    return valorAjustado
  }
  return calcularTotal(itens, diarias)
}
