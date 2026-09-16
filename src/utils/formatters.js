export const fmtNumber = (n, digits = 0) =>
  Number(n).toLocaleString('en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits })

export const fmtPoints = (n) => Number(n).toLocaleString('en-GB')

export const fmtDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}

export const greeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

// tree equivalent — ~21kg CO2 absorbed per tree per year
export const treesFromCo2 = (kg) => Math.max(1, Math.round(kg / 21))
