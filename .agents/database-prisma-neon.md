# Database, Prisma and Neon

The database is PostgreSQL on Neon, accessed through Prisma.

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
