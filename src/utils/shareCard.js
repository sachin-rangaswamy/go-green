import { treesFromCo2 } from './formatters.js'

// Renders the user's impact to a 1080x1350 canvas and shares it (Web Share API
// with files) or downloads it as a fallback. Returns 'shared' | 'downloaded'.
export async function shareImpact(user) {
  const W = 1080
  const H = 1350
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  try {
    if (document.fonts?.ready) await document.fonts.ready
  } catch {
    /* ignore */
  }

  // Background gradient
  const g = ctx.createLinearGradient(0, 0, W, H)
  g.addColorStop(0, '#2e6b3c')
  g.addColorStop(1, '#12281a')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)

  // Soft globe accent
  ctx.globalAlpha = 0.08
  ctx.font = '520px serif'
  ctx.textAlign = 'center'
  ctx.fillText('🌍', W / 2, H - 120)
  ctx.globalAlpha = 1

  // Brand
  ctx.fillStyle = '#4CAF50'
  ctx.beginPath()
  ctx.arc(W / 2, 200, 66, 0, Math.PI * 2)
  ctx.fill()
  ctx.font = '72px sans-serif'
  ctx.fillText('🌿', W / 2, 224)

  ctx.fillStyle = '#ffffff'
  ctx.font = '800 84px Inter, sans-serif'
  ctx.fillText('Go Green', W / 2, 350)
  ctx.fillStyle = '#8BE28E'
  ctx.font = '600 34px Inter, sans-serif'
  ctx.fillText(`${user.name}'s green impact`, W / 2, 410)

  // Stat tiles
  const trees = treesFromCo2(user.co2Saved)
  const tiles = [
    { v: `${user.co2Saved}kg`, l: 'CO₂ saved' },
    { v: `${user.foodWastePrevented}kg`, l: 'Food waste cut' },
    { v: `${trees}`, l: 'Trees equivalent' },
    { v: `${user.streak}`, l: 'Day streak' },
  ]
  const cardW = 430
  const cardH = 240
  const gap = 40
  const startX = (W - cardW * 2 - gap) / 2
  const startY = 500
  tiles.forEach((t, i) => {
    const x = startX + (i % 2) * (cardW + gap)
    const y = startY + Math.floor(i / 2) * (cardH + gap)
    ctx.fillStyle = 'rgba(255,255,255,0.10)'
    roundRect(ctx, x, y, cardW, cardH, 32)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.font = '800 88px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(t.v, x + cardW / 2, y + 130)
    ctx.fillStyle = '#BED7C0'
    ctx.font = '600 34px Inter, sans-serif'
    ctx.fillText(t.l, x + cardW / 2, y + 185)
  })

  // Tagline + footer
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 40px Inter, sans-serif'
  ctx.fillText('Shop Smart. Waste Less. Live Green.', W / 2, 1230)
  ctx.fillStyle = '#8BE28E'
  ctx.font = '500 30px Inter, sans-serif'
  ctx.fillText('Join me on Go Green 🌿', W / 2, 1285)

  const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'))
  const file = new File([blob], 'go-green-impact.png', { type: 'image/png' })

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: 'My Go Green impact',
        text: `I've saved ${user.co2Saved}kg of CO₂ with Go Green! 🌿`,
      })
      return 'shared'
    } catch {
      /* user cancelled — fall through to download */
    }
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'go-green-impact.png'
  a.click()
  URL.revokeObjectURL(url)
  return 'downloaded'
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}
