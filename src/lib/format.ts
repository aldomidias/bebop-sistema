export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)
}

export function formatarData(data: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  }).format(data)
}

export function formatarIntervalo(inicio: Date, fim: Date): string {
  const inicioFormatado = formatarData(inicio)
  const fimFormatado = formatarData(fim)
  if (inicioFormatado === fimFormatado) {
    return inicioFormatado
  }
  return `${inicioFormatado} a ${fimFormatado}`
}

export function formatarDiaSemana(data: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    timeZone: 'America/Sao_Paulo',
  }).format(data)
}
