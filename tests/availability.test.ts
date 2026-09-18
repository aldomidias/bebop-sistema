import { describe, it, expect } from 'vitest'
import { intervalosSobrepoe } from '@/lib/availability'
import { calcularDisponibilidade, type Reserva } from '@/lib/availability'

const d = (iso: string) => new Date(`${iso}T00:00:00`)

describe('intervalosSobrepoe', () => {
  it('detecta sobreposição parcial no início', () => {
    expect(
      intervalosSobrepoe(d('2026-10-10'), d('2026-10-12'), d('2026-10-11'), d('2026-10-15'))
    ).toBe(true)
  })

  it('detecta sobreposição parcial no fim', () => {
    expect(
      intervalosSobrepoe(d('2026-10-10'), d('2026-10-15'), d('2026-10-08'), d('2026-10-11'))
    ).toBe(true)
  })

  it('detecta intervalo contido em outro', () => {
    expect(
      intervalosSobrepoe(d('2026-10-11'), d('2026-10-12'), d('2026-10-10'), d('2026-10-15'))
    ).toBe(true)
  })

  it('considera sobreposição quando um evento começa no dia em que outro termina', () => {
    expect(
      intervalosSobrepoe(d('2026-10-10'), d('2026-10-12'), d('2026-10-12'), d('2026-10-14'))
    ).toBe(true)
  })

  it('não detecta sobreposição em intervalos separados', () => {
    expect(
      intervalosSobrepoe(d('2026-10-10'), d('2026-10-12'), d('2026-10-13'), d('2026-10-15'))
    ).toBe(false)
  })

  it('detecta sobreposição de datas idênticas', () => {
    expect(
      intervalosSobrepoe(d('2026-10-10'), d('2026-10-10'), d('2026-10-10'), d('2026-10-10'))
    ).toBe(true)
  })
})

const reserva = (
  quantidade: number,
  status: Reserva['status'],
  inicio: string,
  fim: string
): Reserva => ({
  quantidade,
  status,
  dataInicio: d(inicio),
  dataFim: d(fim),
})

describe('calcularDisponibilidade', () => {
  it('retorna o total quando não há reservas', () => {
    const r = calcularDisponibilidade(26, 'ativo', [], d('2026-10-10'), d('2026-10-10'))
    expect(r).toEqual({ total: 26, confirmadas: 0, emOrcamento: 0, disponivel: 26 })
  })

  it('desconta reservas confirmadas que se sobrepõem', () => {
    const reservas = [reserva(6, 'confirmado', '2026-10-10', '2026-10-10')]
    const r = calcularDisponibilidade(26, 'ativo', reservas, d('2026-10-10'), d('2026-10-10'))
    expect(r.confirmadas).toBe(6)
    expect(r.disponivel).toBe(20)
  })

  it('separa reservas em orçamento das confirmadas', () => {
    const reservas = [
      reserva(6, 'confirmado', '2026-10-10', '2026-10-10'),
      reserva(2, 'orcamento', '2026-10-10', '2026-10-10'),
    ]
    const r = calcularDisponibilidade(26, 'ativo', reservas, d('2026-10-10'), d('2026-10-10'))
    expect(r.confirmadas).toBe(6)
    expect(r.emOrcamento).toBe(2)
    expect(r.disponivel).toBe(18)
  })

  it('ignora reservas fora do intervalo consultado', () => {
    const reservas = [reserva(10, 'confirmado', '2026-11-20', '2026-11-21')]
    const r = calcularDisponibilidade(26, 'ativo', reservas, d('2026-10-10'), d('2026-10-10'))
    expect(r.disponivel).toBe(26)
  })

  it('ignora eventos cancelados', () => {
    const reservas = [reserva(10, 'cancelado', '2026-10-10', '2026-10-10')]
    const r = calcularDisponibilidade(26, 'ativo', reservas, d('2026-10-10'), d('2026-10-10'))
    expect(r.disponivel).toBe(26)
  })

  it('ignora eventos concluídos', () => {
    const reservas = [reserva(10, 'concluido', '2026-10-10', '2026-10-10')]
    const r = calcularDisponibilidade(26, 'ativo', reservas, d('2026-10-10'), d('2026-10-10'))
    expect(r.disponivel).toBe(26)
  })

  it('retorna zero disponível para item em manutenção', () => {
    const r = calcularDisponibilidade(4, 'manutencao', [], d('2026-10-10'), d('2026-10-10'))
    expect(r.disponivel).toBe(0)
    expect(r.total).toBe(4)
  })

  it('retorna zero disponível para item saindo de catálogo', () => {
    const r = calcularDisponibilidade(2, 'saindo_catalogo', [], d('2026-10-10'), d('2026-10-10'))
    expect(r.disponivel).toBe(0)
  })

  it('soma reservas de eventos diferentes no mesmo intervalo', () => {
    const reservas = [
      reserva(6, 'confirmado', '2026-10-10', '2026-10-10'),
      reserva(8, 'confirmado', '2026-10-10', '2026-10-11'),
    ]
    const r = calcularDisponibilidade(26, 'ativo', reservas, d('2026-10-10'), d('2026-10-10'))
    expect(r.confirmadas).toBe(14)
    expect(r.disponivel).toBe(12)
  })

  it('nunca retorna disponível negativo', () => {
    const reservas = [reserva(30, 'confirmado', '2026-10-10', '2026-10-10')]
    const r = calcularDisponibilidade(26, 'ativo', reservas, d('2026-10-10'), d('2026-10-10'))
    expect(r.disponivel).toBe(0)
  })

  it('considera reserva de vários dias que cruza o intervalo consultado', () => {
    const reservas = [reserva(4, 'confirmado', '2026-10-09', '2026-10-12')]
    const r = calcularDisponibilidade(26, 'ativo', reservas, d('2026-10-10'), d('2026-10-10'))
    expect(r.confirmadas).toBe(4)
  })
})
