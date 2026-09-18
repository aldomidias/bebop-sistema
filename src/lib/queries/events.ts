import { db } from '@/lib/db'
import { calcularTotalFinal, contarDiarias } from '@/lib/pricing'

export type EventoResumo = {
  id: string
  cliente: string
  dataInicio: Date
  dataFim: Date
  local: string
  tipo: string
  status: 'orcamento' | 'confirmado' | 'concluido' | 'cancelado'
  total: number
  temChecklist: boolean
}

export const ROTULO_TIPO: Record<string, string> = {
  casamento: 'Casamento',
  quinze_anos: '15 Anos',
  aniversario: 'Aniversário',
  show: 'Show',
  outro: 'Evento',
}

export async function buscarEventosProximos(): Promise<EventoResumo[]> {
  const inicioDeHoje = new Date()
  inicioDeHoje.setHours(0, 0, 0, 0)

  const eventos = await db.evento.findMany({
    where: {
      dataFim: { gte: inicioDeHoje },
      status: { not: 'cancelado' },
    },
    include: { cliente: true, itens: true, checklist: true },
    orderBy: { dataInicio: 'asc' },
  })

  return eventos.map((evento) => ({
    id: evento.id,
    cliente: evento.cliente.nome,
    dataInicio: evento.dataInicio,
    dataFim: evento.dataFim,
    local: evento.local,
    tipo: evento.tipo,
    status: evento.status as EventoResumo['status'],
    total: calcularTotalFinal(
      evento.itens.map((item) => ({
        quantidade: item.quantidade,
        precoAplicado: item.precoAplicado,
      })),
      contarDiarias(evento.dataInicio, evento.dataFim),
      evento.valorAjustado
    ),
    temChecklist: evento.checklist !== null,
  }))
}
