export { LED_STATUS, COR, TEXTO } from './led-status'
export type { TomLed, StatusEvento } from './led-status'

import { COR, TEXTO, LED_STATUS } from './led-status'
import type { TomLed, StatusEvento } from './led-status'

// Sempre com texto ao lado — cor sozinha não comunica.
export function Led({ tom, rotulo }: { tom: TomLed; rotulo: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${TEXTO[tom]}`}>
      <span className={`inline-block h-2 w-2 rounded-full ${COR[tom]}`} aria-hidden="true" />
      {rotulo}
    </span>
  )
}

export function LedStatus({ status }: { status: StatusEvento }) {
  const { tom, rotulo } = LED_STATUS[status]
  return <Led tom={tom} rotulo={rotulo} />
}
