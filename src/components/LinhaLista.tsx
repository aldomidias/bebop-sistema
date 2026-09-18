import Link from 'next/link'
import { Icone, type NomeIcone } from './Icones'

export function LinhaLista({
  icone,
  titulo,
  subtitulo,
  href,
  desabilitada = false,
}: {
  icone: NomeIcone
  titulo: string
  subtitulo?: string
  href?: string
  desabilitada?: boolean
}) {
  const conteudo = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-botao bg-cinza-100 text-navy">
        <Icone nome={icone} tamanho={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium text-navy">{titulo}</span>
        {subtitulo && <span className="block truncate text-sm text-cinza-700">{subtitulo}</span>}
      </span>
      {href && !desabilitada && <Icone nome="seta" tamanho={20} className="shrink-0 text-cinza-400" />}
    </>
  )
  const classe = `flex min-h-14 items-center gap-3 px-4 py-3 ${desabilitada ? 'opacity-50' : ''}`
  if (href && !desabilitada) {
    return (
      <Link href={href} className={`${classe} active:bg-cinza-100`}>
        {conteudo}
      </Link>
    )
  }
  return <div className={classe}>{conteudo}</div>
}
