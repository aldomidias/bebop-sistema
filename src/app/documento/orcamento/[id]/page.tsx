import Image from 'next/image'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { calcularTotalFinal, contarDiarias } from '@/lib/pricing'
import { formatarIntervalo, formatarMoeda, formatarData } from '@/lib/format'
import { ROTULO_TIPO } from '@/lib/queries/events'
import { PrintButton } from '@/components/PrintButton'
import '../../documento.css'

export const dynamic = 'force-dynamic'

export default async function OrcamentoDocumento({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const evento = await db.evento.findUnique({
    where: { id },
    include: {
      cliente: true,
      itens: { include: { item: true } },
    },
  })

  if (!evento) notFound()

  const diarias = contarDiarias(evento.dataInicio, evento.dataFim)
  const total = calcularTotalFinal(
    evento.itens.map((i) => ({ quantidade: i.quantidade, precoAplicado: i.precoAplicado })),
    diarias,
    evento.valorAjustado
  )

  const validade = new Date(evento.criadoEm)
  validade.setDate(validade.getDate() + 15)

  return (
    <div className="documento">
      <div className="sem-impressao mb-6 flex justify-end">
        <PrintButton />
      </div>

      <header className="documento-cabecalho">
        <Image src="/logo-bebop.png" alt="Bebop Som e Luz" width={160} height={67} priority />
        <div className="text-right">
          <h1 className="text-xl font-bold" style={{ color: 'var(--cor-navy)' }}>
            Proposta de Locação
          </h1>
          <p className="mt-0.5 text-sm" style={{ color: 'var(--cor-cinza-700)' }}>
            Emitida em {formatarData(evento.criadoEm)}
          </p>
        </div>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--cor-cinza-700)' }}>Cliente</p>
          <p className="mt-1 font-semibold">{evento.cliente.nome}</p>
          <p className="text-sm">{evento.cliente.telefone}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--cor-cinza-700)' }}>Evento</p>
          <p className="mt-1 font-semibold">{ROTULO_TIPO[evento.tipo]}</p>
          <p className="text-sm">{evento.local}</p>
          <p className="text-sm">
            {formatarIntervalo(evento.dataInicio, evento.dataFim)}
            {diarias > 1 && ` · ${diarias} diárias`}
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--cor-navy)' }}>
          Equipamento incluído
        </h2>
        <table className="documento-tabela">
          <thead>
            <tr>
              <th>Item</th>
              <th className="numero">Qtd.</th>
              <th className="numero">Valor unitário</th>
              <th className="numero">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {evento.itens.map((reservado) => (
              <tr key={reservado.id}>
                <td>{reservado.item.nome}</td>
                <td className="numero">{reservado.quantidade}</td>
                <td className="numero">{formatarMoeda(reservado.precoAplicado)}</td>
                <td className="numero">
                  {formatarMoeda(reservado.quantidade * reservado.precoAplicado * diarias)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section
        className="mt-6 flex items-center justify-between rounded-lg px-5 py-4"
        style={{ background: 'var(--cor-navy)', color: 'white' }}
      >
        <span className="font-medium">Valor total</span>
        <span className="text-2xl font-bold">{formatarMoeda(total)}</span>
      </section>

      {evento.observacoes && (
        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--cor-navy)' }}>
            Observações
          </h2>
          <p className="mt-2 text-sm">{evento.observacoes}</p>
        </section>
      )}

      <section className="mt-8 text-sm" style={{ color: 'var(--cor-cinza-700)' }}>
        <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--cor-navy)' }}>
          Condições
        </h2>
        <ul className="mt-2 space-y-1">
          <li>Proposta válida até {formatarData(validade)}.</li>
          <li>Inclui transporte, montagem e operação durante o evento.</li>
          <li>A reserva do equipamento é garantida após a confirmação.</li>
        </ul>
      </section>

      <footer className="mt-10 border-t pt-4 text-center text-xs" style={{ borderColor: 'var(--cor-cinza-200)', color: 'var(--cor-cinza-700)' }}>
        Bebop Som e Luz · Locação de equipamento para eventos
      </footer>
    </div>
  )
}
