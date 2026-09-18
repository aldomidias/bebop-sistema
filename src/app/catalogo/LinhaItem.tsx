'use client'

import { useState } from 'react'
import { atualizarItem } from '@/lib/actions/catalog'
import { formatarMoeda } from '@/lib/format'
import { Icone } from '@/components/Icones'
import { iconeDaCategoria } from '@/components/categorias'
import { Led } from '@/components/Led'
import { BotaoSecundario, BotaoTexto } from '@/components/Botoes'

type Props = {
  id: string
  nome: string
  quantidadeTotal: number
  precoBaseDiaria: number
  status: string
  observacao: string | null
  categoria?: string
}

export type PropsLinhaItem = Props

const CAMPO = 'h-12 w-full rounded-campo border border-cinza-200 bg-white px-3 text-base text-navy'
const ROTULO = 'mb-1 block text-xs font-medium text-cinza-700'

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
      <li className="flex items-center gap-3 px-4 py-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-botao bg-cinza-100 text-navy">
          <Icone nome={iconeDaCategoria(props.categoria ?? '')} tamanho={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-navy">{props.nome}</p>
          <p className="mt-0.5 text-xs text-cinza-700">
            {props.quantidadeTotal} unidades · {formatarMoeda(props.precoBaseDiaria)} por diária
          </p>
          <div className="mt-1">
            <Led tom={props.status === 'ativo' ? 'verde' : props.status === 'manutencao' ? 'ambar' : 'cinza'}
              rotulo={props.status === 'ativo' ? 'Disponível' : props.status === 'manutencao' ? 'Em manutenção' : 'Saindo de catálogo'} />
          </div>
        </div>
        <button onClick={() => setEditando(true)} className="h-10 shrink-0 rounded-botao border border-cinza-200 px-4 text-sm font-medium text-navy">
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
          <span className={ROTULO}>Quantidade</span>
          <input
            type="number"
            min={0}
            value={quantidade}
            onChange={(e) => setQuantidade(Number(e.target.value))}
            className={CAMPO}
          />
        </label>
        <label className="block">
          <span className={ROTULO}>Preço por diária</span>
          <input
            type="number"
            min={0}
            step="0.01"
            value={preco}
            onChange={(e) => setPreco(Number(e.target.value))}
            className={CAMPO}
          />
        </label>
        <label className="block">
          <span className={ROTULO}>Situação</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={CAMPO}
          >
            <option value="ativo">Disponível</option>
            <option value="manutencao">Em manutenção</option>
            <option value="saindo_catalogo">Saindo de catálogo</option>
          </select>
        </label>
      </div>
      {erro && <p className="text-sm text-vermelho">{erro}</p>}
      <div className="flex gap-2">
        <BotaoSecundario type="button" onClick={salvar} disabled={salvando} className="w-auto px-6">
          {salvando ? 'Salvando...' : 'Salvar'}
        </BotaoSecundario>
        <BotaoTexto type="button" onClick={() => setEditando(false)}>Cancelar</BotaoTexto>
      </div>
    </li>
  )
}
