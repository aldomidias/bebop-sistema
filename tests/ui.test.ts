import { describe, it, expect } from 'vitest'
import { iconeDaCategoria, rotuloCurtoDaCategoria } from '@/components/categorias'
import { LED_STATUS } from '@/components/Led'
import { corDoMedidor, segmentosAcesos } from '@/components/medidor'

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

describe('medidor de disponibilidade', () => {
  it('verde com metade ou mais livre', () => {
    expect(corDoMedidor(26, 26)).toBe('verde')
    expect(corDoMedidor(13, 26)).toBe('verde')
  })
  it('âmbar entre 20% e 49%', () => {
    expect(corDoMedidor(12, 26)).toBe('ambar')
    expect(corDoMedidor(6, 26)).toBe('ambar')
  })
  it('laranja abaixo de 20%, vermelho em zero', () => {
    expect(corDoMedidor(5, 26)).toBe('laranja')
    expect(corDoMedidor(1, 26)).toBe('laranja')
    expect(corDoMedidor(0, 26)).toBe('vermelho')
  })
  it('cinza quando o item não está ativo, independente do saldo', () => {
    expect(corDoMedidor(2, 2, false)).toBe('cinza')
  })
  it('total zero é vermelho, não divisão por zero', () => {
    expect(corDoMedidor(0, 0)).toBe('vermelho')
  })
  it('segmentos acesos são proporcionais, arredondando para cima', () => {
    expect(segmentosAcesos(26, 26)).toBe(12)
    expect(segmentosAcesos(13, 26)).toBe(6)
    expect(segmentosAcesos(1, 26)).toBe(1)
    expect(segmentosAcesos(0, 26)).toBe(0)
    expect(segmentosAcesos(0, 0)).toBe(0)
    expect(segmentosAcesos(-3, 26)).toBe(0)
    expect(segmentosAcesos(30, 26)).toBe(12)
  })
})
