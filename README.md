# 🌿 Go Green

**Shop Smart. Waste Less. Live Green.**

A mobile-first Progressive Web App — the "WeChat of green living". One unified super-app that combines product **health + eco scoring**, **food-waste prevention**, **AI recipes**, **gamified challenges**, and a **sustainability community** into a single experience.

Built as a pitch prototype: fully interactive, mock-data driven, no backend required.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
```

Build a static, deployable site:

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build
```

The app uses a **hash router**, so the built `dist/` folder works when hosted anywhere (Netlify, Vercel, GitHub Pages, S3) or even opened from a file path — no server routing config needed.

> This project installs its own Node via `~/.local/node`. If `node`/`npm` aren't found, run:
> `export PATH="$HOME/.local/node/bin:$PATH"`

---

## Features

| Tab | Highlights |
|-----|-----------|
| 🏠 **Home** | Animated impact dashboard, quick actions, expiring-soon alerts, weekly challenge, social ticker, nearby surplus deals |
| 🔍 **Scan** | Barcode-scan mockup → **dual A–E score** (Health + Eco), expandable breakdown, "better alternative", +5🌿 toast, add to pantry/list |
| 🎮 **Challenges** | Swipeable challenges, leaderboard, badge grid, points→rewards shop. Completing a challenge fires a **confetti badge unlock** |
| 👥 **Community** | Instagram-style feed (pull-to-refresh), interest groups, "Green Date" events with RSVP, stylised map of local eco spots |
| 👤 **Profile** | Lifetime impact charts (Recharts), loyalty integration (Tesco Clubcard etc.), preferences, dark-mode toggle |

Plus a **Pantry** screen (reached from Home/Scan) with the **AI Recipe Chef**.

---

## AI Recipe engine

The Pantry's "What can I cook tonight?" button calls **our own serverless proxy**
(`/api/recipe`), which calls **Google Gemini** (`gemini-flash-latest`) with your
expiring ingredients and returns a structured recipe. The API key lives only on
the server (`GEMINI_API_KEY`) — it is **never shipped to the browser**.

To enable live generation locally:

```bash
cp .env.example .env       # then paste your key
# .env  ->  GEMINI_API_KEY=your-key-here
npm run dev                # the Vite dev server proxies /api/recipe
```

Get a key at <https://aistudio.google.com/apikey>. In production the key is set in
**Vercel → Settings → Environment Variables**. Without a key (or on any API error)
the app gracefully falls back to a **smart local recipe** — so it never dead-ends.

- `api/recipe.js` — Vercel serverless function (holds the key)
- `api/_gemini.js` — shared Gemini call + retry/backoff
- dev: mirrored by a small middleware in `vite.config.js`

---

## Demo flow (≈5 min)

1. **Home** — introduce the concept & impact stats.
2. **Scan** — scan *Coca-Cola* (poor scores) then *Alpro Oat Milk* (great scores); show the dual score + better alternative + points.
3. **Pantry** — tap "What can I cook tonight?" for a live AI recipe.
4. **Challenges** — log progress on a challenge → badge unlock with confetti; show leaderboard & rewards.
5. **Community** — scroll the feed, RSVP to a Green Date, explore the map.
6. **Profile** — lifetime impact charts + loyalty conversion.

---

## Tech stack

React 18 · Vite · Tailwind CSS · React Router (hash) · Context + useReducer · Recharts · Lucide icons · PWA (manifest + service worker).

## Structure

```
src/
  components/{home,scan,pantry,challenges,community,profile,layout,shared}
  context/AppContext.jsx      global state (points, pantry, badges, …)
  hooks/{usePoints,useRecipe}
  data/*.json                 all mock data
  utils/{scoreColors,formatters}
public/{manifest.json, sw.js, icons/}
```
