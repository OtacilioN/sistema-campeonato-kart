# Database, Prisma, Docker and Neon

Local development uses PostgreSQL in Docker. Production uses PostgreSQL on Neon. Both are accessed through Prisma.

`npm run dev` starts the local Docker database and runs Next.js with:

```bash
DATABASE_URL="postgresql://velocidade:velocidade@localhost:54329/velocidade_dev?schema=public"
```

To apply the Prisma schema to the local Docker database:

```bash
npm run db:push:local
```

Expected env var:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
```

Never commit real connection strings, users, passwords, hosts or Neon credentials.

After schema changes:

```bash
npm run prisma:generate
npm run prisma:validate
```

Review migrations before applying them. Avoid destructive SQL or migrations without explicit confirmation.

Raw PDFs are not stored. Persist structured extracted data only.
