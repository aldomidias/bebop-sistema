'use client'

export function PrintButton({ rotulo = 'Imprimir / Salvar PDF' }: { rotulo?: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="sem-impressao rounded-lg bg-marinho px-5 py-2.5 text-sm font-medium text-white"
    >
      {rotulo}
    </button>
  )
}
