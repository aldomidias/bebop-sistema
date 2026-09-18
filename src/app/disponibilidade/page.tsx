import { buscarDisponibilidade } from '@/lib/queries/availability'
import { formatarData } from '@/lib/format'
import { Cartao } from '@/components/Cartao'
import { BotaoPrimario, BotaoSecundario } from '@/components/Botoes'
import { ListaDisponibilidade } from './ListaDisponibilidade'

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

  const itensUI = itens.map((item) => ({
    id: item.id,
    nome: item.nome,
    categoria: item.categoria,
    status: item.status,
    observacao: item.observacao,
    disponivel: item.disponibilidade.disponivel,
    total: item.disponibilidade.total,
    confirmadas: item.disponibilidade.confirmadas,
    emOrcamento: item.disponibilidade.emOrcamento,
  }))

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-titulo text-2xl font-semibold text-navy">Disponibilidade</h1>
        <p className="mt-1 text-sm text-cinza-700">
          O que está livre em {formatarData(inicio)}
          {inicioTexto !== fimTexto && ` a ${formatarData(fim)}`}
        </p>
      </header>

      <Cartao>
        <form method="get" className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-cinza-700">De</span>
              <input type="date" name="inicio" defaultValue={inicioTexto} className="h-12 w-full rounded-campo border border-cinza-200 bg-white px-3 text-base text-navy" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-cinza-700">Até</span>
              <input type="date" name="fim" defaultValue={fimTexto} className="h-12 w-full rounded-campo border border-cinza-200 bg-white px-3 text-base text-navy" />
            </label>
          </div>
          <BotaoPrimario type="submit">Consultar</BotaoPrimario>
          <BotaoSecundario href={`/orcamento/novo?inicio=${inicioTexto}&fim=${fimTexto}`}>
            Criar orçamento nestas datas
          </BotaoSecundario>
        </form>
      </Cartao>

      <ListaDisponibilidade itens={itensUI} />
    </div>
  )
}
