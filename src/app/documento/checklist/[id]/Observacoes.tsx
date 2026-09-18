'use client'

import { useState } from 'react'
import { salvarObservacoes } from '@/lib/actions/checklist'

export function Observacoes({
  eventoId,
  inicial,
}: {
  eventoId: string
  inicial: string
}) {
  const [texto, setTexto] = useState(inicial)
  const [salvo, setSalvo] = useState(false)
  const [salvando, setSalvando] = useState(false)

  async function salvar() {
    setSalvando(true)
    try {
      await salvarObservacoes(eventoId, texto)
      setSalvo(true)
      setTimeout(() => setSalvo(false), 2000)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div>
      <div className="sem-impressao">
        <textarea
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value)
            setSalvo(false)
          }}
          rows={3}
          placeholder="Horário de montagem, ponto de referência, instruções para a equipe"
          className="w-full rounded-md border px-3 py-2 text-sm"
          style={{ borderColor: '#E1E4E8' }}
        />
        <div className="mt-2 flex items-center gap-3">
          <button
            onClick={salvar}
            disabled={salvando}
            className="rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            style={{ background: '#14213D' }}
          >
            {salvando ? 'Salvando...' : 'Salvar observações'}
          </button>
          {salvo && <span className="text-sm text-emerald-700">Salvo</span>}
        </div>
      </div>

      {texto.trim() !== '' && (
        <p className="hidden text-base print:block">{texto}</p>
      )}
    </div>
  )
}
