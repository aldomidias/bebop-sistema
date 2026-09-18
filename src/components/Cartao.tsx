export function Cartao({
  children,
  className = '',
  destaque = false,
}: {
  children: React.ReactNode
  className?: string
  destaque?: boolean
}) {
  return (
    <div
      className={`rounded-cartao bg-white p-4 ${destaque ? 'shadow-flutuante' : 'shadow-card'} ${className}`}
    >
      {children}
    </div>
  )
}
