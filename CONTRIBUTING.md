# Contributing to Go Green

Welcome aboard! 🌿 This is the team workflow for building Go Green.

## Getting set up
```bash
npm install
cp .env.example .env     # optional: add GEMINI_API_KEY for live AI recipes
npm run dev              # http://localhost:5173
```

> Node 20+ required. On this project's workstation it lives at `~/.local/node`
> (`export PATH="$HOME/.local/node/bin:$PATH"`).

## Day-to-day commands
| Command | What it does |
|---------|--------------|
| `npm run dev` | Dev server with hot reload |
| `npm run test` | Unit tests (watch mode) |
| `npm run test:run` | Unit tests once (what CI runs) |
| `npm run e2e` | Playwright end-to-end tests |
| `npm run lint` | ESLint |
| `npm run build` | Production build to `dist/` |

## Branching & PRs
1. **Never commit directly to `main`.** Branch off it:
   `git checkout -b feature/short-description`
2. Make your change **with a test** where it makes sense.
3. Run `npm run lint && npm run test:run && npm run build` locally.
4. Push and open a Pull Request. CI (lint, unit tests, build, E2E) must be green.
5. Get **one review approval**, then squash-merge.

## Conventions
- Functional React components + hooks. Tailwind for styling (tokens in `tailwind.config.js`).
- Keep secrets out of the repo — only `.env.example` is committed.
- Match the surrounding code's style; no new deps without discussion.

## Where things live
- `src/components/<feature>/` — screens & UI, grouped by feature
- `src/context/AppContext.jsx` — global state (points, pantry, badges…)
- `src/data/` — mock data + the Open Food Facts client
- `api/` — Vercel serverless functions (e.g. the Gemini recipe proxy)
- `e2e/` — Playwright specs · `*.test.jsx` next to source — Vitest unit tests
