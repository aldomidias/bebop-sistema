'use client'

import { useState } from 'react'
import { atualizarItem } from '@/lib/actions/catalog'
import { formatarMoeda } from '@/lib/format'

type Props = {
  id: string
  nome: string
  quantidadeTotal: number
  precoBaseDiaria: number
  status: string
  observacao: string | null
}

export function LinhaItem(props: Props) {
  const [editando, setEditando] = useState(false)
  const [quantidade, setQuantidade] = useState(props.quantidadeTotal)
  const [preco, setPreco] = useState(props.precoBaseDiaria)
  const [status, setStatus] = useState(props.status)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function salvar() {
    setSalvando(true)
    setErro(null)
    try {
      await atualizarItem(props.id, {
        quantidadeTotal: quantidade,
        precoBaseDiaria: preco,
        status,
      })
      setEditando(false)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível salvar o item.')
    } finally {
      setSalvando(false)
    }
  }

  if (!editando) {
    return (
      <li className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="font-medium text-navy">{props.nome}</p>
          <p className="mt-0.5 text-xs text-cinza-700">
            {props.quantidadeTotal} unidades · {formatarMoeda(props.precoBaseDiaria)} por diária
            {props.status !== 'ativo' &&
              ` · ${props.status === 'manutencao' ? 'Em manutenção' : 'Saindo de catálogo'}`}
          </p>
        </div>
        <button
          onClick={() => setEditando(true)}
          className="shrink-0 rounded-md border border-cinza-200 px-3 py-1.5 text-sm text-navy"
        >
          Editar
        </button>
      </li>
    )
  }

  return (
    <li className="space-y-3 bg-cinza-100 px-4 py-4">
      <p className="font-medium text-navy">{props.nome}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-cinza-700">Quantidade</span>
          <input
            type="number"
            min={0}
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value))}
            className="w-full rounded-md border border-cinza-200 bg-white px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-cinza-700">Preço por diária</span>
          <input
            type="number"
            min={0}
            step="0.01"
            value={preco}
            onChange={(e) => setPreco(Number(e.target.value))}
            className="w-full rounded-md border border-cinza-200 bg-white px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-cinza-700">Situação</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-md border border-cinza-200 bg-white px-3 py-2 text-sm"
          >
            <option value="ativo">Disponível</option>
            <option value="manutencao">Em manutenção</option>
            <option value="saindo_catalogo">Saindo de catálogo</option>
          </select>
        </label>
      </div>
      {erro && <p className="text-sm text-vermelho">{erro}</p>}
      <div className="flex gap-2">
        <button
          onClick={salvar}
          disabled={salvando}
          className="rounded-md bg-navy px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {salvando ? 'Salvando...' : 'Salvar'}
        </button>
        <button
          onClick={() => setEditando(false)}
          className="rounded-md border border-cinza-200 px-4 py-2 text-sm text-cinza-700"
        >
          Cancelar
        </button>
      </div>
    </li>
  )
}
