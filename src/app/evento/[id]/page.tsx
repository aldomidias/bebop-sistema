import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { calcularTotal, calcularTotalFinal, contarDiarias } from '@/lib/pricing'
import { formatarIntervalo, formatarMoeda, formatarDiaSemana } from '@/lib/format'
import { Cartao } from '@/components/Cartao'
import { LinhaLista } from '@/components/LinhaLista'
import { LedStatus } from '@/components/Led'
import { LinhaProgresso } from '@/components/LinhaProgresso'
import { BotaoPrimario, BotaoTexto } from '@/components/Botoes'
import { TituloSecao } from '@/components/TituloSecao'
import { diaGrande, passoDoEvento } from '@/components/inicio'
import { ROTULO_TIPO } from '@/lib/queries/events'
import { confirmarEvento, cancelarEvento } from '@/lib/actions/events'

export const dynamic = 'force-dynamic'

export default async function EventoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const evento = await db.evento.findUnique({
    where: { id },
    include: {
      cliente: true,
      checklist: true,
      itens: { include: { item: { include: { categoria: true } } } },
    },
  })

  if (!evento) notFound()

  const diarias = contarDiarias(evento.dataInicio, evento.dataFim)
  const itensCalculo = evento.itens.map((i) => ({
    quantidade: i.quantidade,
    precoAplicado: i.precoAplicado,
  }))
  const totalCalculado = calcularTotal(itensCalculo, diarias)
  const totalFinal = calcularTotalFinal(itensCalculo, diarias, evento.valorAjustado)

  async function confirmar() {
    'use server'
    await confirmarEvento(id)
  }

  async function cancelar() {
    'use server'
    await cancelarEvento(id)
  }

  const status = evento.status as 'orcamento' | 'confirmado' | 'concluido' | 'cancelado'
  const { dia, semana } = diaGrande(evento.dataInicio)
  const confirmado = status === 'confirmado' || status === 'concluido'

  return (
    <div className="space-y-5">
      <Cartao destaque>
        <div className="flex gap-4">
          <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-botao bg-cinza-100 py-2">
            <span className="font-titulo text-3xl font-bold leading-none text-navy">{dia}</span>
            <span className="mt-1 text-[11px] font-semibold tracking-wide text-cinza-700">{semana}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h1 className="truncate font-titulo text-xl font-semibold text-navy">{evento.cliente.nome}</h1>
              <LedStatus status={status} />
            </div>
            <p className="mt-0.5 text-sm text-cinza-700">{ROTULO_TIPO[evento.tipo]} · {evento.local}</p>
            <p className="mt-0.5 text-sm text-cinza-700">
              {formatarIntervalo(evento.dataInicio, evento.dataFim)}
              <span className="ml-1 capitalize">· {formatarDiaSemana(evento.dataInicio)}</span>
              {diarias > 1 && ` · ${diarias} diárias`}
            </p>
            <p className="mt-2 font-titulo text-2xl font-bold text-navy">{formatarMoeda(totalFinal)}</p>
            {evento.valorAjustado !== null && (
              <p className="text-xs text-cinza-400">calculado: <span className="line-through">{formatarMoeda(totalCalculado)}</span></p>
            )}
          </div>
        </div>
        <div className="mt-4"><LinhaProgresso passo={passoDoEvento(status, evento.checklist !== null)} /></div>
      </Cartao>

      <Cartao className="divide-y divide-cinza-200 p-0">
        <LinhaLista icone="usuario" titulo={evento.cliente.nome} subtitulo={evento.cliente.telefone} />
        <LinhaLista icone="recibo" titulo="Orçamento" subtitulo="Ver ou imprimir" href={`/documento/orcamento/${evento.id}`} />
        <LinhaLista icone="recibo" titulo="Contrato" subtitulo={confirmado ? 'Ver ou imprimir' : 'Disponível após confirmar'} href={`/documento/contrato/${evento.id}`} desabilitada={!confirmado} />
        <LinhaLista icone="estrutura" titulo="Checklist de montagem" subtitulo={confirmado ? 'Para a equipe' : 'Disponível após confirmar'} href={`/documento/checklist/${evento.id}`} desabilitada={!confirmado} />
      </Cartao>

      <section>
        <TituloSecao titulo="Equipamento" />
        <ul className="divide-y divide-cinza-200 rounded-cartao bg-white shadow-card">
          {evento.itens.map((reservado) => (
            <li key={reservado.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-navy">{reservado.item.nome}</p>
                <p className="text-xs text-cinza-700">
                  {reservado.quantidade} × {formatarMoeda(reservado.precoAplicado)}{diarias > 1 && ` × ${diarias} diárias`}
                </p>
              </div>
              <span className="font-titulo text-sm font-semibold text-navy">
                {formatarMoeda(reservado.quantidade * reservado.precoAplicado * diarias)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {evento.observacoes && (
        <section>
          <TituloSecao titulo="Observações" />
          <Cartao><p className="text-sm">{evento.observacoes}</p></Cartao>
        </section>
      )}

      {status === 'orcamento' && (
        <div className="space-y-2">
          <form action={confirmar}><BotaoPrimario type="submit">Confirmar e gerar contrato</BotaoPrimario></form>
          <form action={cancelar} className="text-center"><BotaoTexto type="submit" tom="vermelho">Cancelar orçamento</BotaoTexto></form>
        </div>
      )}
    </div>
  )
}
