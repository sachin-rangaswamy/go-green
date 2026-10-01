import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Serves POST /api/recipe during `npm run dev`, mirroring the Vercel function,
// so the Gemini proxy works locally when GEMINI_API_KEY is set in .env.
function apiDevPlugin(env) {
  return {
    name: 'go-green-api-dev',
    configureServer(server) {
      server.middlewares.use('/api/recipe', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'method-not-allowed' }))
          return
        }
        let body = ''
        req.on('data', (c) => (body += c))
        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json')
          const key = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY
          if (!key) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'server-not-configured' }))
            return
          }
          try {
            const { ingredients } = JSON.parse(body || '{}')
            const { generateRecipe } = await import('./api/_gemini.js')
            const recipe = await generateRecipe(ingredients, key)
            res.end(JSON.stringify(recipe))
          } catch (e) {
            res.statusCode = 502
            res.end(JSON.stringify({ error: String(e?.message || e) }))
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  // '' prefix loads ALL vars from .env (incl. non-VITE_ ones) for the dev proxy.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), apiDevPlugin(env)],
    base: './',
    server: { host: true, port: 5173 },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/test/setup.js',
      css: false,
      include: ['src/**/*.{test,spec}.{js,jsx}'],
      exclude: ['node_modules', 'dist', 'e2e'],
    },
  }
})
