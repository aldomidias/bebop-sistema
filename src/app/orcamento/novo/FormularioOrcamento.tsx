'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { criarOrcamento } from '@/lib/actions/events'
import { formatarMoeda } from '@/lib/format'
import { Cartao } from '@/components/Cartao'
import { Chip, Carrossel } from '@/components/Chip'
import { Contador } from '@/components/Contador'
import { Medidor } from '@/components/Medidor'
import { Led } from '@/components/Led'
import { Icone } from '@/components/Icones'
import { BotaoPrimario } from '@/components/Botoes'
import { iconeDaCategoria, rotuloCurtoDaCategoria } from '@/components/categorias'

type ItemDisponivel = {
  id: string
  nome: string
  categoria: string
  disponivel: number
  total: number
  precoBaseDiaria: number
}

const CAMPO = 'h-12 w-full rounded-campo border border-cinza-200 bg-white px-3 text-base text-navy'
const ROTULO = 'mb-1 block text-xs font-medium text-cinza-700'
const TODAS = 'Todas'

function NumeroPasso({ n }: { n: number }) {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy font-titulo text-sm font-semibold text-white">
      {n}
    </span>
  )
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
  const [filtro, setFiltro] = useState(TODAS)
  const erroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (erro) erroRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [erro])

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

  const categorias = useMemo(() => {
    const vistas: string[] = []
    for (const item of itens) if (item.disponivel > 0 && !vistas.includes(item.categoria)) vistas.push(item.categoria)
    return vistas
  }, [itens])

  const porCategoria = useMemo(() => {
    const mapa = new Map<string, ItemDisponivel[]>()
    for (const item of itens) {
      if (item.disponivel === 0) continue
      if (filtro !== TODAS && item.categoria !== filtro) continue
      const lista = mapa.get(item.categoria) ?? []
      lista.push(item)
      mapa.set(item.categoria, lista)
    }
    return mapa
  }, [itens, filtro])

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
    <form action={aoEnviar} className="space-y-5 pb-28">
      <Cartao>
        <div className="mb-4 flex items-center gap-3">
          <NumeroPasso n={1} />
          <h2 className="font-titulo text-lg font-semibold text-navy">Cliente e evento</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block"><span className={ROTULO}>Nome do cliente</span><input name="clienteNome" required className={CAMPO} /></label>
          <label className="block"><span className={ROTULO}>Telefone</span><input name="clienteTelefone" type="tel" required className={CAMPO} /></label>
          <label className="block">
            <span className={ROTULO}>Data de início</span>
            <input type="date" value={dataInicio} required className={CAMPO}
              onChange={(e) => {
                const novoInicio = e.target.value
                const novoFim = novoInicio > dataFim ? novoInicio : dataFim
                setDataInicio(novoInicio)
                setDataFim(novoFim)
                router.replace(`/orcamento/novo?inicio=${novoInicio}&fim=${novoFim}`)
              }} />
          </label>
          <label className="block">
            <span className={ROTULO}>Data de término</span>
            <input type="date" value={dataFim} min={dataInicio} required className={CAMPO}
              onChange={(e) => {
                const novoFim = e.target.value
                setDataFim(novoFim)
                router.replace(`/orcamento/novo?inicio=${dataInicio}&fim=${novoFim}`)
              }} />
          </label>
          <label className="block sm:col-span-2"><span className={ROTULO}>Local</span><input name="local" required className={CAMPO} /></label>
          <label className="block sm:col-span-2">
            <span className={ROTULO}>Tipo de evento</span>
            <select name="tipo" defaultValue="casamento" className={CAMPO}>
              <option value="casamento">Casamento</option>
              <option value="quinze_anos">15 Anos</option>
              <option value="aniversario">Aniversário</option>
              <option value="show">Show</option>
              <option value="outro">Outro</option>
            </select>
          </label>
        </div>
        {diarias > 1 && (
          <p className="mt-3 text-sm text-cinza-700">{diarias} diárias · os valores são multiplicados por {diarias}</p>
        )}
      </Cartao>

      <Cartao>
        <div className="mb-1 flex items-center gap-3">
          <NumeroPasso n={2} />
          <h2 className="font-titulo text-lg font-semibold text-navy">Equipamento</h2>
        </div>
        <p className="mb-3 text-xs text-cinza-700">Só o que está livre nas datas escolhidas.</p>
        {categorias.length === 0 ? (
          <p className="rounded-campo bg-cinza-100 px-4 py-6 text-center text-sm text-cinza-700">
            Nada livre nessas datas. Tente outra data ou confira a Disponibilidade.
          </p>
        ) : (
          <>
            <Carrossel>
              <Chip ativo={filtro === TODAS} onClick={() => setFiltro(TODAS)}>{TODAS}</Chip>
              {categorias.map((c) => (
                <Chip key={c} ativo={filtro === c} onClick={() => setFiltro(c)}>{rotuloCurtoDaCategoria(c)}</Chip>
              ))}
            </Carrossel>
            <div className="mt-4 space-y-4">
              {Array.from(porCategoria.entries()).map(([categoria, lista]) => (
                <div key={categoria}>
                  <h3 className="mb-2 text-sm font-semibold text-navy">{categoria}</h3>
                  <ul className="divide-y divide-cinza-200">
                    {lista.map((item) => {
                      const escolhido = selecionados[item.id] ?? 0
                      return (
                        <li key={item.id} className="flex items-center gap-3 py-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-botao bg-cinza-100 text-navy">
                            <Icone nome={iconeDaCategoria(item.categoria)} tamanho={20} />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-navy">{item.nome}</p>
                            <p className="text-xs text-cinza-700">
                              {formatarMoeda(item.precoBaseDiaria)} · {item.disponivel - escolhido} {item.disponivel - escolhido === 1 ? 'livre' : 'livres'}
                            </p>
                            <Medidor disponivel={item.disponivel - escolhido} total={item.total} className="mt-1.5" />
                          </div>
                          <Contador valor={escolhido} maximo={item.disponivel} rotulo={item.nome}
                            aoMudar={(novo) => ajustarQuantidade(item.id, novo, item.disponivel)} />
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
      </Cartao>

      <Cartao>
        <div className="mb-4 flex items-center gap-3">
          <NumeroPasso n={3} />
          <h2 className="font-titulo text-lg font-semibold text-navy">Valor</h2>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-cinza-700">Total calculado</span>
          <span className="font-titulo text-xl font-semibold text-navy">{formatarMoeda(total)}</span>
        </div>
        <label className="mt-3 block">
          <span className={ROTULO}>Valor final (deixe vazio para usar o calculado)</span>
          <input type="number" inputMode="decimal" step="0.01" min={0} value={valorAjustado}
            onChange={(e) => setValorAjustado(e.target.value)} placeholder={String(total)} className={CAMPO} />
        </label>
        <label className="mt-3 block">
          <span className={ROTULO}>Observações</span>
          <textarea name="observacoes" rows={2} className="w-full rounded-campo border border-cinza-200 bg-white px-3 py-2 text-base text-navy" />
        </label>
      </Cartao>

      {erro && (
        <div ref={erroRef} role="alert" className="rounded-cartao border border-vermelho/30 bg-white p-4 shadow-card">
          <Led tom="vermelho" rotulo="Não deu para gerar" />
          <p className="mt-2 whitespace-pre-line text-sm text-tinta">{erro}</p>
        </div>
      )}

      <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-cinza-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:sticky md:bottom-0 md:rounded-cartao md:border">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3">
          <div className="min-w-0">
            <p className="text-xs text-cinza-700">Total</p>
            <p className="font-titulo text-xl font-bold leading-tight text-navy">
              {formatarMoeda(valorAjustado.trim() === '' ? total : Number(valorAjustado))}
            </p>
          </div>
          <BotaoPrimario type="submit" disabled={enviando} className="flex-1">
            {enviando ? 'Gerando…' : 'Gerar orçamento'}
          </BotaoPrimario>
        </div>
      </div>
    </form>
  )
}
