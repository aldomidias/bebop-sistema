function inicioDoDia(data: Date): Date {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate())
}

export function intervalosSobrepoe(
  aInicio: Date,
  aFim: Date,
  bInicio: Date,
  bFim: Date
): boolean {
  const aInicioDia = inicioDoDia(aInicio).getTime()
  const aFimDia = inicioDoDia(aFim).getTime()
  const bInicioDia = inicioDoDia(bInicio).getTime()
  const bFimDia = inicioDoDia(bFim).getTime()

  return aInicioDia <= bFimDia && aFimDia >= bInicioDia
}

export type StatusItem = 'ativo' | 'manutencao' | 'saindo_catalogo'
export type StatusEvento = 'orcamento' | 'confirmado' | 'concluido' | 'cancelado'

export type Reserva = {
  quantidade: number
  status: StatusEvento
  dataInicio: Date
  dataFim: Date
}

export type Disponibilidade = {
  total: number
  confirmadas: number
  emOrcamento: number
  disponivel: number
}

export function calcularDisponibilidade(
  quantidadeTotal: number,
  statusItem: StatusItem,
  reservas: Reserva[],
  inicio: Date,
  fim: Date
): Disponibilidade {
  if (statusItem !== 'ativo') {
    return { total: quantidadeTotal, confirmadas: 0, emOrcamento: 0, disponivel: 0 }
  }

  const relevantes = reservas.filter(
    (r) =>
      (r.status === 'confirmado' || r.status === 'orcamento') &&
      intervalosSobrepoe(r.dataInicio, r.dataFim, inicio, fim)
  )

  const confirmadas = relevantes
    .filter((r) => r.status === 'confirmado')
    .reduce((soma, r) => soma + Math.max(0, r.quantidade), 0)

  const emOrcamento = relevantes
    .filter((r) => r.status === 'orcamento')
    .reduce((soma, r) => soma + Math.max(0, r.quantidade), 0)

  const disponivel = Math.min(
    quantidadeTotal,
    Math.max(0, quantidadeTotal - confirmadas - emOrcamento)
  )

  return { total: quantidadeTotal, confirmadas, emOrcamento, disponivel }
}

export function validarPedido(
  pedido: { itemId: string; nome: string; quantidade: number }[],
  disponivelPorItem: Record<string, number>
): string[] {
  const erros: string[] = []

  for (const item of pedido) {
    if (!Number.isInteger(item.quantidade) || item.quantidade <= 0) {
      erros.push(`${item.nome}: quantidade inválida`)
      continue
    }

    const disponivel = disponivelPorItem[item.itemId] ?? 0
    if (item.quantidade > disponivel) {
      const unidade = disponivel === 1 ? 'livre' : 'livres'
      erros.push(`${item.nome}: só ${disponivel} ${unidade} nessas datas`)
    }
  }

  return erros
}
