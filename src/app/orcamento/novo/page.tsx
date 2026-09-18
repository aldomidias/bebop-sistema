import { buscarDisponibilidade } from '@/lib/queries/availability'
import { FormularioOrcamento } from './FormularioOrcamento'

export const dynamic = 'force-dynamic'

function proximoSabado(): string {
  const data = new Date()
  const dias = (6 - data.getDay() + 7) % 7
  data.setDate(data.getDate() + dias)
  // Componentes locais, nunca toISOString(): a conversão para UTC cruza a
  // meia-noite à noite em Brasília (UTC-3) e devolveria o dia seguinte.
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

export default async function NovoOrcamentoPage({
  searchParams,
}: {
  searchParams: Promise<{ inicio?: string; fim?: string }>
}) {
  const params = await searchParams

  function dataValida(texto: string | undefined): boolean {
    return texto !== undefined && !Number.isNaN(new Date(`${texto}T00:00:00`).getTime())
  }

  const inicioTexto = dataValida(params.inicio) ? (params.inicio as string) : proximoSabado()
  let fimTexto = dataValida(params.fim) ? (params.fim as string) : inicioTexto
  if (fimTexto < inicioTexto) fimTexto = inicioTexto

  const itens = await buscarDisponibilidade(
    new Date(`${inicioTexto}T00:00:00`),
    new Date(`${fimTexto}T00:00:00`)
  )

  const itensDisponiveis = itens.map((item) => ({
    id: item.id,
    nome: item.nome,
    categoria: item.categoria,
    disponivel: item.disponibilidade.disponivel,
    precoBaseDiaria: item.precoBaseDiaria,
  }))

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Novo orçamento</h1>
        <p className="mt-1 text-sm text-cinza-700">
          Preencha os dados e escolha o equipamento
        </p>
      </header>
      <FormularioOrcamento itens={itensDisponiveis} inicioPadrao={inicioTexto} fimPadrao={fimTexto} />
    </div>
  )
}
