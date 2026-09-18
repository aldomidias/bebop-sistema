import Link from 'next/link'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { formatarIntervalo, formatarDiaSemana } from '@/lib/format'
import { ROTULO_TIPO } from '@/lib/queries/events'
import { PrintButton } from '@/components/PrintButton'
import { Icone } from '@/components/Icones'
import { Observacoes } from './Observacoes'
import '../../documento.css'

export const dynamic = 'force-dynamic'

export default async function ChecklistDocumento({ params }: { params: Promise<{ id: string }> }) {
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

  const porCategoria = new Map<string, typeof evento.itens>()
  for (const reservado of evento.itens) {
    const nome = reservado.item.categoria.nome
    const lista = porCategoria.get(nome) ?? []
    lista.push(reservado)
    porCategoria.set(nome, lista)
  }

  const totalPecas = evento.itens.reduce((soma, i) => soma + i.quantidade, 0)

  return (
    <div className="documento">
      <div className="sem-impressao mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            href={`/evento/${evento.id}`}
            aria-label="Voltar ao evento"
            className="flex h-10 w-10 items-center justify-center rounded-full border"
            style={{ borderColor: 'var(--cor-cinza-200)', color: 'var(--cor-navy)' }}
          >
            <Icone nome="seta" tamanho={20} className="rotate-180" />
          </Link>
          <Link
            href="/"
            aria-label="Ir para o início"
            className="flex h-10 w-10 items-center justify-center rounded-full border"
            style={{ borderColor: 'var(--cor-cinza-200)', color: 'var(--cor-navy)' }}
          >
            <Icone nome="casa" tamanho={18} />
          </Link>
        </div>
        <PrintButton rotulo="Imprimir checklist" />
      </div>

      <header className="border-b-2 pb-3" style={{ borderColor: 'var(--cor-tinta)' }}>
        <h1 className="text-2xl font-bold">Checklist de Carga</h1>
        <p className="mt-1 text-lg">
          {evento.cliente.nome} · {ROTULO_TIPO[evento.tipo]}
        </p>
        <p className="text-base">
          {formatarIntervalo(evento.dataInicio, evento.dataFim)}
          <span className="ml-2 capitalize">{formatarDiaSemana(evento.dataInicio)}</span>
        </p>
        <p className="text-base font-medium">{evento.local}</p>
      </header>

      <section className="mt-5">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-lg font-bold">Equipamento</h2>
          <span className="text-base">{totalPecas} peças no total</span>
        </div>

        {Array.from(porCategoria.entries()).map(([categoria, itens]) => (
          <div key={categoria} className="mb-4">
            <h3 className="mb-1 text-sm font-bold uppercase tracking-wide">{categoria}</h3>
            <ul>
              {itens.map((reservado) => (
                <li
                  key={reservado.id}
                  className="flex items-center gap-3 border-b py-2"
                  style={{ borderColor: 'var(--cor-cinza-200)' }}
                >
                  <span
                    className="inline-block shrink-0 border-2"
                    style={{ width: '18px', height: '18px', borderColor: 'var(--cor-tinta)' }}
                  />
                  <span className="text-base font-medium">{reservado.item.nome}</span>
                  <span className="ml-auto text-lg font-bold">{reservado.quantidade}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-lg font-bold">Observações</h2>
        <Observacoes eventoId={evento.id} inicial={evento.checklist?.observacoes ?? ''} />
      </section>

      <section className="mt-8 hidden print:block">
        <div className="grid grid-cols-2 gap-8">
          <div className="border-t pt-2 text-sm" style={{ borderColor: 'var(--cor-tinta)' }}>
            Conferido na saída
          </div>
          <div className="border-t pt-2 text-sm" style={{ borderColor: 'var(--cor-tinta)' }}>
            Conferido no retorno
          </div>
        </div>
      </section>
    </div>
  )
}
