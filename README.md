# Tech Alchemy Academy

**Turn logic into mastery.**

A gamified learning management system for Data Structures and Algorithms, built as a full-stack portfolio project. Structured learning paths, server-authoritative XP, and original coding challenges — built from the ground up with production-grade security and data-integrity practices, not just working UI.

## Project status

The Academy now has a usable learner MVP: authentication, a database-backed curriculum, reusable lesson pages, progress tracking, server-authoritative XP, leaderboard data, and a Challenge Arena submission pipeline.

**What works today:**
- Credentials-based authentication with NextAuth
- Six seeded lessons rendered through reusable dynamic lesson routes
- Module XP locks and lesson progress tracking
- Server-side, idempotent XP awarding via an append-only transaction ledger
- Student dashboard with rank progress, streaks, learning path, daily quest and leaderboard
- Challenge Arena editor and authenticated submission API
- Hidden challenge tests executed through a configurable isolated Piston runner
- First-pass-only challenge XP to prevent reward farming
- Daily activity tracking
- GitHub Actions lint and TypeScript validation

**In progress / not yet built:**
- Additional curriculum beyond the current DSA pilot
- More coding challenges beyond the first seeded challenge
- Quizzes
- Instructor and administrator tooling
- Multi-track curriculum
- Automated unit, integration and end-to-end tests

## Why this project exists

This is a portfolio piece demonstrating full-stack engineering across product design, database architecture, secure API design, and gamification systems — with particular attention to reward integrity and safe execution of learner code.

The XP system is built around an append-only `XpTransaction` ledger with a database-enforced idempotency key on every award. XP is never trusted from the client, never incremented optimistically, and every award is traceable to a specific source event. Lesson and challenge rewards are awarded on the server.

Learner challenge code is never evaluated directly inside the Next.js application process. The Academy delegates execution to a separately isolated Piston-compatible runner configured through environment variables.

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript (strict)
- **Styling:** Tailwind CSS 4
- **Database:** PostgreSQL (Neon), Prisma ORM
- **Auth:** NextAuth (credentials provider)
- **Challenge execution:** Piston-compatible isolated runner
- **Deployment target:** Vercel

## Getting started (Windows / PowerShell)

### Prerequisites
- Node.js 20+
- A PostgreSQL database (this project uses Neon)
- A Piston-compatible runner if you want live Challenge Arena execution

### Setup

Clone the repository:
```powershell
git clone https://github.com/keketsoleu25/tech-alchemy-academy.git
Set-Location -Path ".\tech-alchemy-academy"
```

Install dependencies:
```powershell
npm install
```

Copy the environment template and fill in your own values:
```powershell
Copy-Item -Path ".env.example" -Destination ".env"
```

Apply database migrations and generate the Prisma client:
```powershell
npx prisma migrate dev
```

Seed the database with initial content:
```powershell
npx prisma db seed
```

Start the development server:
```powershell
npm run dev
```

Visit `http://localhost:3000`.

## Environment variables

See `.env.example` for the full list. Core variables:
- `DATABASE_URL` — PostgreSQL connection string
- `DIRECT_URL` — optional direct PostgreSQL connection used for migrations/seeding
- `AUTH_SECRET` — NextAuth secret
- `CHALLENGE_RUNNER_URL` — base URL of the isolated Piston-compatible execution service
- `CHALLENGE_RUNNER_TOKEN` — optional bearer token for a protected runner/proxy

Never commit a real `.env` file — it is excluded via `.gitignore`.

## Challenge execution

The browser submits learner source code to the Academy API. The API loads hidden test cases from PostgreSQL and sends the code plus a generated test harness to the configured isolated runner. Only the resulting test counts, runtime and safe error summary are stored and returned to the learner.

A successful first pass creates the submission result and awards challenge XP in one database transaction. Re-submitting an already-mastered challenge does not award duplicate XP.

## Known limitations

- The current seed contains one coding challenge.
- The execution service must be deployed/configured separately from the Vercel application.
- The current editor is intentionally lightweight and does not yet use Monaco.
- No automated unit/integration/E2E test suite exists yet.
- Role model currently supports Learner and Admin; Instructor is planned.

## Roadmap

- [x] Build reusable learner lesson flow
- [x] Implement Challenge Arena submission pipeline
- [x] Add CI lint and TypeScript validation
- [ ] Expand the Initiate curriculum and challenge library
- [ ] Add quizzes
- [ ] Add Instructor role and course-authoring tools
- [ ] Add Admin moderation and audit tooling
- [ ] Multi-track curriculum support (TypeScript, Frontend Development, Software Engineering, AI Software Engineering)
- [ ] Automated test suite (unit, integration, end-to-end)

## License

Not yet licensed for reuse. All rights reserved during active development.
