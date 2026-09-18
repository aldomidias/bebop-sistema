export type NomeIcone =
  | 'casa' | 'medidor' | 'recibo' | 'caixa' | 'mesa' | 'microfone' | 'luz'
  | 'estrutura' | 'instrumento' | 'cabo' | 'seta' | 'busca' | 'mais' | 'menos'
  | 'calendario' | 'usuario'

// Traçado 24x24, stroke 1.8. `preenchido` é usado na aba ativa.
const CAMINHOS: Record<NomeIcone, string> = {
  casa: 'M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  medidor: 'M4 20V12M10 20V6M16 20V10M22 20V3',
  recibo: 'M6 2h12v20l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6',
  caixa: 'M6 2h12a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zM12 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM12 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
  mesa: 'M5 4v16M12 4v16M19 4v16M3 9h4v4H3zM10 13h4v4h-4zM17 6h4v4h-4z',
  microfone: 'M9 2h6a0 0 0 0 1 0 0v8a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2a0 0 0 0 1 0 0zM5 10a7 7 0 0 0 14 0M12 17v5M8 22h8',
  luz: 'M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z',
  estrutura: 'M3 6h18M3 18h18M5 6v12M19 6v12M5 6l14 12M19 6L5 18',
  instrumento: 'M9 18V5l12-2v13M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  cabo: 'M9 2v6M15 2v6M7 8h10v4a5 5 0 0 1-10 0zM12 17v5',
  seta: 'm9 6 6 6-6 6',
  busca: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-3.5-3.5',
  mais: 'M12 5v14M5 12h14',
  menos: 'M5 12h14',
  calendario: 'M4 5h16v16H4zM4 10h16M8 3v4M16 3v4',
  usuario: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
}

export function Icone({
  nome,
  tamanho = 24,
  preenchido = false,
  className = '',
}: {
  nome: NomeIcone
  tamanho?: number
  preenchido?: boolean
  className?: string
}) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill={preenchido ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={CAMINHOS[nome]} />
    </svg>
  )
}
