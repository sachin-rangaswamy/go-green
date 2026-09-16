import { useEffect, useRef, useState } from 'react'

export default function AnimatedCounter({ value, decimals = 0, duration = 1000, className = '' }) {
  const [display, setDisplay] = useState(0)
  const startRef = useRef(null)
  const fromRef = useRef(0)

  useEffect(() => {
    let raf
    const from = fromRef.current
    const to = Number(value) || 0
    startRef.current = null
    const step = (ts) => {
      if (startRef.current === null) startRef.current = ts
      const p = Math.min(1, (ts - startRef.current) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(from + (to - from) * eased)
      if (p < 1) raf = requestAnimationFrame(step)
      else fromRef.current = to
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])

  return (
    <span className={className}>
      {display.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
    </span>
  )
}
