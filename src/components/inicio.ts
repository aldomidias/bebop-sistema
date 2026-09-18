type Status = 'orcamento' | 'confirmado' | 'concluido' | 'cancelado'

export function saudacao(hora: number): string {
  if (hora >= 5 && hora < 12) return 'Bom dia'
  if (hora >= 12 && hora < 18) return 'Boa tarde'
  return 'Boa noite'
}

const SEMANA_CURTA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function doisDigitos(n: number): string {
  return String(n).padStart(2, '0')
}

// Componentes locais de propósito: a data já foi construída no fuso local.
export function rotuloDia(data: Date): string {
  return `${SEMANA_CURTA[data.getDay()]}, ${doisDigitos(data.getDate())}/${doisDigitos(
    data.getMonth() + 1
  )}/${data.getFullYear()}`
}

export function diaGrande(data: Date): { dia: string; semana: string } {
  return { dia: doisDigitos(data.getDate()), semana: SEMANA_CURTA[data.getDay()].toUpperCase() }
}

export function agruparPorDia<T extends { dataInicio: Date }>(
  eventos: T[]
): { rotulo: string; eventos: T[] }[] {
  const grupos: { rotulo: string; eventos: T[] }[] = []
  for (const evento of eventos) {
    const rotulo = rotuloDia(evento.dataInicio)
    const ultimo = grupos[grupos.length - 1]
    if (ultimo && ultimo.rotulo === rotulo) ultimo.eventos.push(evento)
    else grupos.push({ rotulo, eventos: [evento] })
  }
  return grupos
}

export function passoDoEvento(status: Status, temChecklist: boolean): 1 | 2 | 3 {
  if (status === 'orcamento' || status === 'cancelado') return 1
  return temChecklist ? 3 : 2
}

export function dataPorExtenso(data: Date): string {
  const texto = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(data)
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}
