'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

export async function salvarObservacoes(eventoId: string, observacoes: string) {
  await db.checklist.upsert({
    where: { eventoId },
    create: { eventoId, observacoes },
    update: { observacoes },
  })

  revalidatePath(`/documento/checklist/${eventoId}`)
}
