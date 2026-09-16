# Deploying Go Green to Vercel via GitHub

The repo is already initialised and committed on the `main` branch, with a
`vercel.json` that tells Vercel exactly how to build it. You just need to push
it to GitHub and import it into Vercel.

## 1. Create an empty GitHub repo
On <https://github.com/new>:
- Repository name: `go-green` (or anything you like)
- **Public** or **Private** both work
- **Do NOT** add a README, .gitignore, or license (we already have commits)
- Click **Create repository**

## 2. Push this project to it
Copy the repo URL GitHub shows you, then run (replace `YOUR-USERNAME`):

```bash
cd ~/Documents/Green_Stake
git remote add origin https://github.com/YOUR-USERNAME/go-green.git
git push -u origin main
```

> First push will ask you to authenticate. Easiest options:
> - Paste a **Personal Access Token** when prompted for a password
>   (github.com → Settings → Developer settings → Tokens → generate one with `repo` scope), or
> - Install **GitHub Desktop** / the `gh` CLI and sign in once.

## 3. Import into Vercel
On <https://vercel.com/new>:
- **Continue with GitHub**, authorise Vercel to see your repos
- Select the `go-green` repo → **Import**
- Vercel auto-detects Vite (our `vercel.json` pins framework/build/output — nothing to change)
- Click **Deploy**

In ~1 minute you'll get a live HTTPS URL like `https://go-green-xxxx.vercel.app`.
That URL is shareable, always-on, and PWA-installable ("Add to Home Screen").

## 4. Future updates deploy automatically
Every `git push` to `main` triggers a new Vercel build & deploy. Preview
deployments are created for other branches automatically.

## Environment variables (AI recipes)
The AI recipe feature uses a serverless proxy (`/api/recipe`) that calls Google
Gemini. Add the key in **Vercel → Project → Settings → Environment Variables**:

| Name | Value |
|------|-------|
| `GEMINI_API_KEY` | your Google AI Studio key (https://aistudio.google.com/apikey) |

Set it for **Production** (and Preview if you want). Redeploy after adding it.
The key is only ever read server-side — it is never exposed to the browser, and
it must **not** be committed to the repo. Without it, the app falls back to a
smart local recipe, so nothing breaks.
