# Tech Alchemy Academy

**Turn logic into mastery.**

A gamified learning platform for Data Structures and Algorithms with structured curriculum, quizzes, coding challenges, server-authoritative XP, achievements, analytics, and an audited administration layer.

## Project status

The Academy has moved beyond a learner proof-of-concept. The current product includes a learner experience and an operational control room for managing curriculum and Academy activity.

**Learner experience:**
- Credentials authentication with NextAuth
- Database-backed courses, modules and lessons
- Reusable lesson pages with module XP gates
- Lesson quizzes with persisted attempts, best scores and server-side scoring
- First-pass-only quiz XP and achievement unlocks
- Challenge Arena with authenticated submissions and hidden tests
- Piston-compatible isolated challenge execution
- First-pass-only challenge XP to prevent reward farming
- Rank progression, streaks, daily activity, achievements and leaderboard
- Module-specific continue links and persistent achievement cabinet

**Administration and operations:**
- `/admin` Academy Control Room
- Server-side ADMIN authorization on every admin mutation
- Optional `ACADEMY_ADMIN_EMAIL` bootstrap/break-glass administrator
- Course, module and lesson creation
- Draft-first publishing controls for courses, modules, lessons and challenges
- Challenge Forge for starter code, hidden tests and reference solutions
- Achievement creation and XP configuration
- Learner/admin role management with self-demotion protection
- Audit-event ledger for content, publishing and role changes
- `/admin/analytics` learner analytics for XP momentum, mastery and activity

## Reward integrity

XP is controlled by the server and recorded through an append-only `XpTransaction` ledger with database-enforced idempotency keys. Lesson, quiz, challenge and achievement rewards cannot be incremented by trusting client-supplied XP values.

Quiz answers are scored on the server. Correct answer indexes are not included in the public quiz payload. Challenge hidden tests and reference solutions remain server-side.

## Challenge execution

Learner code is never evaluated directly inside the Next.js application process. The Academy delegates execution to a separately isolated Piston-compatible runner configured through environment variables.

A successful first challenge pass records the result and awards XP through the same server-authoritative reward system. Re-submitting an already-mastered challenge does not award duplicate XP.

## Tech stack

- **Framework:** Next.js 16 App Router, React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** PostgreSQL / Neon
- **ORM:** Prisma 7
- **Auth:** NextAuth credentials provider
- **Validation:** Zod
- **Challenge execution:** Piston-compatible isolated runner
- **Deployment target:** Vercel

## Getting started

### Prerequisites
- Node.js 20+
- PostgreSQL database
- Piston-compatible runner for live coding-challenge execution

```powershell
git clone https://github.com/keketsoleu25/tech-alchemy-academy.git
Set-Location -Path ".\tech-alchemy-academy"
npm install
Copy-Item -Path ".env.example" -Destination ".env"
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Visit `http://localhost:3000`.

## Environment variables

See `.env.example` for the full template.

- `DATABASE_URL` — PostgreSQL connection string
- `DIRECT_URL` — direct PostgreSQL connection used by Prisma migrations/seeding
- `AUTH_SECRET` — NextAuth secret
- `ACADEMY_ADMIN_EMAIL` — optional authenticated-user email that receives bootstrap admin access
- `CHALLENGE_RUNNER_URL` — Piston-compatible runner base URL
- `CHALLENGE_RUNNER_TOKEN` — optional bearer token for a protected runner/proxy

`ACADEMY_ADMIN_EMAIL` is intended as a bootstrap/break-glass control. After promoting another user to the database `ADMIN` role, it can be removed from the deployment environment.

## Database migrations

The current schema includes persistence for quiz attempts and an `AuditEvent` ledger. Apply migrations before deploying code that depends on the newest schema.

```powershell
npx prisma migrate deploy
```

## Known limitations

- Current curriculum is still primarily the DSA pilot.
- Quiz definitions are versioned in code; a visual quiz-authoring CMS is a future phase.
- Challenge execution requires a separately deployed runner.
- The challenge editor is lightweight rather than Monaco-based.
- Role model currently supports Learner and Admin; a distinct Instructor role is still planned.
- Automated unit, integration and end-to-end coverage still needs expansion.
- GitHub Actions has recently shown repository/account-side runner failures even for trivial diagnostic jobs; do not treat those infrastructure failures as proof of an application regression without checking the failing step.

## Roadmap

- [x] Reusable learner lesson flow
- [x] Quiz system with persisted attempts and XP
- [x] Achievement unlock system
- [x] Challenge Arena submission pipeline
- [x] Academy Control Room
- [x] Curriculum creation and publishing workflow
- [x] Challenge Forge
- [x] Admin audit trail and role controls
- [x] Learner analytics
- [ ] Visual quiz-authoring CMS
- [ ] Instructor role and scoped permissions
- [ ] Multi-track curriculum (TypeScript, Frontend Development, Software Engineering, AI Software Engineering)
- [ ] Automated unit, integration and end-to-end test suite
- [ ] Production deployment of the isolated challenge runner

## License

Not yet licensed for reuse. All rights reserved during active development.
