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

The Pantry's "What can I cook tonight?" button calls the Anthropic API (`claude-sonnet-4-6`) with your expiring ingredients and renders the returned recipe.

To enable live generation, provide a key at build/dev time:

```bash
echo 'VITE_ANTHROPIC_API_KEY=sk-ant-...' > .env
```

Without a key (or if the call fails), it gracefully falls back to a **smart local recipe** built from the same ingredients — so the demo never dead-ends.

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
