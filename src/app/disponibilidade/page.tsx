import Link from 'next/link'
import { buscarDisponibilidade } from '@/lib/queries/availability'
import { formatarData } from '@/lib/format'

export const dynamic = 'force-dynamic'

function proximoSabado(): string {
  const data = new Date()
  const dias = (6 - data.getDay() + 7) % 7
  data.setDate(data.getDate() + dias)
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

function paraData(texto: string): Date {
  return new Date(`${texto}T00:00:00`)
}

function dataValida(texto: string | undefined): boolean {
  return texto !== undefined && !Number.isNaN(paraData(texto).getTime())
}

export default async function DisponibilidadePage({
  searchParams,
}: {
  searchParams: Promise<{ inicio?: string; fim?: string }>
}) {
  const params = await searchParams
  const inicioTexto = dataValida(params.inicio) ? (params.inicio as string) : proximoSabado()
  let fimTexto = dataValida(params.fim) ? (params.fim as string) : inicioTexto
  if (fimTexto < inicioTexto) fimTexto = inicioTexto

  const inicio = paraData(inicioTexto)
  const fim = paraData(fimTexto)

  const itens = await buscarDisponibilidade(inicio, fim)

  const porCategoria = new Map<string, typeof itens>()
  for (const item of itens) {
    const lista = porCategoria.get(item.categoria) ?? []
    lista.push(item)
    porCategoria.set(item.categoria, lista)
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Disponibilidade</h1>
        <p className="mt-1 text-sm text-cinza-700">
          O que está livre em {formatarData(inicio)}
          {inicioTexto !== fimTexto && ` a ${formatarData(fim)}`}
        </p>
      </header>

      <form method="get" className="mb-6 flex flex-wrap items-end gap-3 rounded-lg bg-cinza-100 p-4">
        <label className="flex-1 min-w-[140px]">
          <span className="mb-1 block text-xs font-medium text-cinza-700">De</span>
          <input
            type="date"
            name="inicio"
            defaultValue={inicioTexto}
            className="w-full rounded-md border border-cinza-200 bg-white px-3 py-2 text-sm"
          />
        </label>
        <label className="flex-1 min-w-[140px]">
          <span className="mb-1 block text-xs font-medium text-cinza-700">Até</span>
          <input
            type="date"
            name="fim"
            defaultValue={fimTexto}
            className="w-full rounded-md border border-cinza-200 bg-white px-3 py-2 text-sm"
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-navy px-5 py-2 text-sm font-medium text-white"
        >
          Consultar
        </button>
        <Link
          href={`/orcamento/novo?inicio=${inicioTexto}&fim=${fimTexto}`}
          className="rounded-md border border-navy px-5 py-2 text-sm font-medium text-navy"
        >
          Criar orçamento nestas datas
        </Link>
      </form>

      <div className="space-y-6">
        {Array.from(porCategoria.entries()).map(([categoria, itensDaCategoria]) => (
          <section key={categoria}>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-cinza-700">
              {categoria}
            </h2>
            <ul className="divide-y divide-cinza-200 rounded-lg border border-cinza-200">
              {itensDaCategoria.map((item) => {
                const { disponivel, total, confirmadas, emOrcamento } = item.disponibilidade
                const indisponivel = item.status !== 'ativo'
                const esgotado = disponivel === 0 && !indisponivel

                return (
                  <li key={item.id} className="flex items-center justify-between gap-4 px-4 py-3">
                    <div className="min-w-0">
                      <p className="font-medium text-navy">{item.nome}</p>
                      {indisponivel ? (
                        <p className="mt-0.5 text-xs text-cinza-700">
                          {item.status === 'manutencao' ? 'Em manutenção' : 'Saindo de catálogo'}
                          {item.observacao && ` · ${item.observacao}`}
                        </p>
                      ) : (
                        (confirmadas > 0 || emOrcamento > 0) && (
                          <p className="mt-0.5 text-xs text-cinza-700">
                            {confirmadas > 0 && `${confirmadas} confirmadas`}
                            {confirmadas > 0 && emOrcamento > 0 && ' · '}
                            {emOrcamento > 0 && (
                              <span className="text-amber-700">{emOrcamento} em orçamento</span>
                            )}
                          </p>
                        )
                      )}
                    </div>
                    <div className="shrink-0 text-right">
                      <p
                        className={`text-lg font-semibold ${
                          indisponivel || esgotado ? 'text-cinza-700' : 'text-navy'
                        }`}
                      >
                        {indisponivel ? '—' : disponivel}
                      </p>
                      <p className="text-xs text-cinza-700">de {total}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
