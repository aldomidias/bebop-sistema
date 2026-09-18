import { db } from '@/lib/db'
import { LinhaItem } from './LinhaItem'

export const dynamic = 'force-dynamic'

export default async function CatalogoPage() {
  const categorias = await db.categoria.findMany({
    include: { itens: { orderBy: { nome: 'asc' } } },
    orderBy: { ordem: 'asc' },
  })

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-navy">Catálogo</h1>
        <p className="mt-1 text-sm text-cinza-700">
          Quantidade, preço e situação de cada equipamento
        </p>
      </header>

      <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-sm text-amber-900">
          Os preços são valores de exemplo. Ajuste cada um para os valores reais da Bebop.
        </p>
      </div>

      <div className="space-y-6">
        {categorias.map((categoria) => (
          <section key={categoria.id}>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-cinza-700">
              {categoria.nome}
            </h2>
            <ul className="divide-y divide-cinza-200 rounded-lg border border-cinza-200">
              {categoria.itens.map((item) => (
                <LinhaItem
                  key={item.id}
                  id={item.id}
                  nome={item.nome}
                  quantidadeTotal={item.quantidadeTotal}
                  precoBaseDiaria={item.precoBaseDiaria}
                  status={item.status}
                  observacao={item.observacao}
                />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
