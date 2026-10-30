# CoachMe

Interview-prep coaching app with hands-on trainers, live grading, and AI explanations.
It started as a SQL practice tool for a PayPal Consumer Portfolio Growth data science
interview and has grown into a set of tracks.

- **Live**: https://getcoachme.vercel.app

## Tracks

| Track | Route | What it covers |
| --- | --- | --- |
| SQL Trainer | `/` (quiz: `/quiz`) | Lessons and graded SQL questions on a generated payments dataset, run in the browser with sql.js (SQLite) |
| Python Trainer | `/python` (quiz: `/python-quiz`) | pandas data wrangling and analysis, run in the browser with Pyodide |
| ML Fundamentals | `/ml` | 14 topics of written-answer questions, graded by how many key concepts the answer covers |
| Final Prep | `/final-prep` | A mixed SQL and Python cram track for the last days before an interview |
| Trading | `/trading` | FX market basics, risk management, and fair value gaps (FVG and IFVG) |

Each trainer has lessons split into subtopics, easy/medium/hard questions with hints, an
end-of-topic **Recall** question (Feynman technique), a sidebar you can filter (difficulty,
time, starred, search), and a dark mode. The SQL and Python tracks also have a certification
quiz with one question per topic.

## How it works

- **Frontend**: a Next.js (App Router) shell in `app/` that loads plain JS trainers from
  `public/` (`*-trainer.js`, `*-shared.js`, `quiz.js`, `trainer.css`). Questions and lessons
  are JSON literals inside those files. Code runs and is graded in the browser.
- **Auth**: Supabase Auth with Google OAuth or email and password.
- **Progress**: every graded attempt (question id, answer, pass/fail, timestamp) goes to a
  Postgres `attempts` table. Stars ("come back to this") go to `question_flags`. Row Level
  Security lets each user see only their own rows. Solved state and "resume where you left
  off" come from the attempt history, so there is no separate progress table.
- **AI explanations**: `app/api/explain/route.js` calls Claude to explain a solution, review
  an attempt, or grade a written answer (including Recall answers). Solution explanations are
  cached in an `explanations` table, and requests are rate limited per user.
  `RECALL_SUMMARIES.md` mirrors the Recall grading references for review. The trainer JS
  files hold the real copies.

## Local development

```bash
npm install
npm run dev
```

You need a `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
ANTHROPIC_API_KEY=...   # optional; /api/explain returns 503 without it
```

## Deployment

The repo is connected to Vercel through GitHub, and pushes to `main` deploy to production.
Preview deployments can't complete Google sign-in because their domains aren't on the
OAuth allowlist, so test auth changes on production.
