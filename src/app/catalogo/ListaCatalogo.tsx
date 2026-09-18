'use client'

import { useMemo, useState } from 'react'
import { Chip, Carrossel } from '@/components/Chip'
import { Icone } from '@/components/Icones'
import { TituloSecao } from '@/components/TituloSecao'
import { rotuloCurtoDaCategoria } from '@/components/categorias'
import { LinhaItem, type PropsLinhaItem } from './LinhaItem'

type Categoria = { id: string; nome: string; itens: PropsLinhaItem[] }
const TODAS = 'Todas'

export function ListaCatalogo({ categorias }: { categorias: Categoria[] }) {
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState(TODAS)

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return categorias
      .filter((c) => filtro === TODAS || c.nome === filtro)
      .map((c) => ({ ...c, itens: c.itens.filter((i) => i.nome.toLowerCase().includes(termo)) }))
      .filter((c) => c.itens.length > 0)
  }, [categorias, busca, filtro])

  return (
    <div className="space-y-5">
      <label className="flex h-12 items-center gap-2 rounded-full bg-white px-4 shadow-card">
        <span className="text-cinza-400"><Icone nome="busca" tamanho={20} /></span>
        <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar equipamento"
          className="min-w-0 flex-1 bg-transparent text-base text-navy placeholder:text-cinza-400 focus:outline-none" />
      </label>
      <Carrossel>
        <Chip ativo={filtro === TODAS} onClick={() => setFiltro(TODAS)}>{TODAS}</Chip>
        {categorias.map((c) => (
          <Chip key={c.id} ativo={filtro === c.nome} onClick={() => setFiltro(c.nome)}>{rotuloCurtoDaCategoria(c.nome)}</Chip>
        ))}
      </Carrossel>
      {visiveis.length === 0 && <p className="py-8 text-center text-sm text-cinza-700">Nada com esse nome.</p>}
      {visiveis.map((categoria) => (
        <section key={categoria.id}>
          <TituloSecao titulo={categoria.nome} />
          <ul className="divide-y divide-cinza-200 rounded-cartao bg-white shadow-card">
            {categoria.itens.map((item) => <LinhaItem key={item.id} {...item} categoria={categoria.nome} />)}
          </ul>
        </section>
      ))}
    </div>
  )
}
