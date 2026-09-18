'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icone, type NomeIcone } from './Icones'

const ABAS: { href: string; rotulo: string; icone: NomeIcone }[] = [
  { href: '/', rotulo: 'Início', icone: 'casa' },
  { href: '/disponibilidade', rotulo: 'Disponibilidade', icone: 'medidor' },
  { href: '/orcamento/novo', rotulo: 'Orçamento', icone: 'recibo' },
  { href: '/catalogo', rotulo: 'Catálogo', icone: 'caixa' },
]

export function BarraNavegacao() {
  const caminho = usePathname()
  if (caminho.startsWith('/documento')) return null

  return (
    <nav
      aria-label="Principal"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-cinza-200 bg-white pb-[env(safe-area-inset-bottom)] md:sticky md:top-0 md:border-b md:border-t-0 md:pb-0"
    >
      <div className="mx-auto flex max-w-4xl">
        {ABAS.map((aba) => {
          const ativa = aba.href === '/' ? caminho === '/' : caminho.startsWith(aba.href)
          return (
            <Link
              key={aba.href}
              href={aba.href}
              aria-current={ativa ? 'page' : undefined}
              className={`flex h-16 flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium ${
                ativa ? 'text-navy' : 'text-cinza-700'
              }`}
            >
              <Icone nome={aba.icone} tamanho={24} preenchido={ativa && aba.icone !== 'medidor'} />
              <span className={ativa ? 'font-semibold' : ''}>{aba.rotulo}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
