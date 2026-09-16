// Lightweight haptic feedback. No-op on devices/browsers without vibration.
const PATTERNS = {
  light: 12,
  medium: 20,
  success: [12, 40, 24],
  celebrate: [16, 30, 16, 30, 40],
  warn: [30, 40, 30],
}

export function haptic(kind = 'light') {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(PATTERNS[kind] ?? PATTERNS.light)
    }
  } catch {
    /* ignore */
  }
}
