import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { calcularTotal, calcularTotalFinal, contarDiarias } from '@/lib/pricing'
import { formatarIntervalo, formatarMoeda, formatarDiaSemana } from '@/lib/format'
import { StatusBadge } from '@/components/StatusBadge'
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

  return (
    <div>
      <header className="mb-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-navy">{evento.cliente.nome}</h1>
            <p className="mt-1 text-sm text-cinza-700">
              {ROTULO_TIPO[evento.tipo]} · {evento.local}
            </p>
          </div>
          <StatusBadge status={evento.status as 'orcamento' | 'confirmado' | 'concluido' | 'cancelado'} />
        </div>
        <p className="mt-3 text-navy">
          {formatarIntervalo(evento.dataInicio, evento.dataFim)}
          <span className="ml-2 capitalize text-cinza-700">
            {formatarDiaSemana(evento.dataInicio)}
          </span>
          {diarias > 1 && <span className="ml-2 text-cinza-700">· {diarias} diárias</span>}
        </p>
        <p className="mt-1 text-sm text-cinza-700">{evento.cliente.telefone}</p>
      </header>

      <section className="mb-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-cinza-700">
          Equipamento
        </h2>
        <ul className="divide-y divide-cinza-200 rounded-lg border border-cinza-200">
          {evento.itens.map((reservado) => (
            <li key={reservado.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-navy">{reservado.item.nome}</p>
                <p className="text-xs text-cinza-700">
                  {reservado.quantidade} × {formatarMoeda(reservado.precoAplicado)}
                  {diarias > 1 && ` × ${diarias} diárias`}
                </p>
              </div>
              <span className="text-sm font-medium text-navy">
                {formatarMoeda(reservado.quantidade * reservado.precoAplicado * diarias)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6 rounded-lg bg-cinza-100 p-4">
        {evento.valorAjustado !== null && (
          <div className="mb-2 flex items-center justify-between text-sm text-cinza-700">
            <span>Total calculado</span>
            <span className="line-through">{formatarMoeda(totalCalculado)}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="font-medium text-navy">Valor do evento</span>
          <span className="text-2xl font-bold text-navy">{formatarMoeda(totalFinal)}</span>
        </div>
      </section>

      {evento.observacoes && (
        <section className="mb-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-cinza-700">
            Observações
          </h2>
          <p className="rounded-lg border border-cinza-200 px-4 py-3 text-sm">{evento.observacoes}</p>
        </section>
      )}

      <section className="space-y-3">
        <Link
          href={`/documento/orcamento/${evento.id}`}
          className="block rounded-lg border border-navy px-5 py-3 text-center font-medium text-navy"
        >
          Ver orçamento
        </Link>

        {evento.status === 'orcamento' && (
          <>
            <form action={confirmar}>
              <button
                type="submit"
                className="w-full rounded-lg bg-navy px-5 py-3 font-medium text-white"
              >
                Confirmar e gerar contrato
              </button>
            </form>
            <form action={cancelar}>
              <button
                type="submit"
                className="w-full rounded-lg border border-cinza-200 px-5 py-3 text-sm text-cinza-700"
              >
                Cancelar orçamento
              </button>
            </form>
          </>
        )}

        {evento.status === 'confirmado' && (
          <>
            <Link
              href={`/documento/contrato/${evento.id}`}
              className="block rounded-lg border border-navy px-5 py-3 text-center font-medium text-navy"
            >
              Ver contrato
            </Link>
            <Link
              href={`/documento/checklist/${evento.id}`}
              className="block rounded-lg bg-navy px-5 py-3 text-center font-medium text-white"
            >
              Abrir checklist
            </Link>
          </>
        )}
      </section>
    </div>
  )
}
