import type { Metadata } from 'next'
import { Navigation } from '@/components/Navigation'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bebop Som e Luz',
  description: 'Gestão de locação de equipamento para eventos',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen pb-20 md:pb-0">
        <Navigation />
        <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
      </body>
    </html>
  )
}
