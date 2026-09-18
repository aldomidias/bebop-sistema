'use client'

import { useMemo, useState } from 'react'
import { Chip, Carrossel } from '@/components/Chip'
import { Icone } from '@/components/Icones'
import { Medidor } from '@/components/Medidor'
import { TituloSecao } from '@/components/TituloSecao'
import { iconeDaCategoria, rotuloCurtoDaCategoria } from '@/components/categorias'

export type ItemDisponibilidadeUI = {
  id: string
  nome: string
  categoria: string
  status: 'ativo' | 'manutencao' | 'saindo_catalogo'
  observacao: string | null
  disponivel: number
  total: number
  confirmadas: number
  emOrcamento: number
}

const TODAS = 'Todas'

export function ListaDisponibilidade({ itens }: { itens: ItemDisponibilidadeUI[] }) {
  const [filtro, setFiltro] = useState(TODAS)

  const categorias = useMemo(() => {
    const vistas: string[] = []
    for (const item of itens) if (!vistas.includes(item.categoria)) vistas.push(item.categoria)
    return vistas
  }, [itens])

  const porCategoria = useMemo(() => {
    const mapa = new Map<string, ItemDisponibilidadeUI[]>()
    for (const item of itens) {
      if (filtro !== TODAS && item.categoria !== filtro) continue
      const lista = mapa.get(item.categoria) ?? []
      lista.push(item)
      mapa.set(item.categoria, lista)
    }
    return mapa
  }, [itens, filtro])

  return (
    <div className="space-y-6">
      <Carrossel>
        <Chip ativo={filtro === TODAS} onClick={() => setFiltro(TODAS)}>{TODAS}</Chip>
        {categorias.map((categoria) => (
          <Chip key={categoria} ativo={filtro === categoria} onClick={() => setFiltro(categoria)}>
            {rotuloCurtoDaCategoria(categoria)}
          </Chip>
        ))}
      </Carrossel>

      {Array.from(porCategoria.entries()).map(([categoria, lista]) => (
        <section key={categoria}>
          <TituloSecao titulo={categoria} />
          <ul className="divide-y divide-cinza-200 rounded-cartao bg-white shadow-card">
            {lista.map((item) => {
              const ativo = item.status === 'ativo'
              const motivo = item.status === 'manutencao' ? 'Em manutenção' : 'Saindo de catálogo'
              return (
                <li key={item.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-botao bg-cinza-100 text-navy">
                    <Icone nome={iconeDaCategoria(item.categoria)} tamanho={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-navy">{item.nome}</p>
                    <Medidor disponivel={item.disponivel} total={item.total} ativo={ativo} className="mt-2" />
                    <p className="mt-1.5 text-xs text-cinza-400">
                      {!ativo
                        ? `${motivo}${item.observacao ? ` · ${item.observacao}` : ''}`
                        : [
                            item.confirmadas > 0 && `${item.confirmadas} confirmadas`,
                            item.emOrcamento > 0 && `${item.emOrcamento} em orçamento`,
                          ]
                            .filter(Boolean)
                            .join(' · ') || 'Tudo livre'}
                    </p>
                  </div>
                  <div className="w-14 shrink-0 text-right">
                    <p className={`font-titulo text-[28px] font-bold leading-none ${ativo && item.disponivel > 0 ? 'text-navy' : 'text-cinza-400'}`}>
                      {ativo ? item.disponivel : '—'}
                    </p>
                    <p className="mt-1 text-xs text-cinza-400">de {item.total}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
