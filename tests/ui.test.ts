import { describe, it, expect } from 'vitest'
import { iconeDaCategoria, rotuloCurtoDaCategoria } from '@/components/categorias'
import { LED_STATUS } from '@/components/Led'

describe('categorias', () => {
  it('mapeia cada categoria do catálogo para um ícone', () => {
    expect(iconeDaCategoria('Caixas de Som')).toBe('caixa')
    expect(iconeDaCategoria('Mesas de Som')).toBe('mesa')
    expect(iconeDaCategoria('Microfones')).toBe('microfone')
    expect(iconeDaCategoria('Iluminação')).toBe('luz')
    expect(iconeDaCategoria('Estrutura e Palco')).toBe('estrutura')
    expect(iconeDaCategoria('Instrumentos')).toBe('instrumento')
    expect(iconeDaCategoria('Cabos e Acessórios')).toBe('cabo')
  })

  it('categoria desconhecida cai no ícone de caixa', () => {
    expect(iconeDaCategoria('Fumaça')).toBe('caixa')
  })

  it('rótulo curto cabe num chip', () => {
    expect(rotuloCurtoDaCategoria('Caixas de Som')).toBe('Caixas')
    expect(rotuloCurtoDaCategoria('Cabos e Acessórios')).toBe('Acessórios')
    expect(rotuloCurtoDaCategoria('Iluminação')).toBe('Luz')
    expect(rotuloCurtoDaCategoria('Fumaça')).toBe('Fumaça')
  })
})

describe('LED de status', () => {
  it('cada status tem tom e rótulo', () => {
    expect(LED_STATUS.orcamento).toEqual({ tom: 'ambar', rotulo: 'Orçamento' })
    expect(LED_STATUS.confirmado).toEqual({ tom: 'verde', rotulo: 'Confirmado' })
    expect(LED_STATUS.concluido).toEqual({ tom: 'cinza', rotulo: 'Concluído' })
    expect(LED_STATUS.cancelado).toEqual({ tom: 'vermelho', rotulo: 'Cancelado' })
  })
})
