import Link from 'next/link'
import { buscarEventosProximos, ROTULO_TIPO } from '@/lib/queries/events'
import { formatarIntervalo, formatarMoeda, formatarDiaSemana } from '@/lib/format'
import { StatusBadge } from '@/components/StatusBadge'

export const dynamic = 'force-dynamic'

export default async function AgendaPage() {
  const eventos = await buscarEventosProximos()

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Agenda</h1>
        <p className="mt-1 text-sm text-cinza-700">
          {eventos.length === 0
            ? 'Nenhum evento agendado'
            : `${eventos.length} ${eventos.length === 1 ? 'evento' : 'eventos'} pela frente`}
        </p>
      </header>

      {eventos.length === 0 ? (
        <div className="rounded-lg border border-cinza-200 bg-cinza-100 p-8 text-center">
          <p className="text-cinza-700">Nada agendado ainda.</p>
          <Link
            href="/orcamento/novo"
            className="mt-4 inline-block rounded-lg bg-navy px-5 py-2.5 text-sm font-medium text-white"
          >
            Criar orçamento
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {eventos.map((evento) => (
            <li key={evento.id}>
              <Link
                href={`/evento/${evento.id}`}
                className="block rounded-lg border border-cinza-200 p-4 transition-colors hover:border-navy"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-navy">{evento.cliente}</p>
                    <p className="mt-0.5 text-sm text-cinza-700">
                      {ROTULO_TIPO[evento.tipo]} · {evento.local}
                    </p>
                  </div>
                  <StatusBadge status={evento.status} />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-navy">
                    {formatarIntervalo(evento.dataInicio, evento.dataFim)}
                    <span className="ml-2 capitalize text-cinza-700">
                      {formatarDiaSemana(evento.dataInicio)}
                    </span>
                  </span>
                  <span className="font-medium text-navy">{formatarMoeda(evento.total)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
