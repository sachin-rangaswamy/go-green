// Open Food Facts integration — turns a real barcode into our product shape.
// Nutri-Score (health) is used directly when present. The environmental grade
// (Eco/Green-Score) is often "unknown" in OFF, so we fall back to a transparent
// estimate computed from packaging, labels, category and carbon data.

const GRADE_TO_NUMERIC = { A: 90, B: 72, C: 55, D: 38, E: 18 }
const PALETTE = ['#4CAF50', '#265832', '#94755C', '#FF9800', '#26A69A', '#E5567A', '#1565C0', '#8BC34A']

const clampGrade = (g) => {
  const up = String(g || '').trim().toUpperCase()
  return ['A', 'B', 'C', 'D', 'E'].includes(up) ? up : null
}

const numericToGrade = (n) => (n >= 80 ? 'A' : n >= 60 ? 'B' : n >= 45 ? 'C' : n >= 30 ? 'D' : 'E')

const colorFor = (str) => PALETTE[[...String(str)].reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTE.length]

const CERT_MAP = {
  'en:organic': 'Organic',
  'en:eu-organic': 'EU Organic',
  'en:fairtrade': 'Fairtrade',
  'en:fairtrade-international': 'Fairtrade',
  'en:fair-trade': 'Fairtrade',
  'en:rainforest-alliance': 'Rainforest Alliance',
  'en:vegan': 'Vegan',
  'en:vegetarian': 'Vegetarian',
  'en:b-corporation': 'B Corp',
  'en:carbon-neutral': 'Carbon Neutral',
  'en:utz-certified': 'UTZ',
}

function readCertifications(labels = []) {
  const out = []
  for (const l of labels) if (CERT_MAP[l] && !out.includes(CERT_MAP[l])) out.push(CERT_MAP[l])
  return out
}

// --- Packaging heuristic -------------------------------------------------
const RECYCLABLE = ['glass', 'aluminium', 'aluminum', 'steel', 'metal', 'cardboard', 'paper', 'carton']
const NON_RECYCLABLE = ['plastic', 'pvc', 'polystyrene', 'composite', 'film']

function readPackaging(product) {
  const mats = (product.packagings || []).map((p) => (p.material || '').replace(/^en:/, '')).filter(Boolean)
  const label = mats.length ? mats.join(', ').replace(/-/g, ' ') : product.packaging || 'Not specified'
  const lower = label.toLowerCase()
  const recyclable =
    RECYCLABLE.some((m) => lower.includes(m)) && !NON_RECYCLABLE.some((m) => lower.includes(m))
  return { material: label.charAt(0).toUpperCase() + label.slice(1), recyclable, recycledContent: null }
}

// --- Eco estimate when OFF has no environmental grade --------------------
function estimateEcoNumeric(product, carbonKg, packaging, certifications) {
  let score = 60 // neutral baseline
  const cats = (product.categories_tags || []).join(' ')

  // Category carbon intensity
  if (/meat|beef|lamb|pork/.test(cats)) score -= 28
  else if (/cheese|dairy|butter/.test(cats)) score -= 14
  else if (/plant-based|vegan|legume|vegetable|fruit/.test(cats)) score += 16

  if (typeof carbonKg === 'number') {
    if (carbonKg > 3) score -= 18
    else if (carbonKg < 1) score += 12
  }

  score += packaging.recyclable ? 10 : -12
  if (certifications.some((c) => /Organic|Fairtrade|Rainforest|Carbon/.test(c))) score += 12

  return Math.max(8, Math.min(96, Math.round(score)))
}

// --- Water estimate (OFF doesn't expose this) ----------------------------
function estimateWater(product) {
  const cats = (product.categories_tags || []).join(' ')
  if (/beef|meat/.test(cats)) return { liters: 1500, categoryAvg: 1800 }
  if (/cheese|dairy|butter/.test(cats)) return { liters: 900, categoryAvg: 1100 }
  if (/chocolate/.test(cats)) return { liters: 1700, categoryAvg: 2400 }
  if (/plant-based|vegan/.test(cats)) return { liters: 90, categoryAvg: 450 }
  return { liters: null, categoryAvg: null }
}

export function mapOffProduct(product) {
  const name = product.product_name || product.generic_name || 'Unknown product'
  const brand = (product.brands || '').split(',')[0].trim() || 'Unknown brand'
  const category =
    (product.categories_tags || []).slice(-1)[0]?.replace(/^\w\w:/, '').replace(/-/g, ' ') || 'Food'

  const healthGrade = clampGrade(product.nutriscore_grade) || 'C'
  const healthNumeric =
    GRADE_TO_NUMERIC[clampGrade(product.nutriscore_grade)] ?? 50

  const certifications = readCertifications(product.labels_tags || [])
  const packaging = readPackaging(product)

  const agri = product.ecoscore_data?.agribalyse || {}
  const carbonKg = typeof agri.co2_total === 'number' ? Math.round(agri.co2_total * 100) / 100 : null

  // Real environmental grade if OFF computed one, else a transparent estimate.
  const realEco =
    clampGrade(product.environmental_score_grade) ||
    clampGrade(product.ecoscore_grade) ||
    clampGrade(product.ecoscore_data?.grade)
  const estimatedEco = !realEco
  const ecoNumeric = realEco
    ? GRADE_TO_NUMERIC[realEco]
    : estimateEcoNumeric(product, carbonKg, packaging, certifications)
  const ecoGrade = realEco || numericToGrade(ecoNumeric)

  const origin =
    product.countries?.split(',')[0]?.trim() ||
    (product.origins || '').replace(/^en:/, '') ||
    'Unknown origin'

  return {
    id: `off-${product.code || name}`,
    name,
    brand,
    category: category.charAt(0).toUpperCase() + category.slice(1),
    initial: (name[0] || '?').toUpperCase(),
    color: colorFor(name),
    image: product.image_front_small_url || product.image_front_url || null,
    price: null,
    healthScore: healthGrade,
    ecoScore: ecoGrade,
    healthScoreNumeric: healthNumeric,
    ecoScoreNumeric: ecoNumeric,
    packaging,
    carbon: { kgCO2: carbonKg, categoryAvg: carbonKg ? Math.round(carbonKg * 1.3 * 100) / 100 : null },
    distance: { km: null, origin },
    certifications,
    waterFootprint: estimateWater(product),
    betterAlternative: null,
    _source: 'off',
    _estimatedEco: estimatedEco,
  }
}

const FIELDS = [
  'code',
  'product_name',
  'generic_name',
  'brands',
  'categories_tags',
  'image_front_small_url',
  'image_front_url',
  'nutriscore_grade',
  'ecoscore_grade',
  'environmental_score_grade',
  'ecoscore_data',
  'labels_tags',
  'packagings',
  'packaging',
  'countries',
  'origins',
].join(',')

export async function lookupProduct(barcode, { signal } = {}) {
  const code = String(barcode).replace(/\D/g, '')
  if (!code) throw new Error('invalid-barcode')
  const url = `https://world.openfoodfacts.org/api/v2/product/${code}.json?fields=${FIELDS}`
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`off-${res.status}`)
  const data = await res.json()
  if (data.status !== 1 || !data.product) throw new Error('not-found')
  return mapOffProduct({ ...data.product, code })
}
