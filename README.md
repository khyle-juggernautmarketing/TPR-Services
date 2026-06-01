# TPR Services Landing Page

Next.js 15 marketing site for TPR Services (roofing, storm restoration, Lilburn GA).

## Development

```bash
npm install
cp .env.local.example .env.local   # add N8N_WEBHOOK_URL + N8N_JWT_SECRET
npm run dev
```

Open http://127.0.0.1:3000

## Production environment (Vercel)

| Variable | Required | Notes |
|----------|----------|--------|
| `N8N_WEBHOOK_URL` | Yes | HTTPS n8n webhook URL |
| `N8N_JWT_SECRET` | Yes | HS256 secret matching n8n JWT auth |
| `NEXT_PUBLIC_SITE_URL` | Yes | e.g. `https://your-project.vercel.app` |

Never commit `.env.local`.

## Security (lead form)

- Server-side only webhook + JWT (secrets not exposed to the browser)
- Host allowlist for webhook (`*.hstgr.cloud`, `n8n` hosts)
- Same-origin / allowed-host check on `POST /api/lead`
- Rate limiting, honeypot, input sanitization
- Security headers via `next.config.ts`

## Deploy

### GitHub

```bash
git init
git add .
git commit -m "Initial TPR Services landing page"
git branch -M main
git remote add origin https://github.com/YOUR_ORG/tpr-services.git
git push -u origin main
```

### Vercel

1. Import the GitHub repo at [vercel.com/new](https://vercel.com/new)
2. Add environment variables from the table above
3. Deploy

Or with CLI: `npx vercel --prod` (after `npx vercel login`)
