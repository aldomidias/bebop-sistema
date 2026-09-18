type Status = 'orcamento' | 'confirmado' | 'concluido' | 'cancelado'

const ESTILOS: Record<Status, { texto: string; classe: string }> = {
  orcamento: { texto: 'Orçamento', classe: 'bg-amber-100 text-amber-800 border-amber-200' },
  confirmado: { texto: 'Confirmado', classe: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  concluido: { texto: 'Concluído', classe: 'bg-slate-100 text-slate-600 border-slate-200' },
  cancelado: { texto: 'Cancelado', classe: 'bg-red-100 text-red-700 border-red-200' },
}

export function StatusBadge({ status }: { status: Status }) {
  const estilo = ESTILOS[status]
  return (
    <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${estilo.classe}`}>
      {estilo.texto}
    </span>
  )
}
