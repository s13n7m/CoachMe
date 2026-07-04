# SQL Trainer · Consumer Growth

Interactive SQL practice tool for PayPal consumer-growth style interview prep, running on
sql.js (in-browser SQLite) with progress synced across devices via Supabase.

- **Live**: https://sql-trainer-paypal.vercel.app
- **Auth**: Google OAuth via Supabase Auth
- **Progress**: every graded attempt (question id, query text, pass/fail, timestamp) is
  logged to a Postgres `attempts` table, protected by Row Level Security so each user only
  sees their own rows. Solved-state and "resume where you left off" are derived from this
  history — there's no separate progress table.
- **Quiz logic**: unchanged from the original `sql-trainer-paypal.html` — dataset generation
  and grading still run entirely client-side via sql.js. Only the Next.js wrapper, auth gate,
  and Supabase sync are new (`app/`, `public/trainer.js`, `public/trainer.css`).

## Local development

```bash
npm install
npm run dev
```

Requires `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Deployment

Connected to Vercel via GitHub — pushes to `main` auto-deploy to production.
