import { db } from '@/lib/db'
import {
  calcularDisponibilidade,
  type Disponibilidade,
  type Reserva,
  type StatusItem,
} from '@/lib/availability'

export type ItemComDisponibilidade = {
  id: string
  nome: string
  categoria: string
  categoriaOrdem: number
  observacao: string | null
  status: StatusItem
  precoBaseDiaria: number
  disponibilidade: Disponibilidade
}

export async function buscarDisponibilidade(
  inicio: Date,
  fim: Date
): Promise<ItemComDisponibilidade[]> {
  const itens = await db.item.findMany({
    include: {
      categoria: true,
      reservas: {
        include: { evento: true },
      },
    },
    orderBy: [{ categoria: { ordem: 'asc' } }, { nome: 'asc' }],
  })

  return itens.map((item) => {
    const reservas: Reserva[] = item.reservas.map((reserva) => ({
      quantidade: reserva.quantidade,
      status: reserva.evento.status as Reserva['status'],
      dataInicio: reserva.evento.dataInicio,
      dataFim: reserva.evento.dataFim,
    }))

    return {
      id: item.id,
      nome: item.nome,
      categoria: item.categoria.nome,
      categoriaOrdem: item.categoria.ordem,
      observacao: item.observacao,
      status: item.status as StatusItem,
      precoBaseDiaria: item.precoBaseDiaria,
      disponibilidade: calcularDisponibilidade(
        item.quantidadeTotal,
        item.status as StatusItem,
        reservas,
        inicio,
        fim
      ),
    }
  })
}

export async function buscarDisponibilidadeDeItem(
  itemId: string,
  inicio: Date,
  fim: Date,
  eventoIdIgnorado?: string
): Promise<Disponibilidade | null> {
  const item = await db.item.findUnique({
    where: { id: itemId },
    include: {
      reservas: {
        include: { evento: true },
      },
    },
  })

  if (!item) return null

  const reservas: Reserva[] = item.reservas
    .filter((reserva) => reserva.eventoId !== eventoIdIgnorado)
    .map((reserva) => ({
      quantidade: reserva.quantidade,
      status: reserva.evento.status as Reserva['status'],
      dataInicio: reserva.evento.dataInicio,
      dataFim: reserva.evento.dataFim,
    }))

  return calcularDisponibilidade(
    item.quantidadeTotal,
    item.status as StatusItem,
    reservas,
    inicio,
    fim
  )
}
