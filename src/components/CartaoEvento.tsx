import Link from 'next/link'
import { Cartao } from './Cartao'
import { LedStatus } from './Led'
import { LinhaProgresso } from './LinhaProgresso'
import { diaGrande, passoDoEvento } from './inicio'
import { formatarMoeda } from '@/lib/format'
import { ROTULO_TIPO, type EventoResumo } from '@/lib/queries/events'

export function CartaoEvento({ evento, destaque = false }: { evento: EventoResumo; destaque?: boolean }) {
  const { dia, semana } = diaGrande(evento.dataInicio)
  const multiDia = evento.dataInicio.getTime() !== evento.dataFim.getTime()
  const fim = diaGrande(evento.dataFim)

  return (
    <Cartao destaque={destaque} className="p-0">
      <Link href={`/evento/${evento.id}`} className="flex gap-4 p-4">
        <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-botao bg-cinza-100 py-2">
          <span className="font-titulo text-3xl font-bold leading-none text-navy">{dia}</span>
          <span className="mt-1 text-[11px] font-semibold tracking-wide text-cinza-700">
            {multiDia ? `${semana}–${fim.dia}` : semana}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate font-titulo text-base font-semibold text-navy">{evento.cliente}</p>
            <LedStatus status={evento.status} />
          </div>
          <p className="mt-0.5 truncate text-sm text-cinza-700">
            {ROTULO_TIPO[evento.tipo]} · {evento.local}
          </p>
          <p className="mt-2 font-titulo text-lg font-semibold text-navy">{formatarMoeda(evento.total)}</p>
          {destaque && (
            <div className="mt-3">
              <LinhaProgresso passo={passoDoEvento(evento.status, evento.temChecklist)} />
            </div>
          )}
        </div>
      </Link>
      <div className="flex border-t border-cinza-200">
        <Link href={`/evento/${evento.id}`} className="flex h-11 flex-1 items-center justify-center text-sm font-medium text-navy">
          Ver evento
        </Link>
        <span className="w-px bg-cinza-200" />
        <Link href={`/documento/orcamento/${evento.id}`} className="flex h-11 flex-1 items-center justify-center text-sm font-medium text-navy">
          Orçamento
        </Link>
      </div>
    </Cartao>
  )
}
