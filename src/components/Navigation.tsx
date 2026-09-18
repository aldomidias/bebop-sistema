'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ITENS = [
  { href: '/', rotulo: 'Agenda' },
  { href: '/disponibilidade', rotulo: 'Disponibilidade' },
  { href: '/orcamento/novo', rotulo: 'Orçamento' },
  { href: '/catalogo', rotulo: 'Catálogo' },
]

export function Navigation() {
  const caminho = usePathname()

  if (caminho.startsWith('/documento')) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-cinza-borda bg-white md:sticky md:top-0 md:border-b md:border-t-0">
      <div className="mx-auto flex max-w-4xl">
        {ITENS.map((item) => {
          const ativo = item.href === '/' ? caminho === '/' : caminho.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 px-2 py-4 text-center text-sm font-medium transition-colors ${
                ativo ? 'text-marinho border-t-2 border-coral md:border-t-0 md:border-b-2' : 'text-cinza-texto'
              }`}
            >
              {item.rotulo}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
