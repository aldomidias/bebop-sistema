import Image from 'next/image'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { calcularTotalFinal, contarDiarias } from '@/lib/pricing'
import { formatarIntervalo, formatarMoeda, formatarData } from '@/lib/format'
import { ROTULO_TIPO } from '@/lib/queries/events'
import { PrintButton } from '@/components/PrintButton'
import '../../documento.css'

export const dynamic = 'force-dynamic'

export default async function ContratoDocumento({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const evento = await db.evento.findUnique({
    where: { id },
    include: { cliente: true, itens: { include: { item: true } } },
  })

  if (!evento) notFound()

  const diarias = contarDiarias(evento.dataInicio, evento.dataFim)
  const total = calcularTotalFinal(
    evento.itens.map((i) => ({ quantidade: i.quantidade, precoAplicado: i.precoAplicado })),
    diarias,
    evento.valorAjustado
  )

  return (
    <div className="documento">
      <div className="sem-impressao mb-6 flex items-center justify-between gap-4">
        <p className="rounded-md bg-amber-50 px-4 py-2 text-sm text-amber-900">
          Texto de demonstração. O contrato definitivo usa o modelo próprio da Bebop.
        </p>
        <PrintButton />
      </div>

      <header className="documento-cabecalho">
        <Image src="/logo-bebop.png" alt="Bebop Som e Luz" width={140} height={59} />
        <div className="text-right">
          <h1 className="text-lg font-bold" style={{ color: '#14213D' }}>
            Contrato de Locação de Equipamento
          </h1>
          <p className="mt-0.5 text-sm" style={{ color: '#6B7280' }}>
            {formatarData(new Date())}
          </p>
        </div>
      </header>

      <section className="mt-6 text-sm leading-relaxed">
        <p>
          <strong>LOCADORA:</strong> Bebop Som e Luz, doravante denominada LOCADORA.
        </p>
        <p className="mt-2">
          <strong>LOCATÁRIO:</strong> {evento.cliente.nome}, telefone {evento.cliente.telefone},
          doravante denominado LOCATÁRIO.
        </p>
        <p className="mt-4">
          As partes acima qualificadas celebram o presente contrato de locação de equipamento de som
          e iluminação, mediante as cláusulas a seguir.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-sm font-semibold" style={{ color: '#14213D' }}>
          Cláusula 1 — Objeto
        </h2>
        <p className="mt-1 text-sm">
          Locação do equipamento relacionado abaixo para o evento do tipo{' '}
          {ROTULO_TIPO[evento.tipo].toLowerCase()}, realizado em {evento.local}, no período de{' '}
          {formatarIntervalo(evento.dataInicio, evento.dataFim)}
          {diarias > 1 && `, totalizando ${diarias} diárias`}.
        </p>

        <table className="documento-tabela">
          <thead>
            <tr>
              <th>Item</th>
              <th className="numero">Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {evento.itens.map((reservado) => (
              <tr key={reservado.id}>
                <td>{reservado.item.nome}</td>
                <td className="numero">{reservado.quantidade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mt-6">
        <h2 className="text-sm font-semibold" style={{ color: '#14213D' }}>
          Cláusula 2 — Valor
        </h2>
        <p className="mt-1 text-sm">
          O valor total da locação é de <strong>{formatarMoeda(total)}</strong>, a ser pago conforme
          condições acordadas entre as partes.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-sm font-semibold" style={{ color: '#14213D' }}>
          Cláusula 3 — Montagem e retirada
        </h2>
        <p className="mt-1 text-sm">
          A LOCADORA se responsabiliza pelo transporte, montagem e desmontagem do equipamento, em
          horários previamente combinados com o LOCATÁRIO.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-sm font-semibold" style={{ color: '#14213D' }}>
          Cláusula 4 — Conservação
        </h2>
        <p className="mt-1 text-sm">
          O LOCATÁRIO responde por danos causados ao equipamento durante o período de locação,
          excetuados os decorrentes do uso normal e de falhas próprias dos equipamentos.
        </p>
      </section>

      <section className="mt-10 grid gap-8 sm:grid-cols-2">
        <div className="border-t pt-2 text-center text-sm" style={{ borderColor: '#1a1a1a' }}>
          Bebop Som e Luz
        </div>
        <div className="border-t pt-2 text-center text-sm" style={{ borderColor: '#1a1a1a' }}>
          {evento.cliente.nome}
        </div>
      </section>
    </div>
  )
}
