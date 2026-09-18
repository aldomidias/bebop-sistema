import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const CATEGORIAS = [
  { nome: 'Caixas de Som', ordem: 1 },
  { nome: 'Mesas de Som', ordem: 2 },
  { nome: 'Microfones', ordem: 3 },
  { nome: 'Iluminação', ordem: 4 },
  { nome: 'Estrutura e Palco', ordem: 5 },
  { nome: 'Instrumentos', ordem: 6 },
  { nome: 'Cabos e Acessórios', ordem: 7 },
]

type ItemSeed = {
  nome: string
  categoria: string
  quantidadeTotal: number
  precoBaseDiaria: number
  status?: 'ativo' | 'manutencao' | 'saindo_catalogo'
  observacao?: string
}

const ITENS: ItemSeed[] = [
  // Caixas de Som
  { nome: 'Caixa Ativa', categoria: 'Caixas de Som', quantidadeTotal: 26, precoBaseDiaria: 180 },
  { nome: 'Sub Grave WLS', categoria: 'Caixas de Som', quantidadeTotal: 3, precoBaseDiaria: 250 },
  { nome: 'Sub Grave Selenium', categoria: 'Caixas de Som', quantidadeTotal: 4, precoBaseDiaria: 220 },
  {
    nome: 'Sub Grave (saindo de catálogo)',
    categoria: 'Caixas de Som',
    quantidadeTotal: 2,
    precoBaseDiaria: 200,
    status: 'saindo_catalogo',
    observacao: 'Previsto para venda',
  },

  // Mesas de Som
  { nome: 'Mesa Digital X32', categoria: 'Mesas de Som', quantidadeTotal: 2, precoBaseDiaria: 450 },
  { nome: 'Mesa Digital XR18', categoria: 'Mesas de Som', quantidadeTotal: 1, precoBaseDiaria: 300 },
  {
    nome: 'Mesa Digital (modelo a confirmar)',
    categoria: 'Mesas de Som',
    quantidadeTotal: 3,
    precoBaseDiaria: 380,
    observacao: 'Confirmar modelo exato com o Durval',
  },
  { nome: 'Mesa Analógica', categoria: 'Mesas de Som', quantidadeTotal: 4, precoBaseDiaria: 150 },

  // Microfones
  { nome: 'Microfone Sem Fio', categoria: 'Microfones', quantidadeTotal: 8, precoBaseDiaria: 80 },
  { nome: 'Microfone Com Fio', categoria: 'Microfones', quantidadeTotal: 12, precoBaseDiaria: 40 },

  // Iluminação
  { nome: 'Par LED', categoria: 'Iluminação', quantidadeTotal: 16, precoBaseDiaria: 45 },
  { nome: 'Par 38', categoria: 'Iluminação', quantidadeTotal: 12, precoBaseDiaria: 35 },
  { nome: 'Par 36', categoria: 'Iluminação', quantidadeTotal: 12, precoBaseDiaria: 35 },
  { nome: 'Refletor COB', categoria: 'Iluminação', quantidadeTotal: 14, precoBaseDiaria: 50 },
  { nome: 'Máquina de Fumaça', categoria: 'Iluminação', quantidadeTotal: 2, precoBaseDiaria: 120 },
  { nome: 'Processadora de Luz', categoria: 'Iluminação', quantidadeTotal: 1, precoBaseDiaria: 180 },

  // Estrutura e Palco
  { nome: 'Praticável de Palco', categoria: 'Estrutura e Palco', quantidadeTotal: 8, precoBaseDiaria: 90 },
  { nome: 'Treliça (metro linear)', categoria: 'Estrutura e Palco', quantidadeTotal: 40, precoBaseDiaria: 25 },
  { nome: 'Projetor', categoria: 'Estrutura e Palco', quantidadeTotal: 1, precoBaseDiaria: 350 },

  // Instrumentos
  { nome: 'Baixo', categoria: 'Instrumentos', quantidadeTotal: 3, precoBaseDiaria: 150 },
  { nome: 'Guitarra', categoria: 'Instrumentos', quantidadeTotal: 2, precoBaseDiaria: 150 },
  {
    nome: 'Amplificador de Baixo',
    categoria: 'Instrumentos',
    quantidadeTotal: 1,
    precoBaseDiaria: 180,
    status: 'manutencao',
    observacao: 'Em revisão',
  },
  { nome: 'Amplificador de Guitarra', categoria: 'Instrumentos', quantidadeTotal: 1, precoBaseDiaria: 180 },

  // Cabos e Acessórios
  { nome: 'Pedestal', categoria: 'Cabos e Acessórios', quantidadeTotal: 16, precoBaseDiaria: 20 },
  { nome: 'Extensão de Energia (100m)', categoria: 'Cabos e Acessórios', quantidadeTotal: 7, precoBaseDiaria: 60 },
]

function proximaSexta(semanasAdiante: number): Date {
  const hoje = new Date()
  const data = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
  const diasAteSexta = (5 - data.getDay() + 7) % 7 || 7
  data.setDate(data.getDate() + diasAteSexta + semanasAdiante * 7)
  return data
}

function mesmoDia(base: Date, diasAdiante: number): Date {
  const data = new Date(base)
  data.setDate(data.getDate() + diasAdiante)
  return data
}

