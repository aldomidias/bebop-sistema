'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Logo horizontal claro (477x200). Régua de 3px é o único lugar do degradê.
export function CabecalhoApp() {
  const caminho = usePathname()
  if (caminho.startsWith('/documento')) return null

  return (
    <header className="bg-white">
      <div className="h-[3px]" style={{ background: 'var(--degrade-acento)' }} aria-hidden="true" />
      <div className="mx-auto flex h-12 max-w-4xl items-center px-4">
        <Link href="/" aria-label="Início">
          <Image src="/logo-bebop.png" alt="Bebop Som e Luz" width={57} height={24} priority />
        </Link>
      </div>
    </header>
  )
}
