const PASSOS = ['Orçamento', 'Confirmado', 'Checklist']

export function LinhaProgresso({ passo }: { passo: 1 | 2 | 3 }) {
  return (
    <ol className="flex items-center gap-2" aria-label={`Passo ${passo} de 3`}>
      {PASSOS.map((rotulo, i) => {
        const feito = i < passo
        return (
          <li key={rotulo} className="flex flex-1 flex-col gap-1">
            <span className={`h-1.5 rounded-full ${feito ? 'bg-verde' : 'bg-cinza-200'}`} />
            <span className={`text-[11px] font-medium ${feito ? 'text-verde' : 'text-cinza-400'}`}>
              {rotulo}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
