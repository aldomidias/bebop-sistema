-- CreateTable
CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,
    "quantidadeTotal" INTEGER NOT NULL,
    "precoBaseDiaria" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "observacao" TEXT,
    CONSTRAINT "Item_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clienteId" TEXT NOT NULL,
    "dataInicio" DATETIME NOT NULL,
    "dataFim" DATETIME NOT NULL,
    "local" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'outro',
    "status" TEXT NOT NULL DEFAULT 'orcamento',
    "valorAjustado" REAL,
    "observacoes" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Evento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ItemReservado" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventoId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "precoAplicado" REAL NOT NULL,
    CONSTRAINT "ItemReservado_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ItemReservado_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Checklist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventoId" TEXT NOT NULL,
    "observacoes" TEXT,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "Checklist_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_nome_key" ON "Categoria"("nome");

-- CreateIndex
CREATE INDEX "Item_categoriaId_idx" ON "Item"("categoriaId");

-- CreateIndex
CREATE INDEX "Evento_dataInicio_dataFim_idx" ON "Evento"("dataInicio", "dataFim");

-- CreateIndex
CREATE INDEX "Evento_status_idx" ON "Evento"("status");

-- CreateIndex
CREATE INDEX "ItemReservado_eventoId_idx" ON "ItemReservado"("eventoId");

-- CreateIndex
CREATE INDEX "ItemReservado_itemId_idx" ON "ItemReservado"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "Checklist_eventoId_key" ON "Checklist"("eventoId");
