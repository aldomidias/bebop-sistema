'use client'

import { Icone } from './Icones'

export function Contador({
  valor,
  maximo,
  aoMudar,
  rotulo,
}: {
  valor: number
  maximo: number
  aoMudar: (novo: number) => void
  rotulo: string
}) {
  const podeDiminuir = valor > 0
  const podeAumentar = valor < maximo
  const botao =
    'flex h-10 w-10 items-center justify-center rounded-botao border border-cinza-200 bg-white text-navy disabled:opacity-30'
  return (
    <div className="flex items-center gap-1" role="group" aria-label={`Quantidade de ${rotulo}`}>
      <button
        type="button"
        className={botao}
        disabled={!podeDiminuir}
        onClick={() => aoMudar(valor - 1)}
        aria-label={`Menos um ${rotulo}`}
      >
        <Icone nome="menos" tamanho={18} />
      </button>
      <span
        className={`w-8 text-center font-titulo text-xl font-semibold ${valor > 0 ? 'text-navy' : 'text-cinza-400'}`}
        aria-live="polite"
      >
        {valor}
      </span>
      <button
        type="button"
        className={botao}
        disabled={!podeAumentar}
        onClick={() => aoMudar(valor + 1)}
        aria-label={`Mais um ${rotulo}`}
      >
        <Icone nome="mais" tamanho={18} />
      </button>
    </div>
  )
}
