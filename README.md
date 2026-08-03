# Tech Alchemy Academy

**Turn logic into mastery.**

A gamified learning management system for Data Structures and Algorithms, built as a full-stack portfolio project. Structured learning paths, server-authoritative XP, and original coding challenges — built from the ground up with production-grade security and data-integrity practices, not just working UI.

## Project status

This project is under active development. The current build includes one complete, end-to-end learning flow (lesson content, progress tracking, and XP awarding) as a proof of the core architecture, with the surrounding curriculum, challenge execution, and instructor/admin tooling still in progress.

**What works today:**
- Credentials-based authentication (NextAuth)
- One fully built lesson (`Two-Pointer Technique`) with progress tracking
- Server-side, idempotent XP awarding via an append-only transaction ledger
- Student dashboard with rank progress, streaks, and leaderboard
- Daily activity tracking (foundation for streak calculation)

**In progress / not yet built:**
- Additional lessons and modules beyond the Initiate rank pilot
- Coding Challenge Arena (schema exists; execution provider and submission flow not yet wired)
- Quizzes
- Instructor and administrator tooling
- Multi-track curriculum (currently DSA-only; schema supports expansion)
- Automated test suite and CI

## Why this project exists

This is a portfolio piece demonstrating full-stack engineering across product design, database architecture, secure API design, and gamification systems — with particular attention to a problem that is easy to get wrong: **making a reward system that cannot be gamed or duplicated.**

The XP system is built around an append-only `XpTransaction` ledger with a database-enforced idempotency key on every award. XP is never trusted from the client, never incremented optimistically, and every award is traceable to a specific source event. This was a deliberate design decision, not an afterthought — see `src/lib/gamification/award-xp.ts`.

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript (strict)
- **Styling:** Tailwind CSS 4
- **Database:** PostgreSQL (Neon), Prisma ORM
- **Auth:** NextAuth (credentials provider)
- **Deployment target:** Vercel

## Getting started (Windows / PowerShell)

### Prerequisites
- Node.js 20+
- A PostgreSQL database (this project uses [Neon](https://neon.tech))

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

See `.env.example` for the full list of required variables. At minimum you will need:
- `DATABASE_URL` — your PostgreSQL connection string
- `AUTH_SECRET` — a random secret used by NextAuth (generate with `npx auth secret`)

Never commit a real `.env` file — it is excluded via `.gitignore`.

## Project structure## Known limitations

- Only one lesson is fully implemented end-to-end; the broader curriculum is scaffolded in the schema but not yet content-populated.
- The coding-challenge execution pathway is not yet connected to a real or mock sandbox provider.
- No automated test suite exists yet.
- Role model currently supports Learner and Admin; Instructor role is planned but not yet implemented.

## Roadmap

- [ ] Build out the full Initiate rank curriculum
- [ ] Implement the Challenge Arena with a sandboxed code execution provider
- [ ] Add quizzes
- [ ] Add Instructor role and course-authoring tools
- [ ] Add Admin moderation and audit tooling
- [ ] Multi-track curriculum support (TypeScript, Frontend Development, Software Engineering, AI Software Engineering)
- [ ] Automated test suite (unit, integration, end-to-end)
- [ ] CI pipeline via GitHub Actions

## License

Not yet licensed for reuse. All rights reserved during active development.
