import { generateRecipe } from './_gemini.js'

// Vercel serverless function: POST /api/recipe { ingredients: string[] }
// The Gemini key lives in the GEMINI_API_KEY env var — never sent to the client.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method-not-allowed' })
    return
  }
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'server-not-configured' })
    return
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const recipe = await generateRecipe(body.ingredients, apiKey)
    res.status(200).json(recipe)
  } catch (e) {
    res.status(502).json({ error: String(e?.message || e) })
  }
}
