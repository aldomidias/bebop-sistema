'use client'

export function Chip({
  ativo = false,
  children,
  onClick,
}: {
  ativo?: boolean
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={`h-10 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors ${
        ativo ? 'border-navy bg-navy text-white' : 'border-cinza-200 bg-white text-navy'
      }`}
    >
      {children}
    </button>
  )
}

export function Carrossel({ children }: { children: React.ReactNode }) {
  return <div className="carrossel -mx-4 px-4">{children}</div>
}
