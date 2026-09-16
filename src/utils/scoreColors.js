export const SCORE_COLORS = {
  A: '#1B5E20',
  B: '#4CAF50',
  C: '#FFC107',
  D: '#FF9800',
  E: '#E53935',
}

export const scoreColor = (grade) => SCORE_COLORS[grade] || '#9E9E9E'

// Text color that reads well on the given grade background
export const scoreTextColor = (grade) => (grade === 'C' ? '#1A1A1A' : '#FFFFFF')

// Expiry urgency -> tailwind-ish color tokens
export const expiryColor = (days) => {
  if (days <= 1) return { text: 'text-alert', bg: 'bg-alert/10', ring: 'ring-alert', label: days <= 0 ? 'Today' : '1 day' }
  if (days <= 5) return { text: 'text-[#B26A00]', bg: 'bg-warn/15', ring: 'ring-warn', label: `${days} days` }
  return { text: 'text-forest', bg: 'bg-accent/10', ring: 'ring-accent', label: `${days} days` }
}
