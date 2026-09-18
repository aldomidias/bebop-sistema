import { corDoMedidor, segmentosAcesos, SEGMENTOS_PADRAO } from './medidor-utils'

// Estilos em globals.css (.medidor, .medidor-seg). Animação só ao montar.
export function Medidor({
  disponivel,
  total,
  ativo = true,
  className = '',
}: {
  disponivel: number
  total: number
  ativo?: boolean
  className?: string
}) {
  const cor = corDoMedidor(disponivel, total, ativo)
  const acesos = ativo ? segmentosAcesos(disponivel, total) : 0
  return (
    <div
      className={`medidor medidor--${cor} ${className}`}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={Math.max(0, disponivel)}
      aria-label={`${disponivel} de ${total} disponíveis`}
    >
      {Array.from({ length: SEGMENTOS_PADRAO }, (_, i) => (
        <span
          key={i}
          className={`medidor-seg ${i < acesos ? 'medidor-seg--aceso' : ''}`}
          style={i < acesos ? { animationDelay: `${i * 25}ms` } : undefined}
        />
      ))}
    </div>
  )
}
