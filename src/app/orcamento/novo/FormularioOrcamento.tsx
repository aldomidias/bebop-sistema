'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { criarOrcamento } from '@/lib/actions/events'
import { formatarMoeda } from '@/lib/format'

type ItemDisponivel = {
  id: string
  nome: string
  categoria: string
  disponivel: number
  precoBaseDiaria: number
}

export function FormularioOrcamento({
  itens,
  inicioPadrao,
  fimPadrao,
}: {
  itens: ItemDisponivel[]
  inicioPadrao: string
  fimPadrao: string
}) {
  const router = useRouter()
  const [dataInicio, setDataInicio] = useState(inicioPadrao)
  const [dataFim, setDataFim] = useState(fimPadrao)
  const [selecionados, setSelecionados] = useState<Record<string, number>>({})
  const [valorAjustado, setValorAjustado] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const diarias = useMemo(() => {
    const inicio = new Date(`${dataInicio}T00:00:00`).getTime()
    const fim = new Date(`${dataFim}T00:00:00`).getTime()
    const dias = Math.floor((fim - inicio) / 86400000) + 1
    return Math.max(1, dias)
  }, [dataInicio, dataFim])

  const total = useMemo(() => {
    const soma = Object.entries(selecionados).reduce((acumulado, [itemId, quantidade]) => {
      const item = itens.find((i) => i.id === itemId)
      if (!item || quantidade <= 0) return acumulado
      return acumulado + quantidade * item.precoBaseDiaria
    }, 0)
    return soma * diarias
  }, [selecionados, itens, diarias])

  const porCategoria = useMemo(() => {
    const mapa = new Map<string, ItemDisponivel[]>()
    for (const item of itens) {
      if (item.disponivel === 0) continue
      const lista = mapa.get(item.categoria) ?? []
      lista.push(item)
      mapa.set(item.categoria, lista)
    }
    return mapa
  }, [itens])

  function ajustarQuantidade(itemId: string, valor: number, maximo: number) {
    const quantidade = Math.max(0, Math.min(valor, maximo))
    setSelecionados((atual) => {
      const novo = { ...atual }
      if (quantidade === 0) {
        delete novo[itemId]
      } else {
        novo[itemId] = quantidade
      }
      return novo
    })
  }

  async function aoEnviar(formData: FormData) {
    setErro(null)
    const itensEscolhidos = Object.entries(selecionados)
      .filter(([, quantidade]) => quantidade > 0)
      .map(([itemId, quantidade]) => {
        const item = itens.find((i) => i.id === itemId)
        return {
          itemId,
          nome: item?.nome ?? itemId,
          quantidade,
          precoAplicado: item?.precoBaseDiaria ?? 0,
        }
      })

    if (itensEscolhidos.length === 0) {
      setErro('Selecione ao menos um item.')
      return
    }

    setEnviando(true)
    try {
      await criarOrcamento({
        clienteNome: String(formData.get('clienteNome') ?? ''),
        clienteTelefone: String(formData.get('clienteTelefone') ?? ''),
        dataInicio,
        dataFim,
        local: String(formData.get('local') ?? ''),
        tipo: String(formData.get('tipo') ?? 'outro'),
        itens: itensEscolhidos,
        valorAjustado: valorAjustado.trim() === '' ? null : Number(valorAjustado),
        observacoes: String(formData.get('observacoes') ?? '') || null,
      })
    } catch (e) {
      setEnviando(false)
      setErro(e instanceof Error ? e.message : 'Não foi possível criar o orçamento.')
    }
  }

  return (
    <form action={aoEnviar} className="space-y-8">
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-cinza-texto">
          Cliente e evento
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-cinza-texto">Nome do cliente</span>
            <input name="clienteNome" required className="w-full rounded-md border border-cinza-borda px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-cinza-texto">Telefone</span>
            <input name="clienteTelefone" required className="w-full rounded-md border border-cinza-borda px-3 py-2 text-sm" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-cinza-texto">Data de início</span>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => {
                const novoInicio = e.target.value
                const novoFim = novoInicio > dataFim ? novoInicio : dataFim
                setDataInicio(novoInicio)
                setDataFim(novoFim)
                router.replace(`/orcamento/novo?inicio=${novoInicio}&fim=${novoFim}`)
              }}
              required
              className="w-full rounded-md border border-cinza-borda px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-cinza-texto">Data de término</span>
            <input
              type="date"
              value={dataFim}
              min={dataInicio}
              onChange={(e) => {
                const novoFim = e.target.value
                setDataFim(novoFim)
                router.replace(`/orcamento/novo?inicio=${dataInicio}&fim=${novoFim}`)
              }}
              required
              className="w-full rounded-md border border-cinza-borda px-3 py-2 text-sm"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-medium text-cinza-texto">Local</span>
            <input name="local" required className="w-full rounded-md border border-cinza-borda px-3 py-2 text-sm" />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-medium text-cinza-texto">Tipo de evento</span>
            <select name="tipo" defaultValue="casamento" className="w-full rounded-md border border-cinza-borda px-3 py-2 text-sm">
              <option value="casamento">Casamento</option>
              <option value="quinze_anos">15 Anos</option>
              <option value="aniversario">Aniversário</option>
              <option value="show">Show</option>
              <option value="outro">Outro</option>
            </select>
          </label>
        </div>
        {diarias > 1 && (
          <p className="mt-2 text-sm text-cinza-texto">
            {diarias} diárias · os valores abaixo são multiplicados por {diarias}
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-cinza-texto">
          Equipamento
        </h2>
        <p className="mb-3 text-xs text-cinza-texto">
          Mostrando apenas o que está livre nas datas escolhidas.
        </p>
        <div className="space-y-5">
          {Array.from(porCategoria.entries()).map(([categoria, itensDaCategoria]) => (
            <div key={categoria}>
              <h3 className="mb-2 text-xs font-semibold text-marinho">{categoria}</h3>
              <ul className="divide-y divide-cinza-borda rounded-lg border border-cinza-borda">
                {itensDaCategoria.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-marinho">{item.nome}</p>
                      <p className="text-xs text-cinza-texto">
                        {formatarMoeda(item.precoBaseDiaria)} · {item.disponivel} livres
                      </p>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={item.disponivel}
                      value={selecionados[item.id] ?? ''}
                      placeholder="0"
                      onChange={(e) => ajustarQuantidade(item.id, Number(e.target.value), item.disponivel)}
                      className="w-20 shrink-0 rounded-md border border-cinza-borda px-2 py-1.5 text-center text-sm"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg bg-cinza-claro p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-cinza-texto">Total calculado</span>
          <span className="text-xl font-bold text-marinho">{formatarMoeda(total)}</span>
        </div>
        <label className="mt-3 block">
          <span className="mb-1 block text-xs font-medium text-cinza-texto">
            Valor final (deixe vazio para usar o calculado)
          </span>
          <input
            type="number"
            step="0.01"
            min={0}
            value={valorAjustado}
            onChange={(e) => setValorAjustado(e.target.value)}
            placeholder={String(total)}
            className="w-full rounded-md border border-cinza-borda bg-white px-3 py-2 text-sm"
          />
        </label>
        <label className="mt-3 block">
          <span className="mb-1 block text-xs font-medium text-cinza-texto">Observações</span>
          <textarea
            name="observacoes"
            rows={2}
            className="w-full rounded-md border border-cinza-borda bg-white px-3 py-2 text-sm"
          />
        </label>
      </section>

      {erro && (
        <p className="whitespace-pre-line rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="w-full rounded-lg bg-marinho px-6 py-3 font-medium text-white disabled:opacity-50"
      >
        {enviando ? 'Gerando...' : 'Gerar orçamento'}
      </button>
    </form>
  )
}
