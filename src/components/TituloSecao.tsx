import Link from 'next/link'

export function TituloSecao({
  titulo,
  verMais,
}: {
  titulo: string
  verMais?: { href: string; rotulo?: string }
}) {
  return (
    <div className="mb-3 flex items-baseline justify-between">
      <h2 className="font-titulo text-lg font-semibold text-navy">{titulo}</h2>
      {verMais && (
        <Link href={verMais.href} className="text-sm font-medium text-laranja">
          {verMais.rotulo ?? 'Ver mais'}
        </Link>
      )}
    </div>
  )
}
