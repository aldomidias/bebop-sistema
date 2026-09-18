import { db } from '@/lib/db'
import { ListaCatalogo } from './ListaCatalogo'

export const dynamic = 'force-dynamic'

export default async function CatalogoPage() {
  const categorias = await db.categoria.findMany({
    include: { itens: { orderBy: { nome: 'asc' } } },
    orderBy: { ordem: 'asc' },
  })
  const dados = categorias.map((c) => ({
    id: c.id,
    nome: c.nome,
    itens: c.itens.map((i) => ({
      id: i.id, nome: i.nome, quantidadeTotal: i.quantidadeTotal,
      precoBaseDiaria: i.precoBaseDiaria, status: i.status, observacao: i.observacao,
    })),
  }))
  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-titulo text-2xl font-semibold text-navy">Catálogo</h1>
        <p className="mt-1 text-sm text-cinza-700">Quantidade, preço e situação de cada equipamento</p>
      </header>
      <p className="rounded-cartao bg-white px-4 py-3 text-sm text-cinza-700 shadow-card">
        Os preços são exemplos. Ajuste para os valores reais da Bebop.
      </p>
      <ListaCatalogo categorias={dados} />
    </div>
  )
}
