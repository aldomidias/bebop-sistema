import Link from 'next/link'
import { buscarEventosProximos } from '@/lib/queries/events'
import { Cartao } from '@/components/Cartao'
import { CartaoEvento } from '@/components/CartaoEvento'
import { TituloSecao } from '@/components/TituloSecao'
import { BotaoPrimario } from '@/components/Botoes'
import { Icone, type NomeIcone } from '@/components/Icones'
import { agruparPorDia, dataPorExtenso, saudacao } from '@/components/inicio'

export const dynamic = 'force-dynamic'

const ATALHOS: { href: string; rotulo: string; icone: NomeIcone }[] = [
  { href: '/orcamento/novo', rotulo: 'Novo orçamento', icone: 'recibo' },
  { href: '/disponibilidade', rotulo: 'Disponibilidade', icone: 'medidor' },
  { href: '#agenda', rotulo: 'Agenda', icone: 'calendario' },
  { href: '/catalogo', rotulo: 'Catálogo', icone: 'caixa' },
]

export default async function InicioPage() {
  const eventos = await buscarEventosProximos()
  const agora = new Date()
  const [proximo, ...restantes] = eventos
  const grupos = agruparPorDia(restantes)

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-cinza-700">{saudacao(agora.getHours())}, Durval</p>
        <h1 className="mt-0.5 font-titulo text-2xl font-semibold text-navy">{dataPorExtenso(agora)}</h1>
      </header>

      <nav aria-label="Atalhos" className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {ATALHOS.map((atalho) => (
          <Link key={atalho.rotulo} href={atalho.href}>
            <Cartao className="flex h-24 flex-col items-center justify-center gap-2 active:bg-cinza-100">
              <span className="text-navy"><Icone nome={atalho.icone} tamanho={28} /></span>
              <span className="text-sm font-medium text-navy">{atalho.rotulo}</span>
            </Cartao>
          </Link>
        ))}
      </nav>

      {proximo ? (
        <section>
          <TituloSecao titulo="Próximo evento" />
          <CartaoEvento evento={proximo} destaque />
        </section>
      ) : (
        <Cartao className="flex flex-col items-center gap-3 py-8 text-center">
          <span className="text-cinza-400"><Icone nome="caixa" tamanho={40} /></span>
          <p className="font-medium text-navy">Nenhum evento pela frente</p>
          <p className="text-sm text-cinza-700">Comece pelo orçamento — leva menos de um minuto.</p>
          <BotaoPrimario href="/orcamento/novo" className="mt-2 max-w-xs">Novo orçamento</BotaoPrimario>
        </Cartao>
      )}

      {grupos.length > 0 && (
        <section id="agenda" className="space-y-4">
          <TituloSecao titulo="Agenda" />
          {grupos.map((grupo) => (
            <div key={grupo.rotulo} className="space-y-3">
              <p className="text-sm font-medium text-cinza-700">{grupo.rotulo}</p>
              {grupo.eventos.map((evento) => (
                <CartaoEvento key={evento.id} evento={evento} />
              ))}
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
