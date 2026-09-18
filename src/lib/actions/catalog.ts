'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'

export async function atualizarItem(
  itemId: string,
  dados: { quantidadeTotal: number; precoBaseDiaria: number; status: string }
) {
  if (dados.quantidadeTotal < 0) {
    throw new Error('A quantidade não pode ser negativa.')
  }
  if (dados.precoBaseDiaria < 0) {
    throw new Error('O preço não pode ser negativo.')
  }

  await db.item.update({
    where: { id: itemId },
    data: {
      quantidadeTotal: dados.quantidadeTotal,
      precoBaseDiaria: dados.precoBaseDiaria,
      status: dados.status as 'ativo' | 'manutencao' | 'saindo_catalogo',
    },
  })

  revalidatePath('/catalogo')
  revalidatePath('/disponibilidade')
}
