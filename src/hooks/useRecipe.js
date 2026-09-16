import { useState, useCallback } from 'react'

// Build a believable fallback recipe from whatever is expiring, so the demo
// never dead-ends if the proxy / network isn't available.
function fallbackRecipe(items) {
  const names = items.map((i) => i.name.replace(/\d+.*$/, '').trim())
  const has = (kw) => names.some((n) => n.toLowerCase().includes(kw))

  const pantryIngredients = items.map((i) => ({
    item: i.name,
    amount: i.quantity || '1',
    fromPantry: true,
  }))

  let name = 'Fridge-Rescue Frittata'
  let steps = [
    'Preheat the oven to 190°C. Whisk the eggs with a pinch of salt and pepper.',
    'Chop all the rescued veg and soft cheese into bite-size pieces.',
    'Soften the veg in an oven-proof pan with a little oil for 4–5 minutes.',
    'Pour over the eggs, scatter the cheese, and cook for 2 minutes on the hob.',
    'Transfer to the oven for 10–12 minutes until set and golden. Slice and serve.',
  ]
  let time = '25 mins'

  if (has('bread')) {
    name = 'Zero-Waste Veggie Strata'
    steps = [
      'Tear the bread into chunks and layer in an oiled baking dish.',
      'Whisk the eggs with the oat milk, salt and pepper.',
      'Fold in the chopped veg and grated cheese.',
      'Pour over the bread and press down so it soaks. Rest 10 minutes.',
      'Bake at 180°C for 25 minutes until puffed and golden.',
    ]
    time = '40 mins'
  } else if (has('tomato') && !has('egg')) {
    name = 'Rescued Tomato & Spinach Pasta'
    steps = [
      'Boil pasta until al dente, saving a cup of the cooking water.',
      'Halve the tomatoes and wilt with garlic and a splash of oil.',
      'Add the spinach and let it collapse into the sauce.',
      'Toss through the pasta with a little pasta water and the cheese.',
      'Season, finish with pepper, and serve hot.',
    ]
    time = '20 mins'
  }

  return {
    name,
    time,
    servings: 2,
    difficulty: 'Easy',
    ingredients: [
      ...pantryIngredients,
      { item: 'Olive oil', amount: '1 tbsp', fromPantry: false },
      { item: 'Salt & pepper', amount: 'to taste', fromPantry: false },
    ],
    steps,
    sustainabilityTip:
      'Freeze any leftovers in a labelled tub — a rescued meal reheated is a second win against food waste. 🌿',
    _fallback: true,
  }
}

// Calls our own serverless proxy (/api/recipe), which holds the Gemini key
// server-side. Never exposes any API key to the browser.
async function callRecipeProxy(items, signal) {
  const ingredients = items.map((i) => i.name)
  const res = await fetch('/api/recipe', {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients }),
  })
  if (!res.ok) throw new Error(`proxy-${res.status}`)
  return res.json()
}

export function useRecipe() {
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(false)
  const [usedFallback, setUsedFallback] = useState(false)

  const generate = useCallback(async (items) => {
    setLoading(true)
    setRecipe(null)
    setUsedFallback(false)
    const controller = new AbortController()
    // Keep the delightful "cooking" state visible for at least a beat.
    const minDelay = new Promise((r) => setTimeout(r, 1400))
    try {
      const [result] = await Promise.all([callRecipeProxy(items, controller.signal), minDelay])
      setRecipe(result)
    } catch {
      await minDelay
      setRecipe(fallbackRecipe(items))
      setUsedFallback(true)
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => setRecipe(null), [])

  return { recipe, loading, usedFallback, generate, reset }
}
