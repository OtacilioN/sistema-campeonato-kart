# Vercel Deployment

Deploy target: Vercel Hobby.

Production domain: `velocidadequasemaxima.com.br`.

Do not commit `.vercel` or Vercel credentials.

Configure real environment variables only in local `.env.local` or secure Vercel project settings:

- `DATABASE_URL`
- `ADMIN_PASSWORD`
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_SHORT_NAME`
- `NEXT_PUBLIC_APP_URL`

The app currently has manifest-based PWA setup. Service worker should be added later with a deliberate cache strategy that excludes admin surfaces.