async function main() {
  console.log('Limpando dados existentes...')
  await db.checklist.deleteMany()
  await db.itemReservado.deleteMany()
  await db.evento.deleteMany()
  await db.cliente.deleteMany()
  await db.item.deleteMany()
  await db.categoria.deleteMany()

  console.log('Criando categorias...')
  const categoriasPorNome = new Map<string, string>()
  for (const categoria of CATEGORIAS) {
    const criada = await db.categoria.create({ data: categoria })
    categoriasPorNome.set(criada.nome, criada.id)
  }

  console.log('Criando itens do catálogo...')
  const itensPorNome = new Map<string, { id: string; preco: number }>()
  for (const item of ITENS) {
    const categoriaId = categoriasPorNome.get(item.categoria)
    if (!categoriaId) {
      throw new Error(`Categoria não encontrada: ${item.categoria}`)
    }
    const criado = await db.item.create({
      data: {
        nome: item.nome,
        categoriaId,
        quantidadeTotal: item.quantidadeTotal,
        precoBaseDiaria: item.precoBaseDiaria,
        status: item.status ?? 'ativo',
        observacao: item.observacao ?? null,
      },
    })
    itensPorNome.set(criado.nome, { id: criado.id, preco: criado.precoBaseDiaria })
  }

  console.log('Criando clientes e eventos de exemplo...')

  const mariana = await db.cliente.create({
    data: { nome: 'Mariana Alves', telefone: '(81) 99812-4477' },
  })
  const roberto = await db.cliente.create({
    data: { nome: 'Roberto Lima', telefone: '(81) 99654-2019' },
  })
  const paroquia = await db.cliente.create({
    data: { nome: 'Paróquia São Sebastião', telefone: '(81) 3445-7788' },
  })

  const sexta = proximaSexta(0)
  const sabado = mesmoDia(sexta, 1)
  const sextaSeguinte = proximaSexta(1)

  function itemRef(nome: string) {
    const ref = itensPorNome.get(nome)
    if (!ref) throw new Error(`Item não encontrado: ${nome}`)
    return ref
  }

  // Evento confirmado: casamento no sábado
  await db.evento.create({
    data: {
      clienteId: mariana.id,
      dataInicio: sabado,
      dataFim: sabado,
      local: 'Espaço Villa Real, Gravatá',
      tipo: 'casamento',
      status: 'confirmado',
      itens: {
        create: [
          { itemId: itemRef('Caixa Ativa').id, quantidade: 6, precoAplicado: itemRef('Caixa Ativa').preco },
          { itemId: itemRef('Sub Grave Selenium').id, quantidade: 2, precoAplicado: itemRef('Sub Grave Selenium').preco },
          { itemId: itemRef('Mesa Digital X32').id, quantidade: 1, precoAplicado: itemRef('Mesa Digital X32').preco },
          { itemId: itemRef('Microfone Sem Fio').id, quantidade: 4, precoAplicado: itemRef('Microfone Sem Fio').preco },
          { itemId: itemRef('Par LED').id, quantidade: 8, precoAplicado: itemRef('Par LED').preco },
        ],
      },
      checklist: {
        create: {
          observacoes: 'Montagem a partir das 14h. Entrada pelos fundos, portão azul.',
        },
      },
    },
  })

  // Evento em orçamento: aniversário na mesma sexta
  await db.evento.create({
    data: {
      clienteId: roberto.id,
      dataInicio: sexta,
      dataFim: sexta,
      local: 'Chácara Recanto, Aldeia',
      tipo: 'aniversario',
      status: 'orcamento',
      itens: {
        create: [
          { itemId: itemRef('Caixa Ativa').id, quantidade: 4, precoAplicado: itemRef('Caixa Ativa').preco },
          { itemId: itemRef('Mesa Digital XR18').id, quantidade: 1, precoAplicado: itemRef('Mesa Digital XR18').preco },
          { itemId: itemRef('Microfone Sem Fio').id, quantidade: 2, precoAplicado: itemRef('Microfone Sem Fio').preco },
          { itemId: itemRef('Refletor COB').id, quantidade: 6, precoAplicado: itemRef('Refletor COB').preco },
        ],
      },
    },
  })

  // Evento confirmado de vários dias: festa da paróquia
  await db.evento.create({
    data: {
      clienteId: paroquia.id,
      dataInicio: sextaSeguinte,
      dataFim: mesmoDia(sextaSeguinte, 2),
      local: 'Pátio da Igreja Matriz',
      tipo: 'show',
      status: 'confirmado',
      observacoes: 'Três noites de festa. Equipamento permanece montado.',
      itens: {
        create: [
          { itemId: itemRef('Caixa Ativa').id, quantidade: 10, precoAplicado: itemRef('Caixa Ativa').preco },
          { itemId: itemRef('Sub Grave WLS').id, quantidade: 3, precoAplicado: itemRef('Sub Grave WLS').preco },
          { itemId: itemRef('Mesa Digital X32').id, quantidade: 1, precoAplicado: itemRef('Mesa Digital X32').preco },
          { itemId: itemRef('Microfone Com Fio').id, quantidade: 6, precoAplicado: itemRef('Microfone Com Fio').preco },
          { itemId: itemRef('Praticável de Palco').id, quantidade: 6, precoAplicado: itemRef('Praticável de Palco').preco },
          { itemId: itemRef('Par LED').id, quantidade: 12, precoAplicado: itemRef('Par LED').preco },
        ],
      },
    },
  })

  const totalItens = await db.item.count()
  const totalEventos = await db.evento.count()
  console.log(`Pronto: ${totalItens} itens no catálogo, ${totalEventos} eventos de exemplo.`)
}

main()
  .catch((erro) => {
    console.error(erro)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
