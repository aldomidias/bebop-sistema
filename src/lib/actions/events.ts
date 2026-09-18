'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { validarPedido } from '@/lib/availability'
import { buscarDisponibilidadeDeItem } from '@/lib/queries/availability'
import { ROTULO_TIPO } from '@/lib/queries/events'

export type DadosOrcamento = {
  clienteNome: string
  clienteTelefone: string
  dataInicio: string
  dataFim: string
  local: string
  tipo: string
  itens: { itemId: string; nome: string; quantidade: number; precoAplicado: number }[]
  valorAjustado: number | null
  observacoes: string | null
}

export async function criarOrcamento(dados: DadosOrcamento) {
  if (dados.itens.length === 0) {
    throw new Error('Selecione ao menos um item para o orçamento.')
  }

  const dataInicio = new Date(`${dados.dataInicio}T00:00:00`)
  const dataFim = new Date(`${dados.dataFim}T00:00:00`)

  if (Number.isNaN(dataInicio.getTime()) || Number.isNaN(dataFim.getTime())) {
    throw new Error('Datas do evento inválidas.')
  }

  if (dataFim.getTime() < dataInicio.getTime()) {
    throw new Error('A data de término não pode ser anterior à data de início.')
  }

  if (!(dados.tipo in ROTULO_TIPO)) {
    throw new Error('Tipo de evento inválido')
  }

  const disponivelPorItem: Record<string, number> = {}
  for (const item of dados.itens) {
    const disponibilidade = await buscarDisponibilidadeDeItem(item.itemId, dataInicio, dataFim)
    disponivelPorItem[item.itemId] = disponibilidade?.disponivel ?? 0
  }

  const erros = validarPedido(dados.itens, disponivelPorItem)
  if (erros.length > 0) {
    throw new Error(erros.join('\n'))
  }

  const cliente = await db.cliente.create({
    data: {
      nome: dados.clienteNome.trim(),
      telefone: dados.clienteTelefone.trim(),
    },
  })

  const evento = await db.evento.create({
    data: {
      clienteId: cliente.id,
      dataInicio,
      dataFim,
      local: dados.local.trim(),
      tipo: dados.tipo as 'casamento' | 'quinze_anos' | 'aniversario' | 'show' | 'outro',
      status: 'orcamento',
      valorAjustado: dados.valorAjustado,
      observacoes: dados.observacoes,
      itens: {
        create: dados.itens.map((item) => ({
          itemId: item.itemId,
          quantidade: item.quantidade,
          precoAplicado: item.precoAplicado,
        })),
      },
    },
  })

  revalidatePath('/')
  revalidatePath('/disponibilidade')
  redirect(`/evento/${evento.id}`)
}

export async function confirmarEvento(eventoId: string) {
  const evento = await db.evento.findUnique({
    where: { id: eventoId },
    include: { checklist: true },
  })

  if (!evento || evento.status !== 'orcamento') {
    throw new Error('Só é possível confirmar um evento em orçamento')
  }

  await db.evento.update({
    where: { id: eventoId },
    data: { status: 'confirmado' },
  })

  if (!evento.checklist) {
    await db.checklist.create({
      data: { eventoId, observacoes: null },
    })
  }

  revalidatePath('/')
  revalidatePath('/disponibilidade')
  revalidatePath(`/evento/${eventoId}`)
}

export async function cancelarEvento(eventoId: string) {
  const evento = await db.evento.findUnique({ where: { id: eventoId } })

  if (!evento) {
    throw new Error('Evento não encontrado')
  }

  await db.evento.update({
    where: { id: eventoId },
    data: { status: 'cancelado' },
  })

  revalidatePath('/')
  revalidatePath('/disponibilidade')
  revalidatePath(`/evento/${eventoId}`)
}
