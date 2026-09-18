import { describe, it, expect } from 'vitest'
import { calcularTotal, calcularTotalFinal, contarDiarias } from '@/lib/pricing'

const d = (iso: string) => new Date(`${iso}T00:00:00`)

describe('contarDiarias', () => {
  it('conta um dia para evento de data única', () => {
    expect(contarDiarias(d('2026-10-10'), d('2026-10-10'))).toBe(1)
  })

  it('conta três dias para evento de sexta a domingo', () => {
    expect(contarDiarias(d('2026-10-09'), d('2026-10-11'))).toBe(3)
  })

  it('nunca retorna menos que um dia', () => {
    expect(contarDiarias(d('2026-10-11'), d('2026-10-09'))).toBe(1)
  })
})

describe('calcularTotal', () => {
  it('retorna zero para lista vazia', () => {
    expect(calcularTotal([], 1)).toBe(0)
  })

  it('multiplica quantidade pelo preço aplicado', () => {
    const itens = [{ quantidade: 4, precoAplicado: 150 }]
    expect(calcularTotal(itens, 1)).toBe(600)
  })

  it('soma itens diferentes', () => {
    const itens = [
      { quantidade: 4, precoAplicado: 150 },
      { quantidade: 2, precoAplicado: 300 },
    ]
    expect(calcularTotal(itens, 1)).toBe(1200)
  })

  it('multiplica pelo número de diárias', () => {
    const itens = [{ quantidade: 4, precoAplicado: 150 }]
    expect(calcularTotal(itens, 3)).toBe(1800)
  })
})

describe('calcularTotalFinal', () => {
  const itens = [{ quantidade: 4, precoAplicado: 150 }]

  it('usa o total calculado quando não há ajuste', () => {
    expect(calcularTotalFinal(itens, 1, null)).toBe(600)
  })

  it('usa o valor ajustado quando presente', () => {
    expect(calcularTotalFinal(itens, 1, 500)).toBe(500)
  })

  it('aceita ajuste para cima', () => {
    expect(calcularTotalFinal(itens, 1, 800)).toBe(800)
  })

  it('aceita ajuste igual a zero como cortesia', () => {
    expect(calcularTotalFinal(itens, 1, 0)).toBe(0)
  })
})
