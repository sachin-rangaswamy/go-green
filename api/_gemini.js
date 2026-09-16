// Shared Gemini recipe generator. Used by both the Vercel serverless function
// (api/recipe.js) and the Vite dev middleware. The `_` prefix keeps Vercel from
// treating this file as its own route.

const MODEL = 'gemini-flash-latest'
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    time: { type: 'string' },
    servings: { type: 'integer' },
    difficulty: { type: 'string' },
    ingredients: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          item: { type: 'string' },
          amount: { type: 'string' },
          fromPantry: { type: 'boolean' },
        },
        required: ['item', 'amount', 'fromPantry'],
      },
    },
    steps: { type: 'array', items: { type: 'string' } },
    sustainabilityTip: { type: 'string' },
  },
  required: ['name', 'time', 'servings', 'difficulty', 'ingredients', 'steps', 'sustainabilityTip'],
}

export async function generateRecipe(ingredients, apiKey, { signal } = {}) {
  if (!apiKey) throw new Error('missing-api-key')
  const list = (ingredients || []).filter(Boolean)
  if (!list.length) throw new Error('no-ingredients')

  const prompt = `You are a sustainable cooking assistant for the "Go Green" app.
Generate ONE realistic recipe that uses as many of these soon-to-expire pantry ingredients as possible: ${list.join(
    ', '
  )}.
Rules:
- Mark each ingredient that comes from the pantry list above with "fromPantry": true; any extra staples you add use "fromPantry": false.
- Keep it low-waste, home-cook friendly, 2 servings by default.
- "sustainabilityTip" must be one short, practical waste-reduction tip for this dish.`

  const payload = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.8,
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
    },
  })

  // Gemini often returns transient 503/429 under load — retry with backoff.
  let res
  for (let attempt = 0; attempt < 3; attempt++) {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      signal,
      headers: { 'Content-Type': 'application/json', 'X-goog-api-key': apiKey },
      body: payload,
    })
    if (res.ok) break
    if (res.status === 503 || res.status === 429) {
      await new Promise((r) => setTimeout(r, 600 * (attempt + 1)))
      continue
    }
    break
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`gemini-${res.status}${detail ? `: ${detail.slice(0, 200)}` : ''}`)
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('empty-response')
  return JSON.parse(text)
}
