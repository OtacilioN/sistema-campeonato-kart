# Velocidade Quase Máxima

Web app PWA mobile first para acompanhamento de campeonato amador de kart.

O codinome técnico do projeto é **Velozes**. O nome público do produto é **Velocidade Quase Máxima**, com short name PWA **Velocidade** e domínio planejado **velocidadequasemaxima.com.br** (`https://velocidadequasemaxima.com.br`).

## Objetivo

O sistema substitui a planilha de classificação do campeonato com telas públicas de ranking, calendário, pilotos, perfis e análise de bateria. A área administrativa importa ou registra resultados, revisa dados e confirma o resultado que passa a alimentar o ranking público.

Resultados, rankings e dados estruturados de lap-to-lap validado são conteúdo público do app. Credenciais, secrets, connection strings e variáveis reais de ambiente nunca devem ser versionadas.

## Stack

- Next.js com App Router
- TypeScript
- PWA com manifest inicial
- CSS global com tokens inspirados no design system do Claude Design
- Prisma ORM
- PostgreSQL no Neon
- Deploy planejado na Vercel Hobby
- Licença MIT

## Documentação

- Requisitos: [`docs/requisitos_velozes.md`](docs/requisitos_velozes.md)
- Processo de criação com IA: [`docs/documentacao-processo.md`](docs/documentacao-processo.md)
- Glossário do domínio: [`CONTEXT.md`](CONTEXT.md)
- ADRs: [`docs/adr/`](docs/adr/)
- Mockups e design system do Claude Design: [`references/design-system/`](references/design-system/)

## Rodando localmente

```bash
npm install
cp .env.example .env.local
npm run dev
```

Configure `.env.local` com valores reais apenas no ambiente local:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
ADMIN_PASSWORD="uma-senha-segura"
```

Sem `ADMIN_PASSWORD`, a rota `/admin` permanece bloqueada e não existe senha padrão de desenvolvimento.

## Comandos

```bash
npm run dev
npm run lint
npm run build
npm run prisma:generate
npm run prisma:validate
```

Atalho equivalente do Prisma:

```bash
npx prisma generate
```

## PWA

O bootstrap inicial inclui `public/manifest.webmanifest`, metadata do Next.js, theme color e ícone placeholder em SVG.

Service worker ficou propositalmente pendente. Antes de adicioná-lo, definir:

- estratégia de cache para telas públicas;
- exclusão explícita de `/admin`;
- política para dados de ranking e calendário desatualizados;
- fallback offline;
- validação de instalação em mobile.

## Banco de dados

O projeto usa Prisma com PostgreSQL via Neon. A variável esperada é `DATABASE_URL`.

Não execute migrations destrutivas sem revisão. Após alterar `prisma/schema.prisma`, rode:

```bash
npm run prisma:generate
npm run prisma:validate
```

## Licença

Open source sob licença MIT.
