import Link from 'next/link'
import type { ButtonHTMLAttributes } from 'react'

type PropsBotao = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string
  children: React.ReactNode
  className?: string
}

const BASE =
  'inline-flex h-12 w-full items-center justify-center gap-2 rounded-botao px-5 font-titulo text-base font-semibold transition-opacity disabled:opacity-50'

function render(classe: string, { href, children, className = '', ...rest }: PropsBotao) {
  if (href) {
    return (
      <Link href={href} className={`${BASE} ${classe} ${className}`}>
        {children}
      </Link>
    )
  }
  return (
    <button className={`${BASE} ${classe} ${className}`} {...rest}>
      {children}
    </button>
  )
}

// Um por tela. É o único lugar do laranja em botão.
export function BotaoPrimario(props: PropsBotao) {
  return render('bg-laranja text-white shadow-card', props)
}

export function BotaoSecundario(props: PropsBotao) {
  return render('border-[1.5px] border-cinza-200 bg-white text-navy', props)
}

// Ação discreta em texto (rodapé de card, cancelar).
export function BotaoTexto({ tom = 'navy', ...props }: PropsBotao & { tom?: 'navy' | 'vermelho' }) {
  return render(
    `h-10 w-auto px-3 text-sm ${tom === 'vermelho' ? 'text-vermelho' : 'text-navy'}`,
    props
  )
}
