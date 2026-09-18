import type { Metadata, Viewport } from 'next'
import { Inter, Outfit } from 'next/font/google'
import { BarraNavegacao } from '@/components/BarraNavegacao'
import { CabecalhoApp } from '@/components/CabecalhoApp'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--fonte-outfit',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--fonte-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bebop Som e Luz',
  description: 'Gestão de locação de equipamento para eventos',
}

// Sem isto o navegador renderiza a página como desktop (~980px) e encolhe
// tudo, cortando o conteúdo no celular — que é onde o sistema é usado.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F2F4F6',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${inter.variable}`}>
      <body className="min-h-screen pb-24 md:pb-8">
        <CabecalhoApp />
        <BarraNavegacao />
        <main className="mx-auto max-w-4xl px-4 py-5">{children}</main>
      </body>
    </html>
  )
}
