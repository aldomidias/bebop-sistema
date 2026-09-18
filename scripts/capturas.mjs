// Uso: node scripts/capturas.mjs <pasta-de-saida> [id-de-evento]
// Requer o dev server em http://localhost:3000. Playwright já está em node_modules (transitivo).
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const [pasta = './capturas', eventoId] = process.argv.slice(2)
mkdirSync(pasta, { recursive: true })

const TELAS = [
  ['inicio', '/'],
  ['disponibilidade', '/disponibilidade'],
  ['orcamento', '/orcamento/novo'],
  ['catalogo', '/catalogo'],
  ...(eventoId ? [['evento', `/evento/${eventoId}`]] : []),
]
const LARGURAS = [
  [390, 844, 2],
  [1280, 900, 1],
]

const navegador = await chromium.launch()
for (const [largura, altura, escala] of LARGURAS) {
  const contexto = await navegador.newContext({
    viewport: { width: largura, height: altura },
    deviceScaleFactor: escala,
  })
  const pagina = await contexto.newPage()
  for (const [nome, rota] of TELAS) {
    await pagina.goto(`http://localhost:3000${rota}`, { waitUntil: 'networkidle' })
    await pagina.waitForTimeout(600) // deixa a animação do medidor terminar
    const temRolagemHorizontal = await pagina.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    )
    await pagina.screenshot({ path: `${pasta}/${nome}-${largura}.png`, fullPage: true })
    console.log(`${nome}-${largura}.png${temRolagemHorizontal ? '  ⚠ ROLAGEM HORIZONTAL' : ''}`)
  }
  await contexto.close()
}
await navegador.close()
